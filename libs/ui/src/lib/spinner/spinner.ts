import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'

export type SpinnerSize = 'sm' | 'md' | 'lg'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [class]="svgClasses()"
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
  `,
  host: {
    role: 'status',
    class: 'inline-flex items-center justify-center',
    '[attr.aria-label]': '"Loading"',
  },
})
export class UiSpinner {
  readonly size = input<SpinnerSize>('md')

  protected readonly svgClasses = computed(() => {
    const sizes: Record<SpinnerSize, string> = {
      sm: 'size-4',
      md: 'size-6',
      lg: 'size-10',
    }

    return `animate-spin ${sizes[this.size()]}`
  })
}
