import { Injectable } from '@angular/core'
import { CrudService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { ExternalSite } from '../models/external-site'
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
export class ExternalSiteService extends RegisterServiceMixin(CrudService)<
  ExternalSite,
  Endpoints,
  number
> {
  $$serviceName = 'ExternalSiteService'

  getSegmentUrl(): string {
    return this.urlService.URLS.EXTERNAL_SITE
  }
}
