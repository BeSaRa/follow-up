# 30 — Date Picker Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A full-featured date picker component for the UI library. Supports single date and date range selection, calendar popup via CDK Overlay (attached to an input), and inline calendar display. Includes month/year navigation, min/max date constraints, disabled dates, keyboard navigation, and a today button. Integrates with Angular reactive forms via `ControlValueAccessor`.

## API Design

### Components & Directives

| Class | Selector | Type | Role |
|---|---|---|---|
| `UiCalendar` | `ui-calendar` | Component | Inline calendar engine — days/months/years views, keyboard nav, range highlight |
| `UiDatePicker` | `ui-date-picker` | Component | Popup overlay wrapping `UiCalendar`, `ControlValueAccessor` for single `Date` |
| `UiDatePickerInput` | `input[uiDatePickerInput]` | Directive | Parses/formats date text on an `<input>`, bridges with overlay trigger |
| `UiDatePickerToggle` | `ui-date-picker-toggle` | Component | Calendar icon button to toggle the picker open/closed |
| `UiDateRangePicker` | `ui-date-range-picker` | Component | Popup overlay for date range, `ControlValueAccessor` for `DateRange` |
| `UiDateRangeStartInput` | `input[uiDateRangeStart]` | Directive | Start date input parsing/formatting |
| `UiDateRangeEndInput` | `input[uiDateRangeEnd]` | Directive | End date input parsing/formatting |

### Inputs & Outputs

**UiCalendar**
- `selected: ModelSignal<Date | null>` — selected date (two-way binding via `selectedChange`)
- `startDate: InputSignal<Date | null>` — range start (for highlighting)
- `endDate: InputSignal<Date | null>` — range end (for highlighting)
- `min: InputSignal<Date | null>` — minimum selectable date
- `max: InputSignal<Date | null>` — maximum selectable date
- `dateFilter: InputSignal<((date: Date) => boolean) | null>` — predicate to disable arbitrary dates
- `startAt: InputSignal<Date | null>` — initial focused month/date
- `monthChange: OutputEmitterRef<Date>` — emits when viewed month changes

**UiDatePicker**
- `value: ModelSignal<Date | null>` — selected date
- `placeholder: InputSignal<string>` — input placeholder (default `'MM/DD/YYYY'`)
- `min`, `max`, `dateFilter`, `startAt` — passed through to `UiCalendar`
- `disabled: InputSignal<boolean>` — disables the picker

**UiDateRangePicker**
- `min`, `max`, `dateFilter`, `disabled` — same as single picker
- CVA value shape: `{ start: Date | null, end: Date | null } | null`

### Types

```ts
type CalendarView = 'days' | 'months' | 'years'

interface DateRange {
  start: Date | null
  end: Date | null
}

interface CalendarCell {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}
```

### Usage Examples

```html
<!-- Single date picker with reactive form -->
<ui-date-picker [min]="minDate" [max]="maxDate" [formControl]="dateCtrl">
  <input uiDatePickerInput placeholder="Pick a date" />
  <ui-date-picker-toggle />
</ui-date-picker>

<!-- Date range picker -->
<ui-date-range-picker [formControl]="rangeCtrl">
  <input uiDateRangeStart placeholder="Start date" />
  <input uiDateRangeEnd placeholder="End date" />
  <ui-date-picker-toggle />
</ui-date-range-picker>

<!-- Inline calendar (no overlay) -->
<ui-calendar
  [selected]="selectedDate()"
  (selectedChange)="selectedDate.set($event)"
/>
```

## Behavior

### Calendar Views

| View | Layout | Navigation |
|---|---|---|
| Days | 7×6 grid (always 42 cells) | Prev/next month, click header → months view |
| Months | 3×4 grid (12 months) | Prev/next year, click header → years view |
| Years | 4×6 grid (24 years) | Prev/next 24-year range, click header → days view |

### Opening / Closing

| Trigger | Action |
|---|---|
| Click toggle button | Toggle overlay |
| Enter / ArrowDown in input | Open overlay |
| Escape | Close overlay, restore focus to input |
| Click outside | Close overlay |
| Select a date (single picker) | Close overlay |
| Select end date (range picker) | Close overlay |

### Range Selection Flow

1. First click → sets start date, calendar stays open
2. Second click → sets end date, closes calendar
3. If end date is before start date → automatically swapped

### Keyboard Navigation (Days View)

| Key | Action |
|---|---|
| ArrowLeft / ArrowRight | Move focus by 1 day |
| ArrowUp / ArrowDown | Move focus by 1 week |
| Home / End | First / last day of month |
| PageUp / PageDown | Previous / next month |
| Shift+PageUp / Shift+PageDown | Previous / next year |
| Enter / Space | Select focused date |

### RTL Support

- Navigation arrows (prev/next) stay in fixed positions (`dir="ltr"` on nav header) — time flows left-to-right universally
- Range border radius uses logical properties (`rounded-s-md` / `rounded-e-md`) — flips correctly in RTL

## Accessibility

- Calendar grid: `role="grid"`, rows `role="row"`, cells `role="gridcell"`
- Day cell labels: `aria-label="Sunday, February 16, 2026"` via `Intl.DateTimeFormat`
- Selected state: `aria-selected="true"` on selected date(s)
- Disabled dates: `aria-disabled="true"`, `disabled` attribute
- Today: `aria-current="date"`
- Overlay panel: `role="dialog"`, `aria-modal="true"`, `aria-label`
- Input: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`
- Toggle button: `aria-label="Toggle calendar"`
- Month change announcements: `aria-live="polite"` region
- Focus restoration to input on close

## Styling

- Calendar panel: `rounded-md border border-border bg-surface-raised p-3 shadow-md`
- Day cells: `size-9`, selected = `bg-primary text-primary-foreground`, range = `bg-primary/10`, today = `font-bold ring-1 ring-border`
- Entry animation: scale + fade via CSS keyframes (100ms ease-out)
- Input: matches existing `UiInput` styling

## File Structure

```
libs/ui/src/lib/date-picker/
  date-utils.ts                 # Pure date helper functions (18 functions)
  calendar.ts                   # UiCalendar component
  date-picker.ts                # UiDatePicker, UiDatePickerInput, UiDatePickerToggle
  date-range-picker.ts          # UiDateRangePicker, UiDateRangeStartInput, UiDateRangeEndInput
  calendar.spec.ts              # 24 tests
  date-picker.spec.ts           # 18 tests
  date-range-picker.spec.ts     # 17 tests
```

Exported from `libs/ui/src/index.ts`.

## Deliverables

- [x] `UiCalendar` component with month grid, navigation, today button
- [x] Year/month jump view inside calendar (months 3×4, years 4×6)
- [x] Keyboard navigation and full ARIA support
- [x] `min`, `max`, and `dateFilter` constraint inputs
- [x] `UiDatePicker` with CDK Overlay popup and `ControlValueAccessor`
- [x] `UiDatePickerInput` directive for input parsing/formatting
- [x] `UiDatePickerToggle` component with calendar icon
- [x] `UiDateRangePicker` with start/end inputs and range highlight
- [x] `UiDateRangeStartInput` and `UiDateRangeEndInput` directives
- [x] RTL support (fixed nav arrows, logical border radius)
- [x] Unit tests for all components and directives (59 tests)
- [x] Export all public API from `libs/ui/src/index.ts`
- [x] Add date picker demo sections to the showcase app
