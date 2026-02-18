import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
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

    let sourceStatus = this.item.status()

    // In reversed vertical mode, color based on the item below (the one we connect to)
    if (this.timeline.reverse() && isVertical) {
      const items = this.timeline.items()
      const belowItem = items[this.item.index() - 1]
      if (belowItem) {
        sourceStatus = belowItem.status()
      }
    }

    const color = this.active() || sourceStatus === 'completed'
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
    const base = 'flex size-3 items-center justify-center rounded-full shrink-0'
    const s = this.resolvedStatus()

    const statusClasses: Record<TimelineItemStatus, string> = {
      completed: 'bg-primary',
      active: 'bg-primary ring-4 ring-primary/20 animate-pulse-ring',
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
    <div [class]="wrapperClasses()">
      <div [class]="axisClasses()">
        <ng-content select="ui-timeline-dot" />
        @if (!hideUserConnector()) {
          <ng-content select="ui-timeline-connector" />
        }
        @if (showAutoConnector()) {
          <span [class]="autoConnectorClasses()" aria-hidden="true"></span>
        }
      </div>
      <div [class]="contentAreaClasses()">
        @if (timestamp()) {
          <time [class]="timestampClasses()">{{ timestamp() }}</time>
        }
        <ng-content select="ui-timeline-content" />
      </div>
    </div>
  `,
})
export class UiTimelineItem {
  readonly status = input<TimelineItemStatus>('pending')
  readonly timestamp = input<string | undefined>(undefined)

  private readonly timeline = inject(UiTimeline)
  private readonly _index = signal(-1)
  private readonly userConnector = contentChild(UiTimelineConnector)

  readonly index = this._index.asReadonly()

  readonly isVertical = computed(() => this.timeline.orientation() === 'vertical')

  /** In reversed mode, hide user connector on the visually-last item (DOM index 0) */
  protected readonly hideUserConnector = computed(() => {
    if (!this.timeline.reverse() || !this.isVertical()) return false
    return this._index() === 0
  })

  /** In reversed mode, show auto connector on the visually-first item if user didn't provide one */
  protected readonly showAutoConnector = computed(() => {
    if (!this.timeline.reverse() || !this.isVertical()) return false
    const items = this.timeline.items()
    return this._index() === items.length - 1 && !this.userConnector()
  })

  protected readonly autoConnectorClasses = computed(() => {
    const base = 'block w-0.5 flex-1 min-h-4'
    // In reversed mode, color based on the item below (DOM index - 1)
    const items = this.timeline.items()
    const belowItem = items[this._index() - 1]
    const sourceStatus = belowItem?.status() ?? this.status()
    const color = sourceStatus === 'completed' ? 'bg-primary' : 'bg-border'
    return `${base} ${color}`
  })

  protected readonly wrapperClasses = computed(() =>
    this.isVertical() ? 'flex gap-4' : 'block',
  )

  protected readonly axisClasses = computed(() => {
    const vert = this.isVertical()
    const reversed = this.timeline.reverse()

    if (vert) {
      // Always dot-on-top in vertical — no flex-col-reverse
      return 'flex flex-col items-center'
    }

    return reversed
      ? 'flex flex-row-reverse items-center'
      : 'flex items-center'
  })

  protected readonly contentAreaClasses = computed(() =>
    this.isVertical() ? 'flex-1 min-w-0' : 'mt-1',
  )

  protected readonly timestampClasses = computed(() =>
    this.isVertical()
      ? 'text-xs text-foreground-muted mb-1 block'
      : 'text-xs text-foreground-muted block',
  )

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
  readonly reverse = input(false)

  private readonly _items: UiTimelineItem[] = []
  readonly items = signal<UiTimelineItem[]>([])

  protected readonly hostClasses = computed(() => {
    const o = this.orientation()
    const a = this.align()
    const r = this.reverse()

    if (o === 'horizontal') {
      const dir = r ? 'flex-row-reverse' : ''
      return `flex items-start gap-[var(--ui-timeline-gap)] ${dir}`.trim()
    }

    // Vertical
    const dir = r ? 'flex-col-reverse' : 'flex-col'
    const base = `flex ${dir} gap-[var(--ui-timeline-gap)]`

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
