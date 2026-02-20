import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiInput, UiLabel, UiFormHint, UiFormError, UiFormField } from '../../input/input'

const INPUT_API_PROPERTIES: ApiProperty[] = [
  {
    name: 'error',
    type: 'boolean',
    default: 'false',
    description: 'Whether the input is in an error state. Applies error styling to the border and focus ring.',
    kind: 'input',
  },
]

const FORM_FIELD_API_PROPERTIES: ApiProperty[] = [
  {
    name: 'showErrors',
    type: 'boolean',
    default: 'true',
    description: 'Whether to auto-detect and display validation errors from the projected NgControl. Set to false to disable auto-error rendering and styling.',
    kind: 'input',
  },
  {
    name: 'errorMap',
    type: 'Record<string, string>',
    default: '{}',
    description: 'Override error-to-translation-key mapping. Keys are validator error keys (e.g. "required"), values are translation keys (e.g. "login.username_required"). Defaults to "errors.{key}" convention.',
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
  autoError: `<!-- UiFormField auto-detects NgControl errors -->
<form [formGroup]="form">
  <ui-form-field>
    <label uiLabel>Username</label>
    <input uiInput formControlName="username" />
  </ui-form-field>

  <ui-form-field>
    <label uiLabel>Email</label>
    <input uiInput formControlName="email" />
  </ui-form-field>
</form>`,
  autoErrorCustomMap: `<!-- Per-field override via errorMap -->
<ui-form-field [errorMap]="{ required: 'login.username_required' }">
  <label uiLabel>Username</label>
  <input uiInput formControlName="username" />
</ui-form-field>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
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
            >
              <div class="max-w-sm">
                <input uiInput placeholder="Enter your name" />
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Textarea"
              description="The uiInput directive also works on textarea elements."
              [htmlCode]="textareaHtml"
            >
              <div class="max-w-sm">
                <textarea uiInput placeholder="Enter a description"></textarea>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Label and Hint"
              description="Use UiFormField, UiLabel, and UiFormHint for a complete form field composition."
              [htmlCode]="labelHintHtml"
            >
              <div class="max-w-sm">
                <ui-form-field>
                  <label uiLabel for="showcase-email">Email</label>
                  <input uiInput id="showcase-email" placeholder="you@example.com" />
                  <span uiFormHint>We'll never share your email.</span>
                </ui-form-field>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Error State"
              description="Set the error input to display error styling, and use UiFormError for the error message."
              [htmlCode]="errorHtml"
            >
              <div class="max-w-sm">
                <ui-form-field>
                  <label uiLabel for="showcase-username-error">Username</label>
                  <input uiInput id="showcase-username-error" error placeholder="Choose a username" />
                  <span uiFormError>This username is already taken.</span>
                </ui-form-field>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Form Field Composition"
              description="Compose multiple form fields using the UiFormField wrapper."
              [htmlCode]="formFieldHtml"
            >
              <div class="max-w-sm space-y-4">
                <ui-form-field>
                  <label uiLabel for="showcase-fullname">Full Name</label>
                  <input uiInput id="showcase-fullname" placeholder="John Doe" />
                  <span uiFormHint>Enter your first and last name.</span>
                </ui-form-field>

                <ui-form-field>
                  <label uiLabel for="showcase-bio">Bio</label>
                  <textarea uiInput id="showcase-bio" placeholder="Tell us about yourself"></textarea>
                  <span uiFormHint>Max 200 characters.</span>
                </ui-form-field>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Auto Error (Reactive Forms)"
              description="UiFormField auto-detects NgControl validation state. No manual [error] binding or @if blocks needed — just add validators to your FormControl."
              [htmlCode]="autoErrorHtml"
            >
              <div class="max-w-sm space-y-4">
                <form [formGroup]="autoErrorForm">
                  <div class="space-y-4">
                    <ui-form-field>
                      <label uiLabel for="showcase-auto-username">Username</label>
                      <input uiInput id="showcase-auto-username" formControlName="username" placeholder="Required field" />
                    </ui-form-field>

                    <ui-form-field>
                      <label uiLabel for="showcase-auto-email">Email</label>
                      <input uiInput id="showcase-auto-email" formControlName="email" placeholder="Must be a valid email" />
                    </ui-form-field>

                    <ui-form-field>
                      <label uiLabel for="showcase-auto-bio">Bio</label>
                      <input uiInput id="showcase-auto-bio" formControlName="bio" placeholder="At least 3 characters" />
                    </ui-form-field>
                  </div>
                </form>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiInput" [properties]="inputApiProperties" />
          <showcase-api-table componentName="UiFormField" [properties]="formFieldApiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class InputShowcase {
  private readonly fb = inject(FormBuilder)

  protected readonly inputApiProperties = INPUT_API_PROPERTIES
  protected readonly formFieldApiProperties = FORM_FIELD_API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly textareaHtml = EXAMPLES.textarea
  protected readonly labelHintHtml = EXAMPLES.labelHint
  protected readonly errorHtml = EXAMPLES.error
  protected readonly formFieldHtml = EXAMPLES.formField
  protected readonly autoErrorHtml = EXAMPLES.autoError

  protected readonly autoErrorForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    bio: ['', [Validators.required, Validators.minLength(3)]],
  })
}
