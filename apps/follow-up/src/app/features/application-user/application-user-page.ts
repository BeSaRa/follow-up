import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { TranslatePipe } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { ApplicationUserService } from './services/application-user.service'
import { ApplicationUser } from './models/application-user'

@Component({
  selector: 'app-application-user-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, TranslatePipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">{{ 'application_user.title' | translate }}</h1>

      @if (users$ | async; as users) {
        @if (users.length) {
          <div class="overflow-x-auto rounded-lg border border-border">
            <table class="min-w-full divide-y divide-border">
              <thead class="bg-primary text-primary-foreground">
                <tr>
                  <th class="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider">{{ 'application_user.employee_no' | translate }}</th>
                  <th class="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider">{{ 'application_user.ar_name' | translate }}</th>
                  <th class="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider">{{ 'application_user.en_name' | translate }}</th>
                  <th class="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider">{{ 'application_user.email' | translate }}</th>
                  <th class="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider">{{ 'application_user.mobile' | translate }}</th>
                  <th class="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider">{{ 'application_user.qid' | translate }}</th>
                  <th class="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider">{{ 'application_user.status' | translate }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                @for (user of users; track user.id) {
                  <tr class="hover:bg-surface-hover transition-colors">
                    <td class="whitespace-nowrap px-4 py-3 text-sm">{{ user.employeeNo }}</td>
                    <td class="whitespace-nowrap px-4 py-3 text-sm">{{ user.arName }}</td>
                    <td class="whitespace-nowrap px-4 py-3 text-sm">{{ user.enName }}</td>
                    <td class="whitespace-nowrap px-4 py-3 text-sm">{{ user.email }}</td>
                    <td class="whitespace-nowrap px-4 py-3 text-sm">{{ user.mobile }}</td>
                    <td class="whitespace-nowrap px-4 py-3 text-sm">{{ user.qid }}</td>
                    <td class="whitespace-nowrap px-4 py-3 text-sm">
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
