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
import { MatIcon } from '@angular/material/icon'
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
import { APP_ICONS } from '../../constants/icons'

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatIcon,
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
                    <mat-icon class="text-xl! size-5! leading-5!" [svgIcon]="icons.EYE_OFF" />
                  } @else {
                    <mat-icon class="text-xl! size-5! leading-5!" [svgIcon]="icons.EYE" />
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
  protected readonly icons = APP_ICONS
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

    const reason = this.route.snapshot.queryParamMap.get('reason')
    if (reason === 'logout') {
      this.toast.info(this.translate.instant('login.logged_out'))
    } else if (reason === 'session-expired') {
      this.toast.error(this.translate.instant('http_errors.session_expired'))
    } else if (reason === 'unauthenticated') {
      this.toast.info(this.translate.instant('login.unauthenticated'))
    }
  }

  onSubmit() {
    if (this.form.invalid) return

    const { userName, password } = this.form.getRawValue()
    this.store.login({ userName, password })
  }
}
