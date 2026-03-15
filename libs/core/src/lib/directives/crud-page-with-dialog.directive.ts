import { Directive, inject } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import { filter } from 'rxjs'
import { DialogService, ToastService } from '@follow-up/ui'
import { CrudWithDialogServiceContract } from '../services/crud-with-dialog-service'
import { CrudModelContract } from '../classes/crud-model'
import { CrudPageDirective } from './crud-page.directive'

@Directive()
export abstract class CrudPageWithDialogDirective<
  TModel extends CrudModelContract<TModel>,
  TService extends CrudWithDialogServiceContract<TModel, unknown>,
> extends CrudPageDirective<TModel, TService> {
  private readonly dialogService = inject(DialogService)
  private readonly toast = inject(ToastService)
  private readonly translate = inject(TranslateService)

  openCreateDialog(model?: TModel): MatDialogRef<unknown> {
    return this.service.openCreateDialog(model)
  }

  openUpdateDialog(model: TModel): MatDialogRef<unknown> {
    return this.service.openUpdateDialog(model)
  }

  openViewDialog(model: TModel): MatDialogRef<unknown> {
    return this.service.openViewDialog(model)
  }

  confirmDelete(model: TModel) {
    this.dialogService
      .confirm(
        this.translate.instant('common.delete_confirm'),
        this.translate.instant('common.delete_title'),
        this.translate.instant('common.delete'),
        this.translate.instant('common.cancel'),
      )
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        model.delete().subscribe({
          next: () => {
            this.toast.success(this.translate.instant('common.delete_success'))
            this.refresh()
          },
        })
      })
  }
}
