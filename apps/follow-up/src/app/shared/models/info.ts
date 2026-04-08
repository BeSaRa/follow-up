import type { InfoContract } from '@follow-up/contracts'
import { Cloner, LangNameMixin } from '@follow-up/util'

export class Info extends LangNameMixin(Cloner) implements InfoContract {
  id = 0
  override arName = ''
  override enName = ''
}
