import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  ElementRef,
  input,
} from '@angular/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[uiInput], textarea[uiInput]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiInput {
  readonly error = input(false, { transform: booleanAttribute })

  protected readonly hostClasses = computed(() => {
    const base =
      'w-full rounded-md border bg-transparent px-3 py-2 text-sm text-foreground transition-colors ' +
      'placeholder:text-foreground-subtle ' +
      'focus:outline-none focus:ring-2 focus:ring-ring ' +
      'disabled:cursor-not-allowed disabled:opacity-50'

    return this.error()
      ? `${base} border-error focus:ring-error/40`
      : `${base} border-border hover:border-border-hover`
  })
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiLabel]',
  host: {
    class: 'block text-sm font-medium text-foreground mb-1.5',
  },
})
export class UiLabel {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiFormHint]',
  host: {
    class: 'block text-xs text-foreground-muted mt-1.5',
  },
})
export class UiFormHint {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiFormError]',
  host: {
    class: 'block text-xs text-error mt-1.5',
    role: 'alert',
  },
})
export class UiFormError {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <ng-content select="[uiLabel]" />
    <ng-content select="[uiInput]" />
    <ng-content select="[uiFormHint]" />
    <ng-content select="[uiFormError]" />
  `,
})
export class UiFormField {
  private readonly inputRef = contentChild(UiInput, { read: ElementRef })

  protected readonly inputId = computed(() => {
    const el = this.inputRef()
    return el ? (el.nativeElement as HTMLElement).id : null
  })
}
