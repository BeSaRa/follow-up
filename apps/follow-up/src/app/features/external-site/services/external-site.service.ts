import { Injectable, Type } from '@angular/core'
import { CrudWithDialogService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { ExternalSite } from '../models/external-site'
import { ExternalSiteDialog } from '../components/external-site-dialog'
import { Endpoints } from '../../../constants/endpoints'
import { CastResponseContainer } from 'cast-response'

@CastResponseContainer({
  $default: {
    model: () => ExternalSite,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'result.*': () => ExternalSite,
    },
  },
})
@Injectable({ providedIn: 'root' })
export class ExternalSiteService extends RegisterServiceMixin(CrudWithDialogService)<
  ExternalSite,
  ExternalSiteDialog,
  Endpoints,
  number
> {
  $$serviceName = 'ExternalSiteService'

  getSegmentUrl(): string {
    return this.urlService.URLS.EXTERNAL_SITE
  }

  getDialogComponent(): Type<ExternalSiteDialog> {
    return ExternalSiteDialog
  }

  getModelInstance(): ExternalSite {
    return new ExternalSite()
  }
}
