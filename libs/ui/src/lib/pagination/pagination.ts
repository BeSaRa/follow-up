import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core'
import { UiSelect, UiSelectOption } from '../select/select'

export interface PageChangeEvent {
  pageIndex: number
  pageSize: number
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiSelect, UiSelectOption],
  host: {
    class:
      'flex items-center justify-between gap-4 px-4 py-3 text-sm text-foreground-muted',
    role: 'navigation',
    'aria-label': 'Pagination',
  },
  template: `
    @if (showPageSizeSelector()) {
      <div class="flex items-center gap-2">
        <span class="whitespace-nowrap">Rows per page:</span>
        <ui-select
          size="sm"
          style="min-width: 5rem"
          [value]="pageSize()"
          (valueChange)="onPageSizeChange($event)"
        >
          @for (option of pageSizeOptions(); track option) {
            <ui-select-option [value]="option" [label]="'' + option">{{
              option
            }}</ui-select-option>
          }
        </ui-select>
      </div>
    }

    <span class="whitespace-nowrap">{{ rangeLabel() }}</span>

    <div class="flex items-center gap-1">
      @if (showFirstLastButtons()) {
        <button
          type="button"
          class="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
          [disabled]="isFirstPage()"
          (click)="goToFirst()"
          aria-label="First page"
        >
          <svg
            class="size-4 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m11 17-5-5 5-5" />
            <path d="m18 17-5-5 5-5" />
          </svg>
        </button>
      }
      <button
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
        [disabled]="isFirstPage()"
        (click)="goToPrevious()"
        aria-label="Previous page"
      >
        <svg
          class="size-4 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
        [disabled]="isLastPage()"
        (click)="goToNext()"
        aria-label="Next page"
      >
        <svg
          class="size-4 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
      @if (showFirstLastButtons()) {
        <button
          type="button"
          class="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
          [disabled]="isLastPage()"
          (click)="goToLast()"
          aria-label="Last page"
        >
          <svg
            class="size-4 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 17 5-5-5-5" />
            <path d="m13 17 5-5-5-5" />
          </svg>
        </button>
      }
    </div>
  `,
})
export class UiPagination {
  readonly totalItems = input.required<number>()
  readonly pageSize = input(10)
  readonly pageIndex = input(0)
  readonly pageSizeOptions = input([5, 10, 25, 50])
  readonly showFirstLastButtons = input(true, { transform: booleanAttribute })
  readonly showPageSizeSelector = input(true, { transform: booleanAttribute })

  readonly pageChange = output<PageChangeEvent>()

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize())),
  )

  protected readonly isFirstPage = computed(() => this.pageIndex() === 0)
  protected readonly isLastPage = computed(
    () => this.pageIndex() >= this.totalPages() - 1,
  )

  protected readonly rangeLabel = computed(() => {
    const total = this.totalItems()
    if (total === 0) return '0 of 0'

    const start = this.pageIndex() * this.pageSize() + 1
    const end = Math.min((this.pageIndex() + 1) * this.pageSize(), total)
    return `${start}–${end} of ${total}`
  })

  protected onPageSizeChange(newSize: number) {
    this.pageChange.emit({ pageIndex: 0, pageSize: newSize })
  }

  protected goToFirst() {
    this.pageChange.emit({ pageIndex: 0, pageSize: this.pageSize() })
  }

  protected goToPrevious() {
    this.pageChange.emit({
      pageIndex: this.pageIndex() - 1,
      pageSize: this.pageSize(),
    })
  }

  protected goToNext() {
    this.pageChange.emit({
      pageIndex: this.pageIndex() + 1,
      pageSize: this.pageSize(),
    })
  }

  protected goToLast() {
    this.pageChange.emit({
      pageIndex: this.totalPages() - 1,
      pageSize: this.pageSize(),
    })
  }
}
