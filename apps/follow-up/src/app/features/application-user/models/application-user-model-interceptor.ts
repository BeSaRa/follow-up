import { ModelInterceptorContract } from 'cast-response'
import { ApplicationUser } from './application-user'
import { Info } from '../../../shared/models/info'

export class ApplicationUserModelInterceptor implements ModelInterceptorContract<ApplicationUser> {
  send(model: Partial<ApplicationUser>): Partial<ApplicationUser> {
    return model
  }

  receive(model: ApplicationUser): ApplicationUser {
    model.userTypeInfo = new Info().clone(model.userTypeInfo)
    model.externalEntityInfo = new Info().clone(model.externalEntityInfo)
    return model
  }
}
