import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { TranslatePipe } from '@ngx-translate/core'
import { FollowupService } from './services/followup.service'
import { AppStore } from '../../shared/stores/app-store'

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
export class FollowupPage implements OnInit {
  private followupService = inject(FollowupService)
  private appStore = inject(AppStore)

  ngOnInit(): void {
    this.followupService.load(this.appStore.userType()).subscribe(res => {
      console.log(res)
    })
  }
}
