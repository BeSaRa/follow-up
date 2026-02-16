# 19 — Avatar Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A circular avatar component for displaying user images with automatic fallback to initials when no image is available or the image fails to load. Supports an optional status indicator dot (online, offline, busy, away). Follows the project's signal-based, OnPush patterns.

## API Design

### `UiAvatar` (component, selector: `ui-avatar`)

**Inputs:**
- `src: string` — image URL (optional)
- `alt: string` — alt text for the image (default: `''`)
- `initials: string` — fallback text when no image (1-2 characters, default: `''`)
- `size: 'sm' | 'md' | 'lg'` — avatar diameter (default: `'md'`; sm=32px, md=40px, lg=56px)
- `status: 'online' | 'offline' | 'busy' | 'away' | null` — status indicator dot (default: `null`)

**Behavior:**
- Shows `<img>` when `src` is provided and loads successfully
- Falls back to initials (centered, uppercase) on missing or broken image
- Falls back to a generic user SVG icon when neither `src` nor `initials` is provided
- Status dot positioned at bottom-end corner (RTL-aware via `end-0`)
- Circular shape via `rounded-full`, `overflow-hidden`

## Visual Layout

```
  ┌─────┐
  │     │   ← image or initials on colored bg
  │ AJ  │
  └───●─┘   ← optional status dot (bottom-end)

Sizes: sm (32px)  md (40px)  lg (56px)
```

## Deliverables

- [x] `UiAvatar` component in `libs/ui/src/lib/avatar/avatar.ts`
- [x] Image display with error fallback to initials
- [x] Initials fallback with background color
- [x] Generic user icon fallback when no src or initials
- [x] Size variants (`sm`, `md`, `lg`)
- [x] Optional status indicator dot (`online`, `offline`, `busy`, `away`)
- [x] RTL support (status dot uses logical positioning)
- [x] Export `UiAvatar`, `AvatarSize`, `AvatarStatus` from `@follow-up/ui`
- [x] Add to showcase page with image, initials, fallback icon, sizes, and status demos
