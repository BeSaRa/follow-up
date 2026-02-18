import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiBadge } from '../../badge/badge'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'outline'",
    default: "'primary'",
    description: 'The visual style variant of the badge.',
    kind: 'input',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    description: 'The size of the badge.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  variants: `<ui-badge variant="primary">Primary</ui-badge>
<ui-badge variant="secondary">Secondary</ui-badge>
<ui-badge variant="accent">Accent</ui-badge>
<ui-badge variant="success">Success</ui-badge>
<ui-badge variant="warning">Warning</ui-badge>
<ui-badge variant="error">Error</ui-badge>
<ui-badge variant="info">Info</ui-badge>
<ui-badge variant="outline">Outline</ui-badge>`,
  sizes: `<ui-badge size="sm">Small</ui-badge>
<ui-badge size="md">Medium</ui-badge>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiBadge,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Badge</h1>
        <p class="mt-1 text-foreground-muted">A small label used to highlight status, categories, or counts.</p>
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
              title="Variants"
              description="The badge supports eight visual variants for different semantic meanings."
              [htmlCode]="variantsHtml"
            >
              <div class="flex flex-wrap gap-3">
                <ui-badge variant="primary">Primary</ui-badge>
                <ui-badge variant="secondary">Secondary</ui-badge>
                <ui-badge variant="accent">Accent</ui-badge>
                <ui-badge variant="success">Success</ui-badge>
                <ui-badge variant="warning">Warning</ui-badge>
                <ui-badge variant="error">Error</ui-badge>
                <ui-badge variant="info">Info</ui-badge>
                <ui-badge variant="outline">Outline</ui-badge>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Sizes"
              description="Badges come in two sizes: small and medium."
              [htmlCode]="sizesHtml"
            >
              <div class="flex flex-wrap items-center gap-3">
                <ui-badge size="sm">Small</ui-badge>
                <ui-badge size="md">Medium</ui-badge>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiBadge" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class BadgeShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly variantsHtml = EXAMPLES.variants
  protected readonly sizesHtml = EXAMPLES.sizes
}
