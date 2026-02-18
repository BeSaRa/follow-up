import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import {
  UiTimeline,
  UiTimelineItem,
  UiTimelineDot,
  UiTimelineContent,
  UiTimelineConnector,
} from '../../timeline/timeline'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'orientation',
    type: "'vertical' | 'horizontal'",
    default: "'vertical'",
    description: 'Sets the layout direction of the timeline.',
    kind: 'input',
  },
  {
    name: 'align',
    type: "'start' | 'end' | 'alternate'",
    default: "'start'",
    description: 'Controls the alignment of timeline items along the axis.',
    kind: 'input',
  },
  {
    name: 'reverse',
    type: 'boolean',
    default: 'false',
    description: 'Reverses the visual order of timeline items.',
    kind: 'input',
  },
  {
    name: 'status',
    type: "'completed' | 'active' | 'pending'",
    default: "'pending'",
    description: 'The status of a timeline item, which controls dot and connector styling.',
    kind: 'input',
  },
  {
    name: 'timestamp',
    type: 'string | undefined',
    default: 'undefined',
    description: 'An optional timestamp label displayed alongside the timeline item content.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = [
  {
    name: '--ui-timeline-gap',
    default: '0',
    description: 'Controls the gap between timeline items.',
  },
]

const EXAMPLES = {
  vertical: `<ui-timeline>
  <ui-timeline-item status="completed" timestamp="Jan 1">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>Order placed</ui-timeline-content>
  </ui-timeline-item>
  <ui-timeline-item status="active" timestamp="Jan 3">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>Shipped</ui-timeline-content>
  </ui-timeline-item>
  <ui-timeline-item status="pending" timestamp="Jan 5">
    <ui-timeline-dot />
    <ui-timeline-content>Delivered</ui-timeline-content>
  </ui-timeline-item>
</ui-timeline>`,
  horizontal: `<ui-timeline orientation="horizontal">
  <ui-timeline-item status="completed">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>Step 1</ui-timeline-content>
  </ui-timeline-item>
  <ui-timeline-item status="active">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>Step 2</ui-timeline-content>
  </ui-timeline-item>
  <ui-timeline-item status="pending">
    <ui-timeline-dot />
    <ui-timeline-content>Step 3</ui-timeline-content>
  </ui-timeline-item>
</ui-timeline>`,
  alternate: `<ui-timeline align="alternate">
  <ui-timeline-item status="completed" timestamp="2024">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>Founded</ui-timeline-content>
  </ui-timeline-item>
  <ui-timeline-item status="completed" timestamp="2025">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>Series A</ui-timeline-content>
  </ui-timeline-item>
  <ui-timeline-item status="active" timestamp="2026">
    <ui-timeline-dot />
    <ui-timeline-content>Launch</ui-timeline-content>
  </ui-timeline-item>
</ui-timeline>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiTimeline, UiTimelineItem, UiTimelineDot, UiTimelineContent, UiTimelineConnector,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Timeline</h1>
        <p class="mt-1 text-foreground-muted">A visual timeline for displaying sequential events with status indicators, supporting vertical, horizontal, and alternate layouts.</p>
      </div>

      <ui-tabs #tabs activeTab="examples">
        <ui-tab-list>
          <ui-tab value="examples" [tabs]="tabs">Examples</ui-tab>
          <ui-tab value="api" [tabs]="tabs">API</ui-tab>
          <ui-tab value="styles" [tabs]="tabs">Styles</ui-tab>
        </ui-tab-list>

        <ui-tab-panel value="examples" [tabs]="tabs">
          <div class="space-y-8 mt-6">
            <showcase-example-viewer
              title="Vertical Timeline"
              description="The default vertical layout with completed, active, and pending steps."
              [htmlCode]="verticalHtml"
            >
              <ui-timeline>
                <ui-timeline-item status="completed" timestamp="Jan 1">
                  <ui-timeline-dot />
                  <ui-timeline-connector />
                  <ui-timeline-content>
                    <p class="text-sm font-medium text-foreground">Order placed</p>
                    <p class="text-xs text-foreground-muted">Your order has been confirmed.</p>
                  </ui-timeline-content>
                </ui-timeline-item>
                <ui-timeline-item status="active" timestamp="Jan 3">
                  <ui-timeline-dot />
                  <ui-timeline-connector />
                  <ui-timeline-content>
                    <p class="text-sm font-medium text-foreground">Shipped</p>
                    <p class="text-xs text-foreground-muted">Package is on its way.</p>
                  </ui-timeline-content>
                </ui-timeline-item>
                <ui-timeline-item status="pending" timestamp="Jan 5">
                  <ui-timeline-dot />
                  <ui-timeline-content>
                    <p class="text-sm font-medium text-foreground">Delivered</p>
                    <p class="text-xs text-foreground-muted">Awaiting delivery.</p>
                  </ui-timeline-content>
                </ui-timeline-item>
              </ui-timeline>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Horizontal Timeline"
              description="A horizontal layout for step-by-step progress indicators."
              [htmlCode]="horizontalHtml"
            >
              <ui-timeline orientation="horizontal">
                <ui-timeline-item status="completed">
                  <ui-timeline-dot />
                  <ui-timeline-connector />
                  <ui-timeline-content>
                    <p class="text-sm font-medium text-foreground">Step 1</p>
                    <p class="text-xs text-foreground-muted">Account setup</p>
                  </ui-timeline-content>
                </ui-timeline-item>
                <ui-timeline-item status="active">
                  <ui-timeline-dot />
                  <ui-timeline-connector />
                  <ui-timeline-content>
                    <p class="text-sm font-medium text-foreground">Step 2</p>
                    <p class="text-xs text-foreground-muted">Profile details</p>
                  </ui-timeline-content>
                </ui-timeline-item>
                <ui-timeline-item status="pending">
                  <ui-timeline-dot />
                  <ui-timeline-content>
                    <p class="text-sm font-medium text-foreground">Step 3</p>
                    <p class="text-xs text-foreground-muted">Confirmation</p>
                  </ui-timeline-content>
                </ui-timeline-item>
              </ui-timeline>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Alternate Layout"
              description="Items alternate sides on a vertical axis for a balanced visual flow."
              [htmlCode]="alternateHtml"
            >
              <ui-timeline align="alternate">
                <ui-timeline-item status="completed" timestamp="2024">
                  <ui-timeline-dot />
                  <ui-timeline-connector />
                  <ui-timeline-content>
                    <p class="text-sm font-medium text-foreground">Founded</p>
                    <p class="text-xs text-foreground-muted">Company was established.</p>
                  </ui-timeline-content>
                </ui-timeline-item>
                <ui-timeline-item status="completed" timestamp="2025">
                  <ui-timeline-dot />
                  <ui-timeline-connector />
                  <ui-timeline-content>
                    <p class="text-sm font-medium text-foreground">Series A</p>
                    <p class="text-xs text-foreground-muted">Raised first funding round.</p>
                  </ui-timeline-content>
                </ui-timeline-item>
                <ui-timeline-item status="active" timestamp="2026">
                  <ui-timeline-dot />
                  <ui-timeline-content>
                    <p class="text-sm font-medium text-foreground">Launch</p>
                    <p class="text-xs text-foreground-muted">Product goes live.</p>
                  </ui-timeline-content>
                </ui-timeline-item>
              </ui-timeline>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiTimeline / UiTimelineItem" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class TimelineShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly verticalHtml = EXAMPLES.vertical
  protected readonly horizontalHtml = EXAMPLES.horizontal
  protected readonly alternateHtml = EXAMPLES.alternate
}
