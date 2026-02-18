import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core'
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser'
import type { DecorationItem } from '@shikijs/types'
import { type CodeLanguage, ShikiService } from './shiki.service'

const FOCUS_STYLES = `<style>.sf .line>span:not(.focused){opacity:.35;transition:opacity 150ms}.sf .focused,.sf .focused span{opacity:1}</style>`

function computeFocusDecorations(code: string, terms: string[]): DecorationItem[] {
  if (!terms.length) return []
  const escaped = terms
    .sort((a, b) => b.length - a.length)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp(
    `\\[?(${escaped.join('|')})\\]?(=(?:"[^"]*"|'[^']*'))?`,
    'g',
  )
  const lines = code.split('\n')
  const decorations: DecorationItem[] = []
  for (let line = 0; line < lines.length; line++) {
    let match: RegExpExecArray | null
    pattern.lastIndex = 0
    while ((match = pattern.exec(lines[line])) !== null) {
      decorations.push({
        start: { line, character: match.index },
        end: { line, character: match.index + match[0].length },
        properties: { class: 'focused' },
      })
    }
  }
  return decorations
}

function injectFocusClass(html: string): string {
  return FOCUS_STYLES + html.replace('<pre class="shiki', '<pre class="shiki sf')
}

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
  readonly focusTerms = input<string[]>([])

  protected readonly highlightedHtml = signal<SafeHtml>('')
  protected readonly copied = signal(false)

  constructor() {
    effect(() => {
      const code = this.code()
      const lang = this.language()
      const terms = this.focusTerms()
      const decorations = computeFocusDecorations(code, terms)
      this.shikiService.highlight(code, lang, decorations.length ? decorations : undefined).then(html => {
        this.highlightedHtml.set(
          this.sanitizer.bypassSecurityTrustHtml(decorations.length ? injectFocusClass(html) : html),
        )
      })
    })
  }

  protected copyToClipboard() {
    navigator.clipboard.writeText(this.code())
    this.copied.set(true)
    setTimeout(() => this.copied.set(false), 2000)
  }
}
