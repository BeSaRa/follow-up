import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiAutocomplete, UiAutocompleteOption } from '../../autocomplete/autocomplete'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'value',
    type: 'any',
    default: 'null',
    description: 'The currently selected value. Supports two-way binding.',
    kind: 'model',
  },
  {
    name: 'displayWith',
    type: '(value: any) => string',
    default: 'v => v?.toString()',
    description: 'A function that maps the selected value to a display string in the input.',
    kind: 'input',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the autocomplete is disabled.',
    kind: 'input',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'Search...'",
    description: 'Placeholder text shown in the input.',
    kind: 'input',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    description: 'The size of the autocomplete trigger.',
    kind: 'input',
  },
  {
    name: 'searchChange',
    type: 'string',
    default: '—',
    description: 'Emits the current input text whenever the user types.',
    kind: 'output',
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
  basic: `<ui-autocomplete
  placeholder="Search fruits..."
  (searchChange)="onSearch($event)"
  style="width: 260px"
>
  @for (fruit of filteredFruits(); track fruit) {
    <ui-autocomplete-option [value]="fruit">
      {{ fruit }}
    </ui-autocomplete-option>
  }
</ui-autocomplete>`,
  disabled: `<ui-autocomplete placeholder="Disabled" disabled style="width: 260px">
  <ui-autocomplete-option value="apple">Apple</ui-autocomplete-option>
</ui-autocomplete>`,
}

const ALL_FRUITS = [
  'Apple',
  'Apricot',
  'Banana',
  'Blueberry',
  'Cherry',
  'Cranberry',
  'Fig',
  'Grape',
  'Kiwi',
  'Lemon',
  'Mango',
  'Orange',
  'Peach',
  'Pear',
  'Pineapple',
  'Plum',
  'Raspberry',
  'Strawberry',
  'Watermelon',
]

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiAutocomplete, UiAutocompleteOption,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Autocomplete</h1>
        <p class="mt-1 text-foreground-muted">A text input with a dropdown suggestion panel that filters options as the user types.</p>
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
              title="Basic Autocomplete"
              description="Type to filter the fruit list. Select an option from the dropdown."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <ui-autocomplete
                placeholder="Search fruits..."
                (searchChange)="onSearch($event)"
                style="width: 260px"
              >
                @for (fruit of filteredFruits(); track fruit) {
                  <ui-autocomplete-option [value]="fruit">
                    {{ fruit }}
                  </ui-autocomplete-option>
                }
              </ui-autocomplete>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Disabled"
              description="The autocomplete can be disabled to prevent interaction."
              [htmlCode]="disabledHtml"
              [focusTerms]="focusTerms"
            >
              <ui-autocomplete placeholder="Disabled" disabled style="width: 260px">
                <ui-autocomplete-option value="apple">Apple</ui-autocomplete-option>
              </ui-autocomplete>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiAutocomplete" [properties]="apiProperties" />
          <div class="mt-8">
            <h2 class="text-lg font-semibold text-foreground mb-2">UiAutocompleteOption</h2>
            <showcase-api-table componentName="UiAutocompleteOption" [properties]="optionApiProperties" />
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class AutocompleteShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly optionApiProperties = OPTION_API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly disabledHtml = EXAMPLES.disabled

  protected readonly filteredFruits = signal<string[]>(ALL_FRUITS)

  onSearch(query: string) {
    const lower = query.toLowerCase()
    this.filteredFruits.set(
      ALL_FRUITS.filter(f => f.toLowerCase().includes(lower)),
    )
  }
  protected readonly focusTerms = ['placeholder', 'disabled', 'searchChange', 'size', 'displayWith', 'value']
}
