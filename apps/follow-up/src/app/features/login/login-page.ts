import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
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
  UiTooltip,
  ToastService,
} from '@follow-up/ui'
import { AuthStore } from '@follow-up/core'
import { LangTracker } from '@follow-up/util'
import { APP_ICONS } from '../../constants/icons'
import { AppStore } from '../../shared/stores/app-store'
import { UserType } from '../../shared/enums/user-type'

type OrbitAxis = 'xy' | 'xz' | 'yz'

interface OrbitParticle {
  radius: number
  angle: number
  speed: number
  orbitRadius: number
  tilt: number
  axis: OrbitAxis
  color: string
  pulsePhase: number
  pulseSpeed: number
}

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
    UiTooltip,
  ],
  template: `
    <div
      class="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface p-4"
    >
      <canvas
        #orbitCanvas
        aria-hidden="true"
        class="pointer-events-none fixed inset-0 z-0"
      ></canvas>
      <div
        #cursorBlob
        aria-hidden="true"
        class="pointer-events-none fixed left-0 top-0 z-0 hidden h-[20vw] max-h-[400px] min-h-[300px] w-[20vw] max-w-[400px] min-w-[300px] rounded-full opacity-40 blur-[100px] md:block"
        [style.mix-blend-mode]="darkMode() ? 'screen' : 'multiply'"
        [style.background]="
          darkMode()
            ? 'radial-gradient(circle, hsl(342, 80%, 70%) 0%, hsl(342, 60%, 50%) 100%)'
            : 'radial-gradient(circle, hsl(342, 74%, 45%) 0%, hsl(342, 60%, 75%) 100%)'
        "
      ></div>

      <ui-card class="relative z-10 w-full max-w-md animate-fade-up bg-surface-raised/30! backdrop-blur-md">
        <button
          type="button"
          class="absolute end-3 top-3 z-10 inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
          [uiTooltip]="'layout.switch_language' | translate"
          uiTooltipPosition="below"
          (click)="toggleLanguage()"
        >
          {{ currentLang() === 'ar' ? 'EN' : 'عربي' }}
        </button>

        <ui-card-header class="text-center">
          <img
            [src]="darkMode() ? 'logo-pmo-white.png' : 'logo.png'"
            alt="Logo"
            width="150"
            height="124"
            class="mx-auto mb-4"
          />
          <ui-card-title>{{ 'layout.app_title' | translate }}</ui-card-title>
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
              <div class="relative" ngProjectAs="[uiInput]">
                <span
                  class="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center ps-3 text-foreground-muted"
                >
                  <mat-icon class="text-xl! size-5! leading-5!" [svgIcon]="icons.EMAIL_OUTLINE" />
                </span>
                <input
                  uiInput
                  id="userName"
                  type="text"
                  formControlName="userName"
                  [placeholder]="'login.username_placeholder' | translate"
                  autocomplete="username"
                  class="ps-10 bg-surface-raised/60! backdrop-blur-sm"
                />
              </div>
            </ui-form-field>

            <ui-form-field>
              <label uiLabel for="password">{{
                'login.password_label' | translate
              }}</label>
              <div class="relative" ngProjectAs="[uiInput]">
                <span
                  class="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center ps-3 text-foreground-muted"
                >
                  <mat-icon class="text-xl! size-5! leading-5!" [svgIcon]="icons.LOCK_OUTLINE" />
                </span>
                <input
                  uiInput
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  [placeholder]="'login.password_placeholder' | translate"
                  autocomplete="current-password"
                  class="ps-10 pe-10 bg-surface-raised/60! backdrop-blur-sm"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 end-0 z-10 flex items-center pe-3 text-foreground-muted hover:text-foreground"
                  (click)="showPassword.set(!showPassword())"
                  [attr.aria-label]="(showPassword() ? 'login.hide_password' : 'login.show_password') | translate"
                >
                  @if (showPassword()) {
                    <mat-icon class="text-xl! size-5! leading-5!" [svgIcon]="icons.EYE_OFF_OUTLINE" />
                  } @else {
                    <mat-icon class="text-xl! size-5! leading-5!" [svgIcon]="icons.EYE_OUTLINE" />
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
  private readonly destroyRef = inject(DestroyRef)

  protected readonly store = inject(AuthStore)
  private readonly appStore = inject(AppStore)
  protected readonly icons = APP_ICONS
  protected readonly showPassword = signal(false)
  protected readonly darkMode = signal(document.documentElement.classList.contains('dark'))
  protected readonly currentLang = signal(this.translate.getCurrentLang() || 'ar')

  private readonly orbitCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('orbitCanvas')
  private readonly cursorBlob = viewChild.required<ElementRef<HTMLDivElement>>('cursorBlob')

  protected readonly form = this.fb.nonNullable.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  constructor() {
    effect(() => {
      if (this.store.isAuthenticated()) {
        const route = this.appStore.userType() === UserType.SYSTEM_ADMIN ? '/admin' : '/followup'
        this.router.navigate([route])
      }
    })

    afterNextRender(() => {
      const stopParticles = this.startOrbitParticles(this.orbitCanvas().nativeElement)
      const stopBlob = this.startCursorBlob(this.cursorBlob().nativeElement)
      this.destroyRef.onDestroy(() => {
        stopParticles()
        stopBlob()
      })
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

  protected toggleLanguage() {
    const next = this.currentLang() === 'ar' ? 'en' : 'ar'
    this.translate.use(next)
    this.currentLang.set(next)
    LangTracker.setLang(next, 'LoginPage')
  }

  private startOrbitParticles(canvas: HTMLCanvasElement): () => void {
    const noop = () => undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return noop

    const COLORS = this.darkMode()
      ? ['#D4506E', '#E8789A', '#F2A0BC', '#FFC1D4', '#888888', '#D4506E']
      : ['#8A1538', '#b91c4c', '#d4426a', '#e8829c', '#333333', '#8A1538']
    const dpr = window.devicePixelRatio || 1
    const axes: OrbitAxis[] = ['xy', 'xz', 'yz']

    let particles: OrbitParticle[] = []
    let rafId = 0
    const rotation = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }

    const init = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const num = w < 768 ? 72 : 144
      const maxOrbit = Math.min(w, h) * 0.55
      particles = []
      for (let i = 0; i < num; i++) {
        particles.push({
          radius: 0.6 + Math.random() * 2.2,
          angle: Math.random() * Math.PI * 2,
          speed:
            (0.0008 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
          orbitRadius: 80 + Math.random() * maxOrbit,
          tilt: (Math.random() - 0.5) * 0.9,
          axis: axes[Math.floor(Math.random() * axes.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.0015 + Math.random() * 0.002,
        })
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const nx = (e.clientX / w) * 2 - 1
      const ny = (e.clientY / h) * 2 - 1
      target.y = nx * 0.9
      target.x = -ny * 0.6
    }

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      const focal = Math.max(w, h) * 0.9

      rotation.x += (target.x - rotation.x) * 0.04
      rotation.y += (target.y - rotation.y) * 0.04
      const cosX = Math.cos(rotation.x)
      const sinX = Math.sin(rotation.x)
      const cosY = Math.cos(rotation.y)
      const sinY = Math.sin(rotation.y)

      const now = performance.now()
      const projected: Array<{
        sx: number
        sy: number
        scale: number
        alpha: number
        color: string
        r: number
      }> = []

      for (const p of particles) {
        p.angle += p.speed
        const pulse = 0.65 + 0.45 * Math.sin(now * p.pulseSpeed + p.pulsePhase)
        let lx = 0
        let ly = 0
        let lz = 0
        const r = p.orbitRadius
        const ca = Math.cos(p.angle)
        const sa = Math.sin(p.angle)
        const ct = Math.cos(p.tilt)
        const st = Math.sin(p.tilt)

        if (p.axis === 'xy') {
          lx = ca * r
          ly = sa * r * ct
          lz = sa * r * st
        } else if (p.axis === 'xz') {
          lx = ca * r
          ly = sa * r * st
          lz = sa * r * ct
        } else {
          lx = sa * r * st
          ly = ca * r
          lz = sa * r * ct
        }

        const x1 = lx * cosY + lz * sinY
        const y1 = ly
        const z1 = -lx * sinY + lz * cosY
        const x2 = x1
        const y2 = y1 * cosX - z1 * sinX
        const z2 = y1 * sinX + z1 * cosX

        const depth = focal + z2
        if (depth <= 1) continue
        const scale = focal / depth
        const sx = cx + x2 * scale
        const sy = cy + y2 * scale
        const alpha = Math.max(
          0.08,
          Math.min(0.85, (0.15 + scale * 0.45) * (0.6 + pulse * 0.6)),
        )
        projected.push({
          sx,
          sy,
          scale,
          alpha,
          color: p.color,
          r: p.radius * scale * pulse,
        })
      }

      projected.sort((a, b) => a.scale - b.scale)

      const linkDist = Math.min(w, h) * 0.18
      const linkDistSq = linkDist * linkDist
      ctx.save()
      ctx.setLineDash([2, 4])
      ctx.lineWidth = 1
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i]
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j]
          const dx = a.sx - b.sx
          const dy = a.sy - b.sy
          const d2 = dx * dx + dy * dy
          if (d2 > linkDistSq) continue
          const dist = Math.sqrt(d2)
          const proximity = 1 - dist / linkDist
          const lineAlpha = proximity * Math.min(a.alpha, b.alpha) * 0.55
          if (lineAlpha < 0.03) continue
          ctx.globalAlpha = lineAlpha
          ctx.strokeStyle = a.color
          ctx.beginPath()
          ctx.moveTo(a.sx, a.sy)
          ctx.lineTo(b.sx, b.sy)
          ctx.stroke()
        }
      }
      ctx.restore()

      for (const q of projected) {
        ctx.globalAlpha = q.alpha
        const glow = ctx.createRadialGradient(q.sx, q.sy, 0, q.sx, q.sy, q.r * 4)
        glow.addColorStop(0, q.color)
        glow.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(q.sx, q.sy, q.r * 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = Math.min(1, q.alpha + 0.25)
        ctx.fillStyle = q.color
        ctx.beginPath()
        ctx.arc(q.sx, q.sy, q.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      rafId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', init)
    window.addEventListener('mousemove', onMouseMove)
    init()
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', init)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }

  private startCursorBlob(blob: HTMLDivElement): () => void {
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let bx = mx
    let by = my
    let rafId = 0

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const tick = () => {
      bx += (mx - bx) * 0.55
      by += (my - by) * 0.55
      blob.style.transform = `translate(${bx}px, ${by}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouseMove)
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }
}
