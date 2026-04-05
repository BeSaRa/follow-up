import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  UiButton,
  UiFormField,
  UiInput,
  UiLabel,
  UiSelect,
  UiSelectOption,
  UiSlideToggle,
  UiTabs,
  UiTabList,
  UiTab,
  UiTabPanel,
} from '@follow-up/ui'
import { CrudDialogDirective, CrudDialogTitleKeys } from '@follow-up/core'
import { ApplicationUser } from '../models/application-user'
import { UserPermissionService } from '../services/user-permission.service'
import { AppStore } from '../../../shared/stores/app-store'
import { PermissionsTab } from './permissions-tab'

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
    UiSelect,
    UiSelectOption,
    UiSlideToggle,
    UiTabs,
    UiTabList,
    UiTab,
    UiTabPanel,
    PermissionsTab,
  ],
  template: `
    <div class="w-[48rem] max-w-full">
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

      <!-- Tabs -->
      <div class="px-6 pt-4">
        <ui-tabs #dialogTabs [activeTab]="'basic'">
          <ui-tab-list>
            <ui-tab value="basic" [tabs]="dialogTabs">
              {{ 'application_user.basic_info_tab' | translate }}
            </ui-tab>
            <ui-tab value="permissions" [tabs]="dialogTabs" [disabled]="isCreateMode()">
              {{ 'application_user.permissions_tab' | translate }}
            </ui-tab>
          </ui-tab-list>

          <!-- Basic Info Tab -->
          <ui-tab-panel value="basic" [tabs]="dialogTabs">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 py-4">
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

              <ui-form-field>
                <label uiLabel>{{ 'application_user.user_type' | translate }}</label>
                <ui-select ngProjectAs="[uiInput]" class="w-full" formControlName="userType" [placeholder]="'application_user.select_user_type' | translate">
                  @for (type of userTypes(); track type.lookupKey) {
                    <ui-select-option [value]="type.lookupKey" [label]="isArabic() ? type.arName : type.enName">
                      {{ isArabic() ? type.arName : type.enName }}
                    </ui-select-option>
                  }
                </ui-select>
              </ui-form-field>

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
          </ui-tab-panel>

          <!-- Permissions Tab -->
          <ui-tab-panel value="permissions" [tabs]="dialogTabs">
            @if (!isCreateMode()) {
              <app-permissions-tab
                [userId]="data.model!.id"
                [viewMode]="isViewMode()"
              />
            }
          </ui-tab-panel>
        </ui-tabs>
      </div>

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
export class ApplicationUserDialog extends CrudDialogDirective<ApplicationUser> {
  private readonly userPermissionService = inject(UserPermissionService)
  private readonly appStore = inject(AppStore)
  private readonly permissionsTab = viewChild(PermissionsTab)

  protected readonly userTypes = computed(() => this.appStore.lookupList()?.UserType ?? [])
  protected readonly isArabic = computed(() => (this.translate.currentLang || 'ar') === 'ar')

  readonly titleKeys: CrudDialogTitleKeys = {
    create: 'application_user.add_user',
    update: 'application_user.edit',
    view: 'application_user.view',
  }

  override afterBuildForm() {
    if (this.isUpdateMode()) {
      this.form.get('domainName')?.disable()
    }
    if (!this.isCreateMode() && this.data.model?.userTypeInfo) {
      this.form.get('userType')?.setValue(this.data.model.userTypeInfo.id)
    }
  }

  override prepareModel() {
    const model = super.prepareModel()
    const selectedUserType = this.form.get('userType')?.value
    model.userTypeInfo = { id: selectedUserType, arName: '', enName: '' }
    return model
  }

  override afterSaveSuccess(saved: ApplicationUser) {
    const permTab = this.permissionsTab()
    if (permTab && this.isUpdateMode()) {
      const permissions = permTab.getSelectedPermissionIds().map((permissionId) => ({
        userId: saved.id,
        permissionId,
      }))
      this.userPermissionService.saveForUser(permissions)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => super.afterSaveSuccess(saved),
          error: () => this.saving.set(false),
        })
    } else {
      super.afterSaveSuccess(saved)
    }
  }
}
