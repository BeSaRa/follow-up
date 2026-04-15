import { DatePipe, NgTemplateOutlet } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { TranslatePipe } from '@ngx-translate/core'
import { Observable, of, tap } from 'rxjs'
import { DialogService, UiBadge, UiButton, UiSkeleton, UiTooltip } from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { AttachmentViewerDialog } from './attachment-viewer-dialog'
import { FollowupAttachment } from '../models/followup-attachment'
import { FollowupOpen } from '../models/followup-open'
import { FollowupService } from '../services/followup.service'

export interface FollowupOpenDialogData {
  docSubject: string
  loadFollowup: () => Observable<FollowupOpen>
  followupId: number
  canTerminate: boolean
  currentStatusId?: number
}

export interface FollowupOpenDialogResult {
  terminated?: boolean
  statusChanged?: boolean
}

type ActiveTab = 'details' | 'followup' | 'linked' | 'guidance'

@Component({
  selector: 'app-followup-open-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgTemplateOutlet,
    TranslatePipe,
    MatIcon,
    UiBadge,
    UiButton,
    UiSkeleton,
    UiTooltip,
  ],
  styles: [
    `
      @keyframes sidebar-slide-in-ltr {
        from {
          transform: translateX(-100%);
          margin-inline-end: -28rem;
          opacity: 0;
        }
        to {
          transform: translateX(0);
          margin-inline-end: 0;
          opacity: 1;
        }
      }

      @keyframes sidebar-slide-in-rtl {
        from {
          transform: translateX(100%);
          margin-inline-end: -28rem;
          opacity: 0;
        }
        to {
          transform: translateX(0);
          margin-inline-end: 0;
          opacity: 1;
        }
      }

      .sidebar-enter {
        animation: sidebar-slide-in-ltr 280ms ease-out;
      }

      .sidebar-enter:dir(rtl) {
        animation-name: sidebar-slide-in-rtl;
      }

      .sidebar-leave {
        transition:
          transform 280ms ease-in,
          margin-inline-end 280ms ease-in,
          opacity 280ms ease-in;
        transform: translateX(-100%);
        margin-inline-end: -28rem;
        opacity: 0;
      }

      .sidebar-leave:dir(rtl) {
        transform: translateX(100%);
      }
    `,
  ],
  template: `
    <div class="flex h-full w-full flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div class="flex min-w-0 items-center gap-3">
          <button
            type="button"
            class="text-foreground-muted transition-colors hover:text-foreground"
            [attr.aria-label]="'layout.toggle_sidebar' | translate"
            [attr.aria-expanded]="sidebarOpen()"
            (click)="toggleSidebar()"
          >
            <mat-icon [svgIcon]="icons.MENU" class="text-xl! size-5! leading-5!" />
          </button>
          <h2 class="truncate text-lg font-semibold text-foreground">
            {{ 'followup.open_title' | translate }}: {{ docSubject() }}
          </h2>
        </div>
        <button
          type="button"
          class="text-foreground-muted transition-colors hover:text-foreground"
          (click)="dialogRef.close()"
        >
          <mat-icon [svgIcon]="icons.CLOSE" class="text-xl! size-5! leading-5!" />
        </button>
      </div>

      <!-- Body: 2 panes (sidebar first so the viewer ends up on the right in LTR / left in RTL) -->
      <div class="flex min-h-0 flex-1">
        <!-- Sidebar -->
        @if (sidebarOpen()) {
        <div
          class="flex w-[28rem] shrink-0 flex-col border-e border-border"
          animate.enter="sidebar-enter"
          animate.leave="sidebar-leave"
        >
          <!-- Tabs -->
          <div class="flex border-b border-border">
            <button
              type="button"
              class="relative min-w-0 flex-1 border-b-2 px-3 py-3 text-xs font-medium transition-colors"
              [class.border-primary]="activeTab() === 'details'"
              [class.text-primary]="activeTab() === 'details'"
              [class.border-transparent]="activeTab() !== 'details'"
              [class.text-foreground-muted]="activeTab() !== 'details'"
              (click)="activeTab.set('details')"
            >
              <span class="block truncate">{{ 'followup.tab_details' | translate }}</span>
            </button>
            <button
              type="button"
              class="relative min-w-0 flex-1 border-b-2 px-3 py-3 text-xs font-medium transition-colors"
              [class.border-primary]="activeTab() === 'followup'"
              [class.text-primary]="activeTab() === 'followup'"
              [class.border-transparent]="activeTab() !== 'followup'"
              [class.text-foreground-muted]="activeTab() !== 'followup'"
              (click)="activeTab.set('followup')"
            >
              <span class="block truncate">{{ 'followup.tab_followup_attachments' | translate }}</span>
              <span
                class="absolute -top-1 end-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
              >
                {{ followupAttachments().length }}
              </span>
            </button>
            <button
              type="button"
              class="relative min-w-0 flex-1 border-b-2 px-3 py-3 text-xs font-medium transition-colors"
              [class.border-primary]="activeTab() === 'linked'"
              [class.text-primary]="activeTab() === 'linked'"
              [class.border-transparent]="activeTab() !== 'linked'"
              [class.text-foreground-muted]="activeTab() !== 'linked'"
              (click)="activeTab.set('linked')"
            >
              <span class="block truncate">{{ 'followup.tab_linked_attachments' | translate }}</span>
              <span
                class="absolute -top-1 end-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
              >
                {{ linkedAttachments().length }}
              </span>
            </button>
            <button
              type="button"
              class="relative min-w-0 flex-1 border-b-2 px-3 py-3 text-xs font-medium transition-colors"
              [class.border-primary]="activeTab() === 'guidance'"
              [class.text-primary]="activeTab() === 'guidance'"
              [class.border-transparent]="activeTab() !== 'guidance'"
              [class.text-foreground-muted]="activeTab() !== 'guidance'"
              (click)="activeTab.set('guidance')"
            >
              <span class="block truncate">{{ 'followup.tab_guidance_attachments' | translate }}</span>
              <span
                class="absolute -top-1 end-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
              >
                {{ guidanceAttachments().length }}
              </span>
            </button>
          </div>

          <!-- Tab content -->
          <div class="min-h-0 flex-1 overflow-auto p-4">
            @if (loading()) {
              <div class="space-y-3">
                @for (i of skeletonRows; track i) {
                  <ui-skeleton width="100%" height="2rem" />
                }
              </div>
            } @else if (followup(); as f) {
              @switch (activeTab()) {
                @case ('details') {
                  <div class="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div class="col-span-2">
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_subject' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.docSubject || '—' }}</div>
                    </div>

                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_full_serial' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.docFullSerial || '—' }}</div>
                    </div>
                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_doc_date' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.docDate | date: 'mediumDate' }}</div>
                    </div>

                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_classification' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.mainClassificationInfo.getName() || '—' }}</div>
                    </div>
                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_sub_classification' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.subClassificationInfo.getName() || '—' }}</div>
                    </div>

                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_creator' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.creatorInfo.getName() || '—' }}</div>
                    </div>
                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_creator_ou' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.creatorOuInfo.getName() || '—' }}</div>
                    </div>

                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_priority' | translate }}
                      </div>
                      <div class="text-sm">
                        <ui-badge variant="outline-warning" size="sm">
                          {{ f.metaData.priorityLevelInfo.getName() || '—' }}
                        </ui-badge>
                      </div>
                    </div>
                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_doc_status' | translate }}
                      </div>
                      <div class="text-sm">
                        <ui-badge variant="outline-info" size="sm">
                          {{ f.metaData.docStatusInfo.getName() || '—' }}
                        </ui-badge>
                      </div>
                    </div>

                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_security_level' | translate }}
                      </div>
                      <div class="text-sm">
                        <ui-badge variant="outline-error" size="sm">
                          {{ f.metaData.securityLevelInfo.getName() || '—' }}
                        </ui-badge>
                      </div>
                    </div>
                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_doc_type' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.docTypeInfo.getName() || '—' }}</div>
                    </div>

                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_ref_number' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.refDocNumber || '—' }}</div>
                    </div>
                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_ref_date' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.refDocDate | date: 'mediumDate' }}</div>
                    </div>

                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_followup_end' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.followupEndDate | date: 'mediumDate' }}</div>
                    </div>
                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_received_by' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.metaData.receivedByInfo.getName() || '—' }}</div>
                    </div>

                    <div>
                      <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                        {{ 'followup.field_sites_count' | translate }}
                      </div>
                      <div class="text-sm text-foreground">{{ f.sitesCount }}</div>
                    </div>

                    @if (f.metaData.docNotes) {
                      <div class="col-span-2">
                        <div class="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                          {{ 'followup.field_doc_notes' | translate }}
                        </div>
                        <div class="text-sm text-foreground">{{ f.metaData.docNotes }}</div>
                      </div>
                    }
                  </div>
                }

                @case ('followup') {
                  <ng-container *ngTemplateOutlet="attachmentList; context: { items: f.followupAttachments }" />
                }
                @case ('linked') {
                  <ng-container *ngTemplateOutlet="attachmentList; context: { items: f.linkedAttachments }" />
                }
                @case ('guidance') {
                  <ng-container *ngTemplateOutlet="attachmentList; context: { items: f.guidanceAttachments }" />
                }
              }
            }
          </div>
        </div>
        }

        <!-- Document viewer -->
        <div class="flex-1 overflow-auto bg-surface-subtle">
          @if (loading()) {
            <div class="space-y-4 p-4">
              <ui-skeleton width="100%" height="400px" />
              <ui-skeleton width="100%" height="400px" />
            </div>
          } @else if (documentUrl(); as url) {
            <div class="flex h-full flex-col">
              @if (viewingAttachment(); as att) {
                <div class="flex items-center justify-between gap-3 border-b border-border bg-surface-raised px-4 py-2">
                  <div class="flex min-w-0 items-center gap-2">
                    <mat-icon [svgIcon]="icons.PAPERCLIP" class="text-base! size-4! leading-4! shrink-0 text-primary" />
                    <span class="truncate text-sm font-medium text-foreground">{{ att.documentTitle || att.docSubject }}</span>
                    <span class="shrink-0 text-xs text-foreground-muted">{{ att.attachmentTypeInfo.getName() }}</span>
                  </div>
                  <button
                    type="button"
                    class="shrink-0 rounded px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    (click)="backToMainDocument()"
                  >
                    {{ 'followup.back_to_document' | translate }}
                  </button>
                </div>
              }
              <iframe
                class="h-full w-full flex-1 bg-white"
                [src]="url"
                title="Document preview"
              ></iframe>
            </div>
          } @else {
            <div class="flex h-full items-center justify-center text-foreground-muted">
              {{ 'followup.no_document' | translate }}
            </div>
          }
        </div>
      </div>

      <!-- Footer -->
      @if (canTerminate) {
        <div class="flex items-center justify-end gap-3 border-t border-border px-6 py-3">
          <button uiButton type="button" variant="secondary" (click)="changeStatus()">
            {{ 'followup.change_status' | translate }}
          </button>
          <button uiButton type="button" variant="destructive" (click)="terminate()">
            {{ 'followup.terminate' | translate }}
          </button>
        </div>
      }
    </div>

    <ng-template #attachmentList let-items="items">
      @if (items.length) {
        <div class="space-y-3">
          @for (att of items; track att.vsId) {
            <div
              class="rounded-md border p-3 transition-colors hover:bg-surface-hover"
              [class.border-primary]="viewingAttachment()?.vsId === att.vsId"
              [class.bg-primary/5]="viewingAttachment()?.vsId === att.vsId"
              [class.border-border]="viewingAttachment()?.vsId !== att.vsId"
              [class.bg-surface-raised]="viewingAttachment()?.vsId !== att.vsId"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <button
                    class="cursor-pointer text-sm font-medium text-primary hover:underline"
                    [class.opacity-50]="loadingAttachment() === att.vsId"
                    [disabled]="loadingAttachment() === att.vsId"
                    (click)="viewAttachmentInViewer(att)"
                  >{{ att.documentTitle || att.docSubject }}</button>
                  <div class="mt-1 text-xs text-foreground-muted">
                    {{ att.attachmentTypeInfo.getName() }}
                  </div>
                </div>
                <div class="flex shrink-0 items-center gap-1">
                  @if (loadingAttachment() === att.vsId) {
                    <div class="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  }
                  <button
                    type="button"
                    class="rounded p-1 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                    [attr.aria-label]="'followup.open_in_dialog' | translate"
                    [uiTooltip]="'followup.open_in_dialog' | translate"
                    [disabled]="loadingAttachment() === att.vsId"
                    (click)="openAttachmentInDialog(att)"
                  >
                    <mat-icon [svgIcon]="icons.OPEN_IN_NEW" class="text-base! size-4! leading-4!" />
                  </button>
                </div>
              </div>
              <div class="mt-2 flex flex-wrap items-center gap-1">
                @if (att.isOfficial) {
                  <ui-badge variant="outline-success" size="sm">
                    {{ 'followup.official' | translate }}
                  </ui-badge>
                }
                @if (att.isContract) {
                  <ui-badge variant="outline-info" size="sm">
                    {{ 'followup.contract' | translate }}
                  </ui-badge>
                }
                @if (att.isAnnotation) {
                  <ui-badge variant="outline-warning" size="sm">
                    {{ 'followup.annotation' | translate }}
                  </ui-badge>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="flex h-full items-center justify-center py-8 text-sm text-foreground-muted">
          {{ 'followup.no_attachments' | translate }}
        </div>
      }
    </ng-template>
  `,
})
export class FollowupOpenDialog implements OnInit {
  readonly dialogRef = inject<MatDialogRef<FollowupOpenDialog, FollowupOpenDialogResult>>(MatDialogRef)
  private readonly data = inject<FollowupOpenDialogData>(MAT_DIALOG_DATA)
  private readonly sanitizer = inject(DomSanitizer)
  private readonly followupService = inject(FollowupService)
  private readonly dialogService = inject(DialogService)

  readonly icons = APP_ICONS
  readonly skeletonRows = Array.from({ length: 8 }, (_v, i) => i)

  readonly canTerminate = this.data.canTerminate
  readonly followupId = this.data.followupId
  readonly currentStatusId = this.data.currentStatusId

  readonly docSubject = signal(this.data.docSubject)
  readonly followup = signal<FollowupOpen | null>(null)
  readonly loading = signal(false)
  readonly activeTab = signal<ActiveTab>('details')
  readonly sidebarOpen = signal(true)

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open)
  }

  private readonly overrideContent = signal<string | null>(null)
  readonly viewingAttachment = signal<FollowupAttachment | null>(null)
  readonly loadingAttachment = signal<string | null>(null)

  readonly documentUrl = computed<SafeResourceUrl | null>(() => {
    const override = this.overrideContent()
    if (override) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `data:application/pdf;base64,${override}`,
      )
    }
    const f = this.followup()
    if (!f || !f.content) return null
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:application/pdf;base64,${f.content}`,
    )
  })

  readonly followupAttachments = computed(
    () => this.followup()?.followupAttachments ?? [],
  )
  readonly linkedAttachments = computed(
    () => this.followup()?.linkedAttachments ?? [],
  )
  readonly guidanceAttachments = computed(
    () => this.followup()?.guidanceAttachments ?? [],
  )

  private readonly attachmentCache = new Map<string, string>()

  private getAttachmentContent(vsId: string): Observable<string> {
    const cached = this.attachmentCache.get(vsId)
    if (cached) {
      return of(cached)
    }
    return this.followupService
      .getAttachmentById(vsId)
      .pipe(tap((content) => this.attachmentCache.set(vsId, content)))
  }

  viewAttachmentInViewer(att: FollowupAttachment): void {
    this.loadingAttachment.set(att.vsId)
    this.getAttachmentContent(att.vsId).subscribe((content) => {
      this.overrideContent.set(content)
      this.viewingAttachment.set(att)
      this.loadingAttachment.set(null)
    })
  }

  backToMainDocument(): void {
    this.overrideContent.set(null)
    this.viewingAttachment.set(null)
  }

  openAttachmentInDialog(att: FollowupAttachment): void {
    this.loadingAttachment.set(att.vsId)
    this.getAttachmentContent(att.vsId).subscribe((content) => {
      this.loadingAttachment.set(null)
      this.dialogService.open(AttachmentViewerDialog, {
        data: {
          title: att.documentTitle || att.docSubject,
          type: att.attachmentTypeInfo.getName(),
          content,
        },
        width: '80rem',
        maxWidth: '95vw',
      })
    })
  }

  changeStatus(): void {
    this.followupService
      .openChangeStatus(this.followupId, this.currentStatusId)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dialogRef.close({ statusChanged: true })
        }
      })
  }

  terminate(): void {
    this.followupService
      .openTerminate(this.followupId)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dialogRef.close({ terminated: true })
        }
      })
  }

  ngOnInit(): void {
    this.loading.set(true)
    this.data.loadFollowup().subscribe({
      next: (followup) => {
        this.followup.set(followup)
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }
}
