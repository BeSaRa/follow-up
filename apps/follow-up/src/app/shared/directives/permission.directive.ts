import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core'
import { AppStore } from '../stores/app-store'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasPermission]',
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef)
  private readonly vcr = inject(ViewContainerRef)
  private readonly appStore = inject(AppStore)

  readonly hasPermission = input.required<string>()

  private hasView = false

  constructor() {
    effect(() => {
      const map = this.appStore.permissionMap()
      const granted = !!map[this.hasPermission()]
      this.updateView(granted)
    })
  }

  private updateView(granted: boolean) {
    if (granted && !this.hasView) {
      this.vcr.createEmbeddedView(this.templateRef)
      this.hasView = true
    } else if (!granted && this.hasView) {
      this.vcr.clear()
      this.hasView = false
    }
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasAnyPermission]',
})
export class HasAnyPermissionDirective {
  private readonly templateRef = inject(TemplateRef)
  private readonly vcr = inject(ViewContainerRef)
  private readonly appStore = inject(AppStore)

  readonly hasAnyPermission = input.required<string[]>()

  private hasView = false

  constructor() {
    effect(() => {
      const map = this.appStore.permissionMap()
      const granted = this.hasAnyPermission().some((key) => !!map[key])
      this.updateView(granted)
    })
  }

  private updateView(granted: boolean) {
    if (granted && !this.hasView) {
      this.vcr.createEmbeddedView(this.templateRef)
      this.hasView = true
    } else if (!granted && this.hasView) {
      this.vcr.clear()
      this.hasView = false
    }
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasAllPermissions]',
})
export class HasAllPermissionsDirective {
  private readonly templateRef = inject(TemplateRef)
  private readonly vcr = inject(ViewContainerRef)
  private readonly appStore = inject(AppStore)

  readonly hasAllPermissions = input.required<string[]>()

  private hasView = false

  constructor() {
    effect(() => {
      const map = this.appStore.permissionMap()
      const granted = this.hasAllPermissions().every((key) => !!map[key])
      this.updateView(granted)
    })
  }

  private updateView(granted: boolean) {
    if (granted && !this.hasView) {
      this.vcr.createEmbeddedView(this.templateRef)
      this.hasView = true
    } else if (!granted && this.hasView) {
      this.vcr.clear()
      this.hasView = false
    }
  }
}
