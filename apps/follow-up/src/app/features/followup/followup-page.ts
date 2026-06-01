import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { MatIcon } from '@angular/material/icon'
import {
  BadgeVariant,
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
} from '@follow-up/ui'
import { CrudPageDirective } from '@follow-up/core'
import { APP_ICONS } from '../../constants/icons'
import { FollowupService } from './services/followup.service'
import { Followup } from './models/followup'
import { DocumentClass } from '../../shared/enums/document-class'
import { AppStore } from '../../shared/stores/app-store'
import { UserType } from '../../shared/enums/user-type'

@Component({
  selector: 'app-followup-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    MatIcon,
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
  ],
  template: `
    <div class="space-y-6">
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
            <mat-icon
              class="text-lg! size-5! leading-5!"
              [svgIcon]="icons.REFRESH"
            />
          </button>
        </div>
      </div>

<div class="flex flex-wrap items-center gap-3">
        <div class="relative w-64">
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
        <ui-select
            class="w-48 [&>button]:bg-surface-raised!"
            [value]="securityLevel()"
            [placeholder]="'followup.filter_security_level' | translate"
            (valueChange)="onSecurityLevelChange($event)"
          >
            <ui-select-option
              [value]="null"
              [label]="'followup.filter_all' | translate"
            >
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
            <ui-select-option
              [value]="null"
              [label]="'followup.filter_all' | translate"
            >
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
            <ui-select-option
              [value]="null"
              [label]="'followup.filter_all' | translate"
            >
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
          @if (isPmoHead()) {
            <ui-select
              class="w-48 [&>button]:bg-surface-raised!"
              [value]="assignmentStatus()"
              [placeholder]="'followup.filter_assigned' | translate"
              (valueChange)="onAssignmentStatusChange($event)"
            >
              <ui-select-option
                [value]="1"
                [label]="'followup.filter_all' | translate"
              >
                {{ 'followup.filter_all' | translate }}
              </ui-select-option>
              <ui-select-option
                [value]="2"
                [label]="'followup.filter_assigned_yes' | translate"
              >
                {{ 'followup.filter_assigned_yes' | translate }}
              </ui-select-option>
              <ui-select-option
                [value]="3"
                [label]="'followup.filter_assigned_no' | translate"
              >
                {{ 'followup.filter_assigned_no' | translate }}
              </ui-select-option>
            </ui-select>
          }
          <!-- TODO: re-enable once backend supports userId filter
          <ui-select
            class="w-56 [&>button]:bg-surface-raised!"
            [value]="assignedUserId()"
            [placeholder]="'followup.filter_assigned_user' | translate"
            (valueChange)="onAssignedUserChange($event)"
          >
            <ui-select-option
              [value]="null"
              [label]="'followup.filter_all' | translate"
            >
              {{ 'followup.filter_all' | translate }}
            </ui-select-option>
            @for (user of internalUsers(); track user.id) {
              <ui-select-option
                [value]="user.id"
                [label]="isArabic() ? user.arName : user.enName"
              >
                {{ isArabic() ? user.arName : user.enName }}
              </ui-select-option>
            }
          </ui-select>
          -->
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
        @if (hasActiveFilters()) {
          <button
            uiButton
            variant="outline"
            size="sm"
            (click)="clearFilters()"
          >
            <mat-icon
              class="text-lg! size-5! leading-5! me-1"
              [svgIcon]="icons.CLOSE"
            />
            {{ 'followup.clear_filters' | translate }}
          </button>
        }
      </div>

      <ui-card>
        <ui-card-content class="p-0!">
          <div class="overflow-x-auto">
            <table uiTable roundedHeader striped>
              <thead uiTableHeader>
                <tr uiTableRow>
                  <th uiTableHead resizable>
                    {{ 'followup.doc_subject' | translate }}
                  </th>
                  <th uiTableHead>{{ 'followup.reference' | translate }}</th>
                  <th uiTableHead>
                    {{ 'followup.priority_level' | translate }}
                  </th>
                  <th uiTableHead>{{ 'followup.doc_class' | translate }}</th>
                  <th uiTableHead>
                    {{ 'followup.external_entity' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'followup.followup_status' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'followup.assigned_user' | translate }}
                  </th>
                  <th uiTableHead>{{ 'followup.due_date' | translate }}</th>
                  <th uiTableHead>{{ 'followup.status' | translate }}</th>
                  <th uiTableHead class="w-[320px] [&>div]:justify-center">
                    {{ 'followup.actions' | translate }}
                  </th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (item of models(); track item.id) {
                  <tr
                    uiTableRow
                    class="cursor-pointer"
                    (click)="showComments(item)"
                  >
                    <td uiTableCell>
                      <button
                        class="cursor-pointer font-medium text-primary hover:underline"
                        (click)="$event.stopPropagation(); view(item)"
                      >
                        {{ item.docSubject }}
                      </button>
                    </td>
                    <td uiTableCell>{{ item.followUpReference }}</td>
                    <td uiTableCell>
                      <ui-badge
                        [variant]="
                          getPriorityVariant(item.priorityLevelInfo.id)
                        "
                        size="sm"
                      >
                        {{ item.priorityLevelInfo.getName() }}
                      </ui-badge>
                    </td>
                    <td uiTableCell>
                      <div class="flex items-center gap-2">
                        <div
                          class="inline-flex size-6 items-center justify-center rounded-full"
                          [style.background-color]="
                            item.docClassInfo.id === DocumentClass.OUTGOING
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'rgba(139, 92, 246, 0.15)'
                          "
                          [style.color]="
                            item.docClassInfo.id === DocumentClass.OUTGOING
                              ? 'rgb(59, 130, 246)'
                              : 'rgb(139, 92, 246)'
                          "
                        >
                          <mat-icon
                            class="text-xs! size-3! leading-3!"
                            [svgIcon]="
                              item.docClassInfo.id === DocumentClass.OUTGOING
                                ? icons.ARROW_UP
                                : icons.ARROW_DOWN
                            "
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
                        [variant]="
                          item.status ? 'outline-success' : 'outline-error'
                        "
                        size="sm"
                      >
                        {{
                          (item.status
                            ? 'followup.active'
                            : 'followup.inactive'
                          ) | translate
                        }}
                      </ui-badge>
                    </td>
                    <td uiTableCell class="w-[320px]">
                      <div
                        class="flex w-full items-start justify-center gap-1"
                        (click)="$event.stopPropagation()"
                      >
                        <button
                          type="button"
                          class="inline-flex flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1.5 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                          (click)="view(item)"
                        >
                          <mat-icon
                            class="text-lg! size-5! leading-5!"
                            [svgIcon]="icons.EYE_OUTLINE"
                          />
                          <span class="text-[10px] font-light leading-none">
                            {{ 'followup.view' | translate }}
                          </span>
                        </button>
                        @if (isPmoHead()) {
                          @if (item.assignedUserInfo.id > 0) {
                            <button
                              type="button"
                              class="inline-flex flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1.5 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                              (click)="assignUser(item)"
                            >
                              <mat-icon
                                class="text-lg! size-5! leading-5!"
                                [svgIcon]="icons.ACCOUNT_SWITCH"
                              />
                              <span class="text-[10px] font-light leading-none">
                                {{ 'followup.reassign_user' | translate }}
                              </span>
                            </button>
                          } @else {
                            <button
                              type="button"
                              class="inline-flex flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1.5 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                              (click)="assignUser(item)"
                            >
                              <mat-icon
                                class="text-lg! size-5! leading-5!"
                                [svgIcon]="icons.ACCOUNT_ARROW_RIGHT"
                              />
                              <span class="text-[10px] font-light leading-none">
                                {{ 'followup.assign_user' | translate }}
                              </span>
                            </button>
                          }
                        }
                        @if (canUpdatePriority()) {
                          <button
                            type="button"
                            class="inline-flex flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1.5 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                            (click)="changePriority(item)"
                          >
                            <mat-icon
                              class="text-lg! size-5! leading-5!"
                              [svgIcon]="icons.FLAG_OUTLINE"
                            />
                            <span class="text-[10px] font-light leading-none">
                              {{ 'followup.change_priority' | translate }}
                            </span>
                          </button>
                        }
                        <button
                          type="button"
                          class="inline-flex flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1.5 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                          (click)="showLogs(item)"
                        >
                          <mat-icon
                            class="text-lg! size-5! leading-5!"
                            [svgIcon]="icons.HISTORY"
                          />
                          <span class="text-[10px] font-light leading-none">
                            {{ 'followup.show_logs' | translate }}
                          </span>
                        </button>
                        <button
                          type="button"
                          class="inline-flex flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1.5 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                          (click)="showComments(item)"
                        >
                          <mat-icon
                            class="text-lg! size-5! leading-5!"
                            [svgIcon]="icons.COMMENT_MULTIPLE_OUTLINE"
                          />
                          <span class="text-[10px] font-light leading-none">
                            {{ 'followup.show_comments' | translate }}
                          </span>
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
                        <div
                          class="flex flex-col items-center justify-center py-12 text-foreground-muted"
                        >
                          <mat-icon
                            class="text-4xl! size-10! leading-10! mb-3"
                            [svgIcon]="icons.VIEW_DASHBOARD"
                          />
                          <p class="text-sm">
                            {{ 'followup.no_data' | translate }}
                          </p>
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
export class FollowupPage
  extends CrudPageDirective<Followup, FollowupService>
  implements OnInit
{
  readonly service = inject(FollowupService)
  readonly icons = APP_ICONS
  readonly DocumentClass = DocumentClass
  readonly fromDate = signal<Date | null>(null)
  readonly toDate = signal<Date | null>(null)
  readonly securityLevel = signal<number | null>(null)
  readonly priorityLevel = signal<number | null>(null)
  readonly followUpStatus = signal<number | null>(null)
  readonly assignmentStatus = signal<1 | 2 | 3 | null>(null)
  readonly assignedUserId = signal<number | null>(null)
  readonly internalUsers = this.service.internalUsers

  private readonly appStore = inject(AppStore)
  private readonly translate = inject(TranslateService)
  readonly isArabic = computed(
    () => (this.translate.currentLang || 'ar') === 'ar',
  )
  readonly isPmoHead = computed(
    () => this.appStore.userType() === UserType.PMO_HEAD,
  )
  readonly canUpdatePriority = computed(() => {
    const userType = this.appStore.userType()
    return userType === UserType.PMO_HEAD || userType === UserType.INTERNAL_USER
  })
  readonly securityLevels = computed(
    () => this.appStore.lookupList()?.SecurityLevel ?? [],
  )
  readonly priorityLevels = computed(
    () => this.appStore.lookupList()?.PriorityLevel ?? [],
  )
  readonly followupStatuses = computed(
    () => this.appStore.lookupList()?.FollowupStatus ?? [],
  )
  readonly hasActiveFilters = computed(
    () =>
      !!this.searchQuery() ||
      this.fromDate() != null ||
      this.toDate() != null ||
      this.securityLevel() != null ||
      this.priorityLevel() != null ||
      this.followUpStatus() != null ||
      (this.assignmentStatus() !== 1 && this.assignmentStatus() !== null),
  )
  /**
   * Priority badge variants resolved from the PriorityLevel lookup's
   * lookupStrKey (an outline-* variant chosen in the admin form). Priorities
   * without a configured color fall back to a plain outline badge.
   */
  private readonly priorityVariantMap = computed(() => {
    const map = new Map<number, BadgeVariant>()
    for (const p of this.priorityLevels()) {
      if (p.lookupStrKey) {
        map.set(p.lookupKey, p.lookupStrKey as BadgeVariant)
      }
    }
    return map
  })

  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  })
  /**
   * Item id to open from the URL (?action=open&item={id}). Returns null when
   * the URL doesn't request an open or the id isn't a positive integer.
   */
  private readonly openItemId = computed<number | null>(() => {
    const params = this.queryParams()
    if (params.get('action') !== 'open') return null
    const id = Number(params.get('item'))
    return Number.isFinite(id) && id > 0 ? id : null
  })
  /** Ref to the open view dialog, so we don't reopen it on every signal tick. */
  private openDialogRef: ReturnType<FollowupService['view']> | null = null

  constructor() {
    super()
    // Deep-link bridge: whenever the URL asks to open an item and the row is
    // present in the current page of results, open the view dialog for it.
    effect(() => {
      const targetId = this.openItemId()
      const rows = this.models()
      if (targetId === null) return
      if (this.openDialogRef !== null) return
      if (rows.length === 0) return
      const row = rows.find((r) => r.id === targetId)
      if (!row) return
      untracked(() => this.openViewDialog(row))
    })
  }

  ngOnInit(): void {
    if (this.isPmoHead() && !this.internalUsers().length) {
      this.service.loadAssignableUsers().subscribe({ error: () => undefined })
    }
  }

  override buildLoadOptions(
    page: number,
    size: number,
    search: string,
  ): Record<string, unknown> {
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
    const assigned = this.assignmentStatus()
    if (assigned != null) {
      options['assignmentStatus'] = assigned
    }
    // TODO: re-enable once backend supports userId filter
    // const assignedUser = this.assignedUserId()
    // if (assignedUser != null) {
    //   options['userId'] = assignedUser
    // }
    return options
  }

  private toLocalDate(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  getPriorityVariant(id: number): BadgeVariant {
    return this.priorityVariantMap().get(id) ?? 'outline'
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

  onAssignmentStatusChange(value: unknown): void {
    this.assignmentStatus.set(value as 1 | 2 | 3 | null)
    this.pageIndex.set(0)
    this.refresh()
  }

  onAssignedUserChange(value: unknown): void {
    this.assignedUserId.set(value as number | null)
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
    this.assignmentStatus.set(null)
    this.assignedUserId.set(null)
    this.pageIndex.set(0)
    this.refresh()
  }

  view(item: Followup): void {
    // Push ?action=open&item={id} onto the URL — the effect in the
    // constructor watches that and opens the dialog for us, so refreshing
    // the page re-opens the same item.
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { action: 'open', item: item.id },
      queryParamsHandling: 'merge',
    })
  }

  private openViewDialog(item: Followup): void {
    const ref = this.service.view(item)
    this.openDialogRef = ref
    ref.afterClosed().subscribe((result) => {
      this.openDialogRef = null
      // Clear the open-dialog params before refresh() so the effect doesn't
      // race and reopen the dialog against the freshly reloaded rows.
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { action: null, item: null },
        queryParamsHandling: 'merge',
      })
      if (
        result?.terminated ||
        result?.statusChanged ||
        result?.priorityChanged
      ) {
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

  showComments(item: Followup): void {
    this.service.viewComments(item)
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

  changePriority(item: Followup): void {
    this.service
      .openChangePriority(item.id, item.priorityLevelInfo.id)
      .afterClosed()
      .subscribe((result) => {
        if (!result) return
        this.refresh()
      })
  }
}
