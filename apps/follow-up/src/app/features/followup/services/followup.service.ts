import { inject, Injectable } from '@angular/core'
import { HttpParams } from '@angular/common/http'
import { MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { CrudService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { DialogService } from '@follow-up/ui'
import { Followup } from '../models/followup'
import { FollowupLog } from '../models/followup-log'
import { FollowupAttachment } from '../models/followup-attachment'
import { FollowupMetaData } from '../models/followup-meta-data'
import { FollowupOpen } from '../models/followup-open'
import { FollowupLogsDialog, FollowupLogsDialogData } from '../components/followup-logs-dialog'
import { FollowupOpenDialog, FollowupOpenDialogData } from '../components/followup-open-dialog'
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

  @CastResponse(() => FollowupOpen, {
    unwrap: 'result.rs',
    shape: {
      'metaData': () => FollowupMetaData,
      'linkedAttachments.*': () => FollowupAttachment,
      'followupAttachments.*': () => FollowupAttachment,
      'guidanceAttachments.*': () => FollowupAttachment,
    },
  })
  private _open(id: number): Observable<FollowupOpen> {
    return this.http.get<FollowupOpen>(`${this.urlService.URLS.CORRESPONDENCE}/${id}`)
  }

  view(followup: Followup): MatDialogRef<FollowupOpenDialog> {
    const loadFollowup = () => this._open(followup.id)
    return this.dialogService.open<FollowupOpenDialog, FollowupOpenDialogData>(
      FollowupOpenDialog,
      {
        data: { docSubject: followup.docSubject, loadFollowup },
        width: '100vw',
        maxWidth: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        panelClass: 'fullscreen-dialog',
      },
    )
  }

  @CastResponse(() => FollowupLog, { unwrap: 'result' })
  private _getLogs(id: number): Observable<FollowupLog[]> {
    return this.http.get<FollowupLog[]>(`${this.urlService.URLS.LOGS}/${id}`)
  }

  @CastResponse(() => FollowupLog, { unwrap: 'result' })
  addComment(followupId: number, userComments: string): Observable<FollowupLog> {
    return this.http.post<FollowupLog>(
      `${this.urlService.URLS.USER_COMMENTS}/${followupId}`,
      { userComments },
    )
  }

  uploadCommentAttachment(followupId: number, followupLinkedId: number, file: File): Observable<unknown> {
    const formData = new FormData()
    formData.append('content', file, file.name)
    return this.http.post<unknown>(this.urlService.URLS.USER_COMMENTS_ATTACHMENT, formData, {
      params: new HttpParams({ fromObject: { followupId, followupLinkedId } }),
    })
  }

  viewLogs(followup: Followup): MatDialogRef<FollowupLogsDialog> {
    const loadLogs = () => this._getLogs(followup.id)
    return this.dialogService.open<FollowupLogsDialog, FollowupLogsDialogData>(
      FollowupLogsDialog,
      {
        data: { followupId: followup.id, docSubject: followup.docSubject, loadLogs },
        width: '75rem',
        maxWidth: '95vw',
      },
    )
  }

  @CastResponse(undefined, { unwrap: 'result.content' })
  getAttachmentById(vsId: string): Observable<string> {
    return this.http.get<string>(`${this.urlService.URLS.ATTACHMENTS}/${vsId}`)
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
