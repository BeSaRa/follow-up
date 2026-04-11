import { ModelInterceptorContract } from 'cast-response'
import { FollowupSiteInfo } from './followup-site-info'
import { Info } from '../../../shared/models/info'

export class FollowupSiteInfoModelInterceptor implements ModelInterceptorContract<FollowupSiteInfo> {
  send(model: Partial<FollowupSiteInfo>): Partial<FollowupSiteInfo> {
    return model
  }

  receive(model: FollowupSiteInfo): FollowupSiteInfo {
    model.followupStatusResult = new Info().clone(model.followupStatusResult)
    model.mainSite = new Info().clone(model.mainSite)
    model.subSite = new Info().clone(model.subSite)
    model.siteTypeResult = new Info().clone(model.siteTypeResult)
    return model
  }
}
