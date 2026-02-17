# 43 — Command Palette Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | —          |
| Completed | —          |

---

## Description

A Command Palette component for the Angular UI library, inspired by tools like VS Code, Linear, and cmdk. It provides a global keyboard-shortcut-activated overlay with a search input, fuzzy-filtered grouped commands, keyboard navigation, nested pages, and recently used / pinned items. The palette is fully accessible with focus trapping and focus restoration on close.

## API Design

### Components & Directives

| Name                 | Selector              | Type      | Description                                      |
|----------------------|-----------------------|-----------|--------------------------------------------------|
| `UiCommandPalette`   | `ui-command-palette`  | Component | Main overlay container with search input          |
| `UiCommandGroup`     | `ui-command-group`    | Component | Groups commands under a heading (section)         |
| `UiCommandItem`      | `ui-command-item`     | Component | Individual selectable command item                |
| `UiCommandEmpty`     | `ui-command-empty`    | Component | Placeholder shown when no results match           |
| `UiCommandSeparator` | `ui-command-separator`| Component | Visual divider between groups or items            |

### Inputs & Outputs

#### UiCommandPalette

| Member        | Kind     | Type                  | Default | Description                                                      |
|---------------|----------|-----------------------|---------|------------------------------------------------------------------|
| `placeholder` | `input`  | `string`              | `''`    | Placeholder text for the search input                            |
| `shortcut`    | `input`  | `string`              | `'k'`  | Key used with Ctrl/Cmd to open the palette                       |
| `open`        | `model`  | `boolean`             | `false` | Two-way binding controlling open/close state                     |
| `selected`    | `output` | `EventEmitter<string>`| —       | Emits the `value` of the selected command item                   |
| `closed`      | `output` | `EventEmitter<void>`  | —       | Emits when the palette closes                                    |

#### UiCommandGroup

| Member    | Kind    | Type     | Default | Description                            |
|-----------|---------|----------|---------|----------------------------------------|
| `heading` | `input` | `string` | `''`    | Section heading displayed above items  |

#### UiCommandItem

| Member     | Kind     | Type       | Default | Description                                                  |
|------------|----------|------------|---------|--------------------------------------------------------------|
| `value`    | `input`  | `string`   | `''`    | Unique identifier emitted on selection                       |
| `keywords` | `input`  | `string[]` | `[]`    | Extra keywords used for fuzzy search matching                |
| `disabled` | `input`  | `boolean`  | `false` | Prevents selection and dims the item                         |
| `pinned`   | `input`  | `boolean`  | `false` | Marks the item as pinned (always shown at top)               |
| `selected` | `output` | `EventEmitter<void>` | — | Emits when this specific item is selected              |

#### UiCommandEmpty

No inputs or outputs. Content-projected slot for empty state messaging.

#### UiCommandSeparator

No inputs or outputs. Renders a visual `<hr>`-style divider.

### Types

```typescript
interface CommandPaletteItem {
  value: string
  label: string
  keywords: string[]
  disabled: boolean
  pinned: boolean
  group: string | null
}

interface CommandPaletteGroup {
  heading: string
  items: CommandPaletteItem[]
}

interface CommandPaletteState {
  query: string
  open: boolean
  activeIndex: number
  pages: string[]
  recentlyUsed: string[]
}
```

### Usage Examples

#### Basic usage

```html
<ui-command-palette placeholder="Type a command..." [shortcut]="'k'" (selected)="onSelect($event)">
  <ui-command-group heading="Actions">
    <ui-command-item value="new-file" [keywords]="['create']">
      New File
    </ui-command-item>
    <ui-command-item value="open-file" [keywords]="['browse']">
      Open File
    </ui-command-item>
  </ui-command-group>

  <ui-command-separator />

  <ui-command-group heading="Navigation">
    <ui-command-item value="go-home">Home</ui-command-item>
    <ui-command-item value="go-settings">Settings</ui-command-item>
  </ui-command-group>

  <ui-command-empty>No results found.</ui-command-empty>
</ui-command-palette>
```

#### With two-way open binding

```html
<button (click)="paletteOpen = true">Open Command Palette</button>

<ui-command-palette [(open)]="paletteOpen" placeholder="Search commands...">
  <ui-command-group heading="Recent">
    <ui-command-item value="recent-1" [pinned]="true">Pinned Command</ui-command-item>
    <ui-command-item value="recent-2">Recently Used</ui-command-item>
  </ui-command-group>
</ui-command-palette>
```

#### Nested pages (drill-in)

```html
<ui-command-palette placeholder="Search...">
  <ui-command-group heading="Teams">
    <ui-command-item value="team-alpha" (selected)="pushPage('alpha')">
      Team Alpha →
    </ui-command-item>
  </ui-command-group>

  <!-- Nested page content rendered conditionally -->
  @if (currentPage() === 'alpha') {
    <ui-command-group heading="Team Alpha Members">
      <ui-command-item value="alice">Alice</ui-command-item>
      <ui-command-item value="bob">Bob</ui-command-item>
    </ui-command-group>
  }
</ui-command-palette>
```

#### Disabled items

```html
<ui-command-palette placeholder="Search...">
  <ui-command-group heading="Actions">
    <ui-command-item value="deploy" [disabled]="true">
      Deploy (requires admin)
    </ui-command-item>
    <ui-command-item value="build">Build Project</ui-command-item>
  </ui-command-group>
</ui-command-palette>
```

## Behavior

### Opening & Closing
- The palette opens via the global keyboard shortcut `Ctrl+K` (Windows/Linux) or `Cmd+K` (macOS). The shortcut key is configurable via the `shortcut` input.
- The palette can also be opened programmatically by setting `open` to `true`.
- Pressing `Escape` closes the palette. If on a nested page, `Escape` first pops back to the parent page; a second `Escape` closes the palette.
- Clicking the backdrop overlay closes the palette.
- On close, focus is restored to the element that was focused before the palette opened.
- The `closed` output emits whenever the palette closes.

### Search & Filtering
- The search input is auto-focused when the palette opens.
- Typing in the search input performs fuzzy filtering across item labels and `keywords`.
- Matching characters in results are highlighted with a `<mark>` element.
- Groups with no matching items are hidden entirely.
- When no items match, the `ui-command-empty` content is displayed.
- The search query resets when the palette closes or when navigating to a nested page.

### Keyboard Navigation
- `ArrowDown` moves the active highlight to the next enabled item.
- `ArrowUp` moves the active highlight to the previous enabled item.
- Navigation wraps around from last to first and first to last.
- `Enter` selects the currently highlighted item, emitting its `value` through the `selected` output.
- `Home` jumps to the first item; `End` jumps to the last item.
- Disabled items are skipped during keyboard navigation.

### Recently Used & Pinned
- When an item is selected, its `value` is stored in an internal recently-used list (persisted in `localStorage` keyed by a configurable storage key).
- Pinned items (`pinned` input set to `true`) always appear at the top of their group.
- Recently used items appear in a "Recent" virtual group at the top of the list when no search query is active.

### Nested Pages
- A command item can navigate into a nested page by calling a `pushPage(pageId)` method exposed on the palette.
- The palette maintains an internal page stack. The current page is exposed as a signal.
- A back button or `Backspace` on an empty search input pops the page stack.

### Backdrop & Overlay
- The palette renders inside a CDK overlay with a semi-transparent backdrop.
- The backdrop intercepts clicks to close the palette.
- The palette is centered horizontally, positioned toward the top of the viewport.

## Accessibility

- The palette container has `role="dialog"` and `aria-modal="true"`.
- The search input has `role="combobox"`, `aria-expanded="true"`, `aria-controls` pointing to the listbox id, and `aria-activedescendant` pointing to the currently highlighted item.
- The results list has `role="listbox"`.
- Each command item has `role="option"` with `aria-selected` reflecting the active state and `aria-disabled` for disabled items.
- Group headings use `role="presentation"` with the heading text in an element referenced by `aria-labelledby` on a wrapping `role="group"`.
- Focus is trapped inside the palette while open using CDK `FocusTrap`.
- Focus is restored to the previously focused element on close using CDK `FocusMonitor` or manual `document.activeElement` tracking.
- The global shortcut is announced via an `aria-keyshortcuts` attribute on the trigger or palette element.
- All interactive elements are reachable via keyboard; no mouse-only interactions exist.
- Color contrast for highlighted matches, disabled items, and backdrop meet WCAG AA minimum ratios.

## Styling

- All components use `ViewEncapsulation.None` for easy theming.
- CSS custom properties (design tokens) for colors, spacing, and typography:
  - `--ui-command-palette-bg` — palette background color
  - `--ui-command-palette-border` — palette border color
  - `--ui-command-palette-shadow` — box shadow
  - `--ui-command-palette-radius` — border radius
  - `--ui-command-palette-max-width` — maximum width (default `640px`)
  - `--ui-command-palette-max-height` — maximum height for results list (default `400px`)
  - `--ui-command-input-height` — search input height
  - `--ui-command-item-height` — item row height
  - `--ui-command-item-bg-active` — active/highlighted item background
  - `--ui-command-item-bg-hover` — hovered item background
  - `--ui-command-item-color-disabled` — disabled item text color
  - `--ui-command-highlight-color` — fuzzy match highlight text color
  - `--ui-command-highlight-bg` — fuzzy match highlight background
  - `--ui-command-backdrop-bg` — backdrop overlay background (default `rgba(0,0,0,0.5)`)
  - `--ui-command-separator-color` — separator line color
  - `--ui-command-group-heading-color` — group heading text color
- BEM-style class names: `.ui-command-palette`, `.ui-command-palette__input`, `.ui-command-palette__list`, `.ui-command-group`, `.ui-command-group__heading`, `.ui-command-item`, `.ui-command-item--active`, `.ui-command-item--disabled`, `.ui-command-separator`, `.ui-command-empty`.
- The palette uses a max-width container centered with auto margins.
- The results area is scrollable with `overflow-y: auto`.
- Smooth scroll behavior keeps the active item in view during keyboard navigation.

## File Structure

```
libs/ui/src/lib/command-palette/
├── command-palette.ts          # All components (UiCommandPalette, UiCommandGroup, UiCommandItem, UiCommandEmpty, UiCommandSeparator)
└── command-palette.spec.ts     # Unit tests
```

Export from `libs/ui/src/index.ts`.

## Deliverables

- [ ] Implement `UiCommandSeparator` component with `ui-command-separator` selector
- [ ] Implement `UiCommandEmpty` component with `ui-command-empty` selector
- [ ] Implement `UiCommandItem` component with `ui-command-item` selector, `value`, `keywords`, `disabled`, and `pinned` inputs
- [ ] Implement `UiCommandGroup` component with `ui-command-group` selector and `heading` input
- [ ] Implement `UiCommandPalette` component with overlay, backdrop, search input, keyboard shortcut, and focus management
- [ ] Implement fuzzy search filtering with highlighted matching characters
- [ ] Implement keyboard navigation (ArrowUp/Down, Enter, Escape, Home, End)
- [ ] Implement nested page navigation with page stack and back behavior
- [ ] Implement recently used tracking with `localStorage` persistence
- [ ] Implement pinned items sorting
- [ ] Implement focus trap and focus restoration
- [ ] Add CSS custom properties for full theming support
- [ ] Add ARIA roles, states, and properties for full accessibility
- [ ] Write unit tests covering rendering, search, keyboard navigation, selection, nested pages, and accessibility
- [ ] Export all components from `libs/ui/src/index.ts`
