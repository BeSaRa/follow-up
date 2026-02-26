import { CrudModel } from '@follow-up/core'
import { AttachmentTypeService } from '../services/attachment-type.service'

export class AttachmentType extends CrudModel<AttachmentType, AttachmentTypeService> {
  $$primaryKey = 'id' as const
  $$service = 'AttachmentTypeService'

  id = 0
  category = 0
  arName = ''
  enName = ''
  lookupKey = 0
  lookupStrKey = ''
  status = true
  itemOrder = 0
}
