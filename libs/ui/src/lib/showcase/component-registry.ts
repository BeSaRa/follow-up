export interface ShowcaseComponentEntry {
  name: string
  slug: string
}

export interface ShowcaseCategory {
  label: string
  components: ShowcaseComponentEntry[]
}

export const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
  {
    label: 'General',
    components: [
      { name: 'Button', slug: 'button' },
      { name: 'Badge', slug: 'badge' },
      { name: 'Chip', slug: 'chip' },
      { name: 'Avatar', slug: 'avatar' },
      { name: 'Divider', slug: 'divider' },
      { name: 'Spinner', slug: 'spinner' },
    ],
  },
  {
    label: 'Layout',
    components: [
      { name: 'Card', slug: 'card' },
      { name: 'Accordion', slug: 'accordion' },
      { name: 'Tabs', slug: 'tabs' },
      { name: 'Drawer', slug: 'drawer' },
      { name: 'Navbar', slug: 'navbar' },
    ],
  },
  {
    label: 'Navigation',
    components: [
      { name: 'Breadcrumb', slug: 'breadcrumb' },
      { name: 'Menu', slug: 'menu' },
      { name: 'Stepper', slug: 'stepper' },
      { name: 'Pagination', slug: 'pagination' },
    ],
  },
  {
    label: 'Data Display',
    components: [
      { name: 'Table', slug: 'table' },
      { name: 'Tree', slug: 'tree' },
      { name: 'Timeline', slug: 'timeline' },
      { name: 'Progress Bar', slug: 'progress-bar' },
      { name: 'Skeleton', slug: 'skeleton' },
    ],
  },
  {
    label: 'Form Controls',
    components: [
      { name: 'Input', slug: 'input' },
      { name: 'Textarea', slug: 'textarea' },
      { name: 'Select', slug: 'select' },
      { name: 'Checkbox', slug: 'checkbox' },
      { name: 'Radio', slug: 'radio' },
      { name: 'Slide Toggle', slug: 'slide-toggle' },
      { name: 'Autocomplete', slug: 'autocomplete' },
      { name: 'Date Picker', slug: 'date-picker' },
      { name: 'Date Range Picker', slug: 'date-range-picker' },
      { name: 'File Upload', slug: 'file-upload' },
    ],
  },
  {
    label: 'Feedback & Overlay',
    components: [
      { name: 'Alert', slug: 'alert' },
      { name: 'Dialog', slug: 'dialog' },
      { name: 'Toast', slug: 'toast' },
      { name: 'Tooltip', slug: 'tooltip' },
      { name: 'Popover', slug: 'popover' },
      { name: 'Bottom Sheet', slug: 'bottom-sheet' },
      { name: 'Dropdown', slug: 'dropdown' },
    ],
  },
]
