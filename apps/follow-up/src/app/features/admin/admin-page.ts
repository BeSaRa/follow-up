import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import { MatIcon } from '@angular/material/icon'
import { UiBreadcrumb, UiBreadcrumbItem } from '@follow-up/ui'
import { APP_ICONS } from '../../constants/icons'

const ADMIN_PAGES = [
  {
    path: 'application-user',
    label: 'application_user.title',
    description: 'application_user.description',
    icon: APP_ICONS.ACCOUNT_GROUP,
  },
  {
    path: 'external-site',
    label: 'external_site.title',
    description: 'external_site.description',
    icon: APP_ICONS.WEB,
  },
  {
    path: 'attachment-type',
    label: 'attachment_type.title',
    description: 'attachment_type.description',
    icon: APP_ICONS.PAPERCLIP,
  },
  {
    path: 'followup-status',
    label: 'followup_status.title',
    description: 'followup_status.description',
    icon: APP_ICONS.LIST_STATUS,
  },
  {
    path: 'priority-level',
    label: 'priority_level.title',
    description: 'priority_level.description',
    icon: APP_ICONS.PRIORITY_HIGH,
  },
]

@Component({
  selector: 'app-admin-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe, MatIcon, UiBreadcrumb, UiBreadcrumbItem],
  template: `
    <div class="space-y-6">
      <ui-breadcrumb>
        <ui-breadcrumb-item active>
          {{ 'admin.title' | translate }}
        </ui-breadcrumb-item>
      </ui-breadcrumb>

      <div>
        <h1 class="text-2xl font-bold text-foreground">
          {{ 'admin.title' | translate }}
        </h1>
        <p class="mt-1 text-sm text-foreground-muted">
          {{ 'admin.description' | translate }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (page of pages; track page.path) {
          <a
            [routerLink]="page.path"
            class="flex items-center gap-4 rounded-lg border border-border bg-surface-raised p-4 transition-colors hover:bg-surface-hover"
          >
            <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <mat-icon class="text-2xl! size-6! leading-6!" [svgIcon]="page.icon" />
            </div>
            <div>
              <span class="text-sm font-medium text-foreground">
                {{ page.label | translate }}
              </span>
              <p class="mt-0.5 text-xs text-foreground-muted">
                {{ page.description | translate }}
              </p>
            </div>
          </a>
        }
      </div>
    </div>
  `,
})
export class AdminPage {
  protected readonly pages = ADMIN_PAGES
}
