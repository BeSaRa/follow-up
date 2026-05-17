import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { MatIcon } from '@angular/material/icon'
import {
  BadgeVariant,
  UiBadge,
  UiButton,
  UiCard,
  UiCardContent,
  UiDatePicker,
  UiDatePickerInput,
  UiDatePickerToggle,
  UiFormField,
  UiInput,
  UiLabel,
  UiPagination,
  UiSelect,
  UiSelectOption,
  UiSkeleton,
  UiTab,
  UiTabList,
  UiTabPanel,
  UiTable,
  UiTableBody,
  UiTableCell,
  UiTableHead,
  UiTableHeader,
  UiTableRow,
  UiTabs,
} from '@follow-up/ui'
import { Pagination } from '@follow-up/core'
import { APP_ICONS } from '../../constants/icons'
import {
  FollowupService,
  type FollowupSearchParams,
} from '../followup/services/followup.service'
import { Followup } from '../followup/models/followup'
import { DocumentClass } from '../../shared/enums/document-class'
import { AppStore } from '../../shared/stores/app-store'

@Component({
  selector: 'app-search-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatIcon,
    UiBadge,
    UiButton,
    UiCard,
    UiCardContent,
    UiDatePicker,
    UiDatePickerInput,
    UiDatePickerToggle,
    UiFormField,
    UiInput,
    UiLabel,
    UiPagination,
    UiSelect,
    UiSelectOption,
    UiSkeleton,
    UiTab,
    UiTabList,
    UiTabPanel,
    UiTabs,
    UiTable,
    UiTableBody,
    UiTableCell,
    UiTableHead,
    UiTableHeader,
    UiTableRow,
  ],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          {{ 'search.title' | translate }}
        </h1>
        <p class="mt-1 text-sm text-foreground-muted">
          {{ 'search.description' | translate }}
        </p>
      </div>

      <ui-tabs #tabs activeTab="criteria">
        <ui-tab-list>
          <ui-tab value="criteria" [tabs]="tabs">
            {{ 'search.tab_criteria' | translate }}
          </ui-tab>
          <ui-tab value="results" [tabs]="tabs">
            {{ 'search.tab_results' | translate }}
            @if (hasSearched()) {
              <span class="ms-1 text-xs text-foreground-muted">
                ({{ totalElements() }})
              </span>
            }
          </ui-tab>
        </ui-tab-list>

        <ui-tab-panel value="criteria" [tabs]="tabs">
          <ui-card class="mt-6">
            <ui-card-content class="p-6!">
              <form
                [formGroup]="form"
                (ngSubmit)="onSearch()"
                class="grid grid-cols-1 gap-4 md:grid-cols-4"
              >
                <ui-form-field class="md:col-span-4">
                  <label uiLabel>
                    {{ 'search.field_string_criteria' | translate }}
                  </label>
                  <input
                    uiInput
                    type="text"
                    formControlName="stringCriteria"
                    [placeholder]="'search.field_string_placeholder' | translate"
                  />
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_security_level' | translate }}
                  </label>
                  <ui-select
                    ngProjectAs="[uiInput]"
                    class="block w-full"
                    formControlName="securityLevel"
                    [placeholder]="'search.all' | translate"
                  >
                    <ui-select-option
                      [value]="null"
                      [label]="'search.all' | translate"
                    >
                      {{ 'search.all' | translate }}
                    </ui-select-option>
                    @for (item of securityLevels(); track item.lookupKey) {
                      <ui-select-option
                        [value]="item.lookupKey"
                        [label]="isArabic() ? item.arName : item.enName"
                      >
                        {{ isArabic() ? item.arName : item.enName }}
                      </ui-select-option>
                    }
                  </ui-select>
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_priority_level' | translate }}
                  </label>
                  <ui-select
                    ngProjectAs="[uiInput]"
                    class="block w-full"
                    formControlName="priorityLevel"
                    [placeholder]="'search.all' | translate"
                  >
                    <ui-select-option
                      [value]="null"
                      [label]="'search.all' | translate"
                    >
                      {{ 'search.all' | translate }}
                    </ui-select-option>
                    @for (item of priorityLevels(); track item.lookupKey) {
                      <ui-select-option
                        [value]="item.lookupKey"
                        [label]="isArabic() ? item.arName : item.enName"
                      >
                        {{ isArabic() ? item.arName : item.enName }}
                      </ui-select-option>
                    }
                  </ui-select>
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_followup_status' | translate }}
                  </label>
                  <ui-select
                    ngProjectAs="[uiInput]"
                    class="block w-full"
                    formControlName="followUpStatus"
                    [placeholder]="'search.all' | translate"
                  >
                    <ui-select-option
                      [value]="null"
                      [label]="'search.all' | translate"
                    >
                      {{ 'search.all' | translate }}
                    </ui-select-option>
                    @for (item of followupStatuses(); track item.lookupKey) {
                      <ui-select-option
                        [value]="item.lookupKey"
                        [label]="isArabic() ? item.arName : item.enName"
                      >
                        {{ isArabic() ? item.arName : item.enName }}
                      </ui-select-option>
                    }
                  </ui-select>
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_doc_class' | translate }}
                  </label>
                  <ui-select
                    ngProjectAs="[uiInput]"
                    class="block w-full"
                    formControlName="docClassId"
                    [placeholder]="'search.all' | translate"
                  >
                    <ui-select-option
                      [value]="null"
                      [label]="'search.all' | translate"
                    >
                      {{ 'search.all' | translate }}
                    </ui-select-option>
                    <ui-select-option
                      [value]="DocumentClass.OUTGOING"
                      [label]="'search.doc_class_outgoing' | translate"
                    >
                      {{ 'search.doc_class_outgoing' | translate }}
                    </ui-select-option>
                    <ui-select-option
                      [value]="DocumentClass.INCOMING"
                      [label]="'search.doc_class_incoming' | translate"
                    >
                      {{ 'search.doc_class_incoming' | translate }}
                    </ui-select-option>
                  </ui-select>
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_from_date' | translate }}
                  </label>
                  <ui-date-picker
                    ngProjectAs="[uiInput]"
                    class="block w-full [&>div]:flex"
                    formControlName="fromDate"
                  >
                    <input uiDatePickerInput class="bg-surface-raised!" />
                    <ui-date-picker-toggle />
                  </ui-date-picker>
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_to_date' | translate }}
                  </label>
                  <ui-date-picker
                    ngProjectAs="[uiInput]"
                    class="block w-full [&>div]:flex"
                    formControlName="toDate"
                  >
                    <input uiDatePickerInput class="bg-surface-raised!" />
                    <ui-date-picker-toggle />
                  </ui-date-picker>
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_status' | translate }}
                  </label>
                  <ui-select
                    ngProjectAs="[uiInput]"
                    class="block w-full"
                    formControlName="status"
                    [placeholder]="'search.all' | translate"
                  >
                    <ui-select-option
                      [value]="null"
                      [label]="'search.all' | translate"
                    >
                      {{ 'search.all' | translate }}
                    </ui-select-option>
                    <ui-select-option
                      [value]="true"
                      [label]="'search.status_active' | translate"
                    >
                      {{ 'search.status_active' | translate }}
                    </ui-select-option>
                    <ui-select-option
                      [value]="false"
                      [label]="'search.status_inactive' | translate"
                    >
                      {{ 'search.status_inactive' | translate }}
                    </ui-select-option>
                  </ui-select>
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_assignment_status' | translate }}
                  </label>
                  <ui-select
                    ngProjectAs="[uiInput]"
                    class="block w-full"
                    formControlName="assignmentStatus"
                    [placeholder]="'search.all' | translate"
                  >
                    <ui-select-option
                      [value]="null"
                      [label]="'search.all' | translate"
                    >
                      {{ 'search.all' | translate }}
                    </ui-select-option>
                    <ui-select-option
                      [value]="1"
                      [label]="'search.assignment_assigned' | translate"
                    >
                      {{ 'search.assignment_assigned' | translate }}
                    </ui-select-option>
                    <ui-select-option
                      [value]="2"
                      [label]="'search.assignment_unassigned' | translate"
                    >
                      {{ 'search.assignment_unassigned' | translate }}
                    </ui-select-option>
                  </ui-select>
                </ui-form-field>

                <!-- temporarily hidden — will return later
                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_external_entity_id' | translate }}
                  </label>
                  <input
                    uiInput
                    type="number"
                    formControlName="externalEntityId"
                  />
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_sub_external_entity_id' | translate }}
                  </label>
                  <input
                    uiInput
                    type="number"
                    formControlName="subExternalEntityId"
                  />
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_user_id' | translate }}
                  </label>
                  <input uiInput type="number" formControlName="userId" />
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>
                    {{ 'search.field_state' | translate }}
                  </label>
                  <input uiInput type="number" formControlName="state" />
                </ui-form-field>
                -->
              </form>

              <div class="mt-6 flex items-center justify-end gap-2">
                <button
                  uiButton
                  variant="outline"
                  type="button"
                  (click)="onReset()"
                >
                  {{ 'common.reset' | translate }}
                </button>
                <button
                  uiButton
                  variant="primary"
                  type="button"
                  [loading]="loading()"
                  (click)="onSearch()"
                >
                  <mat-icon
                    class="text-lg! size-5! leading-5!"
                    [svgIcon]="icons.MAGNIFY"
                  />
                  {{ 'search.search' | translate }}
                </button>
              </div>
            </ui-card-content>
          </ui-card>
        </ui-tab-panel>

        <ui-tab-panel value="results" [tabs]="tabs">
          <ui-card class="mt-6 overflow-hidden">
            <ui-card-content class="p-0!">
              <div class="overflow-x-auto">
                <table uiTable striped roundedHeader>
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
                        {{ 'followup.external_entity' | translate }}
                      </th>
                      <th uiTableHead>
                        {{ 'followup.followup_status' | translate }}
                      </th>
                      <th uiTableHead>
                        {{ 'followup.due_date' | translate }}
                      </th>
                      <th uiTableHead>
                        {{ 'followup.status' | translate }}
                      </th>
                    </tr>
                  </thead>
                  <tbody uiTableBody>
                    @for (item of results(); track item.id) {
                      <tr uiTableRow>
                        <td uiTableCell>
                          <button
                            class="cursor-pointer text-start font-medium text-primary hover:underline"
                            (click)="view(item)"
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
                          {{ item.externalEntityInfo.getName() }}
                        </td>
                        <td uiTableCell>
                          {{ item.followUpStatusInfo.getName() }}
                        </td>
                        <td uiTableCell>{{ item.dueDate }}</td>
                        <td uiTableCell>
                          <ui-badge
                            [variant]="item.status ? 'success' : 'error'"
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
                      </tr>
                    } @empty {
                      <tr>
                        <td [attr.colspan]="7">
                          @if (loading()) {
                            <div class="space-y-4 px-4 py-4">
                              @for (i of skeletonRows; track i) {
                                <ui-skeleton width="100%" height="2rem" />
                              }
                            </div>
                          } @else if (!hasSearched()) {
                            <div
                              class="flex flex-col items-center justify-center py-12 text-foreground-muted"
                            >
                              <mat-icon
                                class="text-4xl! size-10! leading-10! mb-3"
                                [svgIcon]="icons.MAGNIFY"
                              />
                              <p class="text-sm">
                                {{ 'search.hint_run_search' | translate }}
                              </p>
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
                                {{ 'search.no_results' | translate }}
                              </p>
                            </div>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              @if (results().length) {
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
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class SearchPage {
  private readonly fb = inject(FormBuilder)
  private readonly service = inject(FollowupService)
  private readonly translate = inject(TranslateService)
  private readonly appStore = inject(AppStore)
  protected readonly icons = APP_ICONS
  protected readonly DocumentClass = DocumentClass
  protected readonly skeletonRows = [1, 2, 3, 4, 5] as const

  private readonly tabs = viewChild.required(UiTabs)

  protected readonly form: FormGroup = this.fb.group({
    stringCriteria: [''],
    externalEntityId: [null],
    subExternalEntityId: [null],
    securityLevel: [null],
    priorityLevel: [null],
    followUpStatus: [null],
    fromDate: [null],
    toDate: [null],
    userId: [null],
    status: [null],
    docClassId: [null],
    state: [null],
    assignmentStatus: [null],
  })

  protected readonly results = signal<Followup[]>([])
  protected readonly totalElements = signal(0)
  protected readonly loading = signal(false)
  protected readonly pageIndex = signal(0)
  protected readonly pageSize = signal(10)
  protected readonly hasSearched = signal(false)

  protected readonly isArabic = computed(
    () => (this.translate.currentLang || 'ar') === 'ar',
  )
  protected readonly securityLevels = computed(
    () => this.appStore.lookupList()?.SecurityLevel ?? [],
  )
  protected readonly priorityLevels = computed(
    () => this.appStore.lookupList()?.PriorityLevel ?? [],
  )
  protected readonly followupStatuses = computed(
    () => this.appStore.lookupList()?.FollowupStatus ?? [],
  )

  private readonly priorityVariantMap = computed(() => {
    const map = new Map<number, BadgeVariant>()
    for (const p of this.priorityLevels()) {
      if (p.lookupStrKey) {
        map.set(p.lookupKey, p.lookupStrKey as BadgeVariant)
      }
    }
    return map
  })

  protected getPriorityVariant(id: number): BadgeVariant {
    return this.priorityVariantMap().get(id) ?? 'outline'
  }

  protected onSearch(): void {
    this.pageIndex.set(0)
    this.executeSearch()
  }

  protected onReset(): void {
    this.form.reset({
      stringCriteria: '',
      externalEntityId: null,
      subExternalEntityId: null,
      securityLevel: null,
      priorityLevel: null,
      followUpStatus: null,
      fromDate: null,
      toDate: null,
      userId: null,
      status: null,
      docClassId: null,
      state: null,
      assignmentStatus: null,
    })
  }

  protected onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
    this.executeSearch()
  }

  protected view(item: Followup): void {
    this.service.view(item)
  }

  private executeSearch(): void {
    this.loading.set(true)
    this.results.set([])
    const params: FollowupSearchParams = {
      ...this.buildParams(),
      pageNumber: this.pageIndex(),
      pageSize: this.pageSize(),
    }
    this.service.search(params).subscribe({
      next: (page: Pagination<Followup[]>) => {
        this.results.set(page.result ?? [])
        this.totalElements.set(page.totalElements ?? 0)
        this.loading.set(false)
        this.hasSearched.set(true)
        this.tabs().activeTab.set('results')
      },
      error: () => this.loading.set(false),
    })
  }

  private buildParams(): FollowupSearchParams {
    const v = this.form.value
    const date = (d: Date | null | undefined): string | undefined => {
      if (!d) return undefined
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }
    const trimmed = (v.stringCriteria ?? '').trim()
    return {
      stringCriteria: trimmed || undefined,
      externalEntityId: v.externalEntityId ?? undefined,
      subExternalEntityId: v.subExternalEntityId ?? undefined,
      securityLevel: v.securityLevel ?? undefined,
      priorityLevel: v.priorityLevel ?? undefined,
      followUpStatus: v.followUpStatus ?? undefined,
      fromDate: date(v.fromDate),
      toDate: date(v.toDate),
      userId: v.userId ?? undefined,
      status: v.status ?? undefined,
      docClassId: v.docClassId ?? undefined,
      state: v.state ?? undefined,
      assignmentStatus: v.assignmentStatus ?? undefined,
    }
  }
}
