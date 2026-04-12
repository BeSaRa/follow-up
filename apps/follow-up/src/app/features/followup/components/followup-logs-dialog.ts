import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import {
  DialogService,
  PageChangeEvent,
  UiBadge,
  UiButton,
  UiPagination,
  UiSkeleton,
  UiTable,
  UiTableBody,
  UiTableCell,
  UiTableHead,
  UiTableHeader,
  UiTableRow,
} from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { FollowupLog } from '../models/followup-log'
import {
  FollowupAddCommentDialog,
  FollowupAddCommentDialogData,
  FollowupAddCommentResult,
} from './followup-add-comment-dialog'

export interface FollowupLogsDialogData {
  followupId: number
  docSubject: string
  loadLogs: () => Observable<FollowupLog[]>
}

@Component({
  selector: 'app-followup-logs-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    TranslatePipe,
    MatIcon,
    UiBadge,
    UiButton,
    UiPagination,
    UiSkeleton,
    UiTable,
    UiTableBody,
    UiTableCell,
    UiTableHead,
    UiTableHeader,
    UiTableRow,
  ],
  template: `
    <div class="flex max-h-[85vh] w-[75rem] max-w-full flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <h2 class="truncate text-lg font-semibold text-foreground">
          {{ 'followup.logs_title' | translate }}: {{ docSubject() }}
        </h2>
        <div class="flex items-center gap-2">
          <button uiButton type="button" size="sm" (click)="openAddComment()">
            <mat-icon [svgIcon]="icons.PLUS" class="text-base! size-4! leading-4!" />
            {{ 'followup.add_comment' | translate }}
          </button>
          <button
            type="button"
            class="text-foreground-muted transition-colors hover:text-foreground"
            (click)="dialogRef.close()"
          >
            <mat-icon [svgIcon]="icons.CLOSE" class="text-xl! size-5! leading-5!" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="min-h-0 flex-1 overflow-auto">
        <table uiTable>
          <thead uiTableHeader>
            <tr uiTableRow>
              <th uiTableHead>{{ 'followup.log_action_time' | translate }}</th>
              <th uiTableHead>{{ 'followup.log_action_type' | translate }}</th>
              <th uiTableHead>{{ 'followup.log_user' | translate }}</th>
              <th uiTableHead>{{ 'followup.log_old_status' | translate }}</th>
              <th uiTableHead>{{ 'followup.log_new_status' | translate }}</th>
              <th uiTableHead>{{ 'followup.log_old_assignee' | translate }}</th>
              <th uiTableHead>{{ 'followup.log_new_assignee' | translate }}</th>
              <th uiTableHead>{{ 'followup.log_comments' | translate }}</th>
            </tr>
          </thead>
          <tbody uiTableBody>
            @for (log of pagedLogs(); track log.id) {
              <tr uiTableRow>
                <td uiTableCell>{{ log.actionTime | date: 'medium' }}</td>
                <td uiTableCell>{{ log.actionTypeInfo.getName() }}</td>
                <td uiTableCell>{{ log.userInfo.getName() }}</td>
                <td uiTableCell>
                  <ui-badge variant="outline" size="sm">
                    {{ log.oldFollowupStatusInfo.getName() }}
                  </ui-badge>
                </td>
                <td uiTableCell>
                  <ui-badge variant="outline-info" size="sm">
                    {{ log.newFollowupStatusInfo.getName() }}
                  </ui-badge>
                </td>
                <td uiTableCell>{{ log.oldAssignedUserInfo.getName() }}</td>
                <td uiTableCell>{{ log.newUserAssignedUserInfo.getName() }}</td>
                <td uiTableCell>{{ log.userComments }}</td>
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="8">
                  @if (loading()) {
                    <div class="space-y-4 px-4 py-4">
                      @for (i of skeletonRows; track i) {
                        <ui-skeleton width="100%" height="2rem" />
                      }
                    </div>
                  } @else {
                    <div class="flex flex-col items-center justify-center py-12 text-foreground-muted">
                      <p class="text-sm">{{ 'followup.logs_no_data' | translate }}</p>
                    </div>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Footer: pagination -->
      @if (logs().length) {
        <div class="border-t border-border">
          <ui-pagination
            [totalItems]="totalItems()"
            [pageSize]="pageSize()"
            [pageIndex]="pageIndex()"
            [rowsPerPageLabel]="'pagination.rows_per_page' | translate"
            [pageLabel]="'pagination.page' | translate"
            [ofLabel]="'pagination.of' | translate"
            [firstPageLabel]="'pagination.first_page' | translate"
            [previousPageLabel]="'pagination.previous_page' | translate"
            [nextPageLabel]="'pagination.next_page' | translate"
            [lastPageLabel]="'pagination.last_page' | translate"
            (pageChange)="onPageChange($event)"
          />
        </div>
      }
    </div>
  `,
})
export class FollowupLogsDialog implements OnInit {
  readonly dialogRef = inject<MatDialogRef<FollowupLogsDialog>>(MatDialogRef)
  private readonly data = inject<FollowupLogsDialogData>(MAT_DIALOG_DATA)
  private readonly dialogService = inject(DialogService)

  readonly icons = APP_ICONS
  readonly skeletonRows = Array.from({ length: 5 })
  readonly docSubject = signal(this.data.docSubject)

  readonly logs = signal<FollowupLog[]>([])
  readonly loading = signal(false)
  readonly pageIndex = signal(0)
  readonly pageSize = signal(10)

  readonly totalItems = computed(() => this.logs().length)
  readonly pagedLogs = computed(() => {
    const start = this.pageIndex() * this.pageSize()
    return this.logs().slice(start, start + this.pageSize())
  })

  ngOnInit(): void {
    this.fetchLogs()
  }

  onPageChange(event: PageChangeEvent): void {
    this.pageIndex.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  openAddComment(): void {
    this.dialogService
      .open<FollowupAddCommentDialog, FollowupAddCommentDialogData, FollowupAddCommentResult>(
        FollowupAddCommentDialog,
        {
          data: { followupId: this.data.followupId },
        },
      )
      .afterClosed()
      .subscribe((result) => {
        if (!result) return
        this.fetchLogs()
      })
  }

  private fetchLogs(): void {
    this.loading.set(true)
    this.data.loadLogs().subscribe({
      next: (logs) => {
        this.logs.set(logs)
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }
}
