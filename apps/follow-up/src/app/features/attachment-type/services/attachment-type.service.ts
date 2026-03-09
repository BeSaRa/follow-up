import { Injectable, Type } from '@angular/core'
import { CrudWithDialogService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { AttachmentType } from '../models/attachment-type'
import { AttachmentTypeDialog } from '../components/attachment-type-dialog'
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
export class AttachmentTypeService extends RegisterServiceMixin(CrudWithDialogService)<
  AttachmentType,
  AttachmentTypeDialog,
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

  getDialogComponent(): Type<AttachmentTypeDialog> {
    return AttachmentTypeDialog
  }

  getModelInstance(): AttachmentType {
    return new AttachmentType()
  }
}
