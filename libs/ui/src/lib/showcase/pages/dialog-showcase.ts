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
import { DialogService } from '../../dialog/dialog'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'open',
    type: 'open<T, D, R>(template, config?)',
    default: '-',
    description: 'Opens a custom dialog with the given component or template and optional MatDialogConfig.',
    kind: 'method',
  },
  {
    name: 'error',
    type: 'error(content, title?)',
    default: '-',
    description: 'Opens an error-styled dialog with the given message.',
    kind: 'method',
  },
  {
    name: 'success',
    type: 'success(content, title?)',
    default: '-',
    description: 'Opens a success-styled dialog with the given message.',
    kind: 'method',
  },
  {
    name: 'info',
    type: 'info(content, title?)',
    default: '-',
    description: 'Opens an info-styled dialog with the given message.',
    kind: 'method',
  },
  {
    name: 'warning',
    type: 'warning(content, title?)',
    default: '-',
    description: 'Opens a warning-styled dialog with the given message.',
    kind: 'method',
  },
  {
    name: 'confirm',
    type: 'confirm(content, title?, acceptText?, rejectText?)',
    default: '-',
    description: 'Opens a confirm dialog that resolves with true (accepted) or false (rejected).',
    kind: 'method',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  variants: `// In your component
private readonly dialog = inject(DialogService)

openSuccess() {
  this.dialog.success('Operation completed successfully.')
}

openError() {
  this.dialog.error('An unexpected error occurred.')
}

openWarning() {
  this.dialog.warning('This action cannot be undone.')
}

openInfo() {
  this.dialog.info('Your account has been updated.')
}`,
  confirm: `// In your component
private readonly dialog = inject(DialogService)

openConfirm() {
  const ref = this.dialog.confirm(
    'Are you sure you want to delete this item?',
    'Delete Item',
    'Delete',
    'Cancel',
  )
  ref.afterClosed().subscribe(result => {
    console.log('Confirmed:', result)
  })
}`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiButton,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Dialog</h1>
        <p class="mt-1 text-foreground-muted">A modal dialog overlay for alerts, confirmations, and custom content.</p>
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
              title="Dialog Variants"
              description="Open dialogs with different visual variants using the DialogService."
              [tsCode]="variantsTsCode"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="primary" (click)="openSuccess()">Success</button>
                <button uiButton variant="destructive" (click)="openError()">Error</button>
                <button uiButton variant="outline" (click)="openWarning()">Warning</button>
                <button uiButton variant="secondary" (click)="openInfo()">Info</button>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Confirm Dialog"
              description="A confirm dialog that returns a boolean result when closed."
              [tsCode]="confirmTsCode"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="destructive" (click)="openConfirm()">Delete Item</button>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Custom Title"
              description="Dialogs accept an optional custom title as the second argument."
              [tsCode]="customTitleTsCode"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="primary" (click)="openCustomTitle()">Custom Title</button>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="DialogService" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class DialogShowcase {
  private readonly dialog = inject(DialogService)

  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly variantsTsCode = EXAMPLES.variants
  protected readonly confirmTsCode = EXAMPLES.confirm
  protected readonly customTitleTsCode = `// In your component
private readonly dialog = inject(DialogService)

openCustomTitle() {
  this.dialog.info('Here is some important information.', 'Custom Title')
}`

  openSuccess() {
    this.dialog.success('Operation completed successfully.')
  }

  openError() {
    this.dialog.error('An unexpected error occurred.')
  }

  openWarning() {
    this.dialog.warning('This action cannot be undone.')
  }

  openInfo() {
    this.dialog.info('Your account has been updated.')
  }

  openConfirm() {
    this.dialog.confirm(
      'Are you sure you want to delete this item?',
      'Delete Item',
      'Delete',
      'Cancel',
    )
  }

  openCustomTitle() {
    this.dialog.info('Here is some important information.', 'Custom Title')
  }
}
