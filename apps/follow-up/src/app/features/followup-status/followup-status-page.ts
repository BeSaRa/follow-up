import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import { MatIcon } from '@angular/material/icon'
import {
  UiBadge,
  UiBreadcrumb,
  UiBreadcrumbItem,
  UiBreadcrumbSeparatorItem,
  UiButton,
  UiCard,
  UiCardContent,
  UiInput,
  UiMenu,
  UiMenuItem,
  UiMenuTrigger,
  UiPagination,
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
import { FollowupStatusService } from './services/followup-status.service'
import { FollowupStatus } from './models/followup-status'

@Component({
  selector: 'app-followup-status-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslatePipe,
    MatIcon,
    UiBreadcrumb,
    UiBreadcrumbItem,
    UiBreadcrumbSeparatorItem,
    UiCard,
    UiCardContent,
    UiTable,
    UiTableHeader,
    UiTableBody,
    UiTableRow,
    UiTableHead,
    UiTableCell,
    UiBadge,
    UiButton,
    UiInput,
    UiPagination,
    UiSkeleton,
    UiMenu,
    UiMenuItem,
    UiMenuTrigger,
  ],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb -->
      <ui-breadcrumb>
        <ui-breadcrumb-item>
          <a routerLink="/dashboard">{{ 'layout.dashboard' | translate }}</a>
        </ui-breadcrumb-item>
        <ui-breadcrumb-separator>»</ui-breadcrumb-separator>
        <ui-breadcrumb-item active>
          {{ 'followup_status.title' | translate }}
        </ui-breadcrumb-item>
      </ui-breadcrumb>

      <!-- Page Header -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ 'followup_status.title' | translate }}
          </h1>
          <p class="mt-1 text-sm text-foreground-muted">
            {{ 'followup_status.description' | translate }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button uiButton variant="outline" size="sm" (click)="refresh()">
            <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.REFRESH" />
          </button>
          <button uiButton variant="primary" size="sm">
            <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.PLUS" />
            {{ 'followup_status.add' | translate }}
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="flex items-center gap-3">
        <div class="relative max-w-sm flex-1">
          <mat-icon
            class="absolute start-3 top-1/2 -translate-y-1/2 text-lg! size-5! leading-5! text-foreground-subtle"
            [svgIcon]="icons.MAGNIFY"
          />
          <input
            uiInput
            type="text"
            class="bg-surface-raised! ps-10"
            [placeholder]="'followup_status.search_placeholder' | translate"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
          />
        </div>
      </div>

      <!-- Table Card -->
      <ui-card>
        <ui-card-content class="p-0!">
          @if (loading() && !models().length) {
            <div class="space-y-4 p-6">
              @for (i of skeletonRows; track i) {
                <ui-skeleton width="100%" height="2.5rem" />
              }
            </div>
          } @else if (models().length) {
            <div class="overflow-x-auto">
              <table uiTable>
                <thead uiTableHeader>
                  <tr uiTableRow>
                    <th uiTableHead>
                      {{ 'followup_status.ar_name' | translate }}
                    </th>
                    <th uiTableHead>
                      {{ 'followup_status.en_name' | translate }}
                    </th>
                    <th uiTableHead>
                      {{ 'followup_status.lookup_key' | translate }}
                    </th>
                    <th uiTableHead>
                      {{ 'followup_status.category' | translate }}
                    </th>
                    <th uiTableHead>
                      {{ 'followup_status.status' | translate }}
                    </th>
                    <th uiTableHead class="w-12"></th>
                  </tr>
                </thead>
                <tbody uiTableBody>
                  @for (item of models(); track item.id) {
                    <tr uiTableRow>
                      <td uiTableCell class="font-medium text-primary">
                        {{ item.arName }}
                      </td>
                      <td uiTableCell>{{ item.enName }}</td>
                      <td uiTableCell>{{ item.lookupKey }}</td>
                      <td uiTableCell>{{ item.category }}</td>
                      <td uiTableCell>
                        <ui-badge
                          [variant]="item.status ? 'success' : 'error'"
                          size="sm"
                        >
                          {{
                            (item.status
                              ? 'followup_status.active'
                              : 'followup_status.inactive'
                            ) | translate
                          }}
                        </ui-badge>
                      </td>
                      <td uiTableCell>
                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-md p-1 text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                          [uiMenuTrigger]="actionMenu"
                          [menuPosition]="'below-end'"
                        >
                          <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.DOTS_VERTICAL" />
                        </button>
                        <ui-menu #actionMenu>
                          <ui-menu-item>
                            <span class="flex items-center gap-2">
                              <mat-icon class="text-base! size-4! leading-4!" [svgIcon]="icons.PENCIL" />
                              {{ 'followup_status.edit' | translate }}
                            </span>
                          </ui-menu-item>
                          <ui-menu-item>
                            <span class="flex items-center gap-2 text-error">
                              <mat-icon class="text-base! size-4! leading-4!" [svgIcon]="icons.DELETE" />
                              {{ 'followup_status.delete' | translate }}
                            </span>
                          </ui-menu-item>
                        </ui-menu>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="border-t border-border">
              <ui-pagination
                [totalItems]="totalElements()"
                [pageSize]="pageSize()"
                [pageIndex]="pageIndex()"
                (pageChange)="onPageChange($event)"
              />
            </div>
          } @else {
            <div
              class="flex flex-col items-center justify-center py-12 text-foreground-muted"
            >
              <mat-icon class="text-4xl! size-10! leading-10! mb-3" [svgIcon]="icons.LIST_STATUS" />
              <p class="text-sm">
                {{ 'followup_status.no_data' | translate }}
              </p>
            </div>
          }
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class FollowupStatusPage extends CrudPageDirective<
  FollowupStatus,
  FollowupStatusService
> {
  readonly service = inject(FollowupStatusService)
  readonly icons = APP_ICONS
}
