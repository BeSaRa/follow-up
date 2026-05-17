import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { RouterLink } from '@angular/router'
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
  UiSkeleton,
  UiTable,
  UiTableBody,
  UiTableCell,
  UiTableHead,
  UiTableHeader,
  UiTableRow,
  UiTooltip,
} from '@follow-up/ui'
import { APP_ICONS } from '../../constants/icons'
import { FollowupService } from '../followup/services/followup.service'
import { Followup } from '../followup/models/followup'
import { FollowupDashboardCounters } from '../followup/models/followup-dashboard-counters'
import { FollowupLevelCount } from './models/followup-level-count'
import { DocumentClass } from '../../shared/enums/document-class'
import { UserType } from '../../shared/enums/user-type'
import { AppStore } from '../../shared/stores/app-store'

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslatePipe,
    MatIcon,
    UiBadge,
    UiBreadcrumb,
    UiBreadcrumbItem,
    UiButton,
    UiCard,
    UiCardContent,
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
          {{ 'dashboard.title' | translate }}
        </ui-breadcrumb-item>
      </ui-breadcrumb>

      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ 'dashboard.title' | translate }}
          </h1>
          <p class="mt-1 text-sm text-foreground-muted">
            {{ 'dashboard.description' | translate }}
          </p>
        </div>
        <button uiButton variant="outline" size="sm" (click)="refresh()">
          <mat-icon
            class="text-lg! size-5! leading-5!"
            [svgIcon]="icons.REFRESH"
          />
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Incoming -->
        <ui-card>
          <ui-card-content class="relative flex min-h-32 flex-col justify-start p-4!">
            <div
              class="absolute top-4 end-4 flex size-14 items-center justify-center rounded-full"
              [style.background-color]="'rgba(139, 92, 246, 0.15)'"
              [style.color]="'rgb(139, 92, 246)'"
            >
              <mat-icon
                class="text-2xl! size-7! leading-7!"
                [svgIcon]="icons.ARROW_DOWN"
              />
            </div>
            <p class="text-sm text-foreground-muted">
              {{ 'dashboard.incoming' | translate }}
            </p>
            @if (countersLoading()) {
              <ui-skeleton width="4rem" height="2rem" />
            } @else {
              <p class="text-3xl font-bold text-foreground">
                {{ counters().incomingCount }}
              </p>
            }
          </ui-card-content>
        </ui-card>

        <!-- Completed -->
        <ui-card>
          <ui-card-content class="relative flex min-h-32 flex-col justify-start p-4!">
            <div
              class="absolute top-4 end-4 flex size-14 items-center justify-center rounded-full"
              [style.background-color]="'rgba(34, 197, 94, 0.15)'"
              [style.color]="'rgb(34, 197, 94)'"
            >
              <mat-icon
                class="text-2xl! size-7! leading-7!"
                [svgIcon]="icons.LIST_STATUS"
              />
            </div>
            <p class="text-sm text-foreground-muted">
              {{ 'dashboard.completed' | translate }}
            </p>
            @if (countersLoading()) {
              <ui-skeleton width="4rem" height="2rem" />
            } @else {
              <p class="text-3xl font-bold text-foreground">
                {{ counters().completedCount }}
              </p>
            }
          </ui-card-content>
        </ui-card>

        <!-- Due in 7 Days (with priority breakdown) -->
        <ui-card>
          <ui-card-content class="relative flex min-h-32 flex-col gap-3 p-4!">
            <div
              class="absolute top-4 end-4 flex size-14 items-center justify-center rounded-full"
              [style.background-color]="'rgba(245, 158, 11, 0.15)'"
              [style.color]="'rgb(245, 158, 11)'"
            >
              <mat-icon
                class="text-2xl! size-7! leading-7!"
                [svgIcon]="icons.CLIPBOARD_TEXT_CLOCK"
              />
            </div>
            <div class="flex flex-1 flex-col justify-start">
              <p class="text-sm text-foreground-muted">
                {{ 'dashboard.due_in_7_days' | translate }}
              </p>
              @if (countersLoading()) {
                <ui-skeleton width="4rem" height="2rem" />
              } @else {
                <p class="text-3xl font-bold text-foreground">
                  {{ counters().overDueWithin7DaysCount }}
                </p>
              }
            </div>
            <div class="flex items-stretch border-t border-border pt-3">
              @for (
                item of priorityBreakdown();
                track item.key;
                let last = $last
              ) {
                <div class="flex-1 px-2 text-center">
                  <div class="truncate text-xs text-foreground-muted">
                    {{ item.name }}
                  </div>
                  <div class="mt-1 text-base font-bold text-foreground">
                    {{ item.count }}
                  </div>
                </div>
                @if (!last) {
                  <span
                    class="w-px self-stretch bg-border"
                    aria-hidden="true"
                  ></span>
                }
              }
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Overdue -->
        <ui-card>
          <ui-card-content class="relative flex min-h-32 flex-col justify-start p-4!">
            <div
              class="absolute top-4 end-4 flex size-14 items-center justify-center rounded-full"
              [style.background-color]="'rgba(239, 68, 68, 0.15)'"
              [style.color]="'rgb(239, 68, 68)'"
            >
              <mat-icon
                class="text-2xl! size-7! leading-7!"
                [svgIcon]="icons.PRIORITY_HIGH"
              />
            </div>
            <p class="text-sm text-foreground-muted">
              {{ 'dashboard.overdue' | translate }}
            </p>
            @if (countersLoading()) {
              <ui-skeleton width="4rem" height="2rem" />
            } @else {
              <p class="text-3xl font-bold text-foreground">
                {{ counters().overdueCount }}
              </p>
            }
          </ui-card-content>
        </ui-card>
      </div>

      <ui-card class="overflow-hidden">
        <ui-card-content class="p-0!">
          <div
            class="flex items-center justify-between border-b border-border px-4 py-3"
          >
            <h2 class="text-lg font-semibold text-foreground">
              {{ 'dashboard.latest_followups' | translate }}
            </h2>
            <a
              routerLink="/followup"
              class="text-sm font-medium text-primary hover:underline"
            >
              {{ 'dashboard.view_all' | translate }}
            </a>
          </div>
          <div class="overflow-x-auto">
            <table uiTable roundedHeader>
              <thead uiTableHeader>
                <tr uiTableRow>
                  <th uiTableHead>
                    {{ 'followup.doc_subject' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'followup.reference' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'followup.priority_level' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'followup.doc_class' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'followup.external_entity' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'followup.followup_status' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'followup.assigned_user' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'followup.due_date' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'followup.status' | translate }}
                  </th>
                  <th uiTableHead class="w-[160px] [&>div]:justify-center">
                    {{ 'followup.actions' | translate }}
                  </th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (item of latest(); track item.id) {
                  <tr
                    uiTableRow
                    class="cursor-pointer"
                    (click)="showComments(item)"
                  >
                    <td uiTableCell>
                      <button
                        class="cursor-pointer text-start font-medium text-primary hover:underline"
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
                    <td uiTableCell>
                      {{ item.externalEntityInfo.getName() }}
                    </td>
                    <td uiTableCell>
                      {{ item.followUpStatusInfo.getName() }}
                    </td>
                    <td uiTableCell>
                      {{ item.assignedUserInfo.getName() }}
                    </td>
                    <td uiTableCell>{{ item.dueDate }}</td>
                    <td uiTableCell>
                      <ui-badge
                        [variant]="item.status ? 'success' : 'error'"
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
                    <td uiTableCell class="w-[160px]">
                      <div
                        class="flex w-full items-center justify-center gap-1"
                        (click)="$event.stopPropagation()"
                      >
                        <button
                          uiButton
                          variant="ghost"
                          size="sm"
                          [attr.aria-label]="'followup.view' | translate"
                          [uiTooltip]="'followup.view' | translate"
                          (click)="view(item)"
                        >
                          <mat-icon
                            class="text-lg! size-5! leading-5!"
                            [svgIcon]="icons.EYE_OUTLINE"
                          />
                        </button>
                        @if (isPmoHead()) {
                          @if (item.assignedUserInfo.id > 0) {
                            <button
                              uiButton
                              variant="ghost"
                              size="sm"
                              [attr.aria-label]="
                                'followup.reassign_user' | translate
                              "
                              [uiTooltip]="
                                'followup.reassign_user' | translate
                              "
                              (click)="assignUser(item)"
                            >
                              <mat-icon
                                class="text-lg! size-5! leading-5!"
                                [svgIcon]="icons.ACCOUNT_SWITCH"
                              />
                            </button>
                          } @else {
                            <button
                              uiButton
                              variant="ghost"
                              size="sm"
                              [attr.aria-label]="
                                'followup.assign_user' | translate
                              "
                              [uiTooltip]="'followup.assign_user' | translate"
                              (click)="assignUser(item)"
                            >
                              <mat-icon
                                class="text-lg! size-5! leading-5!"
                                [svgIcon]="icons.ACCOUNT_ARROW_RIGHT"
                              />
                            </button>
                          }
                        }
                        @if (canUpdatePriority()) {
                          <button
                            uiButton
                            variant="ghost"
                            size="sm"
                            [attr.aria-label]="
                              'followup.change_priority' | translate
                            "
                            [uiTooltip]="
                              'followup.change_priority' | translate
                            "
                            (click)="changePriority(item)"
                          >
                            <mat-icon
                              class="text-lg! size-5! leading-5!"
                              [svgIcon]="icons.FLAG_OUTLINE"
                            />
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
                          <mat-icon
                            class="text-lg! size-5! leading-5!"
                            [svgIcon]="icons.HISTORY"
                          />
                        </button>
                        <button
                          uiButton
                          variant="ghost"
                          size="sm"
                          [attr.aria-label]="
                            'followup.show_comments' | translate
                          "
                          [uiTooltip]="
                            'followup.show_comments' | translate
                          "
                          (click)="showComments(item)"
                        >
                          <mat-icon
                            class="text-lg! size-5! leading-5!"
                            [svgIcon]="icons.COMMENT_MULTIPLE_OUTLINE"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td
                      [attr.colspan]="10"
                      class="px-4 py-8 text-center text-sm text-foreground-muted"
                    >
                      @if (latestLoading()) {
                        <span>{{ 'dashboard.loading' | translate }}</span>
                      } @else {
                        <span>{{ 'dashboard.no_data' | translate }}</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class DashboardPage implements OnInit {
  private readonly service = inject(FollowupService)
  private readonly translate = inject(TranslateService)
  private readonly appStore = inject(AppStore)
  protected readonly icons = APP_ICONS
  protected readonly DocumentClass = DocumentClass

  protected readonly counters = signal<FollowupDashboardCounters>(
    new FollowupDashboardCounters(),
  )
  protected readonly countersLoading = signal(false)
  protected readonly dueIn7Breakdown = signal<FollowupLevelCount[]>([])
  protected readonly latest = signal<Followup[]>([])
  protected readonly latestLoading = signal(false)

  protected readonly isArabic = computed(
    () => (this.translate.currentLang || 'ar') === 'ar',
  )
  protected readonly isPmoHead = computed(
    () => this.appStore.userType() === UserType.PMO_HEAD,
  )
  protected readonly canUpdatePriority = computed(() => {
    const userType = this.appStore.userType()
    return (
      userType === UserType.PMO_HEAD || userType === UserType.INTERNAL_USER
    )
  })

  /**
   * All 4 priority levels with their due-in-7-days counts (0 when missing
   * from the response), so the breakdown row is always fully populated.
   */
  protected readonly priorityBreakdown = computed(() => {
    const priorities = this.appStore.lookupList()?.PriorityLevel ?? []
    const counts = new Map(
      this.dueIn7Breakdown().map((b) => [b.priorityLevel, b.followupCount]),
    )
    const useArabic = this.isArabic()
    return priorities
      .slice()
      .sort((a, b) => a.itemOrder - b.itemOrder)
      .map((p) => ({
        key: p.lookupKey,
        name: useArabic ? p.arName : p.enName,
        count: counts.get(p.lookupKey) ?? 0,
      }))
  })

  private readonly priorityVariants: Record<number, BadgeVariant> = {
    1: 'outline-error',
    2: 'outline-warning',
    3: 'outline-info',
    4: 'outline-success',
  }

  ngOnInit(): void {
    this.refresh()
  }

  protected refresh(): void {
    this.loadCounters()
    this.loadDueIn7Breakdown()
    this.loadLatest()
  }

  protected getPriorityVariant(id: number): BadgeVariant {
    return this.priorityVariants[id] ?? 'outline'
  }

  protected view(item: Followup): void {
    this.service
      .view(item)
      .afterClosed()
      .subscribe((result) => {
        if (
          result?.terminated ||
          result?.statusChanged ||
          result?.priorityChanged
        ) {
          this.loadLatest()
          this.loadCounters()
        }
      })
  }

  protected showLogs(item: Followup): void {
    this.service.viewLogs(item)
  }

  protected showComments(item: Followup): void {
    this.service.viewComments(item)
  }

  protected assignUser(item: Followup): void {
    this.service
      .openAssignUser(item)
      .afterClosed()
      .subscribe((result) => {
        if (!result) return
        this.loadLatest()
        this.loadCounters()
      })
  }

  protected changePriority(item: Followup): void {
    this.service
      .openChangePriority(item.id, item.priorityLevelInfo.id)
      .afterClosed()
      .subscribe((result) => {
        if (!result) return
        this.loadLatest()
        this.loadCounters()
        this.loadDueIn7Breakdown()
      })
  }

  private loadCounters(): void {
    this.countersLoading.set(true)
    this.service.getDashboardCounters().subscribe({
      next: (result) => {
        this.counters.set(result)
        this.countersLoading.set(false)
      },
      error: () => this.countersLoading.set(false),
    })
  }

  private loadDueIn7Breakdown(): void {
    this.service.getOverdueByPriorityLevel().subscribe({
      next: (result) => this.dueIn7Breakdown.set(result),
      error: () => this.dueIn7Breakdown.set([]),
    })
  }

  private loadLatest(): void {
    this.latestLoading.set(true)
    this.service.getAll({ page: 0, size: 5, criteria: '' }).subscribe({
      next: (page) => {
        this.latest.set(page.result ?? [])
        this.latestLoading.set(false)
      },
      error: () => this.latestLoading.set(false),
    })
  }
}
