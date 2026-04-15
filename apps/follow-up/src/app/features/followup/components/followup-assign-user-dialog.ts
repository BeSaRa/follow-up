import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslateService, TranslatePipe } from '@ngx-translate/core'
import {
  ToastService,
  UiButton,
  UiFormField,
  UiInput,
  UiLabel,
  UiSelect,
  UiSelectOption,
  UiSpinner,
  UiTextareaAutoResize,
} from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { FollowupService } from '../services/followup.service'

export interface FollowupAssignUserDialogData {
  followupId: number
  currentAssigneeId?: number
  currentDueDate?: string
}

export interface FollowupAssignUserResult {
  followupId: number
  userId: number
  userComments: string
  dueDate: string
}

@Component({
  selector: 'app-followup-assign-user-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatIcon,
    UiButton,
    UiFormField,
    UiInput,
    UiLabel,
    UiSelect,
    UiSelectOption,
    UiSpinner,
    UiTextareaAutoResize,
  ],
  template: `
    <div class="flex w-[36rem] max-w-full flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <h2 class="truncate text-lg font-semibold text-foreground">
          {{ 'followup.assign_user_title' | translate }}
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
      @if (loadingUsers()) {
        <div class="flex flex-col items-center justify-center gap-3 px-6 py-16">
          <ui-spinner size="lg" />
          <p class="text-sm text-foreground-muted">
            {{ 'followup.loading_users' | translate }}
          </p>
        </div>
      } @else {
      <form [formGroup]="form" (ngSubmit)="save()" class="flex flex-col gap-5 px-6 py-5">
        <!-- User -->
        <ui-form-field>
          <label uiLabel>{{ 'followup.select_user_label' | translate }}</label>
          <ui-select
            ngProjectAs="[uiInput]"
            class="w-full"
            formControlName="userId"
            [placeholder]="'followup.select_user_placeholder' | translate"
          >
            @for (user of users(); track user.id) {
              <ui-select-option
                [value]="user.id"
                [label]="isArabic() ? user.arName : user.enName"
              >
                {{ isArabic() ? user.arName : user.enName }}
              </ui-select-option>
            }
          </ui-select>
        </ui-form-field>

        <!-- Due date -->
        <ui-form-field>
          <label uiLabel for="dueDate">{{ 'followup.due_date' | translate }}</label>
          <input uiInput id="dueDate" type="date" formControlName="dueDate" />
        </ui-form-field>

        <!-- Comments -->
        <div class="flex flex-col gap-2">
          <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
          <label for="comments" class="text-sm font-medium text-foreground">
            {{ 'followup.comment_label' | translate }}
          </label>
          <textarea
            id="comments"
            uiAutoResize
            [uiAutoResizeMinRows]="3"
            [uiAutoResizeMaxRows]="8"
            formControlName="userComments"
            class="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
            [placeholder]="'followup.comment_placeholder' | translate"
          ></textarea>
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
      }
    </div>
  `,
})
export class FollowupAssignUserDialog implements OnInit {
  readonly dialogRef = inject<MatDialogRef<FollowupAssignUserDialog, FollowupAssignUserResult>>(MatDialogRef)
  private readonly data = inject<FollowupAssignUserDialogData>(MAT_DIALOG_DATA)
  private readonly fb = inject(FormBuilder)
  private readonly followupService = inject(FollowupService)
  private readonly translate = inject(TranslateService)
  private readonly toast = inject(ToastService)

  readonly icons = APP_ICONS
  readonly followupId = this.data.followupId

  readonly users = this.followupService.internalUsers
  readonly loadingUsers = signal(false)
  readonly saving = signal(false)

  readonly isArabic = computed(() => (this.translate.currentLang || 'ar') === 'ar')

  readonly form = this.fb.nonNullable.group({
    userId: this.fb.control<number | null>(this.data.currentAssigneeId ?? null, {
      validators: [Validators.required],
    }),
    dueDate: [this.toDateInputValue(this.data.currentDueDate), [Validators.required]],
    userComments: ['', [Validators.maxLength(2000)]],
  })

  private toDateInputValue(value: string | undefined): string {
    if (!value) return ''
    // Accept both "YYYY-MM-DD" and ISO timestamps; native date input needs YYYY-MM-DD.
    return value.length >= 10 ? value.slice(0, 10) : value
  }

  ngOnInit(): void {
    if (!this.users().length) {
      this.loadingUsers.set(true)
      this.followupService.loadAssignableUsers().subscribe({
        next: () => this.loadingUsers.set(false),
        error: () => this.loadingUsers.set(false),
      })
    }
  }

  save(): void {
    if (this.form.invalid || this.saving()) return
    this.saving.set(true)
    const { userId, dueDate, userComments } = this.form.getRawValue()
    this.followupService
      .updateAssignee({
        followupId: this.followupId,
        userId: userId as number,
        dueDate,
        userComments,
      })
      .subscribe({
        next: () => {
          this.saving.set(false)
          this.toast.success(this.translate.instant('followup.assign_user_success'))
          this.dialogRef.close({
            followupId: this.followupId,
            userId: userId as number,
            dueDate,
            userComments,
          })
        },
        error: () => this.saving.set(false),
      })
  }
}
