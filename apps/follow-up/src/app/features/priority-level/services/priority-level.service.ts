import { Injectable, Type } from '@angular/core'
import { CrudWithDialogService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { PriorityLevel } from '../models/priority-level'
import { PriorityLevelDialog } from '../components/priority-level-dialog'
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
export class PriorityLevelService extends RegisterServiceMixin(CrudWithDialogService)<
  PriorityLevel,
  PriorityLevelDialog,
  Endpoints,
  number
> {
  $$serviceName = 'PriorityLevelService'

  getSegmentUrl(): string {
    return this.urlService.URLS.PRIORITY_LEVEL
  }

  override getGetAllEndpoint(): string {
    return this.urlService.URLS.PRIORITY_LEVEL_LOOKUPS
  }

  getDialogComponent(): Type<PriorityLevelDialog> {
    return PriorityLevelDialog
  }

  getModelInstance(): PriorityLevel {
    return new PriorityLevel()
  }
}
