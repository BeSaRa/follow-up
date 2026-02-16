import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'

export type DividerOrientation = 'horizontal' | 'vertical'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator',
    '[attr.aria-orientation]': 'orientation()',
    '[class]': 'hostClasses()',
  },
  template: `
    @if (orientation() === 'horizontal') {
      <span class="h-px flex-1 bg-border"></span>
      <span class="empty:hidden px-3 text-xs text-foreground-muted select-none"><ng-content /></span>
      <span class="h-px flex-1 bg-border"></span>
    }
  `,
})
export class UiDivider {
  readonly orientation = input<DividerOrientation>('horizontal')
  readonly inset = input(false, { transform: booleanAttribute })

  protected readonly hostClasses = computed(() => {
    const o = this.orientation()
    const isInset = this.inset()

    if (o === 'vertical') {
      return 'inline-block self-stretch w-px bg-border' + (isInset ? ' mt-4' : '')
    }

    return 'flex items-center w-full' + (isInset ? ' ps-4' : '')
  })
}
