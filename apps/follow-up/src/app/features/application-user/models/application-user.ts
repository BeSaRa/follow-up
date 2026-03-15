import { Validators } from '@angular/forms'
import { CrudModel, HasForm } from '@follow-up/core'
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
  enableEmailNotification = false

  buildForm() {
    return {
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      employeeNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: [''],
      qid: [''],
      status: [true],
      enableEmailNotification: [false],
    }
  }
}
