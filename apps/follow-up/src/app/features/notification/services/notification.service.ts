import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { CastResponse } from 'cast-response'
import { injectUrlService } from '@follow-up/core'
import { Notification } from '../models/notification'
import { Endpoints } from '../../../constants/endpoints'

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient)
  private readonly urlService = injectUrlService<Endpoints>()

  private readonly _notifications = signal<Notification[]>([])
  readonly notifications = this._notifications.asReadonly()

  readonly unreadCount = () => this._notifications().filter(n => !n.isRead).length

  @CastResponse(() => Notification, { unwrap: 'result' })
  private _loadActive(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.urlService.URLS.NOTIFICATION_ACTIVE)
  }

  loadActive(): Observable<Notification[]> {
    return this._loadActive().pipe(
      tap(notifications => this._notifications.set(notifications)),
    )
  }

  markAsRead(id: number): Observable<unknown> {
    return this.http.put<unknown>(
      `${this.urlService.URLS.NOTIFICATION_SET_READ}/${id}`,
      {},
    ).pipe(
      tap(() => {
        this._notifications.update(list =>
          list.map(n => n.id === id ? n.clone<Notification>({ isRead: true }) : n),
        )
      }),
    )
  }

  @CastResponse(() => Notification, { unwrap: 'result' })
  open(id: number): Observable<Notification> {
    return this.http.get<Notification>(
      `${this.urlService.URLS.NOTIFICATION_OPEN}/${id}`,
    )
  }
}
