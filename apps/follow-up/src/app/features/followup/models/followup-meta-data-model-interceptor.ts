import { ModelInterceptorContract } from 'cast-response'
import { FollowupMetaData } from './followup-meta-data'
import { FollowupSiteInfo } from './followup-site-info'
import { Info } from '../../../shared/models/info'

export class FollowupMetaDataModelInterceptor implements ModelInterceptorContract<FollowupMetaData> {
  send(model: Partial<FollowupMetaData>): Partial<FollowupMetaData> {
    return model
  }

  receive(model: FollowupMetaData): FollowupMetaData {
    model.documentFileInfo = new Info().clone(model.documentFileInfo)
    model.mainClassificationInfo = new Info().clone(model.mainClassificationInfo)
    model.subClassificationInfo = new Info().clone(model.subClassificationInfo)
    model.creatorOuInfo = new Info().clone(model.creatorOuInfo)
    model.creatorInfo = new Info().clone(model.creatorInfo)
    model.lastModifierInfo = new Info().clone(model.lastModifierInfo)
    model.securityLevelInfo = new Info().clone(model.securityLevelInfo)
    model.priorityLevelInfo = new Info().clone(model.priorityLevelInfo)
    model.docTypeInfo = new Info().clone(model.docTypeInfo)
    model.docStatusInfo = new Info().clone(model.docStatusInfo)
    model.receivedByInfo = new Info().clone(model.receivedByInfo)
    model.registeryOuInfo = new Info().clone(model.registeryOuInfo)
    model.siteInfo = new FollowupSiteInfo().clone(model.siteInfo)
    return model
  }
}
