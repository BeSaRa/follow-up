import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import {
  UiFileUpload,
  UiFileList,
  UiFileItem,
  FileValidationError,
  FileUploadStatus,
} from './file-upload'

// ── Helpers ──────────────────────────────────────────────────────

function createFile(name: string, size: number, type = 'text/plain'): File {
  const blob = new Blob(['x'.repeat(size)], { type })
  return new File([blob], name, { type })
}

function query<T extends HTMLElement>(fixture: ComponentFixture<unknown>, selector: string): T {
  const el = fixture.nativeElement.querySelector(selector) as T | null
  if (!el) throw new Error(`Element not found: ${selector}`)
  return el
}

function queryAll(fixture: ComponentFixture<unknown>, selector: string): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll(selector))
}

function queryOrNull(fixture: ComponentFixture<unknown>, selector: string): HTMLElement | null {
  return fixture.nativeElement.querySelector(selector)
}

function createDragEvent(type: string, files: File[] = []): Event {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'dataTransfer', {
    value: { files, types: ['Files'] },
  })
  Object.defineProperty(event, 'preventDefault', { value: () => {} }) // eslint-disable-line @typescript-eslint/no-empty-function
  Object.defineProperty(event, 'stopPropagation', { value: () => {} }) // eslint-disable-line @typescript-eslint/no-empty-function
  return event
}

// ── UiFileUpload Tests ───────────────────────────────────────────

@Component({
  imports: [UiFileUpload, UiFileList, UiFileItem, ReactiveFormsModule],
  template: `
    <ui-file-upload
      [formControl]="control"
      [accept]="accept()"
      [maxFileSize]="maxFileSize()"
      [maxFiles]="maxFiles()"
      [multiple]="multiple()"
      [disabled]="isDisabled()"
      (fileAdded)="addedFiles = $event"
      (fileRemoved)="removedFile = $event"
      (validationError)="errors.push($event)"
    >
      <p class="custom-content">Drop files here</p>
    </ui-file-upload>
  `,
})
class UploadTestHost {
  control = new FormControl<File[]>([], { nonNullable: true })
  accept = signal('')
  maxFileSize = signal(0)
  maxFiles = signal(0)
  multiple = signal(true)
  isDisabled = signal(false)
  addedFiles: File[] = []
  removedFile: File | null = null
  errors: FileValidationError[] = []
}

describe('UiFileUpload', () => {
  let fixture: ComponentFixture<UploadTestHost>
  let host: UploadTestHost
  let uploadEl: HTMLElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadTestHost],
    }).compileComponents()

    fixture = TestBed.createComponent(UploadTestHost)
    host = fixture.componentInstance
    fixture.detectChanges()
    uploadEl = query(fixture, 'ui-file-upload')
  })

  describe('rendering', () => {
    it('should render the drop zone with role="button"', () => {
      expect(uploadEl.getAttribute('role')).toBe('button')
    })

    it('should have tabindex="0"', () => {
      expect(uploadEl.getAttribute('tabindex')).toBe('0')
    })

    it('should have aria-label', () => {
      expect(uploadEl.getAttribute('aria-label')).toBe('Upload files')
    })

    it('should project custom content', () => {
      expect(queryOrNull(fixture, '.custom-content')).not.toBeNull()
      expect(query(fixture, '.custom-content').textContent).toContain('Drop files here')
    })

    it('should contain a hidden file input', () => {
      const input = query<HTMLInputElement>(fixture, 'input[type="file"]')
      expect(input).not.toBeNull()
      expect(input.getAttribute('aria-hidden')).toBe('true')
    })
  })

  describe('file selection', () => {
    it('should add files via addFiles', () => {
      const file = createFile('test.txt', 100)
      const upload = fixture.debugElement.children[0].componentInstance as UiFileUpload
      upload.addFiles([file])
      fixture.detectChanges()

      expect(host.control.value).toEqual([file])
      expect(host.addedFiles).toEqual([file])
    })

    it('should add multiple files', () => {
      const file1 = createFile('a.txt', 100)
      const file2 = createFile('b.txt', 200)
      const upload = fixture.debugElement.children[0].componentInstance as UiFileUpload
      upload.addFiles([file1, file2])
      fixture.detectChanges()

      expect(host.control.value.length).toBe(2)
    })
  })

  describe('drag and drop', () => {
    it('should add drag-over styling on dragover', () => {
      uploadEl.dispatchEvent(createDragEvent('dragover'))
      fixture.detectChanges()

      expect(uploadEl.className).toContain('border-primary')
    })

    it('should remove drag-over styling on dragleave', () => {
      uploadEl.dispatchEvent(createDragEvent('dragover'))
      fixture.detectChanges()

      uploadEl.dispatchEvent(createDragEvent('dragleave'))
      fixture.detectChanges()

      expect(uploadEl.className).not.toContain('border-primary')
    })

    it('should add files on drop', () => {
      const file = createFile('dropped.txt', 50)
      uploadEl.dispatchEvent(createDragEvent('drop', [file]))
      fixture.detectChanges()

      expect(host.control.value).toEqual([file])
    })

    it('should remove drag-over styling after drop', () => {
      uploadEl.dispatchEvent(createDragEvent('dragover'))
      fixture.detectChanges()

      uploadEl.dispatchEvent(createDragEvent('drop', [createFile('f.txt', 10)]))
      fixture.detectChanges()

      expect(uploadEl.className).not.toContain('border-primary')
    })
  })

  describe('validation', () => {
    it('should reject files with wrong type', () => {
      host.accept.set('.pdf')
      fixture.detectChanges()

      const file = createFile('test.txt', 100, 'text/plain')
      uploadEl.dispatchEvent(createDragEvent('drop', [file]))
      fixture.detectChanges()

      expect(host.errors.length).toBe(1)
      expect(host.errors[0].reason).toBe('type')
      expect(host.control.value.length).toBe(0)
    })

    it('should accept files matching extension', () => {
      host.accept.set('.txt')
      fixture.detectChanges()

      const file = createFile('test.txt', 100, 'text/plain')
      uploadEl.dispatchEvent(createDragEvent('drop', [file]))
      fixture.detectChanges()

      expect(host.errors.length).toBe(0)
      expect(host.control.value.length).toBe(1)
    })

    it('should accept files matching MIME wildcard', () => {
      host.accept.set('image/*')
      fixture.detectChanges()

      const file = createFile('photo.png', 100, 'image/png')
      uploadEl.dispatchEvent(createDragEvent('drop', [file]))
      fixture.detectChanges()

      expect(host.errors.length).toBe(0)
      expect(host.control.value.length).toBe(1)
    })

    it('should reject files exceeding maxFileSize', () => {
      host.maxFileSize.set(50)
      fixture.detectChanges()

      const file = createFile('big.txt', 100)
      uploadEl.dispatchEvent(createDragEvent('drop', [file]))
      fixture.detectChanges()

      expect(host.errors.length).toBe(1)
      expect(host.errors[0].reason).toBe('size')
      expect(host.control.value.length).toBe(0)
    })

    it('should reject files exceeding maxFiles count', () => {
      host.maxFiles.set(1)
      fixture.detectChanges()

      const file1 = createFile('a.txt', 10)
      const file2 = createFile('b.txt', 10)
      uploadEl.dispatchEvent(createDragEvent('drop', [file1, file2]))
      fixture.detectChanges()

      expect(host.control.value.length).toBe(1)
      expect(host.errors.length).toBe(1)
      expect(host.errors[0].reason).toBe('count')
    })
  })

  describe('single file mode', () => {
    it('should replace file when multiple is false', () => {
      host.multiple.set(false)
      fixture.detectChanges()

      const file1 = createFile('first.txt', 10)
      uploadEl.dispatchEvent(createDragEvent('drop', [file1]))
      fixture.detectChanges()
      expect(host.control.value).toEqual([file1])

      const file2 = createFile('second.txt', 20)
      uploadEl.dispatchEvent(createDragEvent('drop', [file2]))
      fixture.detectChanges()
      expect(host.control.value).toEqual([file2])
    })
  })

  describe('file removal', () => {
    it('should remove a file via removeFile', () => {
      const file1 = createFile('a.txt', 10)
      const file2 = createFile('b.txt', 20)
      uploadEl.dispatchEvent(createDragEvent('drop', [file1, file2]))
      fixture.detectChanges()

      const upload = fixture.debugElement.children[0].componentInstance as UiFileUpload
      upload.removeFile(file1)
      fixture.detectChanges()

      expect(host.control.value).toEqual([file2])
      expect(host.removedFile).toBe(file1)
    })
  })

  describe('disabled state', () => {
    it('should apply disabled styling', () => {
      host.isDisabled.set(true)
      fixture.detectChanges()

      expect(uploadEl.className).toContain('opacity-50')
      expect(uploadEl.className).toContain('pointer-events-none')
    })

    it('should set aria-disabled', () => {
      host.isDisabled.set(true)
      fixture.detectChanges()

      expect(uploadEl.getAttribute('aria-disabled')).toBe('true')
    })

    it('should not add files when disabled via drag', () => {
      host.isDisabled.set(true)
      fixture.detectChanges()

      const file = createFile('test.txt', 10)
      uploadEl.dispatchEvent(createDragEvent('drop', [file]))
      fixture.detectChanges()

      expect(host.control.value.length).toBe(0)
    })
  })

  describe('CVA integration', () => {
    it('should update form control value on file add', () => {
      const file = createFile('test.txt', 50)
      uploadEl.dispatchEvent(createDragEvent('drop', [file]))
      fixture.detectChanges()

      expect(host.control.value).toEqual([file])
    })

    it('should accept value written from form control', () => {
      const file = createFile('preset.txt', 30)
      host.control.setValue([file])
      fixture.detectChanges()

      const upload = fixture.debugElement.children[0].componentInstance as UiFileUpload
      expect(upload.getFiles()).toEqual([file])
    })

    it('should mark as touched on first interaction', () => {
      expect(host.control.touched).toBe(false)

      const file = createFile('test.txt', 10)
      uploadEl.dispatchEvent(createDragEvent('drop', [file]))
      fixture.detectChanges()

      expect(host.control.touched).toBe(true)
    })
  })

  describe('aria-live error announcements', () => {
    it('should have an aria-live region', () => {
      const liveRegion = query(fixture, '[aria-live="polite"]')
      expect(liveRegion).not.toBeNull()
    })

    it('should announce validation errors', () => {
      host.maxFileSize.set(10)
      fixture.detectChanges()

      const file = createFile('big.txt', 100)
      uploadEl.dispatchEvent(createDragEvent('drop', [file]))
      fixture.detectChanges()

      const liveRegion = query(fixture, '[aria-live="polite"]')
      expect(liveRegion.textContent).toContain('exceeds maximum size')
    })
  })
})

// ── UiFileItem Tests ─────────────────────────────────────────────

@Component({
  imports: [UiFileList, UiFileItem],
  template: `
    <ui-file-list>
      <ui-file-item
        [file]="file()"
        [progress]="progress()"
        [status]="status()"
        (removed)="removed = true"
      />
    </ui-file-list>
  `,
})
class FileItemTestHost {
  file = signal(createFile('report.pdf', 1048576, 'application/pdf'))
  progress = signal<number | null>(null)
  status = signal<FileUploadStatus>('pending')
  removed = false
}

describe('UiFileItem', () => {
  let fixture: ComponentFixture<FileItemTestHost>
  let host: FileItemTestHost

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileItemTestHost],
    }).compileComponents()

    fixture = TestBed.createComponent(FileItemTestHost)
    host = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should render the file name', () => {
    const item = query(fixture, 'ui-file-item')
    expect(item.textContent).toContain('report.pdf')
  })

  it('should render the file size', () => {
    const item = query(fixture, 'ui-file-item')
    expect(item.textContent).toContain('1 MB')
  })

  it('should have role="listitem"', () => {
    const item = query(fixture, 'ui-file-item')
    expect(item.getAttribute('role')).toBe('listitem')
  })

  it('should show progress bar when uploading', () => {
    host.status.set('uploading')
    host.progress.set(50)
    fixture.detectChanges()

    const progressBar = queryOrNull(fixture, 'ui-progress-bar')
    expect(progressBar).not.toBeNull()
  })

  it('should not show progress bar when pending', () => {
    const progressBar = queryOrNull(fixture, 'ui-progress-bar')
    expect(progressBar).toBeNull()
  })

  it('should show success icon when status is success', () => {
    host.status.set('success')
    fixture.detectChanges()

    const svgs = queryAll(fixture, 'svg.text-success')
    expect(svgs.length).toBe(1)
  })

  it('should show error icon when status is error', () => {
    host.status.set('error')
    fixture.detectChanges()

    const svgs = queryAll(fixture, 'svg.text-error')
    expect(svgs.length).toBe(1)
  })

  it('should show spinner when uploading', () => {
    host.status.set('uploading')
    host.progress.set(25)
    fixture.detectChanges()

    const svgs = queryAll(fixture, 'svg.animate-spin')
    expect(svgs.length).toBe(1)
  })

  it('should have a remove button with aria-label', () => {
    const btn = query<HTMLButtonElement>(fixture, 'button[aria-label="Remove report.pdf"]')
    expect(btn).not.toBeNull()
  })

  it('should emit removed when remove button is clicked', () => {
    const btn = query<HTMLButtonElement>(fixture, 'button[aria-label="Remove report.pdf"]')
    btn.click()
    fixture.detectChanges()

    expect(host.removed).toBe(true)
  })
})

// ── UiFileList Tests ─────────────────────────────────────────────

describe('UiFileList', () => {
  @Component({
    imports: [UiFileList],
    template: `<ui-file-list><div class="child">Item</div></ui-file-list>`,
  })
  class FileListTestHost {}

  let fixture: ComponentFixture<FileListTestHost>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileListTestHost],
    }).compileComponents()

    fixture = TestBed.createComponent(FileListTestHost)
    fixture.detectChanges()
  })

  it('should have role="list"', () => {
    const list = query(fixture, 'ui-file-list')
    expect(list.getAttribute('role')).toBe('list')
  })

  it('should project child content', () => {
    const child = queryOrNull(fixture, '.child')
    expect(child).not.toBeNull()
    expect(child!.textContent).toContain('Item')
  })
})
