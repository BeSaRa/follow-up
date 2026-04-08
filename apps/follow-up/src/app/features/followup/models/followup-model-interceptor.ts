import { ModelInterceptorContract } from 'cast-response'
import { Followup } from './followup'
import { Info } from '../../../shared/models/info'

export class FollowupModelInterceptor implements ModelInterceptorContract<Followup> {
  send(model: Partial<Followup>): Partial<Followup> {
    return model
  }

  receive(model: Followup): Followup {
    model.docClassInfo = new Info().clone(model.docClassInfo)
    model.externalEntityInfo = new Info().clone(model.externalEntityInfo)
    model.subExternalEntityInfo = new Info().clone(model.subExternalEntityInfo)
    model.securityLevelInfo = new Info().clone(model.securityLevelInfo)
    model.siteTypeInfo = new Info().clone(model.siteTypeInfo)
    model.priorityLevelInfo = new Info().clone(model.priorityLevelInfo)
    model.followUpStatusInfo = new Info().clone(model.followUpStatusInfo)
    model.assignedUserInfo = new Info().clone(model.assignedUserInfo)
    return model
  }
}
