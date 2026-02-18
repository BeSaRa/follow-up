import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core'
import {
  UiTable,
  UiTableHeader,
  UiTableBody,
  UiTableRow,
  UiTableHead,
  UiTableCell,
} from '../../table/table'

export interface CssCustomProperty {
  name: string
  default: string
  description: string
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-styles-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiTable,
    UiTableHeader,
    UiTableBody,
    UiTableRow,
    UiTableHead,
    UiTableCell,
  ],
  template: `
    <div class="mt-6">
      @if (properties().length) {
        <div class="overflow-x-auto rounded-lg border border-border">
          <table uiTable>
            <thead uiTableHeader>
              <tr uiTableRow>
                <th uiTableHead>Property</th>
                <th uiTableHead>Default</th>
                <th uiTableHead>Description</th>
              </tr>
            </thead>
            <tbody uiTableBody>
              @for (prop of properties(); track prop.name) {
                <tr uiTableRow>
                  <td uiTableCell><code class="text-xs font-mono text-primary">{{ prop.name }}</code></td>
                  <td uiTableCell><code class="text-xs font-mono">{{ prop.default }}</code></td>
                  <td uiTableCell class="!whitespace-normal">{{ prop.description }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <p class="text-sm text-foreground-muted">
          This component uses Tailwind utility classes and does not expose CSS custom properties.
          Customize its appearance using Tailwind's theme configuration or by overriding the design tokens in your theme file.
        </p>
      }
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class ShowcaseStylesTable {
  readonly properties = input.required<CssCustomProperty[]>()
}
