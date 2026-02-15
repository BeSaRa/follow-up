import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class:
      'block rounded-lg border border-border bg-surface-raised shadow-sm transition-colors',
  },
})
export class UiCard {}

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
