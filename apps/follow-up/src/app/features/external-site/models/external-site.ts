import { Validators } from '@angular/forms'
import { CrudModel, HasForm } from '@follow-up/core'
import { ExternalSiteService } from '../services/external-site.service'

export class SiteTypeInfo {
  id = 0
  arName = ''
  enName = ''
}

export class ExternalSite extends CrudModel<ExternalSite, ExternalSiteService> implements HasForm {
  $$primaryKey = 'id' as const
  $$service = 'ExternalSiteService'

  id = 0
  arName = ''
  enName = ''
  description = ''
  ldapPrefix = ''
  status = true
  siteTypeInfo = new SiteTypeInfo()

  buildForm() {
    return {
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      description: [''],
      ldapPrefix: [''],
      status: [true],
    }
  }
}
