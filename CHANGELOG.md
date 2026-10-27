# Changelog

## 3.3.0 - 2026-10-27

### Added

- Passwordless device sync with w3pk 0.10.4: Settings → Sync exports a sync file locked to the passkey through WebAuthn PRF, and `SyncImport.tsx` imports it on any device where the passkey synced, with one prompt, no password and no prior login. Where the authenticator has no PRF support (Firefox), export asks for a password and import restores it through `syncWalletWithPasskey()`. Each `SyncBootstrapError` reason gets its own message. The import card is on the Settings page when logged out and in the Sync tab when logged in
- Settings → Security Status warns when `getBackupStatus()` reports `evictionRisk`
- `SyncImport.tsx`, `HomeScreenChoice.tsx`, `src/context/LanguageContext.tsx` and `.vscode/settings.json` are chassis in `.genji-sync.json`, and `src/app/favicon.ico` is never synced; the Header parity note covers the Home Screen or backup choice
- Sync link QR code: after a passwordless export, the Sync tab's QR code holds `<origin>/settings#sync=<base64url file>` (`src/utils/syncLink.ts`), drawn with `QRCodeSVG` at level L. Scanning it on another device opens Settings with the file loaded, and one tap on "Sync This Wallet" plus the passkey prompt syncs the wallet. The file sits after the `#`, so it never reaches the server, and it is removed from the address bar on load. A password file gets no QR code, since a photo of it could be brute-forced, and a link too long for a QR code falls back to the file download
- On iPhone and iPad in a browser tab, with storage not persisted, opening registration first offers a choice (`HomeScreenChoice.tsx`): Add to Home Screen shows the install steps and creates no wallet in the browser; Back up goes on to registration and the backup step. `isStandalone()` and `hasIOSEvictionRisk()` in `src/utils/browserDetection.ts` run this check before registration, since w3pk's `evictionRisk` is only known after it
- The registration dialog says "No built-in authenticator found: use your phone or a security key" when `isPlatformAuthenticatorAvailable()` returns false

### Changed

- A login that throws `SyncRequiredError` (passkey synced, wallet didn't) or `WalletMissingError` (wallet wiped) now explains why and opens `/settings#sync-import` instead of showing "Authentication Failed"; the registration dialog's "I already registered on another device" link points there too
- Restoring a backup while logged out first restores into a passkey already synced to the device through `syncWalletWithPasskey()`, and only asks for a username and creates a new passkey when there is none
- The backup step after registration uses w3pk's `register().evictionRisk` instead of genji's own Safari check
- On iOS, the backup step warns that every browser on iPhone and iPad deletes the site's data after 7 days without a visit, instead of blaming Safari; Safari on macOS keeps the current warning
- Genji passes `userVerification: 'preferred'` to `createWeb3Passkey`: a security key or an unlocked password manager logs in with one click, and a computer with no built-in authenticator registers through a phone or a security key
- The security paragraph and the session texts no longer promise a biometric check; they ask for your passkey

- `/api/subscribe` writes to the shared `leads` table (`first_name`, `email`, `topic`) through `pg`, with topic `genji`, and ignores duplicates on `(email, topic)`
- The About page subscription form has an optional first-name field
- Updated dependencies: `next` / `eslint-config-next` 16.4.3, `react` / `react-dom` 19.3.1, `w3pk` 0.10.5, `tsup` 9.0.0; `typescript` stays on 6 and `eslint` on 9, which `eslint-plugin-jsx-a11y` still requires

### Removed

- `@neondatabase/serverless`
- The Sync tab's address QR code and "Link This Wallet" flow, which only saved public addresses to localStorage (`w3pk_wallet_sync_*`) and moved no wallet, with their translations
- `src/utils/evictionRisk.ts`, replaced by w3pk's `evictionRisk`; `isIOS()` moved to `src/utils/browserDetection.ts`
- The backup step's Home Screen hint (`backup.homeScreenHint`), replaced by the choice before registration
- The disabled AI security inspection: its commented-out code on the Settings and About pages, in `BuildVerification.tsx` and in the W3PK context, and its translations
- `react-markdown`, `remark-gfm` and `rehype-highlight`, only used by the security report
- w3pk's optional `circomlibjs` dependency, through a pnpm override (`"circomlibjs": "-"`); genji doesn't use w3pk's ZK features, so projects that do must remove the override

### Fixed

- README and `docs/CONTEXT.md` list the current w3pk version (`docs/CONTEXT.md` still said 0.7.7)

### Security

- `next` 16.4.3 fixes two critical and one high advisory affecting `next` 16.0.0 to 16.4.0
- Dropping `circomlibjs` removes `ethers@5` and `elliptic@6.6.1`, which has an advisory with no patched version
- CI builds on Node.js 24 instead of end-of-life Node.js 20, and `package.json` requires Node.js `>=24.22.1` through `engines`, which fixes the [October 2026 Node.js security releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) (including CVE-2026-111497, a Brotli decoder out-of-bounds write that allows remote code execution, and the TLS certificate hostname bypasses)

## 3.2.0 - 2026-10-14

### Removed

- The IndexedDB inspector on the Settings page, its modal and translations, the IndexedDB helpers in `src/utils/storageInspection.ts` (including the unused `clearAllW3pkIndexedDB()`), and the `w3pk-wallet-sync` IndexedDB copy of linked wallets, which are now saved to localStorage only

### Added

- Backup step after registration, on Safari only: when `register()` reports no backup and the browser can wipe the wallet (WebKit in a tab, outside a home-screen app, with storage not persisted, detected by `src/utils/evictionRisk.ts`), a blocking "Back up your wallet" dialog offers a password-protected backup file. It can only be closed with a backup or an explicit "I understand the risk", which is recorded per address; on iOS it suggests "Add to Home Screen". Other browsers get no prompt; backups stay available from Settings. The W3PK context exposes `backupPrompt` and `skipBackup`
- `.genji-sync.json` syncs `BackupStep.tsx` and `src/utils/evictionRisk.ts`, and its `layout.tsx` merge rule asks projects to mount `<BackupStep />`
- HTTP security headers on every route in `next.config.ts`, adopted from the presidentielle security audit (22 Aug 2026): a Content-Security-Policy (`default-src 'self'`; `connect-src` limited to same-origin plus the Optimism RPC and the w3pk endpoints; `frame-ancestors 'none'`; `object-src 'none'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`, and `Strict-Transport-Security` with `includeSubDomains; preload`
- `pnpm.overrides` in `package.json` forcing patched versions of transitive dependencies with known advisories (`underscore`, `ws`, `brace-expansion` v1/v2, `js-yaml`, `esbuild`); `pnpm audit` now reports only two advisories with no patched release: the low-severity `elliptic` one (reachable only via the legacy ethers 5.8 bundled by `circomlibjs`) and the high-severity `braces` one (dev-only, via `eslint-config-next` → `fast-glob`), down from 7 high / 1 moderate / 2 low
- `pnpm-workspace.yaml` with `minimumReleaseAge: 4320` (3 days), so freshly published — potentially hijacked — dependency versions cannot be installed immediately (`w3pk` excluded, as it is published by this project's own maintainer)
- Template propagation for downstream projects built from genji: `.genji-sync.json` declares which paths are chassis (synced), which need a judgment merge (`next.config.ts` CSP origins, `package.json`, `.env.template`, provider composition, root layout), and which are project-owned or scaffolding (never touched); the merge itself is done locally and reviewed by running the `genji-sync` Claude Code skill, which diffs the template against itself between two versions rather than against the project
- Two version fields with one job each: in genji, `version` in `package.json` _is_ the template release number (genji is not published to npm), and it must be bumped together with the git tag; in a generated project, `templateVersion` records which template release it is on, leaving `version` free to track the project's own releases
- Template version check in `.github/workflows/build.yml`, a warning-only step (`continue-on-error`) that reads the newest upstream tag with an unauthenticated `git ls-remote`: in a generated project it warns when `templateVersion` has fallen behind and points at `/genji-sync`; in genji itself, where no `templateVersion` exists, it instead warns when a tag has been pushed without bumping `version`. Each project checks itself, so there is no token, no downstream repository list, and nothing that can go stale
- `customize.js` now writes `templateVersion` into the generated project's `package.json` (copied from genji's own `version`, placed next to it) so the project records which template release it came from; the `genji-sync` skill reads it to pick the base ref and updates it after a sync. Projects generated earlier carry a `.genji-version` file instead — the CI check still reads it, and `genji-sync` migrates it into `package.json` on the next sync
- `postinstall` hint that reminds users to run `pnpm customize` after installing (e.g. after `npx create-next-app --example https://github.com/w3hc/genji my-app`); `customize.js` removes the hint along with itself when it self-destructs

### Fixed

- README dependency versions now match `package.json` (w3pk `v0.10.3`, Next.js `v16.4.0`, Chakra UI `v3.37.0`)
- "Remember Me" restores the session silently again with w3pk 0.10.3, which moved persistent sessions from IndexedDB to localStorage: the W3PK context now detects them from the `w3pk_session_` keys
- Build verification no longer fails with `TypeError: Failed to fetch`: `connect-src` in `next.config.ts` now allows `https://unpkg.com`, where `getCurrentBuildHash()` downloads the published w3pk build to hash it
- Login button on a device with no registered passkey now opens the registration modal directly instead of triggering the browser's cross-device "scan this QR code" passkey dialog (the W3PK context now exposes `hasLocalCredentials()`, checked before calling `login()`)
- `isNoPasskeyError` now recognizes the w3pk 0.10.x "No passkey found" error message, so cancelling a passkey prompt with no account still falls back to the registration modal
- `customize.js` now produces prettier-clean output: the translations rewrite is a precise line-based removal of the `about` navigation entries (it no longer strips trailing commas across the whole file), and the doubled blank line in the generated `Header.tsx` template is gone — `pnpm format:check` and `pnpm lint` pass right after `pnpm customize`

### Changed

- Bumped `w3pk` to 0.10.3, which keeps the wallet, persistent sessions and backups in localStorage instead of IndexedDB
- The Settings storage inspector now lists those records under localStorage (`w3pk_wallet`, `w3pk_session` and `w3pk_backup` types, wallet and session records marked as encrypted)
- Disabled the AI-powered security inspection feature (the "Security Inspect" cards on the Settings page, the `about` page feature bullet, the `window.w3pk.inspect()`/`inspectNow()` console shortcuts, and the related `BuildVerification` console hint); the underlying `w3pk` `inspect`/`inspectNow` calls are commented out rather than removed
- The Settings page (accounts, backup, device sync, social recovery, browser/security inspection, all toasts and dialogs), the About page (intro, features list, email subscription), and the remaining Home page strings (sign-message toast, loading/not-available states) are now fully translated in all 10 supported languages, closing the gap left by the earlier partial translation pass (large expansion of `settings` and new top-level `about` section in `src/translations/index.ts`)
- The "Sign a message" button on the home page is now translated in all 10 supported languages (new `home.signMessage` translation key)
- Username validation error in the registration modal is now cleared in the input's `onChange` handler instead of a `useEffect`, avoiding a redundant second render per keystroke (fixes the `react-hooks/set-state-in-effect` pattern)
- Updated dependencies: `next` / `eslint-config-next` 16.2.10, `@chakra-ui/react` 3.36.0, `ethers` 6.17.0, `react-icons` 5.7.0, `prettier` 3.9.5, `@eslint/eslintrc` 3.3.6, `eslint` 9.39.5, `@types/node` 26.1.1, `typescript` 6.0.3
- Updated dependencies: `next` / `eslint-config-next` 16.4.0, `react` / `react-dom` 19.3.0, `@chakra-ui/react` 3.37.0, `@neondatabase/serverless` 1.2.0, `react-syntax-highlighter` 16.1.2, `prettier` 3.9.10, `@eslint/eslintrc` 3.3.7, `@types/node` 26.6.5, `@types/react` / `@types/react-dom` 19.3.0; `eslint`, `typescript` and `tsup` stay on their current majors
- Held back `eslint` at v9 (`@typescript-eslint/parser` crashes at runtime under ESLint 10, and `eslint-plugin-jsx-a11y` caps its peer range at v9) and `typescript` at 6.0.3 (`typescript-eslint` requires `<6.1.0`, and the Next.js 16.2 build worker crashes with TypeScript 7)

### Security

- Fixed 19 of the 20 open Dependabot alerts, including three critical Next.js remote code execution flaws (Image Optimization API with AVIF files, Windows-hosted servers, `next/og` `ImageResponse`), by moving `next` to 16.4.0 and raising the `pnpm.overrides` floors to patched releases: `brace-expansion` 1.1.21 / 2.1.7 / 5.0.12 (v5 newly overridden), `js-yaml` 4.3.2, and new overrides for `source-map-js` 1.2.2, `sharp` 0.35.5 and `baseline-browser-mapping` 2.11.0
