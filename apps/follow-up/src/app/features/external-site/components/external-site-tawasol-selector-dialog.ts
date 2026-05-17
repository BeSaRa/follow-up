import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { MatIcon } from '@angular/material/icon'
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  of,
  switchMap,
  tap,
} from 'rxjs'
import { UiInput, UiSkeleton } from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { ExternalSiteService } from '../services/external-site.service'
import { ExternalSite } from '../models/external-site'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 500

@Component({
  selector: 'app-external-site-tawasol-selector-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatIcon,
    UiInput,
    UiSkeleton,
  ],
  template: `
    <div class="flex h-[32rem] w-[36rem] max-w-full flex-col">
      <div
        class="flex items-center justify-between border-b border-border px-6 py-4"
      >
        <h2 class="text-lg font-semibold text-foreground">
          {{ 'external_site.tawasol_select_title' | translate }}
        </h2>
        <button
          type="button"
          class="text-foreground-muted hover:text-foreground transition-colors"
          (click)="dialogRef.close()"
        >
          <mat-icon
            [svgIcon]="icons.CLOSE"
            class="text-xl! size-5! leading-5!"
          />
        </button>
      </div>

      <div class="border-b border-border px-6 py-3">
        <div class="relative">
          <mat-icon
            class="absolute start-3 top-1/2 -translate-y-1/2 text-lg! size-5! leading-5! text-foreground-subtle"
            [svgIcon]="icons.MAGNIFY"
          />
          <input
            uiInput
            type="text"
            class="bg-surface! ps-10"
            [formControl]="searchControl"
            [placeholder]="
              'external_site.tawasol_search_placeholder' | translate
            "
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-3">
        @switch (state()) {
          @case ('loading') {
            <div class="space-y-2">
              @for (i of skeletonRows; track i) {
                <ui-skeleton width="100%" height="3rem" />
              }
            </div>
          }
          @case ('empty') {
            <div
              class="flex h-full items-center justify-center text-sm text-foreground-muted"
            >
              {{ 'external_site.no_tawasol_sites' | translate }}
            </div>
          }
          @case ('results') {
            <div class="space-y-1">
              @for (site of sites(); track site.id) {
                <button
                  type="button"
                  class="block w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-start transition-colors hover:border-primary hover:bg-surface-hover"
                  (click)="onSelect(site)"
                >
                  <p class="truncate">
                    <span class="font-medium text-foreground">
                      {{ isArabic() ? site.arName : site.enName }}
                    </span>
                    @if (site.siteTypeInfo?.id) {
                      <span class="text-xs text-foreground-muted">
                        /
                        {{
                          isArabic()
                            ? site.siteTypeInfo.arName
                            : site.siteTypeInfo.enName
                        }}
                      </span>
                    }
                  </p>
                  @if (site.ldapPrefix) {
                    <p class="truncate text-xs text-foreground-muted">
                      {{ site.ldapPrefix }}
                    </p>
                  }
                </button>
              }
              @if (hasMoreHint()) {
                <p
                  class="px-1 pt-2 text-center text-xs text-foreground-subtle"
                >
                  {{
                    'external_site.tawasol_top_results_hint'
                      | translate: { count: pageSize }
                  }}
                </p>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class ExternalSiteTawasolSelectorDialog {
  readonly dialogRef = inject(
    MatDialogRef<ExternalSiteTawasolSelectorDialog, ExternalSite | undefined>,
  )
  private readonly service = inject(ExternalSiteService)
  private readonly translate = inject(TranslateService)
  private readonly destroyRef = inject(DestroyRef)
  protected readonly icons = APP_ICONS
  protected readonly skeletonRows = [1, 2, 3, 4, 5] as const
  protected readonly pageSize = PAGE_SIZE

  protected readonly sites = signal<ExternalSite[]>([])
  // Initial fetch fires synchronously in the constructor — start in
  // 'loading' so the dialog never flashes the empty state.
  protected readonly loading = signal(true)
  protected readonly searchControl = new FormControl('', {
    nonNullable: true,
  })

  protected readonly isArabic = computed(
    () => (this.translate.currentLang || 'ar') === 'ar',
  )

  /** 'loading' | 'empty' | 'results' — drives the UI. */
  protected readonly state = computed<'loading' | 'empty' | 'results'>(() => {
    if (this.loading()) return 'loading'
    return this.sites().length === 0 ? 'empty' : 'results'
  })

  protected readonly hasMoreHint = computed(
    () => this.sites().length >= PAGE_SIZE,
  )

  constructor() {
    // Initial load with empty criteria + debounced search on user input,
    // merged into one stream so they share the same switchMap (cancels any
    // in-flight call when the user types).
    merge(
      of(''),
      this.searchControl.valueChanges.pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        map((v) => (v ?? '').trim()),
      ),
    )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.loading.set(true)),
        switchMap((q) => this.service.fetchTawasolSites(q)),
      )
      .subscribe({
        next: (page) => {
          this.sites.set(page.result ?? [])
          this.loading.set(false)
        },
        error: () => {
          this.sites.set([])
          this.loading.set(false)
        },
      })
  }

  protected onSelect(site: ExternalSite): void {
    this.dialogRef.close(site)
  }
}
