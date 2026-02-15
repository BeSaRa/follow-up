import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-breadcrumb-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-center gap-2 text-sm',
  },
  template: `
    <span [class]="textClasses()" [attr.aria-current]="active() ? 'page' : null">
      <ng-content />
    </span>
  `,
})
export class UiBreadcrumbItem {
  readonly active = input(false, { transform: booleanAttribute })

  protected readonly textClasses = computed(() =>
    this.active()
      ? 'text-foreground-muted font-normal'
      : 'text-foreground [&>a]:hover:underline [&>a]:underline-offset-4',
  )
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'navigation',
    'aria-label': 'Breadcrumb',
  },
  template: `
    <ol class="flex flex-wrap items-center gap-2 text-sm">
      <ng-content />
    </ol>
  `,
})
export class UiBreadcrumb {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-breadcrumb-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex text-foreground-subtle text-sm',
    'aria-hidden': 'true',
  },
  template: `<ng-content>/</ng-content>`,
})
export class UiBreadcrumbSeparatorItem {}
