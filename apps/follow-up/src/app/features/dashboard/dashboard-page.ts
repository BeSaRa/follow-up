import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
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
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
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
  // Component-level provider keeps echarts inside the dashboard's lazy chunk
  // instead of inflating the initial bundle.
  providers: [provideEchartsCore({ echarts })],
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
    NgxEchartsDirective,
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
        <button
          uiButton
          variant="outline"
          size="sm"
          [disabled]="countersLoading() || latestLoading()"
          (click)="refresh()"
        >
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
            <table uiTable>
              <thead uiTableHeader>
                <tr uiTableRow>
                  <th uiTableHead resizable class="w-[300px]">
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
                    <td [attr.colspan]="10">
                      @if (latestLoading()) {
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
                            {{ 'dashboard.no_data' | translate }}
                          </p>
                        </div>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </ui-card-content>
      </ui-card>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ui-card>
          <ui-card-content class="p-4!">
            <h2 class="mb-2 text-lg font-semibold text-foreground">
              {{ 'dashboard.distribution_title' | translate }}
            </h2>
            <div
              echarts
              [options]="chartOptions()"
              [loading]="countersLoading()"
              class="h-80 w-full"
            ></div>
          </ui-card-content>
        </ui-card>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ui-card>
            <ui-card-content class="p-4!">
              <h2 class="mb-3 text-lg font-semibold text-foreground">
                {{ 'dashboard.security_distribution_title' | translate }}
              </h2>
              @if (securityLoading()) {
                <div class="space-y-2">
                  @for (i of [1, 2, 3, 4]; track i) {
                    <ui-skeleton width="100%" height="2.5rem" />
                  }
                </div>
              } @else {
                <div class="space-y-2">
                  @for (item of securityListFull(); track item.key) {
                    <div class="flex items-center gap-3">
                      <div
                        class="flex size-8 shrink-0 items-center justify-center rounded-full"
                        [style.background-color]="item.bg"
                        [style.color]="item.color"
                      >
                        <mat-icon
                          class="text-base! size-4! leading-4!"
                          [svgIcon]="icons.LOCK_OUTLINE"
                        />
                      </div>
                      <p class="min-w-0 flex-1 truncate text-sm">
                        <span class="font-bold text-foreground">
                          {{ item.count }}
                        </span>
                        <span class="ms-1 font-semibold text-foreground">
                          {{ item.name }}
                        </span>
                      </p>
                      <p
                        class="shrink-0 text-xs font-medium text-foreground-muted"
                      >
                        {{ item.percent }}%
                      </p>
                    </div>
                  }
                </div>
              }
              <div
                echarts
                [options]="securityChartOptions()"
                [loading]="securityLoading()"
                class="mt-4 h-28 w-full"
              ></div>
            </ui-card-content>
          </ui-card>

          <ui-card>
            <ui-card-content class="p-4!">
              <h2 class="mb-3 text-lg font-semibold text-foreground">
                {{ 'dashboard.priority_distribution_title' | translate }}
              </h2>
              @if (priorityCountsLoading()) {
                <div class="space-y-2">
                  @for (i of [1, 2, 3, 4]; track i) {
                    <ui-skeleton width="100%" height="3rem" />
                  }
                </div>
              } @else {
                <div class="space-y-2">
                  @for (item of priorityListFull(); track item.key) {
                    <div class="flex items-center gap-3">
                      <div
                        class="flex size-10 shrink-0 items-center justify-center rounded-full"
                        [style.background-color]="item.bg"
                        [style.color]="item.color"
                      >
                        <mat-icon
                          class="text-lg! size-5! leading-5!"
                          [svgIcon]="item.icon"
                        />
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="font-semibold text-foreground">
                          {{ item.name }}
                        </p>
                        <p class="text-xs text-foreground-muted">
                          {{
                            'dashboard.priority_attention_count'
                              | translate: { count: item.count }
                          }}
                        </p>
                      </div>
                    </div>
                  }
                </div>
              }
            </ui-card-content>
          </ui-card>
        </div>
      </div>
    </div>
  `,
})
export class DashboardPage implements OnInit {
  private readonly service = inject(FollowupService)
  private readonly translate = inject(TranslateService)
  private readonly appStore = inject(AppStore)
  private readonly destroyRef = inject(DestroyRef)
  protected readonly icons = APP_ICONS
  protected readonly DocumentClass = DocumentClass

  // Drives reactivity for anything that needs to recompute on language switch
  // (priorityBreakdown, chartOptions). ngx-translate's currentLang isn't a
  // signal, so we mirror it through onLangChange.
  private readonly currentLang = signal(this.translate.currentLang || 'ar')

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => this.currentLang.set(e.lang))
  }

  protected readonly counters = signal<FollowupDashboardCounters>(
    new FollowupDashboardCounters(),
  )
  protected readonly countersLoading = signal(false)
  protected readonly dueIn7Breakdown = signal<FollowupLevelCount[]>([])
  protected readonly latest = signal<Followup[]>([])
  protected readonly latestLoading = signal(false)
  protected readonly skeletonRows = [1, 2, 3, 4, 5] as const
  protected readonly securityCounts = signal<FollowupLevelCount[]>([])
  protected readonly securityLoading = signal(false)
  protected readonly priorityCounts = signal<FollowupLevelCount[]>([])
  protected readonly priorityCountsLoading = signal(false)

  /**
   * Mocked icon + color per priority level. The backend doesn't expose icon
   * metadata yet — once it does, this map can be removed and the response
   * fields used directly.
   */
  private readonly priorityMeta: Record<
    number,
    { icon: string; color: string; bg: string }
  > = {
    1: {
      icon: APP_ICONS.PRIORITY_HIGH,
      color: 'rgb(239, 68, 68)',
      bg: 'rgba(239, 68, 68, 0.15)',
    },
    2: {
      icon: APP_ICONS.FLAG_OUTLINE,
      color: 'rgb(245, 158, 11)',
      bg: 'rgba(245, 158, 11, 0.15)',
    },
    3: {
      icon: APP_ICONS.FLAG_OUTLINE,
      color: 'rgb(59, 130, 246)',
      bg: 'rgba(59, 130, 246, 0.15)',
    },
    4: {
      icon: APP_ICONS.FLAG_OUTLINE,
      color: 'rgb(34, 197, 94)',
      bg: 'rgba(34, 197, 94, 0.15)',
    },
  }

  /** Mocked colors per security level until backend exposes metadata. */
  private readonly securityMeta: Record<
    number,
    { color: string; bg: string }
  > = {
    1: { color: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.15)' },
    2: { color: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.15)' },
    3: { color: 'rgb(245, 158, 11)', bg: 'rgba(245, 158, 11, 0.15)' },
    4: { color: 'rgb(239, 68, 68)', bg: 'rgba(239, 68, 68, 0.15)' },
  }

  protected readonly isArabic = computed(() => this.currentLang() === 'ar')
  protected readonly isPmoHead = computed(
    () => this.appStore.userType() === UserType.PMO_HEAD,
  )
  protected readonly canUpdatePriority = computed(() => {
    const userType = this.appStore.userType()
    return (
      userType === UserType.PMO_HEAD || userType === UserType.INTERNAL_USER
    )
  })

  /** Pie chart options for the follow-up distribution donut. */
  protected readonly chartOptions = computed<EChartsOption>(() => {
    const isRtl = this.currentLang() === 'ar'
    const c = this.counters()
    const t = (key: string) => this.translate.instant(key)
    // Slices mirror the 4 stat cards (same counters, labels, and colors).
    const slices = [
      {
        value: c.incomingCount,
        name: t('dashboard.incoming'),
        color: 'rgb(139, 92, 246)',
      },
      {
        value: c.completedCount,
        name: t('dashboard.completed'),
        color: 'rgb(34, 197, 94)',
      },
      {
        value: c.overDueWithin7DaysCount,
        name: t('dashboard.due_in_7_days'),
        color: 'rgb(245, 158, 11)',
      },
      {
        value: c.overdueCount,
        name: t('dashboard.overdue'),
        color: 'rgb(239, 68, 68)',
      },
    ]
    const total = slices.reduce((sum, s) => sum + s.value, 0)
    // Labels on the right in RTL, on the left in LTR; the pie sits on the
    // opposite side to leave room for them.
    const pieCenterX = isRtl ? '30%' : '70%'
    const legendPos = isRtl ? { right: '2%' } : { left: '2%' }
    return {
      tooltip: { trigger: 'item' },
      legend: {
        orient: 'vertical',
        top: 'middle',
        ...legendPos,
        itemGap: 12,
        textStyle: { fontSize: 12 },
      },
      graphic: [
        {
          type: 'text',
          left: pieCenterX,
          top: '42%',
          style: {
            text: String(total),
            textAlign: 'center',
            fontSize: 28,
            fontWeight: 'bold',
            fill: '#0f172a',
          },
        },
        {
          type: 'text',
          left: pieCenterX,
          top: '56%',
          style: {
            text: t('dashboard.total'),
            textAlign: 'center',
            fontSize: 12,
            fill: '#64748b',
          },
        },
      ],
      series: [
        {
          type: 'pie',
          radius: ['55%', '75%'],
          center: [pieCenterX, '50%'],
          avoidLabelOverlap: false,
          label: { show: false },
          labelLine: { show: false },
          itemStyle: { borderColor: '#fff', borderWidth: 2 },
          data: slices.map((s) => ({
            value: s.value,
            name: s.name,
            itemStyle: { color: s.color },
          })),
        },
      ],
    }
  })

  /**
   * Security level list with each row's count, name, percentage of total,
   * and (mocked) color metadata.
   */
  protected readonly securityListFull = computed(() => {
    const items = this.securityCounts()
    const total = items.reduce((sum, i) => sum + i.followupCount, 0)
    const useArabic = this.isArabic()
    const fallback = {
      color: 'rgb(100, 116, 139)',
      bg: 'rgba(100, 116, 139, 0.15)',
    }
    return items
      .slice()
      .sort((a, b) => a.securityLevel - b.securityLevel)
      .map((s) => {
        const meta = this.securityMeta[s.securityLevel] ?? fallback
        return {
          key: s.securityLevel,
          name: useArabic ? s.arName : s.enName,
          count: s.followupCount,
          percent: total > 0 ? Math.round((s.followupCount / total) * 100) : 0,
          color: meta.color,
          bg: meta.bg,
        }
      })
  })

  /** Vertical bar chart for the security level distribution. */
  protected readonly securityChartOptions = computed<EChartsOption>(() => {
    const useArabic = this.isArabic()
    const data = this.securityCounts()
      .slice()
      .sort((a, b) => a.securityLevel - b.securityLevel)
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 8, right: 8, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: 'category',
        data: data.map((s) => (useArabic ? s.arName : s.enName)),
        axisLabel: { fontSize: 11, interval: 0, hideOverlap: true },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 11 },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
      },
      series: [
        {
          type: 'bar',
          data: data.map((s) => s.followupCount),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#4194b3' },
                { offset: 1, color: '#0d4262' },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: '50%',
        },
      ],
    }
  })

  /**
   * Priority level list with all 4 priorities (zero-filled), each annotated
   * with the mocked icon/color metadata until the backend exposes it.
   */
  protected readonly priorityListFull = computed(() => {
    const priorities = this.appStore.lookupList()?.PriorityLevel ?? []
    const counts = new Map(
      this.priorityCounts().map((b) => [b.priorityLevel, b.followupCount]),
    )
    const useArabic = this.isArabic()
    const fallback = {
      icon: APP_ICONS.FLAG_OUTLINE,
      color: 'rgb(100, 116, 139)',
      bg: 'rgba(100, 116, 139, 0.15)',
    }
    return priorities
      .slice()
      .sort((a, b) => a.itemOrder - b.itemOrder)
      .map((p) => {
        const meta = this.priorityMeta[p.lookupKey] ?? fallback
        return {
          key: p.lookupKey,
          name: useArabic ? p.arName : p.enName,
          count: counts.get(p.lookupKey) ?? 0,
          icon: meta.icon,
          color: meta.color,
          bg: meta.bg,
        }
      })
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
    this.loadSecurityBreakdown()
    this.loadPriorityBreakdown()
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

  private loadSecurityBreakdown(): void {
    this.securityLoading.set(true)
    this.securityCounts.set([])
    this.service.getCountBySecurityLevel().subscribe({
      next: (result) => {
        this.securityCounts.set(result)
        this.securityLoading.set(false)
      },
      error: () => this.securityLoading.set(false),
    })
  }

  private loadPriorityBreakdown(): void {
    this.priorityCountsLoading.set(true)
    this.priorityCounts.set([])
    this.service.getCountByPriorityLevel().subscribe({
      next: (result) => {
        this.priorityCounts.set(result)
        this.priorityCountsLoading.set(false)
      },
      error: () => this.priorityCountsLoading.set(false),
    })
  }

  private loadLatest(): void {
    this.latestLoading.set(true)
    // Clear current rows so the @empty branch renders skeletons on every
    // refresh, matching CrudPageDirective's loadData() behaviour.
    this.latest.set([])
    this.service.getAll({ page: 0, size: 5, criteria: '' }).subscribe({
      next: (page) => {
        this.latest.set(page.result ?? [])
        this.latestLoading.set(false)
      },
      error: () => this.latestLoading.set(false),
    })
  }
}
