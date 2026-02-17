import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  UiTimeline,
  UiTimelineItem,
  UiTimelineDot,
  UiTimelineContent,
  UiTimelineConnector,
} from './timeline'
import type { TimelineOrientation, TimelineAlign, TimelineItemStatus } from './timeline'

// ── Helpers ──────────────────────────────────────────────────────

function query<T extends HTMLElement>(fixture: ComponentFixture<unknown>, selector: string): T {
  const el = fixture.nativeElement.querySelector(selector) as T | null
  if (!el) throw new Error(`Element not found: ${selector}`)
  return el
}

function queryAll(fixture: ComponentFixture<unknown>, selector: string): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll(selector))
}

// ── Test host ────────────────────────────────────────────────────

@Component({
  imports: [UiTimeline, UiTimelineItem, UiTimelineDot, UiTimelineContent, UiTimelineConnector],
  template: `
    <ui-timeline [orientation]="orientation()" [align]="align()">
      <ui-timeline-item [status]="status1()" [timestamp]="timestamp1()">
        <ui-timeline-dot />
        <ui-timeline-connector />
        <ui-timeline-content>
          <p class="item-1-text">First item</p>
        </ui-timeline-content>
      </ui-timeline-item>

      <ui-timeline-item [status]="status2()">
        <ui-timeline-dot />
        <ui-timeline-connector />
        <ui-timeline-content>
          <p class="item-2-text">Second item</p>
        </ui-timeline-content>
      </ui-timeline-item>

      <ui-timeline-item [status]="status3()">
        <ui-timeline-dot />
        <ui-timeline-content>
          <p class="item-3-text">Third item</p>
        </ui-timeline-content>
      </ui-timeline-item>
    </ui-timeline>
  `,
})
class TestHost {
  orientation = signal<TimelineOrientation>('vertical')
  align = signal<TimelineAlign>('start')
  status1 = signal<TimelineItemStatus>('completed')
  status2 = signal<TimelineItemStatus>('active')
  status3 = signal<TimelineItemStatus>('pending')
  timestamp1 = signal<string | undefined>('Jan 2026')
}

// ── Tests ────────────────────────────────────────────────────────

describe('UiTimeline', () => {
  let fixture: ComponentFixture<TestHost>
  let host: TestHost

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHost)
    host = fixture.componentInstance
    fixture.detectChanges()
  })

  describe('rendering', () => {
    it('should render three timeline items', () => {
      const items = queryAll(fixture, 'ui-timeline-item')
      expect(items.length).toBe(3)
    })

    it('should project content into items', () => {
      expect(query(fixture, '.item-1-text').textContent).toBe('First item')
      expect(query(fixture, '.item-2-text').textContent).toBe('Second item')
      expect(query(fixture, '.item-3-text').textContent).toBe('Third item')
    })

    it('should render dots', () => {
      const dots = queryAll(fixture, 'ui-timeline-dot')
      expect(dots.length).toBe(3)
    })

    it('should render connectors', () => {
      const connectors = queryAll(fixture, 'ui-timeline-connector')
      expect(connectors.length).toBe(2)
    })

    it('should display timestamp when provided', () => {
      const time = query(fixture, 'time')
      expect(time.textContent?.trim()).toBe('Jan 2026')
    })

    it('should not display timestamp when not provided', () => {
      host.timestamp1.set(undefined)
      fixture.detectChanges()

      const times = queryAll(fixture, 'time')
      expect(times.length).toBe(0)
    })
  })

  describe('accessibility', () => {
    it('should have role="list" on the timeline container', () => {
      const timeline = query(fixture, 'ui-timeline')
      expect(timeline.getAttribute('role')).toBe('list')
    })

    it('should have role="listitem" on each timeline item', () => {
      const items = queryAll(fixture, 'ui-timeline-item')
      items.forEach(item => {
        expect(item.getAttribute('role')).toBe('listitem')
      })
    })

    it('should set aria-label with step number and status', () => {
      const items = queryAll(fixture, 'ui-timeline-item')
      expect(items[0].getAttribute('aria-label')).toBe('Step 1: completed: Jan 2026')
      expect(items[1].getAttribute('aria-label')).toBe('Step 2: active')
      expect(items[2].getAttribute('aria-label')).toBe('Step 3: pending')
    })

    it('should set aria-hidden on dots', () => {
      const dots = queryAll(fixture, 'ui-timeline-dot')
      dots.forEach(dot => {
        expect(dot.getAttribute('aria-hidden')).toBe('true')
      })
    })

    it('should set aria-hidden on connectors', () => {
      const connectors = queryAll(fixture, 'ui-timeline-connector')
      connectors.forEach(conn => {
        expect(conn.getAttribute('aria-hidden')).toBe('true')
      })
    })
  })

  describe('orientation', () => {
    it('should apply flex-col for vertical orientation', () => {
      const timeline = query(fixture, 'ui-timeline')
      expect(timeline.className).toContain('flex-col')
    })

    it('should apply flex (row) for horizontal orientation', () => {
      host.orientation.set('horizontal')
      fixture.detectChanges()

      const timeline = query(fixture, 'ui-timeline')
      expect(timeline.className).toContain('flex')
      expect(timeline.className).not.toContain('flex-col')
    })
  })

  describe('status styling', () => {
    it('should apply bg-primary to completed dot', () => {
      const dots = queryAll(fixture, 'ui-timeline-dot')
      expect(dots[0].className).toContain('bg-primary')
    })

    it('should apply bg-primary to active dot', () => {
      const dots = queryAll(fixture, 'ui-timeline-dot')
      expect(dots[1].className).toContain('bg-primary')
    })

    it('should apply bg-border to pending dot', () => {
      const dots = queryAll(fixture, 'ui-timeline-dot')
      expect(dots[2].className).toContain('bg-border')
    })

    it('should apply bg-primary to completed connector', () => {
      const connectors = queryAll(fixture, 'ui-timeline-connector')
      expect(connectors[0].className).toContain('bg-primary')
    })
  })

  describe('alignment', () => {
    it('should apply alternate item classes in alternate mode', () => {
      host.align.set('alternate')
      fixture.detectChanges()

      const items = queryAll(fixture, 'ui-timeline-item')
      expect(items[0].className).toContain('ui-timeline-item--start')
      expect(items[1].className).toContain('ui-timeline-item--end')
      expect(items[2].className).toContain('ui-timeline-item--start')
    })

    it('should apply items-end for end alignment', () => {
      host.align.set('end')
      fixture.detectChanges()

      const timeline = query(fixture, 'ui-timeline')
      expect(timeline.className).toContain('items-end')
    })
  })
})

// ── Custom dot content ───────────────────────────────────────────

@Component({
  imports: [UiTimeline, UiTimelineItem, UiTimelineDot, UiTimelineContent, UiTimelineConnector],
  template: `
    <ui-timeline>
      <ui-timeline-item status="completed">
        <ui-timeline-dot>
          <span class="custom-icon">✓</span>
        </ui-timeline-dot>
        <ui-timeline-content>
          <p>Done</p>
        </ui-timeline-content>
      </ui-timeline-item>
    </ui-timeline>
  `,
})
class CustomDotTestHost {}

describe('UiTimeline with custom dot content', () => {
  let fixture: ComponentFixture<CustomDotTestHost>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDotTestHost],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomDotTestHost)
    fixture.detectChanges()
  })

  it('should project custom content into the dot', () => {
    const icon = query(fixture, '.custom-icon')
    expect(icon.textContent).toBe('✓')
  })
})
