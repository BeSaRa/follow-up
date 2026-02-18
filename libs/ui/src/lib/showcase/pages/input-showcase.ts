import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiInput, UiLabel, UiFormHint, UiFormError, UiFormField } from '../../input/input'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'error',
    type: 'boolean',
    default: 'false',
    description: 'Whether the input is in an error state. Applies error styling to the border and focus ring.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<input uiInput placeholder="Enter your name" />`,
  textarea: `<textarea uiInput placeholder="Enter a description"></textarea>`,
  labelHint: `<ui-form-field>
  <label uiLabel>Email</label>
  <input uiInput placeholder="you@example.com" />
  <span uiFormHint>We'll never share your email.</span>
</ui-form-field>`,
  error: `<ui-form-field>
  <label uiLabel>Username</label>
  <input uiInput error placeholder="Choose a username" />
  <span uiFormError>This username is already taken.</span>
</ui-form-field>`,
  formField: `<ui-form-field>
  <label uiLabel>Full Name</label>
  <input uiInput placeholder="John Doe" />
  <span uiFormHint>Enter your first and last name.</span>
</ui-form-field>

<ui-form-field>
  <label uiLabel>Bio</label>
  <textarea uiInput placeholder="Tell us about yourself"></textarea>
  <span uiFormHint>Max 200 characters.</span>
</ui-form-field>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiInput, UiLabel, UiFormHint, UiFormError, UiFormField,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Input</h1>
        <p class="mt-1 text-foreground-muted">A text input directive for single-line and multi-line text fields, with support for labels, hints, and error states.</p>
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
              title="Basic Input"
              description="A simple text input with a placeholder."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <div class="max-w-sm">
                <input uiInput placeholder="Enter your name" />
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Textarea"
              description="The uiInput directive also works on textarea elements."
              [htmlCode]="textareaHtml"
              [focusTerms]="focusTerms"
            >
              <div class="max-w-sm">
                <textarea uiInput placeholder="Enter a description"></textarea>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Label and Hint"
              description="Use UiFormField, UiLabel, and UiFormHint for a complete form field composition."
              [htmlCode]="labelHintHtml"
              [focusTerms]="focusTerms"
            >
              <div class="max-w-sm">
                <ui-form-field>
                  <label uiLabel>Email</label>
                  <input uiInput placeholder="you@example.com" />
                  <span uiFormHint>We'll never share your email.</span>
                </ui-form-field>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Error State"
              description="Set the error input to display error styling, and use UiFormError for the error message."
              [htmlCode]="errorHtml"
              [focusTerms]="focusTerms"
            >
              <div class="max-w-sm">
                <ui-form-field>
                  <label uiLabel>Username</label>
                  <input uiInput error placeholder="Choose a username" />
                  <span uiFormError>This username is already taken.</span>
                </ui-form-field>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Form Field Composition"
              description="Compose multiple form fields using the UiFormField wrapper."
              [htmlCode]="formFieldHtml"
              [focusTerms]="focusTerms"
            >
              <div class="max-w-sm space-y-4">
                <ui-form-field>
                  <label uiLabel>Full Name</label>
                  <input uiInput placeholder="John Doe" />
                  <span uiFormHint>Enter your first and last name.</span>
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel>Bio</label>
                  <textarea uiInput placeholder="Tell us about yourself"></textarea>
                  <span uiFormHint>Max 200 characters.</span>
                </ui-form-field>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiInput" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class InputShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly textareaHtml = EXAMPLES.textarea
  protected readonly labelHintHtml = EXAMPLES.labelHint
  protected readonly errorHtml = EXAMPLES.error
  protected readonly formFieldHtml = EXAMPLES.formField
  protected readonly focusTerms = ['uiInput', 'uiLabel', 'uiFormHint', 'uiFormError', 'error']
}
