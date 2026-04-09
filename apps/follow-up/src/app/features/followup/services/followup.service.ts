import { inject, Injectable } from '@angular/core'
import { HttpParams } from '@angular/common/http'
import { MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { CrudService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { DialogService } from '@follow-up/ui'
import { Followup } from '../models/followup'
import { FollowupLog } from '../models/followup-log'
import { FollowupLogsDialog, FollowupLogsDialogData } from '../components/followup-logs-dialog'
import { Endpoints } from '../../../constants/endpoints'
import { UserType } from '../../../shared/enums/user-type'
import { AppStore } from '../../../shared/stores/app-store'
import { CastResponse, CastResponseContainer } from 'cast-response'

@CastResponseContainer({
  $default: {
    model: () => Followup,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'result.*': () => Followup,
    },
  },
})
@Injectable({ providedIn: 'root' })
export class FollowupService extends RegisterServiceMixin(CrudService)<Followup, Endpoints, number> {
  $$serviceName = 'FollowupService'

  private readonly appStore = inject(AppStore)
  private readonly dialogService = inject(DialogService)

  getSegmentUrl(): string {
    return this.urlService.URLS.FOLLOWUP
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  override getAll(options?: Record<string, unknown>): Observable<Pagination<Followup[]>> {
    const url = this.getSegmentUrl() + this._getRightSegmentURL(this.appStore.userType())
    return this.http.get<Pagination<Followup[]>>(url, {
      params: new HttpParams({ fromObject: options as never }),
    })
  }

  // @CastResponse()
  view(id: number): Observable<Followup> {
    return this.http.get<Followup>(`${this.urlService.URLS.CORRESPONDENCE}/${id}`)
  }

  @CastResponse(() => FollowupLog, { unwrap: 'result' })
  private _getLogs(id: number): Observable<FollowupLog[]> {
    return this.http.get<FollowupLog[]>(`${this.urlService.URLS.LOGS}/${id}`)
  }

  viewLogs(followup: Followup): MatDialogRef<FollowupLogsDialog> {
    const loadLogs = () => this._getLogs(followup.id)
    return this.dialogService.open<FollowupLogsDialog, FollowupLogsDialogData>(
      FollowupLogsDialog,
      {
        data: { docSubject: followup.docSubject, loadLogs },
        width: '75rem',
        maxWidth: '95vw',
      },
    )
  }

  getComments(id: number): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.getSegmentUrl()}/${id}/comments`)
  }

  private _getRightSegmentURL(userType: UserType): string {
    switch (userType) {
      case UserType.INTERNAL_USER:
        return '/internal-users'
      case UserType.EXTERNAL_USER:
        return '/external-users'
      case UserType.PMO_HEAD:
        return '/pmo-head'
      default:
        return ''
    }
  }
}
