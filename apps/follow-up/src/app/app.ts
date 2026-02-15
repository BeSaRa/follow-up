import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { injectConfigService, injectUrlService } from '@follow-up/core'
import {
  UiButton,
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
  UiCardContent,
  UiCardFooter,
  UiBadge,
  UiSpinner,
  UiAlert,
  UiAlertTitle,
  UiAlertDescription,
  UiTabs,
  UiTabList,
  UiTab,
  UiTabPanel,
  DialogService,
  UiDropdownTrigger,
  UiDropdownMenu,
  UiDropdownItem,
  UiTable,
  UiTableHeader,
  UiTableBody,
  UiTableRow,
  UiTableHead,
  UiTableCell,
} from '@follow-up/ui'
import type { SortDirection } from '@follow-up/ui'
import { AppConfigs } from './constants/app-configs'
import { Endpoints } from './constants/endpoints'

@Component({
  imports: [
    UiButton,
    UiCard,
    UiCardHeader,
    UiCardTitle,
    UiCardDescription,
    UiCardContent,
    UiCardFooter,
    UiBadge,
    UiSpinner,
    UiAlert,
    UiAlertTitle,
    UiAlertDescription,
    UiTabs,
    UiTabList,
    UiTab,
    UiTabPanel,
    UiDropdownTrigger,
    UiDropdownMenu,
    UiDropdownItem,
    UiTable,
    UiTableHeader,
    UiTableBody,

    UiTableRow,
    UiTableHead,
    UiTableCell,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private doc = inject(DOCUMENT)
  private dialogService = inject(DialogService)
  service = injectConfigService<AppConfigs>()
  urls = injectUrlService<Endpoints>()

  isDark = signal(false)

  toggleDarkMode() {
    this.isDark.update(v => !v)
    this.doc.documentElement.classList.toggle('dark', this.isDark())
  }

  openConfirm() {
    this.dialogService.confirm('Are you sure you want to proceed?', 'Please Confirm')
  }

  openError() {
    this.dialogService.error('Something went wrong. Please try again later.')
  }

  openSuccess() {
    this.dialogService.success('Your changes have been saved successfully.')
  }

  openInfo() {
    this.dialogService.info('A new version is available. Refresh to update.')
  }

  openWarning() {
    this.dialogService.warning('Your session will expire in 5 minutes.')
  }

  // Table demo
  readonly tableData = signal([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', status: 'Active' },
    { id: 5, name: 'Edward Norton', email: 'edward@example.com', role: 'Admin', status: 'Active' },
    { id: 6, name: 'Fiona Apple', email: 'fiona@example.com', role: 'Viewer', status: 'Inactive' },
    { id: 7, name: 'George Lucas', email: 'george@example.com', role: 'Editor', status: 'Active' },
    { id: 8, name: 'Hannah Montana', email: 'hannah@example.com', role: 'Viewer', status: 'Active' },
    { id: 9, name: 'Ivan Drago', email: 'ivan@example.com', role: 'Admin', status: 'Inactive' },
    { id: 10, name: 'Julia Roberts', email: 'julia@example.com', role: 'Editor', status: 'Active' },
    { id: 11, name: 'Kevin Hart', email: 'kevin@example.com', role: 'Viewer', status: 'Active' },
    { id: 12, name: 'Laura Palmer', email: 'laura@example.com', role: 'Admin', status: 'Inactive' },
  ])

  readonly nameSort = signal<SortDirection>(null)
  readonly statusSort = signal<SortDirection>(null)

  readonly sortedTableData = computed(() => {
    const data = [...this.tableData()]
    const nameSortDir = this.nameSort()
    const statusSortDir = this.statusSort()

    if (nameSortDir) {
      data.sort((a, b) =>
        nameSortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      )
    } else if (statusSortDir) {
      data.sort((a, b) =>
        statusSortDir === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status),
      )
    }

    return data
  })

  onSortName(direction: SortDirection) {
    this.nameSort.set(direction)
    this.statusSort.set(null)
  }

  onSortStatus(direction: SortDirection) {
    this.statusSort.set(direction)
    this.nameSort.set(null)
  }
}
