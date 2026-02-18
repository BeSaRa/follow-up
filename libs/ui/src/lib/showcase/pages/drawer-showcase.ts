import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import {
  UiDrawer,
  UiDrawerContainer,
  UiDrawerHeader,
  UiDrawerContent,
  UiDrawerFooter,
  UiDrawerClose,
} from '../../drawer/drawer'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'open',
    type: 'boolean',
    default: 'false',
    description: 'Two-way binding that controls whether the drawer is open.',
    kind: 'model',
  },
  {
    name: 'position',
    type: "'start' | 'end'",
    default: "'start'",
    description: 'The side from which the drawer slides in.',
    kind: 'input',
  },
  {
    name: 'mode',
    type: "'overlay' | 'push'",
    default: "'overlay'",
    description: 'Whether the drawer overlays or pushes the main content.',
    kind: 'input',
  },
  {
    name: 'hasBackdrop',
    type: 'boolean',
    default: 'true',
    description: 'Whether a backdrop is shown behind the drawer in overlay mode.',
    kind: 'input',
  },
  {
    name: 'closeOnBackdropClick',
    type: 'boolean',
    default: 'true',
    description: 'Whether clicking the backdrop closes the drawer.',
    kind: 'input',
  },
  {
    name: 'closeOnEscape',
    type: 'boolean',
    default: 'true',
    description: 'Whether pressing Escape closes the drawer.',
    kind: 'input',
  },
  {
    name: 'ariaLabel',
    type: 'string | null',
    default: 'null',
    description: 'An accessible label for the drawer dialog.',
    kind: 'input',
  },
  {
    name: 'ariaLabelledBy',
    type: 'string | null',
    default: 'null',
    description: 'ID of the element that labels the drawer dialog.',
    kind: 'input',
  },
  {
    name: 'opened',
    type: 'void',
    default: '-',
    description: 'Emits when the drawer has finished opening.',
    kind: 'output',
  },
  {
    name: 'closed',
    type: 'void',
    default: '-',
    description: 'Emits when the drawer has finished closing.',
    kind: 'output',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = [
  {
    name: '--ui-drawer-width',
    default: '20rem',
    description: 'Controls the width of the drawer panel.',
  },
]

const EXAMPLES = {
  start: `<button (click)="startOpen.set(true)">Open Start Drawer</button>

<ui-drawer [(open)]="startOpen" position="start" ariaLabel="Start drawer">
  <ui-drawer-header>
    <h2 class="text-lg font-semibold">Navigation</h2>
  </ui-drawer-header>
  <ui-drawer-content>
    <p>Drawer content from the start side.</p>
  </ui-drawer-content>
  <ui-drawer-footer>
    <button uiDrawerClose>Close</button>
  </ui-drawer-footer>
</ui-drawer>`,
  end: `<button (click)="endOpen.set(true)">Open End Drawer</button>

<ui-drawer [(open)]="endOpen" position="end" ariaLabel="End drawer">
  <ui-drawer-header>
    <h2 class="text-lg font-semibold">Details</h2>
  </ui-drawer-header>
  <ui-drawer-content>
    <p>Drawer content from the end side.</p>
  </ui-drawer-content>
</ui-drawer>`,
  push: `<ui-drawer-container class="h-64 border border-border rounded-lg">
  <ui-drawer [(open)]="pushOpen" mode="push" position="start" ariaLabel="Push drawer">
    <ui-drawer-header>
      <h2 class="text-lg font-semibold">Sidebar</h2>
    </ui-drawer-header>
    <ui-drawer-content>
      <p>This drawer pushes the content aside.</p>
    </ui-drawer-content>
  </ui-drawer>
  <div class="p-4">
    <button (click)="pushOpen.set(true)">Toggle Push Drawer</button>
    <p class="mt-2 text-sm text-foreground-muted">The main content shifts when the drawer opens.</p>
  </div>
</ui-drawer-container>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiDrawer, UiDrawerContainer, UiDrawerHeader, UiDrawerContent, UiDrawerFooter, UiDrawerClose,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Drawer</h1>
        <p class="mt-1 text-foreground-muted">A panel that slides in from the edge of the screen, used for navigation or supplementary content.</p>
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
              title="Start Position"
              description="A drawer that slides in from the start (left in LTR) side of the viewport."
              [htmlCode]="startHtml"
              [focusTerms]="focusTerms"
            >
              <button
                class="px-4 py-2 text-sm rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors"
                (click)="startOpen.set(true)"
              >
                Open Start Drawer
              </button>

              <ui-drawer [(open)]="startOpen" position="start" ariaLabel="Start drawer">
                <ui-drawer-header>
                  <h2 class="text-lg font-semibold text-foreground">Navigation</h2>
                </ui-drawer-header>
                <ui-drawer-content>
                  <p class="text-sm text-foreground-muted">Drawer content from the start side. Click the backdrop or press Escape to close.</p>
                </ui-drawer-content>
                <ui-drawer-footer>
                  <button
                    uiDrawerClose
                    class="px-4 py-2 text-sm rounded-md border border-border text-foreground hover:bg-surface-hover transition-colors"
                  >
                    Close
                  </button>
                </ui-drawer-footer>
              </ui-drawer>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="End Position"
              description="A drawer that slides in from the end (right in LTR) side of the viewport."
              [htmlCode]="endHtml"
              [focusTerms]="focusTerms"
            >
              <button
                class="px-4 py-2 text-sm rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors"
                (click)="endOpen.set(true)"
              >
                Open End Drawer
              </button>

              <ui-drawer [(open)]="endOpen" position="end" ariaLabel="End drawer">
                <ui-drawer-header>
                  <h2 class="text-lg font-semibold text-foreground">Details</h2>
                </ui-drawer-header>
                <ui-drawer-content>
                  <p class="text-sm text-foreground-muted">Drawer content from the end side. Click the backdrop or press Escape to close.</p>
                </ui-drawer-content>
              </ui-drawer>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Push Mode"
              description="The drawer pushes the main content instead of overlaying it. Wrap in ui-drawer-container."
              [htmlCode]="pushHtml"
              [focusTerms]="focusTerms"
            >
              <ui-drawer-container class="h-64 border border-border rounded-lg overflow-hidden">
                <ui-drawer [(open)]="pushOpen" mode="push" position="start" ariaLabel="Push drawer">
                  <ui-drawer-header>
                    <h2 class="text-lg font-semibold text-foreground">Sidebar</h2>
                  </ui-drawer-header>
                  <ui-drawer-content>
                    <p class="text-sm text-foreground-muted">This drawer pushes the content aside.</p>
                  </ui-drawer-content>
                </ui-drawer>
                <div class="p-4">
                  <button
                    class="px-4 py-2 text-sm rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors"
                    (click)="togglePush()"
                  >
                    Toggle Push Drawer
                  </button>
                  <p class="mt-2 text-sm text-foreground-muted">The main content shifts when the drawer opens.</p>
                </div>
              </ui-drawer-container>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiDrawer" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class DrawerShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly startHtml = EXAMPLES.start
  protected readonly endHtml = EXAMPLES.end
  protected readonly pushHtml = EXAMPLES.push

  protected readonly startOpen = signal(false)
  protected readonly endOpen = signal(false)
  protected readonly pushOpen = signal(false)

  protected togglePush() {
    this.pushOpen.update(v => !v)
  }
  protected readonly focusTerms = ['open', 'position', 'mode', 'hasBackdrop', 'closeOnBackdropClick', 'closeOnEscape', 'opened', 'closed', 'uiDrawerClose']
}
