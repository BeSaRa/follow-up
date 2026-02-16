# 34 — File Upload Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-17 |
| Completed | 2026-02-17 |

---

## Description

A file upload component with a drag-and-drop zone, file browsing, upload progress tracking, and file list management. Supports multiple files, file type/size validation, and integrates with Angular reactive forms via `ControlValueAccessor` (value is a `File[]`). Does **not** include an HTTP upload service — consumers handle the actual upload. The component manages UI state (selected files, validation errors, progress display).

## API Design

### Components & Directives

| Class | Selector | Type | Role |
|---|---|---|---|
| `UiFileUpload` | `ui-file-upload` | Component | Drop zone + file input trigger — `ControlValueAccessor` for `File[]` |
| `UiFileList` | `ui-file-list` | Component | Renders the list of selected files with name, size, progress, and remove button |
| `UiFileItem` | `ui-file-item` | Component | A single file row inside the list — shows name, size, status, and actions |

### Inputs & Outputs

**UiFileUpload**
- `accept: InputSignal<string>` — allowed MIME types / extensions (e.g. `'.pdf,.png,image/*'`)
- `maxFileSize: InputSignal<number>` — max size in bytes per file (default unlimited)
- `maxFiles: InputSignal<number>` — max number of files (default unlimited)
- `multiple: InputSignal<boolean>` — allow multiple file selection (default `true`)
- `disabled: InputSignal<boolean>` — disable the component
- `fileAdded: OutputEmitterRef<File[]>` — emits newly added files
- `fileRemoved: OutputEmitterRef<File>` — emits when a file is removed
- `validationError: OutputEmitterRef<FileValidationError>` — emits when a file fails validation

**UiFileItem**
- `file: InputSignal<File>` (required) — the file to display
- `progress: InputSignal<number | null>` — upload progress 0–100 (null = not uploading)
- `status: InputSignal<FileUploadStatus>` — current status of this file
- `removed: OutputEmitterRef<void>` — emits when remove button is clicked

### Types

```ts
type FileUploadStatus = 'pending' | 'uploading' | 'success' | 'error'

interface FileValidationError {
  file: File
  reason: 'type' | 'size' | 'count'
  message: string
}
```

### Usage Examples

```html
<!-- Basic file upload with reactive form -->
<ui-file-upload
  [formControl]="filesCtrl"
  accept=".pdf,.docx,image/*"
  [maxFileSize]="5 * 1024 * 1024"
  [maxFiles]="10"
  (validationError)="onValidationError($event)"
>
  <p class="text-sm text-foreground-muted">
    Drag & drop files here, or <strong>click to browse</strong>
  </p>
</ui-file-upload>

<!-- File list with progress -->
<ui-file-list>
  @for (file of files(); track file.name) {
    <ui-file-item
      [file]="file"
      [progress]="uploadProgress()[file.name]"
      [status]="uploadStatus()[file.name]"
      (removed)="removeFile(file)"
    />
  }
</ui-file-list>
```

## Behavior

### Drag & Drop

| Trigger | Action |
|---|---|
| Drag files over drop zone | Show visual highlight (dashed border, background change) |
| Drop files | Validate and add to file list, emit `fileAdded` |
| Drag leave | Remove highlight |
| Click drop zone | Open native file picker dialog |

### Validation

Files are validated on drop/select:
1. **Type check** — file MIME type or extension must match `accept`
2. **Size check** — file size must be ≤ `maxFileSize`
3. **Count check** — total files must be ≤ `maxFiles`

Invalid files are rejected and `validationError` is emitted. Valid files are added.

### File Removal

- Each `UiFileItem` has a remove button (X icon)
- Clicking remove emits `fileRemoved` and removes the file from the internal list
- Also updates the `ControlValueAccessor` value

## Accessibility

- Drop zone: `role="button"`, `tabindex="0"`, `aria-label="Upload files"`, activatable with Enter/Space
- Hidden `<input type="file">` triggered by the drop zone
- File list: `role="list"`, file items: `role="listitem"`
- Remove button: `aria-label="Remove <filename>"`
- Progress: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- Validation errors announced via `aria-live="polite"` region

## Styling

- Drop zone: `border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors`
- Drop zone (drag over): `border-primary bg-primary/5`
- Drop zone (disabled): `opacity-50 pointer-events-none`
- File item: `flex items-center gap-3 px-3 py-2 rounded-md border border-border`
- Progress bar: reuse existing `UiProgressBar` inside file item
- Status icons: checkmark (success), X (error), spinner (uploading)

## File Structure

```
libs/ui/src/lib/file-upload/
  file-upload.ts       # UiFileUpload, UiFileList, UiFileItem
  file-upload.spec.ts  # Unit tests
```

Export from `libs/ui/src/index.ts`.

## Deliverables

- [x] Create `UiFileUpload` component with drag-and-drop zone and `ControlValueAccessor`
- [x] Create `UiFileList` component for displaying selected files
- [x] Create `UiFileItem` component with progress bar, status, and remove action
- [x] Implement drag-and-drop event handling with visual feedback
- [x] Implement file validation (type, size, count) with error output
- [x] Support multiple / single file modes
- [x] Add ARIA attributes (`role="button"`, `role="progressbar"`, `aria-live`)
- [x] Write unit tests
- [x] Export all public APIs from `libs/ui/src/index.ts`
- [x] Add file upload demo section to the showcase app
