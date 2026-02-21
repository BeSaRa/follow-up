import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TranslatePipe } from '@ngx-translate/core'

@Component({
  selector: 'app-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <h1 class="text-2xl font-bold text-foreground">
      {{ 'settings.title' | translate }}
    </h1>
  `,
})
export class SettingsPage {}
