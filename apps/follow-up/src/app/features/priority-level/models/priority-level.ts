import { Validators } from '@angular/forms'
import { CrudModel, HasForm } from '@follow-up/core'
import { PriorityLevelService } from '../services/priority-level.service'

export class PriorityLevel extends CrudModel<PriorityLevel, PriorityLevelService> implements HasForm {
  $$primaryKey = 'id' as const
  $$service = 'PriorityLevelService'

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
