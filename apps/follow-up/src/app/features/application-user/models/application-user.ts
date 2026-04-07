import { Validators } from '@angular/forms'
import { CrudModel, HasForm } from '@follow-up/core'
import type { InfoType } from '../../../shared/types/info-type'
import { ApplicationUserService } from '../services/application-user.service'

export class ApplicationUser extends CrudModel<ApplicationUser, ApplicationUserService> implements HasForm {
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
  domainName = ''
  enableEmailNotification = false
  userTypeInfo: InfoType = { id: 0, arName: '', enName: '' }
  externalEntityInfo?: InfoType

  buildForm() {
    return {
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      employeeNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: [''],
      domainName: ['', Validators.required],
      qid: ['', Validators.required],
      userType: [0, Validators.required],
      externalEntity: [0],
      status: [true],
      enableEmailNotification: [false],
    }
  }
}
