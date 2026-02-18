import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiProgressBar } from '../../progress-bar/progress-bar'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'value',
    type: 'number',
    default: '0',
    description: 'The current progress value (0-100). Clamped automatically.',
    kind: 'input',
  },
  {
    name: 'mode',
    type: "'determinate' | 'indeterminate'",
    default: "'determinate'",
    description: 'Controls whether the bar shows a specific value or an animated indeterminate state.',
    kind: 'input',
  },
  {
    name: 'variant',
    type: "'primary' | 'accent' | 'success' | 'warning' | 'error'",
    default: "'primary'",
    description: 'The color variant of the progress bar.',
    kind: 'input',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    description: 'The height of the progress bar.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  variants: `<ui-progress-bar variant="primary" [value]="60" />
<ui-progress-bar variant="accent" [value]="60" />
<ui-progress-bar variant="success" [value]="60" />
<ui-progress-bar variant="warning" [value]="60" />
<ui-progress-bar variant="error" [value]="60" />`,
  sizes: `<ui-progress-bar size="sm" [value]="45" />
<ui-progress-bar size="md" [value]="45" />`,
  indeterminate: `<ui-progress-bar mode="indeterminate" />
<ui-progress-bar mode="indeterminate" variant="accent" />`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiProgressBar,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Progress Bar</h1>
        <p class="mt-1 text-foreground-muted">A linear indicator that communicates progress of an operation or loading state.</p>
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
              title="All Variants"
              description="Five color variants to convey different meanings."
              [htmlCode]="variantsHtml"
            >
              <div class="space-y-4">
                <div class="space-y-1">
                  <span class="text-xs text-foreground-muted">Primary</span>
                  <ui-progress-bar variant="primary" [value]="60" />
                </div>
                <div class="space-y-1">
                  <span class="text-xs text-foreground-muted">Accent</span>
                  <ui-progress-bar variant="accent" [value]="60" />
                </div>
                <div class="space-y-1">
                  <span class="text-xs text-foreground-muted">Success</span>
                  <ui-progress-bar variant="success" [value]="60" />
                </div>
                <div class="space-y-1">
                  <span class="text-xs text-foreground-muted">Warning</span>
                  <ui-progress-bar variant="warning" [value]="60" />
                </div>
                <div class="space-y-1">
                  <span class="text-xs text-foreground-muted">Error</span>
                  <ui-progress-bar variant="error" [value]="60" />
                </div>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="All Sizes"
              description="Available in small and medium heights."
              [htmlCode]="sizesHtml"
            >
              <div class="space-y-4">
                <div class="space-y-1">
                  <span class="text-xs text-foreground-muted">Small (sm)</span>
                  <ui-progress-bar size="sm" [value]="45" />
                </div>
                <div class="space-y-1">
                  <span class="text-xs text-foreground-muted">Medium (md)</span>
                  <ui-progress-bar size="md" [value]="45" />
                </div>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Indeterminate Mode"
              description="An animated bar for operations with unknown duration."
              [htmlCode]="indeterminateHtml"
            >
              <div class="space-y-4">
                <div class="space-y-1">
                  <span class="text-xs text-foreground-muted">Primary indeterminate</span>
                  <ui-progress-bar mode="indeterminate" />
                </div>
                <div class="space-y-1">
                  <span class="text-xs text-foreground-muted">Accent indeterminate</span>
                  <ui-progress-bar mode="indeterminate" variant="accent" />
                </div>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiProgressBar" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class ProgressBarShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly variantsHtml = EXAMPLES.variants
  protected readonly sizesHtml = EXAMPLES.sizes
  protected readonly indeterminateHtml = EXAMPLES.indeterminate
}
