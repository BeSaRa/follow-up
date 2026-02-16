import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CdkTreeNodeDef } from '@angular/cdk/tree'
import {
  UiTree,
  UiTreeNode,
  UiTreeNodeToggle,
  UiTreeNodePadding,
} from './tree'
import type { TreeSelectionMode } from './tree'

// ── Test data ────────────────────────────────────────────────────

interface FileNode {
  name: string
  children?: FileNode[]
}

const TREE_DATA: FileNode[] = [
  {
    name: 'src',
    children: [
      {
        name: 'app',
        children: [
          { name: 'app.ts' },
          { name: 'app.html' },
        ],
      },
      { name: 'main.ts' },
    ],
  },
  { name: 'package.json' },
  { name: 'README.md' },
]

const getChildren = (node: FileNode): FileNode[] => node.children ?? []

// ── Helpers ──────────────────────────────────────────────────────

function query<T extends HTMLElement>(fixture: ComponentFixture<unknown>, selector: string): T {
  const el = fixture.nativeElement.querySelector(selector) as T | null
  if (!el) throw new Error(`Element not found: ${selector}`)
  return el
}

function queryAll(fixture: ComponentFixture<unknown>, selector: string): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll(selector))
}

// ── Test host ────────────────────────────────────────────────────

@Component({
  imports: [UiTree, UiTreeNode, UiTreeNodeToggle, UiTreeNodePadding, CdkTreeNodeDef],
  template: `
    <ui-tree
      #tree
      [dataSource]="data()"
      [childrenAccessor]="getChildren"
      [selectionMode]="selectionMode()"
      (selectionChange)="selectedNodes = $event"
    >
      <ui-tree-node *cdkTreeNodeDef="let node" uiTreeNodePadding>
        <button
          uiTreeNodeToggle
          class="toggle-btn"
          [style.visibility]="tree.isNodeExpandable(node) ? 'visible' : 'hidden'"
        >
          <svg
            class="size-4 text-foreground-muted transition-transform duration-200"
            [class.rotate-90]="tree.isExpanded(node)"
            aria-hidden="true"
          ></svg>
        </button>
        <span class="node-label">{{ node.name }}</span>
      </ui-tree-node>
    </ui-tree>
  `,
})
class TestHost {
  data = signal<FileNode[]>(TREE_DATA)
  selectionMode = signal<TreeSelectionMode>('none')
  selectedNodes: FileNode[] = []
  getChildren = getChildren
}

// ── Tests ────────────────────────────────────────────────────────

describe('UiTree', () => {
  let fixture: ComponentFixture<TestHost>
  let host: TestHost

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHost)
    host = fixture.componentInstance
    fixture.detectChanges()
  })

  describe('rendering', () => {
    it('should render with role="tree"', () => {
      const tree = query(fixture, 'ui-tree')
      expect(tree.getAttribute('role')).toBe('tree')
    })

    it('should render root-level nodes', () => {
      const nodes = queryAll(fixture, 'ui-tree-node')
      // Only root nodes visible initially (src, package.json, README.md)
      expect(nodes.length).toBe(3)
    })

    it('should render node labels', () => {
      const labels = queryAll(fixture, '.node-label')
      expect(labels.map(l => l.textContent?.trim())).toEqual([
        'src',
        'package.json',
        'README.md',
      ])
    })

    it('should show toggle button for expandable nodes', () => {
      const toggles = queryAll(fixture, '.toggle-btn')
      // src is expandable, package.json and README.md are not
      expect(toggles[0].style.visibility).toBe('visible')
      expect(toggles[1].style.visibility).toBe('hidden')
      expect(toggles[2].style.visibility).toBe('hidden')
    })
  })

  describe('expansion', () => {
    it('should expand a node when toggle is clicked', () => {
      const firstToggle = queryAll(fixture, '.toggle-btn')[0]
      firstToggle.click()
      fixture.detectChanges()

      // "src" expanded: now shows src, app, main.ts, package.json, README.md
      const nodes = queryAll(fixture, 'ui-tree-node')
      expect(nodes.length).toBe(5)
    })

    it('should collapse an expanded node', () => {
      const firstToggle = queryAll(fixture, '.toggle-btn')[0]
      // Expand
      firstToggle.click()
      fixture.detectChanges()
      expect(queryAll(fixture, 'ui-tree-node').length).toBe(5)

      // Collapse
      firstToggle.click()
      fixture.detectChanges()
      expect(queryAll(fixture, 'ui-tree-node').length).toBe(3)
    })

    it('should show nested children when expanding deeper nodes', () => {
      // Expand "src"
      queryAll(fixture, '.toggle-btn')[0].click()
      fixture.detectChanges()

      // Now expand "app" (second node, first child of src)
      const toggles = queryAll(fixture, '.toggle-btn')
      toggles[1].click()
      fixture.detectChanges()

      // Should show: src, app, app.ts, app.html, main.ts, package.json, README.md
      const labels = queryAll(fixture, '.node-label').map(l => l.textContent?.trim())
      expect(labels).toEqual([
        'src',
        'app',
        'app.ts',
        'app.html',
        'main.ts',
        'package.json',
        'README.md',
      ])
    })

    it('should set aria-expanded="true" when node is expanded', () => {
      queryAll(fixture, '.toggle-btn')[0].click()
      fixture.detectChanges()

      const firstNode = queryAll(fixture, 'ui-tree-node')[0]
      expect(firstNode.getAttribute('aria-expanded')).toBe('true')
    })

    it('should set aria-expanded="false" when node is collapsed', () => {
      // Expand then collapse
      queryAll(fixture, '.toggle-btn')[0].click()
      fixture.detectChanges()

      queryAll(fixture, '.toggle-btn')[0].click()
      fixture.detectChanges()

      const firstNode = queryAll(fixture, 'ui-tree-node')[0]
      expect(firstNode.getAttribute('aria-expanded')).toBe('false')
    })

    it('should rotate chevron when expanded', () => {
      const firstSvg = queryAll(fixture, '.toggle-btn svg')[0]
      expect(firstSvg.classList.contains('rotate-90')).toBe(false)

      queryAll(fixture, '.toggle-btn')[0].click()
      fixture.detectChanges()

      expect(firstSvg.classList.contains('rotate-90')).toBe(true)
    })
  })

  describe('selection mode: none', () => {
    it('should not set aria-selected on nodes', () => {
      const firstNode = queryAll(fixture, 'ui-tree-node')[0]
      expect(firstNode.getAttribute('aria-selected')).toBeNull()
    })

    it('should not emit selectionChange on click', () => {
      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      expect(host.selectedNodes).toEqual([])
    })

    it('should not set aria-multiselectable on tree', () => {
      const tree = query(fixture, 'ui-tree')
      expect(tree.getAttribute('aria-multiselectable')).toBeNull()
    })
  })

  describe('selection mode: single', () => {
    beforeEach(() => {
      host.selectionMode.set('single')
      fixture.detectChanges()
    })

    it('should select a node on click', () => {
      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      expect(host.selectedNodes.length).toBe(1)
      expect(host.selectedNodes[0].name).toBe('src')
    })

    it('should set aria-selected="true" on selected node', () => {
      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      const firstNode = queryAll(fixture, 'ui-tree-node')[0]
      expect(firstNode.getAttribute('aria-selected')).toBe('true')
    })

    it('should set aria-selected="false" on unselected nodes', () => {
      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      const secondNode = queryAll(fixture, 'ui-tree-node')[1]
      expect(secondNode.getAttribute('aria-selected')).toBe('false')
    })

    it('should apply selected classes', () => {
      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      const firstNode = queryAll(fixture, 'ui-tree-node')[0]
      expect(firstNode.className).toContain('bg-primary/10')
      expect(firstNode.className).toContain('text-primary')
    })

    it('should deselect previous when selecting a new node', () => {
      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      queryAll(fixture, 'ui-tree-node')[1].click()
      fixture.detectChanges()

      expect(host.selectedNodes.length).toBe(1)
      expect(host.selectedNodes[0].name).toBe('package.json')

      const firstNode = queryAll(fixture, 'ui-tree-node')[0]
      expect(firstNode.getAttribute('aria-selected')).toBe('false')
    })

    it('should deselect on clicking the same node again', () => {
      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      expect(host.selectedNodes.length).toBe(0)
    })
  })

  describe('selection mode: multi', () => {
    beforeEach(() => {
      host.selectionMode.set('multi')
      fixture.detectChanges()
    })

    it('should set aria-multiselectable="true" on tree', () => {
      const tree = query(fixture, 'ui-tree')
      expect(tree.getAttribute('aria-multiselectable')).toBe('true')
    })

    it('should select multiple nodes', () => {
      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      queryAll(fixture, 'ui-tree-node')[1].click()
      fixture.detectChanges()

      expect(host.selectedNodes.length).toBe(2)
      expect(host.selectedNodes.map(n => n.name)).toContain('src')
      expect(host.selectedNodes.map(n => n.name)).toContain('package.json')
    })

    it('should toggle selection off on second click', () => {
      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      queryAll(fixture, 'ui-tree-node')[0].click()
      fixture.detectChanges()

      expect(host.selectedNodes.length).toBe(0)
    })
  })

  describe('toggle vs selection', () => {
    it('should not trigger selection when toggle is clicked', () => {
      host.selectionMode.set('single')
      fixture.detectChanges()

      queryAll(fixture, '.toggle-btn')[0].click()
      fixture.detectChanges()

      // Node should be expanded but not selected
      expect(queryAll(fixture, 'ui-tree-node').length).toBe(5)
      expect(host.selectedNodes.length).toBe(0)
    })
  })

  describe('padding', () => {
    it('should apply padding based on level', () => {
      // Expand "src"
      queryAll(fixture, '.toggle-btn')[0].click()
      fixture.detectChanges()

      const nodes = queryAll(fixture, 'ui-tree-node')
      // Child nodes (app, main.ts) should have padding
      const appNode = nodes[1]
      const paddingStart = appNode.style.paddingInlineStart || appNode.style.paddingLeft
      expect(paddingStart).toBeTruthy()
    })
  })
})
