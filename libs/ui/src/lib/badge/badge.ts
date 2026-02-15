import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
export type BadgeSize = 'sm' | 'md'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiBadge {
  readonly variant = input<BadgeVariant>('primary')
  readonly size = input<BadgeSize>('md')

  protected readonly hostClasses = computed(() => {
    const base =
      'inline-flex items-center font-medium rounded-full transition-colors'

    const variants: Record<BadgeVariant, string> = {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      accent: 'bg-accent text-accent-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      error: 'bg-error text-error-foreground',
      info: 'bg-info text-info-foreground',
      outline: 'border border-border bg-transparent text-foreground',
    }

    const sizes: Record<BadgeSize, string> = {
      sm: 'text-[0.625rem] px-2 py-0.5',
      md: 'text-xs px-2.5 py-0.5',
    }

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`
  })
}
