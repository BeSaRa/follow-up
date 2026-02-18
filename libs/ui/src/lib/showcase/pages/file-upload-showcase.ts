import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core'
import { UiTabs, UiTabList, UiTab, UiTabPanel } from '../../tabs/tabs'
import { ShowcaseExampleViewer } from '../shared/example-viewer'
import { ShowcaseApiTable, type ApiProperty } from '../shared/api-table'
import { ShowcaseStylesTable, type CssCustomProperty } from '../shared/styles-table'
import { UiFileUpload, UiFileList, UiFileItem } from '../../file-upload/file-upload'

const UPLOAD_API_PROPERTIES: ApiProperty[] = [
  {
    name: 'accept',
    type: 'string',
    default: "''",
    description: 'Comma-separated list of accepted file types (e.g. ".pdf,.jpg" or "image/*").',
    kind: 'input',
  },
  {
    name: 'maxFileSize',
    type: 'number',
    default: '0',
    description: 'Maximum file size in bytes. Set to 0 for unlimited.',
    kind: 'input',
  },
  {
    name: 'maxFiles',
    type: 'number',
    default: '0',
    description: 'Maximum number of files allowed. Set to 0 for unlimited.',
    kind: 'input',
  },
  {
    name: 'multiple',
    type: 'boolean',
    default: 'true',
    description: 'Whether multiple files can be selected.',
    kind: 'input',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the file upload is disabled.',
    kind: 'input',
  },
  {
    name: 'fileAdded',
    type: 'File[]',
    default: '—',
    description: 'Emits the array of newly added valid files.',
    kind: 'output',
  },
  {
    name: 'fileRemoved',
    type: 'File',
    default: '—',
    description: 'Emits the file that was removed.',
    kind: 'output',
  },
  {
    name: 'validationError',
    type: 'FileValidationError',
    default: '—',
    description: 'Emits when a file fails validation (type, size, or count).',
    kind: 'output',
  },
]

const ITEM_API_PROPERTIES: ApiProperty[] = [
  {
    name: 'file',
    type: 'File',
    default: '—',
    description: 'The file to display. Required.',
    kind: 'input',
  },
  {
    name: 'progress',
    type: 'number | null',
    default: 'null',
    description: 'Upload progress percentage (0-100). Shows a progress bar when status is uploading.',
    kind: 'input',
  },
  {
    name: 'status',
    type: "'pending' | 'uploading' | 'success' | 'error'",
    default: "'pending'",
    description: 'The current upload status of the file.',
    kind: 'input',
  },
  {
    name: 'removed',
    type: 'void',
    default: '—',
    description: 'Emits when the remove button is clicked.',
    kind: 'output',
  },
]

const CSS_PROPERTIES: CssCustomProperty[] = []

const EXAMPLES = {
  basic: `<ui-file-upload (fileAdded)="onFilesAdded($event)" />

<ui-file-list>
  @for (file of uploadedFiles(); track file.name) {
    <ui-file-item
      [file]="file"
      status="success"
      (removed)="removeFile(file)"
    />
  }
</ui-file-list>`,
  accept: `<ui-file-upload
  accept="image/*"
  [maxFileSize]="5242880"
  [maxFiles]="3"
/>`,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTabs, UiTabList, UiTab, UiTabPanel,
    ShowcaseExampleViewer, ShowcaseApiTable, ShowcaseStylesTable,
    UiFileUpload, UiFileList, UiFileItem,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">File Upload</h1>
        <p class="mt-1 text-foreground-muted">A drag-and-drop file upload zone with validation, file listing, and progress tracking.</p>
      </div>

      <ui-tabs #tabs activeTab="examples">
        <ui-tab-list>
          <ui-tab value="examples" [tabs]="tabs">Examples</ui-tab>
          <ui-tab value="api" [tabs]="tabs">API</ui-tab>
          <ui-tab value="styles" [tabs]="tabs">Styles</ui-tab>
        </ui-tab-list>

        <ui-tab-panel value="examples" [tabs]="tabs">
          <div class="space-y-8 mt-6">
            <showcase-example-viewer
              title="Basic File Upload"
              description="Drag and drop files or click to browse. Uploaded files appear below."
              [htmlCode]="basicHtml"
            >
              <div class="max-w-md space-y-3">
                <ui-file-upload (fileAdded)="onFilesAdded($event)" />

                @if (uploadedFiles().length) {
                  <ui-file-list>
                    @for (file of uploadedFiles(); track file.name) {
                      <ui-file-item
                        [file]="file"
                        status="success"
                        (removed)="removeFile(file)"
                      />
                    }
                  </ui-file-list>
                }
              </div>
            </showcase-example-viewer>

            <showcase-example-viewer
              title="With Validation"
              description="Restrict accepted file types, maximum file size (5 MB), and maximum file count (3)."
              [htmlCode]="acceptHtml"
            >
              <div class="max-w-md">
                <ui-file-upload
                  accept="image/*"
                  [maxFileSize]="5242880"
                  [maxFiles]="3"
                />
              </div>
            </showcase-example-viewer>
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="api" [tabs]="tabs">
          <showcase-api-table componentName="UiFileUpload" [properties]="uploadApiProperties" />
          <div class="mt-8">
            <h2 class="text-lg font-semibold text-foreground mb-2">UiFileItem</h2>
            <showcase-api-table componentName="UiFileItem" [properties]="itemApiProperties" />
          </div>
        </ui-tab-panel>

        <ui-tab-panel value="styles" [tabs]="tabs">
          <showcase-styles-table [properties]="cssProperties" />
        </ui-tab-panel>
      </ui-tabs>
    </div>
  `,
})
export class FileUploadShowcase {
  protected readonly uploadApiProperties = UPLOAD_API_PROPERTIES
  protected readonly itemApiProperties = ITEM_API_PROPERTIES
  protected readonly cssProperties = CSS_PROPERTIES
  protected readonly basicHtml = EXAMPLES.basic
  protected readonly acceptHtml = EXAMPLES.accept

  protected readonly uploadedFiles = signal<File[]>([])

  onFilesAdded(files: File[]) {
    this.uploadedFiles.update(current => [...current, ...files])
  }

  removeFile(file: File) {
    this.uploadedFiles.update(current => current.filter(f => f !== file))
  }
}
