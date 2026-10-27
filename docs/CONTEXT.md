# Genji Passkey - Developer Context

> **Note for Contributors**: This document is formatted with Prettier. Always run `pnpm format:check` before committing to ensure consistency. Use `pnpm format` to auto-fix formatting issues.

## Overview

**Genji** is a Next.js boilerplate demonstrating passwordless authentication using passkeys (WebAuthn/FIDO2) with an integrated Ethereum HD wallet. It provides a production-ready reference implementation for building Web3 applications with secure, user-friendly authentication.

**Live Demo**: https://genji.w3hc.org

## Tech Stack

- **Framework**: Next.js 16.4.3 (App Router, React 19.3.1)
- **UI Library**: Chakra UI 3.30.0 with Emotion styling
- **Authentication**: w3pk SDK 0.10.5 (Web3 Passkey authentication)
- **Blockchain**: Ethers.js 6.15.0
- **Language**: TypeScript 5.9.3 (strict mode)
- **Internationalization**: 10 languages with browser auto-detection
- **Accessibility**: WCAG 2.1 AA compliant

## Architecture

### Core Components

1. **Authentication System** ([W3PK.tsx](../src/context/W3PK.tsx))
   - Passkey registration and login
   - 24-hour session management with auto-extension
   - Error handling with user-friendly messages
   - Timeout protection (45s for registration operations)

2. **HD Wallet Management**
   - BIP39/BIP44 mnemonic-based wallet generation
   - Origin-specific address derivation (unique per domain)
   - Two address types:
     - **MAIN**: Secure default address, no private key exposure
     - **Tagged**: Custom derivation (e.g., "OPENBAR") with private key access
   - Message signing capabilities

3. **Backup & Recovery** ([settings/page.tsx](../src/app/settings/page.tsx))
   - Password-protected ZIP backups with AES-256-GCM encryption
   - Restoration from ZIP/JSON files
   - Security scoring and recovery recommendations
   - Backup step after registration ([BackupStep.tsx](../src/components/BackupStep.tsx)), blocking, on Safari only
   - Home Screen or backup choice before registration on iPhone and iPad ([HomeScreenChoice.tsx](../src/components/HomeScreenChoice.tsx)), in a browser tab with storage not persisted
   - Passwordless device sync ([SyncImport.tsx](../src/components/SyncImport.tsx)): a sync file from `exportForSync()` is locked to the passkey through WebAuthn PRF and imports with one prompt on any device where the passkey synced, with a password fallback where PRF is missing
   - Three-layer recovery architecture:
     1. Passkey auto-sync (iCloud Keychain, Google Password Manager, etc.)
     2. Encrypted backup files (user-generated)
     3. Social recovery via Shamir Secret Sharing (planned)

4. **Internationalization** ([translations/index.ts](../src/translations/index.ts))
   - Supported: English, Mandarin, Hindi, Spanish, French, Arabic, Bengali, Russian, Portuguese, Urdu
   - Auto-detection via browser navigator API
   - React Context-based implementation

### Key Pages

- **Home** ([app/page.tsx](../src/app/page.tsx)): Wallet display, address derivation demo, message signing
- **Settings** ([app/settings/page.tsx](../src/app/settings/page.tsx)): Account management, backups, storage inspection, device sync
- **About** ([app/about/page.tsx](../src/app/about/page.tsx)): w3pk features, email subscription

### Directory Structure

```
src/
�� app/                    # Next.js App Router pages
   �� page.tsx            # Home/dashboard
   �� settings/           # Wallet settings & backup management
   �� about/              # About w3pk
   �� api/subscribe/      # Email subscription endpoint
�� components/
   �� ui/                 # Chakra UI component wrappers
   �� Header.tsx          # Navigation + auth UI
   �� BackupStep.tsx      # Backup step after registration
   �� HomeScreenChoice.tsx # Home Screen or backup choice on iOS
   �� PasswordModal.tsx   # Password input for backup/restore
   �� SyncImport.tsx      # Import a sync file on another device
�� context/
   �� W3PK.tsx            # Core authentication & wallet logic
   �� LanguageContext.tsx # i18n state management
   �� index.tsx           # Provider composition
�� hooks/
   �� useTranslation.ts   # Translation hook
�� utils/
   �� i18n.ts             # Language detection
   �� browserDetection.ts # WebAuthn capability check, iOS detection
   �� storageInspection.ts # localStorage inspection tools
�� theme/
   �� index.ts            # Brand colors (Purple #8c1c84, Blue #45a2f8)
   �� system.ts           # Chakra theme config
�� translations/
    �� index.ts            # i18n strings
```

## Critical Architecture Decisions

### Storage Strategy

**Passkeys**: Stored in browser's Secure Enclave (hardware-backed, survives data clearing)

**Encrypted Wallet Mnemonic**: Stored in `localStorage` using AES-GCM encryption, with persistent sessions and backup records (w3pk ≥ 0.10.3 no longer uses IndexedDB)

- **Risk**: Cleared when users clear cookies/site data, by Safari after 7 days without a visit, and on iPhone and iPad by every browser, all of which use Safari's engine (unless the app runs from the Home Screen, which has its own storage)
- **Mitigation**: A backup step opens after registration when no backup exists and w3pk reports `evictionRisk` (Safari in a tab, storage not persisted), and is blocking until the user backs up or accepts the risk. Settings → Security Status shows the same warning. On iPhone and iPad, opening registration first offers to add the app to the Home Screen and create the wallet there, or to go on in the browser and back up
- **Future**: Consider browser extension for persistent storage

### Security

- **Client-side only**: No backend wallet storage (zero server trust)
- **AES-256-GCM encryption** for all sensitive data
- **WebAuthn/FIDO2**: Hardware-backed authentication
- **Origin-specific derivation**: Prevents cross-origin key reuse
- **No hardcoded secrets** in codebase

### Session Management

- Configurable 24-hour sessions
- Auto-extends after successful operations (sign, derive, backup)
- Reduces passkey prompts while maintaining security
- Critical operations still require passkey verification

## Development

```bash
# Install dependencies
pnpm i

# Development server (http://localhost:3000)
pnpm dev

# Production build
pnpm build
pnpm start

# Code quality
pnpm lint           # ESLint + Next.js rules
pnpm lint:a11y      # Accessibility check
pnpm format         # Prettier formatting
pnpm format:check   # Verify formatting
```

## Browser Compatibility

**Minimum Requirements**: WebAuthn support

- Chrome 67+, Firefox 60+, Safari 14+, Edge 18+

**Recommended for Full Features**:

- **iOS/macOS**: Safari (iCloud Keychain sync)
- **Android**: Samsung Internet or Chrome (Google Password Manager sync)
- **Windows**: Edge (Windows Hello sync)

**Known Issues**:

- Firefox Mobile: Passkey persistence issues reported

## Customization Guide for LLMs

When adapting this boilerplate:

1. **Branding**: Update colors in [theme/index.ts](../src/theme/index.ts) and metadata in [app/metadata.ts](../src/app/metadata.ts)

2. **Add Features**:
   - Extend [W3PK.tsx](../src/context/W3PK.tsx) for new wallet operations
   - Add pages under `src/app/` following Next.js App Router conventions
   - Use Chakra UI components from `src/components/ui/`

3. **Modify Authentication Flow**:
   - Adjust session duration in [W3PK.tsx](../src/context/W3PK.tsx) (search for `SESSION_DURATION`)
   - Customize error messages in the same file
   - Update UI in [Header.tsx](../src/components/Header.tsx)

4. **Internationalization**:
   - Add languages in [translations/index.ts](../src/translations/index.ts)
   - Update `SUPPORTED_LANGUAGES` in [utils/i18n.ts](../src/utils/i18n.ts)

5. **Backup Strategy**:
   - Modify encryption in [W3PK.tsx](../src/context/W3PK.tsx) (`createBackup` and `restoreBackup` methods)
   - Add backup UI in [settings/page.tsx](../src/app/settings/page.tsx)

6. **API Routes**:
   - Add server-side logic under `src/app/api/`
   - Current example: [api/subscribe/route.ts](../src/app/api/subscribe/route.ts)

## Code Quality Standards

### ESLint Rules - Common Errors to Avoid

**Always run `pnpm lint` before committing code.** Fix these common issues:

1. **Unescaped entities in JSX**

   React/ESLint requires special characters to be escaped in JSX text to prevent rendering issues and security vulnerabilities.

   **Common characters that need escaping:**
   - Single quotes/apostrophes (`'`) → `&apos;` or `&#39;`
   - Double quotes (`"`) → `&quot;` or `&#34;`
   - Less than (`<`) → `&lt;`
   - Greater than (`>`) → `&gt;`
   - Ampersand (`&`) → `&amp;`

   **Examples:**

   ```tsx
   // ❌ Wrong - Apostrophes
   <Text>Don't use unescaped apostrophes</Text>
   <Text>User's profile</Text>

   // ✅ Correct - Using HTML entities
   <Text>Don&apos;t use unescaped apostrophes</Text>
   <Text>User&apos;s profile</Text>

   // ❌ Wrong - Double quotes
   <Text>The "Terms" apply to all users</Text>

   // ✅ Correct - Using HTML entities
   <Text>The &quot;Terms&quot; apply to all users</Text>

   // ✅ Alternative - Using curly braces (for complex strings)
   <Text>{"Don't worry, you can use curly braces"}</Text>
   <Text>{'User\'s "profile" & settings'}</Text>
   ```

   **Quick fixes:**
   - Run `pnpm lint` to identify all unescaped entities
   - Replace `'` with `&apos;` in JSX text content
   - Replace `"` with `&quot;` in JSX text content
   - For strings with multiple special characters, consider wrapping in `{" ... "}`

2. **Missing display names for components** (Optional - can be disabled)

   ```tsx
   // ❌ Wrong (if rule is enabled)
   export const Button = forwardRef((props, ref) => {
     return <button ref={ref} {...props} />
   })

   // ✅ Correct
   export const Button = forwardRef((props, ref) => {
     return <button ref={ref} {...props} />
   })
   Button.displayName = 'Button'

   // Note: This rule can be disabled in eslint.config.mjs by uncommenting:
   // 'react/display-name': 'off',
   // The rule does NOT affect WCAG compliance - it only impacts React DevTools debugging.
   ```

3. **Run linting in CI/CD**
   - GitHub Actions will fail builds if linting errors exist
   - Fix errors locally before pushing: `pnpm lint`
   - Check formatting: `pnpm format:check`

### Comment Guidelines

Keep comments **minimal, functional, and contributor-friendly**:

**DO**:

- Explain non-obvious business logic or security decisions
- Document complex algorithms or data transformations
- Add context for workarounds or browser-specific code
- Use JSDoc for public API functions

**DON'T**:

- State the obvious (e.g., `// Set state` above `setState(value)`)
- Add redundant type information (TypeScript handles this)
- Write essays or detailed explanations (use docs/ instead)
- Keep outdated comments (remove or update immediately)

**Examples**:

```tsx
// ✅ Good: Explains WHY, not WHAT
// Timeout prevents infinite passkey prompts on slow devices
const REGISTRATION_TIMEOUT = 45000

// ❌ Bad: States the obvious
// This function creates a backup
function createBackup() { ... }

// ✅ Good: Clarifies security decision
// Private keys only exposed for tagged addresses (e.g., "OPENBAR")
// MAIN address never exposes private key for enhanced security
const privateKey = await derivePrivateKey(tag)

// ❌ Bad: Redundant with code
// Returns a string
function getUsername(): string { ... }
```

**External Contributors**: Comments should help someone unfamiliar with the codebase understand critical context within 10 seconds of reading.

## Code Patterns

- **Context-based state**: Global auth state in [W3PK.tsx](../src/context/W3PK.tsx)
- **Dynamic imports**: W3PK provider to avoid SSR issues
- **Client components**: Use `'use client'` for interactive UI
- **Error boundaries**: Graceful error handling in [app/error.tsx](../src/app/error.tsx)
- **Toast notifications**: User feedback via Chakra toaster
- **Modal dialogs**: Critical actions (password input, confirmations)

## Future Roadmap

**In Progress**:

- Chakra UI v3.30.0 refinements
- Advanced settings section
- Login/register flow improvements

**Planned**:

- Social recovery UI (Shamir Secret Sharing)
- QR code backup display
- Browser extension version
- Cloud-encrypted backup option

## Resources

**w3pk SDK**:

- GitHub: https://github.com/w3hc/w3pk
- NPM: https://www.npmjs.com/package/w3pk
- Recovery Docs: https://github.com/w3hc/w3pk/blob/main/docs/RECOVERY.md
- Security Docs: https://github.com/w3hc/w3pk/blob/main/docs/SECURITY.md

**Author**: Julien B�ranger ([@julienbrg](https://github.com/julienbrg))

**License**: GPL-3.0

## Quick Tips for AI Assistants

- **Read first**: Always read existing code before suggesting modifications
- **Check imports**: Chakra UI v3 has different import paths than v2
- **Preserve accessibility**: Maintain ARIA attributes and semantic HTML
- **Test translations**: Verify changes work in all supported languages
- **Respect security**: Never expose private keys or mnemonics unencrypted
- **Keep it simple**: This is a boilerplate; avoid over-engineering
- **Client-side focus**: No backend wallet storage by design
