import { CrudModel } from '@follow-up/core'
import { PriorityLevelService } from '../services/priority-level.service'

export class PriorityLevel extends CrudModel<PriorityLevel, PriorityLevelService> {
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
}
