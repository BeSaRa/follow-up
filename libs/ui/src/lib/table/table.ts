import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core'

export type SortDirection = 'asc' | 'desc' | null

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'table[uiTable]',
  host: {
    '[class]': 'hostClasses()',
    '[style.--ui-table-stripe]': 'stripeColor() || null',
  },
})
export class UiTable {
  readonly striped = input(false, { transform: booleanAttribute })
  readonly stickyHeader = input(false, { transform: booleanAttribute })
  /** Rounds the top-start/top-end corners of the header's first/last cells. */
  readonly roundedHeader = input(false, { transform: booleanAttribute })
  /**
   * Background color for striped (even) rows. Any CSS color value, e.g.
   * `#FBFCFD`. Falls back to the `surface` theme token when unset. Only has an
   * effect together with `striped`.
   */
  readonly stripeColor = input<string>()

  protected readonly hostClasses = computed(() => {
    const base = 'w-full caption-bottom text-sm'
    // border-radius is ignored on cells under border-collapse: collapse, so a
    // rounded header switches the table to the separate borders model. Dividers
    // then move from the row groups onto the cells (see UiTableHead/UiTableCell).
    return this.roundedHeader()
      ? `${base} border-separate border-spacing-0`
      : base
  })
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'thead[uiTableHeader]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiTableHeader {
  private readonly table = inject(UiTable)

  protected readonly hostClasses = computed(() => {
    const classes: string[] = []
    if (this.table.stickyHeader()) {
      classes.push('sticky top-0 z-10')
    }
    if (this.table.roundedHeader()) {
      // Separate borders model: the header divider lives on the cells
      // (UiTableHead). Logical radius utilities so rounding follows LTR/RTL.
      classes.push(
        '[&_th:first-child]:rounded-ss-lg',
        '[&_th:last-child]:rounded-se-lg',
      )
    } else {
      classes.push('border-b border-border')
    }
    return classes.join(' ')
  })
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'tbody[uiTableBody]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiTableBody {
  private readonly table = inject(UiTable)

  protected readonly hostClasses = computed(() =>
    // In the separate model the divider is on the cells, so drop it from the
    // last row's cells; otherwise drop the border from the last row itself.
    this.table.roundedHeader()
      ? '[&>tr:last-child>td]:border-b-0'
      : '[&_tr:last-child]:border-0',
  )
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'tfoot[uiTableFooter]',
  host: {
    class: 'border-t border-border bg-surface font-medium',
  },
})
export class UiTableFooter {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'tr[uiTableRow]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiTableRow {
  private readonly table = inject(UiTable, { optional: true })
  private readonly header = inject(UiTableHeader, { optional: true })

  protected readonly hostClasses = computed(() => {
    if (this.header) {
      return 'border-b border-border'
    }
    const base = 'border-b border-border transition-colors hover:bg-surface-hover'
    return this.table?.striped()
      ? `${base} even:bg-[var(--ui-table-stripe,var(--color-surface))]`
      : base
  })
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'th[uiTableHead]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-1 overflow-hidden">
      <span class="truncate"><ng-content /></span>
      @if (sortable()) {
        <svg
          class="size-4 shrink-0 text-foreground-subtle"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          @switch (sortDirection()) {
            @case ('asc') {
              <path d="M12 5v14" />
              <path d="m5 12 7-7 7 7" />
            }
            @case ('desc') {
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            }
            @default {
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            }
          }
        </svg>
      }
    </div>
    @if (resizable()) {
      <div
        class="absolute end-0 top-0 h-full w-1 cursor-col-resize hover:bg-border-hover active:bg-primary"
        (mousedown)="onResizeStart($event)"
      ></div>
    }
  `,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'onHeaderClick()',
  },
})
export class UiTableHead {
  readonly sortable = input(false, { transform: booleanAttribute })
  readonly sortDirection = input<SortDirection>(null)
  readonly resizable = input(false, { transform: booleanAttribute })
  readonly sortChange = output<SortDirection>()

  private readonly el = inject(ElementRef)
  private readonly table = inject(UiTable)
  private readonly isResizing = signal(false)

  protected readonly hostClasses = computed(() => {
    const base = 'relative px-4 py-3 text-start text-sm font-medium text-foreground-muted overflow-hidden bg-table-header'
    // Separate borders model: the header divider sits on the cells.
    const border = this.table.roundedHeader() ? ' border-b border-border' : ''
    const sortableClass = this.sortable() ? ' cursor-pointer select-none' : ''
    return `${base}${border}${sortableClass}`
  })

  protected onHeaderClick() {
    if (!this.sortable() || this.isResizing()) return

    const current = this.sortDirection()
    const next: SortDirection = current === 'asc' ? 'desc' : 'asc'
    this.sortChange.emit(next)
  }

  protected onResizeStart(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isResizing.set(true)

    const th = this.el.nativeElement as HTMLElement
    const isRtl = getComputedStyle(th).direction === 'rtl'
    const startX = event.clientX
    const startWidth = th.offsetWidth

    const onMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX
      const newWidth = Math.max(50, startWidth + (isRtl ? -delta : delta))
      th.style.width = `${newWidth}px`
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      requestAnimationFrame(() => this.isResizing.set(false))
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'td[uiTableCell]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiTableCell {
  private readonly table = inject(UiTable)

  protected readonly hostClasses = computed(() => {
    const base = 'px-4 py-3 text-sm text-foreground overflow-hidden text-ellipsis whitespace-nowrap'
    // Separate borders model: row dividers live on the cells, not the row.
    return this.table.roundedHeader()
      ? `${base} border-b border-border`
      : base
  })
}
