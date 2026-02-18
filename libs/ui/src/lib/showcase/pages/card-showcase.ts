import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import {
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
  UiCardContent,
  UiCardFooter,
} from '../../card/card'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'UiCard',
    type: 'component',
    default: '-',
    description: 'The root card container. Provides border, background, shadow, and rounded corners.',
    kind: 'input',
  },
  {
    name: 'UiCardHeader',
    type: 'component',
    default: '-',
    description: 'Optional header section with vertical flex layout and padding.',
    kind: 'input',
  },
  {
    name: 'UiCardTitle',
    type: 'component',
    default: '-',
    description: 'Card title with semibold text styling. Place inside ui-card-header.',
    kind: 'input',
  },
  {
    name: 'UiCardDescription',
    type: 'component',
    default: '-',
    description: 'Card description with muted text. Place inside ui-card-header.',
    kind: 'input',
  },
  {
    name: 'UiCardContent',
    type: 'component',
    default: '-',
    description: 'Main content area of the card with horizontal padding.',
    kind: 'input',
  },
  {
    name: 'UiCardFooter',
    type: 'component',
    default: '-',
    description: 'Footer section with flex layout for action buttons.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-card>
  <ui-card-header>
    <ui-card-title>Card Title</ui-card-title>
  </ui-card-header>
  <ui-card-content>
    <p>This is a basic card with a title and some content.</p>
  </ui-card-content>
</ui-card>`,
  allSections: `<ui-card>
  <ui-card-header>
    <ui-card-title>Project Update</ui-card-title>
    <ui-card-description>Latest status of the project.</ui-card-description>
  </ui-card-header>
  <ui-card-content>
    <p>The project is progressing well. All milestones are on track and the team is delivering on schedule.</p>
  </ui-card-content>
  <ui-card-footer>
    <span class="text-sm text-foreground-muted">Updated 2 hours ago</span>
  </ui-card-footer>
</ui-card>`,
  footerActions: `<ui-card>
  <ui-card-header>
    <ui-card-title>Confirm Action</ui-card-title>
    <ui-card-description>Are you sure you want to proceed?</ui-card-description>
  </ui-card-header>
  <ui-card-content>
    <p>This action cannot be undone. Please review the details before confirming.</p>
  </ui-card-content>
  <ui-card-footer>
    <button class="px-4 py-2 text-sm rounded-md border border-border text-foreground hover:bg-surface-hover transition-colors">Cancel</button>
    <button class="px-4 py-2 text-sm rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors">Confirm</button>
  </ui-card-footer>
</ui-card>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiCard, UiCardHeader, UiCardTitle, UiCardDescription, UiCardContent, UiCardFooter,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Card</h1>
        <p class="mt-1 text-foreground-muted">A versatile container for grouping related content and actions.</p>
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
              title="Basic Card"
              description="A simple card with a title and content."
              [htmlCode]="basicHtml"            >
              <ui-card>
                <ui-card-header>
                  <ui-card-title>Card Title</ui-card-title>
                </ui-card-header>
                <ui-card-content>
                  <p>This is a basic card with a title and some content.</p>
                </ui-card-content>
              </ui-card>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Card with All Sections"
              description="A card using header, title, description, content, and footer."
              [htmlCode]="allSectionsHtml"            >
              <ui-card>
                <ui-card-header>
                  <ui-card-title>Project Update</ui-card-title>
                  <ui-card-description>Latest status of the project.</ui-card-description>
                </ui-card-header>
                <ui-card-content>
                  <p>The project is progressing well. All milestones are on track and the team is delivering on schedule.</p>
                </ui-card-content>
                <ui-card-footer>
                  <span class="text-sm text-foreground-muted">Updated 2 hours ago</span>
                </ui-card-footer>
              </ui-card>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Card with Footer Actions"
              description="A card with action buttons in the footer."
              [htmlCode]="footerActionsHtml"            >
              <ui-card>
                <ui-card-header>
                  <ui-card-title>Confirm Action</ui-card-title>
                  <ui-card-description>Are you sure you want to proceed?</ui-card-description>
                </ui-card-header>
                <ui-card-content>
                  <p>This action cannot be undone. Please review the details before confirming.</p>
                </ui-card-content>
                <ui-card-footer>
                  <button class="px-4 py-2 text-sm rounded-md border border-border text-foreground hover:bg-surface-hover transition-colors">Cancel</button>
                  <button class="px-4 py-2 text-sm rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors">Confirm</button>
                </ui-card-footer>
              </ui-card>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiCard" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class CardShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly allSectionsHtml = EXAMPLES.allSections
  protected readonly footerActionsHtml = EXAMPLES.footerActions
}
