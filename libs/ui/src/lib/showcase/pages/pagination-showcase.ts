import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiPagination, type PageChangeEvent } from '../../pagination/pagination'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'totalItems',
    type: 'number',
    default: '-',
    description: 'The total number of items to paginate. Required.',
    kind: 'input',
  },
  {
    name: 'pageSize',
    type: 'number',
    default: '10',
    description: 'The number of items displayed per page.',
    kind: 'input',
  },
  {
    name: 'pageIndex',
    type: 'number',
    default: '0',
    description: 'The zero-based index of the current page.',
    kind: 'input',
  },
  {
    name: 'pageSizeOptions',
    type: 'number[]',
    default: '[5, 10, 25, 50]',
    description: 'The available page size options shown in the dropdown.',
    kind: 'input',
  },
  {
    name: 'showFirstLastButtons',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show the first and last page navigation buttons.',
    kind: 'input',
  },
  {
    name: 'showPageSizeSelector',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show the page size selector dropdown.',
    kind: 'input',
  },
  {
    name: 'pageChange',
    type: 'PageChangeEvent',
    default: '-',
    description: 'Emitted when the page index or page size changes. The event contains pageIndex and pageSize.',
    kind: 'output',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-pagination
  [totalItems]="100"
  [pageSize]="pageSize()"
  [pageIndex]="pageIndex()"
  (pageChange)="onPageChange($event)"
/>`,
  pageSizes: `<ui-pagination
  [totalItems]="200"
  [pageSize]="25"
  [pageSizeOptions]="[10, 25, 50, 100]"
  (pageChange)="onPageChange($event)"
/>`,
  minimal: `<ui-pagination
  [totalItems]="50"
  [pageSize]="10"
  [showFirstLastButtons]="false"
  [showPageSizeSelector]="false"
  (pageChange)="onPageChange($event)"
/>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiPagination,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Pagination</h1>
        <p class="mt-1 text-foreground-muted">A navigation control for paging through large data sets, with configurable page sizes and first/last buttons.</p>
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
              title="Basic Pagination"
              description="A fully-featured pagination control with page size selector and first/last buttons."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <ui-pagination
                [totalItems]="100"
                [pageSize]="basicPageSize()"
                [pageIndex]="basicPageIndex()"
                (pageChange)="onBasicPageChange($event)"
              />
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Custom Page Sizes"
              description="The page size options can be customized to fit the data set."
              [htmlCode]="pageSizesHtml"
              [focusTerms]="focusTerms"
            >
              <ui-pagination
                [totalItems]="200"
                [pageSize]="customPageSize()"
                [pageIndex]="customPageIndex()"
                [pageSizeOptions]="[10, 25, 50, 100]"
                (pageChange)="onCustomPageChange($event)"
              />
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Minimal Pagination"
              description="Hide the page size selector and first/last buttons for a compact pagination control."
              [htmlCode]="minimalHtml"
              [focusTerms]="focusTerms"
            >
              <ui-pagination
                [totalItems]="50"
                [pageSize]="minimalPageSize()"
                [pageIndex]="minimalPageIndex()"
                [showFirstLastButtons]="false"
                [showPageSizeSelector]="false"
                (pageChange)="onMinimalPageChange($event)"
              />
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiPagination" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class PaginationShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly pageSizesHtml = EXAMPLES.pageSizes
  protected readonly minimalHtml = EXAMPLES.minimal

  protected readonly basicPageIndex = signal(0)
  protected readonly basicPageSize = signal(10)

  protected readonly customPageIndex = signal(0)
  protected readonly customPageSize = signal(25)

  protected readonly minimalPageIndex = signal(0)
  protected readonly minimalPageSize = signal(10)

  protected onBasicPageChange(event: PageChangeEvent) {
    this.basicPageIndex.set(event.pageIndex)
    this.basicPageSize.set(event.pageSize)
  }

  protected onCustomPageChange(event: PageChangeEvent) {
    this.customPageIndex.set(event.pageIndex)
    this.customPageSize.set(event.pageSize)
  }

  protected onMinimalPageChange(event: PageChangeEvent) {
    this.minimalPageIndex.set(event.pageIndex)
    this.minimalPageSize.set(event.pageSize)
  }
  protected readonly focusTerms = ['totalItems', 'pageSize', 'pageIndex', 'pageSizeOptions', 'showFirstLastButtons', 'showPageSizeSelector', 'pageChange']
}
