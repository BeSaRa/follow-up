import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { MatIcon } from '@angular/material/icon'
import {
  BadgeVariant,
  UiBadge,
  UiBreadcrumb,
  UiBreadcrumbItem,
  UiButton,
  UiCard,
  UiCardContent,
  UiDatePicker,
  UiDatePickerInput,
  UiDatePickerToggle,
  UiInput,
  UiPagination,
  UiSelect,
  UiSelectOption,
  UiSkeleton,
  UiTable,
  UiTableBody,
  UiTableCell,
  UiTableHead,
  UiTableHeader,
  UiTableRow,
  UiTooltip,
} from '@follow-up/ui'
import { CrudPageDirective } from '@follow-up/core'
import { APP_ICONS } from '../../constants/icons'
import { FollowupService } from './services/followup.service'
import { Followup } from './models/followup'
import { FollowupDashboardCounters } from './models/followup-dashboard-counters'
import { DocumentClass } from '../../shared/enums/document-class'
import { AppStore } from '../../shared/stores/app-store'

@Component({
  selector: 'app-followup-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    MatIcon,
    UiBreadcrumb,
    UiBreadcrumbItem,
    UiBadge,
    UiButton,
    UiCard,
    UiCardContent,
    UiDatePicker,
    UiDatePickerInput,
    UiDatePickerToggle,
    UiInput,
    UiPagination,
    UiSelect,
    UiSelectOption,
    UiSkeleton,
    UiTable,
    UiTableBody,
    UiTableCell,
    UiTableHead,
    UiTableHeader,
    UiTableRow,
    UiTooltip,
  ],
  template: `
    <div class="space-y-6">
      <ui-breadcrumb>
        <ui-breadcrumb-item active>
          {{ 'followup.title' | translate }}
        </ui-breadcrumb-item>
      </ui-breadcrumb>

      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ 'followup.title' | translate }}
          </h1>
          <p class="mt-1 text-sm text-foreground-muted">
            {{ 'followup.description' | translate }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button uiButton variant="outline" size="sm" (click)="refresh()">
            <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.REFRESH" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        @for (counter of counterCards; track counter.key) {
          <ui-card>
            <ui-card-content class="flex items-center gap-3 p-4!">
              <div
                class="flex size-10 items-center justify-center rounded-full"
                [style.background-color]="counter.bg"
                [style.color]="counter.color"
              >
                <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="counter.icon" />
              </div>
              <div class="min-w-0">
                <p class="truncate text-xs text-foreground-muted">
                  {{ 'followup.counters.' + counter.key | translate }}
                </p>
                @if (countersLoading()) {
                  <ui-skeleton width="3rem" height="1.5rem" />
                } @else {
                  <p class="text-xl font-bold text-foreground">{{ counter.value(counters()) }}</p>
                }
              </div>
            </ui-card-content>
          </ui-card>
        }
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="relative max-w-sm flex-1">
          <mat-icon
            class="absolute start-3 top-1/2 -translate-y-1/2 text-lg! size-5! leading-5! text-foreground-subtle"
            [svgIcon]="icons.MAGNIFY"
          />
          <input
            uiInput
            type="text"
            class="bg-surface-raised! ps-10"
            [placeholder]="'followup.search_placeholder' | translate"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
          />
        </div>
        <div class="flex items-center gap-2">
          <ui-date-picker
            [value]="fromDate()"
            [max]="toDate()"
            (valueChange)="onFromDateChange($event)"
          >
            <input
              uiDatePickerInput
              class="bg-surface-raised!"
              [placeholder]="'followup.from_date' | translate"
            />
            <ui-date-picker-toggle />
          </ui-date-picker>
          <ui-date-picker
            [value]="toDate()"
            [min]="fromDate()"
            (valueChange)="onToDateChange($event)"
          >
            <input
              uiDatePickerInput
              class="bg-surface-raised!"
              [placeholder]="'followup.to_date' | translate"
            />
            <ui-date-picker-toggle />
          </ui-date-picker>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <ui-select
            class="w-48 [&>button]:bg-surface-raised!"
            [value]="securityLevel()"
            [placeholder]="'followup.filter_security_level' | translate"
            (valueChange)="onSecurityLevelChange($event)"
          >
            <ui-select-option [value]="null" [label]="'followup.filter_all' | translate">
              {{ 'followup.filter_all' | translate }}
            </ui-select-option>
            @for (item of securityLevels(); track item.lookupKey) {
              <ui-select-option
                [value]="item.lookupKey"
                [label]="isArabic() ? item.arName : item.enName"
              >
                {{ isArabic() ? item.arName : item.enName }}
              </ui-select-option>
            }
          </ui-select>
          <ui-select
            class="w-48 [&>button]:bg-surface-raised!"
            [value]="priorityLevel()"
            [placeholder]="'followup.filter_priority_level' | translate"
            (valueChange)="onPriorityLevelChange($event)"
          >
            <ui-select-option [value]="null" [label]="'followup.filter_all' | translate">
              {{ 'followup.filter_all' | translate }}
            </ui-select-option>
            @for (item of priorityLevels(); track item.lookupKey) {
              <ui-select-option
                [value]="item.lookupKey"
                [label]="isArabic() ? item.arName : item.enName"
              >
                {{ isArabic() ? item.arName : item.enName }}
              </ui-select-option>
            }
          </ui-select>
          <ui-select
            class="w-48 [&>button]:bg-surface-raised!"
            [value]="followUpStatus()"
            [placeholder]="'followup.filter_followup_status' | translate"
            (valueChange)="onFollowUpStatusChange($event)"
          >
            <ui-select-option [value]="null" [label]="'followup.filter_all' | translate">
              {{ 'followup.filter_all' | translate }}
            </ui-select-option>
            @for (item of followupStatuses(); track item.lookupKey) {
              <ui-select-option
                [value]="item.lookupKey"
                [label]="isArabic() ? item.arName : item.enName"
              >
                {{ isArabic() ? item.arName : item.enName }}
              </ui-select-option>
            }
          </ui-select>
          @if (hasActiveFilters()) {
            <button
              uiButton
              variant="outline"
              size="sm"
              (click)="clearFilters()"
            >
              <mat-icon class="text-lg! size-5! leading-5! me-1" [svgIcon]="icons.CLOSE" />
              {{ 'followup.clear_filters' | translate }}
            </button>
          }
        </div>
      </div>

      <ui-card>
        <ui-card-content class="p-0!">
          <div class="overflow-x-auto">
            <table uiTable>
              <thead uiTableHeader>
                <tr uiTableRow>
                  <th uiTableHead resizable>{{ 'followup.doc_subject' | translate }}</th>
                  <th uiTableHead>{{ 'followup.reference' | translate }}</th>
                  <th uiTableHead>{{ 'followup.priority_level' | translate }}</th>
                  <th uiTableHead>{{ 'followup.doc_class' | translate }}</th>
                  <th uiTableHead>{{ 'followup.external_entity' | translate }}</th>
                  <th uiTableHead>{{ 'followup.followup_status' | translate }}</th>
                  <th uiTableHead>{{ 'followup.assigned_user' | translate }}</th>
                  <th uiTableHead>{{ 'followup.due_date' | translate }}</th>
                  <th uiTableHead>{{ 'followup.status' | translate }}</th>
                  <th uiTableHead class="w-[160px] [&>div]:justify-center">{{ 'followup.actions' | translate }}</th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (item of models(); track item.id) {
                  <tr uiTableRow>
                    <td uiTableCell>
                      <button
                        class="cursor-pointer font-medium text-primary hover:underline"
                        (click)="view(item)"
                      >
                        {{ item.docSubject }}
                      </button>
                    </td>
                    <td uiTableCell>{{ item.followUpReference }}</td>
                    <td uiTableCell>
                      <ui-badge [variant]="getPriorityVariant(item.priorityLevelInfo.id)" size="sm">
                        {{ item.priorityLevelInfo.getName() }}
                      </ui-badge>
                    </td>
                    <td uiTableCell>
                      <div class="flex items-center gap-2">
                        <div
                          class="inline-flex size-6 items-center justify-center rounded-full"
                          [style.background-color]="item.docClassInfo.id === DocumentClass.OUTGOING ? 'rgba(59, 130, 246, 0.15)' : 'rgba(139, 92, 246, 0.15)'"
                          [style.color]="item.docClassInfo.id === DocumentClass.OUTGOING ? 'rgb(59, 130, 246)' : 'rgb(139, 92, 246)'"
                        >
                          <mat-icon
                            class="text-xs! size-3! leading-3!"
                            [svgIcon]="item.docClassInfo.id === DocumentClass.OUTGOING ? icons.ARROW_UP : icons.ARROW_DOWN"
                          />
                        </div>
                        <span>{{ item.docClassInfo.getName() }}</span>
                      </div>
                    </td>
                    <td uiTableCell>{{ item.externalEntityInfo.getName() }}</td>
                    <td uiTableCell>{{ item.followUpStatusInfo.getName() }}</td>
                    <td uiTableCell>{{ item.assignedUserInfo.getName() }}</td>
                    <td uiTableCell>{{ item.dueDate }}</td>
                    <td uiTableCell>
                      <ui-badge
                        [variant]="item.status ? 'success' : 'error'"
                        size="sm"
                      >
                        {{ (item.status ? 'followup.active' : 'followup.inactive') | translate }}
                      </ui-badge>
                    </td>
                    <td uiTableCell class="w-[160px]">
                      <div class="flex w-full items-center justify-center gap-1">
                        <button
                          uiButton
                          variant="ghost"
                          size="sm"
                          [attr.aria-label]="'followup.view' | translate"
                          [uiTooltip]="'followup.view' | translate"
                          (click)="view(item)"
                        >
                          <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.EYE_OUTLINE" />
                        </button>
                        @if (item.assignedUserInfo.id > 0) {
                          <button
                            uiButton
                            variant="ghost"
                            size="sm"
                            [attr.aria-label]="'followup.reassign_user' | translate"
                            [uiTooltip]="'followup.reassign_user' | translate"
                            (click)="assignUser(item)"
                          >
                            <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.ACCOUNT_SWITCH" />
                          </button>
                        } @else {
                          <button
                            uiButton
                            variant="ghost"
                            size="sm"
                            [attr.aria-label]="'followup.assign_user' | translate"
                            [uiTooltip]="'followup.assign_user' | translate"
                            (click)="assignUser(item)"
                          >
                            <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.ACCOUNT_ARROW_RIGHT" />
                          </button>
                        }
                        <button
                          uiButton
                          variant="ghost"
                          size="sm"
                          [attr.aria-label]="'followup.show_logs' | translate"
                          [uiTooltip]="'followup.show_logs' | translate"
                          (click)="showLogs(item)"
                        >
                          <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.HISTORY" />
                        </button>
                        <!-- <button
                          uiButton
                          variant="ghost"
                          size="sm"
                          [attr.aria-label]="'followup.add_comment' | translate"
                          [uiTooltip]="'followup.add_comment' | translate"
                          (click)="addComment(item)"
                        >
                          <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.COMMENT_TEXT_OUTLINE" />
                        </button>
                        <button
                          uiButton
                          variant="ghost"
                          size="sm"
                          [attr.aria-label]="'followup.add_statement' | translate"
                          [uiTooltip]="'followup.add_statement' | translate"
                          (click)="addStatement(item)"
                        >
                          <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.PLUS" />
                        </button> -->
                        <button
                          uiButton
                          variant="ghost"
                          size="sm"
                          [attr.aria-label]="'followup.show_comments' | translate"
                          [uiTooltip]="'followup.show_comments' | translate"
                          (click)="showComments(item)"
                        >
                          <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.COMMENT_MULTIPLE_OUTLINE" />
                        </button>
                        <button
                          uiButton
                          variant="ghost"
                          size="sm"
                          [attr.aria-label]="'followup.show_statements' | translate"
                          [uiTooltip]="'followup.show_statements' | translate"
                          (click)="showStatements(item)"
                        >
                          <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.MESSAGE_TEXT_OUTLINE" />
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td [attr.colspan]="10">
                      @if (loading()) {
                        <div class="space-y-4 px-4 py-4">
                          @for (i of skeletonRows; track i) {
                            <ui-skeleton width="100%" height="2rem" />
                          }
                        </div>
                      } @else {
                        <div class="flex flex-col items-center justify-center py-12 text-foreground-muted">
                          <mat-icon class="text-4xl! size-10! leading-10! mb-3" [svgIcon]="icons.VIEW_DASHBOARD" />
                          <p class="text-sm">{{ 'followup.no_data' | translate }}</p>
                        </div>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          @if (models().length) {
            <div class="border-t border-border">
              <ui-pagination
                [totalItems]="totalElements()"
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
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class FollowupPage extends CrudPageDirective<Followup, FollowupService> implements OnInit {
  readonly service = inject(FollowupService)
  readonly icons = APP_ICONS
  readonly DocumentClass = DocumentClass
  readonly fromDate = signal<Date | null>(null)
  readonly toDate = signal<Date | null>(null)
  readonly securityLevel = signal<number | null>(null)
  readonly priorityLevel = signal<number | null>(null)
  readonly followUpStatus = signal<number | null>(null)

  private readonly appStore = inject(AppStore)
  private readonly translate = inject(TranslateService)
  readonly isArabic = computed(() => (this.translate.currentLang || 'ar') === 'ar')
  readonly securityLevels = computed(() => this.appStore.lookupList()?.SecurityLevel ?? [])
  readonly priorityLevels = computed(() => this.appStore.lookupList()?.PriorityLevel ?? [])
  readonly followupStatuses = computed(() => this.appStore.lookupList()?.FollowupStatus ?? [])
  readonly hasActiveFilters = computed(
    () =>
      !!this.searchQuery() ||
      this.fromDate() != null ||
      this.toDate() != null ||
      this.securityLevel() != null ||
      this.priorityLevel() != null ||
      this.followUpStatus() != null,
  )
  readonly counters = signal<FollowupDashboardCounters>(new FollowupDashboardCounters())
  readonly countersLoading = signal(false)

  readonly counterCards: ReadonlyArray<{
    key: string
    icon: string
    bg: string
    color: string
    value: (c: FollowupDashboardCounters) => number
  }> = [
    {
      key: 'outgoing',
      icon: APP_ICONS.ARROW_UP,
      bg: 'rgba(59, 130, 246, 0.15)',
      color: 'rgb(59, 130, 246)',
      value: (c) => c.outgoingCount,
    },
    {
      key: 'incoming',
      icon: APP_ICONS.ARROW_DOWN,
      bg: 'rgba(139, 92, 246, 0.15)',
      color: 'rgb(139, 92, 246)',
      value: (c) => c.incomingCount,
    },
    {
      key: 'overdue',
      icon: APP_ICONS.PRIORITY_HIGH,
      bg: 'rgba(239, 68, 68, 0.15)',
      color: 'rgb(239, 68, 68)',
      value: (c) => c.overdueCount,
    },
    {
      key: 'overdue_within_7_days',
      icon: APP_ICONS.CLIPBOARD_TEXT_CLOCK,
      bg: 'rgba(245, 158, 11, 0.15)',
      color: 'rgb(245, 158, 11)',
      value: (c) => c.overDueWithin7DaysCount,
    },
    {
      key: 'completed',
      icon: APP_ICONS.LIST_STATUS,
      bg: 'rgba(34, 197, 94, 0.15)',
      color: 'rgb(34, 197, 94)',
      value: (c) => c.completedCount,
    },
  ]

  private readonly priorityVariants: Record<number, BadgeVariant> = {
    1: 'outline-error',
    2: 'outline-warning',
    3: 'outline-info',
    4: 'outline-success',
  }

  ngOnInit(): void {
    this.loadCounters()
  }

  override refresh(): void {
    super.refresh()
    this.loadCounters()
  }

  private loadCounters(): void {
    this.countersLoading.set(true)
    this.service.getDashboardCounters().subscribe({
      next: (result) => {
        this.counters.set(result)
        this.countersLoading.set(false)
      },
      error: () => {
        this.countersLoading.set(false)
      },
    })
  }

  override buildLoadOptions(page: number, size: number, search: string): Record<string, unknown> {
    const options = super.buildLoadOptions(page, size, search)
    const from = this.fromDate()
    const to = this.toDate()
    if (from) {
      options['fromDate'] = this.toLocalDate(from)
    }
    if (to) {
      options['toDate'] = this.toLocalDate(to)
    }
    const security = this.securityLevel()
    if (security != null) {
      options['securityLevel'] = security
    }
    const priority = this.priorityLevel()
    if (priority != null) {
      options['priorityLevel'] = priority
    }
    const status = this.followUpStatus()
    if (status != null) {
      options['followUpStatus'] = status
    }
    return options
  }

  private toLocalDate(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  getPriorityVariant(id: number): BadgeVariant {
    return this.priorityVariants[id] ?? 'outline'
  }

  onFromDateChange(value: Date | null): void {
    this.fromDate.set(value)
    this.pageIndex.set(0)
    this.refresh()
  }

  onToDateChange(value: Date | null): void {
    this.toDate.set(value)
    this.pageIndex.set(0)
    this.refresh()
  }

  onSecurityLevelChange(value: unknown): void {
    this.securityLevel.set(value as number | null)
    this.pageIndex.set(0)
    this.refresh()
  }

  onPriorityLevelChange(value: unknown): void {
    this.priorityLevel.set(value as number | null)
    this.pageIndex.set(0)
    this.refresh()
  }

  onFollowUpStatusChange(value: unknown): void {
    this.followUpStatus.set(value as number | null)
    this.pageIndex.set(0)
    this.refresh()
  }

  clearFilters(): void {
    this.searchQuery.set('')
    this.fromDate.set(null)
    this.toDate.set(null)
    this.securityLevel.set(null)
    this.priorityLevel.set(null)
    this.followUpStatus.set(null)
    this.pageIndex.set(0)
    this.refresh()
  }

  view(item: Followup): void {
    this.service
      .view(item)
      .afterClosed()
      .subscribe((result) => {
        if (result?.terminated) {
          this.refresh()
        }
      })
  }

  showLogs(item: Followup): void {
    this.service.viewLogs(item)
  }

  addComment(item: Followup): void {
    this.service.openAddComment(item)
  }

  addStatement(item: Followup): void {
    this.service.openAddStatement(item)
  }

  showComments(item: Followup): void {
    this.service.viewComments(item)
  }

  showStatements(item: Followup): void {
    this.service.viewStatements(item)
  }

  assignUser(item: Followup): void {
    this.service
      .openAssignUser(item)
      .afterClosed()
      .subscribe((result) => {
        if (!result) return
        this.refresh()
      })
  }
}
