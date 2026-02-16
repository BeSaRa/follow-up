import {
  Component,
  DestroyRef,
  Directive,
  inject,
  input,
  output,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  CDK_TREE_NODE_OUTLET_NODE,
  CdkTree,
  CdkTreeNode,
  CdkTreeNodeOutlet,
  CdkTreeNodePadding,
} from '@angular/cdk/tree'

// ── Types ────────────────────────────────────────────────────────

export type TreeSelectionMode = 'none' | 'single' | 'multi'

// ── UiTreeNodeOutlet ─────────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiTreeNodeOutlet]',
  providers: [{ provide: CdkTreeNodeOutlet, useExisting: UiTreeNodeOutlet }],
})
export class UiTreeNodeOutlet {
  readonly viewContainer = inject(ViewContainerRef)
  readonly _node = inject(CDK_TREE_NODE_OUTLET_NODE, { optional: true })
}

// ── UiTree ───────────────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-tree',
  imports: [UiTreeNodeOutlet],
  providers: [{ provide: CdkTree, useExisting: UiTree }],
  exportAs: 'uiTree',
  template: `<ng-container uiTreeNodeOutlet></ng-container>`,
  host: {
    'class': 'block',
    'role': 'tree',
    '[attr.aria-multiselectable]': 'selectionMode() === "multi" ? "true" : null',
  },
})
export class UiTree<T, K = T> extends CdkTree<T, K> {
  @ViewChild(UiTreeNodeOutlet, { static: true })
  declare _nodeOutlet: UiTreeNodeOutlet

  readonly selectionMode = input<TreeSelectionMode>('none')
  readonly selectionChange = output<T[]>()

  private readonly _selection = signal(new Set<T>())

  isNodeSelected(node: T): boolean {
    return this._selection().has(node)
  }

  handleNodeActivation(node: T): void {
    const mode = this.selectionMode()
    if (mode === 'none') return

    this._selection.update(current => {
      const next = new Set(current)

      if (mode === 'single') {
        if (next.has(node)) {
          next.clear()
        } else {
          next.clear()
          next.add(node)
        }
      } else if (mode === 'multi') {
        if (next.has(node)) {
          next.delete(node)
        } else {
          next.add(node)
        }
      }

      return next
    })

    this.selectionChange.emit([...this._selection()])
  }

  isNodeExpandable(node: T): boolean {
    if (this.childrenAccessor) {
      const children = this.childrenAccessor(node)
      if (Array.isArray(children)) return children.length > 0
      return children != null
    }
    return false
  }

  clearSelection(): void {
    this._selection.set(new Set())
    this.selectionChange.emit([])
  }
}

// ── UiTreeNode ───────────────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ui-tree-node',
  exportAs: 'uiTreeNode',
  providers: [{ provide: CdkTreeNode, useExisting: UiTreeNode }],
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-expanded]': '_getUiAriaExpanded()',
    '[attr.aria-selected]': '_getAriaSelected()',
    '(click)': '_handleClick()',
  },
})
export class UiTreeNode<T, K = T> extends CdkTreeNode<T, K> {
  private readonly _uiTree = inject(UiTree)
  private readonly _destroyRef = inject(DestroyRef)

  _getUiAriaExpanded(): string | null {
    if (!this._uiTree.isNodeExpandable(this.data)) return null
    return this._uiTree.isExpanded(this.data) ? 'true' : 'false'
  }

  hostClasses(): string {
    const base =
      'flex items-center gap-1 px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors ' +
      'hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring'

    return this._uiTree.isNodeSelected(this.data)
      ? `${base} bg-primary/10 text-primary`
      : base
  }

  _getAriaSelected(): string | null {
    if (this._uiTree.selectionMode() === 'none') return null
    return this._uiTree.isNodeSelected(this.data) ? 'true' : 'false'
  }

  _handleClick(): void {
    // CDK's parent (click) handler already calls _setActiveItem() via host merge
    this.activate()
  }

  override ngOnInit(): void {
    super.ngOnInit()
    this.activation
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => {
        this._uiTree.handleNodeActivation(data)
      })
  }
}

// ── UiTreeNodeToggle ─────────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiTreeNodeToggle]',
  host: {
    'class': 'inline-flex items-center justify-center size-6 rounded-sm hover:bg-surface-hover transition-colors',
    'tabindex': '-1',
    '(click)': 'toggle($event)',
  },
})
export class UiTreeNodeToggle<T, K = T> {
  private readonly _tree = inject(CdkTree<T, K>)
  private readonly _treeNode = inject(CdkTreeNode<T, K>)

  toggle(event: Event): void {
    this._tree.toggle(this._treeNode.data)
    event.stopPropagation()
  }
}

// ── UiTreeNodePadding ────────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiTreeNodePadding]',
  providers: [{ provide: CdkTreeNodePadding, useExisting: UiTreeNodePadding }],
})
export class UiTreeNodePadding<T, K = T> extends CdkTreeNodePadding<T, K> {
  constructor() {
    super()
    this._indent = 24
  }
}
