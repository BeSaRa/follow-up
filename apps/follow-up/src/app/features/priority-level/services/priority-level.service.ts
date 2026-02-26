import { Injectable } from '@angular/core'
import { CrudService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { PriorityLevel } from '../models/priority-level'
import { Endpoints } from '../../../constants/endpoints'
import { CastResponseContainer } from 'cast-response'

@CastResponseContainer({
  $default: {
    model: () => PriorityLevel,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'result.*': () => PriorityLevel,
    },
  },
})
@Injectable({ providedIn: 'root' })
export class PriorityLevelService extends RegisterServiceMixin(CrudService)<
  PriorityLevel,
  Endpoints,
  number
> {
  $$serviceName = 'PriorityLevelService'

  getSegmentUrl(): string {
    return this.urlService.URLS.PRIORITY_LEVEL
  }
}
