import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiRadioGroup, UiRadioButton } from '../../radio/radio'

const GROUP_API_PROPERTIES: ApiProperty[] = [
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
    description: 'Whether the entire radio group is disabled.',
    kind: 'input',
  },
  {
    name: 'name',
    type: 'string',
    default: 'auto-generated',
    description: 'The name attribute for the radio group.',
    kind: 'input',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'vertical'",
    description: 'The layout direction of the radio buttons.',
    kind: 'input',
  },
]

const BUTTON_API_PROPERTIES: ApiProperty[] = [
  {
    name: 'value',
    type: 'any',
    default: '—',
    description: 'The value associated with this radio button. Required.',
    kind: 'input',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether this radio button is disabled.',
    kind: 'input',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    description: 'The size of the radio button.',
    kind: 'input',
  },
  {
    name: 'labelPosition',
    type: "'before' | 'after'",
    default: "'after'",
    description: 'Whether the label appears before or after the radio circle.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-radio-group>
  <ui-radio-button value="apple">Apple</ui-radio-button>
  <ui-radio-button value="banana">Banana</ui-radio-button>
  <ui-radio-button value="cherry">Cherry</ui-radio-button>
</ui-radio-group>`,
  horizontal: `<ui-radio-group orientation="horizontal">
  <ui-radio-button value="sm">Small</ui-radio-button>
  <ui-radio-button value="md">Medium</ui-radio-button>
  <ui-radio-button value="lg">Large</ui-radio-button>
</ui-radio-group>`,
  disabled: `<ui-radio-group disabled>
  <ui-radio-button value="a">Option A</ui-radio-button>
  <ui-radio-button value="b">Option B</ui-radio-button>
</ui-radio-group>

<ui-radio-group>
  <ui-radio-button value="x">Enabled</ui-radio-button>
  <ui-radio-button value="y" disabled>Disabled</ui-radio-button>
  <ui-radio-button value="z">Enabled</ui-radio-button>
</ui-radio-group>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiRadioGroup, UiRadioButton,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Radio</h1>
        <p class="mt-1 text-foreground-muted">A radio group that allows users to select a single option from a set, with keyboard navigation and form control support.</p>
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
              title="Basic Group"
              description="A vertical radio group with three options."
              [htmlCode]="basicHtml"
            >
              <ui-radio-group>
                <ui-radio-button value="apple">Apple</ui-radio-button>
                <ui-radio-button value="banana">Banana</ui-radio-button>
                <ui-radio-button value="cherry">Cherry</ui-radio-button>
              </ui-radio-group>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Horizontal Layout"
              description="Set orientation to horizontal to lay out radio buttons in a row."
              [htmlCode]="horizontalHtml"
            >
              <ui-radio-group orientation="horizontal">
                <ui-radio-button value="sm">Small</ui-radio-button>
                <ui-radio-button value="md">Medium</ui-radio-button>
                <ui-radio-button value="lg">Large</ui-radio-button>
              </ui-radio-group>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Disabled"
              description="The entire group or individual radio buttons can be disabled."
              [htmlCode]="disabledHtml"
            >
              <div class="space-y-6">
                <div>
                  <p class="text-sm text-foreground-muted mb-2">Entire group disabled:</p>
                  <ui-radio-group disabled>
                    <ui-radio-button value="a">Option A</ui-radio-button>
                    <ui-radio-button value="b">Option B</ui-radio-button>
                  </ui-radio-group>
                </div>

                <div>
                  <p class="text-sm text-foreground-muted mb-2">Individual option disabled:</p>
                  <ui-radio-group>
                    <ui-radio-button value="x">Enabled</ui-radio-button>
                    <ui-radio-button value="y" disabled>Disabled</ui-radio-button>
                    <ui-radio-button value="z">Enabled</ui-radio-button>
                  </ui-radio-group>
                </div>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiRadioGroup" [properties]="groupApiProperties" />
          <div class="mt-8">
            <h2 class="text-lg font-semibold text-foreground mb-2">UiRadioButton</h2>
            <showcase-api-table componentName="UiRadioButton" [properties]="buttonApiProperties" />
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class RadioShowcase {
  protected readonly groupApiProperties = GROUP_API_PROPERTIES
  protected readonly buttonApiProperties = BUTTON_API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly horizontalHtml = EXAMPLES.horizontal
  protected readonly disabledHtml = EXAMPLES.disabled
}
