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
  UiBadge,
  UiSpinner,
  UiAlert,
  UiAlertTitle,
  UiAlertDescription,
  UiTabs,
  UiTabList,
  UiTab,
  UiTabPanel,
  DialogService,
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
    UiBadge,
    UiSpinner,
    UiAlert,
    UiAlertTitle,
    UiAlertDescription,
    UiTabs,
    UiTabList,
    UiTab,
    UiTabPanel,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private doc = inject(DOCUMENT)
  private dialogService = inject(DialogService)
  service = injectConfigService<AppConfigs>()
  urls = injectUrlService<Endpoints>()

  isDark = signal(false)

  toggleDarkMode() {
    this.isDark.update(v => !v)
    this.doc.documentElement.classList.toggle('dark', this.isDark())
  }

  openConfirm() {
    this.dialogService.confirm('Are you sure you want to proceed?', 'Please Confirm')
  }

  openError() {
    this.dialogService.error('Something went wrong. Please try again later.')
  }

  openSuccess() {
    this.dialogService.success('Your changes have been saved successfully.')
  }

  openInfo() {
    this.dialogService.info('A new version is available. Refresh to update.')
  }

  openWarning() {
    this.dialogService.warning('Your session will expire in 5 minutes.')
  }
}
