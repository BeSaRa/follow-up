import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiAlert, UiAlertTitle, UiAlertDescription } from '../../alert/alert'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'variant',
    type: "'success' | 'warning' | 'error' | 'info'",
    default: "'info'",
    description: 'The visual style variant of the alert.',
    kind: 'input',
  },
  {
    name: 'dismissible',
    type: 'boolean',
    default: 'false',
    description: 'Whether the alert shows a dismiss button.',
    kind: 'input',
  },
  {
    name: 'dismissed',
    type: 'void',
    default: '-',
    description: 'Emitted when the dismiss button is clicked.',
    kind: 'output',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  variants: `<ui-alert variant="success">
  <ui-alert-title>Success</ui-alert-title>
  <ui-alert-description>Your changes have been saved.</ui-alert-description>
</ui-alert>

<ui-alert variant="warning">
  <ui-alert-title>Warning</ui-alert-title>
  <ui-alert-description>Your session is about to expire.</ui-alert-description>
</ui-alert>

<ui-alert variant="error">
  <ui-alert-title>Error</ui-alert-title>
  <ui-alert-description>Something went wrong. Please try again.</ui-alert-description>
</ui-alert>

<ui-alert variant="info">
  <ui-alert-title>Info</ui-alert-title>
  <ui-alert-description>A new version is available.</ui-alert-description>
</ui-alert>`,
  dismissible: `<ui-alert variant="info" [dismissible]="true" (dismissed)="onDismissed()">
  <ui-alert-title>Dismissible</ui-alert-title>
  <ui-alert-description>Click the X button to dismiss this alert.</ui-alert-description>
</ui-alert>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiAlert, UiAlertTitle, UiAlertDescription,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Alert</h1>
        <p class="mt-1 text-foreground-muted">Displays a callout message to the user with contextual feedback.</p>
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
              description="Alerts come in four variants for different contextual feedback."
              [htmlCode]="variantsHtml"
            >
              <div class="space-y-3">
                <ui-alert variant="success">
                  <ui-alert-title>Success</ui-alert-title>
                  <ui-alert-description>Your changes have been saved.</ui-alert-description>
                </ui-alert>
                <ui-alert variant="warning">
                  <ui-alert-title>Warning</ui-alert-title>
                  <ui-alert-description>Your session is about to expire.</ui-alert-description>
                </ui-alert>
                <ui-alert variant="error">
                  <ui-alert-title>Error</ui-alert-title>
                  <ui-alert-description>Something went wrong. Please try again.</ui-alert-description>
                </ui-alert>
                <ui-alert variant="info">
                  <ui-alert-title>Info</ui-alert-title>
                  <ui-alert-description>A new version is available.</ui-alert-description>
                </ui-alert>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Dismissible"
              description="Alerts can be dismissed by the user when the dismissible input is set."
              [htmlCode]="dismissibleHtml"
            >
              <div class="space-y-3">
                @if (showDismissible()) {
                  <ui-alert variant="info" [dismissible]="true" (dismissed)="dismissAlert()">
                    <ui-alert-title>Dismissible</ui-alert-title>
                    <ui-alert-description>Click the X button to dismiss this alert.</ui-alert-description>
                  </ui-alert>
                } @else {
                  <button
                    class="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground cursor-pointer"
                    (click)="showDismissible.set(true)"
                  >
                    Show Alert Again
                  </button>
                }
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiAlert" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class AlertShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly variantsHtml = EXAMPLES.variants
  protected readonly dismissibleHtml = EXAMPLES.dismissible

  readonly showDismissible = signal(true)

  dismissAlert() {
    this.showDismissible.set(false)
  }
}
