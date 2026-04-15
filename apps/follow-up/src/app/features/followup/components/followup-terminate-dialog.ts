import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslateService, TranslatePipe } from '@ngx-translate/core'
import { ToastService, UiButton, UiTextareaAutoResize } from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { FollowupService } from '../services/followup.service'

export interface FollowupTerminateDialogData {
  followupId: number
}

export interface FollowupTerminateResult {
  followupId: number
  userComments: string
}

@Component({
  selector: 'app-followup-terminate-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe, MatIcon, UiButton, UiTextareaAutoResize],
  template: `
    <div class="flex w-[36rem] max-w-full flex-col">
      <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <h2 class="truncate text-lg font-semibold text-foreground">
          {{ 'followup.terminate_title' | translate }}
        </h2>
        <button
          type="button"
          class="text-foreground-muted transition-colors hover:text-foreground"
          (click)="dialogRef.close()"
        >
          <mat-icon [svgIcon]="icons.CLOSE" class="text-xl! size-5! leading-5!" />
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="flex flex-col gap-5 px-6 py-5">
        <div class="flex flex-col gap-2">
          <label for="userComments" class="text-sm font-medium text-foreground">
            {{ 'followup.terminate_reason_label' | translate }}
          </label>
          <textarea
            id="userComments"
            uiAutoResize
            [uiAutoResizeMinRows]="4"
            [uiAutoResizeMaxRows]="10"
            formControlName="userComments"
            class="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
            [placeholder]="'followup.terminate_reason_placeholder' | translate"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-border pt-4">
          <button uiButton type="button" variant="ghost" (click)="dialogRef.close()">
            {{ 'common.cancel' | translate }}
          </button>
          <button
            uiButton
            type="submit"
            variant="destructive"
            [disabled]="form.invalid || saving()"
            [loading]="saving()"
          >
            {{ 'followup.terminate' | translate }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class FollowupTerminateDialog {
  readonly dialogRef = inject<MatDialogRef<FollowupTerminateDialog, FollowupTerminateResult>>(MatDialogRef)
  private readonly data = inject<FollowupTerminateDialogData>(MAT_DIALOG_DATA)
  private readonly fb = inject(FormBuilder)
  private readonly followupService = inject(FollowupService)
  private readonly toast = inject(ToastService)
  private readonly translate = inject(TranslateService)

  readonly icons = APP_ICONS
  readonly followupId = this.data.followupId
  readonly saving = signal(false)

  readonly form = this.fb.nonNullable.group({
    userComments: ['', [Validators.maxLength(2000)]],
  })

  save(): void {
    if (this.form.invalid || this.saving()) return
    this.saving.set(true)
    const { userComments } = this.form.getRawValue()
    this.followupService.terminate(this.followupId, userComments).subscribe({
      next: () => {
        this.saving.set(false)
        this.toast.success(this.translate.instant('followup.terminate_success'))
        this.dialogRef.close({ followupId: this.followupId, userComments })
      },
      error: () => this.saving.set(false),
    })
  }
}
