import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'

export type SkeletonVariant = 'line' | 'circle' | 'rect'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.width]': 'hostWidth()',
    '[style.height]': 'hostHeight()',
    'aria-hidden': 'true',
  },
  template: '',
})
export class UiSkeleton {
  readonly variant = input<SkeletonVariant>('line')
  readonly width = input<string | undefined>(undefined)
  readonly height = input<string | undefined>(undefined)

  protected readonly hostClasses = computed(() => {
    const base = 'block animate-pulse bg-surface-hover'
    return this.variant() === 'circle'
      ? `${base} rounded-full`
      : `${base} rounded-md`
  })

  protected readonly hostWidth = computed(() => {
    if (this.width()) return this.width()
    switch (this.variant()) {
      case 'circle': return '2.5rem'
      case 'rect': return '100%'
      default: return '100%'
    }
  })

  protected readonly hostHeight = computed(() => {
    if (this.height()) return this.height()
    switch (this.variant()) {
      case 'circle': return this.hostWidth()
      case 'rect': return '8rem'
      default: return '1rem'
    }
  })
}
