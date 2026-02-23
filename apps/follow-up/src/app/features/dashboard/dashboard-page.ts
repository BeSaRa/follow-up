import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TranslatePipe } from '@ngx-translate/core'

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <h1 class="text-2xl font-bold text-foreground">
      {{ 'dashboard.title' | translate }}
    </h1>
  `,
})
export class DashboardPage {}
