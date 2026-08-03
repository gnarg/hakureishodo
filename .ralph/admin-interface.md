# admin-interface

## Status: ALMOST DONE (verification complete, pending commit/push/PR)

Add an admin interface to hakureishodo (SvelteKit static site) that lets approved OpenID (Google) users update the `hakureishodo_contents` PocketBase collection. Follow the groceries project's client-side PocketBase OAuth2 pattern.

## Progress

- [x] 1. Feature branch `feat/admin-contents` created off main.
- [x] 2. `src/lib/pb.ts` — shared PocketBase client + `checkAuth()`, `initOAuth()`, `handleCallback()` (targets `/admin/redirect`, redirects to `/admin`).
- [x] 3. `src/routes/admin/+page.svelte` — login gate (Google button when logged out), contents listed (all languages/keys), markdown editor with live preview via `marked`, update-only via `pb.collection('hakureishodo_contents').update(id, { content })`.
- [x] 4. `src/routes/admin/redirect/+page.svelte` — OAuth callback handler (client-side, reads code/state from `window.location`, no `load`).
- [x] 5. Allowlist/gating left entirely to PocketBase (follow groceries: just `pb.authStore.isValid`).
- [x] 6. Verification: prettier formatting applied to new files; eslint clean on `pb.ts` (pre-existing `{@html}` lint errors exist on main, matched); `npm run check` 0 errors; `vitest --run` 1 passed; `npm run build` succeeds and emits `build/admin.html` + `build/admin/redirect.html`.
- [ ] 7. Commit, push feature branch, open PR to main.

## Notes
- Lint (`npm run lint`) fails on pre-existing files (flake.lock, opencode.json, static/*, existing `{@html}` usage) — not introduced by this change.
- Deployment note: static host must serve `admin/redirect.html` for path `/admin/redirect` (or use clean URLs). Google redirect URI to add in PB dashboard: `<origin>/admin/redirect`.

## Remaining
- Stage, commit, push branch.
- Open PR to main with summary.
