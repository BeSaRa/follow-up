import { Component } from '@angular/core'
import { injectConfigService } from '@follow-up/core'
import { AppConfigs } from './constants/app-configs'

@Component({
  imports: [],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  service = injectConfigService<AppConfigs>()

  constructor() {
    console.log(this.service.CONFIG)
  }
}
