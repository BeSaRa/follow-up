# 27 — Tooltip Directive

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A lightweight directive that attaches a floating tooltip to any host element. The tooltip appears on hover and keyboard focus, supports multiple placement directions with automatic fallback positioning via Angular CDK Overlay, and meets WCAG AA accessibility requirements (`role="tooltip"`, `aria-describedby`).

## API Design

### `UiTooltip` (attribute directive)

**Selector:** `[uiTooltip]`

**Inputs:**

| Input               | Type                | Default   | Description                              |
|---------------------|---------------------|-----------|------------------------------------------|
| `uiTooltip`         | `string`            | `''`      | Tooltip text (also the selector)         |
| `uiTooltipPosition` | `TooltipPosition`   | `'above'` | Preferred placement direction            |
| `uiTooltipShowDelay` | `number`           | `200`     | Delay in ms before showing               |
| `uiTooltipHideDelay` | `number`           | `0`       | Delay in ms before hiding                |
| `uiTooltipDisabled` | `boolean`           | `false`   | Disables the tooltip entirely            |

### `TooltipPosition` (type)

`'above' | 'below' | 'start' | 'end'`

Uses logical directions (`start`/`end`) for automatic RTL support.

### Behavior

- **Show:** on `mouseenter` and `focusin` (after `showDelay`)
- **Hide:** on `mouseleave`, `focusout`, and `Escape` key (after `hideDelay`)
- **Positioning:** CDK Overlay `ConnectedPosition` with fallback to the opposite side when the preferred direction overflows the viewport
- **Accessibility:** generates a unique `id`, sets `role="tooltip"` on the overlay, and binds `aria-describedby` on the host element
- **Empty guard:** tooltip is not shown if the text is empty or the directive is disabled
- **Cleanup:** overlay is destroyed on directive destroy

## Architecture

```
Host Element  ─[uiTooltip]─►  UiTooltip (directive)
                                  │
                                  ├─ creates CDK Overlay on show
                                  ├─ attaches UiTooltipComponent via ComponentPortal
                                  └─ destroys overlay on hide / destroy

UiTooltipComponent (internal, not exported)
  └─ small styled container with the tooltip text
  └─ CSS enter/leave animation (fade + scale)
  └─ has the arrow/caret pointing to the host
```

## Visual Layout

```
         ┌─────────────────┐
         │  Tooltip text    │  ← above (default)
         └────────▽────────┘
         ┌──────────────────┐
         │   Host Element   │
         └──────────────────┘
```

## Styling

- Background: `bg-foreground` (dark bg in light mode, light bg in dark mode — inverted)
- Text: `text-background` (inverted foreground)
- Font: `text-xs` with `px-2 py-1`
- Border radius: `rounded-md`
- Shadow: `shadow-md`
- Arrow: small CSS triangle (6px) pointing toward the host, matching bg color
- Max width: `max-w-xs` (20rem) with word wrap
- Animation: fade + slight scale from the placement direction (~100ms)

## Position Fallback Map

| Preferred | Primary                              | Fallback                             |
|-----------|--------------------------------------|--------------------------------------|
| `above`   | center-top → center-bottom (host)    | center-bottom → center-top (host)    |
| `below`   | center-bottom → center-top (host)    | center-top → center-bottom (host)    |
| `start`   | start-center → end-center (host)     | end-center → start-center (host)     |
| `end`     | end-center → start-center (host)     | start-center → end-center (host)     |

## Deliverables

- [x] `UiTooltip` directive in `libs/ui/src/lib/tooltip/tooltip.ts`
- [x] Internal `UiTooltipComponent` for the floating panel (same file, not exported)
- [x] CDK Overlay positioning with fallback for all four directions
- [x] Arrow/caret pointing toward the host element
- [x] Configurable show/hide delays
- [x] `uiTooltipDisabled` input to suppress the tooltip
- [x] Accessibility: `role="tooltip"`, unique `id`, `aria-describedby` on host
- [x] Keyboard dismiss on `Escape`
- [x] CSS fade + scale enter/leave animation
- [x] Export `UiTooltip` and `TooltipPosition` type from `@follow-up/ui`
- [x] Unit tests in `libs/ui/src/lib/tooltip/tooltip.spec.ts`
- [x] Add to showcase page with position demos and disabled state
