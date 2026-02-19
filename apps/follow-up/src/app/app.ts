import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

const LANG_DIR_MAP: Record<string, string> = {
  ar: 'rtl',
  en: 'ltr',
}

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly doc = inject(DOCUMENT)
  private readonly translate = inject(TranslateService)
  private readonly destroyRef = inject(DestroyRef)

  ngOnInit() {
    this.setDocumentDirection(this.translate.currentLang ?? this.translate.defaultLang ?? 'ar')

    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ lang }) => this.setDocumentDirection(lang))
  }

  private setDocumentDirection(lang: string) {
    const dir = LANG_DIR_MAP[lang] ?? 'ltr'
    this.doc.documentElement.dir = dir
    this.doc.documentElement.lang = lang
  }
}
