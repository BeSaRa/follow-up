import { Injectable, Type } from '@angular/core'
import { CrudWithDialogService, RegisterServiceMixin } from '@follow-up/core'
import { ApplicationUser } from '../models/application-user'
import { ApplicationUserDialog } from '../components/application-user-dialog'
import { Endpoints } from '../../../constants/endpoints'
import { CastResponseContainer } from 'cast-response'
import { Pagination } from '@follow-up/core'

@CastResponseContainer({
  $default: {
    model: () => ApplicationUser,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'result.*': () => ApplicationUser,
    },
  },
})
@Injectable({ providedIn: 'root' })
export class ApplicationUserService extends RegisterServiceMixin(CrudWithDialogService)<
  ApplicationUser,
  ApplicationUserDialog,
  Endpoints,
  number
> {
  $$serviceName = 'ApplicationUserService'

  getSegmentUrl(): string {
    return this.urlService.URLS.APPLICATION_USER
  }

  getDialogComponent(): Type<ApplicationUserDialog> {
    return ApplicationUserDialog
  }

  getModelInstance(): ApplicationUser {
    return new ApplicationUser()
  }
}
