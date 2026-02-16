import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

export type ChipVariant = 'primary' | 'secondary' | 'accent' | 'outline'
export type ChipSize = 'sm' | 'md'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    tabindex: '0',
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-selected]': 'selected()',
    '(click)': 'toggleSelected()',
    '(keydown.enter)': 'toggleSelected()',
    '(keydown.space)': '$event.preventDefault(); toggleSelected()',
    '(keydown.delete)': 'onRemove($event)',
    '(keydown.backspace)': 'onRemove($event)',
  },
  template: `
    @if (selected()) {
      <svg class="size-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
      </svg>
    }
    <span class="truncate"><ng-content /></span>
    @if (removable()) {
      <button
        type="button"
        class="inline-flex shrink-0 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline-none"
        [class]="removeButtonSize()"
        [disabled]="disabled()"
        aria-label="Remove"
        (click)="onRemove($event)"
      >
        <svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    }
  `,
})
export class UiChip {
  readonly variant = input<ChipVariant>('secondary')
  readonly size = input<ChipSize>('md')
  readonly removable = input(false, { transform: booleanAttribute })
  readonly selected = model(false)
  readonly disabled = input(false, { transform: booleanAttribute })

  readonly removed = output<void>()

  protected readonly removeButtonSize = computed(() => {
    return this.size() === 'sm' ? 'size-4' : 'size-5'
  })

  protected readonly hostClasses = computed(() => {
    const v = this.variant()
    const s = this.size()
    const isSelected = this.selected()
    const isDisabled = this.disabled()

    const base = 'inline-flex items-center gap-1 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none'

    const sizes: Record<ChipSize, string> = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-3 py-1',
    }

    const variants: Record<ChipVariant, string> = {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      accent: 'bg-accent text-accent-foreground',
      outline: 'border border-border bg-transparent text-foreground',
    }

    const selectedVariants: Record<ChipVariant, string> = {
      primary: 'bg-primary text-primary-foreground ring-2 ring-primary/50',
      secondary: 'bg-secondary text-secondary-foreground ring-2 ring-secondary/50',
      accent: 'bg-accent text-accent-foreground ring-2 ring-accent/50',
      outline: 'border-2 border-primary bg-transparent text-primary',
    }

    const variantClass = isSelected ? selectedVariants[v] : variants[v]
    const cursor = isDisabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'

    return `${base} ${sizes[s]} ${variantClass} ${cursor}`
  })

  protected toggleSelected() {
    if (this.disabled()) return
    this.selected.update(v => !v)
  }

  protected onRemove(event: Event) {
    if (this.disabled()) return
    if (!this.removable()) return
    event.stopPropagation()
    this.removed.emit()
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-chip-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiChip],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiChipInput),
      multi: true,
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'focusInput()',
  },
  template: `
    @for (chip of values(); track chip) {
      <ui-chip
        [variant]="variant()"
        [size]="size()"
        removable
        [disabled]="disabled()"
        (removed)="removeChip(chip)"
      >{{ chip }}</ui-chip>
    }
    <input
      #inputEl
      type="text"
      class="min-w-[80px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-muted disabled:cursor-not-allowed"
      [placeholder]="values().length ? '' : placeholder()"
      [disabled]="disabled()"
      (keydown.enter)="addChip(inputEl); $event.preventDefault()"
      (keydown.backspace)="onBackspace(inputEl)"
    />
  `,
})
export class UiChipInput implements ControlValueAccessor {
  readonly placeholder = input('Type and press Enter...')
  readonly variant = input<ChipVariant>('secondary')
  readonly size = input<ChipSize>('md')
  readonly disabled = input(false, { transform: booleanAttribute })

  readonly values = model<string[]>([])

  private onChange: (value: string[]) => void = () => {}
  private onTouched: () => void = () => {}
  private touched = false

  protected readonly hostClasses = computed(() => {
    const base = 'flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-ring'

    return base + (this.disabled() ? ' opacity-50 pointer-events-none' : ' cursor-text')
  })

  protected focusInput() {
    const host = document.activeElement?.closest('ui-chip-input')
    const input = host?.querySelector('input')
    input?.focus()
  }

  protected addChip(inputEl: HTMLInputElement) {
    const val = inputEl.value.trim()
    if (!val || this.disabled()) return
    if (this.values().includes(val)) {
      inputEl.value = ''
      return
    }
    this.values.update(v => [...v, val])
    inputEl.value = ''
    this.notifyChange()
  }

  protected removeChip(chip: string) {
    if (this.disabled()) return
    this.values.update(v => v.filter(c => c !== chip))
    this.notifyChange()
  }

  protected onBackspace(inputEl: HTMLInputElement) {
    if (inputEl.value || this.disabled()) return
    this.values.update(v => v.slice(0, -1))
    this.notifyChange()
  }

  private notifyChange() {
    this.onChange(this.values())
    if (!this.touched) {
      this.onTouched()
      this.touched = true
    }
  }

  writeValue(value: string[]) {
    this.values.set(value ?? [])
  }

  registerOnChange(fn: (value: string[]) => void) {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }
}
