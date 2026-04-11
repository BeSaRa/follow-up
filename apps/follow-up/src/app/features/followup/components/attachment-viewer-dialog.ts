import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { APP_ICONS } from '../../../constants/icons'

export interface AttachmentViewerDialogData {
  title: string
  type: string
  content: string
}

@Component({
  selector: 'app-attachment-viewer-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
  template: `
    <div class="flex h-[85vh] w-[80rem] max-w-full flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div class="flex min-w-0 items-center gap-3">
          <h2 class="truncate text-lg font-semibold text-foreground">{{ data.title }}</h2>
          <span class="shrink-0 text-xs text-foreground-muted">{{ data.type }}</span>
        </div>
        <button
          type="button"
          class="text-foreground-muted transition-colors hover:text-foreground"
          (click)="dialogRef.close()"
        >
          <mat-icon [svgIcon]="icons.CLOSE" class="text-xl! size-5! leading-5!" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-auto">
        <iframe
          class="h-full w-full"
          [src]="documentUrl()"
          title="Attachment preview"
        ></iframe>
      </div>
    </div>
  `,
})
export class AttachmentViewerDialog {
  readonly dialogRef = inject<MatDialogRef<AttachmentViewerDialog>>(MatDialogRef)
  readonly data = inject<AttachmentViewerDialogData>(MAT_DIALOG_DATA)
  private readonly sanitizer = inject(DomSanitizer)
  readonly icons = APP_ICONS

  readonly documentUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:application/pdf;base64,${this.data.content}`,
    ),
  )
}
