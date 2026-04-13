import { Cloner, LangNameMixin } from '@follow-up/util'
import { Info } from '../../../shared/models/info'

export class InternalUser extends LangNameMixin(Cloner) {
  id = 0
  override arName = ''
  override enName = ''
  enableEmailNotification = false
  externalEntityInfo: Info | null = null
}
