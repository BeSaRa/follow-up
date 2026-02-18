import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core'
import { ShowcaseCodeBlock } from './code-block'

type CodeTab = 'html' | 'ts' | 'css'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-example-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShowcaseCodeBlock],
  template: `
    <div class="rounded-lg border border-border overflow-hidden">
      <div class="px-4 py-3 border-b border-border bg-surface flex items-center justify-between">
        <div>
          <h3 class="text-sm font-semibold text-foreground">{{ title() }}</h3>
          @if (description(); as desc) {
            <p class="mt-0.5 text-xs text-foreground-muted">{{ desc }}</p>
          }
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md
                 text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
          (click)="toggleCode()"
        >
          @if (showCode()) {
            <svg class="size-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 7 7 17"/><path d="M7 7h10v10"/>
            </svg>
            Hide Code
          } @else {
            <svg class="size-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            View Code
          }
        </button>
      </div>

      <div class="p-6 bg-background">
        <ng-content />
      </div>

      @if (showCode()) {
        <div class="border-t border-border">
          <div class="flex gap-1 px-4 pt-2 bg-surface">
            @if (htmlCode()) {
              <button type="button"
                class="px-3 py-1 text-xs font-medium rounded-t-md transition-colors cursor-pointer"
                [class]="activeTab() === 'html'
                  ? 'bg-background text-foreground'
                  : 'text-foreground-muted hover:text-foreground'"
                (click)="activeTab.set('html')">
                HTML
              </button>
            }
            @if (tsCode()) {
              <button type="button"
                class="px-3 py-1 text-xs font-medium rounded-t-md transition-colors cursor-pointer"
                [class]="activeTab() === 'ts'
                  ? 'bg-background text-foreground'
                  : 'text-foreground-muted hover:text-foreground'"
                (click)="activeTab.set('ts')">
                TypeScript
              </button>
            }
            @if (cssCode()) {
              <button type="button"
                class="px-3 py-1 text-xs font-medium rounded-t-md transition-colors cursor-pointer"
                [class]="activeTab() === 'css'
                  ? 'bg-background text-foreground'
                  : 'text-foreground-muted hover:text-foreground'"
                (click)="activeTab.set('css')">
                CSS
              </button>
            }
          </div>
          @switch (activeTab()) {
            @case ('html') {
              <showcase-code-block [code]="htmlCode()" language="html" [focusTerms]="focusTerms()" />
            }
            @case ('ts') {
              <showcase-code-block [code]="tsCode()" language="typescript" [focusTerms]="focusTerms()" />
            }
            @case ('css') {
              <showcase-code-block [code]="cssCode()" language="css" [focusTerms]="focusTerms()" />
            }
          }
        </div>
      }
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class ShowcaseExampleViewer {
  readonly title = input('')
  readonly description = input('')
  readonly htmlCode = input('')
  readonly tsCode = input('')
  readonly cssCode = input('')
  readonly focusTerms = input<string[]>([])

  protected readonly showCode = signal(false)
  protected readonly activeTab = signal<CodeTab>('html')

  protected toggleCode() {
    this.showCode.update(v => !v)
    if (this.showCode()) {
      this.activeTab.set(
        this.htmlCode() ? 'html' :
        this.tsCode() ? 'ts' :
        this.cssCode() ? 'css' : 'html',
      )
    }
  }
}
