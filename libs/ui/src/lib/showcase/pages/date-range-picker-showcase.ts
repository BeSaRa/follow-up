import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiDateRangePicker, UiDateRangeStartInput, UiDateRangeEndInput } from '../../date-picker/date-range-picker'
import { UiDatePickerToggle } from '../../date-picker/date-picker'

const API_PROPERTIES: ApiProperty[] = [
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
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the date range picker is disabled.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-date-range-picker>
  <input uiDateRangeStart placeholder="Start date" />
  <input uiDateRangeEnd placeholder="End date" />
  <ui-date-picker-toggle />
</ui-date-range-picker>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-date-range-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiDateRangePicker, UiDateRangeStartInput, UiDateRangeEndInput, UiDatePickerToggle,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Date Range Picker</h1>
        <p class="mt-1 text-foreground-muted">A date range selection component with start and end inputs, a shared calendar overlay, and automatic range swapping.</p>
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
              title="Basic Date Range Picker"
              description="Select a start date first, then an end date. The calendar stays open between picks. Dates are automatically swapped if the end is before the start."
              [htmlCode]="basicHtml"
            >
              <ui-date-range-picker>
                <input uiDateRangeStart placeholder="Start date" />
                <input uiDateRangeEnd placeholder="End date" />
                <ui-date-picker-toggle />
              </ui-date-range-picker>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiDateRangePicker" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class DateRangePickerShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
}
