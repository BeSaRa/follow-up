import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import { MatIcon } from '@angular/material/icon'
import {
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs'
import { UiInput, UiTooltip } from '@follow-up/ui'
import { APP_ICONS } from '../../../constants/icons'
import { FollowupService } from '../../followup/services/followup.service'
import { Followup } from '../../followup/models/followup'

const MIN_SEARCH_CHARS = 2
const DEBOUNCE_MS = 300
const MAX_RESULTS = 8

@Component({
  selector: 'app-quick-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe, MatIcon, UiInput, UiTooltip],
  template: `
    <div class="relative w-full">
      <div class="relative">
        <mat-icon
          class="absolute start-3 top-1/2 -translate-y-1/2 text-lg! size-5! leading-5! text-foreground-subtle pointer-events-none"
          [svgIcon]="icons.MAGNIFY"
        />
        <input
          uiInput
          type="text"
          class="bg-white! ps-10 pe-10"
          [placeholder]="'search.quick_placeholder' | translate"
          [formControl]="searchControl"
          (focus)="onFocus()"
          (keydown.escape)="close()"
        />
        <button
          type="button"
          class="absolute end-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          [uiTooltip]="'search.advanced' | translate"
          (click)="openAdvanced()"
        >
          <mat-icon
            class="text-base! size-4! leading-4!"
            [svgIcon]="icons.TUNE"
          />
        </button>
      </div>

      @if (panelOpen()) {
        <div
          class="absolute start-0 end-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-surface-raised shadow-lg"
        >
          @if (loading()) {
            <div class="px-3 py-3 text-center text-sm text-foreground-muted">
              {{ 'search.loading' | translate }}
            </div>
          } @else if (results().length === 0) {
            <div class="px-3 py-3 text-center text-sm text-foreground-muted">
              {{ 'search.no_results' | translate }}
            </div>
          } @else {
            @for (item of results(); track item.id) {
              <button
                type="button"
                class="block w-full px-3 py-2 text-start transition-colors hover:bg-surface-hover"
                (click)="select(item)"
              >
                <p class="truncate text-sm font-medium text-foreground">
                  {{ item.docSubject }}
                </p>
                @if (item.followUpReference) {
                  <p class="truncate text-xs text-foreground-muted">
                    {{ item.followUpReference }}
                  </p>
                }
              </button>
            }
          }
        </div>
      }
    </div>
  `,
})
export class QuickSearch {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly service = inject(FollowupService)
  private readonly router = inject(Router)
  private readonly destroyRef = inject(DestroyRef)
  protected readonly icons = APP_ICONS

  protected readonly searchControl = new FormControl('', { nonNullable: true })
  protected readonly results = signal<Followup[]>([])
  protected readonly loading = signal(false)
  protected readonly hasSearched = signal(false)
  private readonly isFocused = signal(false)

  /** Dropdown is visible only while the field has focus AND we have content or status. */
  protected readonly panelOpen = computed(
    () => this.isFocused() && (this.loading() || this.hasSearched()),
  )

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(DEBOUNCE_MS),
        distinctUntilChanged(),
        map((v) => (v ?? '').trim()),
        tap((q) => {
          if (q.length < MIN_SEARCH_CHARS) {
            this.results.set([])
            this.hasSearched.set(false)
            this.loading.set(false)
          }
        }),
        switchMap((q) => {
          if (q.length < MIN_SEARCH_CHARS) return of(null)
          this.loading.set(true)
          return this.service.search({
            stringCriteria: q,
            pageSize: MAX_RESULTS,
          })
        }),
      )
      .subscribe({
        next: (page) => {
          if (!page) return
          this.results.set(page.result ?? [])
          this.hasSearched.set(true)
          this.loading.set(false)
        },
        error: () => {
          this.results.set([])
          this.loading.set(false)
        },
      })

    // Close the dropdown when clicking outside the component.
    const onDocMouseDown = (event: MouseEvent) => {
      if (!this.el.nativeElement.contains(event.target as Node)) {
        this.isFocused.set(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    this.destroyRef.onDestroy(() =>
      document.removeEventListener('mousedown', onDocMouseDown),
    )
  }

  protected onFocus(): void {
    this.isFocused.set(true)
  }

  protected close(): void {
    this.isFocused.set(false)
  }

  protected select(item: Followup): void {
    this.service.view(item)
    this.searchControl.setValue('')
    this.results.set([])
    this.hasSearched.set(false)
    this.close()
  }

  protected openAdvanced(): void {
    this.router.navigate(['/search'])
    this.close()
  }
}
