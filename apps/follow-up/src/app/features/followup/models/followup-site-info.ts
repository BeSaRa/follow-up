import type { FollowupSiteInfoContract } from '@follow-up/contracts'
import { Cloner } from '@follow-up/util'
import { InterceptModel } from 'cast-response'
import { Info } from '../../../shared/models/info'
import { FollowupSiteInfoModelInterceptor } from './followup-site-info-model-interceptor'

@InterceptModel(new FollowupSiteInfoModelInterceptor())
export class FollowupSiteInfo extends Cloner implements FollowupSiteInfoContract {
  exportStatus = false
  exportWay = 0
  faxNumber = ''
  followupDate = ''
  followupStatus = 0
  followupStatusResult = new Info()
  hasFax = false
  mainSite = new Info()
  mainSiteId = 0
  siteCategory = 0
  siteType = 0
  siteTypeResult = new Info()
  status = false
  subSite = new Info()
  subSiteId = 0
}
