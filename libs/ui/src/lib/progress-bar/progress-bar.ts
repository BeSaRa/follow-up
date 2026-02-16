import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'

export type ProgressBarVariant = 'primary' | 'accent' | 'success' | 'warning' | 'error'
export type ProgressBarSize = 'sm' | 'md'
export type ProgressBarMode = 'determinate' | 'indeterminate'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    '[attr.aria-valuenow]': 'mode() === "determinate" ? clampedValue() : null',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[class]': 'hostClasses()',
  },
  styles: `
    @keyframes indeterminate {
      0% { inset-inline-start: -25%; }
      100% { inset-inline-start: 100%; }
    }
    .animate-indeterminate {
      animation: indeterminate 1.5s ease-in-out infinite;
    }
  `,
  template: `
    <span [class]="fillClasses()" [style.width]="fillWidth()"></span>
  `,
})
export class UiProgressBar {
  readonly value = input(0)
  readonly mode = input<ProgressBarMode>('determinate')
  readonly variant = input<ProgressBarVariant>('primary')
  readonly size = input<ProgressBarSize>('md')

  protected readonly clampedValue = computed(() =>
    Math.max(0, Math.min(100, this.value())),
  )

  protected readonly fillWidth = computed(() => {
    if (this.mode() === 'indeterminate') return '25%'
    return `${this.clampedValue()}%`
  })

  protected readonly hostClasses = computed(() => {
    const s = this.size()

    const base = 'block w-full overflow-hidden rounded-full bg-border'

    const sizes: Record<ProgressBarSize, string> = {
      sm: 'h-1',
      md: 'h-2',
    }

    return `${base} ${sizes[s]}`
  })

  protected readonly fillClasses = computed(() => {
    const v = this.variant()
    const m = this.mode()

    const base = 'block h-full rounded-full transition-[width] duration-300'

    const variants: Record<ProgressBarVariant, string> = {
      primary: 'bg-primary',
      accent: 'bg-accent',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
    }

    const anim = m === 'indeterminate' ? ' relative animate-indeterminate' : ''

    return `${base} ${variants[v]}${anim}`
  })
}
