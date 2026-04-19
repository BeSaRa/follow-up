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
  UiDropdownMenu,
  UiDropdownTrigger,
  UiTooltip,
} from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { NotificationService } from '../services/notification.service'
import { Notification } from '../models/notification'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-notification-bell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    TranslatePipe,
    MatIcon,
    UiDropdownMenu,
    UiDropdownTrigger,
    UiTooltip,
  ],
  template: `
    <button
      type="button"
      class="relative inline-flex items-center justify-center rounded-md p-2 text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
      [uiTooltip]="'notification.title' | translate"
      uiTooltipPosition="below"
      [uiDropdownTrigger]="notificationMenu"
    >
      <mat-icon
        class="text-xl! size-5! leading-5!"
        [svgIcon]="icons.BELL_OUTLINE"
      />
      @if (unreadCount() > 0) {
        <span
          class="absolute -top-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
        >
          {{ unreadCount() > 9 ? '9+' : unreadCount() }}
        </span>
      }
    </button>

    <ui-dropdown-menu #notificationMenu position="below-end">
      <div class="w-80">
        <div class="flex items-center justify-between border-b border-border px-4 py-3">
          <span class="text-sm font-semibold text-foreground">
            {{ 'notification.title' | translate }}
          </span>
          @if (unreadCount() > 0) {
            <span class="text-xs text-foreground-muted">
              {{ unreadCount() }} {{ 'notification.unread' | translate }}
            </span>
          }
        </div>

        <div class="max-h-80 overflow-y-auto">
          @if (loading()) {
            <div class="flex items-center justify-center py-8">
              <span class="text-sm text-foreground-muted">
                {{ 'notification.loading' | translate }}
              </span>
            </div>
          } @else if (notifications().length === 0) {
            <div class="flex items-center justify-center py-8">
              <span class="text-sm text-foreground-muted">
                {{ 'notification.no_data' | translate }}
              </span>
            </div>
          } @else {
            @for (notification of notifications(); track notification.id) {
              <button
                type="button"
                class="flex w-full gap-3 px-4 py-3 text-start transition-colors hover:bg-surface-hover"
                [class]="notification.isRead ? 'opacity-60' : ''"
                (click)="onNotificationClick(notification)"
              >
                <div
                  class="mt-1.5 size-2 shrink-0 rounded-full"
                  [class]="notification.isRead ? 'bg-transparent' : 'bg-primary'"
                ></div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-foreground">
                    {{ notification.followupSubject }}
                  </p>
                  <p class="mt-0.5 truncate text-xs text-foreground-muted">
                    {{ notification.followupActionInfo.getName() }}
                    &mdash;
                    {{ notification.actionToUserInfo.getName() }}
                  </p>
                  @if (notification.actionDescription) {
                    <p class="mt-0.5 truncate text-xs text-foreground-subtle">
                      {{ notification.actionDescription }}
                    </p>
                  }
                  <p class="mt-1 text-xs text-foreground-muted">
                    {{ notification.actionTime | date: 'short' }}
                  </p>
                </div>
              </button>
            }
          }
        </div>
      </div>
    </ui-dropdown-menu>
  `,
})
export class NotificationBell implements OnInit {
  private readonly notificationService = inject(NotificationService)
  protected readonly icons = APP_ICONS

  protected readonly loading = signal(false)
  protected readonly notifications = this.notificationService.notifications
  protected readonly unreadCount = computed(() => this.notificationService.unreadCount())

  ngOnInit() {
    this.loadNotifications()
  }

  protected onNotificationClick(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe()
    }
  }

  private loadNotifications() {
    this.loading.set(true)
    this.notificationService.loadActive().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    })
  }
}
