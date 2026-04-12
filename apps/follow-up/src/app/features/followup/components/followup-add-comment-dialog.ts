import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import { of, switchMap } from 'rxjs'
import {
  UiButton,
  UiFileItem,
  UiFileList,
  UiFileUpload,
  UiTextareaAutoResize,
} from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { FollowupService } from '../services/followup.service'
import { FollowupLog } from '../models/followup-log'

export interface FollowupAddCommentDialogData {
  followupId: number
}

export interface FollowupAddCommentResult {
  log: FollowupLog
  attachment: File | null
}

@Component({
  selector: 'app-followup-add-comment-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatIcon,
    UiButton,
    UiFileUpload,
    UiFileList,
    UiFileItem,
    UiTextareaAutoResize,
  ],
  template: `
    <div class="flex w-[36rem] max-w-full flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <h2 class="truncate text-lg font-semibold text-foreground">
          {{ 'followup.add_comment_title' | translate }}
        </h2>
        <button
          type="button"
          class="text-foreground-muted transition-colors hover:text-foreground"
          (click)="dialogRef.close()"
        >
          <mat-icon [svgIcon]="icons.CLOSE" class="text-xl! size-5! leading-5!" />
        </button>
      </div>

      <!-- Body -->
      <form [formGroup]="form" (ngSubmit)="save()" class="flex flex-col gap-5 px-6 py-5">
        <!-- Comment -->
        <div class="flex flex-col gap-2">
          <label for="comment" class="text-sm font-medium text-foreground">
            {{ 'followup.comment_label' | translate }}
            <span class="text-danger">*</span>
          </label>
          <textarea
            id="comment"
            uiAutoResize
            [uiAutoResizeMinRows]="4"
            [uiAutoResizeMaxRows]="10"
            formControlName="comment"
            class="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
            [placeholder]="'followup.comment_placeholder' | translate"
          ></textarea>
        </div>

        <!-- Attachment (optional, single file) -->
        <div class="flex flex-col gap-2">
          <span class="text-sm font-medium text-foreground">
            {{ 'followup.attachment_label' | translate }}
          </span>

          @if (attachment(); as file) {
            <ui-file-list>
              <ui-file-item [file]="file" (removed)="removeAttachment()" />
            </ui-file-list>
          } @else {
            <ui-file-upload
              [multiple]="false"
              [maxFiles]="1"
              (fileAdded)="onFileAdded($event)"
            />
          }
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 border-t border-border pt-4">
          <button uiButton type="button" variant="ghost" (click)="dialogRef.close()">
            {{ 'common.cancel' | translate }}
          </button>
          <button uiButton type="submit" [disabled]="form.invalid || saving()" [loading]="saving()">
            {{ 'common.save' | translate }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class FollowupAddCommentDialog {
  readonly dialogRef = inject<MatDialogRef<FollowupAddCommentDialog, FollowupAddCommentResult>>(MatDialogRef)
  private readonly data = inject<FollowupAddCommentDialogData>(MAT_DIALOG_DATA)
  private readonly fb = inject(FormBuilder)
  private readonly followupService = inject(FollowupService)

  readonly icons = APP_ICONS
  readonly followupId = this.data.followupId

  readonly attachment = signal<File | null>(null)
  readonly saving = signal(false)

  readonly form = this.fb.nonNullable.group({
    comment: ['', [Validators.required, Validators.maxLength(2000)]],
  })

  onFileAdded(files: File[]): void {
    if (files.length) this.attachment.set(files[0])
  }

  removeAttachment(): void {
    this.attachment.set(null)
  }

  save(): void {
    if (this.form.invalid || this.saving()) return
    this.saving.set(true)
    const file = this.attachment()
    this.followupService
      .addComment(this.followupId, this.form.getRawValue().comment)
      .pipe(
        switchMap((log) =>
          file
            ? this.followupService
                .uploadCommentAttachment(this.followupId, log.id, file)
                .pipe(switchMap(() => of(log)))
            : of(log),
        ),
      )
      .subscribe({
        next: (log) => {
          this.saving.set(false)
          this.dialogRef.close({ log, attachment: file })
        },
        error: () => this.saving.set(false),
      })
  }
}
