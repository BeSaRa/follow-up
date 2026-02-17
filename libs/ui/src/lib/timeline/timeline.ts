import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  inject,
  input,
  signal,
} from '@angular/core'

// ── Types ────────────────────────────────────────────────────────

export type TimelineOrientation = 'vertical' | 'horizontal'
export type TimelineAlign = 'start' | 'end' | 'alternate'
export type TimelineItemStatus = 'completed' | 'active' | 'pending'

// ── UiTimelineContent ────────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ui-timeline-content',
  host: {
    class: 'block flex-1 pb-2',
  },
})
export class UiTimelineContent {}

// ── UiTimelineConnector ──────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-timeline-connector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    'aria-hidden': 'true',
  },
  template: '',
})
export class UiTimelineConnector {
  readonly active = input(false)

  private readonly item = inject(UiTimelineItem)
  private readonly timeline = inject(UiTimeline)

  protected readonly hostClasses = computed(() => {
    const isVertical = this.timeline.orientation() === 'vertical'
    const base = isVertical
      ? 'block w-0.5 flex-1 min-h-4'
      : 'block h-0.5 flex-1 min-w-4'

    const color = this.active() || this.item.status() === 'completed'
      ? 'bg-primary'
      : 'bg-border'

    return `${base} ${color}`
  })
}

// ── UiTimelineDot ────────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-timeline-dot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    'aria-hidden': 'true',
  },
  template: `<ng-content />`,
})
export class UiTimelineDot {
  readonly status = input<TimelineItemStatus | undefined>(undefined)

  private readonly item = inject(UiTimelineItem)

  private readonly resolvedStatus = computed(() => this.status() ?? this.item.status())

  protected readonly hostClasses = computed(() => {
    const base = 'flex size-3 items-center justify-center rounded-full shrink-0 ring-4 ring-background'
    const s = this.resolvedStatus()

    const statusClasses: Record<TimelineItemStatus, string> = {
      completed: 'bg-primary',
      active: 'bg-primary ring-primary/20',
      pending: 'bg-border',
    }

    return `${base} ${statusClasses[s]}`
  })
}

// ── UiTimelineItem ───────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-timeline-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listitem',
    '[class]': 'hostClasses()',
    '[attr.aria-label]': 'ariaLabel()',
  },
  template: `
    @if (isVertical()) {
      <div class="flex gap-4">
        <!-- Axis column: dot + connector -->
        <div class="flex flex-col items-center">
          <ng-content select="ui-timeline-dot" />
          <ng-content select="ui-timeline-connector" />
        </div>

        <!-- Content column -->
        <div class="flex-1 min-w-0">
          @if (timestamp()) {
            <time class="text-xs text-foreground-muted mb-1 block">{{ timestamp() }}</time>
          }
          <ng-content select="ui-timeline-content" />
        </div>
      </div>
    } @else {
      <!-- Horizontal layout: axis row (dot + connector), then content below -->
      <div class="flex items-center">
        <ng-content select="ui-timeline-dot" />
        <ng-content select="ui-timeline-connector" />
      </div>
      @if (timestamp()) {
        <time class="text-xs text-foreground-muted mt-1 block">{{ timestamp() }}</time>
      }
      <ng-content select="ui-timeline-content" />
    }
  `,
})
export class UiTimelineItem {
  readonly status = input<TimelineItemStatus>('pending')
  readonly timestamp = input<string | undefined>(undefined)

  private readonly timeline = inject(UiTimeline)
  private readonly _index = signal(-1)

  readonly index = this._index.asReadonly()

  readonly isVertical = computed(() => this.timeline.orientation() === 'vertical')

  protected readonly ariaLabel = computed(() => {
    const idx = this._index()
    const s = this.status()
    const ts = this.timestamp()
    const parts = [`Step ${idx + 1}`, s]
    if (ts) parts.push(ts)
    return parts.join(': ')
  })

  protected readonly hostClasses = computed(() => {
    const isVert = this.isVertical()
    const align = this.timeline.align()
    const idx = this._index()

    if (!isVert) {
      return 'block flex-1'
    }

    // Vertical layout
    const base = 'block'

    if (align === 'alternate') {
      const isEven = idx % 2 === 0
      return `${base} ${isEven ? 'ui-timeline-item--start' : 'ui-timeline-item--end'}`
    }

    return base
  })

  constructor() {
    this.timeline.register(this)
    inject(DestroyRef).onDestroy(() => this.timeline.unregister(this))
  }

  /** @internal */
  _setIndex(i: number) {
    this._index.set(i)
  }
}

// ── UiTimeline ───────────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'list',
    '[class]': 'hostClasses()',
  },
  styles: `
    :host {
      --ui-timeline-gap: 0;
    }
  `,
  template: `<ng-content />`,
})
export class UiTimeline {
  readonly orientation = input<TimelineOrientation>('vertical')
  readonly align = input<TimelineAlign>('start')

  private readonly _items: UiTimelineItem[] = []
  readonly items = signal<UiTimelineItem[]>([])

  protected readonly hostClasses = computed(() => {
    const o = this.orientation()
    const a = this.align()

    if (o === 'horizontal') {
      return 'flex items-start gap-[var(--ui-timeline-gap)]'
    }

    // Vertical
    const base = 'flex flex-col gap-[var(--ui-timeline-gap)]'

    if (a === 'end') {
      return `${base} items-end`
    }

    return base
  })

  register(item: UiTimelineItem) {
    this._items.push(item)
    this.syncItems()
  }

  unregister(item: UiTimelineItem) {
    const idx = this._items.indexOf(item)
    if (idx >= 0) {
      this._items.splice(idx, 1)
      this.syncItems()
    }
  }

  private syncItems() {
    this._items.forEach((it, i) => it._setIndex(i))
    this.items.set([...this._items])
  }
}
