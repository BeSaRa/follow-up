import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  model,
  signal,
} from '@angular/core'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block',
  },
})
export class UiTabs {
  readonly activeTab = model<string>('')
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-tab-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'tablist',
    class:
      'inline-flex items-center gap-1 rounded-md bg-surface p-1 transition-colors',
  },
})
export class UiTabList {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'tab',
    '[class]': 'hostClasses()',
    '[attr.aria-selected]': 'isActive()',
    '[tabindex]': 'isActive() ? 0 : -1',
    '(click)': 'activate()',
    '(keydown.ArrowRight)': 'focusNext($event)',
    '(keydown.ArrowLeft)': 'focusPrev($event)',
  },
})
export class UiTab {
  readonly value = input.required<string>()
  readonly tabs = input.required<UiTabs>()

  protected readonly isActive = computed(
    () => this.tabs().activeTab() === this.value(),
  )

  protected readonly hostClasses = computed(() => {
    const base =
      'inline-flex items-center justify-center cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

    return this.isActive()
      ? `${base} bg-surface-raised text-foreground shadow-sm`
      : `${base} text-foreground-muted hover:text-foreground`
  })

  protected activate() {
    this.tabs().activeTab.set(this.value())
  }

  protected focusNext(event: Event) {
    event.preventDefault()
    const next = (event.target as HTMLElement).nextElementSibling as HTMLElement
    next?.focus()
    next?.click()
  }

  protected focusPrev(event: Event) {
    event.preventDefault()
    const prev = (event.target as HTMLElement)
      .previousElementSibling as HTMLElement
    prev?.focus()
    prev?.click()
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-tab-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isActive()) {
      <ng-content />
    }
  `,
  host: {
    role: 'tabpanel',
    '[class]': '"mt-3 transition-colors"',
    '[attr.hidden]': '!isActive() || null',
  },
})
export class UiTabPanel {
  readonly value = input.required<string>()
  readonly tabs = input.required<UiTabs>()

  protected readonly isActive = computed(
    () => this.tabs().activeTab() === this.value(),
  )
}
