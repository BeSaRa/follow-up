import {
  computed,
  Directive,
  effect,
  signal,
  Signal,
  untracked,
  WritableSignal,
} from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { CrudServiceContract } from '../services/crud-service'
import { Pagination } from '../classes/pagination'

export interface PageChangeEvent {
  pageIndex: number
  pageSize: number
}

export interface CrudPageConfig {
  debounceTime?: number
  defaultPageSize?: number
  skeletonRowCount?: number
}

export interface CrudPageContract<TModel> {
  readonly pageIndex: WritableSignal<number>
  readonly pageSize: WritableSignal<number>
  readonly searchQuery: WritableSignal<string>
  readonly loading: WritableSignal<boolean>
  readonly error: Signal<string | null>
  readonly pagination: WritableSignal<Pagination<TModel[]> | null>
  readonly models: Signal<TModel[]>
  readonly totalElements: Signal<number>
  readonly skeletonRows: number[]
  onPageChange(event: PageChangeEvent): void
  onSearchInput(event: Event): void
  refresh(): void
}

const DEFAULT_CONFIG: Required<CrudPageConfig> = {
  debounceTime: 300,
  defaultPageSize: 10,
  skeletonRowCount: 5,
}

@Directive()
export abstract class CrudPageDirective<
  TModel,
  TService extends CrudServiceContract<TModel, unknown>,
> implements CrudPageContract<TModel> {
  abstract readonly service: TService
  abstract readonly icons: Record<string, string>

  readonly pageIndex = signal(0)
  readonly pageSize: WritableSignal<number>
  readonly searchQuery = signal('')
  readonly loading = signal(false)
  readonly error = signal<string | null>(null)
  readonly pagination = signal<Pagination<TModel[]> | null>(null)

  readonly models: Signal<TModel[]>
  readonly totalElements: Signal<number>
  readonly skeletonRows: number[]

  private readonly debouncedSearch: Signal<string>

  protected getConfig(): CrudPageConfig {
    return {}
  }

  constructor() {
    const cfg = { ...DEFAULT_CONFIG, ...this.getConfig() }

    this.pageSize = signal(cfg.defaultPageSize)
    this.models = computed(() => this.pagination()?.result ?? [])
    this.totalElements = computed(
      () => this.pagination()?.totalElements ?? 0,
    )
    this.skeletonRows = Array.from(
      { length: cfg.skeletonRowCount },
      (_, i) => i,
    )

    this.debouncedSearch = toSignal(
      toObservable(this.searchQuery).pipe(
        debounceTime(cfg.debounceTime),
        distinctUntilChanged(),
      ),
      { initialValue: '' },
    )

    effect(() => {
      const page = this.pageIndex()
      const size = this.pageSize()
      const search = this.debouncedSearch()
      untracked(() => this.loadData(page, size, search))
    })
  }

  protected buildLoadOptions(
    page: number,
    size: number,
    search: string,
  ): Record<string, unknown> {
    const options: Record<string, unknown> = { page, size }
    if (search) options['criteria'] = search
    return options
  }

  private loadData(page: number, size: number, search: string) {
    this.loading.set(true)
    this.error.set(null)
    const options = this.buildLoadOptions(page, size, search)
    this.service.getAll(options).subscribe({
      next: (result) => {
        this.pagination.set(result)
        this.loading.set(false)
      },
      error: (err) => {
        this.loading.set(false)
        this.error.set(err?.message ?? 'unknown_error')
      },
    })
  }

  onPageChange(event: PageChangeEvent) {
    this.pageIndex.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.searchQuery.set(value)
    this.pageIndex.set(0)
  }

  refresh() {
    this.loadData(
      this.pageIndex(),
      this.pageSize(),
      this.debouncedSearch(),
    )
  }
}
