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
    class: 'w-full caption-bottom text-sm',
  },
})
export class UiTable {
  readonly striped = input(false, { transform: booleanAttribute })
  readonly stickyHeader = input(false, { transform: booleanAttribute })
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
    const base = 'border-b border-border'
    return this.table.stickyHeader()
      ? `${base} sticky top-0 z-10 bg-surface-raised`
      : base
  })
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'tbody[uiTableBody]',
  host: {
    class: '[&_tr:last-child]:border-0',
  },
})
export class UiTableBody {}

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

  protected readonly hostClasses = computed(() => {
    const base = 'border-b border-border transition-colors hover:bg-surface-hover'
    return this.table?.striped()
      ? `${base} even:bg-surface`
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
  private readonly isResizing = signal(false)

  protected readonly hostClasses = computed(() => {
    const base = 'relative px-4 py-3 text-start text-sm font-medium text-foreground-muted overflow-hidden'
    const sortableClass = this.sortable() ? ' cursor-pointer select-none' : ''
    return `${base}${sortableClass}`
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
    class: 'px-4 py-3 text-sm text-foreground overflow-hidden text-ellipsis whitespace-nowrap',
  },
})
export class UiTableCell {}
