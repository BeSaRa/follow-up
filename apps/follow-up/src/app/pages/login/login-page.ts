import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import {
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
  UiCardContent,
  UiFormField,
  UiInput,
  UiLabel,
  UiFormError,
  UiButton,
  UiAlert,
  UiAlertDescription,
} from '@follow-up/ui'
import { AuthStore } from '@follow-up/core'

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    UiCard,
    UiCardHeader,
    UiCardTitle,
    UiCardDescription,
    UiCardContent,
    UiFormField,
    UiInput,
    UiLabel,
    UiFormError,
    UiButton,
    UiAlert,
    UiAlertDescription,
  ],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-background p-4">
      <ui-card class="w-full max-w-md">
        <ui-card-header class="text-center">
          <ui-card-title>{{ 'login.title' | translate }}</ui-card-title>
          <ui-card-description>{{ 'login.description' | translate }}</ui-card-description>
        </ui-card-header>

        <ui-card-content>
          @if (store.error()) {
            <ui-alert variant="error" class="mb-4">
              <ui-alert-description>{{ store.error() | translate }}</ui-alert-description>
            </ui-alert>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <ui-form-field>
              <label uiLabel for="userName">{{ 'login.username_label' | translate }}</label>
              <input
                uiInput
                id="userName"
                type="text"
                formControlName="userName"
                [error]="form.controls.userName.touched && form.controls.userName.invalid"
                [placeholder]="'login.username_placeholder' | translate"
                autocomplete="username"
              />
              @if (form.controls.userName.touched && form.controls.userName.hasError('required')) {
                <span uiFormError>{{ 'login.username_required' | translate }}</span>
              }
            </ui-form-field>

            <ui-form-field>
              <label uiLabel for="password">{{ 'login.password_label' | translate }}</label>
              <input
                uiInput
                id="password"
                type="password"
                formControlName="password"
                [error]="form.controls.password.touched && form.controls.password.invalid"
                [placeholder]="'login.password_placeholder' | translate"
                autocomplete="current-password"
              />
              @if (form.controls.password.touched && form.controls.password.hasError('required')) {
                <span uiFormError>{{ 'login.password_required' | translate }}</span>
              }
            </ui-form-field>

            <button
              uiButton
              type="submit"
              variant="primary"
              size="md"
              class="w-full"
              [loading]="store.loading()"
              [disabled]="form.invalid"
            >
              {{ 'login.submit' | translate }}
            </button>
          </form>
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)

  protected readonly store = inject(AuthStore)

  protected readonly form = this.fb.nonNullable.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  constructor() {
    effect(() => {
      if (this.store.isAuthenticated()) {
        this.router.navigate(['/showcase'])
      }
    })
  }

  onSubmit() {
    if (this.form.invalid) return

    const { userName, password } = this.form.getRawValue()
    this.store.login({ userName, password })
  }
}
