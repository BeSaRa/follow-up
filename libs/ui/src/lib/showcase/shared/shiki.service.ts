import { Injectable } from '@angular/core'
import type { HighlighterCore } from 'shiki'

export type CodeLanguage = 'typescript' | 'html' | 'css'

@Injectable({ providedIn: 'root' })
export class ShikiService {
  private highlighterPromise: Promise<HighlighterCore> | null = null

  private getHighlighter(): Promise<HighlighterCore> {
    if (!this.highlighterPromise) {
      this.highlighterPromise = import('shiki').then(({ createHighlighter }) =>
        createHighlighter({
          themes: ['github-light', 'github-dark'],
          langs: ['typescript', 'html', 'css'],
        }),
      )
    }
    return this.highlighterPromise
  }

  async highlight(code: string, lang: CodeLanguage): Promise<string> {
    const highlighter = await this.getHighlighter()
    return highlighter.codeToHtml(code, {
      lang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    })
  }
}
