import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <span [class]="innerClasses()">
      @if (src() && !imgError()) {
        <img
          [src]="src()"
          [alt]="alt()"
          class="size-full object-cover"
          (error)="onImgError()"
        />
      } @else if (initials()) {
        <span [class]="initialsClasses()">{{ initials()!.slice(0, 2).toUpperCase() }}</span>
      } @else {
        <svg
          [class]="iconClasses()"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clip-rule="evenodd"
          />
        </svg>
      }
    </span>
    @if (status()) {
      <span [class]="statusClasses()"></span>
    }
  `,
})
export class UiAvatar {
  readonly src = input<string>()
  readonly alt = input('')
  readonly initials = input<string>()
  readonly size = input<AvatarSize>('md')
  readonly status = input<AvatarStatus | null>(null)

  protected readonly imgError = signal(false)

  protected onImgError() {
    this.imgError.set(true)
  }

  protected readonly hostClasses = computed(() => {
    const s = this.size()

    const base = 'relative inline-flex shrink-0'

    const sizes: Record<AvatarSize, string> = {
      sm: 'size-8',
      md: 'size-10',
      lg: 'size-14',
    }

    return `${base} ${sizes[s]}`
  })

  protected readonly innerClasses = computed(() =>
    'flex items-center justify-center size-full rounded-full overflow-hidden bg-surface-hover text-foreground-muted',
  )

  protected readonly initialsClasses = computed(() => {
    const s = this.size()

    const base = 'font-medium select-none leading-none'

    const sizes: Record<AvatarSize, string> = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-lg',
    }

    return `${base} ${sizes[s]}`
  })

  protected readonly iconClasses = computed(() => {
    const s = this.size()

    const sizes: Record<AvatarSize, string> = {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-7',
    }

    return sizes[s]
  })

  protected readonly statusClasses = computed(() => {
    const s = this.size()
    const st = this.status()

    const base = 'absolute bottom-0 end-0 rounded-full ring-2 ring-background'

    const dotSizes: Record<AvatarSize, string> = {
      sm: 'size-2',
      md: 'size-2.5',
      lg: 'size-3',
    }

    const colors: Record<AvatarStatus, string> = {
      online: 'bg-success',
      offline: 'bg-foreground-muted',
      busy: 'bg-error',
      away: 'bg-warning',
    }

    return `${base} ${dotSizes[s]} ${st ? colors[st] : ''}`
  })
}
