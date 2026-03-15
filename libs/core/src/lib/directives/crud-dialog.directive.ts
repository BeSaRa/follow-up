import { DestroyRef, Directive, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import { delay, filter, from, Observable, of, exhaustMap, tap } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ToastService } from '@follow-up/ui'
import { ClonerContract } from '@follow-up/util'
import { CrudDialogData, CrudDialogMode } from '../services/crud-with-dialog-service'
import { CrudModelContract } from '../classes/crud-model'
import { HasForm } from '../interfaces/has-form'

export type CrudDialogModelContract<TModel> = CrudModelContract<TModel> & ClonerContract & HasForm

export interface CrudDialogTitleKeys {
  create: string
  update: string
  view: string
}

export interface CrudDialogContract<TModel extends CrudDialogModelContract<TModel>> {
  readonly dialogRef: MatDialogRef<unknown>
  readonly data: CrudDialogData<TModel>
  readonly form: FormGroup
  readonly saving: ReturnType<typeof signal<boolean>>
  readonly isViewMode: boolean
  readonly titleKey: string
  readonly destroyRef: DestroyRef
  readonly titleKeys: CrudDialogTitleKeys
  afterBuildForm(): void
  validate(): boolean | Observable<boolean> | Promise<boolean>
  prepareModel(): TModel
  afterSaveSuccess(saved: TModel): void
  afterSaveFail(error: unknown): void
  onSubmit(): void
}

@Directive()
export abstract class CrudDialogDirective<TModel extends CrudDialogModelContract<TModel>>
  implements OnInit, CrudDialogContract<TModel>
{
  readonly dialogRef = inject(MatDialogRef)
  readonly data = inject<CrudDialogData<TModel>>(MAT_DIALOG_DATA)
  protected readonly toast = inject(ToastService)
  protected readonly translate = inject(TranslateService)
  protected readonly fb = inject(FormBuilder)
  readonly destroyRef = inject(DestroyRef)

  form!: FormGroup
  readonly saving = signal(false)

  abstract readonly titleKeys: CrudDialogTitleKeys

  afterBuildForm(): void {}

  validate(): boolean | Observable<boolean> | Promise<boolean> {
    return this.form.valid
  }

  prepareModel(): TModel {
    const model = this.data.model!
    return model.clone<TModel>(this.form.value)
  }

  afterSaveSuccess(saved: TModel): void {
    this.toast.success(this.translate.instant('common.save_success'))
    this.dialogRef.close(saved)
  }

  afterSaveFail(error: unknown): void {
    this.saving.set(false)
  }

  populateForm() {
    if (this.data.model && this.data.mode !== 'CREATE') {
      this.form.patchValue(this.data.model)
    }
  }

  get isViewMode() {
    return this.data.mode === 'VIEW'
  }

  get titleKey() {
    const map: Record<CrudDialogMode, string> = {
      CREATE: this.titleKeys.create,
      UPDATE: this.titleKeys.update,
      VIEW: this.titleKeys.view,
    }
    return map[this.data.mode]
  }

  ngOnInit() {
    of(undefined)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => (this.form = this.fb.group(this.data.model!.buildForm()))),
        delay(0),
        tap(() => this.afterBuildForm()),
        tap(() => this.populateForm()),
        tap(() => {
          if (this.isViewMode) {
            this.form.disable()
          }
        }),
      )
      .subscribe()
  }

  private toObservable(value: boolean | Observable<boolean> | Promise<boolean>): Observable<boolean> {
    if (typeof value === 'boolean') return of(value)
    if (value instanceof Promise) return from(value)
    return value
  }

  onSubmit() {
    if (this.isViewMode) return

    of(undefined)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.saving.set(true)),
        exhaustMap(() => this.toObservable(this.validate())),
        filter(Boolean),
        exhaustMap(() => this.prepareModel().save()),
      )
      .subscribe({
        next: (saved) => this.afterSaveSuccess(saved as TModel),
        error: (err) => this.afterSaveFail(err),
      })
  }
}
