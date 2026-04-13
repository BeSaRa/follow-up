import { inject, Injectable } from '@angular/core'
import { HttpParams } from '@angular/common/http'
import qs from 'qs'
import { MatDialogRef } from '@angular/material/dialog'
import { map, Observable } from 'rxjs'
import { CrudService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { DialogService } from '@follow-up/ui'
import { Followup } from '../models/followup'
import { FollowupLog } from '../models/followup-log'
import { FollowupComment } from '../models/followup-comment'
import { FollowupStatement } from '../models/followup-statement'
import { FollowupAttachment } from '../models/followup-attachment'
import { FollowupMetaData } from '../models/followup-meta-data'
import { FollowupOpen } from '../models/followup-open'
import { FollowupLogsDialog, FollowupLogsDialogData } from '../components/followup-logs-dialog'
import { FollowupOpenDialog, FollowupOpenDialogData } from '../components/followup-open-dialog'
import {
  FollowupAddCommentDialog,
  FollowupAddCommentDialogData,
  FollowupAddCommentResult,
} from '../components/followup-add-comment-dialog'
import {
  FollowupAddStatementDialog,
  FollowupAddStatementDialogData,
  FollowupAddStatementResult,
} from '../components/followup-add-statement-dialog'
import {
  FollowupEntriesDialog,
  FollowupEntriesDialogData,
} from '../components/followup-entries-dialog'
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

  addComment(followupId: number, userComments: string): Observable<number> {
    return this.http
      .post<{ result: number }>(
        `${this.urlService.URLS.USER_COMMENTS}/${followupId}`,
        { userComments },
      )
      .pipe(map((response) => response.result))
  }

  uploadCommentAttachment(
    followupId: number,
    followupLinkedId: number,
    attachmentTypeId: number,
    docSubject: string,
    file: File,
  ): Observable<unknown> {
    const formData = new FormData()
    formData.append('content', file, file.name)
    const query = qs.stringify(
      {
        followupId,
        followupLinkedId,
        docSubject,
        attachmentTypeInfo: { id: attachmentTypeId },
      },
      { allowDots: true, encode: false },
    )
    console.log('[uploadCommentAttachment] query:', query)
    return this.http.post<unknown>(
      `${this.urlService.URLS.USER_COMMENTS_ATTACHMENT}?${query}`,
      formData,
    )
  }

  addStatement(followupId: number, userStatement: string): Observable<number> {
    return this.http
      .post<{ result: number }>(
        `${this.urlService.URLS.USER_STATEMENTS}/${followupId}`,
        { userStatement },
      )
      .pipe(map((response) => response.result))
  }

  uploadStatementAttachment(
    followupId: number,
    followupLinkedId: number,
    attachmentTypeId: number,
    docSubject: string,
    file: File,
  ): Observable<unknown> {
    const formData = new FormData()
    formData.append('content', file, file.name)
    const query = qs.stringify(
      {
        followupId,
        followupLinkedId,
        docSubject,
        attachmentTypeInfo: { id: attachmentTypeId },
      },
      { allowDots: true, encode: false },
    )
    console.log('[uploadStatementAttachment] query:', query)
    return this.http.post<unknown>(
      `${this.urlService.URLS.USER_STATEMENTS_ATTACHMENT}?${query}`,
      formData,
    )
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

  openAddComment(
    followup: Followup,
  ): MatDialogRef<FollowupAddCommentDialog, FollowupAddCommentResult> {
    return this.dialogService.open<
      FollowupAddCommentDialog,
      FollowupAddCommentDialogData,
      FollowupAddCommentResult
    >(FollowupAddCommentDialog, {
      data: { followupId: followup.id },
    })
  }

  openAddStatement(
    followup: Followup,
  ): MatDialogRef<FollowupAddStatementDialog, FollowupAddStatementResult> {
    return this.dialogService.open<
      FollowupAddStatementDialog,
      FollowupAddStatementDialogData,
      FollowupAddStatementResult
    >(FollowupAddStatementDialog, {
      data: { followupId: followup.id },
    })
  }

  @CastResponse(undefined, { unwrap: 'result.content' })
  getAttachmentById(vsId: string): Observable<string> {
    return this.http.get<string>(`${this.urlService.URLS.ATTACHMENTS}/${vsId}`)
  }

  @CastResponse(undefined, { unwrap: 'result.content' })
  getAttachmentContent(vsId: string): Observable<string> {
    return this.http.get<string>(`${this.urlService.URLS.LOG_ATTACHMENT_CONTENT}/${vsId}`)
  }

  @CastResponse(() => FollowupComment, { unwrap: 'result' })
  getComments(followupId: number): Observable<FollowupComment[]> {
    return this.http.get<FollowupComment[]>(`${this.urlService.URLS.USER_COMMENTS}/${followupId}`)
  }

  @CastResponse(() => FollowupStatement, { unwrap: 'result' })
  getStatements(followupId: number): Observable<FollowupStatement[]> {
    return this.http.get<FollowupStatement[]>(`${this.urlService.URLS.USER_STATEMENTS}/${followupId}`)
  }

  viewComments(followup: Followup): MatDialogRef<FollowupEntriesDialog<FollowupComment>> {
    return this.dialogService.open<
      FollowupEntriesDialog<FollowupComment>,
      FollowupEntriesDialogData<FollowupComment>
    >(FollowupEntriesDialog, {
      data: {
        titleKey: 'followup.comments_title',
        emptyKey: 'followup.comments_no_data',
        addLabelKey: 'followup.add_comment',
        docSubject: followup.docSubject,
        loadEntries: () => this.getComments(followup.id),
        getText: (entry) => entry.userComments,
        openAdd: () => this.openAddComment(followup),
      },
      width: '48rem',
      maxWidth: '95vw',
    })
  }

  viewStatements(followup: Followup): MatDialogRef<FollowupEntriesDialog<FollowupStatement>> {
    return this.dialogService.open<
      FollowupEntriesDialog<FollowupStatement>,
      FollowupEntriesDialogData<FollowupStatement>
    >(FollowupEntriesDialog, {
      data: {
        titleKey: 'followup.statements_title',
        emptyKey: 'followup.statements_no_data',
        addLabelKey: 'followup.add_statement',
        docSubject: followup.docSubject,
        loadEntries: () => this.getStatements(followup.id),
        getText: (entry) => entry.userStatement,
        openAdd: () => this.openAddStatement(followup),
      },
      width: '48rem',
      maxWidth: '95vw',
    })
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
