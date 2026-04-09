import { DatePipe, NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { TranslatePipe } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { UiBadge, UiSkeleton } from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { Info } from '../../../shared/models/info'
import { FollowupAttachment } from '../models/followup-attachment'
import { FollowupMetaData } from '../models/followup-meta-data'
import { FollowupOpen } from '../models/followup-open'
import { FollowupSiteInfo } from '../models/followup-site-info'

export interface FollowupOpenDialogData {
  docSubject: string
  loadFollowup: () => Observable<FollowupOpen>
}

type ActiveTab = 'details' | 'followup' | 'linked' | 'guidance'

@Component({
  selector: 'app-followup-open-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, NgTemplateOutlet, TranslatePipe, MatIcon, UiBadge, UiSkeleton],
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
    <div class="flex h-[85vh] w-[80rem] max-w-full flex-col">
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
        <div class="flex-1 overflow-auto bg-surface-subtle p-6">
          @if (loading()) {
            <div class="space-y-4">
              <ui-skeleton width="100%" height="400px" />
              <ui-skeleton width="100%" height="400px" />
            </div>
          } @else if (pages().length) {
            <div class="flex flex-col items-center gap-6">
              @for (page of pages(); track $index) {
                <img
                  class="w-full max-w-[800px] rounded-sm bg-white shadow-md"
                  [src]="page"
                  [alt]="'Document page ' + ($index + 1)"
                />
              }
            </div>
          } @else {
            <div class="flex h-full items-center justify-center text-foreground-muted">
              {{ 'followup.no_document' | translate }}
            </div>
          }
        </div>
      </div>
    </div>

    <ng-template #attachmentList let-items="items">
      @if (items.length) {
        <div class="space-y-3">
          @for (att of items; track att.vsId) {
            <div class="rounded-md border border-border bg-surface-raised p-3">
              <div class="text-sm font-medium text-foreground">{{ att.documentTitle || att.docSubject }}</div>
              <div class="mt-1 text-xs text-foreground-muted">
                {{ att.attachmentTypeInfo.getName() }}
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
  readonly dialogRef = inject<MatDialogRef<FollowupOpenDialog>>(MatDialogRef)
  private readonly data = inject<FollowupOpenDialogData>(MAT_DIALOG_DATA)
  private readonly sanitizer = inject(DomSanitizer)

  readonly icons = APP_ICONS
  readonly skeletonRows = Array.from({ length: 8 })

  readonly docSubject = signal(this.data.docSubject)
  readonly followup = signal<FollowupOpen | null>(null)
  readonly loading = signal(false)
  readonly activeTab = signal<ActiveTab>('details')
  readonly sidebarOpen = signal(true)

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open)
  }

  readonly pages = computed<SafeResourceUrl[]>(() => {
    const f = this.followup()
    if (!f) return []
    return f.content.map((base64) =>
      this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${base64}`),
    )
  })

  readonly followupAttachments = computed(() => this.followup()?.followupAttachments ?? [])
  readonly linkedAttachments = computed(() => this.followup()?.linkedAttachments ?? [])
  readonly guidanceAttachments = computed(() => this.followup()?.guidanceAttachments ?? [])

  ngOnInit(): void {
    this.loading.set(true)
    // TODO: remove mock data once backend is stable
    setTimeout(() => {
      this.followup.set(this._generateMockFollowupOpen(this.data.docSubject))
      this.loading.set(false)
    }, 400)
    // this.data.loadFollowup().subscribe({
    //   next: (followup) => {
    //     this.followup.set(followup)
    //     this.loading.set(false)
    //   },
    //   error: () => this.loading.set(false),
    // })
  }

  // ───────────────────────────────────────────────
  // TODO: remove the mock helpers below when the API is wired up
  // ───────────────────────────────────────────────

  private _generateMockFollowupOpen(subject: string): FollowupOpen {
    const mock = new FollowupOpen()
    mock.content = [this._mockPage(1, subject), this._mockPage(2, subject)]
    mock.linkedAttachments = [
      this._mockAttachment('REF-2026-018', 'Reference Letter', 'Reference', { official: true }),
      this._mockAttachment('REF-2026-022', 'Supporting Memo', 'Memo', { official: true, annotation: true }),
    ]
    mock.followupAttachments = [
      this._mockAttachment('FU-2026-001', 'Initial Reply Draft', 'Letter', { official: true }),
      this._mockAttachment('FU-2026-002', 'Stakeholder Notes', 'Note', { annotation: true }),
      this._mockAttachment('FU-2026-003', 'Service Agreement', 'Agreement', { contract: true, official: true }),
    ]
    mock.guidanceAttachments = [
      this._mockAttachment('GD-2026-001', 'Guidance Note from PMO', 'Note', { annotation: true }),
    ]
    mock.metaData = this._mockMetaData(subject)
    mock.sitesCount = 4
    return mock
  }

  private _mockMetaData(subject: string): FollowupMetaData {
    const md = new FollowupMetaData()
    md.docSubject = subject
    md.vsId = 'VS-2026-04-09-0001'
    md.docFullSerial = 'COR-2026-000147'
    md.docNotes = 'Mock data — replace once the backend response is verified.'
    md.docSerial = 147
    md.docStatus = 2
    md.docDate = new Date().toISOString()
    md.refDocDate = new Date(Date.now() - 86_400_000 * 5).toISOString()
    md.refDocNumber = 'REF-2026-093'
    md.refDocNumberSerial = 'REF-2026-093/A'
    md.followupEndDate = new Date(Date.now() + 86_400_000 * 14).toISOString()
    md.maxApproveDate = new Date(Date.now() + 86_400_000 * 30).toISOString()
    md.followupDate = 0
    md.originality = 1
    md.authorizeByAnnotation = false
    md.transfered = false

    md.documentFileInfo = this._buildInfo(1, 'ملف PDF', 'PDF File')
    md.mainClassificationInfo = this._buildInfo(11, 'مراسلات إدارية', 'Administrative Correspondence')
    md.subClassificationInfo = this._buildInfo(112, 'متابعة عامة', 'General Follow-up')
    md.creatorOuInfo = this._buildInfo(21, 'إدارة العمليات', 'Operations Department')
    md.creatorInfo = this._buildInfo(301, 'أحمد علي', 'Ahmed Ali')
    md.lastModifierInfo = this._buildInfo(302, 'سارة يوسف', 'Sara Youssef')
    md.securityLevelInfo = this._buildInfo(3, 'سري', 'Confidential')
    md.priorityLevelInfo = this._buildInfo(2, 'مرتفعة', 'High')
    md.docTypeInfo = this._buildInfo(5, 'خطاب', 'Letter')
    md.docStatusInfo = this._buildInfo(2, 'قيد المعالجة', 'In Progress')
    md.receivedByInfo = this._buildInfo(401, 'محمد خالد', 'Mohamed Khaled')
    md.registeryOuInfo = this._buildInfo(22, 'السجل العام', 'General Registry')
    md.siteInfo = this._mockSiteInfo()
    return md
  }

  private _mockSiteInfo(): FollowupSiteInfo {
    const site = new FollowupSiteInfo()
    site.exportStatus = true
    site.exportWay = 1
    site.faxNumber = '+974 4444 4444'
    site.followupDate = new Date().toISOString()
    site.followupStatus = 1
    site.hasFax = true
    site.mainSiteId = 5
    site.subSiteId = 51
    site.siteCategory = 1
    site.siteType = 2
    site.status = true
    site.followupStatusResult = this._buildInfo(1, 'بانتظار الرد', 'Awaiting Reply')
    site.mainSite = this._buildInfo(5, 'وزارة المالية', 'Ministry of Finance')
    site.subSite = this._buildInfo(51, 'إدارة الميزانية', 'Budget Department')
    site.siteTypeResult = this._buildInfo(2, 'جهة حكومية', 'Government Entity')
    return site
  }

  private _mockAttachment(
    vsId: string,
    title: string,
    type: string,
    flags: { official?: boolean; contract?: boolean; annotation?: boolean } = {},
  ): FollowupAttachment {
    const att = new FollowupAttachment()
    att.vsId = vsId
    att.documentTitle = title
    att.docSubject = title
    att.priorityLevel = 2
    att.exportStatus = true
    att.isOfficial = flags.official ?? false
    att.isContract = flags.contract ?? false
    att.isAnnotation = flags.annotation ?? false
    att.attachmentTypeInfo = this._buildInfo(1, type, type)
    return att
  }

  private _buildInfo(id: number, ar: string, en: string): Info {
    const info = new Info()
    info.id = id
    info.arName = ar
    info.enName = en
    return info
  }

  private _mockPage(pageNum: number, subject: string): string {
    const escapedSubject = subject.replace(/[<>&"]/g, '')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <rect width="100%" height="100%" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
      <text x="60" y="80" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#0f172a">${escapedSubject}</text>
      <text x="60" y="115" font-family="Arial, sans-serif" font-size="13" fill="#64748b">Mock document preview · page ${pageNum}</text>
      <line x1="60" y1="140" x2="740" y2="140" stroke="#cbd5e1" stroke-width="1"/>
      <text x="60" y="195" font-family="Arial, sans-serif" font-size="14" fill="#334155">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod</text>
      <text x="60" y="220" font-family="Arial, sans-serif" font-size="14" fill="#334155">tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</text>
      <text x="60" y="245" font-family="Arial, sans-serif" font-size="14" fill="#334155">quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.</text>
      <text x="60" y="295" font-family="Arial, sans-serif" font-size="14" fill="#334155">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</text>
      <text x="60" y="320" font-family="Arial, sans-serif" font-size="14" fill="#334155">eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,</text>
      <text x="60" y="345" font-family="Arial, sans-serif" font-size="14" fill="#334155">sunt in culpa qui officia deserunt mollit anim id est laborum.</text>
      <rect x="60" y="400" width="680" height="180" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="80" y="440" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#475569">Highlights</text>
      <text x="80" y="475" font-family="Arial, sans-serif" font-size="12" fill="#64748b">• Mock highlight one for demonstration purposes.</text>
      <text x="80" y="500" font-family="Arial, sans-serif" font-size="12" fill="#64748b">• Mock highlight two showing list-style content.</text>
      <text x="80" y="525" font-family="Arial, sans-serif" font-size="12" fill="#64748b">• Mock highlight three to fill out the layout.</text>
      <text x="80" y="550" font-family="Arial, sans-serif" font-size="12" fill="#64748b">• Replace this preview once the real base64 PDF stream is wired up.</text>
      <text x="60" y="950" font-family="Arial, sans-serif" font-size="11" fill="#94a3b8">Page ${pageNum} · Mock generated client-side</text>
    </svg>`
    // btoa requires latin1 — strip non-ASCII characters that might sneak in via subject
    return btoa(svg.replace(/[^\x00-\x7F]/g, '?'))
  }
}
