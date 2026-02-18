import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core'
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser'
import { type CodeLanguage, ShikiService } from './shiki.service'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative group">
      <button
        type="button"
        class="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-surface-hover/80 text-foreground-muted
               hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        (click)="copyToClipboard()"
        [attr.aria-label]="copied() ? 'Copied' : 'Copy code'"
      >
        @if (copied()) {
          <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        } @else {
          <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
        }
      </button>
      @if (highlightedHtml()) {
        <div class="overflow-x-auto rounded-md border border-border text-sm [&_pre]:!p-4 [&_pre]:!m-0 [&_pre]:!rounded-md"
             [innerHTML]="highlightedHtml()"></div>
      } @else {
        <pre class="overflow-x-auto rounded-md border border-border bg-surface p-4 text-sm text-foreground"><code>{{ code() }}</code></pre>
      }
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class ShowcaseCodeBlock {
  private readonly shikiService = inject(ShikiService)
  private readonly sanitizer = inject(DomSanitizer)

  readonly code = input.required<string>()
  readonly language = input<CodeLanguage>('typescript')

  protected readonly highlightedHtml = signal<SafeHtml>('')
  protected readonly copied = signal(false)

  constructor() {
    effect(() => {
      const code = this.code()
      const lang = this.language()
      this.shikiService.highlight(code, lang).then(html => {
        this.highlightedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html))
      })
    })
  }

  protected copyToClipboard() {
    navigator.clipboard.writeText(this.code())
    this.copied.set(true)
    setTimeout(() => this.copied.set(false), 2000)
  }
}
