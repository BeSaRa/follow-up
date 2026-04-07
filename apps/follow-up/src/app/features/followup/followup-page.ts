import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TranslatePipe } from '@ngx-translate/core'

@Component({
  selector: 'app-followup-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <h1 class="text-2xl font-bold text-foreground">
      {{ 'followup.title' | translate }}
    </h1>
  `,
})
export class FollowupPage {}
