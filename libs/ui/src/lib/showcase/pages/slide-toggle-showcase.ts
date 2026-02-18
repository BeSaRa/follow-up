import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiSlideToggle } from '../../slide-toggle/slide-toggle'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'checked',
    type: 'boolean',
    default: 'false',
    description: 'Whether the slide toggle is on. Supports two-way binding.',
    kind: 'model',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the slide toggle is disabled.',
    kind: 'input',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    description: 'The size of the slide toggle.',
    kind: 'input',
  },
  {
    name: 'labelPosition',
    type: "'before' | 'after'",
    default: "'after'",
    description: 'Whether the label appears before or after the toggle.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-slide-toggle>Enable notifications</ui-slide-toggle>`,
  sizes: `<ui-slide-toggle size="sm">Small</ui-slide-toggle>
<ui-slide-toggle size="md">Medium</ui-slide-toggle>`,
  labelPositions: `<ui-slide-toggle labelPosition="after">Label after</ui-slide-toggle>
<ui-slide-toggle labelPosition="before">Label before</ui-slide-toggle>`,
  disabled: `<ui-slide-toggle disabled>Disabled off</ui-slide-toggle>
<ui-slide-toggle [checked]="true" disabled>Disabled on</ui-slide-toggle>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-slide-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiSlideToggle,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Slide Toggle</h1>
        <p class="mt-1 text-foreground-muted">A toggle switch component for binary on/off states, with keyboard support and form control integration.</p>
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
              title="Basic Toggle"
              description="A simple slide toggle with a label."
              [htmlCode]="basicHtml"
            >
              <ui-slide-toggle>Enable notifications</ui-slide-toggle>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Sizes"
              description="Slide toggles come in small and medium sizes."
              [htmlCode]="sizesHtml"
            >
              <div class="flex flex-wrap items-center gap-6">
                <ui-slide-toggle size="sm">Small</ui-slide-toggle>
                <ui-slide-toggle size="md">Medium</ui-slide-toggle>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Label Positions"
              description="The label can be placed before or after the toggle."
              [htmlCode]="labelPositionsHtml"
            >
              <div class="flex flex-wrap gap-6">
                <ui-slide-toggle labelPosition="after">Label after</ui-slide-toggle>
                <ui-slide-toggle labelPosition="before">Label before</ui-slide-toggle>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Disabled"
              description="Slide toggles can be disabled in both on and off states."
              [htmlCode]="disabledHtml"
            >
              <div class="flex flex-wrap gap-6">
                <ui-slide-toggle disabled>Disabled off</ui-slide-toggle>
                <ui-slide-toggle [checked]="true" disabled>Disabled on</ui-slide-toggle>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiSlideToggle" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class SlideToggleShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly sizesHtml = EXAMPLES.sizes
  protected readonly labelPositionsHtml = EXAMPLES.labelPositions
  protected readonly disabledHtml = EXAMPLES.disabled
}
