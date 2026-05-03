import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { DatePipe } from '@angular/common'
import { TranslatePipe } from '@ngx-translate/core'
import { MatIcon } from '@angular/material/icon'
import {
  UiBadge,
  UiBreadcrumb,
  UiBreadcrumbItem,
  UiButton,
  UiCard,
  UiCardContent,
  UiSelect,
  UiSelectOption,
  UiSkeleton,
  UiTooltip,
} from '@follow-up/ui'
import { APP_ICONS } from '../../constants/icons'
import { NotificationService } from './services/notification.service'
import { Notification } from './models/notification'

type NotificationFilter = 'all' | 'unread' | 'read'

@Component({
  selector: 'app-notifications-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    TranslatePipe,
    MatIcon,
    UiBadge,
    UiBreadcrumb,
    UiBreadcrumbItem,
    UiButton,
    UiCard,
    UiCardContent,
    UiSelect,
    UiSelectOption,
    UiSkeleton,
    UiTooltip,
  ],
  template: `
    <div class="space-y-6">
      <ui-breadcrumb>
        <ui-breadcrumb-item active>
          {{ 'notification.title' | translate }}
        </ui-breadcrumb-item>
      </ui-breadcrumb>

      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ 'notification.title' | translate }}
          </h1>
          <p class="mt-1 text-sm text-foreground-muted">
            {{ 'notification.description' | translate }}
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
        <ui-select
          class="w-56 [&>button]:bg-surface-raised!"
          [value]="filter()"
          [placeholder]="'notification.filter_status' | translate"
          (valueChange)="onFilterChange($event)"
        >
          <ui-select-option
            value="all"
            [label]="'notification.filter_all' | translate"
          >
            {{ 'notification.filter_all' | translate }}
          </ui-select-option>
          <ui-select-option
            value="unread"
            [label]="'notification.filter_unread' | translate"
          >
            {{ 'notification.filter_unread' | translate }}
          </ui-select-option>
          <ui-select-option
            value="read"
            [label]="'notification.filter_read' | translate"
          >
            {{ 'notification.filter_read' | translate }}
          </ui-select-option>
        </ui-select>
        <div class="ms-auto flex items-center gap-2 text-sm text-foreground-muted">
          <span>
            {{ 'notification.total' | translate }}:
            <strong class="text-foreground">{{ notifications().length }}</strong>
          </span>
          <span class="text-border">|</span>
          <span>
            {{ 'notification.unread' | translate }}:
            <strong class="text-foreground">{{ unreadCount() }}</strong>
          </span>
        </div>
      </div>

      <ui-card>
        <ui-card-content class="p-0!">
          @if (loading()) {
            <div class="space-y-3 p-4">
              @for (i of skeletonRows; track i) {
                <ui-skeleton width="100%" height="4rem" />
              }
            </div>
          } @else if (filteredNotifications().length === 0) {
            <div
              class="flex flex-col items-center justify-center py-16 text-foreground-muted"
            >
              <mat-icon
                class="text-4xl! size-10! leading-10! mb-3"
                [svgIcon]="icons.BELL_OUTLINE"
              />
              <p class="text-sm">
                {{ 'notification.no_data' | translate }}
              </p>
            </div>
          } @else {
            <ul class="divide-y divide-border">
              @for (item of filteredNotifications(); track item.id) {
                <li
                  class="flex gap-3 px-4 py-4 transition-colors hover:bg-surface-hover"
                  [class]="item.isRead ? 'opacity-70' : ''"
                >
                  <div
                    class="mt-2 size-2 shrink-0 rounded-full"
                    [class]="item.isRead ? 'bg-transparent' : 'bg-primary'"
                  ></div>
                  <button
                    type="button"
                    class="min-w-0 flex-1 text-start"
                    (click)="onNotificationClick(item)"
                  >
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="truncate text-sm font-medium text-foreground">
                        {{ item.followupSubject }}
                      </p>
                      @if (!item.isRead) {
                        <ui-badge variant="info" size="sm">
                          {{ 'notification.new' | translate }}
                        </ui-badge>
                      }
                    </div>
                    <p class="mt-1 text-xs text-foreground-muted">
                      {{ item.followupActionInfo.getName() }}
                      &mdash;
                      {{ item.actionToUserInfo.getName() }}
                    </p>
                    @if (item.actionDescription) {
                      <p class="mt-1 text-xs text-foreground-subtle">
                        {{ item.actionDescription }}
                      </p>
                    }
                    <p class="mt-2 text-xs text-foreground-muted">
                      {{ item.actionTime | date: 'medium' }}
                    </p>
                  </button>
                  @if (!item.isRead) {
                    <button
                      uiButton
                      variant="ghost"
                      size="sm"
                      class="self-start"
                      [attr.aria-label]="'notification.mark_as_read' | translate"
                      [uiTooltip]="'notification.mark_as_read' | translate"
                      (click)="markAsRead(item)"
                    >
                      <mat-icon
                        class="text-lg! size-5! leading-5!"
                        [svgIcon]="icons.EYE_OUTLINE"
                      />
                    </button>
                  }
                </li>
              }
            </ul>
          }
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class NotificationsPage implements OnInit {
  private readonly notificationService = inject(NotificationService)
  protected readonly icons = APP_ICONS

  protected readonly loading = signal(false)
  protected readonly filter = signal<NotificationFilter>('all')
  protected readonly notifications = this.notificationService.notifications
  protected readonly unreadCount = computed(() =>
    this.notificationService.unreadCount(),
  )
  protected readonly filteredNotifications = computed(() => {
    const list = this.notifications()
    const f = this.filter()
    if (f === 'unread') return list.filter((n) => !n.isRead)
    if (f === 'read') return list.filter((n) => n.isRead)
    return list
  })
  protected readonly skeletonRows = [0, 1, 2, 3, 4]

  ngOnInit() {
    this.refresh()
  }

  protected refresh() {
    this.loading.set(true)
    this.notificationService.loadActive().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    })
  }

  protected onFilterChange(value: unknown) {
    this.filter.set(value as NotificationFilter)
  }

  protected onNotificationClick(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe()
    }
  }

  protected markAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id).subscribe()
  }
}
