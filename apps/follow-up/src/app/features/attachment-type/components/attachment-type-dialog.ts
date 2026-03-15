import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import { UiButton, UiFormField, UiInput, UiLabel, UiSlideToggle } from '@follow-up/ui'
import { CrudDialogDirective, CrudDialogTitleKeys } from '@follow-up/core'
import { AttachmentType } from '../models/attachment-type'

@Component({
  selector: 'app-attachment-type-dialog',
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
            <label uiLabel for="arName">{{ 'attachment_type.ar_name' | translate }}</label>
            <input uiInput id="arName" formControlName="arName" />
          </ui-form-field>

          <ui-form-field>
            <label uiLabel for="enName">{{ 'attachment_type.en_name' | translate }}</label>
            <input uiInput id="enName" formControlName="enName" />
          </ui-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <ui-form-field>
            <label uiLabel for="lookupKey">{{ 'attachment_type.lookup_key' | translate }}</label>
            <input uiInput id="lookupKey" type="number" formControlName="lookupKey" />
          </ui-form-field>

          <ui-form-field>
            <label uiLabel for="category">{{ 'attachment_type.category' | translate }}</label>
            <input uiInput id="category" type="number" formControlName="category" />
          </ui-form-field>
        </div>

        <ui-form-field>
          <label uiLabel for="lookupStrKey">{{ 'attachment_type.lookup_str_key' | translate }}</label>
          <input uiInput id="lookupStrKey" formControlName="lookupStrKey" />
        </ui-form-field>

        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 text-sm text-foreground">
            <ui-slide-toggle formControlName="status" />
            {{ 'attachment_type.status' | translate }}
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
export class AttachmentTypeDialog extends CrudDialogDirective<AttachmentType> {
  readonly titleKeys: CrudDialogTitleKeys = {
    create: 'attachment_type.add',
    update: 'attachment_type.edit',
    view: 'attachment_type.view',
  }
}
