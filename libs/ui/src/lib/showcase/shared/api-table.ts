import {
  ChangeDetectionStrategy,
  Component,
  computed,
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

export interface ApiProperty {
  name: string
  type: string
  default: string
  description: string
  kind: 'input' | 'output' | 'model' | 'method'
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'showcase-api-table',
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
    <div class="space-y-6 mt-6">
      @if (inputs().length) {
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-3">Inputs</h3>
          <div class="overflow-x-auto rounded-lg border border-border">
            <table uiTable>
              <thead uiTableHeader>
                <tr uiTableRow>
                  <th uiTableHead>Name</th>
                  <th uiTableHead>Type</th>
                  <th uiTableHead>Default</th>
                  <th uiTableHead>Description</th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (prop of inputs(); track prop.name) {
                  <tr uiTableRow>
                    <td uiTableCell><code class="text-xs font-mono text-primary">{{ prop.name }}</code></td>
                    <td uiTableCell><code class="text-xs font-mono text-foreground-muted">{{ prop.type }}</code></td>
                    <td uiTableCell><code class="text-xs font-mono">{{ prop.default }}</code></td>
                    <td uiTableCell class="!whitespace-normal">{{ prop.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      @if (outputs().length) {
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-3">Outputs</h3>
          <div class="overflow-x-auto rounded-lg border border-border">
            <table uiTable>
              <thead uiTableHeader>
                <tr uiTableRow>
                  <th uiTableHead>Name</th>
                  <th uiTableHead>Type</th>
                  <th uiTableHead>Description</th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (prop of outputs(); track prop.name) {
                  <tr uiTableRow>
                    <td uiTableCell><code class="text-xs font-mono text-primary">{{ prop.name }}</code></td>
                    <td uiTableCell><code class="text-xs font-mono text-foreground-muted">{{ prop.type }}</code></td>
                    <td uiTableCell class="!whitespace-normal">{{ prop.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      @if (models().length) {
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-3">Two-way Bindings</h3>
          <div class="overflow-x-auto rounded-lg border border-border">
            <table uiTable>
              <thead uiTableHeader>
                <tr uiTableRow>
                  <th uiTableHead>Name</th>
                  <th uiTableHead>Type</th>
                  <th uiTableHead>Default</th>
                  <th uiTableHead>Description</th>
                </tr>
              </thead>
              <tbody uiTableBody>
                @for (prop of models(); track prop.name) {
                  <tr uiTableRow>
                    <td uiTableCell><code class="text-xs font-mono text-primary">{{ prop.name }}</code></td>
                    <td uiTableCell><code class="text-xs font-mono text-foreground-muted">{{ prop.type }}</code></td>
                    <td uiTableCell><code class="text-xs font-mono">{{ prop.default }}</code></td>
                    <td uiTableCell class="!whitespace-normal">{{ prop.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      @if (!inputs().length && !outputs().length && !models().length) {
        <p class="text-sm text-foreground-muted mt-6">
          This component does not expose any public API properties.
        </p>
      }
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class ShowcaseApiTable {
  readonly componentName = input.required<string>()
  readonly properties = input.required<ApiProperty[]>()

  protected readonly inputs = computed(() =>
    this.properties().filter(p => p.kind === 'input'),
  )
  protected readonly outputs = computed(() =>
    this.properties().filter(p => p.kind === 'output'),
  )
  protected readonly models = computed(() =>
    this.properties().filter(p => p.kind === 'model'),
  )
}
