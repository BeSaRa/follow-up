import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core'

export type AlertVariant = 'success' | 'warning' | 'error' | 'info'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex gap-3">
      <div class="flex-1">
        <ng-content />
      </div>
      @if (dismissible()) {
        <button
          type="button"
          class="shrink-0 cursor-pointer text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
          (click)="dismissed.emit()"
        >
          <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      }
    </div>
  `,
  host: {
    role: 'alert',
    '[class]': 'hostClasses()',
  },
})
export class UiAlert {
  readonly variant = input<AlertVariant>('info')
  readonly dismissible = input(false)
  readonly dismissed = output<void>()

  protected readonly hostClasses = computed(() => {
    const base = 'block rounded-md border p-4 text-sm transition-colors'

    const variants: Record<AlertVariant, string> = {
      success: 'border-success/30 bg-success/10 text-success',
      warning: 'border-warning/30 bg-warning/10 text-warning',
      error: 'border-error/30 bg-error/10 text-error',
      info: 'border-info/30 bg-info/10 text-info',
    }

    return `${base} ${variants[this.variant()]}`
  })
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-alert-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block font-semibold leading-none mb-1',
  },
})
export class UiAlertTitle {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-alert-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block text-sm opacity-80',
  },
})
export class UiAlertDescription {}
