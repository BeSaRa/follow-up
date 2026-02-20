import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  input,
  signal,
} from '@angular/core'
import { NgControl } from '@angular/forms'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { EMPTY, switchMap } from 'rxjs'
import { TranslatePipe } from '@ngx-translate/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[uiInput], textarea[uiInput]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiInput {
  readonly error = input(false, { transform: booleanAttribute })

  /** @internal Set by parent UiFormField for auto-error styling */
  readonly _autoError = signal(false)

  protected readonly hostClasses = computed(() => {
    const base =
      'w-full rounded-md border bg-transparent px-3 py-2 text-sm text-foreground transition-colors ' +
      'placeholder:text-foreground-subtle ' +
      'focus:outline-none focus:ring-2 focus:ring-ring ' +
      'disabled:cursor-not-allowed disabled:opacity-50'

    return this.error() || this._autoError()
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

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[uiFormError]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-xs text-error mt-1.5',
    role: 'alert',
    'animate.enter': 'slide-error-enter',
    'animate.leave': 'slide-error-leave',
  },
  template: `<ng-content />`,
  styles: `
    :host(.slide-error-enter) {
      animation: slide-error-in 150ms ease-out;
    }

    @keyframes slide-error-in {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    :host(.slide-error-leave) {
      opacity: 0;
      transform: translateY(-4px);
      transition: opacity 150ms ease-in, transform 150ms ease-in;
    }
  `,
})
export class UiFormError {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, UiFormError],
  host: {
    class: 'block',
  },
  template: `
    <ng-content select="[uiLabel]" />
    <ng-content select="[uiInput]" />
    <div class="min-h-6 overflow-hidden">
      <ng-content select="[uiFormHint]" />
      <ng-content select="[uiFormError]" />
      @if (showError()) {
        <span uiFormError>{{ autoErrorKey() | translate: autoErrorParams() }}</span>
      }
    </div>
  `,
})
export class UiFormField {
  readonly showErrors = input(true, { transform: booleanAttribute })
  readonly errorMap = input<Record<string, string>>({})

  private readonly inputRef = contentChild(UiInput, { read: ElementRef })
  private readonly uiInput = contentChild(UiInput)
  private readonly ngControl = contentChild(NgControl)

  private readonly controlEvent = toSignal(
    toObservable(computed(() => this.ngControl()?.control)).pipe(
      switchMap(ctrl => ctrl?.events ?? EMPTY),
    ),
  )

  private readonly hasError = computed(() => {
    this.controlEvent()
    const ctrl = this.ngControl()?.control
    return !!ctrl && ctrl.touched && ctrl.invalid
  })

  protected readonly showError = computed(() =>
    this.showErrors() && this.hasError()
  )

  protected readonly firstError = computed(() => {
    this.controlEvent()
    const ctrl = this.ngControl()?.control
    if (!ctrl?.errors) return null
    const [key, params] = Object.entries(ctrl.errors)[0]
    return { key, params }
  })

  protected readonly autoErrorKey = computed(() => {
    const error = this.firstError()
    if (!error) return ''
    return this.errorMap()[error.key] ?? `errors.${error.key}`
  })

  protected readonly autoErrorParams = computed(() => {
    const error = this.firstError()
    return error?.params && typeof error.params === 'object' ? error.params : {}
  })

  protected readonly inputId = computed(() => {
    const el = this.inputRef()
    return el ? (el.nativeElement as HTMLElement).id : null
  })

  constructor() {
    effect(() => {
      const uiInput = this.uiInput()
      const hasError = this.showError()
      if (uiInput) {
        uiInput._autoError.set(hasError)
      }
    })
  }
}
