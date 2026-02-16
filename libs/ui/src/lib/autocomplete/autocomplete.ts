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
  output,
  signal,
  viewChild,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay'

export type AutocompleteSize = 'sm' | 'md'

const PANEL_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
]

let nextId = 0

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-autocomplete-option',
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
export class UiAutocompleteOption {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value = input.required<any>()
  readonly disabled = input(false, { transform: booleanAttribute })

  readonly id = `ui-autocomplete-option-${nextId++}`
  readonly isActive = signal(false)
  readonly isSelected = signal(false)

  private readonly parent = inject(forwardRef(() => UiAutocomplete))
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
  selector: 'ui-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiAutocomplete),
      multi: true,
    },
  ],
  host: {
    class: 'inline-block',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <div
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      [class]="triggerClasses()"
      (click)="focusInput()"
    >
      <input
        #inputEl
        type="text"
        role="combobox"
        autocomplete="off"
        class="min-w-0 flex-1 bg-transparent outline-none placeholder:text-foreground-muted"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-controls]="isOpen() ? panelId : null"
        [attr.aria-activedescendant]="activeDescendant()"
        (input)="onInput($event)"
        (focus)="onFocus()"
      />
      <svg class="size-4 shrink-0 text-foreground-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6,9 12,15 18,9" />
      </svg>
    </div>

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
export class UiAutocomplete implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value = model<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly displayWith = input<(value: any) => string>((v) => v?.toString() ?? '')
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly placeholder = input('Search...')
  readonly size = input<AutocompleteSize>('md')

  readonly searchChange = output<string>()

  readonly options = contentChildren(UiAutocompleteOption)
  readonly panelId = `ui-autocomplete-panel-${nextId++}`
  readonly isOpen = signal(false)
  readonly displayLabel = signal('')

  private readonly inputEl = viewChild<ElementRef>('inputEl')
  private readonly triggerEl = viewChild<CdkOverlayOrigin>('trigger')
  private readonly activeIndex = signal(-1)
  private readonly cvaTouched = signal(false)
  private onChange: (value: unknown) => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private skipNextFocusOpen = false

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
    const base = 'inline-flex w-full items-center gap-2 rounded-md border border-border bg-transparent text-sm text-foreground transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
    const sizeClass = s === 'sm' ? 'h-8 px-2' : 'h-10 px-3'
    return `${base} ${sizeClass}`
  })

  focusInput() {
    this.inputEl()?.nativeElement?.focus()
  }

  onFocus() {
    if (this.skipNextFocusOpen) {
      this.skipNextFocusOpen = false
      return
    }
    if (!this.isOpen()) {
      this.open()
    }
  }

  open() {
    if (this.disabled()) return
    this.isOpen.set(true)
    this.resetActive()
  }

  close() {
    this.isOpen.set(false)
    this.resetActive()
    if (!this.cvaTouched()) {
      this.onTouched()
      this.cvaTouched.set(true)
    }
  }

  selectOption(option: UiAutocompleteOption) {
    const val = option.value()
    this.value.set(val)
    const display = this.displayWith()(val)
    this.displayLabel.set(display)
    this.setInputValue(display)
    this.markSelected(option)
    this.onChange(val)
    this.close()
    this.skipNextFocusOpen = true
    this.focusInput()
  }

  setActiveOption(option: UiAutocompleteOption) {
    const opts = this.enabledOptions()
    const idx = opts.indexOf(option)
    if (idx !== -1) {
      this.clearActive()
      this.activeIndex.set(idx)
      option.isActive.set(true)
    }
  }

  protected onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value
    this.searchChange.emit(val)
    this.onChange(val)
    if (!this.isOpen()) {
      this.open()
    }
    this.resetActive()
  }

  protected onOutsideClick(event: MouseEvent) {
    const triggerRef = this.triggerEl()
    if (triggerRef && triggerRef.elementRef.nativeElement.contains(event.target as Node)) return
    this.close()
  }

  protected onKeydown(event: KeyboardEvent) {
    if (!this.isOpen()) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
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
      case 'Enter': {
        const active = this.activeOption()
        if (active) {
          event.preventDefault()
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
    if (value != null) {
      const display = this.displayWith()(value)
      this.displayLabel.set(display)
      this.setInputValue(display)
      this.syncSelectedFromValue(value)
    } else {
      this.displayLabel.set('')
      this.setInputValue('')
      this.clearSelected()
    }
  }

  registerOnChange(fn: (value: unknown) => void) {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }

  private setInputValue(text: string) {
    const el = this.inputEl()
    if (el) {
      el.nativeElement.value = text
    }
  }

  private syncSelectedFromValue(value: unknown) {
    queueMicrotask(() => {
      const opts = this.options()
      const match = opts.find(o => o.value() === value)
      if (match) {
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

  private markSelected(option: UiAutocompleteOption) {
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
