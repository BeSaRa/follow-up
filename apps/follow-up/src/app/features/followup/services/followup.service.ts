import { inject, Injectable, signal } from '@angular/core'
import { HttpParams } from '@angular/common/http'
import qs from 'qs'
import { MatDialogRef } from '@angular/material/dialog'
import { map, Observable, of, shareReplay, tap } from 'rxjs'
import { CrudService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { DialogService } from '@follow-up/ui'
import { Followup } from '../models/followup'
import { FollowupLog } from '../models/followup-log'
import { FollowupComment } from '../models/followup-comment'
import { FollowupAttachment } from '../models/followup-attachment'
import { InternalUser } from '../models/internal-user'
import { FollowupDashboardCounters } from '../models/followup-dashboard-counters'
import { FollowupMetaData } from '../models/followup-meta-data'
import { FollowupOpen } from '../models/followup-open'
import { FollowupLogsDialog, FollowupLogsDialogData } from '../components/followup-logs-dialog'
import {
  FollowupOpenDialog,
  FollowupOpenDialogData,
  FollowupOpenDialogResult,
} from '../components/followup-open-dialog'
import {
  FollowupAddCommentDialog,
  FollowupAddCommentDialogData,
  FollowupAddCommentResult,
} from '../components/followup-add-comment-dialog'
import {
  FollowupEntriesDialog,
  FollowupEntriesDialogData,
} from '../components/followup-entries-dialog'
import {
  FollowupAssignUserDialog,
  FollowupAssignUserDialogData,
  FollowupAssignUserResult,
} from '../components/followup-assign-user-dialog'
import {
  FollowupTerminateDialog,
  FollowupTerminateDialogData,
  FollowupTerminateResult,
} from '../components/followup-terminate-dialog'
import {
  FollowupChangeStatusDialog,
  FollowupChangeStatusDialogData,
  FollowupChangeStatusResult,
} from '../components/followup-change-status-dialog'
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

  canTerminate(followup: Followup): boolean {
    const userType = this.appStore.userType()
    if (userType === UserType.PMO_HEAD) return true
    if (userType === UserType.INTERNAL_USER) {
      const currentUserId = this.appStore.applicationUser()?.id
      return !!currentUserId && currentUserId === followup.assignedUserInfo.id
    }
    return false
  }

  view(followup: Followup): MatDialogRef<FollowupOpenDialog, FollowupOpenDialogResult> {
    const loadFollowup = () => this._open(followup.id)
    return this.dialogService.open<
      FollowupOpenDialog,
      FollowupOpenDialogData,
      FollowupOpenDialogResult
    >(
      FollowupOpenDialog,
      {
        data: {
          docSubject: followup.docSubject,
          loadFollowup,
          followupId: followup.id,
          canTerminate: this.canTerminate(followup),
          currentStatusId: followup.followUpStatusInfo.id,
        },
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

  @CastResponse(undefined, { unwrap: 'result.content' })
  getAttachmentById(vsId: string): Observable<string> {
    return this.http.get<string>(`${this.urlService.URLS.ATTACHMENTS}/${vsId}`)
  }

  @CastResponse(undefined, { unwrap: 'result.content' })
  getAttachmentContent(vsId: string): Observable<string> {
    return this.http.get<string>(`${this.urlService.URLS.LOG_ATTACHMENT_CONTENT}/${vsId}`)
  }

  @CastResponse(() => FollowupDashboardCounters, { unwrap: 'result' })
  getDashboardCounters(): Observable<FollowupDashboardCounters> {
    return this.http.get<FollowupDashboardCounters>(
      this.urlService.URLS.FOLLOWUP_DASHBOARD_COUNTERS,
    )
  }

  private readonly _internalUsers = signal<InternalUser[]>([])
  readonly internalUsers = this._internalUsers.asReadonly()
  private internalUsers$?: Observable<InternalUser[]>

  @CastResponse(() => InternalUser, { unwrap: 'result' })
  private fetchAssignableUsers(): Observable<InternalUser[]> {
    return this.http.get<InternalUser[]>(this.urlService.URLS.INTERNAL_USERS_LOOKUP)
  }

  loadAssignableUsers(): Observable<InternalUser[]> {
    if (this._internalUsers().length) {
      return of(this._internalUsers())
    }
    if (!this.internalUsers$) {
      this.internalUsers$ = this.fetchAssignableUsers().pipe(
        tap((users) => this._internalUsers.set(users)),
        shareReplay({ bufferSize: 1, refCount: false }),
      )
    }
    return this.internalUsers$
  }

  clearInternalUsersCache(): void {
    this._internalUsers.set([])
    this.internalUsers$ = undefined
  }

  updateAssignee(payload: {
    followupId: number
    userId: number
    dueDate: string
    userComments: string
    followupStatus?: number
  }): Observable<unknown> {
    return this.http.put<unknown>(this.urlService.URLS.UPDATE_ASSIGNEE, {
      followupId: payload.followupId,
      followupStatus: payload.followupStatus ?? 0,
      userComments: payload.userComments,
      dueDate: payload.dueDate,
      userId: payload.userId,
    })
  }

  changeStatus(
    followupId: number,
    followupStatus: number,
    userComments?: string,
  ): Observable<unknown> {
    const body: Record<string, unknown> = { followupId, followupStatus }
    if (userComments) body['userComments'] = userComments
    return this.http.put<unknown>(this.urlService.URLS.CHANGE_FOLLOWUP_STATUS, body)
  }

  openChangeStatus(
    followupId: number,
    currentStatusId?: number,
  ): MatDialogRef<FollowupChangeStatusDialog, FollowupChangeStatusResult> {
    return this.dialogService.open<
      FollowupChangeStatusDialog,
      FollowupChangeStatusDialogData,
      FollowupChangeStatusResult
    >(FollowupChangeStatusDialog, {
      data: { followupId, currentStatusId },
    })
  }

  terminate(followupId: number, userComments?: string): Observable<unknown> {
    const body: Record<string, unknown> = { followupId }
    if (userComments) body['userComments'] = userComments
    return this.http.put<unknown>(this.urlService.URLS.TERMINATE_FOLLOWUP, body)
  }

  openTerminate(
    followupId: number,
  ): MatDialogRef<FollowupTerminateDialog, FollowupTerminateResult> {
    return this.dialogService.open<
      FollowupTerminateDialog,
      FollowupTerminateDialogData,
      FollowupTerminateResult
    >(FollowupTerminateDialog, {
      data: { followupId },
    })
  }

  openAssignUser(
    followup: Followup,
  ): MatDialogRef<FollowupAssignUserDialog, FollowupAssignUserResult> {
    return this.dialogService.open<
      FollowupAssignUserDialog,
      FollowupAssignUserDialogData,
      FollowupAssignUserResult
    >(FollowupAssignUserDialog, {
      data: {
        followupId: followup.id,
        currentAssigneeId: followup.assignedUserInfo.id > 0 ? followup.assignedUserInfo.id : undefined,
        currentDueDate: followup.dueDate,
      },
    })
  }

  @CastResponse(() => FollowupComment, { unwrap: 'result' })
  getComments(followupId: number): Observable<FollowupComment[]> {
    return this.http.get<FollowupComment[]>(`${this.urlService.URLS.USER_COMMENTS}/${followupId}`)
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
