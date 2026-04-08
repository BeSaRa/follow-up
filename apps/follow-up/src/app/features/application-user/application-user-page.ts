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
  UiPagination,
  UiSkeleton,
  UiTable,
  UiTableBody,
  UiTableCell,
  UiTableHead,
  UiTableHeader,
  UiTableRow,
  UiTooltip,
} from '@follow-up/ui'
import { CrudPageWithDialogDirective } from '@follow-up/core'
import { APP_ICONS } from '../../constants/icons'
import { ApplicationUserService } from './services/application-user.service'
import { ApplicationUser } from './models/application-user'

@Component({
  selector: 'app-application-user-page',
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
    UiTooltip,
  ],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb -->
      <ui-breadcrumb>
        <ui-breadcrumb-item>
          <a routerLink="/admin">{{ 'admin.title' | translate }}</a>
        </ui-breadcrumb-item>
        <ui-breadcrumb-separator>»</ui-breadcrumb-separator>
        <ui-breadcrumb-item active>
          {{ 'application_user.title' | translate }}
        </ui-breadcrumb-item>
      </ui-breadcrumb>

      <!-- Page Header -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ 'application_user.title' | translate }}
          </h1>
          <p class="mt-1 text-sm text-foreground-muted">
            {{ 'application_user.description' | translate }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button uiButton variant="outline" size="sm" (click)="refresh()">
            <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.REFRESH" />
          </button>
          <button uiButton variant="primary" size="sm" (click)="openCreateDialog()">
            <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.PLUS" />
            {{ 'application_user.add_user' | translate }}
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
            [placeholder]="'application_user.search_placeholder' | translate"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
          />
        </div>
      </div>

      <!-- Table Card -->
      <ui-card>
        <ui-card-content class="p-0!">
          <div class="overflow-x-auto">
            <table uiTable>
              <thead uiTableHeader>
                <tr uiTableRow>
                  <th uiTableHead>
                    {{ 'application_user.domain_name' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'application_user.employee_no' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'application_user.ar_name' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'application_user.en_name' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'application_user.email' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'application_user.mobile' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'application_user.qid' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'application_user.status' | translate }}
                  </th>
                  <th uiTableHead class="w-28"></th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (user of models(); track user.id) {
                    <tr uiTableRow>
                      <td uiTableCell class="font-medium">
                        {{ user.domainName }}
                      </td>
                      <td uiTableCell>
                        {{ user.employeeNo }}
                      </td>
                      <td uiTableCell>{{ user.arName }}</td>
                      <td uiTableCell>{{ user.enName }}</td>
                      <td uiTableCell>{{ user.email }}</td>
                      <td uiTableCell>{{ user.mobile }}</td>
                      <td uiTableCell>{{ user.qid }}</td>
                      <td uiTableCell>
                        <ui-badge
                          [variant]="user.status ? 'success' : 'error'"
                          size="sm"
                        >
                          {{
                            (user.status
                              ? 'application_user.active'
                              : 'application_user.inactive'
                            ) | translate
                          }}
                        </ui-badge>
                      </td>
                      <td uiTableCell>
                        <div class="flex items-center gap-1">
                          <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-md p-1.5 text-foreground-muted hover:text-primary hover:bg-surface-hover transition-colors"
                            [uiTooltip]="'application_user.view' | translate"
                            (click)="openViewDialog(user)"
                          >
                            <mat-icon class="text-base! size-4! leading-4!" [svgIcon]="icons.EYE" />
                          </button>
                          <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-md p-1.5 text-foreground-muted hover:text-primary hover:bg-surface-hover transition-colors"
                            [uiTooltip]="'application_user.edit' | translate"
                            (click)="openUpdateDialog(user)"
                          >
                            <mat-icon class="text-base! size-4! leading-4!" [svgIcon]="icons.PENCIL" />
                          </button>
                          <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-md p-1.5 text-foreground-muted hover:text-error hover:bg-surface-hover transition-colors"
                            [uiTooltip]="'application_user.delete' | translate"
                            (click)="confirmDelete(user)"
                          >
                            <mat-icon class="text-base! size-4! leading-4!" [svgIcon]="icons.DELETE" />
                          </button>
                        </div>
                      </td>
                  </tr>
                } @empty {
                  <tr>
                    <td [attr.colspan]="9">
                      @if (loading()) {
                        <div class="space-y-4 px-4 py-4">
                          @for (i of skeletonRows; track i) {
                            <ui-skeleton width="100%" height="2rem" />
                          }
                        </div>
                      } @else {
                        <div class="flex flex-col items-center justify-center py-12 text-foreground-muted">
                          <mat-icon class="text-4xl! size-10! leading-10! mb-3" [svgIcon]="icons.ACCOUNT_OFF" />
                          <p class="text-sm">
                            {{ 'application_user.no_data' | translate }}
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
export class ApplicationUserPage extends CrudPageWithDialogDirective<
  ApplicationUser,
  ApplicationUserService
> {
  readonly service = inject(ApplicationUserService)
  readonly icons = APP_ICONS
}
