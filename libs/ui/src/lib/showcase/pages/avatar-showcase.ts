import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiAvatar } from '../../avatar/avatar'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'src',
    type: 'string',
    default: '-',
    description: 'The URL of the avatar image.',
    kind: 'input',
  },
  {
    name: 'alt',
    type: 'string',
    default: "''",
    description: 'Alt text for the avatar image.',
    kind: 'input',
  },
  {
    name: 'initials',
    type: 'string',
    default: '-',
    description: 'Initials to display when no image is provided. Truncated to 2 characters.',
    kind: 'input',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'The size of the avatar.',
    kind: 'input',
  },
  {
    name: 'status',
    type: "'online' | 'offline' | 'busy' | 'away' | null",
    default: 'null',
    description: 'Optional status indicator displayed as a colored dot.',
    kind: 'input',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  sizes: `<ui-avatar size="sm" initials="SM" />
<ui-avatar size="md" initials="MD" />
<ui-avatar size="lg" initials="LG" />`,
  withImage: `<ui-avatar src="https://i.pravatar.cc/150?img=1" alt="User avatar" />
<ui-avatar src="https://i.pravatar.cc/150?img=2" alt="User avatar" size="lg" />`,
  initials: `<ui-avatar initials="AB" />
<ui-avatar initials="CD" variant="accent" />
<ui-avatar initials="EF" size="lg" />`,
  fallback: `<!-- When no src or initials are provided, a default icon is shown -->
<ui-avatar size="sm" />
<ui-avatar size="md" />
<ui-avatar size="lg" />`,
  status: `<ui-avatar initials="ON" status="online" />
<ui-avatar initials="OF" status="offline" />
<ui-avatar initials="BS" status="busy" />
<ui-avatar initials="AW" status="away" />`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiAvatar,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Avatar</h1>
        <p class="mt-1 text-foreground-muted">A visual representation of a user or entity, supporting images, initials, and status indicators.</p>
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
              title="Sizes"
              description="Avatars come in three sizes: small, medium, and large."
              [htmlCode]="sizesHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap items-center gap-4">
                <ui-avatar size="sm" initials="SM" />
                <ui-avatar size="md" initials="MD" />
                <ui-avatar size="lg" initials="LG" />
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Image"
              description="Avatars can display an image when a src URL is provided."
              [htmlCode]="withImageHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap items-center gap-4">
                <ui-avatar src="https://i.pravatar.cc/150?img=1" alt="User avatar" />
                <ui-avatar src="https://i.pravatar.cc/150?img=2" alt="User avatar" size="lg" />
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Initials"
              description="When no image is provided, initials are displayed as the fallback."
              [htmlCode]="initialsHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap items-center gap-4">
                <ui-avatar initials="AB" />
                <ui-avatar initials="CD" />
                <ui-avatar initials="EF" size="lg" />
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Default Fallback"
              description="When neither image nor initials are provided, a default user icon is displayed."
              [htmlCode]="fallbackHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap items-center gap-4">
                <ui-avatar size="sm" />
                <ui-avatar size="md" />
                <ui-avatar size="lg" />
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Status Indicator"
              description="Avatars can show a status dot indicating online, offline, busy, or away."
              [htmlCode]="statusHtml"
              [focusTerms]="focusTerms"
            >
              <div class="flex flex-wrap items-center gap-4">
                <ui-avatar initials="ON" status="online" />
                <ui-avatar initials="OF" status="offline" />
                <ui-avatar initials="BS" status="busy" />
                <ui-avatar initials="AW" status="away" />
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiAvatar" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class AvatarShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly sizesHtml = EXAMPLES.sizes
  protected readonly withImageHtml = EXAMPLES.withImage
  protected readonly initialsHtml = EXAMPLES.initials
  protected readonly fallbackHtml = EXAMPLES.fallback
  protected readonly statusHtml = EXAMPLES.status
  protected readonly focusTerms = ['size', 'src', 'alt', 'initials', 'status']
}
