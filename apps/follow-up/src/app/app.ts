import { Component, inject } from '@angular/core'
import { UrlService } from '@follow-up/core'

@Component({
  imports: [],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  service = inject(UrlService)
}
