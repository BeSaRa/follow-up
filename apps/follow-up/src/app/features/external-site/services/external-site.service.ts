import { Injectable, Type } from '@angular/core'
import { HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { CrudWithDialogService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { ExternalSite } from '../models/external-site'
import { ExternalSiteDialog } from '../components/external-site-dialog'
import { Endpoints } from '../../../constants/endpoints'
import { CastResponse, CastResponseContainer } from 'cast-response'

@CastResponseContainer({
  $default: {
    model: () => ExternalSite,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'result.*': () => ExternalSite,
    },
  },
})
@Injectable({ providedIn: 'root' })
export class ExternalSiteService extends RegisterServiceMixin(CrudWithDialogService)<
  ExternalSite,
  ExternalSiteDialog,
  Endpoints,
  number
> {
  $$serviceName = 'ExternalSiteService'

  getSegmentUrl(): string {
    return this.urlService.URLS.EXTERNAL_SITE
  }

  getDialogComponent(): Type<ExternalSiteDialog> {
    return ExternalSiteDialog
  }

  getModelInstance(): ExternalSite {
    return new ExternalSite()
  }

  /**
   * Searches Tawasol-published sites that the user can pick from to seed a
   * new entry. Backend returns a paginated response; the dialog calls this
   * only after the user types at least 3 characters.
   */
  @CastResponse(undefined, { fallback: '$pagination' })
  fetchTawasolSites(
    criteria: string,
    pageNumber = 0,
    pageSize = 10,
  ): Observable<Pagination<ExternalSite[]>> {
    const params = new HttpParams({
      fromObject: {
        pageNumber,
        pageSize,
        sortBy: 'id',
        ascending: false,
        criteria,
      },
    })
    return this.http.get<Pagination<ExternalSite[]>>(
      this.urlService.URLS.EXTERNAL_SITE_TAWASOL,
      { params },
    )
  }
}
