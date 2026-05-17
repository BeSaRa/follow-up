import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatIcon } from '@angular/material/icon'
import { TranslatePipe } from '@ngx-translate/core'
import {
  type BadgeVariant,
  UiBadge,
  UiButton,
  UiFormField,
  UiInput,
  UiLabel,
  UiSelect,
  UiSelectOption,
  UiSlideToggle,
} from '@follow-up/ui'
import { CrudDialogDirective, CrudDialogTitleKeys } from '@follow-up/core'
import { PriorityLevel } from '../models/priority-level'

@Component({
  selector: 'app-priority-level-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatIcon,
    UiBadge,
    UiButton,
    UiFormField,
    UiInput,
    UiLabel,
    UiSelect,
    UiSelectOption,
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
            <label uiLabel for="arName">{{ 'priority_level.ar_name' | translate }}</label>
            <input uiInput id="arName" formControlName="arName" />
          </ui-form-field>

          <ui-form-field>
            <label uiLabel for="enName">{{ 'priority_level.en_name' | translate }}</label>
            <input uiInput id="enName" formControlName="enName" />
          </ui-form-field>
        </div>

        <ui-form-field>
          <label uiLabel for="lookupStrKey">
            {{ 'priority_level.color' | translate }}
          </label>
          <ui-select
            ngProjectAs="[uiInput]"
            class="block w-full"
            formControlName="lookupStrKey"
            [placeholder]="'priority_level.color_placeholder' | translate"
          >
            @for (option of colorOptions; track option.value) {
              <ui-select-option
                [value]="option.value"
                [label]="option.label | translate"
              >
                <ui-badge [variant]="option.value" size="sm">
                  {{ option.label | translate }}
                </ui-badge>
              </ui-select-option>
            }
          </ui-select>
        </ui-form-field>

        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 text-sm text-foreground">
            <ui-slide-toggle formControlName="status" />
            {{ 'priority_level.status' | translate }}
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
export class PriorityLevelDialog extends CrudDialogDirective<PriorityLevel> {
  readonly titleKeys: CrudDialogTitleKeys = {
    create: 'priority_level.add',
    update: 'priority_level.edit',
    view: 'priority_level.view',
  }

  /** Available outline badge variants exposed as a color picker for priority levels. */
  protected readonly colorOptions: ReadonlyArray<{
    value: BadgeVariant
    label: string
  }> = [
    { value: 'outline', label: 'priority_level.color_default' },
    { value: 'outline-primary', label: 'priority_level.color_primary' },
    { value: 'outline-secondary', label: 'priority_level.color_secondary' },
    { value: 'outline-accent', label: 'priority_level.color_accent' },
    { value: 'outline-success', label: 'priority_level.color_success' },
    { value: 'outline-warning', label: 'priority_level.color_warning' },
    { value: 'outline-error', label: 'priority_level.color_error' },
    { value: 'outline-info', label: 'priority_level.color_info' },
  ]
}
