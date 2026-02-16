import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
} from '@angular/core'

let nextId = 0

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'flex flex-col',
  },
})
export class UiAccordion {
  readonly multi = input(false, { transform: booleanAttribute })

  private readonly items = new Set<UiAccordionItem>()

  register(item: UiAccordionItem) {
    this.items.add(item)
  }

  unregister(item: UiAccordionItem) {
    this.items.delete(item)
  }

  closeOthers(except: UiAccordionItem) {
    if (!this.multi()) {
      this.items.forEach(item => {
        if (item !== except) item.expanded.set(false)
      })
    }
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block border-b border-border',
  },
  styles: `
    .accordion-body {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.2s ease;
    }
    .accordion-body.expanded {
      grid-template-rows: 1fr;
    }
  `,
  template: `
    <button
      type="button"
      [attr.id]="triggerId"
      [attr.aria-expanded]="expanded()"
      [attr.aria-controls]="panelId"
      [disabled]="disabled()"
      [class]="triggerClasses()"
      (click)="toggle()"
    >
      <ng-content select="[accordionHeader]" />
      <svg
        [class]="chevronClasses()"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div
      [attr.id]="panelId"
      role="region"
      [attr.aria-labelledby]="triggerId"
      [class]="'accordion-body' + (expanded() ? ' expanded' : '')"
    >
      <div class="overflow-hidden">
        <div class="px-1 pb-4 text-sm text-foreground-muted">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class UiAccordionItem {
  private readonly accordion = inject(UiAccordion)

  readonly expanded = model(false)
  readonly disabled = input(false, { transform: booleanAttribute })

  protected readonly triggerId = `ui-accordion-trigger-${nextId++}`
  protected readonly panelId = `ui-accordion-panel-${nextId++}`

  constructor() {
    this.accordion.register(this)
    inject(DestroyRef).onDestroy(() => this.accordion.unregister(this))
  }

  protected readonly triggerClasses = computed(() => {
    const base = 'flex w-full items-center justify-between py-4 text-start text-sm font-medium text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm'

    return base + (this.disabled() ? ' opacity-50 cursor-not-allowed' : ' cursor-pointer')
  })

  protected readonly chevronClasses = computed(() => {
    const base = 'size-5 shrink-0 text-foreground-muted transition-transform duration-200'

    return base + (this.expanded() ? ' rotate-180' : '')
  })

  toggle() {
    if (this.disabled()) return
    this.expanded.update(v => !v)
    if (this.expanded()) {
      this.accordion.closeOthers(this)
    }
  }
}
