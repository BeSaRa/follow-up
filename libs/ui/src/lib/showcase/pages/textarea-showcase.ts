import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiTextareaAutoResize } from '../../textarea-auto-resize/textarea-auto-resize'
import { UiInput } from '../../input/input'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'uiAutoResizeMinRows',
    type: 'number',
    default: '2',
    description: 'The minimum number of rows the textarea will display.',
    kind: 'input',
  },
  {
    name: 'uiAutoResizeMaxRows',
    type: 'number',
    default: '0',
    description: 'The maximum number of rows the textarea can grow to. Set to 0 for unlimited.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<textarea uiInput uiAutoResize placeholder="Start typing..."></textarea>`,
  minMax: `<textarea
  uiInput
  uiAutoResize
  [uiAutoResizeMinRows]="3"
  [uiAutoResizeMaxRows]="8"
  placeholder="Min 3 rows, max 8 rows..."
></textarea>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiTextareaAutoResize, UiInput,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Textarea Auto Resize</h1>
        <p class="mt-1 text-foreground-muted">A directive that automatically resizes a textarea to fit its content, with configurable minimum and maximum row limits.</p>
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
              title="Basic Auto-Resize"
              description="The textarea grows automatically as you type."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <div class="max-w-sm">
                <textarea uiInput uiAutoResize placeholder="Start typing..."></textarea>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Min and Max Rows"
              description="Configure the minimum and maximum number of visible rows. The textarea scrolls after reaching the max."
              [htmlCode]="minMaxHtml"
              [focusTerms]="focusTerms"
            >
              <div class="max-w-sm">
                <textarea
                  uiInput
                  uiAutoResize
                  [uiAutoResizeMinRows]="3"
                  [uiAutoResizeMaxRows]="8"
                  placeholder="Min 3 rows, max 8 rows..."
                ></textarea>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiTextareaAutoResize" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class TextareaShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly minMaxHtml = EXAMPLES.minMax
  protected readonly focusTerms = ['uiAutoResize', 'uiAutoResizeMinRows', 'uiAutoResizeMaxRows']
}
