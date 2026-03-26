import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import { UiButton, UiFormField, UiInput, UiLabel, UiSlideToggle } from '@follow-up/ui'
import { CrudDialogDirective, CrudDialogTitleKeys } from '@follow-up/core'
import { ApplicationUser } from '../models/application-user'

@Component({
  selector: 'app-application-user-dialog',
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
            <label uiLabel for="arName">{{ 'application_user.ar_name' | translate }}</label>
            <input uiInput id="arName" formControlName="arName" />
          </ui-form-field>

          <ui-form-field>
            <label uiLabel for="enName">{{ 'application_user.en_name' | translate }}</label>
            <input uiInput id="enName" formControlName="enName" />
          </ui-form-field>
        </div>

        <ui-form-field>
          <label uiLabel for="employeeNo">{{ 'application_user.employee_no' | translate }}</label>
          <input uiInput id="employeeNo" formControlName="employeeNo" />
        </ui-form-field>

        <div class="grid grid-cols-2 gap-4">
          <ui-form-field>
            <label uiLabel for="email">{{ 'application_user.email' | translate }}</label>
            <input uiInput id="email" type="email" formControlName="email" />
          </ui-form-field>

          <ui-form-field>
            <label uiLabel for="mobile">{{ 'application_user.mobile' | translate }}</label>
            <input uiInput id="mobile" formControlName="mobile" />
          </ui-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <ui-form-field>
            <label uiLabel for="domainName">{{ 'application_user.domain_name' | translate }}</label>
            <input uiInput id="domainName" formControlName="domainName" />
          </ui-form-field>

          <ui-form-field>
            <label uiLabel for="qid">{{ 'application_user.qid' | translate }}</label>
            <input uiInput id="qid" formControlName="qid" />
          </ui-form-field>
        </div>

        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 text-sm text-foreground">
            <ui-slide-toggle formControlName="status" />
            {{ 'application_user.status' | translate }}
          </label>

          <label class="flex items-center gap-2 text-sm text-foreground">
            <ui-slide-toggle formControlName="enableEmailNotification" />
            {{ 'application_user.email_notification' | translate }}
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
export class ApplicationUserDialog extends CrudDialogDirective<ApplicationUser> {
  readonly titleKeys: CrudDialogTitleKeys = {
    create: 'application_user.add_user',
    update: 'application_user.edit',
    view: 'application_user.view',
  }
}
