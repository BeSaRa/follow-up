# 48 — Global Error Handler

| Status    | Date       |
|-----------|------------|
| Created   | 2026-03-01 |
| Started   | 2026-03-01 |
| Completed | 2026-03-01 |

---

## Description

Add centralized HTTP error handling with token refresh support and user-facing toast notifications. Fix silent error swallowing in CrudPageDirective.

## Deliverables

- [x] Add `setTokens` method to `AuthStore`
- [x] Add `error` signal to `CrudPageDirective`
- [x] Create error interceptor with token refresh and concurrent 401 handling
- [x] Add translation keys for error messages (ar + en)
- [x] Register interceptor in app config
- [x] Add core logger line
