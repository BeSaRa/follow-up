import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { UiProgressBar } from '../progress-bar/progress-bar'

export type FileUploadStatus = 'pending' | 'uploading' | 'success' | 'error'

export interface FileValidationError {
  file: File
  reason: 'type' | 'size' | 'count'
  message: string
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  return `${size % 1 === 0 ? size : size.toFixed(1)} ${units[i]}`
}

// ─── UiFileItem ──────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-file-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiProgressBar],
  host: {
    role: 'listitem',
    class: 'flex items-center gap-3 px-3 py-2 rounded-md border border-border',
  },
  template: `
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="text-sm text-foreground truncate">{{ file().name }}</span>
        <span class="text-xs text-foreground-muted shrink-0">{{ formattedSize() }}</span>
      </div>
      @if (status() === 'uploading' && progress() !== null) {
        <ui-progress-bar
          class="mt-1"
          [value]="progress()!"
          variant="primary"
          size="sm"
        />
      }
    </div>
    <div class="flex items-center gap-2 shrink-0">
      @switch (status()) {
        @case ('success') {
          <svg class="size-4 text-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="4,12 10,18 20,6" />
          </svg>
        }
        @case ('error') {
          <svg class="size-4 text-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" stroke="none" />
          </svg>
        }
        @case ('uploading') {
          <svg class="size-4 text-foreground-muted animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
          </svg>
        }
      }
      <button
        type="button"
        class="inline-flex items-center justify-center size-6 rounded hover:bg-border transition-colors"
        [attr.aria-label]="'Remove ' + file().name"
        (click)="removed.emit()"
      >
        <svg class="size-4 text-foreground-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `,
})
export class UiFileItem {
  readonly file = input.required<File>()
  readonly progress = input<number | null>(null)
  readonly status = input<FileUploadStatus>('pending')
  readonly removed = output<void>()

  protected readonly formattedSize = computed(() => formatFileSize(this.file().size))
}

// ─── UiFileList ──────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-file-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'list',
    class: 'block space-y-2',
  },
  template: `<ng-content />`,
})
export class UiFileList {}

// ─── UiFileUpload ────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiFileUpload),
      multi: true,
    },
  ],
  host: {
    role: 'button',
    tabindex: '0',
    '[attr.aria-label]': '"Upload files"',
    '[attr.aria-disabled]': 'disabled() || null',
    '[class]': 'hostClasses()',
    '(click)': 'openFilePicker()',
    '(keydown.enter)': 'openFilePicker()',
    '(keydown.space)': '$event.preventDefault(); openFilePicker()',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave()',
    '(drop)': 'onDrop($event)',
  },
  template: `
    <input
      #fileInput
      type="file"
      class="sr-only"
      [accept]="accept()"
      [multiple]="multiple()"
      [attr.aria-hidden]="true"
      tabindex="-1"
      (change)="onFileInputChange($event)"
    />
    <ng-content>
      <p class="text-sm text-foreground-muted">
        Drag & drop files here, or <strong class="text-foreground">click to browse</strong>
      </p>
    </ng-content>
    <div aria-live="polite" class="sr-only">
      @if (lastError()) {
        {{ lastError() }}
      }
    </div>
  `,
})
export class UiFileUpload implements ControlValueAccessor {
  readonly accept = input('')
  readonly maxFileSize = input(0)
  readonly maxFiles = input(0)
  readonly multiple = input(true)
  readonly disabled = input(false)

  readonly fileAdded = output<File[]>()
  readonly fileRemoved = output<File>()
  readonly validationError = output<FileValidationError>()

  private readonly fileInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fileInput')

  private readonly files = signal<File[]>([])
  protected readonly dragOver = signal(false)
  protected readonly lastError = signal<string | null>(null)

  private onChange: (value: File[]) => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private touched = false

  protected readonly hostClasses = computed(() => {
    const base = 'block border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer select-none'
    const drag = this.dragOver()
      ? 'border-primary bg-primary/5'
      : 'border-border'
    const dis = this.disabled()
      ? 'opacity-50 pointer-events-none'
      : ''

    return `${base} ${drag} ${dis}`
  })

  openFilePicker() {
    if (this.disabled()) return
    this.fileInputRef().nativeElement.click()
  }

  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    this.addFiles(Array.from(input.files))
    input.value = ''
  }

  onDragOver(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    if (this.disabled()) return
    this.dragOver.set(true)
  }

  onDragLeave() {
    this.dragOver.set(false)
  }

  onDrop(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.dragOver.set(false)
    if (this.disabled()) return
    const dt = (event as DragEvent).dataTransfer
    if (!dt?.files?.length) return
    this.addFiles(Array.from(dt.files))
  }

  addFiles(incoming: File[]) {
    this.markAsTouched()
    const valid: File[] = []
    const current = this.files()
    const maxFiles = this.maxFiles()
    const maxSize = this.maxFileSize()
    const acceptStr = this.accept()

    for (const file of incoming) {
      if (acceptStr && !this.matchesAccept(file, acceptStr)) {
        const error: FileValidationError = {
          file,
          reason: 'type',
          message: `File "${file.name}" does not match accepted types: ${acceptStr}`,
        }
        this.lastError.set(error.message)
        this.validationError.emit(error)
        continue
      }

      if (maxSize > 0 && file.size > maxSize) {
        const error: FileValidationError = {
          file,
          reason: 'size',
          message: `File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`,
        }
        this.lastError.set(error.message)
        this.validationError.emit(error)
        continue
      }

      if (maxFiles > 0 && current.length + valid.length >= maxFiles) {
        const error: FileValidationError = {
          file,
          reason: 'count',
          message: `Maximum number of files (${maxFiles}) reached`,
        }
        this.lastError.set(error.message)
        this.validationError.emit(error)
        continue
      }

      valid.push(file)
    }

    if (valid.length === 0) return

    const next = this.multiple()
      ? [...current, ...valid]
      : [valid[0]]

    this.files.set(next)
    this.onChange(next)
    this.fileAdded.emit(valid)
  }

  removeFile(file: File) {
    const next = this.files().filter(f => f !== file)
    this.files.set(next)
    this.onChange(next)
    this.fileRemoved.emit(file)
    this.markAsTouched()
  }

  getFiles(): File[] {
    return this.files()
  }

  // ─── ControlValueAccessor ───

  writeValue(value: File[] | null) {
    this.files.set(value ?? [])
  }

  registerOnChange(fn: (value: File[]) => void) {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }

  // ─── Private ───

  private markAsTouched() {
    if (!this.touched) {
      this.onTouched()
      this.touched = true
    }
  }

  private matchesAccept(file: File, acceptStr: string): boolean {
    const tokens = acceptStr.split(',').map(t => t.trim().toLowerCase())
    const fileName = file.name.toLowerCase()
    const mimeType = file.type.toLowerCase()

    return tokens.some(token => {
      if (token.startsWith('.')) {
        return fileName.endsWith(token)
      }
      if (token.endsWith('/*')) {
        const prefix = token.slice(0, -1)
        return mimeType.startsWith(prefix)
      }
      return mimeType === token
    })
  }
}
