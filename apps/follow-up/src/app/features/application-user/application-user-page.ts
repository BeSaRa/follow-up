import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { MatIcon } from '@angular/material/icon'
import {
  PageChangeEvent,
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
import { Pagination } from '@follow-up/core'
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
          <button uiButton variant="primary" size="sm">
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
                    <th uiTableHead class="w-12"></th>
                  </tr>
                </thead>
                <tbody uiTableBody>
                  @for (user of models(); track user.id) {
                    <tr uiTableRow>
                      <td uiTableCell class="font-medium text-primary">
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
                              {{ 'application_user.edit' | translate }}
                            </span>
                          </ui-menu-item>
                          <ui-menu-item>
                            <span class="flex items-center gap-2 text-error">
                              <mat-icon class="text-base! size-4! leading-4!" [svgIcon]="icons.DELETE" />
                              {{ 'application_user.delete' | translate }}
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
              <mat-icon class="text-4xl! size-10! leading-10! mb-3" [svgIcon]="icons.ACCOUNT_OFF" />
              <p class="text-sm">
                {{ 'application_user.no_data' | translate }}
              </p>
            </div>
          }
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class ApplicationUserPage {
  private readonly service = inject(ApplicationUserService)
  protected readonly icons = APP_ICONS

  protected readonly pageIndex = signal(0)
  protected readonly pageSize = signal(10)
  protected readonly searchQuery = signal('')
  protected readonly loading = signal(false)
  protected readonly pagination = signal<Pagination<ApplicationUser[]> | null>(
    null,
  )

  protected readonly models = computed(
    () => this.pagination()?.result ?? [],
  )
  protected readonly totalElements = computed(
    () => this.pagination()?.totalElements ?? 0,
  )
  protected readonly skeletonRows = Array.from({ length: 5 }, (_, i) => i)

  private readonly debouncedSearch = toSignal(
    toObservable(this.searchQuery).pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  )

  constructor() {
    effect(() => {
      const page = this.pageIndex()
      const size = this.pageSize()
      const search = this.debouncedSearch()
      untracked(() => this.loadData(page, size, search))
    })
  }

  private loadData(page: number, size: number, search: string) {
    this.loading.set(true)
    const options: Record<string, unknown> = { page, size }
    if (search) options['search'] = search
    this.service.getAll(options).subscribe({
      next: (result) => {
        this.pagination.set(result)
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }

  protected onPageChange(event: PageChangeEvent) {
    this.pageIndex.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  protected onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.searchQuery.set(value)
    this.pageIndex.set(0)
  }

  protected refresh() {
    this.loadData(
      this.pageIndex(),
      this.pageSize(),
      this.debouncedSearch(),
    )
  }
}
