# 47 — Component Showcase

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-18 |
| Started   | 2026-02-18 |
| Completed | 2026-02-18 |

---

## Description

A full showcase / documentation site inside the UI library. Sidebar with grouped components, each page has 3 tabs (Examples, API, Styles) with live demos, Shiki-highlighted copyable code blocks, and CSS token docs. All routes lazy-loaded at `/showcase/{component-slug}`.

## Deliverables

- [x] Install shiki dependency
- [x] Create shared infrastructure (ShikiService, CodeBlock, ExampleViewer, ApiTable, StylesTable)
- [x] Create ShowcaseLayout with collapsible grouped sidebar
- [x] Create ShowcaseHome landing page
- [x] Create component registry with 6 categories
- [x] Create showcase routes and wire to app
- [x] Create General pages (6): Button, Badge, Chip, Avatar, Divider, Spinner
- [x] Create Layout pages (5): Card, Accordion, Tabs, Drawer, Navbar
- [x] Create Navigation pages (4): Breadcrumb, Menu, Stepper, Pagination
- [x] Create Data Display pages (5): Table, Tree, Timeline, Progress Bar, Skeleton
- [x] Create Form Controls pages (10): Input, Textarea, Select, Checkbox, Radio, Slide Toggle, Autocomplete, Date Picker, Date Range Picker, File Upload
- [x] Create Feedback & Overlay pages (7): Alert, Dialog, Toast, Tooltip, Popover, Bottom Sheet, Dropdown
- [x] Export showcaseRoutes from UI lib index
- [x] Update CLAUDE.md with showcase rule
- [x] Lint and build pass
