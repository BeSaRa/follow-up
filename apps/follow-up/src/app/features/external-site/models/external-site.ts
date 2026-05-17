import { Validators } from '@angular/forms'
import { CrudModel, HasForm } from '@follow-up/core'
import type { InfoContract } from '@follow-up/contracts'
import { ExternalSiteService } from '../services/external-site.service'

export class ExternalSite extends CrudModel<ExternalSite, ExternalSiteService> implements HasForm {
  $$primaryKey = 'id' as const
  $$service = 'ExternalSiteService'

  id = 0
  arName = ''
  enName = ''
  description = ''
  ldapPrefix = ''
  status = true
  siteTypeInfo: InfoContract = { id: 0, arName: '', enName: '' }

  buildForm() {
    return {
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      description: [''],
      // ldapPrefix is always disabled — value seeded from the selected
      // Tawasol site and never edited by hand. Disabled controls aren't
      // included in form.value, but prepareModel() clones from data.model
      // so the original value is preserved on submit.
      ldapPrefix: [{ value: '', disabled: true }],
      status: [true],
    }
  }
}
