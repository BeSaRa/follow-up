import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiCheckbox } from '../../checkbox/checkbox'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'checked',
    type: 'boolean',
    default: 'false',
    description: 'Whether the checkbox is checked. Supports two-way binding.',
    kind: 'model',
  },
  {
    name: 'indeterminate',
    type: 'boolean',
    default: 'false',
    description: 'Whether the checkbox is in an indeterminate state. Supports two-way binding.',
    kind: 'model',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the checkbox is disabled.',
    kind: 'input',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    description: 'The size of the checkbox.',
    kind: 'input',
  },
  {
    name: 'labelPosition',
    type: "'before' | 'after'",
    default: "'after'",
    description: 'Whether the label appears before or after the checkbox.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-checkbox>Accept terms and conditions</ui-checkbox>`,
  indeterminate: `<ui-checkbox [indeterminate]="true">Select all</ui-checkbox>`,
  disabled: `<ui-checkbox disabled>Disabled unchecked</ui-checkbox>
<ui-checkbox [checked]="true" disabled>Disabled checked</ui-checkbox>`,
  labelPositions: `<ui-checkbox labelPosition="after">Label after</ui-checkbox>
<ui-checkbox labelPosition="before">Label before</ui-checkbox>`,
  sizes: `<ui-checkbox size="sm">Small checkbox</ui-checkbox>
<ui-checkbox size="md">Medium checkbox</ui-checkbox>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiCheckbox,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Checkbox</h1>
        <p class="mt-1 text-foreground-muted">A toggle control that allows users to select one or more options, with support for indeterminate state.</p>
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
              title="Basic Checkbox"
              description="A simple checkbox with a label."
              [htmlCode]="basicHtml"
            >
              <ui-checkbox>Accept terms and conditions</ui-checkbox>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Indeterminate"
              description="The indeterminate state is useful for 'select all' checkboxes where only some children are selected."
              [htmlCode]="indeterminateHtml"
            >
              <ui-checkbox [indeterminate]="true">Select all</ui-checkbox>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Disabled"
              description="Checkboxes can be disabled in both checked and unchecked states."
              [htmlCode]="disabledHtml"
            >
              <div class="flex flex-wrap gap-4">
                <ui-checkbox disabled>Disabled unchecked</ui-checkbox>
                <ui-checkbox [checked]="true" disabled>Disabled checked</ui-checkbox>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Label Positions"
              description="The label can be placed before or after the checkbox."
              [htmlCode]="labelPositionsHtml"
            >
              <div class="flex flex-wrap gap-6">
                <ui-checkbox labelPosition="after">Label after</ui-checkbox>
                <ui-checkbox labelPosition="before">Label before</ui-checkbox>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Sizes"
              description="Checkboxes come in small and medium sizes."
              [htmlCode]="sizesHtml"
            >
              <div class="flex flex-wrap items-center gap-6">
                <ui-checkbox size="sm">Small checkbox</ui-checkbox>
                <ui-checkbox size="md">Medium checkbox</ui-checkbox>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiCheckbox" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class CheckboxShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly indeterminateHtml = EXAMPLES.indeterminate
  protected readonly disabledHtml = EXAMPLES.disabled
  protected readonly labelPositionsHtml = EXAMPLES.labelPositions
  protected readonly sizesHtml = EXAMPLES.sizes
}
