import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core'
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import {
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
  UiCardContent,
  UiFormField,
  UiInput,
  UiLabel,
  UiButton,
  UiAlert,
  UiAlertDescription,
  ToastService,
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
    UiButton,
    UiAlert,
    UiAlertDescription,
  ],
  template: `
    <div
      class="flex min-h-screen items-center justify-center bg-background p-4"
    >
      <ui-card class="w-full max-w-md">
        <ui-card-header class="text-center">
          <ui-card-title>{{ 'login.title' | translate }}</ui-card-title>
          <ui-card-description>{{
            'login.description' | translate
          }}</ui-card-description>
        </ui-card-header>

        <ui-card-content>
          @if (store.error()) {
            <ui-alert variant="error" class="mb-4">
              <ui-alert-description>{{
                store.error() | translate
              }}</ui-alert-description>
            </ui-alert>
          }

          <form
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
            class="flex flex-col gap-4"
          >
            <ui-form-field>
              <label uiLabel for="userName">{{
                'login.username_label' | translate
              }}</label>
              <input
                uiInput
                id="userName"
                type="text"
                formControlName="userName"
                [placeholder]="'login.username_placeholder' | translate"
                autocomplete="username"
              />
            </ui-form-field>

            <ui-form-field>
              <label uiLabel for="password">{{
                'login.password_label' | translate
              }}</label>
              <div class="relative" ngProjectAs="[uiInput]">
                <input
                  uiInput
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  [placeholder]="'login.password_placeholder' | translate"
                  autocomplete="current-password"
                  class="pe-10"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground"
                  (click)="showPassword.set(!showPassword())"
                  [attr.aria-label]="(showPassword() ? 'login.hide_password' : 'login.show_password') | translate"
                >
                  @if (showPassword()) {
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  }
                </button>
              </div>
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
  private readonly route = inject(ActivatedRoute)
  private readonly toast = inject(ToastService)
  private readonly translate = inject(TranslateService)

  protected readonly store = inject(AuthStore)
  protected readonly showPassword = signal(false)

  protected readonly form = this.fb.nonNullable.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  constructor() {
    effect(() => {
      if (this.store.isAuthenticated()) {
        this.router.navigate(['/dashboard'])
      }
    })

    if (this.route.snapshot.queryParamMap.get('reason') === 'logout') {
      this.toast.info(this.translate.instant('login.logged_out'))
    }
  }

  onSubmit() {
    if (this.form.invalid) return

    const { userName, password } = this.form.getRawValue()
    this.store.login({ userName, password })
  }
}
