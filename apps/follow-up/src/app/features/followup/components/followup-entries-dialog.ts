import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import { forkJoin, Observable, timer } from 'rxjs'
import {
  DialogService,
  UiButton,
  UiSkeleton,
  UiSpinner,
  UiTimeline,
  UiTimelineConnector,
  UiTimelineContent,
  UiTimelineDot,
  UiTimelineItem,
} from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { FollowupEntry } from '../models/followup-entry'
import { FollowupService } from '../services/followup.service'
import { AttachmentViewerDialog, AttachmentViewerDialogData } from './attachment-viewer-dialog'

export interface FollowupEntriesDialogData<T extends FollowupEntry> {
  titleKey: string
  emptyKey: string
  addLabelKey: string
  docSubject: string
  loadEntries: () => Observable<T[]>
  getText: (entry: T) => string
  openAdd: () => MatDialogRef<unknown, unknown>
}

@Component({
  selector: 'app-followup-entries-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    TranslatePipe,
    MatIcon,
    UiButton,
    UiSkeleton,
    UiSpinner,
    UiTimeline,
    UiTimelineConnector,
    UiTimelineContent,
    UiTimelineDot,
    UiTimelineItem,
  ],
  template: `
    <div class="flex max-h-[85vh] w-[48rem] max-w-full flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <h2 class="truncate text-lg font-semibold text-foreground">
          {{ data.titleKey | translate }}
        </h2>
        <button
          type="button"
          class="text-foreground-muted transition-colors hover:text-foreground"
          (click)="dialogRef.close()"
        >
          <mat-icon [svgIcon]="icons.CLOSE" class="text-xl! size-5! leading-5!" />
        </button>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center gap-3 border-b border-border px-6 py-3">
        <span class="min-w-0 flex-1 truncate text-sm text-foreground-muted" [title]="data.docSubject">
          {{ data.docSubject }}
        </span>
        <button
          type="button"
          class="inline-flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-border hover:text-foreground disabled:opacity-50"
          [disabled]="loading()"
          [attr.aria-label]="'common.reload' | translate"
          [title]="'common.reload' | translate"
          (click)="fetchEntries()"
        >
          <mat-icon [svgIcon]="icons.REFRESH" class="text-lg! size-5! leading-5!" />
        </button>
        <button uiButton type="button" size="sm" (click)="add()">
          <mat-icon [svgIcon]="icons.PLUS" class="text-base! size-4! leading-4!" />
          {{ data.addLabelKey | translate }}
        </button>
      </div>

      <!-- Body -->
      <div class="min-h-0 flex-1 overflow-auto px-6 py-5">
        @if (loading()) {
          <div class="space-y-4">
            @for (i of skeletonRows; track i) {
              <ui-skeleton width="100%" height="4rem" />
            }
          </div>
        } @else if (entries().length === 0) {
          <div class="flex flex-col items-center justify-center py-12 text-foreground-muted">
            <p class="text-sm">{{ data.emptyKey | translate }}</p>
          </div>
        } @else {
          <ui-timeline>
            @for (entry of entries(); track entry.id; let last = $last) {
              <ui-timeline-item [status]="last ? 'active' : 'completed'">
                <ui-timeline-dot [status]="last ? 'active' : 'completed'" />
                @if (!last) {
                  <ui-timeline-connector [active]="true" />
                }
                <ui-timeline-content>
                  <div class="relative flex flex-col gap-2 rounded-md border border-border bg-background px-4 py-3">
                    @if (entry.attachmentVSID) {
                      <button
                        type="button"
                        class="absolute end-2 top-2 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-border hover:text-foreground disabled:opacity-50"
                        [disabled]="loadingVsId() === entry.attachmentVSID"
                        [attr.aria-label]="'followup.view_attachment' | translate"
                        [title]="'followup.view_attachment' | translate"
                        (click)="openAttachment(entry)"
                      >
                        @if (loadingVsId() === entry.attachmentVSID) {
                          <ui-spinner size="sm" />
                        } @else {
                          <mat-icon
                            [svgIcon]="icons.PAPERCLIP"
                            class="text-base! size-4! leading-4!"
                          />
                        }
                      </button>
                    }
                    <p class="whitespace-pre-wrap pe-8 text-sm text-foreground">{{ getText(entry) }}</p>
                    <div class="text-xs text-foreground-muted">
                      <span>{{ entry.userInfo.getName() }}</span>
                      <span class="mx-1">·</span>
                      <time>{{ entry.actionTime | date: 'medium' }}</time>
                    </div>
                  </div>
                </ui-timeline-content>
              </ui-timeline-item>
            }
          </ui-timeline>
        }
      </div>
    </div>
  `,
})
export class FollowupEntriesDialog<T extends FollowupEntry> implements OnInit {
  readonly dialogRef = inject<MatDialogRef<FollowupEntriesDialog<T>>>(MatDialogRef)
  readonly data = inject<FollowupEntriesDialogData<T>>(MAT_DIALOG_DATA)

  readonly icons = APP_ICONS
  readonly skeletonRows = Array.from({ length: 4 })

  private readonly followupService = inject(FollowupService)
  private readonly dialogService = inject(DialogService)

  readonly entries = signal<T[]>([])
  readonly loading = signal(false)
  readonly loadingVsId = signal<string | null>(null)

  getText(entry: T): string {
    return this.data.getText(entry)
  }

  add(): void {
    this.data
      .openAdd()
      .afterClosed()
      .subscribe((result) => {
        if (!result) return
        this.fetchEntries()
      })
  }

  openAttachment(entry: T): void {
    const vsId = entry.attachmentVSID
    if (!vsId || this.loadingVsId() === vsId) return
    this.loadingVsId.set(vsId)
    this.followupService.getAttachmentContent(vsId).subscribe({
      next: (content) => {
        this.loadingVsId.set(null)
        this.dialogService.open<AttachmentViewerDialog, AttachmentViewerDialogData>(
          AttachmentViewerDialog,
          {
            data: {
              title: this.getText(entry) || this.data.docSubject,
              type: '',
              content,
            },
            width: '80rem',
            maxWidth: '95vw',
          },
        )
      },
      error: () => this.loadingVsId.set(null),
    })
  }

  ngOnInit(): void {
    this.fetchEntries()
  }

  fetchEntries(): void {
    this.loading.set(true)
    this.entries.set([])
    forkJoin({
      entries: this.data.loadEntries(),
      _: timer(1000),
    }).subscribe({
      next: ({ entries }) => {
        this.entries.set(entries)
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }
}
