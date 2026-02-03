import { Component } from '@angular/core'
import { injectConfigService, injectUrlService } from '@follow-up/core'
import { AppConfigs } from './constants/app-configs'
import { Endpoints } from './constants/endpoints'

@Component({
  imports: [],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  service = injectConfigService<AppConfigs>()
  urls = injectUrlService<Endpoints>()
}
