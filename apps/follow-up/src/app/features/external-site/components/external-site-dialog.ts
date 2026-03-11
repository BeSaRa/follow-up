import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { ToastService, UiButton, UiFormField, UiInput, UiLabel, UiSlideToggle } from '@follow-up/ui'
import { CrudDialogData } from '@follow-up/core'
import { ExternalSite } from '../models/external-site'

@Component({
  selector: 'app-external-site-dialog',
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
            <label uiLabel for="arName">{{ 'external_site.ar_name' | translate }}</label>
            <input uiInput id="arName" formControlName="arName" />
          </ui-form-field>

          <ui-form-field>
            <label uiLabel for="enName">{{ 'external_site.en_name' | translate }}</label>
            <input uiInput id="enName" formControlName="enName" />
          </ui-form-field>
        </div>

        <ui-form-field>
          <label uiLabel for="description">{{ 'external_site.description_col' | translate }}</label>
          <input uiInput id="description" formControlName="description" />
        </ui-form-field>

        <ui-form-field>
          <label uiLabel for="ldapPrefix">{{ 'external_site.ldap_prefix' | translate }}</label>
          <input uiInput id="ldapPrefix" formControlName="ldapPrefix" />
        </ui-form-field>

        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 text-sm text-foreground">
            <ui-slide-toggle formControlName="status" />
            {{ 'external_site.status' | translate }}
          </label>
        </div>
      </form>

      <!-- Footer -->
      @if (!isViewMode) {
        <div class="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <button uiButton variant="outline" type="button" (click)="dialogRef.close()">
            {{ 'common.cancel' | translate }}
          </button>
          <button uiButton variant="primary" type="button" [disabled]="form.invalid" [loading]="saving()" (click)="onSubmit()">
            {{ 'common.save' | translate }}
          </button>
        </div>
      }
    </div>
  `,
})
export class ExternalSiteDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ExternalSiteDialog>)
  readonly data = inject<CrudDialogData<ExternalSite>>(MAT_DIALOG_DATA)
  private readonly fb = inject(FormBuilder)
  private readonly toast = inject(ToastService)
  private readonly translate = inject(TranslateService)

  readonly form: FormGroup = this.fb.group({
    arName: ['', Validators.required],
    enName: ['', Validators.required],
    description: [''],
    ldapPrefix: [''],
    status: [true],
  })

  readonly saving = signal(false)

  get isViewMode() {
    return this.data.mode === 'VIEW'
  }

  get titleKey() {
    switch (this.data.mode) {
      case 'CREATE':
        return 'external_site.add'
      case 'UPDATE':
        return 'external_site.edit'
      case 'VIEW':
        return 'external_site.view'
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

    const model = this.data.model ?? new ExternalSite()
    const cloned = model.clone<ExternalSite>(this.form.value)
    this.saving.set(true)
    cloned.save().subscribe({
      next: (saved) => {
        this.toast.success(this.translate.instant('common.save_success'))
        this.dialogRef.close(saved)
      },
      error: () => this.saving.set(false),
    })
  }
}
