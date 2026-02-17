import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms'
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
  UiPagination,
  UiInput,
  UiLabel,
  UiFormHint,
  UiFormError,
  UiFormField,
  UiSkeleton,
  UiBreadcrumb,
  UiBreadcrumbItem,
  UiBreadcrumbSeparatorItem,
  UiSlideToggle,
  UiAutocomplete,
  UiAutocompleteOption,
  UiCheckbox,
  UiSelect,
  UiSelectOption,
  UiRadioGroup,
  UiRadioButton,
  UiAvatar,
  UiDivider,
  UiProgressBar,
  UiAccordion,
  UiAccordionItem,
  UiChip,
  UiChipInput,
  UiTextareaAutoResize,
  UiStepper,
  UiStep,
  ToastService,
  UiTooltip,
  UiMenu,
  UiMenuItem,
  UiMenuTrigger,
  UiSubMenuTrigger,
  UiPopover,
  UiPopoverTrigger,
  UiPopoverClose,
  UiCalendar,
  UiDatePicker,
  UiDatePickerInput,
  UiDatePickerToggle,
  UiDateRangePicker,
  UiDateRangeStartInput,
  UiDateRangeEndInput,
  UiDrawer,
  UiDrawerContainer,
  UiDrawerHeader,
  UiDrawerContent,
  UiDrawerFooter,
  UiDrawerClose,
  UiNavbar,
  UiNavbarBrand,
  UiNavbarNav,
  UiNavbarActions,
  UiNavbarLink,
  UiTree,
  UiTreeNode,
  UiTreeNodeToggle,
  UiTreeNodePadding,
  UiFileUpload,
  UiFileList,
  UiFileItem,
  UiBottomSheet,
  UiBottomSheetHeader,
  UiBottomSheetContent,
  UiBottomSheetClose,
  UiTimeline,
  UiTimelineItem,
  UiTimelineDot,
  UiTimelineContent,
  UiTimelineConnector,
} from '@follow-up/ui'
import { CdkTreeNodeDef } from '@angular/cdk/tree'
import type { SortDirection, PageChangeEvent, ToastPosition, DateRange, FileUploadStatus, FileValidationError, BottomSheetSnapPoint } from '@follow-up/ui'
import { AppConfigs } from './constants/app-configs'
import { Endpoints } from './constants/endpoints'

interface FileNode {
  name: string
  children?: FileNode[]
}

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
    UiPagination,
    ReactiveFormsModule,
    UiInput,
    UiLabel,
    UiFormHint,
    UiFormError,
    UiFormField,
    UiSkeleton,
    UiBreadcrumb,
    UiBreadcrumbItem,
    UiBreadcrumbSeparatorItem,
    UiSlideToggle,
    UiAutocomplete,
    UiAutocompleteOption,
    UiCheckbox,
    UiSelect,
    UiSelectOption,
    UiRadioGroup,
    UiRadioButton,
    UiAvatar,
    UiDivider,
    UiProgressBar,
    UiAccordion,
    UiAccordionItem,
    UiChip,
    UiChipInput,
    UiTextareaAutoResize,
    UiStepper,
    UiStep,
    UiTooltip,
    UiMenu,
    UiMenuItem,
    UiMenuTrigger,
    UiSubMenuTrigger,
    UiPopover,
    UiPopoverTrigger,
    UiPopoverClose,
    UiCalendar,
    UiDatePicker,
    UiDatePickerInput,
    UiDatePickerToggle,
    UiDateRangePicker,
    UiDateRangeStartInput,
    UiDateRangeEndInput,
    UiDrawer,
    UiDrawerContainer,
    UiDrawerHeader,
    UiDrawerContent,
    UiDrawerFooter,
    UiDrawerClose,
    UiNavbar,
    UiNavbarBrand,
    UiNavbarNav,
    UiNavbarActions,
    UiNavbarLink,
    UiTree,
    UiTreeNode,
    UiTreeNodeToggle,
    UiTreeNodePadding,
    CdkTreeNodeDef,
    UiFileUpload,
    UiFileList,
    UiFileItem,
    UiBottomSheet,
    UiBottomSheetHeader,
    UiBottomSheetContent,
    UiBottomSheetClose,
    UiTimeline,
    UiTimelineItem,
    UiTimelineDot,
    UiTimelineContent,
    UiTimelineConnector,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private doc = inject(DOCUMENT)
  private dialogService = inject(DialogService)
  private toastService = inject(ToastService)
  service = injectConfigService<AppConfigs>()
  urls = injectUrlService<Endpoints>()

  isDark = signal(false)
  isRtl = signal(false)

  toggleDarkMode() {
    this.isDark.update(v => !v)
    this.doc.documentElement.classList.toggle('dark', this.isDark())
  }

  toggleDirection() {
    this.isRtl.update(v => !v)
    this.doc.documentElement.dir = this.isRtl() ? 'rtl' : 'ltr'
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

  // Pagination demo
  readonly paginationPageIndex = signal(0)
  readonly paginationPageSize = signal(5)

  readonly paginatedTableData = computed(() => {
    const data = this.sortedTableData()
    const start = this.paginationPageIndex() * this.paginationPageSize()
    return data.slice(start, start + this.paginationPageSize())
  })

  onPageChange(event: PageChangeEvent) {
    this.paginationPageIndex.set(event.pageIndex)
    this.paginationPageSize.set(event.pageSize)
  }

  // Form field demo
  readonly demoForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    bio: new FormControl(''),
  })

  // Slide toggle demo
  readonly notificationsToggle = new FormControl(true)
  readonly marketingToggle = new FormControl(false)

  // Autocomplete demo
  readonly fruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Mango', 'Orange', 'Peach', 'Pear', 'Strawberry']
  readonly fruitSearch = signal('')
  readonly filteredFruits = computed(() => {
    const q = this.fruitSearch().toLowerCase()
    return q ? this.fruits.filter(f => f.toLowerCase().includes(q)) : this.fruits
  })

  readonly users = [
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
    { id: 4, name: 'Diana Prince' },
    { id: 5, name: 'Edward Norton' },
  ]
  readonly userSearch = signal('')
  readonly filteredUsers = computed(() => {
    const q = this.userSearch().toLowerCase()
    return q ? this.users.filter(u => u.name.toLowerCase().includes(q)) : this.users
  })
  readonly displayUserName = (user: { name: string }) => user.name

  readonly selectedUserControl = new FormControl()

  // Checkbox demo
  readonly agreeCheckbox = signal(false)
  readonly indeterminateCheckbox = signal(true)
  readonly checkboxFormControl = new FormControl(false)

  // Select demo
  readonly selectedRole = signal<string | null>(null)
  readonly selectedStatus = signal('active')
  readonly selectFormControl = new FormControl('editor')

  // Radio demo
  readonly selectedColor = signal<string | null>(null)
  readonly radioFormControl = new FormControl('medium')

  // Stepper demo
  readonly linearStep1Done = signal(false)
  readonly linearStep2Done = signal(false)

  // Textarea auto-resize demo
  readonly autoResizeControl = new FormControl('')

  // Date picker demo
  readonly datePickerControl = new FormControl<Date | null>(null)
  readonly dateRangeControl = new FormControl<DateRange | null>(null)
  readonly minDate = new Date(2020, 0, 1)
  readonly maxDate = new Date(2030, 11, 31)
  readonly inlineSelectedDate = signal<Date | null>(null)

  // Drawer demo
  readonly drawerStartOpen = signal(false)
  readonly drawerEndOpen = signal(false)
  readonly drawerPushOpen = signal(false)
  readonly drawerNoBackdropOpen = signal(false)

  // Chip demo
  readonly chipTags = signal(['Angular', 'TypeScript', 'RxJS', 'Signals', 'Vite'])
  readonly chipInputTags = signal<string[]>(['Angular', 'TypeScript'])

  removeChipTag(tag: string) {
    this.chipTags.update(tags => tags.filter(t => t !== tag))
  }

  // Toast demo
  readonly toastPosition = signal<ToastPosition>('bottom-end')

  showToastSuccess() {
    this.toastService.success('Your changes have been saved successfully.', {
      title: 'Saved',
      position: this.toastPosition(),
    })
  }

  showToastError() {
    this.toastService.error('Something went wrong. Please try again.', {
      title: 'Error',
      position: this.toastPosition(),
    })
  }

  showToastWarning() {
    this.toastService.warning('Your session will expire in 5 minutes.', {
      title: 'Warning',
      position: this.toastPosition(),
    })
  }

  showToastInfo() {
    this.toastService.info('A new version is available. Refresh to update.', {
      position: this.toastPosition(),
    })
  }

  showToastPersistent() {
    this.toastService.info('This toast will not auto-dismiss. Close it manually.', {
      title: 'Persistent',
      duration: 0,
      position: this.toastPosition(),
    })
  }

  showToastAction() {
    this.toastService.success('File deleted successfully.', {
      title: 'Deleted',
      position: this.toastPosition(),
      action: {
        label: 'Undo',
        callback: () => this.toastService.info('Undo successful!', { position: this.toastPosition() }),
      },
    })
  }

  dismissAllToasts() {
    this.toastService.dismissAll()
  }

  // Tree demo
  readonly fileTree: FileNode[] = [
    {
      name: 'src',
      children: [
        {
          name: 'app',
          children: [
            { name: 'app.ts' },
            { name: 'app.html' },
            { name: 'app.css' },
          ],
        },
        {
          name: 'assets',
          children: [
            { name: 'logo.svg' },
          ],
        },
        { name: 'main.ts' },
        { name: 'styles.css' },
      ],
    },
    {
      name: 'node_modules',
      children: [
        { name: '@angular', children: [] },
        { name: 'rxjs', children: [] },
      ],
    },
    { name: 'package.json' },
    { name: 'tsconfig.json' },
    { name: 'README.md' },
  ]

  readonly getFileChildren = (node: FileNode): FileNode[] => node.children ?? []

  readonly treeSelected = signal<FileNode | null>(null)
  readonly treeMultiSelected = signal<FileNode[]>([])

  onTreeSelect(nodes: FileNode[]) {
    this.treeSelected.set(nodes[0] ?? null)
  }

  onTreeMultiSelect(nodes: FileNode[]) {
    this.treeMultiSelected.set(nodes)
  }

  // Bottom sheet demo
  readonly bottomSheetOpen = signal(false)
  readonly bottomSheetPeekOpen = signal(false)

  // File upload demo
  readonly filesControl = new FormControl<File[]>([], { nonNullable: true })
  readonly uploadFiles = signal<{ file: File, progress: number | null, status: FileUploadStatus }[]>([])
  readonly uploadErrors = signal<string[]>([])

  onFilesAdded(files: File[]) {
    this.uploadFiles.update(existing => [
      ...existing,
      ...files.map(file => ({ file, progress: null, status: 'pending' as FileUploadStatus })),
    ])
  }

  onFileRemoved(file: File) {
    this.uploadFiles.update(list => list.filter(f => f.file !== file))
  }

  onUploadValidationError(error: FileValidationError) {
    this.uploadErrors.update(errors => [...errors, error.message])
    setTimeout(() => this.uploadErrors.update(errors => errors.slice(1)), 4000)
  }

  simulateUpload() {
    this.uploadFiles.update(list =>
      list.map(item =>
        item.status === 'pending'
          ? { ...item, status: 'uploading' as FileUploadStatus, progress: 0 }
          : item,
      ),
    )

    let tick = 0
    const interval = setInterval(() => {
      tick += 20
      this.uploadFiles.update(list =>
        list.map(item => {
          if (item.status !== 'uploading') return item
          if (tick >= 100) return { ...item, progress: 100, status: 'success' as FileUploadStatus }
          return { ...item, progress: tick }
        }),
      )
      if (tick >= 100) clearInterval(interval)
    }, 400)
  }
}
