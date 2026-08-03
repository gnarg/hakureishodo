# hakureishodo.art — Project Guidelines

## Project Overview

A **static single-page art gallery site** built with **SvelteKit** (`@sveltejs/adapter-static`).
It renders a gallery of images and localized text for **hakureishodo.art**. All content is
fetched at runtime from a **PocketBase** backend, and the build is fully prerendered (`prerender = true`, `ssr = false`).

The generated site is exported to `build/` and served statically (GitHub Pages / static host, see `static/.nojekyll`).

## Stack

- **Framework:** SvelteKit 2 + Svelte 4 + Vite 5
- **Language:** TypeScript (strict), `$lib` path alias for shared code
- **Backend/data:** PocketBase (`pocketbase` npm package); content fetched live from `https://db.guymon.family`
- **Static assets:** gallery images served from `https://static.hakureishodo.art/images/gallery/`
- **i18n:** `svelte-i18n` with `en` and `ja` locales, fetched from PocketBase collections
- **Testing:** Vitest
- **Tooling:** ESLint (flat config) + Prettier + TypeScript strict
- **Env:** Node `v22.9.0` (`.node-version`), `engine-strict=true` in `.npmrc`, Nix flake dev shell

## Key Files & Data Flow

- `src/routes/+page.ts` — load function: registers i18n locales (`en`/`ja`), reads locale from `?lang=` or falls back to `en`, fetches gallery images.
- `src/lib/contents.ts` — PocketBase client and data helpers:
  - `getTranslations(language)` — returns a key → string map from the `hakureishodo_contents` collection.
  - `getImages()` — returns `{ src, thumbnail }` list from the `hakureishodo_gallery` collection, sorted by `order`.
- `src/routes/+layout.ts` — enables prerendering.
- `src/routes/+page.svelte` — the single page UI (image gallery + localized copy).
- `static/css/main.css`, `static/js/main.min.js` — hand-managed static assets in `static/`.
- PocketBase collections: `hakureishodo_contents` (i18n strings), `hakureishodo_gallery` (ordered images).

## Common Commands

```bash
npm install           # install dependencies
npm run dev          # start dev server
npm run dev -- --open # dev server + open browser
npm run build       # production build (outputs to build/)
npm run preview    # preview the production build
npm run check      # type-check with svelte-check
npm run test     # run Vitest tests
npm run lint    # prettier --check + eslint
npm run format # prettier --write (auto-fix formatting)
```

Always run `npm run check` and `npm run lint` (plus `npm run test`) after making changes.

## Code Style

- Follow existing SvelteKit conventions; keep components/layouts consistent with `+page.svelte`.
- TypeScript strict mode is on (`strict: true`, `allowJs`, `checkJs`). Add types rather than relying on `any`.
- Import shared modules via the `$lib` alias (e.g. `$lib/contents`).
- Keep functions small (< 50 lines) and add comments only for non-obvious logic.
- Keep i18n content in PocketBase, not hardcoded strings.
- Handle data-fetch errors explicitly — do not silently swallow failed PocketBase requests.

**Prettier** is configured (`prettier-plugin-svelte`) — run `npm run format` to auto-fix.

## Git & Branching

- Use short, descriptive commit messages (conventional style: `feat`/`fix`/`refactor`/`docs`/`test`/`chore`).
- Make small, atomic commits — one concern per commit.
- **Never push directly to `main`.** Create a feature branch, then open a PR for review.
- Keep the working tree clean before switching branches.

## Safety & Env

- Never commit secrets or API keys.
- `.env` files are gitignored; use `!env.example` / `.env.test` for templates only.
- Validate user input and handle errors explicitly; no silent failures.

## Deployment

The site is a fully static/prerendered build (`npm run build`). Serve the `build/` directory —
no server/SSR required. Deploy the adapter-static output and the `static/` folder contents (`.nojekyll` marks it for static hosts).
