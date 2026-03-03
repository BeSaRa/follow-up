import { Type, inject } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { DialogService } from '@follow-up/ui'
import { CrudService } from './crud-service'

export type CrudDialogMode = 'CREATE' | 'UPDATE'

export interface CrudDialogData<Model> {
  mode: CrudDialogMode
  model?: Model
}

export interface CrudWithDialogServiceContract<Model, Component> {
  dialogService: DialogService
  getDialogComponent(): Type<Component>
  getModelInstance(): Model
  openCreateDialog(model?: Model): MatDialogRef<Component>
  openUpdateDialog(model: Model): MatDialogRef<Component>
}

export abstract class CrudWithDialogService<
  Model,
  Component,
  EndPoints extends Record<string, string>,
  PrimaryKeyType = number,
> extends CrudService<Model, EndPoints, PrimaryKeyType>
  implements CrudWithDialogServiceContract<Model, Component>
{
  readonly dialogService = inject(DialogService)

  abstract getDialogComponent(): Type<Component>
  abstract getModelInstance(): Model

  openCreateDialog(model?: Model): MatDialogRef<Component> {
    return this.dialogService.open<Component, CrudDialogData<Model>>(this.getDialogComponent(), {
      data: { mode: 'CREATE', model: model ?? this.getModelInstance() },
    })
  }

  openUpdateDialog(model: Model): MatDialogRef<Component> {
    return this.dialogService.open<Component, CrudDialogData<Model>>(this.getDialogComponent(), {
      data: { mode: 'UPDATE', model },
    })
  }
}
