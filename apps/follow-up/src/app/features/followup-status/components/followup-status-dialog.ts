import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import { UiButton, UiFormField, UiInput, UiLabel, UiSlideToggle } from '@follow-up/ui'
import { CrudDialogData } from '@follow-up/core'
import { FollowupStatus } from '../models/followup-status'

@Component({
  selector: 'app-followup-status-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatIcon,
    UiButton,
    UiFormField,
    UiInput,
    UiLabel,
    UiSlideToggle,
  ],
  template: `
    <div class="w-[32rem] max-w-full">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 class="text-lg font-semibold text-foreground">
          {{ titleKey | translate }}
        </h2>
        <button
          type="button"
          class="text-foreground-muted hover:text-foreground transition-colors"
          (click)="dialogRef.close()"
        >
          <mat-icon svgIcon="close" class="text-xl! size-5! leading-5!" />
        </button>
      </div>

      <!-- Body -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 px-6 py-5">
        <div class="grid grid-cols-2 gap-4">
          <ui-form-field>
            <label uiLabel>{{ 'followup_status.ar_name' | translate }}</label>
            <input uiInput formControlName="arName" />
          </ui-form-field>

          <ui-form-field>
            <label uiLabel>{{ 'followup_status.en_name' | translate }}</label>
            <input uiInput formControlName="enName" />
          </ui-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <ui-form-field>
            <label uiLabel>{{ 'followup_status.lookup_key' | translate }}</label>
            <input uiInput type="number" formControlName="lookupKey" />
          </ui-form-field>

          <ui-form-field>
            <label uiLabel>{{ 'followup_status.category' | translate }}</label>
            <input uiInput type="number" formControlName="category" />
          </ui-form-field>
        </div>

        <ui-form-field>
          <label uiLabel>{{ 'followup_status.lookup_str_key' | translate }}</label>
          <input uiInput formControlName="lookupStrKey" />
        </ui-form-field>

        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 text-sm text-foreground">
            <ui-slide-toggle formControlName="status" />
            {{ 'followup_status.status' | translate }}
          </label>
        </div>
      </form>

      <!-- Footer -->
      @if (!isViewMode) {
        <div class="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <button uiButton variant="outline" type="button" (click)="dialogRef.close()">
            {{ 'common.cancel' | translate }}
          </button>
          <button uiButton variant="primary" type="button" [disabled]="form.invalid" (click)="onSubmit()">
            {{ 'common.save' | translate }}
          </button>
        </div>
      }
    </div>
  `,
})
export class FollowupStatusDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<FollowupStatusDialog>)
  readonly data = inject<CrudDialogData<FollowupStatus>>(MAT_DIALOG_DATA)
  private readonly fb = inject(FormBuilder)

  readonly form: FormGroup = this.fb.group({
    arName: ['', Validators.required],
    enName: ['', Validators.required],
    lookupKey: [0, Validators.required],
    lookupStrKey: [''],
    category: [0],
    status: [true],
  })

  get isViewMode() {
    return this.data.mode === 'VIEW'
  }

  get titleKey() {
    switch (this.data.mode) {
      case 'CREATE':
        return 'followup_status.add'
      case 'UPDATE':
        return 'followup_status.edit'
      case 'VIEW':
        return 'followup_status.view'
    }
  }

  ngOnInit() {
    if (this.data.model && this.data.mode !== 'CREATE') {
      this.form.patchValue(this.data.model)
    }

    if (this.isViewMode) {
      this.form.disable()
    }
  }

  onSubmit() {
    if (this.form.invalid || this.isViewMode) return

    const model = this.data.model ?? new FollowupStatus()
    this.dialogRef.close(model.clone<FollowupStatus>(this.form.value))
  }
}
