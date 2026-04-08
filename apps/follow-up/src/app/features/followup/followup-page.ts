import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TranslatePipe } from '@ngx-translate/core'
import { MatIcon } from '@angular/material/icon'
import {
  BadgeVariant,
  UiBadge,
  UiBreadcrumb,
  UiBreadcrumbItem,
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
} from '@follow-up/ui'
import { CrudPageDirective } from '@follow-up/core'
import { APP_ICONS } from '../../constants/icons'
import { FollowupService } from './services/followup.service'
import { Followup } from './models/followup'

@Component({
  selector: 'app-followup-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    MatIcon,
    UiBreadcrumb,
    UiBreadcrumbItem,
    UiBadge,
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
  ],
  template: `
    <div class="space-y-6">
      <ui-breadcrumb>
        <ui-breadcrumb-item active>
          {{ 'followup.title' | translate }}
        </ui-breadcrumb-item>
      </ui-breadcrumb>

      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ 'followup.title' | translate }}
          </h1>
          <p class="mt-1 text-sm text-foreground-muted">
            {{ 'followup.description' | translate }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button uiButton variant="outline" size="sm" (click)="refresh()">
            <mat-icon class="text-lg! size-5! leading-5!" [svgIcon]="icons.REFRESH" />
          </button>
        </div>
      </div>

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
            [placeholder]="'followup.search_placeholder' | translate"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
          />
        </div>
      </div>

      <ui-card>
        <ui-card-content class="p-0!">
          <div class="overflow-x-auto">
            <table uiTable>
              <thead uiTableHeader>
                <tr uiTableRow>
                  <th uiTableHead>{{ 'followup.reference' | translate }}</th>
                  <th uiTableHead>{{ 'followup.doc_subject' | translate }}</th>
                  <th uiTableHead>{{ 'followup.doc_class' | translate }}</th>
                  <th uiTableHead>{{ 'followup.external_entity' | translate }}</th>
                  <th uiTableHead>{{ 'followup.priority_level' | translate }}</th>
                  <th uiTableHead>{{ 'followup.followup_status' | translate }}</th>
                  <th uiTableHead>{{ 'followup.assigned_user' | translate }}</th>
                  <th uiTableHead>{{ 'followup.due_date' | translate }}</th>
                  <th uiTableHead>{{ 'followup.status' | translate }}</th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (item of models(); track item.id) {
                  <tr uiTableRow>
                    <td uiTableCell class="font-medium">{{ item.followUpReference }}</td>
                    <td uiTableCell>{{ item.docSubject }}</td>
                    <td uiTableCell>{{ item.docClassInfo.arName }}</td>
                    <td uiTableCell>{{ item.externalEntityInfo.arName }}</td>
                    <td uiTableCell>
                      <ui-badge [variant]="getPriorityVariant(item.priorityLevelInfo.id)" size="sm">
                        {{ item.priorityLevelInfo.arName }}
                      </ui-badge>
                    </td>
                    <td uiTableCell>{{ item.followUpStatusInfo.arName }}</td>
                    <td uiTableCell>{{ item.assignedUserInfo.arName }}</td>
                    <td uiTableCell>{{ item.dueDate }}</td>
                    <td uiTableCell>
                      <ui-badge
                        [variant]="item.status ? 'success' : 'error'"
                        size="sm"
                      >
                        {{ (item.status ? 'followup.active' : 'followup.inactive') | translate }}
                      </ui-badge>
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
                          <mat-icon class="text-4xl! size-10! leading-10! mb-3" [svgIcon]="icons.VIEW_DASHBOARD" />
                          <p class="text-sm">{{ 'followup.no_data' | translate }}</p>
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
export class FollowupPage extends CrudPageDirective<Followup, FollowupService> {
  readonly service = inject(FollowupService)
  readonly icons = APP_ICONS

  private readonly priorityVariants: Record<number, BadgeVariant> = {
    1: 'outline-error',
    2: 'outline-warning',
    3: 'outline-info',
    4: 'outline-success',
  }

  getPriorityVariant(id: number): BadgeVariant {
    return this.priorityVariants[id] ?? 'outline'
  }
}
