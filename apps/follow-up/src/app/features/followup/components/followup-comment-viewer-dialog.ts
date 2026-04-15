import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import { APP_ICONS } from '../../../constants/icons'

export interface FollowupCommentViewerDialogData {
  title?: string
  comment: string
}

@Component({
  selector: 'app-followup-comment-viewer-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, MatIcon],
  template: `
    <div class="flex w-[36rem] max-w-full flex-col">
      <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <h2 class="truncate text-lg font-semibold text-foreground">
          {{ data.title ?? ('followup.log_comments' | translate) }}
        </h2>
        <button
          type="button"
          class="text-foreground-muted transition-colors hover:text-foreground"
          (click)="dialogRef.close()"
        >
          <mat-icon [svgIcon]="icons.CLOSE" class="text-xl! size-5! leading-5!" />
        </button>
      </div>

      <div class="max-h-[60vh] overflow-auto px-6 py-5">
        <p class="whitespace-pre-wrap break-words text-sm text-foreground">
          {{ data.comment }}
        </p>
      </div>
    </div>
  `,
})
export class FollowupCommentViewerDialog {
  readonly dialogRef = inject<MatDialogRef<FollowupCommentViewerDialog>>(MatDialogRef)
  readonly data = inject<FollowupCommentViewerDialogData>(MAT_DIALOG_DATA)
  readonly icons = APP_ICONS
}
