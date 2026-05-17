import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { UiButton, UiFormField, UiInput, UiLabel, UiSlideToggle } from '@follow-up/ui'
import { CrudDialogDirective, CrudDialogTitleKeys } from '@follow-up/core'
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
      @if (!isViewMode()) {
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
export class ExternalSiteDialog extends CrudDialogDirective<ExternalSite> {
  readonly titleKeys: CrudDialogTitleKeys = {
    create: 'external_site.add',
    update: 'external_site.edit',
    view: 'external_site.view',
  }

  /**
   * Always populate the form from data.model (default skips CREATE) — in this
   * feature CREATE is always seeded from a selected Tawasol site, so the
   * pre-filled values must show up.
   */
  override populateForm(): void {
    if (this.data.model) {
      this.form.patchValue(this.data.model)
    }
  }

  /**
   * POST in CREATE mode regardless of id. The selected Tawasol site carries
   * a non-zero id that must be sent to the backend, but CrudModel.save()
   * would route to PUT when id is truthy, so we call create() explicitly.
   */
  override onSubmit(): void {
    if (this.isViewMode()) return
    if (this.form.invalid) return
    this.saving.set(true)
    const model = this.prepareModel()
    const op = this.isCreateMode() ? model.create() : model.update()
    op.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (saved) => this.afterSaveSuccess(saved),
      error: (err) => this.afterSaveFail(err),
    })
  }
}
