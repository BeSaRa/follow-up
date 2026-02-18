import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiChip } from '../../chip/chip'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'accent' | 'outline'",
    default: "'secondary'",
    description: 'The visual style variant of the chip.',
    kind: 'input',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    description: 'The size of the chip.',
    kind: 'input',
  },
  {
    name: 'removable',
    type: 'boolean',
    default: 'false',
    description: 'Whether the chip displays a remove button.',
    kind: 'input',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the chip is disabled.',
    kind: 'input',
  },
  {
    name: 'selected',
    type: 'boolean',
    default: 'false',
    description: 'Whether the chip is selected. Supports two-way binding.',
    kind: 'model',
  },
  {
    name: 'removed',
    type: 'void',
    default: '-',
    description: 'Emitted when the remove button is clicked.',
    kind: 'output',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  variants: `<ui-chip variant="primary">Primary</ui-chip>
<ui-chip variant="secondary">Secondary</ui-chip>
<ui-chip variant="accent">Accent</ui-chip>
<ui-chip variant="outline">Outline</ui-chip>`,
  sizes: `<ui-chip size="sm">Small</ui-chip>
<ui-chip size="md">Medium</ui-chip>`,
  removable: `<ui-chip removable (removed)="onRemove()">Removable</ui-chip>`,
  selectable: `<ui-chip [(selected)]="isSelected()">Click to select</ui-chip>`,
  disabled: `<ui-chip disabled>Disabled</ui-chip>
<ui-chip disabled removable>Disabled Removable</ui-chip>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiChip,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Chip</h1>
        <p class="mt-1 text-foreground-muted">A compact element for displaying tags, selections, or filters with optional remove and select functionality.</p>
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
              description="The chip supports four visual variants."
              [htmlCode]="variantsHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap gap-3">
                <ui-chip variant="primary">Primary</ui-chip>
                <ui-chip variant="secondary">Secondary</ui-chip>
                <ui-chip variant="accent">Accent</ui-chip>
                <ui-chip variant="outline">Outline</ui-chip>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Sizes"
              description="Chips come in two sizes: small and medium."
              [htmlCode]="sizesHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap items-center gap-3">
                <ui-chip size="sm">Small</ui-chip>
                <ui-chip size="md">Medium</ui-chip>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Removable"
              description="Chips can display a remove button that emits when clicked."
              [htmlCode]="removableHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap gap-3">
                <ui-chip removable>Removable Primary</ui-chip>
                <ui-chip variant="accent" removable>Removable Accent</ui-chip>
                <ui-chip variant="outline" removable>Removable Outline</ui-chip>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Selectable"
              description="Chips can be toggled between selected and unselected states by clicking."
              [htmlCode]="selectableHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap gap-3">
                <ui-chip [(selected)]="selectedPrimary" variant="primary">Primary</ui-chip>
                <ui-chip [(selected)]="selectedSecondary">Secondary</ui-chip>
                <ui-chip [(selected)]="selectedAccent" variant="accent">Accent</ui-chip>
                <ui-chip [(selected)]="selectedOutline" variant="outline">Outline</ui-chip>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Disabled"
              description="Chips can be disabled to prevent interaction."
              [htmlCode]="disabledHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap gap-3">
                <ui-chip disabled>Disabled</ui-chip>
                <ui-chip disabled removable>Disabled Removable</ui-chip>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiChip" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class ChipShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly variantsHtml = EXAMPLES.variants
  protected readonly sizesHtml = EXAMPLES.sizes
  protected readonly removableHtml = EXAMPLES.removable
  protected readonly selectableHtml = EXAMPLES.selectable
  protected readonly disabledHtml = EXAMPLES.disabled

  protected readonly focusTerms = ['variant', 'size', 'removable', 'disabled', 'selected', 'removed']
  protected readonly selectedPrimary = signal(false)
  protected readonly selectedSecondary = signal(true)
  protected readonly selectedAccent = signal(false)
  protected readonly selectedOutline = signal(false)
}
