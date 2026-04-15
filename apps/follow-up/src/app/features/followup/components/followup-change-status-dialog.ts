import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslateService, TranslatePipe } from '@ngx-translate/core'
import {
  ToastService,
  UiButton,
  UiFormField,
  UiLabel,
  UiSelect,
  UiSelectOption,
  UiTextareaAutoResize,
} from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { FollowupService } from '../services/followup.service'
import { AppStore } from '../../../shared/stores/app-store'

export interface FollowupChangeStatusDialogData {
  followupId: number
  currentStatusId?: number
}

export interface FollowupChangeStatusResult {
  followupId: number
  followupStatus: number
  userComments: string
}

@Component({
  selector: 'app-followup-change-status-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatIcon,
    UiButton,
    UiFormField,
    UiLabel,
    UiSelect,
    UiSelectOption,
    UiTextareaAutoResize,
  ],
  template: `
    <div class="flex w-[36rem] max-w-full flex-col">
      <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <h2 class="truncate text-lg font-semibold text-foreground">
          {{ 'followup.change_status_title' | translate }}
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
        <ui-form-field>
          <label uiLabel>{{ 'followup.change_status_label' | translate }}</label>
          <ui-select
            ngProjectAs="[uiInput]"
            class="w-full"
            formControlName="followupStatus"
            [placeholder]="'followup.change_status_placeholder' | translate"
          >
            @for (status of statuses(); track status.lookupKey) {
              <ui-select-option
                [value]="status.lookupKey"
                [label]="isArabic() ? status.arName : status.enName"
              >
                {{ isArabic() ? status.arName : status.enName }}
              </ui-select-option>
            }
          </ui-select>
        </ui-form-field>

        <div class="flex flex-col gap-2">
          <label for="userComments" class="text-sm font-medium text-foreground">
            {{ 'followup.comment_label' | translate }}
          </label>
          <textarea
            id="userComments"
            uiAutoResize
            [uiAutoResizeMinRows]="4"
            [uiAutoResizeMaxRows]="10"
            formControlName="userComments"
            class="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
            [placeholder]="'followup.comment_placeholder' | translate"
          ></textarea>
        </div>

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
export class FollowupChangeStatusDialog {
  readonly dialogRef =
    inject<MatDialogRef<FollowupChangeStatusDialog, FollowupChangeStatusResult>>(MatDialogRef)
  private readonly data = inject<FollowupChangeStatusDialogData>(MAT_DIALOG_DATA)
  private readonly fb = inject(FormBuilder)
  private readonly followupService = inject(FollowupService)
  private readonly toast = inject(ToastService)
  private readonly translate = inject(TranslateService)
  private readonly appStore = inject(AppStore)

  readonly icons = APP_ICONS
  readonly followupId = this.data.followupId
  readonly saving = signal(false)

  readonly statuses = computed(() => this.appStore.lookupList()?.FollowupStatus ?? [])
  readonly isArabic = computed(() => (this.translate.currentLang || 'ar') === 'ar')

  readonly form = this.fb.nonNullable.group({
    followupStatus: this.fb.control<number | null>(this.data.currentStatusId ?? null, {
      validators: [Validators.required],
    }),
    userComments: ['', [Validators.maxLength(2000)]],
  })

  save(): void {
    if (this.form.invalid || this.saving()) return
    this.saving.set(true)
    const { followupStatus, userComments } = this.form.getRawValue()
    this.followupService
      .changeStatus(this.followupId, followupStatus as number, userComments)
      .subscribe({
        next: () => {
          this.saving.set(false)
          this.toast.success(this.translate.instant('followup.change_status_success'))
          this.dialogRef.close({
            followupId: this.followupId,
            followupStatus: followupStatus as number,
            userComments,
          })
        },
        error: () => this.saving.set(false),
      })
  }
}
