# Build Verification

This app implements W3PK build verification to provide users with guarantees that they're running an authentic, unmodified version of the W3PK library. This protects against supply chain attacks, compromised packages, and unauthorized modifications.

## Overview

The build verification system:

1. **Automatically verifies** the W3PK package on page load against the onchain registry
2. **Displays verification status** in the UI with visual indicators (green checkmark or red cross)
3. **Logs results to console** for transparency
4. **Exposes verification functions** globally for manual user verification
5. **Queries DAO-maintained onchain registry** on OP Mainnet for trusted hashes

## How It Works

### 1. Onchain Registry

The app queries a DAO-maintained onchain registry for trusted W3PK build hashes:

- **Contract Address:** [`0xAF48C2DB335eD5da14A2C36a59Bc34407C63e01a`](https://optimistic.etherscan.io/address/0xAF48C2DB335eD5da14A2C36a59Bc34407C63e01a)
- **Network:** OP Mainnet (Chain ID: 10)
- **Purpose:** Decentralized source of truth for verified W3PK builds
- **Governance:** DAO-controlled via contract ownership

The registry is queried for the specific W3PK version installed in `package.json`, ensuring verification against the exact version the app depends on.

### 2. Automatic Verification

When the settings page loads, the `BuildVerification` component:

- Imports W3PK functions: `getCurrentBuildHash()`
- Gets the installed W3PK version from `package.json`
- Queries the onchain registry on OP Mainnet for the expected hash for that version
- Fetches the current build hash from the installed W3PK package
- Compares the local hash against the onchain registry hash
- Displays the result in the UI

### 3. Visual Indicators

**Success (Green Checkmark ✅):**

- Build hash matches the onchain registry hash for the installed version
- User sees "Verified W3PK Version" message
- Version, local hash, and onchain hash are displayed for transparency

**Failure (Red Cross ❌):**

- Build hash does NOT match the onchain registry hash
- User sees "Unverified W3PK Version" warning
- Could indicate compromised package, development version, or tampering

### 4. Console Access

The component exposes W3PK functions and registry information globally at `window.w3pk`, allowing users to independently verify the build:

```typescript
if (typeof window !== 'undefined') {
  window.w3pk = {
    getCurrentBuildHash,
    onchainCid,
    installedVersion,
    registryAddress: REGISTRY_ADDRESS,
  }
}
```

## User Verification

### Critical Security Check

**If a user cannot run these commands in the browser console, the app should be considered suspicious:**

```javascript
await window.w3pk.getCurrentBuildHash()
window.w3pk.onchainCid
window.w3pk.installedVersion
```

### Expected Behavior

1. Open browser developer console (F12)
2. Navigate to the settings page
3. You should see automatic verification logs:

```
🔐 W3PK Build Verification
══════════════════════════════════════════════════
Installed version: 0.9.0
Current build hash: bafybeiafdhdxz3c3nhxtrhe7zpxfco5dlywpvzzscl277hojn7zosmrob4
Expected hash:      bafybeiafdhdxz3c3nhxtrhe7zpxfco5dlywpvzzscl277hojn7zosmrob4
Verification:       ✅ VERIFIED
Registry contract:  0xAF48C2DB335eD5da14A2C36a59Bc34407C63e01a
Network:            OP Mainnet
══════════════════════════════════════════════════
Verify manually in console:

  await window.w3pk.getCurrentBuildHash()
  window.w3pk.onchainCid
  window.w3pk.installedVersion

══════════════════════════════════════════════════
```

4. Run manual verification:

```javascript
// Get current build hash
await window.w3pk.getCurrentBuildHash()
// Returns: 'bafybeiafdhdxz3c3nhxtrhe7zpxfco5dlywpvzzscl277hojn7zosmrob4'

// Check the onchain registry hash
window.w3pk.onchainCid
// Returns: 'bafybeiafdhdxz3c3nhxtrhe7zpxfco5dlywpvzzscl277hojn7zosmrob4'

// Check the installed version
window.w3pk.installedVersion
// Returns: '0.9.0'

// Check the registry contract address
window.w3pk.registryAddress
// Returns: '0xAF48C2DB335eD5da14A2C36a59Bc34407C63e01a'
```

## Implementation for Developers

### 1. Automatic Verification

The verification process is now fully automatic and requires no manual hash updates. When you update the W3PK version in `package.json`:

1. The app automatically queries the onchain registry for the new version's hash
2. No code changes needed - the registry lookup is dynamic
3. The DAO-maintained registry ensures the hash is always up-to-date

### 2. Where to Find Official Hashes

Official W3PK build hashes are stored in the onchain registry and can also be found:

- **Onchain Registry**: [`0xAF48C2DB335eD5da14A2C36a59Bc34407C63e01a`](https://optimistic.etherscan.io/address/0xAF48C2DB335eD5da14A2C36a59Bc34407C63e01a) on OP Mainnet
- In the [W3PK GitHub releases](https://github.com/w3hc/w3pk/releases)
- In the [W3PK documentation](https://github.com/w3hc/w3pk/blob/main/docs/BUILD_VERIFICATION.md)
- By running `pnpm build:hash` in the W3PK repository

### 3. Component Integration

The verification component is integrated in two places in the settings page:

**Non-authenticated section** ([src/app/settings/page.tsx:574](../src/app/settings/page.tsx#L574)):

```tsx
<BuildVerification />
```

**Authenticated section - Backup tab** ([src/app/settings/page.tsx:1267](../src/app/settings/page.tsx#L1267)):

```tsx
{
  /* W3PK Build Verification */
}
;<BuildVerification />
```

## Security Considerations

### Why This Matters

Build verification protects users from:

1. **Supply Chain Attacks**: Compromised npm packages or CDN tampering
2. **Package Substitution**: Malicious actors replacing legitimate packages
3. **Development Versions**: Accidentally running unaudited development code
4. **MITM Attacks**: Man-in-the-middle attacks during package installation

### Trust Model

The security of this system relies on:

1. **Onchain Registry**: The DAO-maintained registry on OP Mainnet is the source of truth
2. **Code Integrity**: The verification code itself must not be tampered with
3. **W3PK Functions**: The `getCurrentBuildHash()` function from W3PK is trusted
4. **RPC Provider**: The Ethereum RPC provider (mainnet.optimism.io) is trusted

### Red Flags

Users should be suspicious if:

1. `window.w3pk` is undefined in the console
2. Verification functions return unexpected results
3. The UI shows "Unverified W3PK Version" on a production app
4. Console logs are missing or incomplete
5. Build hashes don't match the onchain registry
6. The registry contract address is different from the official address
7. Network is not OP Mainnet

## How W3PK Build Verification Works

W3PK's build verification system computes an IPFS CIDv1 hash from the concatenated main build artifacts:

1. Fetches `index.js`, `index.mjs`, and `index.d.ts` from the build
2. Concatenates them in order
3. Computes a SHA-256 hash of the concatenated data
4. Formats the hash as an IPFS CIDv1 (multihash + CIDv1 format + base32 encoding)

The resulting hash is deterministic and can be independently verified by anyone with access to the build files.

## Resources

- [W3PK Build Verification Documentation](https://github.com/w3hc/w3pk/blob/main/docs/BUILD_VERIFICATION.md)
- [W3PK GitHub Repository](https://github.com/w3hc/w3pk)
- [W3PK Security Documentation](https://github.com/w3hc/w3pk/blob/main/docs/SECURITY.md)

## Troubleshooting

### Verification Fails

If verification fails in a legitimate app:

1. Check if you're using a development version of W3PK
2. Verify you have the correct trusted hash for your W3PK version
3. Check your `package.json` for the W3PK version
4. Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
5. Verify the hash from official W3PK sources

### Console Functions Unavailable

If `window.w3pk` is undefined:

1. Ensure you're on the settings page where `BuildVerification` component is loaded
2. Check browser console for any errors during component mount
3. Verify the component is properly imported and rendered
4. This could indicate the app has been tampered with - **be suspicious**

## FAQ

**Q: Can users trust the verification if the app itself might be compromised?**

A: Users can independently verify by:

- Checking the open-source code on GitHub
- Querying the onchain registry directly via Etherscan
- Running verification using the unpkg CDN (see console instructions)
- Comparing hashes from the onchain registry with their local build
- Verifying the app's code through the deployed source

**Q: What if I'm developing and the verification fails?**

A: During development with unreleased W3PK versions, verification will fail if the version is not yet in the onchain registry. This is expected. You can:

- Use a released version of W3PK for development
- Skip verification in development mode
- Wait for the new version to be added to the registry

**Q: How often do I need to update the verification code?**

A: Never! The verification code automatically queries the onchain registry for the installed version. When you update W3PK in `package.json`, the app will automatically verify against the new version's hash from the registry.

**Q: What should users do if verification fails?**

A: Users should:

1. Not enter any sensitive information
2. Check if they're using an official app deployment
3. Verify the registry contract address matches the official address
4. Contact the app maintainers
5. Verify the app's source code
6. Consider it a security incident until resolved
