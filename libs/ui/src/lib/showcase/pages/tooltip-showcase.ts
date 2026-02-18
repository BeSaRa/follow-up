import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiButton } from '../../button/button'
import { UiTooltip } from '../../tooltip/tooltip'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'uiTooltip',
    type: 'string',
    default: "''",
    description: 'The text message to display inside the tooltip.',
    kind: 'input',
  },
  {
    name: 'uiTooltipPosition',
    type: "'above' | 'below' | 'start' | 'end'",
    default: "'above'",
    description: 'The preferred position of the tooltip relative to the host element.',
    kind: 'input',
  },
  {
    name: 'uiTooltipShowDelay',
    type: 'number',
    default: '200',
    description: 'The delay in milliseconds before the tooltip is shown.',
    kind: 'input',
  },
  {
    name: 'uiTooltipHideDelay',
    type: 'number',
    default: '0',
    description: 'The delay in milliseconds before the tooltip is hidden.',
    kind: 'input',
  },
  {
    name: 'uiTooltipDisabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the tooltip is disabled and should not show.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  positions: `<button uiButton uiTooltip="Tooltip above" uiTooltipPosition="above">Above</button>
<button uiButton uiTooltip="Tooltip below" uiTooltipPosition="below">Below</button>
<button uiButton uiTooltip="Tooltip start" uiTooltipPosition="start">Start</button>
<button uiButton uiTooltip="Tooltip end" uiTooltipPosition="end">End</button>`,
  delays: `<button uiButton uiTooltip="Instant tooltip" [uiTooltipShowDelay]="0">No Delay</button>
<button uiButton uiTooltip="Slow tooltip" [uiTooltipShowDelay]="500">500ms Delay</button>`,
  disabled: `<button uiButton uiTooltip="This won't show" [uiTooltipDisabled]="true">Disabled Tooltip</button>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiButton, UiTooltip,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Tooltip</h1>
        <p class="mt-1 text-foreground-muted">A small popup that displays informational text when hovering or focusing an element.</p>
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
              title="Positions"
              description="Tooltips can be positioned above, below, at the start, or at the end of the host element."
              [htmlCode]="positionsHtml"
            >
              <div class="flex flex-wrap gap-3 justify-center py-8">
                <button uiButton variant="outline" uiTooltip="Tooltip above" uiTooltipPosition="above">Above</button>
                <button uiButton variant="outline" uiTooltip="Tooltip below" uiTooltipPosition="below">Below</button>
                <button uiButton variant="outline" uiTooltip="Tooltip start" uiTooltipPosition="start">Start</button>
                <button uiButton variant="outline" uiTooltip="Tooltip end" uiTooltipPosition="end">End</button>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Show Delay"
              description="Configure the delay before the tooltip appears."
              [htmlCode]="delaysHtml"
            >
              <div class="flex flex-wrap gap-3 justify-center py-8">
                <button uiButton variant="outline" uiTooltip="Instant tooltip" [uiTooltipShowDelay]="0">No Delay</button>
                <button uiButton variant="outline" uiTooltip="Slow tooltip" [uiTooltipShowDelay]="500">500ms Delay</button>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Disabled"
              description="Tooltips can be disabled to prevent them from showing."
              [htmlCode]="disabledHtml"
            >
              <div class="flex flex-wrap gap-3 justify-center py-8">
                <button uiButton variant="outline" uiTooltip="This won't show" [uiTooltipDisabled]="true">Disabled Tooltip</button>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiTooltip" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class TooltipShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly positionsHtml = EXAMPLES.positions
  protected readonly delaysHtml = EXAMPLES.delays
  protected readonly disabledHtml = EXAMPLES.disabled
}
