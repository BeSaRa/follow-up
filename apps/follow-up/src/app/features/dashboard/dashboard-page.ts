import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { MatIcon } from '@angular/material/icon'
import {
  BadgeVariant,
  UiBadge,
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
} from '@follow-up/ui'
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import type { ECharts } from 'echarts/core'
import { APP_ICONS } from '../../constants/icons'
import { FollowupService } from '../followup/services/followup.service'
import { Followup } from '../followup/models/followup'
import { FollowupDashboardCounters } from '../followup/models/followup-dashboard-counters'
import { FollowupLevelCount } from './models/followup-level-count'
import { DocumentClass } from '../../shared/enums/document-class'
import { SecurityLevel } from '../../shared/enums/security-level'
import { UserType } from '../../shared/enums/user-type'
import { AppStore } from '../../shared/stores/app-store'

/**
 * Tailwind classes (tinted bg + matching text/icon color) per UiBadge variant.
 * Used to color the priority list's icon circles from the lookupStrKey value.
 * Class names are spelled out so Tailwind picks them up at build time.
 */
const VARIANT_COLOR_CLASSES: Record<BadgeVariant, string> = {
  primary: 'bg-primary/15 text-primary',
  secondary: 'bg-secondary/15 text-secondary',
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  info: 'bg-info/15 text-info',
  outline: 'bg-surface text-foreground-muted',
  'outline-primary': 'bg-primary/15 text-primary',
  'outline-secondary': 'bg-secondary/15 text-secondary',
  'outline-accent': 'bg-accent/15 text-accent',
  'outline-success': 'bg-success/15 text-success',
  'outline-warning': 'bg-warning/15 text-warning',
  'outline-error': 'bg-error/15 text-error',
  'outline-info': 'bg-info/15 text-info',
}

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
    NgxEchartsDirective,
  ],
  template: `
    <div class="space-y-6">
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
        <ui-card shadow="none">
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
              <p class="mt-8 text-6xl font-bold text-foreground">
                {{ counters().incomingCount }}
              </p>
            }
          </ui-card-content>
        </ui-card>

        <!-- Completed -->
        <ui-card shadow="none">
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
              <p class="mt-8 text-6xl font-bold text-foreground">
                {{ counters().completedCount }}
              </p>
            }
          </ui-card-content>
        </ui-card>

        <!-- Due in 7 Days (with priority breakdown) -->
        <ui-card shadow="none">
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
                <p class="text-4xl font-bold text-foreground">
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
        <ui-card shadow="none" class="bg-primary! border-primary!">
          <ui-card-content class="relative flex min-h-32 flex-col justify-start p-4!">
            <div
              class="absolute top-4 end-4 flex size-14 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground"
            >
              <mat-icon
                class="text-2xl! size-7! leading-7!"
                [svgIcon]="icons.PRIORITY_HIGH"
              />
            </div>
            <p class="text-sm text-primary-foreground/80">
              {{ 'dashboard.overdue' | translate }}
            </p>
            @if (countersLoading()) {
              <ui-skeleton width="4rem" height="2rem" />
            } @else {
              <p class="mt-8 text-6xl font-bold text-primary-foreground">
                {{ counters().overdueCount }}
              </p>
            }
          </ui-card-content>
        </ui-card>
      </div>

      <ui-card shadow="none" class="overflow-hidden">
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
            <table uiTable striped stripeColor="#FBFCFD">
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
                  <th uiTableHead class="w-[320px] [&>div]:justify-center">
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
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ui-card shadow="none" class="flex flex-col">
            <ui-card-content class="flex flex-1 flex-col p-4!">
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
                <div class="divide-y divide-border">
                  @for (item of priorityListFull(); track item.key) {
                    <div class="flex items-center gap-3 px-2 py-3">
                      <div
                        [class]="
                          'flex size-10 shrink-0 items-center justify-center rounded-full ' +
                          item.colorClass
                        "
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
              <div
                echarts
                [options]="priorityChartOptions()"
                [loading]="priorityCountsLoading()"
                class="mt-auto h-28 w-full shrink-0"
              ></div>
            </ui-card-content>
          </ui-card>

          <ui-card shadow="none">
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
                <div class="divide-y divide-border">
                  @for (item of securityListFull(); track item.key) {
                    <div class="flex items-center gap-3 px-2 py-3">
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
              <!-- Temporarily hidden while reviewing card sizing -->
              <!-- <div
                echarts
                [options]="securityChartOptions()"
                [loading]="securityLoading()"
                class="mt-4 h-28 w-full"
              ></div> -->
            </ui-card-content>
          </ui-card>
        </div>

        <ui-card shadow="none">
          <ui-card-content class="p-4!">
            <h2 class="mb-2 text-lg font-semibold text-foreground">
              {{ 'dashboard.distribution_title' | translate }}
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="flex flex-col gap-2 sm:col-span-1">
                @for (slice of pieSlices(); track slice.name) {
                  <button
                    type="button"
                    class="cursor-pointer rounded-lg bg-[#F3F5F7] p-3 text-start transition hover:bg-[#E7ECEF] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    [class.opacity-50]="hiddenSlices().has(slice.name)"
                    (mouseenter)="onLegendItemEnter(slice.name)"
                    (mouseleave)="onLegendItemLeave(slice.name)"
                    (click)="onLegendItemToggle(slice.name)"
                  >
                    <div class="flex items-center gap-2">
                      <span
                        class="inline-block size-2.5 shrink-0 rounded-full"
                        [style.background-color]="slice.color"
                      ></span>
                      <span class="text-sm font-medium text-foreground">
                        {{ slice.name }}
                      </span>
                    </div>
                    <div class="mt-1 flex items-baseline gap-2">
                      <span class="text-xl font-bold text-foreground">
                        {{ slice.value }}
                      </span>
                      <span class="text-xs text-foreground-muted">
                        {{ 'dashboard.correspondences' | translate }}
                      </span>
                    </div>
                  </button>
                }
              </div>
              <div
                echarts
                [options]="chartOptions()"
                [loading]="countersLoading()"
                (chartInit)="onPieChartInit($event)"
                class="h-72 w-full sm:col-span-2"
              ></div>
            </div>
          </ui-card-content>
        </ui-card>
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
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => this.currentLang.set(e.lang))

    // Deep-link bridge: when the URL asks to open an item and the row is
    // present in the latest list, open the view dialog for it.
    effect(() => {
      const targetId = this.openItemId()
      const rows = this.latest()
      if (targetId === null) return
      if (this.openDialogRef !== null) return
      if (rows.length === 0) return
      const row = rows.find((r) => r.id === targetId)
      if (!row) return
      untracked(() => this.openViewDialog(row))
    })
  }

  /** Echarts instance for the distribution donut — captured via (chartInit). */
  private pieChart: ECharts | null = null
  /** Slice names toggled off via the custom legend list. */
  protected readonly hiddenSlices = signal<Set<string>>(new Set())

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
   * Mocked icon per priority level. The backend doesn't expose icon metadata
   * yet — once it does, this map can be removed and the response field used
   * directly. Color comes from each priority lookup's `lookupStrKey`.
   */
  private readonly priorityMeta: Record<number, { icon: string }> = {
    1: { icon: APP_ICONS.PRIORITY_HIGH },
    2: { icon: APP_ICONS.FLAG_OUTLINE },
    3: { icon: APP_ICONS.FLAG_OUTLINE },
    4: { icon: APP_ICONS.FLAG_OUTLINE },
  }

  /**
   * Colors per security level, keyed by the lookup value defined in
   * {@link SecurityLevel}. Severity escalates green → blue → purple → orange
   * → red (Normal → Secret → Private Personal → Confidential → Top Secret).
   * Used to tint each level's icon circle in the security list.
   */
  private readonly securityMeta: Record<
    number,
    { color: string; bg: string }
  > = {
    [SecurityLevel.NORMAL]: {
      color: 'rgb(34, 197, 94)',
      bg: 'rgba(34, 197, 94, 0.15)',
    },
    [SecurityLevel.SECRET]: {
      color: 'rgb(59, 130, 246)',
      bg: 'rgba(59, 130, 246, 0.15)',
    },
    [SecurityLevel.PRIVATE_PERSONAL]: {
      color: 'rgb(168, 85, 247)',
      bg: 'rgba(168, 85, 247, 0.15)',
    },
    [SecurityLevel.CONFIDENTIAL]: {
      color: 'rgb(245, 158, 11)',
      bg: 'rgba(245, 158, 11, 0.15)',
    },
    [SecurityLevel.TOP_SECRET]: {
      color: 'rgb(239, 68, 68)',
      bg: 'rgba(239, 68, 68, 0.15)',
    },
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

  /**
   * Slices for the distribution donut. Shared between the echarts options
   * and the custom legend list rendered next to the chart, so colors and
   * counts stay in lockstep.
   */
  protected readonly pieSlices = computed(() => {
    // Read currentLang so labels recompute on language switch.
    this.currentLang()
    const c = this.counters()
    const t = (key: string) => this.translate.instant(key)
    return [
      {
        value: c.incomingCount,
        name: t('dashboard.incoming'),
        color: '#A39474',
      },
      {
        value: c.completedCount,
        name: t('dashboard.completed'),
        color: '#D0DDE3',
      },
      {
        value: c.overDueWithin7DaysCount,
        name: t('dashboard.due_in_7_days'),
        color: '#C8849A',
      },
      {
        value: c.overdueCount,
        name: t('dashboard.overdue'),
        color: '#8A1538',
      },
    ]
  })

  /** Pie chart options for the follow-up distribution donut. */
  protected readonly chartOptions = computed<EChartsOption>(() => {
    const slices = this.pieSlices()
    const hidden = this.hiddenSlices()
    const selected = Object.fromEntries(
      slices.map((s) => [s.name, !hidden.has(s.name)]),
    )
    const visibleTotal = slices.reduce(
      (sum, s) => (hidden.has(s.name) ? sum : sum + s.value),
      0,
    )
    return {
      textStyle: { fontFamily: 'Lusail' },
      tooltip: {
        trigger: 'item',
        // Default tooltip uses float-based layout that breaks in RTL; render
        // our own row so the marker, name, and value stay aligned in Arabic.
        extraCssText: this.isArabic() ? 'direction: rtl;' : '',
        formatter: (params) => {
          const p = params as {
            name: string
            value: number
            percent: number
            color: string
          }
          const marker = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color};flex-shrink:0;"></span>`
          const label = `<span>${p.name}</span>`
          const value = `<strong style="margin-inline-start:12px;">${p.value} (${p.percent}%)</strong>`
          return `<div style="display:flex;align-items:center;gap:6px;">${marker}${label}${value}</div>`
        },
      },
      // Hidden legend keeps echarts' selection state so dispatchAction
      // ('legendToggleSelect') works from our custom legend list.
      legend: {
        show: false,
        data: slices.map((s) => s.name),
        selected,
      },
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '42%',
          style: {
            text: String(visibleTotal),
            textAlign: 'center',
            fontFamily: 'Lusail',
            fontSize: 28,
            fontWeight: 'bold',
            fill: '#0f172a',
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '56%',
          style: {
            text: this.translate.instant('dashboard.total'),
            textAlign: 'center',
            fontFamily: 'Lusail',
            fontSize: 12,
            fill: '#64748b',
          },
        },
      ],
      series: [
        {
          type: 'pie',
          radius: ['55%', '75%'],
          center: ['50%', '50%'],
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
      textStyle: { fontFamily: 'Lusail' },
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
          // All bars share a single vertical gradient regardless of level.
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#4194B3' },
                { offset: 1, color: '#276B8A' },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
          data: data.map((s) => s.followupCount),
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
    const variantMap = this.priorityVariantMap()
    const counts = new Map(
      this.priorityCounts().map((b) => [b.priorityLevel, b.followupCount]),
    )
    const useArabic = this.isArabic()
    return priorities
      .slice()
      .sort((a, b) => a.itemOrder - b.itemOrder)
      .map((p) => {
        const variant = variantMap.get(p.lookupKey) ?? 'outline'
        return {
          key: p.lookupKey,
          name: useArabic ? p.arName : p.enName,
          count: counts.get(p.lookupKey) ?? 0,
          icon:
            this.priorityMeta[p.lookupKey]?.icon ?? APP_ICONS.FLAG_OUTLINE,
          colorClass:
            VARIANT_COLOR_CLASSES[variant] ?? VARIANT_COLOR_CLASSES.outline,
        }
      })
  })

  /**
   * Vertical bar chart for the priority level distribution. Uses the same
   * single gradient as the security chart so the two cards read as a pair.
   */
  protected readonly priorityChartOptions = computed<EChartsOption>(() => {
    const items = this.priorityListFull()
    return {
      textStyle: { fontFamily: 'Lusail' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 8, right: 8, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: 'category',
        data: items.map((p) => p.name),
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
          // Same vertical gradient as the security chart bars.
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#4194B3' },
                { offset: 1, color: '#276B8A' },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
          data: items.map((p) => p.count),
          barWidth: '50%',
        },
      ],
    }
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

  /**
   * Priority badge variants resolved from the PriorityLevel lookup's
   * lookupStrKey (configured via the admin priority-level form). Falls
   * back to a plain outline badge when no color is configured.
   */
  private readonly priorityVariantMap = computed(() => {
    const lookups = this.appStore.lookupList()?.PriorityLevel ?? []
    const map = new Map<number, BadgeVariant>()
    for (const p of lookups) {
      if (p.lookupStrKey) {
        map.set(p.lookupKey, p.lookupStrKey as BadgeVariant)
      }
    }
    return map
  })

  ngOnInit(): void {
    this.refresh()
  }

  protected onPieChartInit(chart: ECharts): void {
    this.pieChart = chart
  }

  protected onLegendItemEnter(name: string): void {
    if (this.hiddenSlices().has(name)) return
    this.pieChart?.dispatchAction({ type: 'highlight', seriesIndex: 0, name })
  }

  protected onLegendItemLeave(name: string): void {
    this.pieChart?.dispatchAction({ type: 'downplay', seriesIndex: 0, name })
  }

  protected onLegendItemToggle(name: string): void {
    this.hiddenSlices.update((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
    this.pieChart?.dispatchAction({ type: 'legendToggleSelect', name })
  }

  protected refresh(): void {
    this.loadCounters()
    this.loadDueIn7Breakdown()
    this.loadLatest()
    this.loadSecurityBreakdown()
    this.loadPriorityBreakdown()
  }

  protected getPriorityVariant(id: number): BadgeVariant {
    return this.priorityVariantMap().get(id) ?? 'outline'
  }

  protected view(item: Followup): void {
    // Push ?action=open&item={id} onto the URL — the effect in the
    // constructor watches that and opens the dialog for us, so refreshing
    // the dashboard re-opens the same item.
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
      // Clear the open-dialog params before reloading so the effect doesn't
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
