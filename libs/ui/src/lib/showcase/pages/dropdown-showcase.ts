import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiButton } from '../../button/button'
import { UiDropdownTrigger, UiDropdownMenu, UiDropdownItem } from '../../dropdown/dropdown'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'position',
    type: "'below-start' | 'below-end' | 'below' | 'above-start' | 'above-end' | 'above'",
    default: "'below-start'",
    description: 'The preferred position of the dropdown menu relative to the trigger.',
    kind: 'input',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the dropdown item is disabled and cannot be selected.',
    kind: 'input',
  },
  {
    name: 'selected',
    type: 'void',
    default: '-',
    description: 'Emitted when a dropdown item is selected.',
    kind: 'output',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<button uiButton [uiDropdownTrigger]="menu">Options</button>

<ui-dropdown-menu #menu>
  <ui-dropdown-item (selected)="onEdit()">Edit</ui-dropdown-item>
  <ui-dropdown-item (selected)="onDuplicate()">Duplicate</ui-dropdown-item>
  <ui-dropdown-item (selected)="onArchive()">Archive</ui-dropdown-item>
  <ui-dropdown-item [disabled]="true">Locked</ui-dropdown-item>
  <ui-dropdown-item (selected)="onDelete()">Delete</ui-dropdown-item>
</ui-dropdown-menu>`,
  withIcons: `<button uiButton [uiDropdownTrigger]="iconMenu">Actions</button>

<ui-dropdown-menu #iconMenu>
  <ui-dropdown-item>
    <span class="flex items-center gap-2">
      <svg class="size-4">...</svg>
      Edit
    </span>
  </ui-dropdown-item>
  <ui-dropdown-item>
    <span class="flex items-center gap-2">
      <svg class="size-4">...</svg>
      Delete
    </span>
  </ui-dropdown-item>
</ui-dropdown-menu>`,
  positions: `<button uiButton [uiDropdownTrigger]="belowEndMenu">Below End</button>
<ui-dropdown-menu #belowEndMenu position="below-end">
  <ui-dropdown-item>Option A</ui-dropdown-item>
  <ui-dropdown-item>Option B</ui-dropdown-item>
</ui-dropdown-menu>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiButton, UiDropdownTrigger, UiDropdownMenu, UiDropdownItem,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Dropdown</h1>
        <p class="mt-1 text-foreground-muted">A menu that appears below a trigger element, displaying a list of actions or options.</p>
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
              title="Basic Dropdown"
              description="A dropdown menu with selectable items and a disabled option."
              [htmlCode]="basicHtml"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="outline" [uiDropdownTrigger]="basicMenu">Options</button>

                <ui-dropdown-menu #basicMenu>
                  <ui-dropdown-item (selected)="lastAction.set('Edit')">Edit</ui-dropdown-item>
                  <ui-dropdown-item (selected)="lastAction.set('Duplicate')">Duplicate</ui-dropdown-item>
                  <ui-dropdown-item (selected)="lastAction.set('Archive')">Archive</ui-dropdown-item>
                  <ui-dropdown-item [disabled]="true">Locked</ui-dropdown-item>
                  <ui-dropdown-item (selected)="lastAction.set('Delete')">Delete</ui-dropdown-item>
                </ui-dropdown-menu>

                @if (lastAction()) {
                  <span class="text-sm text-foreground-muted self-center">Last action: {{ lastAction() }}</span>
                }
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Icons"
              description="Dropdown items can contain icons alongside text."
              [htmlCode]="withIconsHtml"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="outline" [uiDropdownTrigger]="iconMenu">Actions</button>

                <ui-dropdown-menu #iconMenu>
                  <ui-dropdown-item>
                    <span class="flex items-center gap-2">
                      <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </span>
                  </ui-dropdown-item>
                  <ui-dropdown-item>
                    <span class="flex items-center gap-2">
                      <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Duplicate
                    </span>
                  </ui-dropdown-item>
                  <ui-dropdown-item>
                    <span class="flex items-center gap-2">
                      <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </span>
                  </ui-dropdown-item>
                </ui-dropdown-menu>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Positions"
              description="Dropdown menus can be positioned in different directions relative to the trigger."
              [htmlCode]="positionsHtml"
            >
              <div class="flex flex-wrap gap-3 justify-center py-8">
                <button uiButton variant="outline" [uiDropdownTrigger]="belowStartMenu">Below Start</button>
                <ui-dropdown-menu #belowStartMenu position="below-start">
                  <ui-dropdown-item>Option A</ui-dropdown-item>
                  <ui-dropdown-item>Option B</ui-dropdown-item>
                  <ui-dropdown-item>Option C</ui-dropdown-item>
                </ui-dropdown-menu>

                <button uiButton variant="outline" [uiDropdownTrigger]="belowEndMenu">Below End</button>
                <ui-dropdown-menu #belowEndMenu position="below-end">
                  <ui-dropdown-item>Option A</ui-dropdown-item>
                  <ui-dropdown-item>Option B</ui-dropdown-item>
                  <ui-dropdown-item>Option C</ui-dropdown-item>
                </ui-dropdown-menu>

                <button uiButton variant="outline" [uiDropdownTrigger]="aboveStartMenu">Above Start</button>
                <ui-dropdown-menu #aboveStartMenu position="above-start">
                  <ui-dropdown-item>Option A</ui-dropdown-item>
                  <ui-dropdown-item>Option B</ui-dropdown-item>
                  <ui-dropdown-item>Option C</ui-dropdown-item>
                </ui-dropdown-menu>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiDropdownMenu / UiDropdownItem" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class DropdownShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly withIconsHtml = EXAMPLES.withIcons
  protected readonly positionsHtml = EXAMPLES.positions

  readonly lastAction = signal('')
}
