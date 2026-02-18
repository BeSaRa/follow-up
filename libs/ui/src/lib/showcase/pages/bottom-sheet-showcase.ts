import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiButton } from '../../button/button'
import {
  BottomSheetService,
  BottomSheetRef,
  BOTTOM_SHEET_DATA,
} from '../../bottom-sheet/bottom-sheet'

// ── Sample content component for the service-opened bottom sheet ──

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-bottom-sheet-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiButton],
  template: `
    <div class="p-4 space-y-4">
      <h2 class="text-lg font-semibold text-foreground">{{ data.title }}</h2>
      <p class="text-sm text-foreground-muted">{{ data.description }}</p>
      <div class="flex gap-2">
        <button uiButton variant="primary" (click)="ref.close('confirmed')">Confirm</button>
        <button uiButton variant="outline" (click)="ref.close()">Cancel</button>
      </div>
    </div>
  `,
})
export class ShowcaseBottomSheetContent {
  readonly data = inject<{ title: string, description: string }>(BOTTOM_SHEET_DATA)
  readonly ref = inject(BottomSheetRef)
}

// ── API ──

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'open',
    type: 'open<T>(componentOrTemplate, config?)',
    default: '-',
    description: 'Opens a bottom sheet with a component or template. Returns a BottomSheetRef.',
    kind: 'model',
  },
  {
    name: 'snapPoints',
    type: "BottomSheetSnapPoint[]",
    default: "['half', 'full']",
    description: 'The available snap points for the bottom sheet height.',
    kind: 'input',
  },
  {
    name: 'initialSnap',
    type: "'peek' | 'half' | 'full'",
    default: "'half'",
    description: 'The initial snap point when the sheet opens.',
    kind: 'input',
  },
  {
    name: 'swipeToDismiss',
    type: 'boolean',
    default: 'true',
    description: 'Whether the user can swipe down to dismiss the sheet.',
    kind: 'input',
  },
  {
    name: 'hasBackdrop',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show a backdrop behind the bottom sheet.',
    kind: 'input',
  },
  {
    name: 'data',
    type: 'unknown',
    default: 'undefined',
    description: 'Data to pass to the opened component via BOTTOM_SHEET_DATA injection token.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = [
  {
    name: '--color-surface-raised',
    default: '#fff',
    description: 'The background color of the bottom sheet panel.',
  },
  {
    name: '--color-border',
    default: '#e5e7eb',
    description: 'The border color of the bottom sheet top edge.',
  },
]

const EXAMPLES = {
  service: `// In your component
private readonly bottomSheet = inject(BottomSheetService)

openSheet() {
  const ref = this.bottomSheet.open(MyContentComponent, {
    snapPoints: ['half', 'full'],
    initialSnap: 'half',
    data: { title: 'Sheet Title', description: 'Some content.' },
  })
  ref.afterClosed().subscribe(result => {
    console.log('Closed with:', result)
  })
}`,
  snapPoints: `// Different snap point configurations
this.bottomSheet.open(MyComponent, {
  snapPoints: ['peek', 'half', 'full'],
  initialSnap: 'peek',
})`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-bottom-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiButton,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Bottom Sheet</h1>
        <p class="mt-1 text-foreground-muted">A panel that slides up from the bottom of the screen with draggable snap points.</p>
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
              title="Service-opened Bottom Sheet"
              description="Open a bottom sheet programmatically using the BottomSheetService with custom data."
              [tsCode]="serviceTsCode"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="primary" (click)="openBasicSheet()">Open Bottom Sheet</button>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Snap Points"
              description="Configure different snap points to control the sheet height options."
              [tsCode]="snapPointsTsCode"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="outline" (click)="openPeekSheet()">Peek + Half + Full</button>
                <button uiButton variant="outline" (click)="openFullSheet()">Full Only</button>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="BottomSheetService" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class BottomSheetShowcase {
  private readonly bottomSheet = inject(BottomSheetService)

  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly serviceTsCode = EXAMPLES.service
  protected readonly snapPointsTsCode = EXAMPLES.snapPoints

  openBasicSheet() {
    this.bottomSheet.open(ShowcaseBottomSheetContent, {
      snapPoints: ['half', 'full'],
      initialSnap: 'half',
      data: {
        title: 'Bottom Sheet',
        description: 'This bottom sheet was opened using the BottomSheetService. You can drag the handle to resize or swipe down to dismiss.',
      },
    })
  }

  openPeekSheet() {
    this.bottomSheet.open(ShowcaseBottomSheetContent, {
      snapPoints: ['peek', 'half', 'full'],
      initialSnap: 'peek',
      data: {
        title: 'Peek Mode',
        description: 'This sheet starts in peek mode. Drag up to half or full height.',
      },
    })
  }

  openFullSheet() {
    this.bottomSheet.open(ShowcaseBottomSheetContent, {
      snapPoints: ['full'],
      initialSnap: 'full',
      data: {
        title: 'Full Sheet',
        description: 'This sheet only has a full snap point.',
      },
    })
  }
}
