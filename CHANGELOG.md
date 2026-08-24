# Changelog

## Unreleased

### Added

- HTTP security headers on every route in `next.config.ts`, adopted from the presidentielle security audit (22 Aug 2026): a Content-Security-Policy (`default-src 'self'`; `connect-src` limited to same-origin plus the Optimism RPC and the w3pk endpoints; `frame-ancestors 'none'`; `object-src 'none'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`, and `Strict-Transport-Security` with `includeSubDomains; preload`
- `pnpm.overrides` in `package.json` forcing patched versions of transitive dependencies with known advisories (`underscore`, `ws`, `brace-expansion` v1/v2, `js-yaml`, `esbuild`); `pnpm audit` now reports only the unpatched low-severity `elliptic` advisory (reachable only via the legacy ethers 5.8 bundled by `circomlibjs`), down from 7 high / 1 moderate / 2 low
- `pnpm-workspace.yaml` with `minimumReleaseAge: 4320` (3 days), so freshly published — potentially hijacked — dependency versions cannot be installed immediately (`w3pk` excluded, as it is published by this project's own maintainer)
- `.github/dependabot.yml` with monthly monitoring of npm dependencies and GitHub Actions, grouped so each run opens at most two pull requests: one batching all npm minor/patch bumps (majors stay ungrouped, so a Next.js major still gets its own review) and one batching every GitHub Actions bump
- Template propagation for downstream projects built from genji: `.genji-sync.json` declares which paths are chassis (synced), which need a judgment merge (`next.config.ts` CSP origins, `package.json`, `.env.template`, provider composition, root layout), and which are project-owned or scaffolding (never touched); the merge itself is done locally and reviewed by running the `genji-sync` Claude Code skill, which diffs the template against itself between two versions rather than against the project
- `genji.templateVersion` field in `package.json`, the single source of truth for the current template release
- Template version check in `.github/workflows/build.yml`, a warning-only step (`continue-on-error`) that reads the newest upstream tag with an unauthenticated `git ls-remote`: in a generated project it warns when `.genji-version` has fallen behind and points at `/genji-sync`; in genji itself, where no `.genji-version` exists, it instead warns when a tag has been pushed without bumping `genji.templateVersion`. Each project checks itself, so there is no token, no downstream repository list, and nothing that can go stale
- `customize.js` now writes `.genji-version` (read from `genji.templateVersion`) so a generated project records which template release it came from, and strips the template-only `genji` field from its `package.json`
- `postinstall` hint that reminds users to run `pnpm customize` after installing (e.g. after `npx create-next-app --example https://github.com/w3hc/genji my-app`); `customize.js` removes the hint along with itself when it self-destructs

### Fixed

- Login button on a device with no registered passkey now opens the registration modal directly instead of triggering the browser's cross-device "scan this QR code" passkey dialog (the W3PK context now exposes `hasLocalCredentials()`, checked before calling `login()`)
- `isNoPasskeyError` now recognizes the w3pk 0.10.x "No passkey found" error message, so cancelling a passkey prompt with no account still falls back to the registration modal
- `customize.js` now produces prettier-clean output: the translations rewrite is a precise line-based removal of the `about` navigation entries (it no longer strips trailing commas across the whole file), and the doubled blank line in the generated `Header.tsx` template is gone — `pnpm format:check` and `pnpm lint` pass right after `pnpm customize`

### Changed

- Disabled the AI-powered security inspection feature (the "Security Inspect" cards on the Settings page, the `about` page feature bullet, the `window.w3pk.inspect()`/`inspectNow()` console shortcuts, and the related `BuildVerification` console hint); the underlying `w3pk` `inspect`/`inspectNow` calls are commented out rather than removed
- The Settings page (accounts, backup, device sync, social recovery, browser/security inspection, all toasts and dialogs), the About page (intro, features list, email subscription), and the remaining Home page strings (sign-message toast, loading/not-available states) are now fully translated in all 10 supported languages, closing the gap left by the earlier partial translation pass (large expansion of `settings` and new top-level `about` section in `src/translations/index.ts`)
- The "Sign a message" button on the home page is now translated in all 10 supported languages (new `home.signMessage` translation key)
- Username validation error in the registration modal is now cleared in the input's `onChange` handler instead of a `useEffect`, avoiding a redundant second render per keystroke (fixes the `react-hooks/set-state-in-effect` pattern)
- Updated dependencies: `next` / `eslint-config-next` 16.2.10, `@chakra-ui/react` 3.36.0, `ethers` 6.17.0, `react-icons` 5.7.0, `prettier` 3.9.5, `@eslint/eslintrc` 3.3.6, `eslint` 9.39.5, `@types/node` 26.1.1, `typescript` 6.0.3
- Held back `eslint` at v9 (`@typescript-eslint/parser` crashes at runtime under ESLint 10, and `eslint-plugin-jsx-a11y` caps its peer range at v9) and `typescript` at 6.0.3 (`typescript-eslint` requires `<6.1.0`, and the Next.js 16.2 build worker crashes with TypeScript 7)
