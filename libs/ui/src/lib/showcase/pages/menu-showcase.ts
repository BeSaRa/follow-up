import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiButton } from '../../button/button'
import {
  UiMenu,
  UiMenuItem,
  UiMenuTrigger,
  UiSubMenuTrigger,
} from '../../menu/menu'

const API_PROPERTIES: ApiProperty[] = [
  // UiMenuTrigger
  {
    name: 'uiMenuTrigger',
    type: 'UiMenu',
    default: '-',
    description: 'Reference to the UiMenu instance this trigger opens. Applied as an attribute directive.',
    kind: 'input',
  },
  {
    name: 'menuPosition',
    type: "'below-start' | 'below-end' | 'above-start' | 'above-end'",
    default: "'below-start'",
    description: 'The preferred position of the menu relative to the trigger element.',
    kind: 'input',
  },
  // UiMenuItem
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the menu item is disabled.',
    kind: 'input',
  },
  {
    name: 'selected',
    type: 'void',
    default: '-',
    description: 'Emitted when a non-disabled menu item without a submenu is selected.',
    kind: 'output',
  },
  // UiSubMenuTrigger
  {
    name: 'uiSubMenuTrigger',
    type: 'UiMenu',
    default: '-',
    description: 'Reference to the child UiMenu this item opens as a submenu. Applied as an attribute directive on ui-menu-item.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<button uiButton variant="outline" [uiMenuTrigger]="basicMenu">
  Open Menu
</button>
<ui-menu #basicMenu>
  <ui-menu-item>Profile</ui-menu-item>
  <ui-menu-item>Settings</ui-menu-item>
  <ui-menu-item>Logout</ui-menu-item>
</ui-menu>`,
  nested: `<button uiButton variant="outline" [uiMenuTrigger]="nestedMenu">
  Open Menu
</button>
<ui-menu #nestedMenu>
  <ui-menu-item>New File</ui-menu-item>
  <ui-menu-item [uiSubMenuTrigger]="shareMenu">Share</ui-menu-item>
  <ui-menu-item>Download</ui-menu-item>
</ui-menu>
<ui-menu #shareMenu>
  <ui-menu-item>Email</ui-menu-item>
  <ui-menu-item>Slack</ui-menu-item>
  <ui-menu-item>Copy Link</ui-menu-item>
</ui-menu>`,
  withIcons: `<button uiButton variant="outline" [uiMenuTrigger]="iconMenu">
  Actions
</button>
<ui-menu #iconMenu>
  <ui-menu-item>
    <svg ...><!-- pencil icon --></svg> Edit
  </ui-menu-item>
  <ui-menu-item>
    <svg ...><!-- copy icon --></svg> Duplicate
  </ui-menu-item>
  <ui-menu-item disabled>
    <svg ...><!-- trash icon --></svg> Delete
  </ui-menu-item>
</ui-menu>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiButton, UiMenu, UiMenuItem, UiMenuTrigger, UiSubMenuTrigger,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Menu</h1>
        <p class="mt-1 text-foreground-muted">A contextual overlay menu triggered by a button, with support for nested submenus and keyboard navigation.</p>
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
              title="Basic Menu"
              description="A simple menu with three items triggered by a button."
              [htmlCode]="basicHtml"
            >
              <button uiButton variant="outline" [uiMenuTrigger]="basicMenu">
                Open Menu
              </button>
              <ui-menu #basicMenu>
                <ui-menu-item>Profile</ui-menu-item>
                <ui-menu-item>Settings</ui-menu-item>
                <ui-menu-item>Logout</ui-menu-item>
              </ui-menu>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Nested Submenu"
              description="Menu items can open child submenus using the uiSubMenuTrigger directive."
              [htmlCode]="nestedHtml"
            >
              <button uiButton variant="outline" [uiMenuTrigger]="nestedMenu">
                Open Menu
              </button>
              <ui-menu #nestedMenu>
                <ui-menu-item>New File</ui-menu-item>
                <ui-menu-item [uiSubMenuTrigger]="shareMenu">Share</ui-menu-item>
                <ui-menu-item>Download</ui-menu-item>
              </ui-menu>
              <ui-menu #shareMenu>
                <ui-menu-item>Email</ui-menu-item>
                <ui-menu-item>Slack</ui-menu-item>
                <ui-menu-item>Copy Link</ui-menu-item>
              </ui-menu>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Icons and Disabled Items"
              description="Menu items can contain icons and be individually disabled."
              [htmlCode]="withIconsHtml"
            >
              <button uiButton variant="outline" [uiMenuTrigger]="iconMenu">
                Actions
              </button>
              <ui-menu #iconMenu>
                <ui-menu-item>
                  <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    Edit
                  </span>
                </ui-menu-item>
                <ui-menu-item>
                  <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    Duplicate
                  </span>
                </ui-menu-item>
                <ui-menu-item disabled>
                  <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    Delete
                  </span>
                </ui-menu-item>
              </ui-menu>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiMenuTrigger / UiMenuItem / UiSubMenuTrigger" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class MenuShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly nestedHtml = EXAMPLES.nested
  protected readonly withIconsHtml = EXAMPLES.withIcons
}
