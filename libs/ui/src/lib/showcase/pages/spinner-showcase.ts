import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiSpinner } from '../../spinner/spinner'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'The size of the spinner.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  sizes: `<ui-spinner size="sm" />
<ui-spinner size="md" />
<ui-spinner size="lg" />`,
  inline: `<button class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
  <ui-spinner size="sm" />
  Loading...
</button>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiSpinner,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Spinner</h1>
        <p class="mt-1 text-foreground-muted">An animated loading indicator to signal that content or an action is in progress.</p>
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
              title="Sizes"
              description="The spinner comes in three sizes: small, medium, and large."
              [htmlCode]="sizesHtml"
            >
              <div class="flex flex-wrap items-center gap-6">
                <ui-spinner size="sm" />
                <ui-spinner size="md" />
                <ui-spinner size="lg" />
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Inline Usage"
              description="A small spinner can be placed inline alongside text or inside buttons."
              [htmlCode]="inlineHtml"
            >
              <div class="flex flex-wrap items-center gap-6">
                <div class="inline-flex items-center gap-2 text-sm text-foreground-muted">
                  <ui-spinner size="sm" />
                  Loading data...
                </div>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiSpinner" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class SpinnerShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly sizesHtml = EXAMPLES.sizes
  protected readonly inlineHtml = EXAMPLES.inline
}
