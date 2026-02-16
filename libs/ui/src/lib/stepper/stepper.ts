import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core'

export type StepperOrientation = 'horizontal' | 'vertical'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    @if (orientation() === 'horizontal') {
      <div role="tablist" [attr.aria-orientation]="'horizontal'" class="flex items-center mb-6">
        @for (step of stepsList(); track step; let i = $index; let last = $last) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="selectedIndex() === i"
            [disabled]="isStepDisabled(i)"
            class="flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            [class]="isStepDisabled(i) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
            (click)="goToStep(i)"
            (keydown.ArrowRight)="focusNextHeader($event)"
            (keydown.ArrowLeft)="focusPrevHeader($event)"
          >
            <span [class]="circleClasses(i, step)">
              @if (step.completed()) {
                <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                </svg>
              } @else {
                {{ i + 1 }}
              }
            </span>
            <span class="flex flex-col items-start">
              <span class="text-sm font-medium" [class]="selectedIndex() === i ? 'text-foreground' : 'text-foreground-muted'">{{ step.label() }}</span>
              @if (step.optional()) {
                <span class="text-xs text-foreground-muted">(Optional)</span>
              }
            </span>
          </button>
          @if (!last) {
            <div class="h-px flex-1 bg-border mx-3"></div>
          }
        }
      </div>
    }
    <ng-content />
  `,
})
export class UiStepper {
  readonly selectedIndex = model(0)
  readonly linear = input(false, { transform: booleanAttribute })
  readonly orientation = input<StepperOrientation>('horizontal')

  private readonly _steps: UiStep[] = []
  readonly stepsList = signal<UiStep[]>([])

  register(step: UiStep) {
    this._steps.push(step)
    this.stepsList.set([...this._steps])
  }

  unregister(step: UiStep) {
    const idx = this._steps.indexOf(step)
    if (idx >= 0) {
      this._steps.splice(idx, 1)
      this.stepsList.set([...this._steps])
    }
  }

  indexOf(step: UiStep) {
    return this._steps.indexOf(step)
  }

  next() {
    const idx = this.selectedIndex()
    if (idx < this._steps.length - 1) {
      this.goToStep(idx + 1)
    }
  }

  previous() {
    const idx = this.selectedIndex()
    if (idx > 0) {
      this.goToStep(idx - 1)
    }
  }

  goToStep(index: number) {
    if (this.isStepDisabled(index)) return
    this.selectedIndex.set(index)
  }

  isStepDisabled(index: number): boolean {
    if (!this.linear()) return false
    // In linear mode, can only go to a step if all previous are completed or optional
    for (let i = 0; i < index; i++) {
      const step = this._steps[i]
      if (step && !step.completed() && !step.optional()) return true
    }
    return false
  }

  protected circleClasses(index: number, step: UiStep): string {
    const base = 'flex size-8 items-center justify-center rounded-full text-sm font-medium shrink-0 transition-colors'

    if (this.selectedIndex() === index) {
      return `${base} bg-primary text-primary-foreground`
    }

    if (step.completed()) {
      return `${base} bg-primary text-primary-foreground`
    }

    return `${base} border-2 border-border text-foreground-muted`
  }

  protected focusNextHeader(event: Event) {
    event.preventDefault()
    const next = (event.target as HTMLElement).nextElementSibling?.nextElementSibling as HTMLElement
    next?.focus()
  }

  protected focusPrevHeader(event: Event) {
    event.preventDefault()
    const prev = (event.target as HTMLElement).previousElementSibling?.previousElementSibling as HTMLElement
    prev?.focus()
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"block"',
    '[attr.role]': '"tabpanel"',
    '[attr.hidden]': 'stepper.orientation() === "horizontal" && !isActive() || null',
  },
  template: `
    @if (stepper.orientation() === 'vertical') {
      <div class="flex gap-3">
        <div class="flex flex-col items-center">
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="isActive()"
            [disabled]="stepper.isStepDisabled(index())"
            class="flex size-8 items-center justify-center rounded-full text-sm font-medium shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            [class]="verticalCircleClasses()"
            (click)="select()"
            (keydown.ArrowDown)="focusNextVertical($event)"
            (keydown.ArrowUp)="focusPrevVertical($event)"
          >
            @if (completed()) {
              <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
              </svg>
            } @else {
              {{ index() + 1 }}
            }
          </button>
          @if (!isLast()) {
            <div class="w-px flex-1 bg-border my-1 min-h-4"></div>
          }
        </div>
        <div class="flex-1 pb-4">
          <button
            type="button"
            class="text-sm font-medium transition-colors focus-visible:outline-none"
            [class]="isActive() ? 'text-foreground' : 'text-foreground-muted'"
            [disabled]="stepper.isStepDisabled(index())"
            (click)="select()"
          >
            {{ label() }}
            @if (optional()) {
              <span class="text-xs text-foreground-muted ms-1">(Optional)</span>
            }
          </button>
          @if (isActive()) {
            <div class="mt-3">
              <ng-content />
            </div>
          }
        </div>
      </div>
    } @else {
      @if (isActive()) {
        <ng-content />
      }
    }
  `,
})
export class UiStep {
  readonly stepper = inject(UiStepper)

  readonly label = input.required<string>()
  readonly completed = input(false, { transform: booleanAttribute })
  readonly optional = input(false, { transform: booleanAttribute })

  readonly index = computed(() => this.stepper.indexOf(this))
  readonly isActive = computed(() => this.stepper.selectedIndex() === this.index())
  readonly isLast = computed(() => this.index() === this.stepper.stepsList().length - 1)

  constructor() {
    this.stepper.register(this)
    inject(DestroyRef).onDestroy(() => this.stepper.unregister(this))
  }

  select() {
    this.stepper.goToStep(this.index())
  }

  protected verticalCircleClasses = computed(() => {
    if (this.isActive()) return 'bg-primary text-primary-foreground'
    if (this.completed()) return 'bg-primary text-primary-foreground'
    return 'border-2 border-border text-foreground-muted'
  })

  protected focusNextVertical(event: Event) {
    event.preventDefault()
    const step = (event.target as HTMLElement).closest('ui-step')
    const nextStep = step?.nextElementSibling
    const btn = nextStep?.querySelector('button[role="tab"]') as HTMLElement
    btn?.focus()
  }

  protected focusPrevVertical(event: Event) {
    event.preventDefault()
    const step = (event.target as HTMLElement).closest('ui-step')
    const prevStep = step?.previousElementSibling
    const btn = prevStep?.querySelector('button[role="tab"]') as HTMLElement
    btn?.focus()
  }
}
