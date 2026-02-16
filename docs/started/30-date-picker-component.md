# 30 — Date Picker Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | —          |

---

## Description

A full-featured date picker component for the UI library. Supports single date and date range selection, calendar popup via CDK Overlay (attached to an input), and inline calendar display. Includes month/year navigation, min/max date constraints, disabled dates, keyboard navigation, and a today button. Integrates with Angular reactive forms via `ControlValueAccessor`.

## Components & Directives

### `UiCalendar`
Inline calendar component — the core rendering engine shared by all modes.
- Month grid with day cells
- Month/year navigation (prev/next month, jump to year/month)
- Today button to jump to current date
- Highlights today, selected date(s), and range
- Keyboard navigation (arrow keys, Enter, Escape, Home, End)
- `min` / `max` date inputs to constrain selectable range
- `dateFilter` input — predicate function to disable arbitrary dates
- `startAt` input — initial focused date when calendar opens
- Emits `selectedChange` on date pick

### `UiDatePicker`
Popup date picker wrapping `UiCalendar` in a CDK Overlay.
- Opens overlay panel anchored to the trigger input
- Closes on date selection, Escape, or outside click
- `ControlValueAccessor` for reactive forms (single `Date` value)
- `placeholder`, `min`, `max`, `dateFilter`, `startAt` inputs
- Toggle button (calendar icon) to open/close

### `UiDateRangePicker`
Date range variant — two inputs (start / end) sharing one calendar overlay.
- `ControlValueAccessor` emitting `{ start: Date, end: Date }` (or `null`)
- Visual range highlight in the calendar between start and end
- Same constraint inputs as single picker (`min`, `max`, `dateFilter`)

### `UiDatePickerInput` (directive)
Attribute directive applied to `<input>` elements.
- Parses and formats date text (locale-aware)
- Validates input against min/max and dateFilter
- Bridges the input with the overlay trigger

## Accessibility
- Full keyboard navigation inside the calendar grid (arrow keys move focus, Enter selects, Escape closes)
- ARIA roles: `grid`, `gridcell`, `button` for navigation
- `aria-label` on each day cell (e.g. "February 16, 2026")
- `aria-selected` on currently selected date(s)
- `aria-disabled` on constrained/disabled dates
- Focus trap inside the overlay when open
- Screen-reader live region announcing month changes

## Deliverables

- [ ] `UiCalendar` component with month grid, navigation, today button
- [ ] Year/month jump view inside calendar
- [ ] Keyboard navigation and full ARIA support
- [ ] `min`, `max`, and `dateFilter` constraint inputs
- [ ] `UiDatePicker` with CDK Overlay popup and `ControlValueAccessor`
- [ ] `UiDatePickerInput` directive for input parsing/formatting
- [ ] `UiDateRangePicker` with start/end inputs and range highlight
- [ ] Unit tests for all components and directives
- [ ] Export all public API from `libs/ui/src/index.ts`
