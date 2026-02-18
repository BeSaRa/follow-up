import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiDivider } from '../../divider/divider'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'The orientation of the divider.',
    kind: 'input',
  },
  {
    name: 'inset',
    type: 'boolean',
    default: 'false',
    description: 'Whether the divider has an inset (left padding for horizontal, top margin for vertical).',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  horizontal: `<ui-divider />`,
  vertical: `<div class="flex items-center h-6 gap-4">
  <span>Left</span>
  <ui-divider orientation="vertical" />
  <span>Right</span>
</div>`,
  withLabel: `<ui-divider>OR</ui-divider>
<ui-divider>Section</ui-divider>`,
  inset: `<ui-divider inset />`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiDivider,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Divider</h1>
        <p class="mt-1 text-foreground-muted">A visual separator used to divide content sections horizontally or vertically.</p>
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
              title="Horizontal"
              description="The default horizontal divider spans the full width of its container."
              [htmlCode]="horizontalHtml"
            >
              <div class="space-y-4">
                <p class="text-sm text-foreground">Content above the divider.</p>
                <ui-divider />
                <p class="text-sm text-foreground">Content below the divider.</p>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Vertical"
              description="A vertical divider for separating inline content."
              [htmlCode]="verticalHtml"
            >
              <div class="flex items-center h-6 gap-4">
                <span class="text-sm text-foreground">Left</span>
                <ui-divider orientation="vertical" />
                <span class="text-sm text-foreground">Right</span>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Label"
              description="Horizontal dividers can include a centered text label."
              [htmlCode]="withLabelHtml"
            >
              <div class="space-y-6">
                <ui-divider>OR</ui-divider>
                <ui-divider>Section</ui-divider>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Inset"
              description="An inset divider adds padding to the start of the line."
              [htmlCode]="insetHtml"
            >
              <div class="space-y-4">
                <p class="text-sm text-foreground">Content above.</p>
                <ui-divider inset />
                <p class="text-sm text-foreground">Content below with inset divider.</p>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiDivider" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class DividerShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly horizontalHtml = EXAMPLES.horizontal
  protected readonly verticalHtml = EXAMPLES.vertical
  protected readonly withLabelHtml = EXAMPLES.withLabel
  protected readonly insetHtml = EXAMPLES.inset
}
