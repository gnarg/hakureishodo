# admin-interface

## Status: COMPLETE ✅ (PR #3 open)

Add an admin interface to hakureishodo (SvelteKit static site) that lets approved OpenID (Google) users update the `hakureishodo_contents` PocketBase collection. Follow the groceries project's client-side PocketBase OAuth2 pattern.

## Progress

- [x] 1. Feature branch `feat/admin-contents` created off main.
- [x] 2. `src/lib/pb.ts` — shared PocketBase client + `checkAuth()`, `initOAuth()`, `handleCallback()` (targets `/admin/redirect`, redirects to `/admin`).
- [x] 3. `src/routes/admin/+page.svelte` — login gate (Google button when logged out), contents listed (all languages/keys), markdown editor with live preview via `marked`, update-only via `pb.collection('hakureishodo_contents').update(id, { content })`.
- [x] 4. `src/routes/admin/redirect/+page.svelte` — OAuth callback handler (client-side, reads code/state from `window.location`, no `load`).
- [x] 5. Allowlist/gating left entirely to PocketBase (follow groceries: just `pb.authStore.isValid`).
- [x] 6. Verification: type-check 0 errors; vitest 1 passed; build succeeds and emits `build/admin.html` + `build/admin/redirect.html`; prettier applied to new files; eslint clean on `pb.ts`.
- [x] 7. Committed, pushed `feat/admin-contents`, opened **PR #3** to main.

## Notes
- Lint (`npm run lint`) fails on pre-existing files (flake.lock, opencode.json, static/*, existing `{@html}` usage) — not introduced by this change.
- Deployment note: static host must serve `admin/redirect.html` for path `/admin/redirect`. Add Google OAuth redirect URI `<origin>/admin/redirect` in PB dashboard.
- Reverted unrelated `package-lock.json` changes from `npm install` to keep PR minimal.
