import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import {
  UiBreadcrumb,
  UiBreadcrumbItem,
  UiBreadcrumbSeparatorItem,
} from '../../breadcrumb/breadcrumb'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'active',
    type: 'boolean',
    default: 'false',
    description: 'Marks the breadcrumb item as the current page. Sets aria-current="page" when true.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-breadcrumb>
  <ui-breadcrumb-item><a href="#">Home</a></ui-breadcrumb-item>
  <ui-breadcrumb-separator />
  <ui-breadcrumb-item><a href="#">Products</a></ui-breadcrumb-item>
  <ui-breadcrumb-separator />
  <ui-breadcrumb-item active>Current Page</ui-breadcrumb-item>
</ui-breadcrumb>`,
  customSeparator: `<ui-breadcrumb>
  <ui-breadcrumb-item><a href="#">Home</a></ui-breadcrumb-item>
  <ui-breadcrumb-separator>&gt;</ui-breadcrumb-separator>
  <ui-breadcrumb-item><a href="#">Settings</a></ui-breadcrumb-item>
  <ui-breadcrumb-separator>&gt;</ui-breadcrumb-separator>
  <ui-breadcrumb-item active>Profile</ui-breadcrumb-item>
</ui-breadcrumb>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiBreadcrumb, UiBreadcrumbItem, UiBreadcrumbSeparatorItem,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Breadcrumb</h1>
        <p class="mt-1 text-foreground-muted">A navigation aid that displays the user's current location within a hierarchy.</p>
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
              title="Basic Breadcrumb"
              description="A standard breadcrumb trail with the default slash separator."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <ui-breadcrumb>
                <ui-breadcrumb-item><a href="#">Home</a></ui-breadcrumb-item>
                <ui-breadcrumb-separator />
                <ui-breadcrumb-item><a href="#">Products</a></ui-breadcrumb-item>
                <ui-breadcrumb-separator />
                <ui-breadcrumb-item active>Current Page</ui-breadcrumb-item>
              </ui-breadcrumb>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Custom Separator"
              description="The separator can be customized by projecting content into ui-breadcrumb-separator."
              [htmlCode]="customSeparatorHtml"
              [focusTerms]="focusTerms"
            >
              <ui-breadcrumb>
                <ui-breadcrumb-item><a href="#">Home</a></ui-breadcrumb-item>
                <ui-breadcrumb-separator>&gt;</ui-breadcrumb-separator>
                <ui-breadcrumb-item><a href="#">Settings</a></ui-breadcrumb-item>
                <ui-breadcrumb-separator>&gt;</ui-breadcrumb-separator>
                <ui-breadcrumb-item active>Profile</ui-breadcrumb-item>
              </ui-breadcrumb>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiBreadcrumbItem" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class BreadcrumbShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly customSeparatorHtml = EXAMPLES.customSeparator
  protected readonly focusTerms = ['active']
}
