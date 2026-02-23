import { Injectable } from '@angular/core'
import { CrudService, RegisterServiceMixin } from '@follow-up/core'
import { ApplicationUser } from '../models/application-user'
import { Endpoints } from '../../../constants/endpoints'

@Injectable({ providedIn: 'root' })
export class ApplicationUserService extends RegisterServiceMixin(CrudService)<
  ApplicationUser,
  Endpoints,
  number
> {
  $$serviceName = 'ApplicationUserService'

  getSegmentUrl(): string {
    return this.urlService.URLS.APPLICATION_USER
  }
}
