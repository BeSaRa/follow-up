# 32 — Navbar / Toolbar Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A top-level application bar (navbar/toolbar) component for branding, navigation links, and action items. Supports a fixed/sticky position, responsive layout with a mobile hamburger toggle, and named content slots for logo, navigation, and trailing actions.

## API Design

### Components & Directives

| Class | Selector | Type | Role |
|---|---|---|---|
| `UiNavbar` | `ui-navbar` | Component | The top bar container — manages layout and responsive behavior |
| `UiNavbarBrand` | `ui-navbar-brand` | Component | Logo / app name slot on the leading edge |
| `UiNavbarNav` | `ui-navbar-nav` | Component | Navigation links section — collapses into a hamburger menu on small screens |
| `UiNavbarActions` | `ui-navbar-actions` | Component | Trailing actions slot (buttons, avatar, etc.) — always visible |
| `UiNavbarLink` | `a[uiNavbarLink]` | Directive | Styled link inside `UiNavbarNav` with active state support |

### Inputs & Outputs

**UiNavbar**
- `fixed: InputSignal<boolean>` — stick to the top of the viewport (default `false`)
- `elevated: InputSignal<boolean>` — add a bottom border/shadow (default `true`)

**UiNavbarLink**
- `active: InputSignal<boolean>` — whether this link is the current/active route

### Usage Examples

```html
<ui-navbar fixed>
  <ui-navbar-brand>
    <img src="/logo.svg" alt="App Logo" class="h-8" />
    <span class="text-lg font-semibold">FollowUp</span>
  </ui-navbar-brand>

  <ui-navbar-nav>
    <a uiNavbarLink [active]="true" routerLink="/dashboard">Dashboard</a>
    <a uiNavbarLink routerLink="/projects">Projects</a>
    <a uiNavbarLink routerLink="/settings">Settings</a>
  </ui-navbar-nav>

  <ui-navbar-actions>
    <button uiButton variant="ghost" size="sm">
      <svg><!-- notification icon --></svg>
    </button>
    <ui-avatar size="sm" src="/avatar.jpg" alt="User" />
  </ui-navbar-actions>
</ui-navbar>
```

## Behavior

### Responsive

- **Desktop (≥768px):** Brand, nav links, and actions displayed horizontally in a single row
- **Mobile (<768px):** Nav links collapse; a hamburger toggle button appears. Clicking the toggle opens a vertical dropdown/overlay showing the nav links. Actions remain visible in the bar.

### Sticky / Fixed

- When `fixed` is true: `position: fixed; top: 0; left: 0; right: 0; z-index: 40`
- The page content needs a top padding offset — document this in usage notes

### Active Link

- `uiNavbarLink` with `active=true` shows an underline indicator and bolder text color
- Works with `routerLinkActive` for automatic route-based activation

## Accessibility

- Navbar: `role="navigation"`, `aria-label="Main navigation"`
- Hamburger button: `aria-expanded`, `aria-controls` pointing to the nav list, `aria-label="Toggle navigation"`
- Nav links: standard `<a>` elements with `aria-current="page"` on the active link
- Mobile nav panel: focus moves to first link on open, Escape closes and restores focus

## Styling

- Bar: `h-16 bg-surface-raised border-b border-border` (with `shadow-sm` when elevated)
- Brand: `flex items-center gap-2 shrink-0`
- Nav links: `text-sm text-foreground-muted hover:text-foreground transition-colors`
- Active link: `text-foreground font-medium border-b-2 border-primary`
- Hamburger icon: 3-bar SVG, `size-6`
- Mobile panel: `border-b border-border bg-surface-raised shadow-md py-2`

## File Structure

```
libs/ui/src/lib/navbar/
  navbar.ts            # UiNavbar, UiNavbarBrand, UiNavbarNav, UiNavbarActions, UiNavbarLink
  navbar.spec.ts       # Unit tests
```

Export from `libs/ui/src/index.ts`.

## Deliverables

- [x] Create `UiNavbar` component with horizontal layout
- [x] Create `UiNavbarBrand`, `UiNavbarNav`, `UiNavbarActions` content projection slots
- [x] Create `UiNavbarLink` directive with active state styling
- [x] Implement responsive hamburger toggle for mobile viewports
- [x] Support `fixed` and `elevated` modes
- [x] Add ARIA attributes (`role="navigation"`, `aria-expanded`, `aria-current`)
- [x] Write unit tests
- [x] Export all public APIs from `libs/ui/src/index.ts`
- [x] Add navbar demo section to the showcase app
