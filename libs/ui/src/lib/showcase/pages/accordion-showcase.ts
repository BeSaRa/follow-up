import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiAccordion, UiAccordionItem } from '../../accordion/accordion'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'multi',
    type: 'boolean',
    default: 'false',
    description: 'When true, multiple accordion items can be expanded simultaneously.',
    kind: 'input',
  },
  {
    name: 'expanded',
    type: 'boolean',
    default: 'false',
    description: 'Two-way binding that controls whether the accordion item is expanded.',
    kind: 'model',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'When true, the accordion item cannot be toggled.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  single: `<ui-accordion>
  <ui-accordion-item>
    <span accordionHeader>What is Angular?</span>
    Angular is a platform for building mobile and desktop web applications using TypeScript.
  </ui-accordion-item>
  <ui-accordion-item>
    <span accordionHeader>What are signals?</span>
    Signals are a reactive primitive that notify consumers when their value changes.
  </ui-accordion-item>
  <ui-accordion-item>
    <span accordionHeader>What is standalone?</span>
    Standalone components do not require NgModules and can declare their own imports directly.
  </ui-accordion-item>
</ui-accordion>`,
  multi: `<ui-accordion multi>
  <ui-accordion-item>
    <span accordionHeader>Section One</span>
    Content for section one. Multiple sections can be open at the same time.
  </ui-accordion-item>
  <ui-accordion-item>
    <span accordionHeader>Section Two</span>
    Content for section two. Try opening this while section one is still open.
  </ui-accordion-item>
  <ui-accordion-item>
    <span accordionHeader>Section Three</span>
    Content for section three. All sections can remain expanded.
  </ui-accordion-item>
</ui-accordion>`,
  disabled: `<ui-accordion>
  <ui-accordion-item>
    <span accordionHeader>Enabled Item</span>
    This item can be toggled normally.
  </ui-accordion-item>
  <ui-accordion-item disabled>
    <span accordionHeader>Disabled Item</span>
    This content is not reachable because the item is disabled.
  </ui-accordion-item>
  <ui-accordion-item>
    <span accordionHeader>Another Enabled Item</span>
    This item can also be toggled normally.
  </ui-accordion-item>
</ui-accordion>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiAccordion, UiAccordionItem,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Accordion</h1>
        <p class="mt-1 text-foreground-muted">A vertically stacked set of interactive headings that reveal or hide associated content.</p>
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
              title="Single Expand"
              description="Only one item can be expanded at a time. Opening a new item closes the previous one."
              [htmlCode]="singleHtml"
              [focusTerms]="focusTerms"
            >
              <ui-accordion>
                <ui-accordion-item>
                  <span accordionHeader>What is Angular?</span>
                  Angular is a platform for building mobile and desktop web applications using TypeScript.
                </ui-accordion-item>
                <ui-accordion-item>
                  <span accordionHeader>What are signals?</span>
                  Signals are a reactive primitive that notify consumers when their value changes.
                </ui-accordion-item>
                <ui-accordion-item>
                  <span accordionHeader>What is standalone?</span>
                  Standalone components do not require NgModules and can declare their own imports directly.
                </ui-accordion-item>
              </ui-accordion>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Multi Expand"
              description="Multiple items can be expanded simultaneously when the multi input is set."
              [htmlCode]="multiHtml"
              [focusTerms]="focusTerms"
            >
              <ui-accordion multi>
                <ui-accordion-item>
                  <span accordionHeader>Section One</span>
                  Content for section one. Multiple sections can be open at the same time.
                </ui-accordion-item>
                <ui-accordion-item>
                  <span accordionHeader>Section Two</span>
                  Content for section two. Try opening this while section one is still open.
                </ui-accordion-item>
                <ui-accordion-item>
                  <span accordionHeader>Section Three</span>
                  Content for section three. All sections can remain expanded.
                </ui-accordion-item>
              </ui-accordion>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Disabled Item"
              description="Individual accordion items can be disabled to prevent interaction."
              [htmlCode]="disabledHtml"
              [focusTerms]="focusTerms"
            >
              <ui-accordion>
                <ui-accordion-item>
                  <span accordionHeader>Enabled Item</span>
                  This item can be toggled normally.
                </ui-accordion-item>
                <ui-accordion-item disabled>
                  <span accordionHeader>Disabled Item</span>
                  This content is not reachable because the item is disabled.
                </ui-accordion-item>
                <ui-accordion-item>
                  <span accordionHeader>Another Enabled Item</span>
                  This item can also be toggled normally.
                </ui-accordion-item>
              </ui-accordion>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiAccordion / UiAccordionItem" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class AccordionShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly singleHtml = EXAMPLES.single
  protected readonly multiHtml = EXAMPLES.multi
  protected readonly disabledHtml = EXAMPLES.disabled
  protected readonly focusTerms = ['multi', 'expanded', 'disabled', 'accordionHeader']
}
