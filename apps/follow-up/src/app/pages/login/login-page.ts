import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import { HttpErrorResponse } from '@angular/common/http'
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
import { AuthService, injectUrlService } from '@follow-up/core'
import { Endpoints } from '../../constants/endpoints'

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
          @if (errorMessage()) {
            <ui-alert variant="error" class="mb-4">
              <ui-alert-description>{{ errorMessage() | translate }}</ui-alert-description>
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
              size="lg"
              class="w-full"
              [loading]="loading()"
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
  private readonly authService = inject(AuthService)
  private readonly urlService = injectUrlService<Endpoints>()

  protected readonly loading = signal(false)
  protected readonly errorMessage = signal('')

  protected readonly form = this.fb.nonNullable.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  onSubmit() {
    if (this.form.invalid) return

    this.loading.set(true)
    this.errorMessage.set('')

    const { userName, password } = this.form.getRawValue()

    this.authService.login(this.urlService.URLS.AUTH, { userName, password }).subscribe({
      next: () => {
        this.loading.set(false)
        this.router.navigate(['/showcase'])
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false)
        this.errorMessage.set(
          err.status === 401
            ? 'login.error_invalid_credentials'
            : 'login.error_generic',
        )
      },
    })
  }
}
