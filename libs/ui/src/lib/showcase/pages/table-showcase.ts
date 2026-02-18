import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import {
  UiTable,
  UiTableHeader,
  UiTableBody,
  UiTableRow,
  UiTableHead,
  UiTableCell,
  type SortDirection,
} from '../../table/table'

const API_PROPERTIES: ApiProperty[] = [
  {
    name: 'striped',
    type: 'boolean',
    default: 'false',
    description: 'Applies alternating row background colors for improved readability.',
    kind: 'input',
  },
  {
    name: 'stickyHeader',
    type: 'boolean',
    default: 'false',
    description: 'Makes the table header sticky when the table is scrolled vertically.',
    kind: 'input',
  },
  {
    name: 'sortable',
    type: 'boolean',
    default: 'false',
    description: 'Enables sort functionality on a table head cell.',
    kind: 'input',
  },
  {
    name: 'sortDirection',
    type: "'asc' | 'desc' | null",
    default: 'null',
    description: 'The current sort direction of a sortable table head cell.',
    kind: 'input',
  },
  {
    name: 'resizable',
    type: 'boolean',
    default: 'false',
    description: 'Enables column resizing via drag handle on the table head cell.',
    kind: 'input',
  },
  {
    name: 'sortChange',
    type: 'SortDirection',
    default: '-',
    description: 'Emits the new sort direction when a sortable header is clicked.',
    kind: 'output',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

interface User {
  name: string
  email: string
  role: string
}

const SAMPLE_USERS: User[] = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
  { name: 'David Lee', email: 'david@example.com', role: 'Editor' },
  { name: 'Eve Martinez', email: 'eve@example.com', role: 'Admin' },
]

const EXAMPLES = {
  basic: `<table uiTable>
  <thead uiTableHeader>
    <tr uiTableRow>
      <th uiTableHead>Name</th>
      <th uiTableHead>Email</th>
      <th uiTableHead>Role</th>
    </tr>
  </thead>
  <tbody uiTableBody>
    <tr uiTableRow>
      <td uiTableCell>Alice Johnson</td>
      <td uiTableCell>alice&#64;example.com</td>
      <td uiTableCell>Admin</td>
    </tr>
    <!-- more rows... -->
  </tbody>
</table>`,
  striped: `<table uiTable striped>
  <thead uiTableHeader>
    <tr uiTableRow>
      <th uiTableHead>Name</th>
      <th uiTableHead>Email</th>
      <th uiTableHead>Role</th>
    </tr>
  </thead>
  <tbody uiTableBody>
    <tr uiTableRow>
      <td uiTableCell>Alice Johnson</td>
      <td uiTableCell>alice&#64;example.com</td>
      <td uiTableCell>Admin</td>
    </tr>
    <!-- more rows... -->
  </tbody>
</table>`,
  sortable: `<table uiTable>
  <thead uiTableHeader>
    <tr uiTableRow>
      <th uiTableHead sortable [sortDirection]="nameSortDir()" (sortChange)="nameSortDir.set($event)">Name</th>
      <th uiTableHead sortable [sortDirection]="emailSortDir()" (sortChange)="emailSortDir.set($event)">Email</th>
      <th uiTableHead>Role</th>
    </tr>
  </thead>
  <tbody uiTableBody>
    <tr uiTableRow>
      <td uiTableCell>Alice Johnson</td>
      <td uiTableCell>alice&#64;example.com</td>
      <td uiTableCell>Admin</td>
    </tr>
    <!-- more rows... -->
  </tbody>
</table>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiTable, UiTableHeader, UiTableBody,
    UiTableRow, UiTableHead, UiTableCell,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Table</h1>
        <p class="mt-1 text-foreground-muted">A semantic HTML table enhanced with consistent styling, striped rows, sticky headers, and sortable columns.</p>
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
              title="Basic Table"
              description="A simple table displaying rows of data."
              [htmlCode]="basicHtml"
              [focusTerms]="focusTerms"
            >
              <div class="overflow-x-auto rounded-lg border border-border">
                <table uiTable>
                  <thead uiTableHeader>
                    <tr uiTableRow>
                      <th uiTableHead>Name</th>
                      <th uiTableHead>Email</th>
                      <th uiTableHead>Role</th>
                    </tr>
                  </thead>
                  <tbody uiTableBody>
                    @for (user of users; track user.email) {
                      <tr uiTableRow>
                        <td uiTableCell>{{ user.name }}</td>
                        <td uiTableCell>{{ user.email }}</td>
                        <td uiTableCell>{{ user.role }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Striped Rows"
              description="Alternating row colors improve scanability of dense data."
              [htmlCode]="stripedHtml"
              [focusTerms]="focusTerms"
            >
              <div class="overflow-x-auto rounded-lg border border-border">
                <table uiTable striped>
                  <thead uiTableHeader>
                    <tr uiTableRow>
                      <th uiTableHead>Name</th>
                      <th uiTableHead>Email</th>
                      <th uiTableHead>Role</th>
                    </tr>
                  </thead>
                  <tbody uiTableBody>
                    @for (user of users; track user.email) {
                      <tr uiTableRow>
                        <td uiTableCell>{{ user.name }}</td>
                        <td uiTableCell>{{ user.email }}</td>
                        <td uiTableCell>{{ user.role }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="Sortable Headers"
              description="Click a sortable column header to toggle between ascending and descending sort."
              [htmlCode]="sortableHtml"
              [focusTerms]="focusTerms"
            >
              <div class="overflow-x-auto rounded-lg border border-border">
                <table uiTable>
                  <thead uiTableHeader>
                    <tr uiTableRow>
                      <th uiTableHead sortable [sortDirection]="nameSortDir()" (sortChange)="nameSortDir.set($event)">Name</th>
                      <th uiTableHead sortable [sortDirection]="emailSortDir()" (sortChange)="emailSortDir.set($event)">Email</th>
                      <th uiTableHead>Role</th>
                    </tr>
                  </thead>
                  <tbody uiTableBody>
                    @for (user of sortedUsers(); track user.email) {
                      <tr uiTableRow>
                        <td uiTableCell>{{ user.name }}</td>
                        <td uiTableCell>{{ user.email }}</td>
                        <td uiTableCell>{{ user.role }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiTable / UiTableHead" [properties]="apiProperties" />
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class TableShowcase {
  protected readonly apiProperties = API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly stripedHtml = EXAMPLES.striped
  protected readonly sortableHtml = EXAMPLES.sortable

  protected readonly users = SAMPLE_USERS
  protected readonly nameSortDir = signal<SortDirection>(null)
  protected readonly emailSortDir = signal<SortDirection>(null)

  protected readonly sortedUsers = computed(() => {
    const nameDir = this.nameSortDir()
    const emailDir = this.emailSortDir()
    const data = [...SAMPLE_USERS]

    if (nameDir) {
      data.sort((a, b) =>
        nameDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      )
    } else if (emailDir) {
      data.sort((a, b) =>
        emailDir === 'asc'
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email),
      )
    }

    return data
  })
  protected readonly focusTerms = ['striped', 'stickyHeader', 'sortable', 'sortDirection', 'resizable', 'sortChange']
}
