import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'activeTab',
    type: 'string',
    default: "''",
    description: 'Two-way binding that controls which tab is currently active by its value.',
    kind: 'model',
  },
  {
    name: 'value',
    type: 'string',
    default: '-',
    description: 'Required. The unique identifier for the tab or tab panel.',
    kind: 'input',
  },
  {
    name: 'tabs',
    type: 'UiTabs',
    default: '-',
    description: 'Required. Reference to the parent UiTabs instance for state coordination.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-tabs #demoTabs activeTab="tab1">
  <ui-tab-list>
    <ui-tab value="tab1" [tabs]="demoTabs">Account</ui-tab>
    <ui-tab value="tab2" [tabs]="demoTabs">Notifications</ui-tab>
    <ui-tab value="tab3" [tabs]="demoTabs">Security</ui-tab>
  </ui-tab-list>
  <ui-tab-panel value="tab1" [tabs]="demoTabs">
    <p>Manage your account settings and preferences.</p>
  </ui-tab-panel>
  <ui-tab-panel value="tab2" [tabs]="demoTabs">
    <p>Configure how you receive notifications.</p>
  </ui-tab-panel>
  <ui-tab-panel value="tab3" [tabs]="demoTabs">
    <p>Update your password and security settings.</p>
  </ui-tab-panel>
</ui-tabs>`,
  dynamic: `<ui-tabs #dynTabs activeTab="overview">
  <ui-tab-list>
    <ui-tab value="overview" [tabs]="dynTabs">Overview</ui-tab>
    <ui-tab value="features" [tabs]="dynTabs">Features</ui-tab>
    <ui-tab value="pricing" [tabs]="dynTabs">Pricing</ui-tab>
    <ui-tab value="faq" [tabs]="dynTabs">FAQ</ui-tab>
  </ui-tab-list>
  <ui-tab-panel value="overview" [tabs]="dynTabs">
    <p>Product overview content goes here.</p>
  </ui-tab-panel>
  <ui-tab-panel value="features" [tabs]="dynTabs">
    <p>Detailed features breakdown.</p>
  </ui-tab-panel>
  <ui-tab-panel value="pricing" [tabs]="dynTabs">
    <p>Pricing plans and tiers.</p>
  </ui-tab-panel>
  <ui-tab-panel value="faq" [tabs]="dynTabs">
    <p>Frequently asked questions.</p>
  </ui-tab-panel>
</ui-tabs>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Tabs</h1>
        <p class="mt-1 text-foreground-muted">A set of layered sections of content that are displayed one at a time.</p>
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
              title="Basic Tabs"
              description="A simple tab group with three panels. Use arrow keys to navigate between tabs."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <ui-tabs #demoTabs activeTab="tab1">
                <ui-tab-list>
                  <ui-tab value="tab1" [tabs]="demoTabs">Account</ui-tab>
                  <ui-tab value="tab2" [tabs]="demoTabs">Notifications</ui-tab>
                  <ui-tab value="tab3" [tabs]="demoTabs">Security</ui-tab>
                </ui-tab-list>
                <ui-tab-panel value="tab1" [tabs]="demoTabs">
                  <p class="text-sm text-foreground-muted">Manage your account settings and preferences.</p>
                </ui-tab-panel>
                <ui-tab-panel value="tab2" [tabs]="demoTabs">
                  <p class="text-sm text-foreground-muted">Configure how you receive notifications.</p>
                </ui-tab-panel>
                <ui-tab-panel value="tab3" [tabs]="demoTabs">
                  <p class="text-sm text-foreground-muted">Update your password and security settings.</p>
                </ui-tab-panel>
              </ui-tabs>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Dynamic Tabs"
              description="A tab group with four panels demonstrating multiple content sections."
              [htmlCode]="dynamicHtml"
              [focusTerms]="focusTerms"
            >
              <ui-tabs #dynTabs activeTab="overview">
                <ui-tab-list>
                  <ui-tab value="overview" [tabs]="dynTabs">Overview</ui-tab>
                  <ui-tab value="features" [tabs]="dynTabs">Features</ui-tab>
                  <ui-tab value="pricing" [tabs]="dynTabs">Pricing</ui-tab>
                  <ui-tab value="faq" [tabs]="dynTabs">FAQ</ui-tab>
                </ui-tab-list>
                <ui-tab-panel value="overview" [tabs]="dynTabs">
                  <p class="text-sm text-foreground-muted">Product overview content goes here.</p>
                </ui-tab-panel>
                <ui-tab-panel value="features" [tabs]="dynTabs">
                  <p class="text-sm text-foreground-muted">Detailed features breakdown.</p>
                </ui-tab-panel>
                <ui-tab-panel value="pricing" [tabs]="dynTabs">
                  <p class="text-sm text-foreground-muted">Pricing plans and tiers.</p>
                </ui-tab-panel>
                <ui-tab-panel value="faq" [tabs]="dynTabs">
                  <p class="text-sm text-foreground-muted">Frequently asked questions.</p>
                </ui-tab-panel>
              </ui-tabs>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiTabs / UiTab / UiTabPanel" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class TabsShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly dynamicHtml = EXAMPLES.dynamic
  protected readonly focusTerms = ['activeTab', 'value']
}
