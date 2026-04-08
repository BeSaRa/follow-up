import type { InfoContract } from '@follow-up/contracts'
import { Cloner } from '@follow-up/util'

export class Info extends Cloner implements InfoContract {
  id = 0
  arName = ''
  enName = ''
}
