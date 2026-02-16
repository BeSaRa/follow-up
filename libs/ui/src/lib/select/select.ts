import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay'

export type SelectSize = 'sm' | 'md'

const PANEL_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
]

let nextId = 0

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-select-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    '[id]': 'id',
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-selected]': 'isSelected()',
    '(click)': 'select()',
    '(mouseenter)': 'onMouseEnter()',
  },
  template: `<ng-content />`,
})
export class UiSelectOption {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value = input.required<any>()
  readonly disabled = input(false, { transform: booleanAttribute })

  readonly id = `ui-select-option-${nextId++}`
  readonly isActive = signal(false)
  readonly isSelected = signal(false)

  private readonly parent = inject(forwardRef(() => UiSelect))
  private readonly el = inject(ElementRef)

  protected readonly hostClasses = computed(() => {
    const base = 'block w-full cursor-pointer px-3 py-2 text-start text-sm text-foreground transition-colors'
    const activeClass = this.isActive() ? ' bg-surface-hover' : ' hover:bg-surface-hover'
    const selectedClass = this.isSelected() ? ' font-medium' : ''
    const disabledClass = this.disabled() ? ' !cursor-default !opacity-50 !pointer-events-none' : ''
    return `${base}${activeClass}${selectedClass}${disabledClass}`
  })

  select() {
    if (!this.disabled()) {
      this.parent.selectOption(this)
    }
  }

  protected onMouseEnter() {
    if (!this.disabled()) {
      this.parent.setActiveOption(this)
    }
  }

  getLabel(): string {
    return this.el.nativeElement.textContent?.trim() ?? ''
  }
}

@Component({
  imports: [CdkConnectedOverlay, CdkOverlayOrigin],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelect),
      multi: true,
    },
  ],
  host: {
    class: 'inline-block',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <button
      type="button"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      role="combobox"
      [class]="triggerClasses()"
      [disabled]="disabled()"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-controls]="isOpen() ? panelId : null"
      [attr.aria-activedescendant]="activeDescendant()"
      (click)="togglePanel()"
    >
      <span class="truncate">
        @if (displayLabel()) {
          {{ displayLabel() }}
        } @else {
          <span class="text-foreground-muted">{{ placeholder() }}</span>
        }
      </span>
      <svg class="size-4 shrink-0 text-foreground-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6,9 12,15 18,9" />
      </svg>
    </button>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayOffsetY]="4"
      [cdkConnectedOverlayMinWidth]="triggerWidth()"
      (overlayOutsideClick)="onOutsideClick($event)"
    >
      <div
        [id]="panelId"
        role="listbox"
        class="max-h-60 overflow-auto rounded-md border border-border bg-surface-raised py-1 shadow-md"
        [style.width.px]="triggerWidth()"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiSelect implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value = model<any>(null)
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly placeholder = input('Select...')
  readonly size = input<SelectSize>('md')

  readonly options = contentChildren(UiSelectOption)
  readonly panelId = `ui-select-panel-${nextId++}`
  readonly isOpen = signal(false)
  readonly displayLabel = signal('')

  private readonly triggerEl = viewChild<CdkOverlayOrigin>('trigger')
  private readonly activeIndex = signal(-1)
  private readonly cvaTouched = signal(false)
  private onChange: (value: unknown) => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function

  protected readonly positions = PANEL_POSITIONS

  protected readonly triggerWidth = computed(() => {
    const el = this.triggerEl()
    return el?.elementRef?.nativeElement?.offsetWidth ?? 0
  })

  private readonly enabledOptions = computed(() =>
    this.options().filter(o => !o.disabled()),
  )

  private readonly activeOption = computed(() => {
    const idx = this.activeIndex()
    const opts = this.enabledOptions()
    return idx >= 0 && idx < opts.length ? opts[idx] : null
  })

  protected readonly activeDescendant = computed(() => this.activeOption()?.id ?? null)

  protected readonly triggerClasses = computed(() => {
    const s = this.size()
    const base = 'inline-flex w-full items-center justify-between gap-2 rounded-md border border-border bg-transparent text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
    const sizeClass = s === 'sm' ? 'h-8 px-2' : 'h-10 px-3'
    return `${base} ${sizeClass}`
  })

  togglePanel() {
    if (this.isOpen()) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    if (this.disabled()) return
    this.isOpen.set(true)
    this.resetActive()
    this.markSelectedActive()
  }

  close() {
    this.isOpen.set(false)
    this.resetActive()
    if (!this.cvaTouched()) {
      this.onTouched()
      this.cvaTouched.set(true)
    }
  }

  selectOption(option: UiSelectOption) {
    const val = option.value()
    this.value.set(val)
    this.displayLabel.set(option.getLabel())
    this.markSelected(option)
    this.onChange(val)
    this.close()
  }

  setActiveOption(option: UiSelectOption) {
    const opts = this.enabledOptions()
    const idx = opts.indexOf(option)
    if (idx !== -1) {
      this.clearActive()
      this.activeIndex.set(idx)
      option.isActive.set(true)
    }
  }

  protected onOutsideClick(event: MouseEvent) {
    const triggerRef = this.triggerEl()
    if (triggerRef && triggerRef.elementRef.nativeElement.contains(event.target as Node)) return
    this.close()
  }

  protected onKeydown(event: KeyboardEvent) {
    if (!this.isOpen()) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.open()
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        this.moveActive(-1)
        break
      case 'Enter':
      case ' ': {
        event.preventDefault()
        const active = this.activeOption()
        if (active) {
          active.select()
        }
        break
      }
      case 'Escape':
        event.preventDefault()
        this.close()
        break
      case 'Tab':
        this.close()
        break
    }
  }

  writeValue(value: unknown) {
    this.value.set(value)
    this.syncLabelFromValue(value)
  }

  registerOnChange(fn: (value: unknown) => void) {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }

  private syncLabelFromValue(value: unknown) {
    if (value == null) {
      this.displayLabel.set('')
      this.clearSelected()
      return
    }
    // Defer to allow contentChildren to resolve
    queueMicrotask(() => {
      const opts = this.options()
      const match = opts.find(o => o.value() === value)
      if (match) {
        this.displayLabel.set(match.getLabel())
        this.markSelected(match)
      }
    })
  }

  private moveActive(delta: number) {
    const opts = this.enabledOptions()
    if (!opts.length) return

    this.clearActive()
    const current = this.activeIndex()
    let next = current + delta
    if (next < 0) next = opts.length - 1
    if (next >= opts.length) next = 0
    this.activeIndex.set(next)
    opts[next].isActive.set(true)

    const el = document.getElementById(opts[next].id)
    el?.scrollIntoView({ block: 'nearest' })
  }

  private markSelectedActive() {
    const opts = this.enabledOptions()
    const val = this.value()
    if (val == null) return
    const idx = opts.findIndex(o => o.value() === val)
    if (idx !== -1) {
      this.activeIndex.set(idx)
      opts[idx].isActive.set(true)
    }
  }

  private markSelected(option: UiSelectOption) {
    this.clearSelected()
    option.isSelected.set(true)
  }

  private clearSelected() {
    this.options().forEach(o => o.isSelected.set(false))
  }

  private clearActive() {
    this.enabledOptions().forEach(o => o.isActive.set(false))
  }

  private resetActive() {
    this.clearActive()
    this.activeIndex.set(-1)
  }
}
