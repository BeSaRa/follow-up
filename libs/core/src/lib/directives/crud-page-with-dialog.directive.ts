import { Directive } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { CrudWithDialogServiceContract } from '../services/crud-with-dialog-service'
import { CrudPageDirective } from './crud-page.directive'

@Directive()
export abstract class CrudPageWithDialogDirective<
  TModel,
  TService extends CrudWithDialogServiceContract<TModel, unknown>,
> extends CrudPageDirective<TModel, TService> {
  openCreateDialog(model?: TModel): MatDialogRef<unknown> {
    return this.service.openCreateDialog(model)
  }

  openUpdateDialog(model: TModel): MatDialogRef<unknown> {
    return this.service.openUpdateDialog(model)
  }

  openViewDialog(model: TModel): MatDialogRef<unknown> {
    return this.service.openViewDialog(model)
  }
}
