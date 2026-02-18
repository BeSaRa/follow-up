import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiSkeleton } from '../../skeleton/skeleton'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'variant',
    type: "'line' | 'circle' | 'rect'",
    default: "'line'",
    description: 'The shape of the skeleton placeholder.',
    kind: 'input',
  },
  {
    name: 'width',
    type: 'string | undefined',
    default: 'undefined',
    description: 'Custom width. Falls back to variant default (line/rect: 100%, circle: 2.5rem).',
    kind: 'input',
  },
  {
    name: 'height',
    type: 'string | undefined',
    default: 'undefined',
    description: 'Custom height. Falls back to variant default (line: 1rem, circle: same as width, rect: 8rem).',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  text: `<!-- Single line -->
<ui-skeleton />

<!-- Multiple lines with varying widths -->
<ui-skeleton />
<ui-skeleton width="80%" />
<ui-skeleton width="60%" />`,
  circle: `<ui-skeleton variant="circle" />
<ui-skeleton variant="circle" width="3rem" />
<ui-skeleton variant="circle" width="4rem" />`,
  rect: `<ui-skeleton variant="rect" />
<ui-skeleton variant="rect" height="12rem" />`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiSkeleton,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Skeleton</h1>
        <p class="mt-1 text-foreground-muted">Animated placeholder shapes that indicate loading content, available in line, circle, and rectangle variants.</p>
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
              title="Text Lines"
              description="The default line variant simulates paragraphs of text."
              [htmlCode]="textHtml"
              [focusTerms]="focusTerms"
            >
              <div class="space-y-2 max-w-sm">
                <ui-skeleton />
                <ui-skeleton width="80%" />
                <ui-skeleton width="60%" />
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Circle"
              description="Circular skeletons for avatars and profile pictures."
              [htmlCode]="circleHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex items-center gap-4">
                <ui-skeleton variant="circle" />
                <ui-skeleton variant="circle" width="3rem" />
                <ui-skeleton variant="circle" width="4rem" />
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Rectangle"
              description="Rectangular skeletons for images, cards, and content blocks."
              [htmlCode]="rectHtml"
              [focusTerms]="focusTerms"
            >
              <div class="space-y-4 max-w-sm">
                <ui-skeleton variant="rect" />
                <ui-skeleton variant="rect" height="12rem" />
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiSkeleton" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class SkeletonShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly textHtml = EXAMPLES.text
  protected readonly circleHtml = EXAMPLES.circle
  protected readonly rectHtml = EXAMPLES.rect
  protected readonly focusTerms = ['variant', 'width', 'height']
}
