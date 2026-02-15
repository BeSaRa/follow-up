import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[uiButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <svg
        class="animate-spin size-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    }
    <ng-content />
  `,
  host: {
    '[class]': 'hostClasses()',
    '[disabled]': 'disabled() || loading()',
  },
})
export class UiButton {
  readonly variant = input<ButtonVariant>('primary')
  readonly size = input<ButtonSize>('md')
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly loading = input(false, { transform: booleanAttribute })

  protected readonly hostClasses = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors cursor-pointer ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
      'disabled:opacity-50 disabled:pointer-events-none'

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
      accent: 'bg-accent text-accent-foreground hover:bg-accent-hover',
      outline:
        'border border-border bg-transparent text-foreground hover:bg-surface-hover hover:border-border-hover',
      ghost: 'bg-transparent text-foreground hover:bg-surface-hover',
      destructive: 'bg-error text-error-foreground hover:bg-error-hover',
    }

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    }

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`
  })
}
