import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslateService, TranslatePipe } from '@ngx-translate/core'
import { of, switchMap } from 'rxjs'
import {
  UiButton,
  UiFileItem,
  UiFileList,
  UiFileUpload,
  UiFormField,
  UiLabel,
  UiSelect,
  UiSelectOption,
  UiTextareaAutoResize,
} from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { FollowupService } from '../services/followup.service'
import { AppStore } from '../../../shared/stores/app-store'

export interface FollowupAddCommentDialogData {
  followupId: number
}

export interface FollowupAddCommentResult {
  commentId: number
  attachment: File | null
  attachmentTypeId: number | null
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
    UiFormField,
    UiLabel,
    UiSelect,
    UiSelectOption,
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

            <ui-form-field class="mt-2">
              <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
              <label uiLabel>{{ 'followup.attachment_type_label' | translate }}</label>
              <ui-select
                ngProjectAs="[uiInput]"
                class="w-full"
                formControlName="attachmentTypeId"
                [placeholder]="'followup.select_attachment_type' | translate"
              >
                @for (type of attachmentTypes(); track type.lookupKey) {
                  <ui-select-option
                    [value]="type.lookupKey"
                    [label]="isArabic() ? type.arName : type.enName"
                  >
                    {{ isArabic() ? type.arName : type.enName }}
                  </ui-select-option>
                }
              </ui-select>
            </ui-form-field>
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
  private readonly appStore = inject(AppStore)
  private readonly translate = inject(TranslateService)

  readonly icons = APP_ICONS
  readonly followupId = this.data.followupId

  readonly attachment = signal<File | null>(null)
  readonly saving = signal(false)

  readonly attachmentTypes = computed(() => this.appStore.lookupList()?.AttachmentType ?? [])
  readonly isArabic = computed(() => (this.translate.currentLang || 'ar') === 'ar')

  readonly form = this.fb.nonNullable.group({
    comment: ['', [Validators.required, Validators.maxLength(2000)]],
    attachmentTypeId: this.fb.control<number | null>(null),
  })

  onFileAdded(files: File[]): void {
    if (!files.length) return
    this.attachment.set(files[0])
    const typeCtrl = this.form.controls.attachmentTypeId
    typeCtrl.setValidators([Validators.required])
    typeCtrl.updateValueAndValidity()
  }

  removeAttachment(): void {
    this.attachment.set(null)
    const typeCtrl = this.form.controls.attachmentTypeId
    typeCtrl.clearValidators()
    typeCtrl.setValue(null)
    typeCtrl.updateValueAndValidity()
  }

  save(): void {
    if (this.form.invalid || this.saving()) return
    this.saving.set(true)
    const file = this.attachment()
    const { comment, attachmentTypeId } = this.form.getRawValue()
    const selectedType = this.attachmentTypes().find((t) => t.lookupKey === attachmentTypeId)
    const docSubject = selectedType ? (this.isArabic() ? selectedType.arName : selectedType.enName) : ''
    this.followupService
      .addComment(this.followupId, comment)
      .pipe(
        switchMap((commentId) =>
          file && attachmentTypeId !== null
            ? this.followupService
                .uploadCommentAttachment(this.followupId, commentId, attachmentTypeId, docSubject, file)
                .pipe(switchMap(() => of(commentId)))
            : of(commentId),
        ),
      )
      .subscribe({
        next: (commentId) => {
          this.saving.set(false)
          this.dialogRef.close({ commentId, attachment: file, attachmentTypeId })
        },
        error: () => this.saving.set(false),
      })
  }
}
