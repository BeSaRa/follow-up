import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiDatePicker, UiDatePickerInput, UiDatePickerToggle } from '../../date-picker/date-picker'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'value',
    type: 'Date | null',
    default: 'null',
    description: 'The currently selected date. Supports two-way binding.',
    kind: 'model',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'MM/DD/YYYY'",
    description: 'Placeholder text for the date input.',
    kind: 'input',
  },
  {
    name: 'min',
    type: 'Date | null',
    default: 'null',
    description: 'The minimum selectable date.',
    kind: 'input',
  },
  {
    name: 'max',
    type: 'Date | null',
    default: 'null',
    description: 'The maximum selectable date.',
    kind: 'input',
  },
  {
    name: 'dateFilter',
    type: '((date: Date) => boolean) | null',
    default: 'null',
    description: 'A function to filter which dates are selectable.',
    kind: 'input',
  },
  {
    name: 'startAt',
    type: 'Date | null',
    default: 'null',
    description: 'The date to open the calendar at when no value is selected.',
    kind: 'input',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the date picker is disabled.',
    kind: 'input',
  },
]

const TOGGLE_API_PROPERTIES: ApiProperty[] = [
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the toggle button is disabled.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-date-picker>
  <input uiDatePickerInput placeholder="MM/DD/YYYY" />
  <ui-date-picker-toggle />
</ui-date-picker>`,
  withToggle: `<ui-date-picker>
  <input uiDatePickerInput placeholder="Pick a date" />
  <ui-date-picker-toggle />
</ui-date-picker>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiDatePicker, UiDatePickerInput, UiDatePickerToggle,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Date Picker</h1>
        <p class="mt-1 text-foreground-muted">A date selection component with a calendar overlay, manual text input parsing, and keyboard navigation.</p>
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
              title="Basic Date Picker"
              description="Click the calendar icon or press Enter/ArrowDown in the input to open the calendar. Type a date directly or pick from the calendar."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <ui-date-picker>
                <input uiDatePickerInput placeholder="MM/DD/YYYY" />
                <ui-date-picker-toggle />
              </ui-date-picker>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiDatePicker" [properties]="apiProperties" />
          <div class="mt-8">
            <h2 class="text-lg font-semibold text-foreground mb-2">UiDatePickerToggle</h2>
            <showcase-api-table componentName="UiDatePickerToggle" [properties]="toggleApiProperties" />
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class DatePickerShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly toggleApiProperties = TOGGLE_API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly focusTerms = ['uiDatePickerInput', 'placeholder', 'min', 'max', 'dateFilter', 'startAt', 'disabled', 'value']
}
