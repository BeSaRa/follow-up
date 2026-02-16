import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay'

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
    '[attr.aria-selected]': 'isActive()',
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

  private readonly autocomplete = inject(forwardRef(() => UiAutocomplete))

  protected readonly hostClasses = computed(() => {
    const base = 'block w-full cursor-pointer px-3 py-2 text-left text-sm text-foreground transition-colors'
    const activeClass = this.isActive() ? ' bg-surface-hover' : ' hover:bg-surface-hover'
    const disabledClass = this.disabled() ? ' !cursor-default !opacity-50 !pointer-events-none' : ''
    return `${base}${activeClass}${disabledClass}`
  })

  select() {
    if (!this.disabled()) {
      this.autocomplete.selectOption(this)
    }
  }

  protected onMouseEnter() {
    if (!this.disabled()) {
      this.autocomplete.setActiveOption(this)
    }
  }
}

@Component({
  imports: [CdkConnectedOverlay],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="triggerElement()!"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayOffsetY]="4"
      [cdkConnectedOverlayMinWidth]="triggerElement()?.nativeElement.offsetWidth"
      (overlayOutsideClick)="onOutsideClick($event)"
    >
      <div
        [id]="panelId"
        role="listbox"
        class="max-h-60 overflow-auto rounded-md border border-border bg-surface-raised py-1 shadow-md"
        [style.width.px]="triggerElement()?.nativeElement.offsetWidth"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiAutocomplete {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly displayWith = input<(value: any) => string>((v) => v?.toString() ?? '')

  readonly options = contentChildren(UiAutocompleteOption)
  readonly optionSelected = output<UiAutocompleteOption>()

  readonly panelId = `ui-autocomplete-panel-${nextId++}`
  readonly isOpen = signal(false)
  readonly triggerElement = signal<ElementRef | null>(null)

  protected readonly positions = PANEL_POSITIONS

  private readonly activeIndex = signal(-1)

  private readonly enabledOptions = computed(() =>
    this.options().filter(o => !o.disabled()),
  )

  readonly activeOption = computed(() => {
    const idx = this.activeIndex()
    const opts = this.enabledOptions()
    return idx >= 0 && idx < opts.length ? opts[idx] : null
  })

  readonly activeDescendant = computed(() => this.activeOption()?.id ?? null)

  setActiveOption(option: UiAutocompleteOption) {
    const opts = this.enabledOptions()
    const idx = opts.indexOf(option)
    if (idx !== -1) {
      this.clearActive()
      this.activeIndex.set(idx)
      option.isActive.set(true)
    }
  }

  selectOption(option: UiAutocompleteOption) {
    this.optionSelected.emit(option)
  }

  moveActive(delta: number) {
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

  selectActive() {
    const active = this.activeOption()
    if (active) active.select()
  }

  resetActive() {
    this.clearActive()
    this.activeIndex.set(-1)
  }

  setTrigger(el: ElementRef) {
    this.triggerElement.set(el)
  }

  open() {
    this.isOpen.set(true)
    this.resetActive()
  }

  close() {
    this.isOpen.set(false)
    this.resetActive()
  }

  protected onOutsideClick(event: MouseEvent) {
    const trigger = this.triggerElement()
    if (trigger && trigger.nativeElement.contains(event.target as Node)) return
    this.close()
  }

  private clearActive() {
    this.enabledOptions().forEach(o => o.isActive.set(false))
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[uiAutocompleteTrigger]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiAutocompleteTrigger),
      multi: true,
    },
  ],
  host: {
    role: 'combobox',
    autocomplete: 'off',
    '[attr.aria-autocomplete]': '"list"',
    '[attr.aria-expanded]': 'panel().isOpen()',
    '[attr.aria-controls]': 'panel().isOpen() ? panel().panelId : null',
    '[attr.aria-activedescendant]': 'panel().activeDescendant()',
    '(input)': 'onInput($event)',
    '(focus)': 'openPanel()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiAutocompleteTrigger implements ControlValueAccessor {
  readonly panel = input.required<UiAutocomplete>({ alias: 'uiAutocompleteTrigger' })

  private readonly el = inject(ElementRef)

  private onChange: (value: unknown) => void = () => {}
  private onTouched: () => void = () => {}
  private skipNextFocusOpen = false

  constructor() {
    effect(() => {
      const p = this.panel()
      p.setTrigger(this.el)
      p.optionSelected.subscribe(option => {
        const value = option.value()
        const display = p.displayWith()(value)
        this.el.nativeElement.value = display
        this.onChange(value)
        p.close()
        this.skipNextFocusOpen = true
        this.el.nativeElement.focus()
        this.onTouched()
      })
    })
  }

  openPanel() {
    if (this.skipNextFocusOpen) {
      this.skipNextFocusOpen = false
      return
    }
    const p = this.panel()
    if (!p.isOpen()) {
      p.open()
    }
  }

  protected onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.onChange(value)
    const p = this.panel()
    if (!p.isOpen()) {
      p.open()
    }
    p.resetActive()
  }

  protected onKeydown(event: KeyboardEvent) {
    const p = this.panel()

    if (!p.isOpen()) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        this.openPanel()
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        p.moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        p.moveActive(-1)
        break
      case 'Enter':
        if (p.activeOption()) {
          event.preventDefault()
          p.selectActive()
        }
        break
      case 'Escape':
        event.preventDefault()
        p.close()
        break
      case 'Tab':
        p.close()
        break
    }
  }

  writeValue(value: unknown) {
    if (value != null) {
      const display = this.panel()?.displayWith()
      this.el.nativeElement.value = display ? display(value) : value
    } else {
      this.el.nativeElement.value = ''
    }
  }

  registerOnChange(fn: (value: unknown) => void) {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }
}
