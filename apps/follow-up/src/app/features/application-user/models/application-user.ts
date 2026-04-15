import { Validators } from '@angular/forms'
import { CrudModel, HasForm } from '@follow-up/core'
import { InterceptModel } from 'cast-response'
import { ApplicationUserService } from '../services/application-user.service'
import { ApplicationUserModelInterceptor } from './application-user-model-interceptor'
import { Info } from '../../../shared/models/info'

@InterceptModel(new ApplicationUserModelInterceptor())
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
  userTypeInfo = new Info()
  externalEntityInfo = new Info()

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
