# 45 — Image Lightbox Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | —          |
| Completed | —          |

---

## Description

A full-featured Image Lightbox component for the Angular UI library. The lightbox opens a full-screen overlay to display images at large scale, with support for gallery navigation, zoom, pan, swipe gestures, thumbnails, captions, and keyboard controls. It can be triggered declaratively via a directive on any element or imperatively through `LightboxService`.

## API Design

### Components & Directives

| Name                  | Type        | Selector               | Description                                                        |
|-----------------------|-------------|------------------------|--------------------------------------------------------------------|
| `UiLightbox`          | Directive   | `[uiLightbox]`         | Placed on an image or trigger element to open the lightbox on click |
| `UiLightboxGallery`   | Component   | `ui-lightbox-gallery`  | Renders a grid of thumbnails that open the lightbox on click        |
| `LightboxService`     | Service     | —                      | Imperative API to open the lightbox programmatically                |
| `LightboxRef`         | Class       | —                      | Handle returned by `LightboxService.open()` for controlling the lightbox |

### Inputs & Outputs

#### `UiLightbox` Directive

| Name         | Kind   | Type              | Default | Description                              |
|--------------|--------|-------------------|---------|------------------------------------------|
| `uiLightbox` | input  | `LightboxImage[]` | `[]`    | Array of images to display in the lightbox |
| `startIndex` | input  | `number`          | `0`     | Index of the image to show first          |

#### `UiLightboxGallery` Component

| Name         | Kind   | Type              | Default | Description                              |
|--------------|--------|-------------------|---------|------------------------------------------|
| `images`     | input  | `LightboxImage[]` | `[]`    | Array of images to display as thumbnails  |
| `columns`    | input  | `number`          | `3`     | Number of columns in the thumbnail grid   |
| `opened`     | output | `number`          | —       | Emits the index of the image that was opened |

#### `LightboxService`

| Method                                          | Returns       | Description                                |
|-------------------------------------------------|---------------|--------------------------------------------|
| `open(images: LightboxImage[], config?: LightboxConfig)` | `LightboxRef` | Opens the lightbox with the given images and optional configuration |

#### `LightboxRef`

| Member          | Type                    | Description                                   |
|-----------------|-------------------------|-----------------------------------------------|
| `close()`       | `void`                  | Closes the lightbox                            |
| `next()`        | `void`                  | Navigates to the next image                    |
| `prev()`        | `void`                  | Navigates to the previous image                |
| `zoomIn()`      | `void`                  | Zooms in on the current image                  |
| `zoomOut()`     | `void`                  | Zooms out on the current image                 |
| `goTo(index: number)` | `void`            | Navigates to a specific image by index         |
| `afterClosed()` | `Observable<void>`      | Emits when the lightbox is closed              |
| `currentIndex`  | `Signal<number>`        | Signal holding the current image index         |

### Types

```typescript
interface LightboxImage {
  src: string
  alt?: string
  caption?: string
  thumbSrc?: string
}

interface LightboxConfig {
  startIndex?: number
  showThumbnails?: boolean
  showCounter?: boolean
  enableZoom?: boolean
  enableSwipe?: boolean
  backdropClose?: boolean
  animationDuration?: number
}
```

### Usage Examples

#### Declarative — Directive on an image

```html
<img
  [uiLightbox]="galleryImages"
  [startIndex]="0"
  [src]="galleryImages[0].thumbSrc"
  [alt]="galleryImages[0].alt"
/>
```

#### Declarative — Gallery grid

```html
<ui-lightbox-gallery
  [images]="galleryImages"
  [columns]="4"
  (opened)="onImageOpened($event)"
/>
```

#### Imperative — Service API

```typescript
import { LightboxService, LightboxImage } from '@follow-up/ui'

export class PhotoPageComponent {
  private lightbox = inject(LightboxService)

  images: LightboxImage[] = [
    { src: '/photos/1.jpg', alt: 'Sunset', caption: 'A beautiful sunset', thumbSrc: '/photos/1-thumb.jpg' },
    { src: '/photos/2.jpg', alt: 'Mountain', caption: 'Mountain peak', thumbSrc: '/photos/2-thumb.jpg' },
  ]

  openGallery() {
    const ref = this.lightbox.open(this.images, { startIndex: 0, showThumbnails: true })

    ref.afterClosed().subscribe(() => {
      console.log('Lightbox closed')
    })
  }
}
```

## Behavior

### Overlay & Opening
- Opens a full-screen overlay with a dark semi-transparent backdrop
- The image fades/scales in with a smooth animation
- Clicking the backdrop closes the lightbox (configurable via `backdropClose`)
- Body scroll is locked while the lightbox is open

### Gallery Navigation
- Next/previous buttons appear on the left and right sides of the image
- Buttons are hidden when at the first or last image (no wrapping by default)
- Image counter displays "1 of N" in the top area
- Transition between images uses a slide animation

### Zoom
- **Scroll wheel**: zoom in/out centered on the cursor position
- **Pinch gesture**: zoom in/out on touch devices
- **Double-click/double-tap**: toggle between fit-to-screen and 2x zoom
- **+/- keys**: zoom in/out by a fixed step
- Minimum zoom: fit-to-screen; maximum zoom: 5x
- Zoom level resets when navigating to a different image

### Pan
- When zoomed in beyond fit-to-screen, the image can be dragged/panned
- Pan is constrained so the image edges do not move past the viewport center
- Cursor changes to `grab`/`grabbing` while panning

### Swipe (Touch)
- Horizontal swipe navigates between images when at default zoom
- A threshold of 50px determines a valid swipe
- When zoomed in, swipe is treated as pan instead

### Thumbnail Strip
- A horizontal scrollable strip of thumbnail images at the bottom
- The active thumbnail is highlighted
- Clicking a thumbnail navigates to that image
- The strip auto-scrolls to keep the active thumbnail visible
- Thumbnails use `thumbSrc` if provided, otherwise fall back to `src`

### Loading
- A spinner is shown while each image is loading
- Images are lazy-loaded (only the current image plus one on each side are preloaded)
- Failed images show an error placeholder

### Caption
- Caption text is displayed below the image
- If no caption is provided, the caption area is hidden

## Accessibility

- The overlay has `role="dialog"` and `aria-modal="true"`
- The overlay is labelled with `aria-label="Image lightbox"` (or the current image alt text)
- Focus is trapped inside the lightbox while open
- Focus returns to the trigger element when the lightbox closes
- All interactive controls (close, next, prev, zoom) have visible focus indicators
- Keyboard navigation:
  - `ArrowRight` — next image
  - `ArrowLeft` — previous image
  - `Escape` — close the lightbox
  - `+` / `=` — zoom in
  - `-` — zoom out
  - `0` — reset zoom to fit-to-screen
  - `Home` — go to first image
  - `End` — go to last image
- Images have `role="img"` and use `alt` text from `LightboxImage`
- Navigation buttons have `aria-label` attributes (e.g., "Next image", "Previous image", "Close lightbox")
- Image counter is announced via `aria-live="polite"` region
- Meets WCAG AA color contrast for all controls against the dark backdrop
- Must pass all AXE checks

## Styling

- Uses CSS custom properties for theming:
  - `--ui-lightbox-backdrop-bg` — backdrop background color (default: `rgba(0, 0, 0, 0.9)`)
  - `--ui-lightbox-control-color` — color of navigation/close buttons (default: `#ffffff`)
  - `--ui-lightbox-control-bg` — background of navigation buttons (default: `rgba(255, 255, 255, 0.1)`)
  - `--ui-lightbox-control-hover-bg` — hover background (default: `rgba(255, 255, 255, 0.2)`)
  - `--ui-lightbox-caption-color` — caption text color (default: `#ffffff`)
  - `--ui-lightbox-caption-bg` — caption background (default: `rgba(0, 0, 0, 0.6)`)
  - `--ui-lightbox-thumbnail-size` — thumbnail width/height (default: `64px`)
  - `--ui-lightbox-thumbnail-active-border` — active thumbnail border color (default: `#ffffff`)
  - `--ui-lightbox-counter-color` — image counter text color (default: `#ffffffcc`)
  - `--ui-lightbox-spinner-color` — loading spinner color (default: `#ffffff`)
  - `--ui-lightbox-animation-duration` — transition duration (default: `200ms`)
- Gallery grid uses CSS Grid layout
- Responsive: controls adapt for touch/mobile (larger hit targets)
- Thumbnail strip scrolls horizontally and hides scrollbar visually
- Controls fade in/out on mouse activity (auto-hide after 3s of inactivity)

## File Structure

```
libs/ui/src/lib/lightbox/
├── lightbox.ts          # All components, directives, service, types, and ref class
└── lightbox.spec.ts     # Unit tests
```

Exported from `libs/ui/src/index.ts`.

## Deliverables

- [ ] `LightboxImage` interface and `LightboxConfig` interface
- [ ] `LightboxRef` class with `close()`, `next()`, `prev()`, `zoomIn()`, `zoomOut()`, `goTo()`, `afterClosed()`, and `currentIndex` signal
- [ ] `LightboxService` injectable with `open(images, config)` method
- [ ] Internal lightbox overlay component (rendered by the service via CDK overlay or DOM insertion)
- [ ] `UiLightbox` directive with `uiLightbox` and `startIndex` signal inputs
- [ ] `UiLightboxGallery` component with `images`, `columns` inputs and `opened` output
- [ ] Full-screen overlay with dark backdrop and open/close animations
- [ ] Next/previous navigation with slide transition
- [ ] Zoom support: scroll wheel, pinch, double-click, +/- keys
- [ ] Pan support when zoomed in (mouse drag and touch drag)
- [ ] Swipe between images on touch devices
- [ ] Thumbnail strip with active state and auto-scroll
- [ ] Image counter ("1 of N") display
- [ ] Loading spinner for images in progress
- [ ] Caption/description display per image
- [ ] Keyboard navigation (Arrow keys, Escape, +/-, 0, Home, End)
- [ ] Focus trap and focus restoration on close
- [ ] ARIA attributes (`role="dialog"`, `aria-modal`, `aria-label`, `aria-live`)
- [ ] CSS custom properties for theming
- [ ] Unit tests in `lightbox.spec.ts`
- [ ] Export public API from `libs/ui/src/index.ts`
