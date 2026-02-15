import { ComponentType } from '@angular/cdk/overlay'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
  TemplateRef,
} from '@angular/core'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog'
import { UiButton } from '../button/button'

export type DialogVariant = 'error' | 'success' | 'info' | 'warning'

export interface DialogData {
  title?: string
  content: string
  variant: DialogVariant
}

export interface ConfirmDialogData {
  title?: string
  content: string
  acceptText?: string
  rejectText?: string
}

const VARIANT_STYLES: Record<DialogVariant, { icon: string; color: string }> = {
  error: {
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
    color: 'text-error',
  },
  success: {
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    color: 'text-success',
  },
  info: {
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    color: 'text-info',
  },
  warning: {
    icon: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    color: 'text-warning',
  },
}

const DEFAULT_TITLES: Record<DialogVariant, string> = {
  error: 'Error',
  success: 'Success',
  info: 'Information',
  warning: 'Warning',
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiButton],
  template: `
    <div class="flex flex-col gap-4 p-6">
      <div class="flex items-start gap-3">
        <svg
          class="size-6 shrink-0 mt-0.5"
          [class]="variantStyle.color"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path [attr.d]="variantStyle.icon" />
        </svg>
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-foreground">{{ data.title ?? defaultTitle }}</h2>
          <p class="mt-1 text-sm text-foreground-muted">{{ data.content }}</p>
        </div>
      </div>
      <div class="flex justify-end">
        <button uiButton variant="primary" (click)="dialogRef.close()">OK</button>
      </div>
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class DialogComponent {
  protected readonly data = inject<DialogData>(MAT_DIALOG_DATA)
  protected readonly dialogRef = inject(MatDialogRef)
  protected readonly variantStyle = VARIANT_STYLES[this.data.variant]
  protected readonly defaultTitle = DEFAULT_TITLES[this.data.variant]
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiButton],
  template: `
    <div class="flex flex-col gap-4 p-6">
      <div class="flex-1">
        <h2 class="text-lg font-semibold text-foreground">{{ data.title ?? 'Confirm' }}</h2>
        <p class="mt-2 text-sm text-foreground-muted">{{ data.content }}</p>
      </div>
      <div class="flex justify-end gap-2">
        <button uiButton variant="outline" (click)="dialogRef.close(false)">{{ data.rejectText ?? 'Cancel' }}</button>
        <button uiButton variant="primary" (click)="dialogRef.close(true)">{{ data.acceptText ?? 'Confirm' }}</button>
      </div>
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA)
  protected readonly dialogRef = inject(MatDialogRef)
}

export interface DialogServiceContract {
  open<T, D = unknown, R = unknown>(
    template: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig<D>,
  ): MatDialogRef<T, R>
  confirm(
    content: string,
    title?: string,
    acceptText?: string,
    rejectText?: string,
  ): MatDialogRef<ConfirmDialogComponent, boolean>
  error<R = unknown>(
    content: string,
    title?: string,
  ): MatDialogRef<DialogComponent, R>
  success<R = unknown>(
    content: string,
    title?: string,
  ): MatDialogRef<DialogComponent, R>
  info<R = unknown>(
    content: string,
    title?: string,
  ): MatDialogRef<DialogComponent, R>
  warning<R = unknown>(
    content: string,
    title?: string,
  ): MatDialogRef<DialogComponent, R>
}

@Injectable({ providedIn: 'root' })
export class DialogService implements DialogServiceContract {
  private readonly dialog = inject(MatDialog)

  open<T, D = unknown, R = unknown>(
    template: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig<D>,
  ): MatDialogRef<T, R> {
    return this.dialog.open<T, D, R>(template, {
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      ...config,
    })
  }

  confirm(
    content: string,
    title?: string,
    acceptText?: string,
    rejectText?: string,
  ): MatDialogRef<ConfirmDialogComponent, boolean> {
    return this.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      {
        data: { content, title, acceptText, rejectText },
        width: '28rem',
      },
    )
  }

  error<R = unknown>(content: string, title?: string): MatDialogRef<DialogComponent, R> {
    return this.openVariant<R>('error', content, title)
  }

  success<R = unknown>(content: string, title?: string): MatDialogRef<DialogComponent, R> {
    return this.openVariant<R>('success', content, title)
  }

  info<R = unknown>(content: string, title?: string): MatDialogRef<DialogComponent, R> {
    return this.openVariant<R>('info', content, title)
  }

  warning<R = unknown>(content: string, title?: string): MatDialogRef<DialogComponent, R> {
    return this.openVariant<R>('warning', content, title)
  }

  private openVariant<R>(
    variant: DialogVariant,
    content: string,
    title?: string,
  ): MatDialogRef<DialogComponent, R> {
    return this.open<DialogComponent, DialogData, R>(
      DialogComponent,
      {
        data: { content, title, variant },
        width: '28rem',
      },
    )
  }
}
