import { CrudModel } from '@follow-up/core'
import { ExternalSiteService } from '../services/external-site.service'

export class SiteTypeInfo {
  id = 0
  arName = ''
  enName = ''
}

export class ExternalSite extends CrudModel<ExternalSite, ExternalSiteService> {
  $$primaryKey = 'id' as const
  $$service = 'ExternalSiteService'

  id = 0
  arName = ''
  enName = ''
  description = ''
  ldapPrefix = ''
  status = true
  siteTypeInfo = new SiteTypeInfo()
}
