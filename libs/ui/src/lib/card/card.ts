import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'

export type UiCardShadow = 'none' | 'sm' | 'md' | 'lg'

const SHADOW_CLASSES: Record<UiCardShadow, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiCard {
  readonly shadow = input<UiCardShadow>('sm')

  protected readonly hostClasses = computed(() => {
    const base =
      'block rounded-lg border border-border bg-surface-raised transition-colors'
    const shadow = SHADOW_CLASSES[this.shadow()]
    return shadow ? `${base} ${shadow}` : base
  })
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'flex flex-col gap-1.5 p-6',
  },
})
export class UiCardHeader {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-card-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'text-lg font-semibold leading-none tracking-tight text-foreground',
  },
})
export class UiCardTitle {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-card-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'text-sm text-foreground-muted',
  },
})
export class UiCardDescription {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-card-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block p-6 pt-0',
  },
})
export class UiCardContent {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-card-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'flex items-center gap-2 p-6 pt-0',
  },
})
export class UiCardFooter {}
