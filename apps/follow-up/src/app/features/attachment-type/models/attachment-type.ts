import { Validators } from '@angular/forms'
import { CrudModel, HasForm } from '@follow-up/core'
import { AttachmentTypeService } from '../services/attachment-type.service'

export class AttachmentType extends CrudModel<AttachmentType, AttachmentTypeService> implements HasForm {
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

  buildForm() {
    return {
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      lookupKey: [0, Validators.required],
      lookupStrKey: [''],
      category: [0],
      status: [true],
    }
  }
}
