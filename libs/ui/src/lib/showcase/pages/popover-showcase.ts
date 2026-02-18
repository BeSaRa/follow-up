import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiButton } from '../../button/button'
import { UiPopover, UiPopoverTrigger, UiPopoverClose } from '../../popover/popover'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'position',
    type: "'above' | 'above-start' | 'above-end' | 'below' | 'below-start' | 'below-end' | 'start' | 'end'",
    default: "'below-start'",
    description: 'The preferred position of the popover relative to the trigger.',
    kind: 'input',
  },
  {
    name: 'opened',
    type: 'void',
    default: '-',
    description: 'Emitted when the popover is opened.',
    kind: 'output',
  },
  {
    name: 'closed',
    type: 'void',
    default: '-',
    description: 'Emitted when the popover is closed.',
    kind: 'output',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<button uiButton [uiPopoverTrigger]="popover">Open Popover</button>

<ui-popover #popover>
  <div class="p-4 w-64">
    <h3 class="text-sm font-semibold text-foreground">Popover Title</h3>
    <p class="mt-1 text-sm text-foreground-muted">This is a basic popover with some content.</p>
    <button uiButton variant="outline" size="sm" uiPopoverClose class="mt-3">Close</button>
  </div>
</ui-popover>`,
  positions: `<button uiButton [uiPopoverTrigger]="abovePopover">Above</button>
<ui-popover #abovePopover position="above">
  <div class="p-3">
    <p class="text-sm text-foreground">Popover above the trigger.</p>
  </div>
</ui-popover>

<button uiButton [uiPopoverTrigger]="belowPopover">Below</button>
<ui-popover #belowPopover position="below">
  <div class="p-3">
    <p class="text-sm text-foreground">Popover below the trigger.</p>
  </div>
</ui-popover>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiButton, UiPopover, UiPopoverTrigger, UiPopoverClose,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Popover</h1>
        <p class="mt-1 text-foreground-muted">A floating panel that appears next to a trigger element for contextual content.</p>
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
              title="Basic Popover"
              description="A simple popover with a title, description, and a close button."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap gap-3 justify-center py-8">
                <button uiButton variant="outline" [uiPopoverTrigger]="basicPopover">Open Popover</button>

                <ui-popover #basicPopover>
                  <div class="p-4 w-64">
                    <h3 class="text-sm font-semibold text-foreground">Popover Title</h3>
                    <p class="mt-1 text-sm text-foreground-muted">This is a basic popover with some content.</p>
                    <button uiButton variant="outline" size="sm" uiPopoverClose class="mt-3">Close</button>
                  </div>
                </ui-popover>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Positions"
              description="Popovers can be positioned above, below, at the start, or at the end of the trigger."
              [htmlCode]="positionsHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap gap-3 justify-center py-12">
                <button uiButton variant="outline" [uiPopoverTrigger]="abovePopover">Above</button>
                <ui-popover #abovePopover position="above">
                  <div class="p-3">
                    <p class="text-sm text-foreground">Popover above the trigger.</p>
                  </div>
                </ui-popover>

                <button uiButton variant="outline" [uiPopoverTrigger]="belowPopover">Below</button>
                <ui-popover #belowPopover position="below">
                  <div class="p-3">
                    <p class="text-sm text-foreground">Popover below the trigger.</p>
                  </div>
                </ui-popover>

                <button uiButton variant="outline" [uiPopoverTrigger]="startPopover">Start</button>
                <ui-popover #startPopover position="start">
                  <div class="p-3">
                    <p class="text-sm text-foreground">Popover at the start.</p>
                  </div>
                </ui-popover>

                <button uiButton variant="outline" [uiPopoverTrigger]="endPopover">End</button>
                <ui-popover #endPopover position="end">
                  <div class="p-3">
                    <p class="text-sm text-foreground">Popover at the end.</p>
                  </div>
                </ui-popover>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiPopover" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class PopoverShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly positionsHtml = EXAMPLES.positions
  protected readonly focusTerms = ['uiPopoverTrigger', 'uiPopoverClose', 'position']
}
