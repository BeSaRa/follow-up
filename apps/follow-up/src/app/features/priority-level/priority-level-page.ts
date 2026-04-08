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
import { PriorityLevelService } from './services/priority-level.service'
import { PriorityLevel } from './models/priority-level'

@Component({
  selector: 'app-priority-level-page',
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
          {{ 'priority_level.title' | translate }}
        </ui-breadcrumb-item>
      </ui-breadcrumb>

      <!-- Page Header -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ 'priority_level.title' | translate }}
          </h1>
          <p class="mt-1 text-sm text-foreground-muted">
            {{ 'priority_level.description' | translate }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button uiButton variant="outline" size="sm" (click)="refresh()">
            <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.REFRESH" />
          </button>
          <button uiButton variant="primary" size="sm" (click)="openCreateDialog()">
            <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.PLUS" />
            {{ 'priority_level.add' | translate }}
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
            [placeholder]="'priority_level.search_placeholder' | translate"
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
                    {{ 'priority_level.ar_name' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'priority_level.en_name' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'priority_level.lookup_key' | translate }}
                  </th>
                  <th uiTableHead>
                    {{ 'priority_level.status' | translate }}
                  </th>
                  <th uiTableHead class="w-28"></th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (item of models(); track item.id) {
                    <tr uiTableRow>
                      <td uiTableCell class="font-medium">
                        {{ item.arName }}
                      </td>
                      <td uiTableCell>{{ item.enName }}</td>
                      <td uiTableCell>{{ item.lookupKey }}</td>
                      <td uiTableCell>
                        <ui-badge
                          [variant]="item.status ? 'success' : 'error'"
                          size="sm"
                        >
                          {{
                            (item.status
                              ? 'priority_level.active'
                              : 'priority_level.inactive'
                            ) | translate
                          }}
                        </ui-badge>
                      </td>
                      <td uiTableCell>
                        <div class="flex items-center gap-1">
                          <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-md p-1.5 text-foreground-muted hover:text-primary hover:bg-surface-hover transition-colors"
                            [uiTooltip]="'priority_level.view' | translate"
                            (click)="openViewDialog(item)"
                          >
                            <mat-icon class="text-base! size-4! leading-4!" [svgIcon]="icons.EYE" />
                          </button>
                          <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-md p-1.5 text-foreground-muted hover:text-primary hover:bg-surface-hover transition-colors"
                            [uiTooltip]="'priority_level.edit' | translate"
                            (click)="openUpdateDialog(item)"
                          >
                            <mat-icon class="text-base! size-4! leading-4!" [svgIcon]="icons.PENCIL" />
                          </button>
                          <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-md p-1.5 text-foreground-muted hover:text-error hover:bg-surface-hover transition-colors"
                            [uiTooltip]="'priority_level.delete' | translate"
                            (click)="confirmDelete(item)"
                          >
                            <mat-icon class="text-base! size-4! leading-4!" [svgIcon]="icons.DELETE" />
                          </button>
                        </div>
                      </td>
                  </tr>
                } @empty {
                  <tr>
                    <td [attr.colspan]="5">
                      @if (loading()) {
                        <div class="space-y-4 px-4 py-4">
                          @for (i of skeletonRows; track i) {
                            <ui-skeleton width="100%" height="2rem" />
                          }
                        </div>
                      } @else {
                        <div class="flex flex-col items-center justify-center py-12 text-foreground-muted">
                          <mat-icon class="text-4xl! size-10! leading-10! mb-3" [svgIcon]="icons.PRIORITY_HIGH" />
                          <p class="text-sm">
                            {{ 'priority_level.no_data' | translate }}
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
export class PriorityLevelPage extends CrudPageWithDialogDirective<
  PriorityLevel,
  PriorityLevelService
> {
  readonly service = inject(PriorityLevelService)
  readonly icons = APP_ICONS
}
