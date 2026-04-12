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

export interface FollowupAddStatementDialogData {
  followupId: number
}

export interface FollowupAddStatementResult {
  statementId: number
  attachment: File | null
  attachmentTypeId: number | null
}

@Component({
  selector: 'app-followup-add-statement-dialog',
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
          {{ 'followup.add_statement_title' | translate }}
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
        <!-- Statement -->
        <div class="flex flex-col gap-2">
          <label for="statement" class="text-sm font-medium text-foreground">
            {{ 'followup.statement_label' | translate }}
            <span class="text-danger">*</span>
          </label>
          <textarea
            id="statement"
            uiAutoResize
            [uiAutoResizeMinRows]="4"
            [uiAutoResizeMaxRows]="10"
            formControlName="statement"
            class="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
            [placeholder]="'followup.statement_placeholder' | translate"
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
export class FollowupAddStatementDialog {
  readonly dialogRef = inject<MatDialogRef<FollowupAddStatementDialog, FollowupAddStatementResult>>(MatDialogRef)
  private readonly data = inject<FollowupAddStatementDialogData>(MAT_DIALOG_DATA)
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
    statement: ['', [Validators.required, Validators.maxLength(2000)]],
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
    const { statement, attachmentTypeId } = this.form.getRawValue()
    const selectedType = this.attachmentTypes().find((t) => t.lookupKey === attachmentTypeId)
    const docSubject = selectedType ? (this.isArabic() ? selectedType.arName : selectedType.enName) : ''
    this.followupService
      .addStatement(this.followupId, statement)
      .pipe(
        switchMap((statementId) =>
          file && attachmentTypeId !== null
            ? this.followupService
                .uploadStatementAttachment(this.followupId, statementId, attachmentTypeId, docSubject, file)
                .pipe(switchMap(() => of(statementId)))
            : of(statementId),
        ),
      )
      .subscribe({
        next: (statementId) => {
          this.saving.set(false)
          this.dialogRef.close({ statementId, attachment: file, attachmentTypeId })
        },
        error: () => this.saving.set(false),
      })
  }
}
