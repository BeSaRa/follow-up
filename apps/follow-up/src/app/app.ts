import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { injectConfigService, injectUrlService } from '@follow-up/core'
import {
  UiButton,
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
  UiCardContent,
  UiCardFooter,
} from '@follow-up/ui'
import { AppConfigs } from './constants/app-configs'
import { Endpoints } from './constants/endpoints'

@Component({
  imports: [
    UiButton,
    UiCard,
    UiCardHeader,
    UiCardTitle,
    UiCardDescription,
    UiCardContent,
    UiCardFooter,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private doc = inject(DOCUMENT)
  service = injectConfigService<AppConfigs>()
  urls = injectUrlService<Endpoints>()

  isDark = signal(false)

  toggleDarkMode() {
    this.isDark.update(v => !v)
    this.doc.documentElement.classList.toggle('dark', this.isDark())
  }
}
