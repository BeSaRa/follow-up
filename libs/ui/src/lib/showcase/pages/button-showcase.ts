import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiButton } from '../../button/button'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive'",
    default: "'primary'",
    description: 'The visual style variant of the button.',
    kind: 'input',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'The size of the button.',
    kind: 'input',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the button is disabled.',
    kind: 'input',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Whether the button shows a loading spinner and becomes disabled.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  variants: `<button uiButton variant="primary">Primary</button>
<button uiButton variant="secondary">Secondary</button>
<button uiButton variant="accent">Accent</button>
<button uiButton variant="outline">Outline</button>
<button uiButton variant="ghost">Ghost</button>
<button uiButton variant="destructive">Destructive</button>`,
  sizes: `<button uiButton size="sm">Small</button>
<button uiButton size="md">Medium</button>
<button uiButton size="lg">Large</button>`,
  disabled: `<button uiButton disabled>Disabled Primary</button>
<button uiButton variant="outline" disabled>Disabled Outline</button>`,
  loading: `<button uiButton loading>Loading</button>
<button uiButton variant="secondary" loading>Loading</button>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiButton,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Button</h1>
        <p class="mt-1 text-foreground-muted">A clickable button element with multiple variants, sizes, and states.</p>
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
              description="The button supports six visual variants."
              [htmlCode]="variantsHtml"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="primary">Primary</button>
                <button uiButton variant="secondary">Secondary</button>
                <button uiButton variant="accent">Accent</button>
                <button uiButton variant="outline">Outline</button>
                <button uiButton variant="ghost">Ghost</button>
                <button uiButton variant="destructive">Destructive</button>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Sizes"
              description="Buttons come in three sizes: small, medium, and large."
              [htmlCode]="sizesHtml"
            >
              <div class="flex flex-wrap items-center gap-3">
                <button uiButton size="sm">Small</button>
                <button uiButton size="md">Medium</button>
                <button uiButton size="lg">Large</button>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Disabled"
              description="Buttons can be disabled to prevent interaction."
              [htmlCode]="disabledHtml"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton disabled>Disabled Primary</button>
                <button uiButton variant="outline" disabled>Disabled Outline</button>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Loading"
              description="Buttons can show a loading spinner and become disabled while an operation is in progress."
              [htmlCode]="loadingHtml"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton loading>Loading</button>
                <button uiButton variant="secondary" loading>Loading</button>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiButton" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class ButtonShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly variantsHtml = EXAMPLES.variants
  protected readonly sizesHtml = EXAMPLES.sizes
  protected readonly disabledHtml = EXAMPLES.disabled
  protected readonly loadingHtml = EXAMPLES.loading
}
