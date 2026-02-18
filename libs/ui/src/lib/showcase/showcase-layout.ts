import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { SHOWCASE_CATEGORIES } from './component-registry'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen">
      <aside class="w-64 shrink-0 border-r border-border bg-surface overflow-y-auto sticky top-0 h-screen">
        <div class="p-4 border-b border-border">
          <a routerLink="/showcase" class="text-lg font-bold text-foreground hover:text-primary transition-colors">
            UI Showcase
          </a>
          <p class="text-xs text-foreground-muted mt-0.5">Component Library</p>
        </div>
        <nav class="py-2">
          @for (category of categories; track category.label) {
            <div>
              <button
                type="button"
                class="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider
                       text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
                (click)="toggleCategory(category.label)"
              >
                {{ category.label }}
                <svg
                  class="size-3.5 transition-transform"
                  [class.rotate-180]="isCategoryExpanded(category.label)"
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              @if (isCategoryExpanded(category.label)) {
                <div class="flex flex-col pb-1">
                  @for (comp of category.components; track comp.slug) {
                    <a
                      [routerLink]="comp.slug"
                      routerLinkActive="bg-primary/10 text-primary font-medium"
                      class="block px-4 py-1.5 pl-8 text-sm text-foreground-muted hover:text-foreground
                             hover:bg-surface-hover transition-colors"
                    >
                      {{ comp.name }}
                    </a>
                  }
                </div>
              }
            </div>
          }
        </nav>
      </aside>

      <main class="flex-1 overflow-y-auto bg-background">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShowcaseLayout {
  protected readonly categories = SHOWCASE_CATEGORIES
  protected readonly expandedCategories = signal<Set<string>>(
    new Set(SHOWCASE_CATEGORIES.map(c => c.label)),
  )

  protected toggleCategory(label: string) {
    this.expandedCategories.update(set => {
      const next = new Set(set)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  protected isCategoryExpanded(label: string): boolean {
    return this.expandedCategories().has(label)
  }
}
