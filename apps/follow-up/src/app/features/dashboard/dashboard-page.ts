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
} from '@follow-up/ui'
import { APP_ICONS } from '../../constants/icons'
import { FollowupService } from '../followup/services/followup.service'
import { Followup } from '../followup/models/followup'
import { FollowupDashboardCounters } from '../followup/models/followup-dashboard-counters'
import { FollowupLevelCount } from './models/followup-level-count'

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
          <ui-card-content class="flex items-center gap-4 p-5!">
            <div
              class="flex size-14 items-center justify-center rounded-full"
              [style.background-color]="'rgba(139, 92, 246, 0.15)'"
              [style.color]="'rgb(139, 92, 246)'"
            >
              <mat-icon
                class="text-2xl! size-7! leading-7!"
                [svgIcon]="icons.ARROW_DOWN"
              />
            </div>
            <div class="min-w-0 flex-1">
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
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Completed -->
        <ui-card>
          <ui-card-content class="flex items-center gap-4 p-5!">
            <div
              class="flex size-14 items-center justify-center rounded-full"
              [style.background-color]="'rgba(34, 197, 94, 0.15)'"
              [style.color]="'rgb(34, 197, 94)'"
            >
              <mat-icon
                class="text-2xl! size-7! leading-7!"
                [svgIcon]="icons.LIST_STATUS"
              />
            </div>
            <div class="min-w-0 flex-1">
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
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Due in 7 Days (with priority breakdown) -->
        <ui-card>
          <ui-card-content class="flex flex-col gap-3 p-5!">
            <div class="flex items-center gap-4">
              <div
                class="flex size-14 items-center justify-center rounded-full"
                [style.background-color]="'rgba(245, 158, 11, 0.15)'"
                [style.color]="'rgb(245, 158, 11)'"
              >
                <mat-icon
                  class="text-2xl! size-7! leading-7!"
                  [svgIcon]="icons.CLIPBOARD_TEXT_CLOCK"
                />
              </div>
              <div class="min-w-0 flex-1">
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
            </div>
            @if (dueIn7Breakdown().length) {
              <div class="flex items-stretch border-t border-border pt-3">
                @for (
                  item of dueIn7Breakdown();
                  track item.priorityLevel;
                  let last = $last
                ) {
                  <div class="flex-1 px-2 text-center">
                    <div class="truncate text-xs text-foreground-muted">
                      {{ item.getName() }}
                    </div>
                    <div class="mt-1 text-base font-bold text-foreground">
                      {{ item.followupCount }}
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
            }
          </ui-card-content>
        </ui-card>

        <!-- Overdue -->
        <ui-card>
          <ui-card-content class="flex items-center gap-4 p-5!">
            <div
              class="flex size-14 items-center justify-center rounded-full"
              [style.background-color]="'rgba(239, 68, 68, 0.15)'"
              [style.color]="'rgb(239, 68, 68)'"
            >
              <mat-icon
                class="text-2xl! size-7! leading-7!"
                [svgIcon]="icons.PRIORITY_HIGH"
              />
            </div>
            <div class="min-w-0 flex-1">
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
            </div>
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
                    {{ 'dashboard.doc_subject' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'dashboard.priority' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'dashboard.status' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'dashboard.due_date' | translate }}
                  </th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (item of latest(); track item.id) {
                  <tr uiTableRow>
                    <td uiTableCell>
                      <button
                        class="cursor-pointer text-start font-medium text-primary hover:underline"
                        (click)="view(item)"
                      >
                        {{ item.docSubject }}
                      </button>
                    </td>
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
                      {{ item.followUpStatusInfo.getName() }}
                    </td>
                    <td uiTableCell>{{ item.dueDate }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td
                      [attr.colspan]="4"
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
  protected readonly icons = APP_ICONS

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

  protected view(item: Followup): void {
    this.service.view(item)
  }

  protected getPriorityVariant(id: number): BadgeVariant {
    return this.priorityVariants[id] ?? 'outline'
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
