import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import {
  PageChangeEvent,
  UiBadge,
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
import { Info } from '../../../shared/models/info'

export interface FollowupLogsDialogData {
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
        <button
          type="button"
          class="text-foreground-muted transition-colors hover:text-foreground"
          (click)="dialogRef.close()"
        >
          <mat-icon [svgIcon]="icons.CLOSE" class="text-xl! size-5! leading-5!" />
        </button>
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
    this.loading.set(true)
    // TODO: remove mock data once backend is ready
    setTimeout(() => {
      this.logs.set(this._generateMockLogs(27))
      this.loading.set(false)
    }, 400)
    // this.data.loadLogs().subscribe({
    //   next: (logs) => {
    //     this.logs.set(logs)
    //     this.loading.set(false)
    //   },
    //   error: () => this.loading.set(false),
    // })
  }

  onPageChange(event: PageChangeEvent): void {
    this.pageIndex.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  // TODO: remove along with the setTimeout block above
  private _generateMockLogs(count: number): FollowupLog[] {
    const actionTypes = [
      { ar: 'إنشاء', en: 'Created' },
      { ar: 'تحديث الحالة', en: 'Status Update' },
      { ar: 'إعادة تعيين', en: 'Reassigned' },
      { ar: 'تعديل الموعد', en: 'Due Date Changed' },
      { ar: 'إضافة مرفق', en: 'Attachment Added' },
      { ar: 'تعليق', en: 'Comment Added' },
    ]
    const statuses = [
      { ar: 'جديد', en: 'New' },
      { ar: 'قيد المعالجة', en: 'In Progress' },
      { ar: 'بانتظار الرد', en: 'Awaiting Reply' },
      { ar: 'مكتمل', en: 'Completed' },
      { ar: 'مؤجل', en: 'Deferred' },
    ]
    const users = [
      { ar: 'أحمد علي', en: 'Ahmed Ali' },
      { ar: 'سارة يوسف', en: 'Sara Youssef' },
      { ar: 'محمد خالد', en: 'Mohamed Khaled' },
      { ar: 'فاطمة حسن', en: 'Fatima Hassan' },
      { ar: 'علي إبراهيم', en: 'Ali Ibrahim' },
    ]
    const comments = [
      'Initial follow-up created and assigned.',
      'Awaiting response from external entity.',
      'Status updated after meeting with stakeholders.',
      'Reassigned to a different officer for review.',
      'Due date extended per managerial approval.',
      'Comment added for internal tracking.',
      '',
    ]

    const buildInfo = (id: number, data: { ar: string; en: string }): Info => {
      const info = new Info()
      info.id = id
      info.arName = data.ar
      info.enName = data.en
      return info
    }

    const baseTime = Date.now()
    return Array.from({ length: count }, (_, index) => {
      const log = new FollowupLog()
      const actionType = actionTypes[index % actionTypes.length]
      const oldStatus = statuses[index % statuses.length]
      const newStatus = statuses[(index + 1) % statuses.length]
      const user = users[index % users.length]
      const oldAssignee = users[(index + 2) % users.length]
      const newAssignee = users[(index + 3) % users.length]

      log.id = index + 1
      log.followupId = 1
      log.userInfo = buildInfo(index + 100, user)
      log.actionTypeInfo = buildInfo((index % actionTypes.length) + 1, actionType)
      log.oldFollowupStatusInfo = buildInfo((index % statuses.length) + 1, oldStatus)
      log.newFollowupStatusInfo = buildInfo(((index + 1) % statuses.length) + 1, newStatus)
      log.oldAssignedUserInfo = buildInfo(index + 200, oldAssignee)
      log.newUserAssignedUserInfo = buildInfo(index + 300, newAssignee)
      log.userComments = comments[index % comments.length]
      log.actionTime = new Date(baseTime - index * 3_600_000).toISOString()
      log.oldDueDate = new Date(baseTime + 86_400_000 * 3).toISOString().slice(0, 10)
      log.newOldDueDate = new Date(baseTime + 86_400_000 * 7).toISOString().slice(0, 10)
      log.updatedOn = new Date(baseTime - index * 3_600_000).toISOString()
      return log
    })
  }
}
