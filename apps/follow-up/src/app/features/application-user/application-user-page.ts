import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import {
  UiBreadcrumb, UiBreadcrumbItem, UiBreadcrumbSeparatorItem,
  UiTable, UiTableHeader, UiTableBody, UiTableRow, UiTableHead, UiTableCell,
} from '@follow-up/ui'
import { Observable } from 'rxjs'
import { ApplicationUserService } from './services/application-user.service'
import { ApplicationUser } from './models/application-user'

@Component({
  selector: 'app-application-user-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe, RouterLink, TranslatePipe,
    UiBreadcrumb, UiBreadcrumbItem, UiBreadcrumbSeparatorItem,
    UiTable, UiTableHeader, UiTableBody, UiTableRow, UiTableHead, UiTableCell,
  ],
  template: `
    <div class="space-y-4">
      <ui-breadcrumb>
        <ui-breadcrumb-item><a routerLink="/dashboard">{{ 'layout.dashboard' | translate }}</a></ui-breadcrumb-item>
        <ui-breadcrumb-separator>»</ui-breadcrumb-separator>
        <ui-breadcrumb-item active>{{ 'application_user.title' | translate }}</ui-breadcrumb-item>
      </ui-breadcrumb>
      <h1 class="text-lg font-semibold">{{ 'application_user.title' | translate }}</h1>

      @if (users$ | async; as users) {
        @if (users.length) {
          <div class="overflow-x-auto rounded-lg border border-border">
            <table uiTable striped>
              <thead uiTableHeader>
                <tr uiTableRow>
                  <th uiTableHead>{{ 'application_user.employee_no' | translate }}</th>
                  <th uiTableHead>{{ 'application_user.ar_name' | translate }}</th>
                  <th uiTableHead>{{ 'application_user.en_name' | translate }}</th>
                  <th uiTableHead>{{ 'application_user.email' | translate }}</th>
                  <th uiTableHead>{{ 'application_user.mobile' | translate }}</th>
                  <th uiTableHead>{{ 'application_user.qid' | translate }}</th>
                  <th uiTableHead>{{ 'application_user.status' | translate }}</th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (user of users; track user.id) {
                  <tr uiTableRow>
                    <td uiTableCell>{{ user.employeeNo }}</td>
                    <td uiTableCell>{{ user.arName }}</td>
                    <td uiTableCell>{{ user.enName }}</td>
                    <td uiTableCell>{{ user.email }}</td>
                    <td uiTableCell>{{ user.mobile }}</td>
                    <td uiTableCell>{{ user.qid }}</td>
                    <td uiTableCell>
                      @if (user.status) {
                        <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          {{ 'application_user.active' | translate }}
                        </span>
                      } @else {
                        <span class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          {{ 'application_user.inactive' | translate }}
                        </span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <p class="text-foreground-muted">{{ 'application_user.no_data' | translate }}</p>
        }
      }
    </div>
  `,
})
export class ApplicationUserPage implements OnInit {
  private readonly service = inject(ApplicationUserService)
  users$!: Observable<ApplicationUser[]>

  ngOnInit() {
    this.users$ = this.service.getAll()
  }
}
