# 46 — Tour Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | —          |
| Completed | —          |

---

## Description

A step-by-step onboarding tour component that highlights target elements with a spotlight overlay and shows a tooltip-style popover with contextual information. The tour dims the entire page except the currently highlighted element, guiding users through a sequence of steps with title, description, and navigation controls. It supports imperative control via `TourService`, keyboard navigation, automatic scrolling, and configurable highlight styling. The directive-based API allows developers to annotate any element as a tour step directly in the template.

## API Design

### Components & Directives

| Name          | Type      | Selector        | Description                                                       |
|---------------|-----------|-----------------|-------------------------------------------------------------------|
| `UiTourStep`  | Directive | `[uiTourStep]`  | Marks a host element as a tour step with title, description, etc. |
| `TourService` | Service   | injectable      | Imperative API to start, stop, navigate, and observe tour state   |

### Inputs & Outputs

#### `UiTourStep` Directive

| Name              | Kind      | Type                                         | Default    | Description                                    |
|-------------------|-----------|----------------------------------------------|------------|------------------------------------------------|
| `uiTourStep`      | `input()` | `string`                                     | required   | Unique step identifier (also the selector)     |
| `tourTitle`       | `input()` | `string`                                     | `''`       | Title displayed in the popover                 |
| `tourDescription` | `input()` | `string`                                     | `''`       | Description text displayed in the popover      |
| `tourPosition`    | `input()` | `'above' \| 'below' \| 'start' \| 'end'`    | `'below'`  | Preferred popover placement relative to target |
| `tourOrder`       | `input()` | `number`                                     | `0`        | Order of this step in the tour sequence        |

#### `TourService`

| Name            | Type                           | Description                                      |
|-----------------|--------------------------------|--------------------------------------------------|
| `start()`       | `(config?: TourConfig) => void`| Starts the tour, optionally overriding config     |
| `stop()`        | `() => void`                   | Stops the tour and cleans up the overlay          |
| `next()`        | `() => void`                   | Advances to the next step                         |
| `prev()`        | `() => void`                   | Goes back to the previous step                    |
| `goTo(stepId)`  | `(stepId: string) => void`     | Jumps to a specific step by its id                |
| `isActive`      | `Signal<boolean>`              | Whether the tour is currently running             |
| `currentStep`   | `Signal<TourStep \| null>`     | The currently active step                         |
| `currentIndex`  | `Signal<number>`               | Zero-based index of the current step              |
| `totalSteps`    | `Signal<number>`               | Total number of registered steps                  |
| `started`       | `OutputEmitterRef<void>`       | Emits when the tour starts                        |
| `ended`         | `OutputEmitterRef<void>`       | Emits when the tour ends                          |
| `stepChanged`   | `OutputEmitterRef<TourStep>`   | Emits when the active step changes                |

### Types

```typescript
type TourPosition = 'above' | 'below' | 'start' | 'end'

interface TourStep {
  id: string
  title: string
  description: string
  position?: TourPosition
  order?: number
}

interface TourConfig {
  steps?: TourStep[]
  backdropOpacity?: number       // default: 0.5
  highlightPadding?: number      // default: 8 (px)
  highlightBorderRadius?: number // default: 4 (px)
  closeOnBackdropClick?: boolean // default: true
  advanceOnTargetClick?: boolean // default: false
  smoothTransitions?: boolean    // default: true
  scrollBehavior?: ScrollBehavior // default: 'smooth'
}
```

### Usage Examples

#### Basic usage with directive

```html
<button uiTourStep="welcome" tourTitle="Welcome" tourDescription="Click here to get started" [tourOrder]="1">
  Get Started
</button>

<nav uiTourStep="navigation" tourTitle="Navigation" tourDescription="Browse through sections here" tourPosition="below" [tourOrder]="2">
  ...
</nav>

<aside uiTourStep="sidebar" tourTitle="Sidebar" tourDescription="Your tools live here" tourPosition="end" [tourOrder]="3">
  ...
</aside>
```

#### Starting the tour from a component

```typescript
export class AppComponent {
  private tour = inject(TourService)

  startOnboarding() {
    this.tour.start({
      backdropOpacity: 0.6,
      highlightPadding: 12,
      closeOnBackdropClick: false,
    })
  }
}
```

#### Jumping to a specific step

```typescript
this.tour.goTo('sidebar')
```

#### Reacting to tour events

```typescript
export class AppComponent {
  private tour = inject(TourService)

  constructor() {
    effect(() => {
      const step = this.tour.currentStep()
      if (step) {
        console.log(`Now on step: ${step.id}`)
      }
    })
  }
}
```

#### Advance on target click

```typescript
this.tour.start({ advanceOnTargetClick: true })
```

## Behavior

### Tour Lifecycle

- `TourService.start()` collects all registered `UiTourStep` directives, sorts them by `tourOrder`, and activates the first step
- The tour creates a full-viewport backdrop overlay with a transparent cutout around the active target element
- A popover is positioned adjacent to the highlighted element using CDK Overlay
- `TourService.stop()` removes the overlay, popover, and resets all state

### Step Navigation

- **Next** button advances to the next step in order; disabled on the last step (replaced by **Finish**)
- **Previous** button goes back one step; hidden on the first step
- **Skip** button stops the tour at any point
- **Finish** button appears on the last step and stops the tour
- Step counter displays "Step X of N" in the popover

### Spotlight Overlay

- A full-viewport overlay (dark semi-transparent backdrop) covers the page
- A cutout in the overlay reveals the target element with configurable padding and border radius
- The cutout is implemented using CSS `clip-path` or SVG mask for smooth rendering
- Smooth CSS transitions animate the cutout position/size when changing steps

### Scrolling

- When a step becomes active, the target element is scrolled into view using `Element.scrollIntoView()` with configurable `ScrollBehavior`
- A short delay is applied after scrolling before positioning the popover to allow layout to settle

### Click-on-Target

- When `advanceOnTargetClick` is `true`, clicking the highlighted target element advances to the next step
- The click event is not prevented — the target's native click handler still fires

### Popover Content

- Title (bold, larger text)
- Description (body text)
- Step counter ("1 of 5")
- Navigation buttons row: Previous | Next/Finish | Skip

### Transitions

- When `smoothTransitions` is `true`, the spotlight cutout animates between steps using CSS transitions (~300ms ease)
- The popover fades out, repositions, then fades in during step changes

## Accessibility

- The backdrop overlay has `aria-hidden="true"` to keep it out of the accessibility tree
- The popover has `role="dialog"` and `aria-modal="false"` (content behind is dimmed but not truly inert)
- The popover has `aria-labelledby` pointing to the title element and `aria-describedby` pointing to the description
- Focus is trapped within the popover when the tour is active (Next, Previous, Skip buttons)
- When a new step activates, focus moves to the popover
- **Escape** key stops the tour
- **ArrowRight** key advances to the next step
- **ArrowLeft** key goes to the previous step
- Navigation buttons have descriptive `aria-label` attributes (e.g., `aria-label="Go to next step"`)
- The step counter is wrapped in an element with `aria-live="polite"` so screen readers announce step changes
- The highlighted target element receives `aria-current="step"` while active
- Color contrast of popover text meets WCAG AA minimums
- Must pass all AXE checks

## Styling

- Host overlay uses `position: fixed; inset: 0` with `z-index` high enough to sit above page content
- CSS custom properties for theming:
  - `--ui-tour-backdrop-color` (default: `rgba(0, 0, 0, 0.5)`)
  - `--ui-tour-highlight-padding` (default: `8px`)
  - `--ui-tour-highlight-border-radius` (default: `4px`)
  - `--ui-tour-popover-bg`
  - `--ui-tour-popover-text-color`
  - `--ui-tour-popover-border-radius` (default: `8px`)
  - `--ui-tour-popover-shadow`
  - `--ui-tour-popover-max-width` (default: `320px`)
  - `--ui-tour-popover-padding` (default: `16px`)
  - `--ui-tour-transition-duration` (default: `300ms`)
  - `--ui-tour-button-bg`
  - `--ui-tour-button-hover-bg`
  - `--ui-tour-button-text-color`
  - `--ui-tour-skip-color`
- Popover has a small arrow/caret pointing toward the highlighted element
- Step counter uses muted text styling
- Skip button is styled as a text link, not a filled button
- Next/Previous/Finish buttons use the primary button style
- Responsive: popover repositions on viewport resize

## File Structure

```
libs/ui/src/lib/tour/
├── tour.ts          # UiTourStep directive, TourService, internal popover component, types (single file)
└── tour.spec.ts     # Unit tests
```

Exported from `libs/ui/src/index.ts`.

## Deliverables

- [ ] Create `UiTourStep` directive in `libs/ui/src/lib/tour/tour.ts`
- [ ] Create `TourService` injectable service in the same file with `start()`, `stop()`, `next()`, `prev()`, `goTo()` methods
- [ ] Implement signal-based state: `isActive`, `currentStep`, `currentIndex`, `totalSteps`
- [ ] Implement service observables: `started`, `ended`, `stepChanged`
- [ ] Create internal spotlight overlay component with full-viewport backdrop and animated cutout
- [ ] Create internal popover component with title, description, step counter, and navigation buttons
- [ ] Position popover using CDK Overlay with fallback positioning
- [ ] Implement automatic scroll-into-view when step activates
- [ ] Add configurable highlight padding and border radius
- [ ] Implement smooth CSS transitions between steps
- [ ] Add click-on-target-to-advance option
- [ ] Add keyboard navigation (ArrowRight, ArrowLeft, Escape)
- [ ] Add focus management: focus popover on step change, trap focus within popover
- [ ] Add accessibility attributes (`role="dialog"`, `aria-labelledby`, `aria-describedby`, `aria-live`, `aria-current`)
- [ ] Style with CSS custom properties for full theming support
- [ ] Write unit tests in `libs/ui/src/lib/tour/tour.spec.ts`
- [ ] Export `UiTourStep`, `TourService`, `TourStep`, `TourConfig`, and `TourPosition` from `libs/ui/src/index.ts`
