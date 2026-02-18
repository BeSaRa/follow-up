import { Route } from '@angular/router'
import { ShowcaseLayout } from './showcase-layout'

export const showcaseRoutes: Route[] = [
  {
    path: '',
    component: ShowcaseLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./showcase-home').then(m => m.ShowcaseHome),
      },
      // General
      {
        path: 'button',
        loadComponent: () => import('./pages/button-showcase').then(m => m.ButtonShowcase),
      },
      {
        path: 'badge',
        loadComponent: () => import('./pages/badge-showcase').then(m => m.BadgeShowcase),
      },
      {
        path: 'chip',
        loadComponent: () => import('./pages/chip-showcase').then(m => m.ChipShowcase),
      },
      {
        path: 'avatar',
        loadComponent: () => import('./pages/avatar-showcase').then(m => m.AvatarShowcase),
      },
      {
        path: 'divider',
        loadComponent: () => import('./pages/divider-showcase').then(m => m.DividerShowcase),
      },
      {
        path: 'spinner',
        loadComponent: () => import('./pages/spinner-showcase').then(m => m.SpinnerShowcase),
      },
      // Layout
      {
        path: 'card',
        loadComponent: () => import('./pages/card-showcase').then(m => m.CardShowcase),
      },
      {
        path: 'accordion',
        loadComponent: () => import('./pages/accordion-showcase').then(m => m.AccordionShowcase),
      },
      {
        path: 'tabs',
        loadComponent: () => import('./pages/tabs-showcase').then(m => m.TabsShowcase),
      },
      {
        path: 'drawer',
        loadComponent: () => import('./pages/drawer-showcase').then(m => m.DrawerShowcase),
      },
      {
        path: 'navbar',
        loadComponent: () => import('./pages/navbar-showcase').then(m => m.NavbarShowcase),
      },
      // Navigation
      {
        path: 'breadcrumb',
        loadComponent: () => import('./pages/breadcrumb-showcase').then(m => m.BreadcrumbShowcase),
      },
      {
        path: 'menu',
        loadComponent: () => import('./pages/menu-showcase').then(m => m.MenuShowcase),
      },
      {
        path: 'stepper',
        loadComponent: () => import('./pages/stepper-showcase').then(m => m.StepperShowcase),
      },
      {
        path: 'pagination',
        loadComponent: () => import('./pages/pagination-showcase').then(m => m.PaginationShowcase),
      },
      // Data Display
      {
        path: 'table',
        loadComponent: () => import('./pages/table-showcase').then(m => m.TableShowcase),
      },
      {
        path: 'tree',
        loadComponent: () => import('./pages/tree-showcase').then(m => m.TreeShowcase),
      },
      {
        path: 'timeline',
        loadComponent: () => import('./pages/timeline-showcase').then(m => m.TimelineShowcase),
      },
      {
        path: 'progress-bar',
        loadComponent: () => import('./pages/progress-bar-showcase').then(m => m.ProgressBarShowcase),
      },
      {
        path: 'skeleton',
        loadComponent: () => import('./pages/skeleton-showcase').then(m => m.SkeletonShowcase),
      },
      // Form Controls
      {
        path: 'input',
        loadComponent: () => import('./pages/input-showcase').then(m => m.InputShowcase),
      },
      {
        path: 'textarea',
        loadComponent: () => import('./pages/textarea-showcase').then(m => m.TextareaShowcase),
      },
      {
        path: 'select',
        loadComponent: () => import('./pages/select-showcase').then(m => m.SelectShowcase),
      },
      {
        path: 'checkbox',
        loadComponent: () => import('./pages/checkbox-showcase').then(m => m.CheckboxShowcase),
      },
      {
        path: 'radio',
        loadComponent: () => import('./pages/radio-showcase').then(m => m.RadioShowcase),
      },
      {
        path: 'slide-toggle',
        loadComponent: () => import('./pages/slide-toggle-showcase').then(m => m.SlideToggleShowcase),
      },
      {
        path: 'autocomplete',
        loadComponent: () => import('./pages/autocomplete-showcase').then(m => m.AutocompleteShowcase),
      },
      {
        path: 'date-picker',
        loadComponent: () => import('./pages/date-picker-showcase').then(m => m.DatePickerShowcase),
      },
      {
        path: 'date-range-picker',
        loadComponent: () => import('./pages/date-range-picker-showcase').then(m => m.DateRangePickerShowcase),
      },
      {
        path: 'file-upload',
        loadComponent: () => import('./pages/file-upload-showcase').then(m => m.FileUploadShowcase),
      },
      // Feedback & Overlay
      {
        path: 'alert',
        loadComponent: () => import('./pages/alert-showcase').then(m => m.AlertShowcase),
      },
      {
        path: 'dialog',
        loadComponent: () => import('./pages/dialog-showcase').then(m => m.DialogShowcase),
      },
      {
        path: 'toast',
        loadComponent: () => import('./pages/toast-showcase').then(m => m.ToastShowcase),
      },
      {
        path: 'tooltip',
        loadComponent: () => import('./pages/tooltip-showcase').then(m => m.TooltipShowcase),
      },
      {
        path: 'popover',
        loadComponent: () => import('./pages/popover-showcase').then(m => m.PopoverShowcase),
      },
      {
        path: 'bottom-sheet',
        loadComponent: () => import('./pages/bottom-sheet-showcase').then(m => m.BottomSheetShowcase),
      },
      {
        path: 'dropdown',
        loadComponent: () => import('./pages/dropdown-showcase').then(m => m.DropdownShowcase),
      },
    ],
  },
]
