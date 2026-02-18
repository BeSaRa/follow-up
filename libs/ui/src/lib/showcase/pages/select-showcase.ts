import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiSelect, UiSelectOption } from '../../select/select'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'value',
    type: 'any',
    default: 'null',
    description: 'The currently selected value. Supports two-way binding.',
    kind: 'model',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the select is disabled.',
    kind: 'input',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'Select...'",
    description: 'Placeholder text shown when no option is selected.',
    kind: 'input',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    description: 'The size of the select trigger.',
    kind: 'input',
  },
]

const OPTION_API_PROPERTIES: ApiProperty[] = [
  {
    name: 'value',
    type: 'any',
    default: '—',
    description: 'The value associated with this option. Required.',
    kind: 'input',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether this option is disabled.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-select style="width: 200px">
  <ui-select-option value="apple">Apple</ui-select-option>
  <ui-select-option value="banana">Banana</ui-select-option>
  <ui-select-option value="cherry">Cherry</ui-select-option>
</ui-select>`,
  placeholder: `<ui-select placeholder="Pick a fruit" style="width: 200px">
  <ui-select-option value="apple">Apple</ui-select-option>
  <ui-select-option value="banana">Banana</ui-select-option>
  <ui-select-option value="cherry">Cherry</ui-select-option>
</ui-select>`,
  disabled: `<ui-select placeholder="Disabled" disabled style="width: 200px">
  <ui-select-option value="apple">Apple</ui-select-option>
  <ui-select-option value="banana">Banana</ui-select-option>
</ui-select>

<ui-select placeholder="Pick a fruit" style="width: 200px">
  <ui-select-option value="apple">Apple</ui-select-option>
  <ui-select-option value="banana" disabled>Banana (disabled)</ui-select-option>
  <ui-select-option value="cherry">Cherry</ui-select-option>
</ui-select>`,
  sizes: `<ui-select size="sm" placeholder="Small" style="width: 180px">
  <ui-select-option value="a">Option A</ui-select-option>
  <ui-select-option value="b">Option B</ui-select-option>
</ui-select>

<ui-select size="md" placeholder="Medium" style="width: 180px">
  <ui-select-option value="a">Option A</ui-select-option>
  <ui-select-option value="b">Option B</ui-select-option>
</ui-select>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiSelect, UiSelectOption,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Select</h1>
        <p class="mt-1 text-foreground-muted">A dropdown select component with keyboard navigation, overlay positioning, and form control support.</p>
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
              title="Basic Select"
              description="A simple select with three options."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <ui-select style="width: 200px">
                <ui-select-option value="apple">Apple</ui-select-option>
                <ui-select-option value="banana">Banana</ui-select-option>
                <ui-select-option value="cherry">Cherry</ui-select-option>
              </ui-select>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Placeholder"
              description="Customize the placeholder text shown before a selection is made."
              [htmlCode]="placeholderHtml"
              [focusTerms]="focusTerms"
            >
              <ui-select placeholder="Pick a fruit" style="width: 200px">
                <ui-select-option value="apple">Apple</ui-select-option>
                <ui-select-option value="banana">Banana</ui-select-option>
                <ui-select-option value="cherry">Cherry</ui-select-option>
              </ui-select>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Disabled"
              description="The entire select or individual options can be disabled."
              [htmlCode]="disabledHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap gap-4">
                <ui-select placeholder="Disabled" disabled style="width: 200px">
                  <ui-select-option value="apple">Apple</ui-select-option>
                  <ui-select-option value="banana">Banana</ui-select-option>
                </ui-select>

                <ui-select placeholder="Pick a fruit" style="width: 200px">
                  <ui-select-option value="apple">Apple</ui-select-option>
                  <ui-select-option value="banana" disabled>Banana (disabled)</ui-select-option>
                  <ui-select-option value="cherry">Cherry</ui-select-option>
                </ui-select>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Sizes"
              description="The select trigger comes in two sizes: small and medium."
              [htmlCode]="sizesHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap items-center gap-4">
                <ui-select size="sm" placeholder="Small" style="width: 180px">
                  <ui-select-option value="a">Option A</ui-select-option>
                  <ui-select-option value="b">Option B</ui-select-option>
                </ui-select>

                <ui-select size="md" placeholder="Medium" style="width: 180px">
                  <ui-select-option value="a">Option A</ui-select-option>
                  <ui-select-option value="b">Option B</ui-select-option>
                </ui-select>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiSelect" [properties]="apiProperties" />
          <div class="mt-8">
            <h2 class="text-lg font-semibold text-foreground mb-2">UiSelectOption</h2>
            <showcase-api-table componentName="UiSelectOption" [properties]="optionApiProperties" />
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class SelectShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly optionApiProperties = OPTION_API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly placeholderHtml = EXAMPLES.placeholder
  protected readonly disabledHtml = EXAMPLES.disabled
  protected readonly sizesHtml = EXAMPLES.sizes
  protected readonly focusTerms = ['placeholder', 'disabled', 'size', 'value']
}
