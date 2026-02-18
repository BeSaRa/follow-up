import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import {
  UiNavbar,
  UiNavbarBrand,
  UiNavbarNav,
  UiNavbarActions,
  UiNavbarLink,
} from '../../navbar/navbar'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'fixed',
    type: 'boolean',
    default: 'false',
    description: 'When true, the navbar is fixed to the top of the viewport.',
    kind: 'input',
  },
  {
    name: 'elevated',
    type: 'boolean',
    default: 'true',
    description: 'When true, the navbar has a subtle box shadow.',
    kind: 'input',
  },
  {
    name: 'active',
    type: 'boolean',
    default: 'false',
    description: 'Marks a navbar link as the currently active page. Applied to a[uiNavbarLink].',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-navbar>
  <ui-navbar-nav>
    <a uiNavbarLink active>Home</a>
    <a uiNavbarLink>About</a>
    <a uiNavbarLink>Contact</a>
  </ui-navbar-nav>
</ui-navbar>`,
  brandAndActions: `<ui-navbar>
  <ui-navbar-brand>
    <span class="text-lg font-bold text-foreground">MyApp</span>
  </ui-navbar-brand>
  <ui-navbar-nav>
    <a uiNavbarLink active>Dashboard</a>
    <a uiNavbarLink>Projects</a>
    <a uiNavbarLink>Settings</a>
  </ui-navbar-nav>
  <ui-navbar-actions>
    <button class="px-3 py-1.5 text-sm rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors">
      Sign In
    </button>
  </ui-navbar-actions>
</ui-navbar>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiNavbar, UiNavbarBrand, UiNavbarNav, UiNavbarActions, UiNavbarLink,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Navbar</h1>
        <p class="mt-1 text-foreground-muted">A responsive top navigation bar with brand, links, and action slots.</p>
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
              title="Basic Navbar"
              description="A simple navbar with navigation links. The active link is visually highlighted."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <div class="border border-border rounded-lg overflow-hidden">
                <ui-navbar [elevated]="false">
                  <ui-navbar-nav>
                    <a uiNavbarLink active>Home</a>
                    <a uiNavbarLink>About</a>
                    <a uiNavbarLink>Contact</a>
                  </ui-navbar-nav>
                </ui-navbar>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Brand and Actions"
              description="A full navbar with a brand logo, navigation links, and action buttons."
              [htmlCode]="brandAndActionsHtml"
              [focusTerms]="focusTerms"
            >
              <div class="border border-border rounded-lg overflow-hidden">
                <ui-navbar [elevated]="false">
                  <ui-navbar-brand>
                    <span class="text-lg font-bold text-foreground">MyApp</span>
                  </ui-navbar-brand>
                  <ui-navbar-nav>
                    <a uiNavbarLink active>Dashboard</a>
                    <a uiNavbarLink>Projects</a>
                    <a uiNavbarLink>Settings</a>
                  </ui-navbar-nav>
                  <ui-navbar-actions>
                    <button class="px-3 py-1.5 text-sm rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors">
                      Sign In
                    </button>
                  </ui-navbar-actions>
                </ui-navbar>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiNavbar / UiNavbarLink" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class NavbarShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly brandAndActionsHtml = EXAMPLES.brandAndActions
  protected readonly focusTerms = ['fixed', 'elevated', 'active', 'uiNavbarLink']
}
