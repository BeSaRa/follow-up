import { CrudModel } from '@follow-up/core'
import { ApplicationUserService } from '../services/application-user.service'

export class ApplicationUser extends CrudModel<ApplicationUser, ApplicationUserService> {
  $$primaryKey = 'id' as const
  $$service = 'ApplicationUserService'

  id = 0
  arName = ''
  enName = ''
  employeeNo = ''
  status = true
  qid = ''
  email = ''
  mobile = ''
  enableEmailNotification = false
}
