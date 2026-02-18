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
import { ToastService } from '../../toast/toast'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'success',
    type: 'success(message, options?)',
    default: '-',
    description: 'Shows a success toast with the given message and optional ToastOptions.',
    kind: 'method',
  },
  {
    name: 'error',
    type: 'error(message, options?)',
    default: '-',
    description: 'Shows an error toast with the given message and optional ToastOptions.',
    kind: 'method',
  },
  {
    name: 'warning',
    type: 'warning(message, options?)',
    default: '-',
    description: 'Shows a warning toast with the given message and optional ToastOptions.',
    kind: 'method',
  },
  {
    name: 'info',
    type: 'info(message, options?)',
    default: '-',
    description: 'Shows an info toast with the given message and optional ToastOptions.',
    kind: 'method',
  },
  {
    name: 'show',
    type: 'show(config)',
    default: '-',
    description: 'Shows a toast using a full ToastConfig object with message, variant, and options.',
    kind: 'method',
  },
  {
    name: 'dismissAll',
    type: 'dismissAll()',
    default: '-',
    description: 'Dismisses all currently visible toasts.',
    kind: 'method',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  variants: `// In your component
private readonly toast = inject(ToastService)

showSuccess() {
  this.toast.success('Changes saved successfully.')
}

showError() {
  this.toast.error('Failed to save changes.')
}

showWarning() {
  this.toast.warning('Your session will expire soon.')
}

showInfo() {
  this.toast.info('A new update is available.')
}`,
  positions: `// In your component
private readonly toast = inject(ToastService)

showTopEnd() {
  this.toast.info('Top end toast.', { position: 'top-end' })
}

showTopCenter() {
  this.toast.info('Top center toast.', { position: 'top-center' })
}

showBottomStart() {
  this.toast.info('Bottom start toast.', { position: 'bottom-start' })
}`,
  options: `// In your component
private readonly toast = inject(ToastService)

showWithTitle() {
  this.toast.success('Your profile has been updated.', {
    title: 'Profile Saved',
  })
}

showWithDuration() {
  this.toast.info('This toast will stay for 10 seconds.', {
    duration: 10000,
  })
}`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiButton,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Toast</h1>
        <p class="mt-1 text-foreground-muted">A brief notification that appears temporarily to provide feedback.</p>
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
              description="Toasts come in four variants for different contextual feedback."
              [tsCode]="variantsTsCode"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="primary" (click)="showSuccess()">Success</button>
                <button uiButton variant="destructive" (click)="showError()">Error</button>
                <button uiButton variant="outline" (click)="showWarning()">Warning</button>
                <button uiButton variant="secondary" (click)="showInfo()">Info</button>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Positions"
              description="Toasts can appear in six different positions on the screen."
              [tsCode]="positionsTsCode"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="outline" (click)="showTopStart()">Top Start</button>
                <button uiButton variant="outline" (click)="showTopCenter()">Top Center</button>
                <button uiButton variant="outline" (click)="showTopEnd()">Top End</button>
                <button uiButton variant="outline" (click)="showBottomStart()">Bottom Start</button>
                <button uiButton variant="outline" (click)="showBottomCenter()">Bottom Center</button>
                <button uiButton variant="outline" (click)="showBottomEnd()">Bottom End</button>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Title and Custom Duration"
              description="Toasts can include a title and a custom auto-dismiss duration."
              [tsCode]="optionsTsCode"
            >
              <div class="flex flex-wrap gap-3">
                <button uiButton variant="primary" (click)="showWithTitle()">With Title</button>
                <button uiButton variant="secondary" (click)="showWithDuration()">10s Duration</button>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="ToastService" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class ToastShowcase {
  private readonly toast = inject(ToastService)

  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly variantsTsCode = EXAMPLES.variants
  protected readonly positionsTsCode = EXAMPLES.positions
  protected readonly optionsTsCode = EXAMPLES.options

  showSuccess() {
    this.toast.success('Changes saved successfully.')
  }

  showError() {
    this.toast.error('Failed to save changes.')
  }

  showWarning() {
    this.toast.warning('Your session will expire soon.')
  }

  showInfo() {
    this.toast.info('A new update is available.')
  }

  showTopStart() {
    this.toast.info('Top start toast.', { position: 'top-start' })
  }

  showTopCenter() {
    this.toast.info('Top center toast.', { position: 'top-center' })
  }

  showTopEnd() {
    this.toast.info('Top end toast.', { position: 'top-end' })
  }

  showBottomStart() {
    this.toast.info('Bottom start toast.', { position: 'bottom-start' })
  }

  showBottomCenter() {
    this.toast.info('Bottom center toast.', { position: 'bottom-center' })
  }

  showBottomEnd() {
    this.toast.info('Bottom end toast.', { position: 'bottom-end' })
  }

  showWithTitle() {
    this.toast.success('Your profile has been updated.', {
      title: 'Profile Saved',
    })
  }

  showWithDuration() {
    this.toast.info('This toast will stay for 10 seconds.', {
      duration: 10000,
    })
  }
}
