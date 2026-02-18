import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { SHOWCASE_CATEGORIES } from './component-registry'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="max-w-5xl mx-auto p-8">
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-foreground">UI Component Library</h1>
        <p class="mt-2 text-foreground-muted">
          Browse all {{ totalComponents }} components. Each page includes live examples, API reference, and styling documentation.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (category of categories; track category.label) {
          <div class="rounded-lg border border-border bg-surface p-5">
            <h2 class="text-base font-semibold text-foreground mb-1">{{ category.label }}</h2>
            <p class="text-xs text-foreground-muted mb-3">{{ category.components.length }} components</p>
            <div class="flex flex-wrap gap-1.5">
              @for (comp of category.components; track comp.slug) {
                <a
                  [routerLink]="comp.slug"
                  class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md
                         bg-surface-hover text-foreground-muted hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  {{ comp.name }}
                </a>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ShowcaseHome {
  protected readonly categories = SHOWCASE_CATEGORIES
  protected readonly totalComponents = SHOWCASE_CATEGORIES.reduce(
    (sum, cat) => sum + cat.components.length,
    0,
  )
}
