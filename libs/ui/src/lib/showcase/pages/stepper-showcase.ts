import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiButton } from '../../button/button'
import { UiStepper, UiStep } from '../../stepper/stepper'

const API_PROPERTIES: ApiProperty[] = [
  // UiStepper
  {
    name: 'selectedIndex',
    type: 'number',
    default: '0',
    description: 'The index of the currently active step. Supports two-way binding.',
    kind: 'model',
  },
  {
    name: 'linear',
    type: 'boolean',
    default: 'false',
    description: 'When true, steps must be completed sequentially before proceeding to the next.',
    kind: 'input',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'The layout direction of the stepper.',
    kind: 'input',
  },
  // UiStep
  {
    name: 'label',
    type: 'string',
    default: '-',
    description: 'The label text displayed in the step header. Required.',
    kind: 'input',
  },
  {
    name: 'completed',
    type: 'boolean',
    default: 'false',
    description: 'Whether the step has been completed. Shows a checkmark icon when true.',
    kind: 'input',
  },
  {
    name: 'optional',
    type: 'boolean',
    default: 'false',
    description: 'Whether the step is optional. Displays an "(Optional)" label and allows skipping in linear mode.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  horizontal: `<ui-stepper [(selectedIndex)]="currentStep">
  <ui-step label="Account">
    <p>Create your account.</p>
    <button uiButton (click)="stepper.next()">Next</button>
  </ui-step>
  <ui-step label="Profile">
    <p>Fill in your profile details.</p>
    <button uiButton variant="outline" (click)="stepper.previous()">Back</button>
    <button uiButton (click)="stepper.next()">Next</button>
  </ui-step>
  <ui-step label="Review">
    <p>Review and submit.</p>
    <button uiButton variant="outline" (click)="stepper.previous()">Back</button>
    <button uiButton>Submit</button>
  </ui-step>
</ui-stepper>`,
  vertical: `<ui-stepper orientation="vertical">
  <ui-step label="Step One">
    <p>Content for step one.</p>
  </ui-step>
  <ui-step label="Step Two">
    <p>Content for step two.</p>
  </ui-step>
  <ui-step label="Step Three">
    <p>Content for step three.</p>
  </ui-step>
</ui-stepper>`,
  linear: `<ui-stepper linear>
  <ui-step label="Required Step" [completed]="step1Done">
    <p>Complete this step to unlock the next.</p>
    <button uiButton (click)="step1Done = true">
      Mark Complete
    </button>
  </ui-step>
  <ui-step label="Optional Step" optional>
    <p>This step can be skipped.</p>
  </ui-step>
  <ui-step label="Final Step">
    <p>All done!</p>
  </ui-step>
</ui-stepper>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiButton, UiStepper, UiStep,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Stepper</h1>
        <p class="mt-1 text-foreground-muted">A multi-step workflow component that guides users through a sequence of steps, with support for horizontal, vertical, and linear modes.</p>
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
              title="Horizontal Stepper"
              description="The default horizontal layout with navigation buttons inside each step."
              [htmlCode]="horizontalHtml"
            >
              <ui-stepper #hStepper [(selectedIndex)]="horizontalStep">
                <ui-step label="Account">
                  <div class="mt-4 space-y-4">
                    <p class="text-sm text-foreground-muted">Create your account.</p>
                    <button uiButton (click)="hStepper.next()">Next</button>
                  </div>
                </ui-step>
                <ui-step label="Profile">
                  <div class="mt-4 space-y-4">
                    <p class="text-sm text-foreground-muted">Fill in your profile details.</p>
                    <div class="flex gap-2">
                      <button uiButton variant="outline" (click)="hStepper.previous()">Back</button>
                      <button uiButton (click)="hStepper.next()">Next</button>
                    </div>
                  </div>
                </ui-step>
                <ui-step label="Review">
                  <div class="mt-4 space-y-4">
                    <p class="text-sm text-foreground-muted">Review and submit.</p>
                    <div class="flex gap-2">
                      <button uiButton variant="outline" (click)="hStepper.previous()">Back</button>
                      <button uiButton>Submit</button>
                    </div>
                  </div>
                </ui-step>
              </ui-stepper>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Vertical Stepper"
              description="A vertical layout where steps are stacked with connecting lines."
              [htmlCode]="verticalHtml"
            >
              <ui-stepper #vStepper orientation="vertical" [(selectedIndex)]="verticalStep">
                <ui-step label="Step One">
                  <div class="space-y-4">
                    <p class="text-sm text-foreground-muted">Content for step one.</p>
                    <button uiButton size="sm" (click)="vStepper.next()">Continue</button>
                  </div>
                </ui-step>
                <ui-step label="Step Two">
                  <div class="space-y-4">
                    <p class="text-sm text-foreground-muted">Content for step two.</p>
                    <div class="flex gap-2">
                      <button uiButton variant="outline" size="sm" (click)="vStepper.previous()">Back</button>
                      <button uiButton size="sm" (click)="vStepper.next()">Continue</button>
                    </div>
                  </div>
                </ui-step>
                <ui-step label="Step Three">
                  <div class="space-y-4">
                    <p class="text-sm text-foreground-muted">Content for step three.</p>
                    <button uiButton variant="outline" size="sm" (click)="vStepper.previous()">Back</button>
                  </div>
                </ui-step>
              </ui-stepper>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Linear Mode"
              description="In linear mode, users must complete each step before moving forward. Optional steps can be skipped."
              [htmlCode]="linearHtml"
            >
              <ui-stepper #lStepper linear [(selectedIndex)]="linearStep">
                <ui-step label="Required Step" [completed]="linearStep1Done()">
                  <div class="mt-4 space-y-4">
                    <p class="text-sm text-foreground-muted">Complete this step to unlock the next.</p>
                    <button uiButton (click)="completeLinearStep1(); lStepper.next()">Mark Complete &amp; Next</button>
                  </div>
                </ui-step>
                <ui-step label="Optional Step" optional>
                  <div class="mt-4 space-y-4">
                    <p class="text-sm text-foreground-muted">This step can be skipped.</p>
                    <div class="flex gap-2">
                      <button uiButton variant="outline" (click)="lStepper.previous()">Back</button>
                      <button uiButton (click)="lStepper.next()">Skip</button>
                    </div>
                  </div>
                </ui-step>
                <ui-step label="Final Step">
                  <div class="mt-4 space-y-4">
                    <p class="text-sm text-foreground-muted">All done!</p>
                    <button uiButton variant="outline" (click)="lStepper.previous()">Back</button>
                  </div>
                </ui-step>
              </ui-stepper>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiStepper / UiStep" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class StepperShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly horizontalHtml = EXAMPLES.horizontal
  protected readonly verticalHtml = EXAMPLES.vertical
  protected readonly linearHtml = EXAMPLES.linear

  protected readonly horizontalStep = signal(0)
  protected readonly verticalStep = signal(0)
  protected readonly linearStep = signal(0)
  protected readonly linearStep1Done = signal(false)

  protected completeLinearStep1() {
    this.linearStep1Done.set(true)
  }
}
