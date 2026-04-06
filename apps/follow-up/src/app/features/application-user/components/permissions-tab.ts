import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core'
import { TranslatePipe } from '@ngx-translate/core'
import { UiCheckbox, UiSkeleton } from '@follow-up/ui'
import { PermissionService } from '../../../shared/services/permission.service'
import { Permission } from '../../../shared/models/permission'
import { UserPermissionService } from '../services/user-permission.service'

type PermissionGroup = {
  groupId: number
  permissions: Permission[]
}

@Component({
  selector: 'app-permissions-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, UiCheckbox, UiSkeleton],
  template: `
    @if (loading()) {
      <div class="space-y-4 p-2">
        @for (i of [1, 2, 3]; track i) {
          <ui-skeleton width="100%" height="2rem" />
        }
      </div>
    } @else {
      <div class="space-y-6 p-2">
        @for (group of groupedPermissions(); track group.groupId) {
          <div>
            <h3 class="mb-2 text-sm font-semibold text-foreground-muted">
              {{ 'application_user.permission_group' | translate }} {{ group.groupId }}
            </h3>
            <div class="grid grid-cols-2 gap-2">
              @for (perm of group.permissions; track perm.id) {
                <ui-checkbox
                  [checked]="isChecked(perm.id)"
                  [disabled]="viewMode()"
                  (checkedChange)="togglePermission(perm.id, $event)"
                >
                  {{ perm.arName }}
                </ui-checkbox>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class PermissionsTab implements OnInit {
  readonly userId = input.required<number>()
  readonly viewMode = input(false)
  readonly loadingChange = output<boolean>()

  private readonly permissionService = inject(PermissionService)
  private readonly userPermissionService = inject(UserPermissionService)

  readonly loading = signal(true)
  private readonly selectedIds = signal(new Set<number>())

  readonly groupedPermissions = computed(() => {
    const permissions = this.permissionService.models()
    const groups = new Map<number, Permission[]>()

    for (const perm of permissions) {
      if (!groups.has(perm.groupId)) {
        groups.set(perm.groupId, [])
      }
      groups.get(perm.groupId)!.push(perm)
    }

    return Array.from(groups.entries())
      .map(([groupId, permissions]) => ({ groupId, permissions }) as PermissionGroup)
      .sort((a, b) => a.groupId - b.groupId)
  })

  ngOnInit() {
    this.loadingChange.emit(true)

    const loadPermissions = this.permissionService.models().length
      ? undefined
      : this.permissionService.getAll().subscribe()

    this.userPermissionService.getByUserId(this.userId()).subscribe({
      next: (userPermissions) => {
        this.selectedIds.set(new Set(userPermissions.map((up) => up.permissionId)))
        this.loading.set(false)
        this.loadingChange.emit(false)
      },
      error: () => {
        this.loading.set(false)
        this.loadingChange.emit(false)
      },
    })
  }

  isChecked(permissionId: number): boolean {
    return this.selectedIds().has(permissionId)
  }

  togglePermission(permissionId: number, checked: boolean) {
    const current = new Set(this.selectedIds())
    if (checked) {
      current.add(permissionId)
    } else {
      current.delete(permissionId)
    }
    this.selectedIds.set(current)
  }

  getSelectedPermissionIds(): number[] {
    return Array.from(this.selectedIds())
  }
}
