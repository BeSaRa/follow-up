# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nx monorepo for an Angular 21 application with shared libraries. Uses Vite for building and Vitest for testing.

## Commands

```bash
# Development
nx serve follow-up              # Start dev server (or: npm run dev)

# Build
nx build follow-up              # Production build

# Testing
nx test follow-up               # Test the app
nx test core                    # Test the core library
nx e2e follow-up-e2e            # Run Cypress E2E tests

# Linting
nx lint follow-up
nx lint core

# Multi-project
nx run-many -t build            # Build all projects
nx affected -t test             # Test affected projects
```

## Architecture

**Apps:**
- `follow-up` - Main Angular standalone application

**Libraries:**
- `core` (`@follow-up/core`) - Shared services and providers
  - `ConfigService` - Loads configuration from `/configurations.json` with proxy-based validation
  - `provideConfigService()` - App initializer for configuration loading
  - `provideSequentialAppInitializer()` - Sequential app initialization handler
  - `injectConfigService<T>()` - Type-safe config injection

**Dependencies:** `follow-up` → `core`

## Angular Best Practices

### TypeScript
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

### Components
- Always use standalone components over NgModules
- Do NOT set `standalone: true` inside Angular decorators (it's the default in Angular v20+)
- Use `input()` and `output()` functions instead of decorators
- Use Angular signal-based queries (`viewChild`, `viewChildren`, `contentChild`, `contentChildren`) instead of decorators (`@ViewChild`, `@ViewChildren`, etc.)
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Keep components small and focused on a single responsibility
- Use `computed()` for derived state
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images

### State Management
- Use signals for state management
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not write arrow functions in templates (they are not supported)

### Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

### Imports
- Import specific items from `@angular/common` (e.g., `AsyncPipe`, `NgIf`) instead of `CommonModule`

### Routing
- Implement lazy loading for feature routes

### Accessibility
- Must pass all AXE checks
- Follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes

## Showcase

- Every new UI component in `libs/ui/src/lib/` **must** have a showcase page at `libs/ui/src/lib/showcase/pages/{slug}-showcase.ts`
- The page must be added to `libs/ui/src/lib/showcase/showcase.routes.ts` as a lazy-loaded route
- The component must be registered in `libs/ui/src/lib/showcase/component-registry.ts` under the appropriate category
- The showcase page must include: Examples tab (all variants with copyable code), API tab (all inputs/outputs), Styles tab (CSS custom properties)

## Core Library Changes

When modifying the `core` library, add a logger statement in `libs/core/src/index.ts` to verify the viewer receives the updated package.

## Plan Workflow

Plans are tracked in `docs/`. Each plan is a numbered markdown file that moves between folders as work progresses.

### Folder structure

- `docs/queue/` — planned, not yet started
- `docs/started/` — currently in progress
- `docs/completed/` — finished

### File naming

`{NN}-{plan-name}.md` — e.g. `04-input-and-form-field-components.md`

Numbering is sequential and global across all folders (not per-folder).

### File format

Every plan file must have a tracker table at the top:

```markdown
# NN — Plan Title

| Status    | Date       |
|-----------|------------|
| Created   | YYYY-MM-DD |
| Started   | —          |
| Completed | —          |

---

## Description
...

## Deliverables
- [ ] Task 1
- [ ] Task 2
```

### Workflow steps

1. **Create** — write the file in `docs/queue/`, fill in the Created date
2. **Start** — move the file from `docs/queue/` to `docs/started/`, fill in the Started date
3. **Complete** — move the file from `docs/started/` to `docs/completed/`, fill in the Completed date, check all deliverable boxes

## Internationalization (i18n)

- This app is multilingual using `@ngx-translate/core` and `@ngx-translate/http-loader`
- Supported languages: Arabic (`ar`) and English (`en`). Default/fallback is Arabic (`ar`)
- **All user-facing text must go through translation** — do NOT hardcode any display text in templates or components
- Translation files are in `apps/follow-up/public/i18n/` (`ar.json`, `en.json`)
- Use the `TranslatePipe` in templates: `{{ 'key' | translate }}`
- All translation keys must be **lowercase** (e.g., `login.title`, `login.username_label`)
- Every new string must be added to **both** `ar.json` and `en.json`

## Commit Messages

Do not add any Claude-specific attributes to commit messages.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->
