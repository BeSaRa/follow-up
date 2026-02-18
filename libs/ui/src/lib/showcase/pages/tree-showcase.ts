import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import {
  UiTree,
  UiTreeNode,
  UiTreeNodeToggle,
  UiTreeNodePadding,
} from '../../tree/tree'
import { CdkTreeNodeDef } from '@angular/cdk/tree'

interface FileNode {
  name: string
  children?: FileNode[]
}

const BASIC_DATA: FileNode[] = [
  {
    name: 'src',
    children: [
      {
        name: 'app',
        children: [
          { name: 'app.component.ts' },
          { name: 'app.routes.ts' },
        ],
      },
      {
        name: 'assets',
        children: [
          { name: 'logo.svg' },
        ],
      },
      { name: 'main.ts' },
    ],
  },
  {
    name: 'package.json',
  },
  {
    name: 'tsconfig.json',
  },
]

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'selectionMode',
    type: "'none' | 'single' | 'multi'",
    default: "'none'",
    description: 'Controls node selection behaviour. Use single for one selected node or multi for multiple.',
    kind: 'input',
  },
  {
    name: 'selectionChange',
    type: 'T[]',
    default: '-',
    description: 'Emits the array of currently selected nodes whenever the selection changes.',
    kind: 'output',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-tree
  [dataSource]="data"
  [childrenAccessor]="childrenAccessor">
  <ui-tree-node *cdkTreeNodeDef="let node" uiTreeNodePadding>
    <button uiTreeNodeToggle>
      @if (tree.isNodeExpandable(node)) {
        {{ tree.isExpanded(node) ? '\u25BC' : '\u25B6' }}
      }
    </button>
    {{ node.name }}
  </ui-tree-node>
</ui-tree>`,
  selection: `<ui-tree #tree
  [dataSource]="data"
  [childrenAccessor]="childrenAccessor"
  selectionMode="single"
  (selectionChange)="onSelect($event)">
  <ui-tree-node *cdkTreeNodeDef="let node" uiTreeNodePadding>
    <button uiTreeNodeToggle>
      @if (tree.isNodeExpandable(node)) {
        {{ tree.isExpanded(node) ? '\u25BC' : '\u25B6' }}
      }
    </button>
    {{ node.name }}
  </ui-tree-node>
</ui-tree>`,
}

function getChildren(node: FileNode): FileNode[] {
  return node.children ?? []
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiTree, UiTreeNode, UiTreeNodeToggle, UiTreeNodePadding, CdkTreeNodeDef,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Tree</h1>
        <p class="mt-1 text-foreground-muted">A hierarchical tree view for displaying nested data with expand/collapse and optional selection.</p>
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
              title="Basic Tree"
              description="A file-system-like tree with expandable folders."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <div class="rounded-lg border border-border p-4">
                <ui-tree #basicTree
                  [dataSource]="data"
                  [childrenAccessor]="childrenAccessor">
                  <ui-tree-node *cdkTreeNodeDef="let node" uiTreeNodePadding>
                    <button uiTreeNodeToggle class="size-6 inline-flex items-center justify-center text-xs">
                      @if (basicTree.isNodeExpandable(node)) {
                        @if (basicTree.isExpanded(node)) {
                          <svg class="size-4 text-foreground-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        } @else {
                          <svg class="size-4 text-foreground-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        }
                      } @else {
                        <span class="size-4"></span>
                      }
                    </button>
                    <span class="text-sm">{{ node.name }}</span>
                  </ui-tree-node>
                </ui-tree>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Selection"
              description="Enable single selection mode to allow picking one node at a time."
              [htmlCode]="selectionHtml"
              [focusTerms]="focusTerms"
            >
              <div class="rounded-lg border border-border p-4">
                <ui-tree #selTree
                  [dataSource]="data"
                  [childrenAccessor]="childrenAccessor"
                  selectionMode="single">
                  <ui-tree-node *cdkTreeNodeDef="let node" uiTreeNodePadding>
                    <button uiTreeNodeToggle class="size-6 inline-flex items-center justify-center text-xs">
                      @if (selTree.isNodeExpandable(node)) {
                        @if (selTree.isExpanded(node)) {
                          <svg class="size-4 text-foreground-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        } @else {
                          <svg class="size-4 text-foreground-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        }
                      } @else {
                        <span class="size-4"></span>
                      }
                    </button>
                    <span class="text-sm">{{ node.name }}</span>
                  </ui-tree-node>
                </ui-tree>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiTree" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class TreeShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly selectionHtml = EXAMPLES.selection

  protected readonly data = BASIC_DATA
  protected readonly childrenAccessor = getChildren
  protected readonly focusTerms = ['dataSource', 'childrenAccessor', 'selectionMode', 'selectionChange', 'uiTreeNodeToggle', 'uiTreeNodePadding']
}
