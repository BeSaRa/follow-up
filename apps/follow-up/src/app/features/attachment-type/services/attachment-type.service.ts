import { Injectable } from '@angular/core'
import { CrudService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { AttachmentType } from '../models/attachment-type'
import { Endpoints } from '../../../constants/endpoints'
import { CastResponseContainer } from 'cast-response'

@CastResponseContainer({
  $default: {
    model: () => AttachmentType,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'result.*': () => AttachmentType,
    },
  },
})
@Injectable({ providedIn: 'root' })
export class AttachmentTypeService extends RegisterServiceMixin(CrudService)<
  AttachmentType,
  Endpoints,
  number
> {
  $$serviceName = 'AttachmentTypeService'

  getSegmentUrl(): string {
    return this.urlService.URLS.ATTACHMENT_TYPE
  }

  override getGetAllEndpoint(): string {
    return this.urlService.URLS.ATTACHMENT_TYPE_LOOKUPS
  }
}
