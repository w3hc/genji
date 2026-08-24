/**
 * Translation system for the application
 * Contains all text strings organized by language
 */

import { Language } from '@/utils/i18n'

// Russian has three plural forms (unlike English's two); this picks the right one
// for a count so translation strings don't need to repeat the modulo logic inline.
function ruPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

// Define the structure of our translations
type TranslationKeys = {
  common: {
    login: string
    logout: string
    pleaseLogin: string
    cancel: string
    srLoadingText: string
    loading: string
    notAvailable: string
    close: string
  }
  home: {
    title: string
    subtitle: string
    greeting: string
    greetingSubtitle: string
    signMessage: string
    messageSignedTitle: string
    messageSignedDescription: (signature: string) => string
  }
  navigation: {
    about: string
    settings: string
  }
  settings: {
    title: string
    loginRequired: string
    subtitle: string
    tabAccounts: string
    tabBackup: string
    tabSync: string
    tabRecovery: string

    browserInfoHeading: string
    browserLabel: string
    versionLabel: string
    osLabel: string
    webauthnSupportLabel: string
    compatibilityLabel: string
    available: string
    notAvailable: string
    fullySupported: string
    knownIssues: string
    notSupported: string
    browserNotSupportedTitle: string
    knownIssuesTitle: string
    recommendationTitle: string
    webauthnNotAvailableTitle: string
    webauthnNotAvailableText: string
    browserChrome: string
    browserFirefox: string
    browserSafari: string
    browserEdge: string
    browserSamsung: string
    androidRecommendedHeading: string
    samsungInternetNote: string
    chromeNote: string
    edgeNote: string
    firefoxMobileNote: string

    restoreBackupHeading: string
    restoreBackupDescription: string
    restoreBackupSyncHint: string
    restoringText: string
    restoreBackupButton: string

    debugStorageHeading: string
    debugStorageDescription: string
    inspectingText: string
    inspectLocalStorageButton: string
    inspectIndexedDBButton: string

    inspectSecurityDescriptionSmall: string
    inspectSecurityButton: string
    consoleCommandLabel: string
    clearReportButton: string
    filesAnalyzedLabel: string
    inspectionHeadingBig: string
    inspectSecurityDescriptionBig: string
    inspectNowButton: string
    consoleHintText: string
    securityReportHeading: string
    appUrlLabel: string

    localStorageResultsHeading: string
    itemsCount: (n: number) => string
    encryptedBadge: string
    clearItemAria: string
    indexedDBResultsHeading: string
    databasesCount: (n: number) => string
    storesLabel: string
    recordsLabel: string
    clearRecordAria: string
    storeKeyLabel: (store: string, key: string) => string

    currentAccountHeading: string
    currentAccountDescription: string
    noAccounts: string
    currentBadge: string
    usernameLabel: (username: string) => string
    deleteAccountAria: string

    sessionHeading: string
    sessionDescription: string
    noStoredSessionText: string
    sessionDurationLabel: string
    dayLabel: (n: number) => string
    oneDayLabel: string
    thirtyDaysLabel: string
    sessionHowItWorksTitle: string
    sessionHowItWorksText: string

    walletBackupHeading: string
    walletBackupDescription: string
    currentAccountBackupHeading: string
    loggedInAsLabel: string
    loadingAddressesText: string
    index0Label: string
    mainAddressLabel: string
    loadingText: string
    securityStatusHeading: string
    checkingStatusText: string
    refreshHeading: string
    refreshDescription: string
    checkingText: string
    refreshButton: string
    createHeading: string
    createDescription: string
    creatingText: string
    createButton: string
    restoreHeadingCard: string
    restoreDescriptionCard: string
    restoreButtonCard: string
    aboutBackupHeading: string
    aboutBackupPara1: string
    aboutBackupPara2: string
    aboutBackupPara3: string
    aboutBackupWarning: string

    socialRecoveryHeading: string
    socialRecoveryDescription: string
    setupHeading: string
    setupDescription: (threshold: number, count: number) => string
    guardianNameLabel: string
    guardianEmailLabel: string
    addGuardianButton: string
    guardiansListHeading: (n: number) => string
    removeGuardianAria: string
    thresholdLabel: (threshold: number, count: number) => string
    thresholdDescription: string
    setupSocialRecoveryButton: (threshold: number, count: number | string) => string
    howItWorksRecoveryInfo: (count: number | string, threshold: number) => string
    recoverWalletHeading: string
    hideButton: string
    showButton: string
    recoverDescription: string
    shareCodeLabel: string
    sharePlaceholder: string
    addShareButton: string
    uploadFileButton: string
    clearAllButton: string
    collectedSharesHeading: (n: number) => string
    guardianFallback: string
    shareIndexLabel: (n: number) => string
    addedAtLabel: (time: string) => string
    removeShareAria: string
    invalidShareLabel: (n: number) => string
    progressHeading: string
    progressText: (n: number) => string
    recoveringText: string
    recoverButton: (n: number) => string
    importantWarning: string
    activeHeading: string
    activeDescription: (threshold: number, count: number) => string
    generateInviteButton: string
    removeConfigQuestion: string
    removeConfigButton: string
    invitationHeading: string
    downloadInviteButton: string
    sendInviteText: (name: string) => string

    deviceSyncHeading: string
    deviceSyncDescription: string
    qrHeading: string
    qrDescription: string
    generateQrButton: string
    qrNote: string
    hideQrButton: string
    verifyHeading: string
    verifyDescription: string
    verifyPlaceholder: string
    errorLabel: string
    parsedDataLabel: string
    usernameFieldLabel: string
    ethAddressLabel: string
    index0FieldLabel: string
    mainTaggedLabel: string
    openbarTaggedLabel: string
    generatedLabel: string
    linkWalletButton: string
    linkExplanation: string
    howQrWorksHeading: string
    qrStep1: string
    qrStep2: string
    qrStep3: string
    whatGetsStored: string
    platformSyncHeading: string
    platformSyncIntro: string
    appleSyncNote: string
    googleSyncNote: string
    windowsSyncNote: string
    hardwareSyncNote: string
    crossPlatformNote: string
    bestPracticesHeading: string
    practiceBackupFirst: string
    practiceVerifyAddresses: string
    practiceUseDebugTools: string
    practiceNeverShareQr: string
    practiceTreatAsSensitive: string

    createBackupModalTitle: string
    createBackupModalDescription: string
    restoreBackupModalTitle: string
    restoreBackupModalDescription: string
    chooseUsernameModalTitle: string
    chooseUsernameModalDescription: string
    usernameFormatError: string
    restoringRegisteringText: string
    restoreRegisterButton: string
    removeAccountModalTitle: string
    removeAccountConfirm: (username: string) => string
    removeAccountWarning: string
    removeAccountLoggedOutNote: string
    removeAccountButton: string
    localStorageModalTitle: string
    foundItemsText: (n: number) => string
    noDataFound: string
    indexedDBModalTitle: string
    foundDatabasesText: (n: number) => string
    noDatabasesFound: string

    registrationSuccessTitle: string
    registrationSuccessDescription: string
    registrationFailedTitle: string
    registrationFailedDefaultDescription: string
    localStorageInspectedTitle: string
    localStorageInspectedDescription: (n: number) => string
    genericErrorTitle: string
    failedInspectLocalStorage: string
    indexedDBInspectedTitle: string
    indexedDBInspectedDescription: (dbCount: number, recordCount: number) => string
    failedInspectIndexedDB: string
    itemClearedTitle: string
    itemClearedDescription: (key: string) => string
    failedClearItem: (key: string) => string
    recordClearedTitle: string
    recordClearedDescription: (db: string, store: string) => string
    failedClearRecord: string
    errorLoadingAddressesTitle: string
    failedDeriveAddresses: string
    errorLoadingBackupStatusTitle: string
    failedCheckSecurityStatus: string
    accountRemovedTitle: string
    accountRemovedDescription: (username: string) => string
    loggingOutTitle: string
    loggingOutDescription: string
    failedRemoveAccount: string
    errorReadingFileTitle: string
    failedReadBackupFile: string
    noBackupFileSelectedTitle: string
    incompatibleBackupTitle: string
    incompatibleBackupDescription: string
    walletRestoredTitle: string
    walletRestoredDescription: (address: string) => string
    usernameRequiredRestoreDescription: string
    walletRestoredRegisteredTitle: string
    walletRestoredRegisteredDescription: (address: string) => string
    securityReportGeneratedTitle: string
    securityReportGeneratedDescription: string
    inspectionFailedTitle: string
    inspectionFailedDescription: string
    backupStatusRetrievedTitle: string
    errorRetrievingStatusTitle: string
    unexpectedErrorDescription: string
    errorCreatingBackupTitle: string
    backupCreatedTitle: string
    invalidInputTitle: string
    guardianNameRequiredDescription: string
    notEnoughGuardiansTitle: string
    notEnoughGuardiansDescription: string
    invalidThresholdTitle: string
    invalidThresholdDescription: string
    socialRecoveryConfiguredTitle: string
    socialRecoveryConfiguredDescription: (threshold: number, count: number) => string
    pleasePasteShareDescription: string
    duplicateShareTitle: string
    duplicateShareDescription: string
    shareAddedTitle: string
    shareAddedDescription: (name: string) => string
    invalidShareFormatTitle: string
    invalidShareFormatDescription: string
    notEnoughSharesTitle: string
    notEnoughSharesDescription: string
    passwordRequiredRecoveryDescription: string
    usernameRequiredRecoveryDescription: string
    walletRecoveredTitle: string
    walletRecoveredDescription: (address: string) => string
    fileLoadedTitle: string
    fileLoadedDescription: string
    failedReadGuardianFile: string
    cannotSaveTitle: string
    cannotSaveDescription: string
    walletLinkedTitle: string
    walletLinkedDescription: (address: string) => string
    errorSavingLinkTitle: string
    failedSaveSyncData: string
    recoveryPasswordPrompt: string
    recoveryUsernamePrompt: (address: string) => string
  }
  header: {
    registerTitle: string
    walletInfoText: string
    usernameLabel: string
    usernamePlaceholder: string
    usernameError: string
    createAccount: string
    optionsAriaLabel: string
    mainNavAriaLabel: string
    usernameRequiredTitle: string
    usernameRequiredDescription: string
    noAccountFoundTitle: string
    noAccountFoundDescription: string
    alreadyRegisteredLink: string
  }
  passwordModal: {
    passwordLabel: string
    passwordPlaceholder: string
    passwordRequiredTitle: string
    passwordRequiredDescription: string
    weakPasswordTitle: string
    weakPasswordDescription: string
    submissionErrorTitle: string
    submissionErrorDefaultDescription: string
    requirementsNotMet: string
    strongPassword: string
    mustInclude: string
    reqMinLength: string
    reqUpperCase: string
    reqLowerCase: string
    reqNumber: string
    reqSpecialChar: string
    satisfied: string
    required: string
    submit: string
  }
  about: {
    headingPrefix: string
    introPart1: string
    introPart2: string
    emailBoxText: string
    emailPlaceholder: string
    subscribeButton: string
    githubLabel: string
    npmLabel: string
    githubAriaLabel: string
    npmAriaLabel: string
    codeRegisterComment: string
    codeLoginComment: string
    codeLogoutComment: string
    featuresHeading: string
    feature1: string
    feature2: string
    feature3: string
    feature4: string
    feature5: string
    feature6: string
    feature7: string
    feature8: string
    feature9: string
    feature10: string
    feature11: string
    feature12: string
    feature13: string
    feature14: string
    feature15: string
    feature16: string
    feature17: string
    invalidEmailTitle: string
    invalidEmailDescription: string
    subscribeSuccessTitle: string
    subscribeSuccessDescription: string
    subscribeErrorTitle: string
    subscribeErrorDescription: string
  }
}

// Define translations for each supported language
type Translations = {
  [key in Language]: TranslationKeys
}

export const translations: Translations = {
  // English
  en: {
    common: {
      login: 'Login',
      logout: 'Logout',
      pleaseLogin: 'Please login',
      cancel: 'Cancel',
      srLoadingText: 'Loading, please wait...',
      loading: 'Loading...',
      notAvailable: 'Not available',
      close: 'Close',
    },
    home: {
      title: 'Welcome!',
      subtitle: "It's a pleasure to have you here!",
      greeting: 'Hello Anon!',
      greetingSubtitle: 'Sit back, relax, and build something cool!',
      signMessage: 'Sign a message',
      messageSignedTitle: 'Message Signed',
      messageSignedDescription: signature => `Signature: ${signature.substring(0, 20)}...`,
    },
    navigation: {
      about: 'About',
      settings: 'Settings',
    },
    settings: {
      title: 'Settings',
      loginRequired: 'Please login to access your settings',
      subtitle: 'Manage your accounts, backups, and recovery options',
      tabAccounts: 'Accounts',
      tabBackup: 'Backup',
      tabSync: 'Sync',
      tabRecovery: 'Social recovery',

      browserInfoHeading: 'Browser Info',
      browserLabel: 'Browser:',
      versionLabel: 'Version:',
      osLabel: 'Operating System:',
      webauthnSupportLabel: 'WebAuthn Support:',
      compatibilityLabel: 'Compatibility:',
      available: 'Available',
      notAvailable: 'Not Available',
      fullySupported: 'Fully Supported',
      knownIssues: 'Known Issues',
      notSupported: 'Not Supported',
      browserNotSupportedTitle: 'Browser Not Supported',
      knownIssuesTitle: 'Known Issues Detected',
      recommendationTitle: 'Recommendation',
      webauthnNotAvailableTitle: 'WebAuthn Not Available',
      webauthnNotAvailableText:
        'Your browser does not support WebAuthn, which is required for w3pk authentication. Please update your browser or use a supported browser:',
      browserChrome: 'Chrome 67+ (May 2018)',
      browserFirefox: 'Firefox 60+ (May 2018)',
      browserSafari: 'Safari 14+ (September 2020)',
      browserEdge: 'Edge 18+ (November 2018)',
      browserSamsung: 'Samsung Internet 11+ (February 2020)',
      androidRecommendedHeading: 'Recommended Browsers for Android',
      samsungInternetNote: 'Samsung Internet (Best for Samsung devices) - ✅ Confirmed working',
      chromeNote: 'Chrome - ✅ Reliable',
      edgeNote: 'Edge - ✅ Reliable',
      firefoxMobileNote: 'Firefox Mobile - ⚠️ Avoid (known passkey persistence issues)',

      restoreBackupHeading: 'Restore from Backup',
      restoreBackupDescription:
        'If you have a backup file, you can restore your wallet without logging in first.',
      restoreBackupSyncHint:
        'To sync with another device: log in on your other device, go to Settings → Create Backup to download an encrypted backup file, then upload it here and enter the same password.',
      restoringText: 'Restoring...',
      restoreBackupButton: 'Restore from Backup File',

      debugStorageHeading: 'Debug & Inspect Storage',
      debugStorageDescription: 'Inspect browser storage and activity logs',
      inspectingText: 'Inspecting...',
      inspectLocalStorageButton: 'Inspect LocalStorage',
      inspectIndexedDBButton: 'Inspect IndexedDB',

      inspectSecurityDescriptionSmall:
        'Analyze this application for transaction and signing methods.',
      inspectSecurityButton: 'Inspect Security',
      consoleCommandLabel: 'Console command:',
      clearReportButton: 'Clear Report',
      filesAnalyzedLabel: 'Files Analyzed:',
      inspectionHeadingBig: 'Security Inspection',
      inspectSecurityDescriptionBig:
        'Generate a comprehensive security report of this app. The report will analyze all transaction and signing methods.',
      inspectNowButton: 'Inspect now',
      consoleHintText: 'You can also run await w3pk.inspectNow() in the browser console',
      securityReportHeading: 'Security Report',
      appUrlLabel: 'App URL:',

      localStorageResultsHeading: 'LocalStorage Results',
      itemsCount: n => `${n} items`,
      encryptedBadge: 'Encrypted',
      clearItemAria: 'Clear item',
      indexedDBResultsHeading: 'IndexedDB Results',
      databasesCount: n => `${n} database(s)`,
      storesLabel: 'Stores:',
      recordsLabel: 'Records:',
      clearRecordAria: 'Clear record',
      storeKeyLabel: (store, key) => `Store: ${store} | Key: ${key}`,

      currentAccountHeading: 'Current account',
      currentAccountDescription: 'This is your currently logged-in account.',
      noAccounts: 'No accounts found on this device.',
      currentBadge: 'Current',
      usernameLabel: username => `Username: ${username}`,
      deleteAccountAria: 'Delete account',

      sessionHeading: 'Keep my session alive',
      sessionDescription:
        'Set how long your session should stay active without a passkey prompt. When it expires, your next visit asks for your biometric/PIN once and starts a fresh session — so this is also how often you re-authenticate. This setting applies to STANDARD and YOLO modes only. STRICT and PRIMARY modes always require fresh authentication and do not use persistent sessions.',
      noStoredSessionText:
        "No stored session on this device. Your authenticator doesn't appear to support the WebAuthn PRF extension, which w3pk requires to keep sessions alive securely. Your session will stay in memory only: it ends when you close the tab, and each visit will ask for your biometric/PIN. Everything else works normally.",
      sessionDurationLabel: 'Session Duration',
      dayLabel: n => `${n} day${n > 1 ? 's' : ''}`,
      oneDayLabel: '1 day',
      thirtyDaysLabel: '30 days',
      sessionHowItWorksTitle: 'How it works:',
      sessionHowItWorksText:
        "Each time you log in with your biometric/PIN, your authenticator releases a hardware-backed secret (WebAuthn PRF extension) that encrypts your session on this device — nothing stored on disk can recreate that key. The countdown starts fresh at each real login: with a 7-day duration, logging in today keeps you signed in until 7 days from today, when you'll be prompted once and the session is re-encrypted under a fresh key.",

      walletBackupHeading: 'Wallet Backup',
      walletBackupDescription:
        'Create encrypted backups of your wallet to ensure you never lose access',
      currentAccountBackupHeading: 'Current Account',
      loggedInAsLabel: 'Logged in as:',
      loadingAddressesText: 'Loading addresses...',
      index0Label: 'Index #0 address:',
      mainAddressLabel: 'Origin-specific, STANDARD mode, MAIN-tagged address (default wallet):',
      loadingText: 'Loading...',
      securityStatusHeading: 'Security Status',
      checkingStatusText: 'Checking backup status...',
      refreshHeading: 'Refresh Backup Status',
      refreshDescription: 'Reload your current security score and backup recommendations',
      checkingText: 'Checking...',
      refreshButton: 'Refresh Status',
      createHeading: 'Create Backup',
      createDescription: 'Download an encrypted backup file protected by your password',
      creatingText: 'Creating...',
      createButton: 'Create Backup',
      restoreHeadingCard: 'Restore from Backup',
      restoreDescriptionCard: 'Restore your wallet from an encrypted backup file',
      restoreButtonCard: 'Restore Backup',
      aboutBackupHeading: 'About Client-Side Backup',
      aboutBackupPara1:
        "Your wallet's core secret (the mnemonic phrase) is generated and encrypted entirely on your device. The backup process retrieves this encrypted data from your browser's local storage using your password, then packages it into a secure file for you to download.",
      aboutBackupPara2:
        'The encryption key for your wallet is derived using a WebAuthn signature, which requires your biometric authentication (fingerprint, face scan) or device PIN. This means even if someone gains access to the encrypted data stored in your browser, they cannot decrypt it without your physical device and authentication.',
      aboutBackupPara3:
        'Your backup file is encrypted using AES-256-GCM with a key derived from the password you provide. Store this file securely and remember your password.',
      aboutBackupWarning:
        'If you lose access to your device, passkey, AND the backup file/password, your wallet cannot be recovered.',

      socialRecoveryHeading: 'Social Recovery',
      socialRecoveryDescription:
        'Distribute your wallet recovery among trusted guardians using Shamir Secret Sharing',
      setupHeading: 'Setup Social Recovery',
      setupDescription: (threshold, count) =>
        `Add trusted guardians who will help you recover your wallet. You'll need ${threshold} out of ${count || '?'} guardians to recover.`,
      guardianNameLabel: 'Guardian Name *',
      guardianEmailLabel: 'Guardian Email (Optional)',
      addGuardianButton: 'Add Guardian',
      guardiansListHeading: n => `Guardians (${n})`,
      removeGuardianAria: 'Remove guardian',
      thresholdLabel: (threshold, count) => `Recovery Threshold: ${threshold} of ${count}`,
      thresholdDescription: 'Number of guardians needed to recover your wallet',
      setupSocialRecoveryButton: (threshold, count) =>
        `Setup Social Recovery (${threshold}-of-${count || '?'})`,
      howItWorksRecoveryInfo: (count, threshold) =>
        `How it works: Your wallet recovery will be split into ${count || '?'} encrypted shares using Shamir Secret Sharing. You'll need ${threshold} guardians to combine their shares to recover your wallet. No single guardian can access your wallet alone.`,
      recoverWalletHeading: 'Recover Wallet',
      hideButton: 'Hide',
      showButton: 'Show',
      recoverDescription: 'Lost access to your wallet? Collect guardian shares to recover it.',
      shareCodeLabel: 'Guardian Share Code',
      sharePlaceholder: 'Paste guardian share JSON here (e.g., {"guardianId":"...","share":"..."})',
      addShareButton: 'Add Share',
      uploadFileButton: 'Upload File',
      clearAllButton: 'Clear All',
      collectedSharesHeading: n => `Collected Shares (${n})`,
      guardianFallback: 'Guardian',
      shareIndexLabel: n => `(#${n})`,
      addedAtLabel: time => `Added ${time}`,
      removeShareAria: 'Remove share',
      invalidShareLabel: n => `Invalid share #${n}`,
      progressHeading: 'Recovery Progress',
      progressText: n => `${n} share(s) collected. You need at least 2 shares to attempt recovery.`,
      recoveringText: 'Recovering...',
      recoverButton: n => `Recover Wallet (${n} shares)`,
      importantWarning:
        'Important: Make sure the shares are from the correct guardians. Invalid shares will cause recovery to fail.',
      activeHeading: 'Social Recovery Active',
      activeDescription: (threshold, count) =>
        `Your wallet is protected with ${threshold}-of-${count} guardian recovery`,
      generateInviteButton: 'Generate Invite',
      removeConfigQuestion:
        'All guardians have their shares? You can now remove the guardian configuration from local storage. The shares are safely stored with your guardians and can be used for recovery anytime.',
      removeConfigButton: 'Clear Guardian Config from Local Storage',
      invitationHeading: 'Guardian Invitation',
      downloadInviteButton: 'Download Invitation',
      sendInviteText: name => `Send this invitation to ${name} via a secure channel`,

      deviceSyncHeading: 'Device Sync',
      deviceSyncDescription:
        'Your passkey automatically syncs across devices using platform services',
      qrHeading: 'Sync QR Code',
      qrDescription:
        'Generate a QR code containing your wallet addresses to easily sync or verify your account information on another device.',
      generateQrButton: 'Generate Sync QR Code',
      qrNote:
        'Note: This QR code contains your public wallet addresses only. It does NOT contain your private keys or recovery phrase. Use it to verify your account on another device.',
      hideQrButton: 'Hide QR Code',
      verifyHeading: 'Verify QR Code Data',
      verifyDescription:
        'Paste the JSON string from a scanned QR code to verify the wallet addresses.',
      verifyPlaceholder: 'Paste JSON data here (e.g., {"username":"...","ethereumAddress":"..."})',
      errorLabel: 'Error:',
      parsedDataLabel: 'Parsed Data:',
      usernameFieldLabel: 'Username:',
      ethAddressLabel: 'Ethereum Address:',
      index0FieldLabel: 'Index #0:',
      mainTaggedLabel: 'MAIN-tagged:',
      openbarTaggedLabel: 'OPENBAR-tagged:',
      generatedLabel: 'Generated:',
      linkWalletButton: 'Link This Wallet to Your Passkey Account',
      linkExplanation:
        'What happens when you link: This will save the wallet addresses to both localStorage and IndexedDB, creating a persistent link between your passkey account and this HD wallet. You can use this to verify or sync wallet data across devices.',
      howQrWorksHeading: 'How QR Code Wallet Sync Works',
      qrStep1:
        "Step 1: Generate QR Code - On your primary device, generate a QR code containing your wallet's public addresses. This QR code is safe to share as it only contains public information.",
      qrStep2:
        'Step 2: Scan & Verify - On your secondary device, scan the QR code using any QR scanner app, or manually copy the JSON data displayed in the QR code.',
      qrStep3:
        'Step 3: Link Wallets - Paste the JSON data into the verification area above and click "Link This Wallet". This creates a persistent connection between your passkey account and the HD wallet addresses.',
      whatGetsStored:
        'What Gets Stored: Only public wallet addresses are stored in localStorage and IndexedDB. Your private keys and recovery phrase remain secure and are never transmitted or stored through this sync mechanism.',
      platformSyncHeading: 'Passkey Platform Sync',
      platformSyncIntro:
        'Your passkey credentials automatically sync across devices within the same ecosystem:',
      appleSyncNote: 'Apple: Syncs via iCloud Keychain (iPhone, iPad, Mac)',
      googleSyncNote: 'Google: Syncs via Password Manager (Android, Chrome)',
      windowsSyncNote: 'Windows Hello: Device-specific, use encrypted backup for new devices',
      hardwareSyncNote: 'Hardware Keys: No sync, keep encrypted backup separately',
      crossPlatformNote:
        'Cross-platform limitation: Passkeys do not sync across different ecosystems (e.g., iPhone to Android). However, encrypted backups ARE fully cross-platform - you can restore your wallet on any device with the backup file and password, regardless of the original platform.',
      bestPracticesHeading: 'Best Practices',
      practiceBackupFirst: 'Always create an encrypted backup before syncing to a new device',
      practiceVerifyAddresses: 'Verify wallet addresses match after syncing',
      practiceUseDebugTools:
        'Use the Debug & Inspect Storage tools to verify sync data was saved correctly',
      practiceNeverShareQr: 'Never share your QR code publicly or on untrusted channels',
      practiceTreatAsSensitive:
        'QR codes only contain public addresses, but still treat them as sensitive account information',

      createBackupModalTitle: 'Enter Password to Create Backup',
      createBackupModalDescription:
        'Please enter your password to create the backup. This is required by the w3pk SDK to access your encrypted wallet data.',
      restoreBackupModalTitle: 'Enter Password to Restore Backup',
      restoreBackupModalDescription:
        'Please enter the password you used when creating this backup file.',
      chooseUsernameModalTitle: 'Choose Username for Restored Wallet',
      chooseUsernameModalDescription:
        'No existing credentials found on this device. Please choose a username to register your restored wallet with a new passkey.',
      usernameFormatError:
        'Username must be 3-50 characters, alphanumeric with underscores/hyphens, and start/end with alphanumeric.',
      restoringRegisteringText: 'Restoring & Registering...',
      restoreRegisterButton: 'Restore & Register',
      removeAccountModalTitle: 'Remove Account',
      removeAccountConfirm: username => `Are you sure you want to remove the account ${username}?`,
      removeAccountWarning:
        'Warning: This will delete all data for this account from this device. Make sure you have a backup before proceeding. This action cannot be undone.',
      removeAccountLoggedOutNote:
        'This is your currently logged-in account. You will be logged out after removal.',
      removeAccountButton: 'Remove Account',
      localStorageModalTitle: 'LocalStorage Inspection',
      foundItemsText: n => `Found ${n} items in localStorage`,
      noDataFound: 'No data found',
      indexedDBModalTitle: 'IndexedDB Inspection',
      foundDatabasesText: n => `Found ${n} database(s)`,
      noDatabasesFound: 'No w3pk-related databases found',

      registrationSuccessTitle: 'Registration Successful',
      registrationSuccessDescription: 'Your new account has been created.',
      registrationFailedTitle: 'Registration Failed',
      registrationFailedDefaultDescription: 'Unable to complete registration. Please try again.',
      localStorageInspectedTitle: 'LocalStorage Inspected',
      localStorageInspectedDescription: n => `Found ${n} items. Scroll down to see results.`,
      genericErrorTitle: 'Error',
      failedInspectLocalStorage: 'Failed to inspect localStorage',
      indexedDBInspectedTitle: 'IndexedDB Inspected',
      indexedDBInspectedDescription: (dbCount, recordCount) =>
        `Found ${dbCount} database(s) with ${recordCount} record(s). Scroll down to see results.`,
      failedInspectIndexedDB: 'Failed to inspect IndexedDB',
      itemClearedTitle: 'Item Cleared',
      itemClearedDescription: key => `Removed "${key}" from localStorage`,
      failedClearItem: key => `Failed to clear "${key}"`,
      recordClearedTitle: 'Record Cleared',
      recordClearedDescription: (db, store) => `Removed record from ${db}/${store}`,
      failedClearRecord: 'Failed to clear record',
      errorLoadingAddressesTitle: 'Error loading addresses',
      failedDeriveAddresses: 'Failed to derive wallet addresses',
      errorLoadingBackupStatusTitle: 'Error loading backup status',
      failedCheckSecurityStatus: 'Failed to check security status',
      accountRemovedTitle: 'Account Removed',
      accountRemovedDescription: username =>
        `Account ${username} has been removed from this device.`,
      loggingOutTitle: 'Logging out',
      loggingOutDescription: 'You removed your current account. Logging out...',
      failedRemoveAccount: 'Failed to remove account. Please try again.',
      errorReadingFileTitle: 'Error reading file',
      failedReadBackupFile: 'Failed to read backup file',
      noBackupFileSelectedTitle: 'No backup file selected',
      incompatibleBackupTitle: 'Incompatible Backup Version',
      incompatibleBackupDescription:
        'This backup was created with an older version of w3pk. Please create a new backup with the current version.',
      walletRestoredTitle: 'Wallet Restored!',
      walletRestoredDescription: address =>
        `Successfully restored and overwrote wallet: ${address}`,
      usernameRequiredRestoreDescription:
        'Please enter a username to register with the restored wallet.',
      walletRestoredRegisteredTitle: 'Wallet Restored & Registered!',
      walletRestoredRegisteredDescription: address =>
        `Successfully restored and registered wallet: ${address}`,
      securityReportGeneratedTitle: 'Security Report Generated',
      securityReportGeneratedDescription: 'View the detailed analysis below',
      inspectionFailedTitle: 'Inspection Failed',
      inspectionFailedDescription:
        "Host app inspection did not work. It's probably due to Anthropic request rate limit reached.",
      backupStatusRetrievedTitle: 'Backup Status Retrieved.',
      errorRetrievingStatusTitle: 'Error retrieving status.',
      unexpectedErrorDescription: 'An unexpected error occurred.',
      errorCreatingBackupTitle: 'Error creating backup.',
      backupCreatedTitle: 'Backup Created Successfully!',
      invalidInputTitle: 'Invalid Input',
      guardianNameRequiredDescription: 'Guardian name is required',
      notEnoughGuardiansTitle: 'Not Enough Guardians',
      notEnoughGuardiansDescription: 'You need at least 2 guardians to set up social recovery',
      invalidThresholdTitle: 'Invalid Threshold',
      invalidThresholdDescription: 'Threshold cannot be greater than number of guardians',
      socialRecoveryConfiguredTitle: 'Social Recovery Configured!',
      socialRecoveryConfiguredDescription: (threshold, count) =>
        `Successfully set up ${threshold}-of-${count} guardian recovery`,
      pleasePasteShareDescription: 'Please paste a guardian share code',
      duplicateShareTitle: 'Duplicate Share',
      duplicateShareDescription: 'This guardian share has already been added',
      shareAddedTitle: 'Share Added',
      shareAddedDescription: name => `Added share from ${name}`,
      invalidShareFormatTitle: 'Invalid Share Format',
      invalidShareFormatDescription: 'Please paste a valid guardian share code (JSON format)',
      notEnoughSharesTitle: 'Not Enough Shares',
      notEnoughSharesDescription: 'You need at least 2 guardian shares to recover your wallet',
      passwordRequiredRecoveryDescription:
        'You need to enter your password to decrypt the backup file',
      usernameRequiredRecoveryDescription:
        'You need to provide a username to register your recovered wallet',
      walletRecoveredTitle: 'Wallet Recovered Successfully!',
      walletRecoveredDescription: address =>
        `Your wallet has been recovered and registered with a new passkey: ${address}`,
      fileLoadedTitle: 'File Loaded',
      fileLoadedDescription: 'Guardian share loaded from file. Click "Add Share" to add it.',
      failedReadGuardianFile: 'Failed to read guardian share file',
      cannotSaveTitle: 'Cannot save',
      cannotSaveDescription: 'Invalid QR data or user not authenticated',
      walletLinkedTitle: 'Wallet Linked Successfully!',
      walletLinkedDescription: address => `Linked wallet ${address} to your passkey account`,
      errorSavingLinkTitle: 'Error saving wallet link',
      failedSaveSyncData: 'Failed to save wallet sync data',
      recoveryPasswordPrompt:
        'Enter the password you set when configuring social recovery.\n\nThis password was NOT shared with guardians - you set it during setup.',
      recoveryUsernamePrompt: address =>
        `Choose a username for your new passkey registration.\n\nRecovering wallet: ${address}`,
    },
    header: {
      registerTitle: 'Register New Account',
      walletInfoText:
        'An Ethereum wallet will be created and securely stored on your device, protected by your biometric or PIN thanks to',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter your username',
      usernameError:
        'Username must be 3-50 characters long and contain only letters, numbers, underscores, and hyphens. It must start and end with a letter or number.',
      createAccount: 'Create Account',
      optionsAriaLabel: 'Options',
      mainNavAriaLabel: 'Main navigation',
      usernameRequiredTitle: 'Username Required',
      usernameRequiredDescription: 'Please enter a username to register.',
      noAccountFoundTitle: 'No Account Found',
      noAccountFoundDescription: 'No passkey found. Please register to create a new account.',
      alreadyRegisteredLink: 'I already registered on another device',
    },
    passwordModal: {
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      passwordRequiredTitle: 'Password Required.',
      passwordRequiredDescription: 'Please enter your password.',
      weakPasswordTitle: 'Weak Password.',
      weakPasswordDescription: 'Please use a stronger password that meets all requirements.',
      submissionErrorTitle: 'Submission Error.',
      submissionErrorDefaultDescription: 'An unexpected error occurred.',
      requirementsNotMet: 'Password does not meet all requirements',
      strongPassword: 'Strong password!',
      mustInclude: 'Password must include:',
      reqMinLength: 'At least 12 characters',
      reqUpperCase: 'One uppercase letter',
      reqLowerCase: 'One lowercase letter',
      reqNumber: 'One number',
      reqSpecialChar: 'One special character',
      satisfied: ' (satisfied)',
      required: ' (required)',
      submit: 'Submit',
    },
    about: {
      headingPrefix: 'About',
      introPart1:
        'w3pk is a passwordless Web3 authentication SDK with encrypted wallets and privacy features. You can use it in any JS/TS-based web app (Next.js, Vue, Angular, Svelte, …).',
      introPart2: 'is a Next.js app template, feel free to fork it and build whatever you want!',
      emailBoxText:
        'w3pk is under dev. Receive emails when we ship new features (EIP-1193 support, AI capacities, Viem helpers, chain abstraction, and more)',
      emailPlaceholder: 'your@email.com',
      subscribeButton: 'Subscribe',
      githubLabel: 'GitHub',
      npmLabel: 'NPM',
      githubAriaLabel: 'View w3pk on GitHub (opens in new tab)',
      npmAriaLabel: 'View w3pk on NPM (opens in new tab)',
      codeRegisterComment: '// Register',
      codeLoginComment: '// Login',
      codeLogoutComment: '// Logout',
      featuresHeading: 'Features',
      feature1: 'Passwordless authentication (WebAuthn/FIDO2)',
      feature2: 'Origin-specific key isolation with tag-based access control',
      feature3: 'Session management (in-memory + optional persistent)',
      feature4: 'HD wallet generation (BIP39/BIP44)',
      feature5: 'Multi-address derivation with security modes (STANDARD/STRICT/YOLO)',
      feature6: 'Multiple signing methods (EIP-191, SIWE/EIP-4361, EIP-712, rawHash)',
      feature7: 'On-chain transaction sending with automatic RPC resolution (`sendTransaction`)',
      feature8: 'EIP-1193 provider for ethers, viem, wagmi, RainbowKit (`getEIP1193Provider`)',
      feature9: 'ERC-5564 stealth addresses (opt-in)',
      feature10: 'ZK primitives (zero-knowledge proof generation and verification)',
      feature11: 'Chainlist support (2390+ networks)',
      feature12: 'EIP-7702 network detection (329+ networks)',
      feature13: 'External wallet integration (delegate MetaMask/Ledger to w3pk via EIP-7702)',
      feature14: 'EIP-7951 PRIMARY mode (P-256 passkey signing)',
      feature15: 'Build verification (IPFS CID hashing + DAO-maintained onchain registry)',
      feature16: 'Three-layer backup & recovery (passkey sync, encrypted backups, social recovery)',
      feature17: 'AI-powered host app inspection',
      invalidEmailTitle: 'Invalid email',
      invalidEmailDescription: 'Please enter a valid email address',
      subscribeSuccessTitle: 'Success!',
      subscribeSuccessDescription: 'You have been subscribed to w3pk updates',
      subscribeErrorTitle: 'Error',
      subscribeErrorDescription: 'Failed to subscribe. Please try again.',
    },
  },

  // Chinese
  zh: {
    common: {
      login: '登录',
      logout: '登出',
      pleaseLogin: '请登录',
      cancel: '取消',
      srLoadingText: '加载中，请稍候...',
      loading: '加载中...',
      notAvailable: '不可用',
      close: '关闭',
    },
    home: {
      title: '欢迎！',
      subtitle: '很高兴您来到这里！',
      greeting: '你好，匿名用户！',
      greetingSubtitle: '坐下来，放松，创造一些很酷的东西！',
      signMessage: '签署消息',
      messageSignedTitle: '消息已签署',
      messageSignedDescription: signature => `签名：${signature.substring(0, 20)}...`,
    },
    navigation: {
      about: '关于',
      settings: '设置',
    },
    settings: {
      title: '设置',
      loginRequired: '请登录以访问您的设置',
      subtitle: '管理您的账户、备份和恢复选项',
      tabAccounts: '账户',
      tabBackup: '备份',
      tabSync: '同步',
      tabRecovery: '社交恢复',

      browserInfoHeading: '浏览器信息',
      browserLabel: '浏览器：',
      versionLabel: '版本：',
      osLabel: '操作系统：',
      webauthnSupportLabel: 'WebAuthn 支持：',
      compatibilityLabel: '兼容性：',
      available: '可用',
      notAvailable: '不可用',
      fullySupported: '完全支持',
      knownIssues: '已知问题',
      notSupported: '不支持',
      browserNotSupportedTitle: '浏览器不受支持',
      knownIssuesTitle: '检测到已知问题',
      recommendationTitle: '建议',
      webauthnNotAvailableTitle: 'WebAuthn 不可用',
      webauthnNotAvailableText:
        '您的浏览器不支持 WebAuthn，而 w3pk 身份验证需要该功能。请更新您的浏览器或使用受支持的浏览器：',
      browserChrome: 'Chrome 67 及以上版本（2018年5月）',
      browserFirefox: 'Firefox 60 及以上版本（2018年5月）',
      browserSafari: 'Safari 14 及以上版本（2020年9月）',
      browserEdge: 'Edge 18 及以上版本（2018年11月）',
      browserSamsung: 'Samsung Internet 11 及以上版本（2020年2月）',
      androidRecommendedHeading: 'Android 推荐浏览器',
      samsungInternetNote: 'Samsung Internet（三星设备最佳选择）- ✅ 确认可用',
      chromeNote: 'Chrome - ✅ 稳定可靠',
      edgeNote: 'Edge - ✅ 稳定可靠',
      firefoxMobileNote: 'Firefox 移动版 - ⚠️ 请避免使用（已知通行密钥持久化问题）',

      restoreBackupHeading: '从备份恢复',
      restoreBackupDescription: '如果您有备份文件，无需先登录即可恢复您的钱包。',
      restoreBackupSyncHint:
        '要与其他设备同步：请在您的另一台设备上登录，前往"设置 → 创建备份"下载加密备份文件，然后在此处上传该文件并输入相同的密码。',
      restoringText: '正在恢复...',
      restoreBackupButton: '从备份文件恢复',

      debugStorageHeading: '调试与检查存储',
      debugStorageDescription: '检查浏览器存储和活动日志',
      inspectingText: '正在检查...',
      inspectLocalStorageButton: '检查 LocalStorage',
      inspectIndexedDBButton: '检查 IndexedDB',

      inspectSecurityDescriptionSmall: '分析此应用程序的交易和签名方法。',
      inspectSecurityButton: '检查安全性',
      consoleCommandLabel: '控制台命令：',
      clearReportButton: '清除报告',
      filesAnalyzedLabel: '已分析文件：',
      inspectionHeadingBig: '安全检查',
      inspectSecurityDescriptionBig:
        '生成此应用程序的全面安全报告。该报告将分析所有交易和签名方法。',
      inspectNowButton: '立即检查',
      consoleHintText: '您也可以在浏览器控制台中运行 await w3pk.inspectNow()',
      securityReportHeading: '安全报告',
      appUrlLabel: '应用网址：',

      localStorageResultsHeading: 'LocalStorage 结果',
      itemsCount: n => `${n} 项`,
      encryptedBadge: '已加密',
      clearItemAria: '清除项目',
      indexedDBResultsHeading: 'IndexedDB 结果',
      databasesCount: n => `${n} 个数据库`,
      storesLabel: '存储对象：',
      recordsLabel: '记录：',
      clearRecordAria: '清除记录',
      storeKeyLabel: (store, key) => `存储对象：${store} | 键：${key}`,

      currentAccountHeading: '当前账户',
      currentAccountDescription: '这是您当前登录的账户。',
      noAccounts: '在此设备上未找到任何账户。',
      currentBadge: '当前',
      usernameLabel: username => `用户名：${username}`,
      deleteAccountAria: '删除账户',

      sessionHeading: '保持我的会话有效',
      sessionDescription:
        '设置您的会话在不弹出通行密钥提示的情况下保持有效的时长。会话过期后，您下次访问时将被要求进行一次生物识别/PIN验证，并开始一个新的会话——这也决定了您重新进行身份验证的频率。此设置仅适用于 STANDARD 和 YOLO 模式。STRICT 和 PRIMARY 模式始终需要重新进行身份验证，不使用持久化会话。',
      noStoredSessionText:
        '此设备上没有存储的会话。您的身份验证器似乎不支持 WebAuthn PRF 扩展，而 w3pk 需要该扩展来安全地保持会话有效。您的会话将仅保存在内存中：关闭标签页后即结束，每次访问都会要求进行生物识别/PIN验证。其他功能均正常运作。',
      sessionDurationLabel: '会话时长',
      dayLabel: n => `${n} 天`,
      oneDayLabel: '1 天',
      thirtyDaysLabel: '30 天',
      sessionHowItWorksTitle: '工作原理：',
      sessionHowItWorksText:
        '每次使用生物识别/PIN登录时，您的身份验证器都会释放一个由硬件保护的密钥（WebAuthn PRF 扩展），用于加密您在此设备上的会话——磁盘上存储的任何数据都无法重新生成该密钥。每次真正登录都会重新开始倒计时：例如设置为7天时长，今天登录后您将保持登录状态直到7天后，届时系统会提示您验证一次，并在新密钥下重新加密会话。',

      walletBackupHeading: '钱包备份',
      walletBackupDescription: '创建钱包的加密备份，确保您永远不会失去访问权限',
      currentAccountBackupHeading: '当前账户',
      loggedInAsLabel: '登录身份：',
      loadingAddressesText: '正在加载地址...',
      index0Label: '索引 #0 地址：',
      mainAddressLabel: '特定来源、STANDARD 模式、MAIN 标记地址（默认钱包）：',
      loadingText: '加载中...',
      securityStatusHeading: '安全状态',
      checkingStatusText: '正在检查备份状态...',
      refreshHeading: '刷新备份状态',
      refreshDescription: '重新加载您当前的安全评分和备份建议',
      checkingText: '正在检查...',
      refreshButton: '刷新状态',
      createHeading: '创建备份',
      createDescription: '下载受密码保护的加密备份文件',
      creatingText: '正在创建...',
      createButton: '创建备份',
      restoreHeadingCard: '从备份恢复',
      restoreDescriptionCard: '从加密备份文件恢复您的钱包',
      restoreButtonCard: '恢复备份',
      aboutBackupHeading: '关于客户端备份',
      aboutBackupPara1:
        '您钱包的核心密钥（助记词）完全在您的设备上生成并加密。备份过程会使用您的密码从浏览器的本地存储中检索这些加密数据，然后将其打包成一个安全文件供您下载。',
      aboutBackupPara2:
        '您钱包的加密密钥是通过 WebAuthn 签名派生的，这需要您进行生物识别验证（指纹、面部扫描）或设备PIN验证。这意味着即使有人获取了存储在浏览器中的加密数据，如果没有您的实体设备和身份验证，也无法解密。',
      aboutBackupPara3:
        '您的备份文件使用 AES-256-GCM 加密，密钥由您提供的密码派生而来。请妥善保管此文件并记住您的密码。',
      aboutBackupWarning:
        '如果您同时失去对设备、通行密钥以及备份文件/密码的访问权限，您的钱包将无法恢复。',

      socialRecoveryHeading: '社交恢复',
      socialRecoveryDescription: '使用 Shamir 秘密共享方案，将您的钱包恢复权限分配给受信任的监护人',
      setupHeading: '设置社交恢复',
      setupDescription: (threshold, count) =>
        `添加受信任的监护人，帮助您恢复钱包。您需要 ${count || '?'} 位监护人中的 ${threshold} 位才能完成恢复。`,
      guardianNameLabel: '监护人姓名 *',
      guardianEmailLabel: '监护人邮箱（可选）',
      addGuardianButton: '添加监护人',
      guardiansListHeading: n => `监护人（${n}）`,
      removeGuardianAria: '移除监护人',
      thresholdLabel: (threshold, count) => `恢复阈值：${count} 位中的 ${threshold} 位`,
      thresholdDescription: '恢复钱包所需的监护人数量',
      setupSocialRecoveryButton: (threshold, count) =>
        `设置社交恢复（${count || '?'} 中取 ${threshold}）`,
      howItWorksRecoveryInfo: (count, threshold) =>
        `工作原理：您的钱包恢复权限将通过 Shamir 秘密共享方案拆分为 ${count || '?'} 份加密份额。您需要 ${threshold} 位监护人合并各自的份额才能恢复您的钱包。任何单个监护人都无法单独访问您的钱包。`,
      recoverWalletHeading: '恢复钱包',
      hideButton: '隐藏',
      showButton: '显示',
      recoverDescription: '失去了钱包访问权限？收集监护人份额以恢复它。',
      shareCodeLabel: '监护人份额代码',
      sharePlaceholder: '在此粘贴监护人份额 JSON（例如：{"guardianId":"...","share":"..."}）',
      addShareButton: '添加份额',
      uploadFileButton: '上传文件',
      clearAllButton: '清除全部',
      collectedSharesHeading: n => `已收集份额（${n}）`,
      guardianFallback: '监护人',
      shareIndexLabel: n => `（#${n}）`,
      addedAtLabel: time => `添加于 ${time}`,
      removeShareAria: '移除份额',
      invalidShareLabel: n => `无效份额 #${n}`,
      progressHeading: '恢复进度',
      progressText: n => `已收集 ${n} 份。您至少需要 2 份份额才能尝试恢复。`,
      recoveringText: '正在恢复...',
      recoverButton: n => `恢复钱包（${n} 份）`,
      importantWarning: '重要提示：请确保份额来自正确的监护人。无效的份额将导致恢复失败。',
      activeHeading: '社交恢复已启用',
      activeDescription: (threshold, count) =>
        `您的钱包受到 ${count} 中取 ${threshold} 监护人恢复机制的保护`,
      generateInviteButton: '生成邀请',
      removeConfigQuestion:
        '所有监护人都已获得各自的份额？您现在可以从本地存储中移除监护人配置。份额已安全保存在您的监护人处，可随时用于恢复。',
      removeConfigButton: '从本地存储清除监护人配置',
      invitationHeading: '监护人邀请',
      downloadInviteButton: '下载邀请',
      sendInviteText: name => `通过安全渠道将此邀请发送给 ${name}`,

      deviceSyncHeading: '设备同步',
      deviceSyncDescription: '您的通行密钥会通过平台服务自动在各设备间同步',
      qrHeading: '同步二维码',
      qrDescription: '生成一个包含您钱包地址的二维码，以便在其他设备上轻松同步或验证您的账户信息。',
      generateQrButton: '生成同步二维码',
      qrNote:
        '注意：此二维码仅包含您的公开钱包地址，不包含您的私钥或恢复助记词。可用于在其他设备上验证您的账户。',
      hideQrButton: '隐藏二维码',
      verifyHeading: '验证二维码数据',
      verifyDescription: '粘贴扫描二维码得到的 JSON 字符串以验证钱包地址。',
      verifyPlaceholder: '在此粘贴 JSON 数据（例如：{"username":"...","ethereumAddress":"..."}）',
      errorLabel: '错误：',
      parsedDataLabel: '解析数据：',
      usernameFieldLabel: '用户名：',
      ethAddressLabel: '以太坊地址：',
      index0FieldLabel: '索引 #0：',
      mainTaggedLabel: 'MAIN 标记：',
      openbarTaggedLabel: 'OPENBAR 标记：',
      generatedLabel: '生成时间：',
      linkWalletButton: '将此钱包关联到您的通行密钥账户',
      linkExplanation:
        '关联后会发生什么：这将把钱包地址同时保存到 localStorage 和 IndexedDB 中，在您的通行密钥账户与此 HD 钱包之间建立持久关联。您可以借此在各设备间验证或同步钱包数据。',
      howQrWorksHeading: '二维码钱包同步的工作原理',
      qrStep1:
        '第一步：生成二维码 - 在您的主设备上，生成一个包含钱包公开地址的二维码。由于该二维码仅包含公开信息，可以安全分享。',
      qrStep2:
        '第二步：扫描与验证 - 在您的辅助设备上，使用任意二维码扫描应用扫描该二维码，或手动复制二维码中显示的 JSON 数据。',
      qrStep3:
        '第三步：关联钱包 - 将 JSON 数据粘贴到上方的验证区域，然后点击"关联此钱包"。这将在您的通行密钥账户与 HD 钱包地址之间建立持久连接。',
      whatGetsStored:
        '存储内容：localStorage 和 IndexedDB 中仅存储公开的钱包地址。您的私钥和恢复助记词始终保持安全，绝不会通过此同步机制被传输或存储。',
      platformSyncHeading: '通行密钥平台同步',
      platformSyncIntro: '您的通行密钥凭证会在同一生态系统内的各设备间自动同步：',
      appleSyncNote: 'Apple：通过 iCloud Keychain 同步（iPhone、iPad、Mac）',
      googleSyncNote: 'Google：通过 Password Manager 同步（Android、Chrome）',
      windowsSyncNote: 'Windows Hello：仅限本设备，新设备请使用加密备份',
      hardwareSyncNote: '硬件密钥：不支持同步，请单独保留加密备份',
      crossPlatformNote:
        '跨平台限制：通行密钥无法在不同生态系统之间同步（例如从 iPhone 到 Android）。但加密备份完全支持跨平台——无论原始平台为何，您都可以在任何设备上使用备份文件和密码恢复钱包。',
      bestPracticesHeading: '最佳实践',
      practiceBackupFirst: '同步到新设备前，请务必先创建加密备份',
      practiceVerifyAddresses: '同步后请验证钱包地址是否一致',
      practiceUseDebugTools: '使用"调试与检查存储"工具验证同步数据是否已正确保存',
      practiceNeverShareQr: '切勿在公开场合或不可信渠道分享您的二维码',
      practiceTreatAsSensitive: '二维码虽仅包含公开地址，但仍应将其视为敏感账户信息处理',

      createBackupModalTitle: '输入密码以创建备份',
      createBackupModalDescription:
        '请输入您的密码以创建备份。w3pk SDK 需要此密码才能访问您的加密钱包数据。',
      restoreBackupModalTitle: '输入密码以恢复备份',
      restoreBackupModalDescription: '请输入您创建此备份文件时使用的密码。',
      chooseUsernameModalTitle: '为恢复的钱包选择用户名',
      chooseUsernameModalDescription:
        '在此设备上未找到现有凭证。请选择一个用户名，以便使用新的通行密钥注册您恢复的钱包。',
      usernameFormatError:
        '用户名必须为3-50个字符，可包含字母、数字、下划线和连字符，且必须以字母或数字开头和结尾。',
      restoringRegisteringText: '正在恢复并注册...',
      restoreRegisterButton: '恢复并注册',
      removeAccountModalTitle: '移除账户',
      removeAccountConfirm: username => `您确定要移除账户 ${username} 吗？`,
      removeAccountWarning:
        '警告：此操作将删除此设备上该账户的所有数据。请在继续之前确保您已有备份。此操作无法撤销。',
      removeAccountLoggedOutNote: '这是您当前登录的账户。移除后您将被登出。',
      removeAccountButton: '移除账户',
      localStorageModalTitle: 'LocalStorage 检查',
      foundItemsText: n => `在 localStorage 中找到 ${n} 项`,
      noDataFound: '未找到数据',
      indexedDBModalTitle: 'IndexedDB 检查',
      foundDatabasesText: n => `找到 ${n} 个数据库`,
      noDatabasesFound: '未找到与 w3pk 相关的数据库',

      registrationSuccessTitle: '注册成功',
      registrationSuccessDescription: '您的新账户已创建。',
      registrationFailedTitle: '注册失败',
      registrationFailedDefaultDescription: '无法完成注册。请重试。',
      localStorageInspectedTitle: 'LocalStorage 检查完成',
      localStorageInspectedDescription: n => `找到 ${n} 项。向下滚动查看结果。`,
      genericErrorTitle: '错误',
      failedInspectLocalStorage: '检查 localStorage 失败',
      indexedDBInspectedTitle: 'IndexedDB 检查完成',
      indexedDBInspectedDescription: (dbCount, recordCount) =>
        `找到 ${dbCount} 个数据库，共 ${recordCount} 条记录。向下滚动查看结果。`,
      failedInspectIndexedDB: '检查 IndexedDB 失败',
      itemClearedTitle: '项目已清除',
      itemClearedDescription: key => `已从 localStorage 中移除 "${key}"`,
      failedClearItem: key => `清除 "${key}" 失败`,
      recordClearedTitle: '记录已清除',
      recordClearedDescription: (db, store) => `已从 ${db}/${store} 中移除记录`,
      failedClearRecord: '清除记录失败',
      errorLoadingAddressesTitle: '加载地址出错',
      failedDeriveAddresses: '派生钱包地址失败',
      errorLoadingBackupStatusTitle: '加载备份状态出错',
      failedCheckSecurityStatus: '检查安全状态失败',
      accountRemovedTitle: '账户已移除',
      accountRemovedDescription: username => `账户 ${username} 已从此设备移除。`,
      loggingOutTitle: '正在登出',
      loggingOutDescription: '您已移除当前账户。正在登出...',
      failedRemoveAccount: '移除账户失败。请重试。',
      errorReadingFileTitle: '读取文件出错',
      failedReadBackupFile: '读取备份文件失败',
      noBackupFileSelectedTitle: '未选择备份文件',
      incompatibleBackupTitle: '备份版本不兼容',
      incompatibleBackupDescription:
        '此备份是使用旧版本的 w3pk 创建的。请使用当前版本创建新的备份。',
      walletRestoredTitle: '钱包已恢复！',
      walletRestoredDescription: address => `已成功恢复并覆盖钱包：${address}`,
      usernameRequiredRestoreDescription: '请输入用户名以注册恢复的钱包。',
      walletRestoredRegisteredTitle: '钱包已恢复并注册！',
      walletRestoredRegisteredDescription: address => `已成功恢复并注册钱包：${address}`,
      securityReportGeneratedTitle: '安全报告已生成',
      securityReportGeneratedDescription: '请在下方查看详细分析',
      inspectionFailedTitle: '检查失败',
      inspectionFailedDescription:
        '宿主应用检查未成功。这可能是由于达到了 Anthropic 请求速率限制。',
      backupStatusRetrievedTitle: '已获取备份状态。',
      errorRetrievingStatusTitle: '获取状态出错。',
      unexpectedErrorDescription: '发生了意外错误。',
      errorCreatingBackupTitle: '创建备份出错。',
      backupCreatedTitle: '备份创建成功！',
      invalidInputTitle: '输入无效',
      guardianNameRequiredDescription: '监护人姓名为必填项',
      notEnoughGuardiansTitle: '监护人数量不足',
      notEnoughGuardiansDescription: '您至少需要 2 位监护人才能设置社交恢复',
      invalidThresholdTitle: '阈值无效',
      invalidThresholdDescription: '阈值不能大于监护人数量',
      socialRecoveryConfiguredTitle: '社交恢复已配置！',
      socialRecoveryConfiguredDescription: (threshold, count) =>
        `已成功设置 ${count} 中取 ${threshold} 的监护人恢复机制`,
      pleasePasteShareDescription: '请粘贴监护人份额代码',
      duplicateShareTitle: '重复份额',
      duplicateShareDescription: '此监护人份额已被添加',
      shareAddedTitle: '份额已添加',
      shareAddedDescription: name => `已添加来自 ${name} 的份额`,
      invalidShareFormatTitle: '份额格式无效',
      invalidShareFormatDescription: '请粘贴有效的监护人份额代码（JSON 格式）',
      notEnoughSharesTitle: '份额不足',
      notEnoughSharesDescription: '您至少需要 2 份监护人份额才能恢复您的钱包',
      passwordRequiredRecoveryDescription: '您需要输入密码才能解密备份文件',
      usernameRequiredRecoveryDescription: '您需要提供用户名才能注册恢复的钱包',
      walletRecoveredTitle: '钱包恢复成功！',
      walletRecoveredDescription: address => `您的钱包已恢复，并已使用新的通行密钥注册：${address}`,
      fileLoadedTitle: '文件已加载',
      fileLoadedDescription: '已从文件加载监护人份额。点击"添加份额"以添加它。',
      failedReadGuardianFile: '读取监护人份额文件失败',
      cannotSaveTitle: '无法保存',
      cannotSaveDescription: '二维码数据无效或用户未通过身份验证',
      walletLinkedTitle: '钱包关联成功！',
      walletLinkedDescription: address => `已将钱包 ${address} 关联到您的通行密钥账户`,
      errorSavingLinkTitle: '保存钱包关联出错',
      failedSaveSyncData: '保存钱包同步数据失败',
      recoveryPasswordPrompt:
        '请输入您在配置社交恢复时设置的密码。\n\n此密码未与监护人共享——是您在设置时自行设定的。',
      recoveryUsernamePrompt: address =>
        `请为您的新通行密钥注册选择一个用户名。\n\n正在恢复钱包：${address}`,
    },
    header: {
      registerTitle: '注册新账户',
      walletInfoText:
        '系统将为您创建一个以太坊钱包，并安全地存储在您的设备上，通过生物识别或PIN码保护，这要归功于',
      usernameLabel: '用户名',
      usernamePlaceholder: '请输入您的用户名',
      usernameError:
        '用户名长度必须为3-50个字符，只能包含字母、数字、下划线和连字符，且必须以字母或数字开头和结尾。',
      createAccount: '创建账户',
      optionsAriaLabel: '选项',
      mainNavAriaLabel: '主导航',
      usernameRequiredTitle: '需要用户名',
      usernameRequiredDescription: '请输入用户名以完成注册。',
      noAccountFoundTitle: '未找到账户',
      noAccountFoundDescription: '未找到通行密钥。请注册以创建新账户。',
      alreadyRegisteredLink: '我已在其他设备上注册过',
    },
    passwordModal: {
      passwordLabel: '密码',
      passwordPlaceholder: '请输入您的密码',
      passwordRequiredTitle: '需要密码。',
      passwordRequiredDescription: '请输入您的密码。',
      weakPasswordTitle: '密码强度不足。',
      weakPasswordDescription: '请使用满足所有要求的更强密码。',
      submissionErrorTitle: '提交错误。',
      submissionErrorDefaultDescription: '发生意外错误。',
      requirementsNotMet: '密码不满足所有要求',
      strongPassword: '密码强度足够！',
      mustInclude: '密码必须包含：',
      reqMinLength: '至少12个字符',
      reqUpperCase: '一个大写字母',
      reqLowerCase: '一个小写字母',
      reqNumber: '一个数字',
      reqSpecialChar: '一个特殊字符',
      satisfied: '（已满足）',
      required: '（必需）',
      submit: '提交',
    },
    about: {
      headingPrefix: '关于',
      introPart1:
        'w3pk 是一个无密码 Web3 身份验证 SDK，具备加密钱包和隐私保护功能。您可以在任何基于 JS/TS 的网页应用（Next.js、Vue、Angular、Svelte 等）中使用它。',
      introPart2: '是一个 Next.js 应用模板，欢迎 fork 它并构建您想要的任何东西！',
      emailBoxText:
        'w3pk 仍在开发中。订阅后可在我们发布新功能时收到邮件通知（EIP-1193 支持、AI 能力、Viem 辅助工具、链抽象等）',
      emailPlaceholder: 'your@email.com',
      subscribeButton: '订阅',
      githubLabel: 'GitHub',
      npmLabel: 'NPM',
      githubAriaLabel: '在 GitHub 上查看 w3pk（在新标签页中打开）',
      npmAriaLabel: '在 NPM 上查看 w3pk（在新标签页中打开）',
      codeRegisterComment: '// 注册',
      codeLoginComment: '// 登录',
      codeLogoutComment: '// 登出',
      featuresHeading: '功能特性',
      feature1: '无密码身份验证（WebAuthn/FIDO2）',
      feature2: '基于来源的密钥隔离，配合基于标签的访问控制',
      feature3: '会话管理（内存态 + 可选持久化）',
      feature4: 'HD 钱包生成（BIP39/BIP44）',
      feature5: '多地址派生，支持多种安全模式（STANDARD/STRICT/YOLO）',
      feature6: '多种签名方法（EIP-191、SIWE/EIP-4361、EIP-712、rawHash）',
      feature7: '链上交易发送，自动解析 RPC（`sendTransaction`）',
      feature8: '面向 ethers、viem、wagmi、RainbowKit 的 EIP-1193 提供者（`getEIP1193Provider`）',
      feature9: 'ERC-5564 隐形地址（可选启用）',
      feature10: 'ZK 基础组件（零知识证明的生成与验证）',
      feature11: 'Chainlist 支持（2390+ 个网络）',
      feature12: 'EIP-7702 网络检测（329+ 个网络）',
      feature13: '外部钱包集成（通过 EIP-7702 将 MetaMask/Ledger 委托给 w3pk）',
      feature14: 'EIP-7951 PRIMARY 模式（P-256 通行密钥签名）',
      feature15: '构建验证（IPFS CID 哈希 + DAO 维护的链上注册表）',
      feature16: '三层备份与恢复机制（通行密钥同步、加密备份、社交恢复）',
      feature17: 'AI 驱动的宿主应用检查',
      invalidEmailTitle: '邮箱无效',
      invalidEmailDescription: '请输入有效的电子邮箱地址',
      subscribeSuccessTitle: '成功！',
      subscribeSuccessDescription: '您已成功订阅 w3pk 更新',
      subscribeErrorTitle: '错误',
      subscribeErrorDescription: '订阅失败。请重试。',
    },
  },

  // Hindi
  hi: {
    common: {
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      pleaseLogin: 'कृपया लॉगिन करें',
      cancel: 'रद्द करें',
      srLoadingText: 'लोड हो रहा है, कृपया प्रतीक्षा करें...',
      loading: 'लोड हो रहा है...',
      notAvailable: 'उपलब्ध नहीं',
      close: 'बंद करें',
    },
    home: {
      title: 'स्वागत है!',
      subtitle: 'आपका यहाँ स्वागत है!',
      greeting: 'नमस्ते मित्र!',
      greetingSubtitle: 'आराम से बैठें और कुछ शानदार बनाएं!',
      signMessage: 'संदेश पर हस्ताक्षर करें',
      messageSignedTitle: 'संदेश पर हस्ताक्षर हो गया',
      messageSignedDescription: signature => `हस्ताक्षर: ${signature.substring(0, 20)}...`,
    },
    navigation: {
      about: 'के बारे में',
      settings: 'सेटिंग्स',
    },
    settings: {
      title: 'सेटिंग्स',
      loginRequired: 'अपनी सेटिंग्स एक्सेस करने के लिए कृपया लॉगिन करें',
      subtitle: 'अपने खातों, बैकअप और रिकवरी विकल्पों को प्रबंधित करें',
      tabAccounts: 'खाते',
      tabBackup: 'बैकअप',
      tabSync: 'सिंक',
      tabRecovery: 'सामाजिक रिकवरी',

      browserInfoHeading: 'ब्राउज़र जानकारी',
      browserLabel: 'ब्राउज़र:',
      versionLabel: 'संस्करण:',
      osLabel: 'ऑपरेटिंग सिस्टम:',
      webauthnSupportLabel: 'WebAuthn समर्थन:',
      compatibilityLabel: 'संगतता:',
      available: 'उपलब्ध',
      notAvailable: 'उपलब्ध नहीं',
      fullySupported: 'पूर्ण रूप से समर्थित',
      knownIssues: 'ज्ञात समस्याएं',
      notSupported: 'समर्थित नहीं',
      browserNotSupportedTitle: 'ब्राउज़र समर्थित नहीं है',
      knownIssuesTitle: 'ज्ञात समस्याएं मिलीं',
      recommendationTitle: 'सिफारिश',
      webauthnNotAvailableTitle: 'WebAuthn उपलब्ध नहीं है',
      webauthnNotAvailableText:
        'आपका ब्राउज़र WebAuthn का समर्थन नहीं करता, जो w3pk प्रमाणीकरण के लिए आवश्यक है। कृपया अपना ब्राउज़र अपडेट करें या किसी समर्थित ब्राउज़र का उपयोग करें:',
      browserChrome: 'Chrome 67+ (मई 2018)',
      browserFirefox: 'Firefox 60+ (मई 2018)',
      browserSafari: 'Safari 14+ (सितंबर 2020)',
      browserEdge: 'Edge 18+ (नवंबर 2018)',
      browserSamsung: 'Samsung Internet 11+ (फरवरी 2020)',
      androidRecommendedHeading: 'Android के लिए अनुशंसित ब्राउज़र',
      samsungInternetNote:
        'Samsung Internet (Samsung डिवाइस के लिए सर्वश्रेष्ठ) - ✅ काम करना पुष्ट',
      chromeNote: 'Chrome - ✅ भरोसेमंद',
      edgeNote: 'Edge - ✅ भरोसेमंद',
      firefoxMobileNote: 'Firefox Mobile - ⚠️ से बचें (पासकी स्थायित्व की ज्ञात समस्याएं)',

      restoreBackupHeading: 'बैकअप से पुनर्स्थापित करें',
      restoreBackupDescription:
        'यदि आपके पास बैकअप फ़ाइल है, तो आप पहले लॉगिन किए बिना अपना वॉलेट पुनर्स्थापित कर सकते हैं।',
      restoreBackupSyncHint:
        'किसी अन्य डिवाइस के साथ सिंक करने के लिए: अपने दूसरे डिवाइस पर लॉगिन करें, एन्क्रिप्टेड बैकअप फ़ाइल डाउनलोड करने के लिए सेटिंग्स → बैकअप बनाएं पर जाएं, फिर इसे यहां अपलोड करें और वही पासवर्ड दर्ज करें।',
      restoringText: 'पुनर्स्थापित हो रहा है...',
      restoreBackupButton: 'बैकअप फ़ाइल से पुनर्स्थापित करें',

      debugStorageHeading: 'स्टोरेज को डिबग और निरीक्षण करें',
      debugStorageDescription: 'ब्राउज़र स्टोरेज और गतिविधि लॉग का निरीक्षण करें',
      inspectingText: 'निरीक्षण हो रहा है...',
      inspectLocalStorageButton: 'LocalStorage का निरीक्षण करें',
      inspectIndexedDBButton: 'IndexedDB का निरीक्षण करें',

      inspectSecurityDescriptionSmall:
        'लेनदेन और हस्ताक्षर विधियों के लिए इस एप्लिकेशन का विश्लेषण करें।',
      inspectSecurityButton: 'सुरक्षा का निरीक्षण करें',
      consoleCommandLabel: 'कंसोल कमांड:',
      clearReportButton: 'रिपोर्ट साफ़ करें',
      filesAnalyzedLabel: 'विश्लेषित फ़ाइलें:',
      inspectionHeadingBig: 'सुरक्षा निरीक्षण',
      inspectSecurityDescriptionBig:
        'इस ऐप की एक व्यापक सुरक्षा रिपोर्ट बनाएं। रिपोर्ट सभी लेनदेन और हस्ताक्षर विधियों का विश्लेषण करेगी।',
      inspectNowButton: 'अभी निरीक्षण करें',
      consoleHintText: 'आप ब्राउज़र कंसोल में await w3pk.inspectNow() भी चला सकते हैं',
      securityReportHeading: 'सुरक्षा रिपोर्ट',
      appUrlLabel: 'ऐप URL:',

      localStorageResultsHeading: 'LocalStorage परिणाम',
      itemsCount: n => `${n} आइटम`,
      encryptedBadge: 'एन्क्रिप्टेड',
      clearItemAria: 'आइटम साफ़ करें',
      indexedDBResultsHeading: 'IndexedDB परिणाम',
      databasesCount: n => `${n} डेटाबेस`,
      storesLabel: 'स्टोर्स:',
      recordsLabel: 'रिकॉर्ड्स:',
      clearRecordAria: 'रिकॉर्ड साफ़ करें',
      storeKeyLabel: (store, key) => `स्टोर: ${store} | की: ${key}`,

      currentAccountHeading: 'वर्तमान खाता',
      currentAccountDescription: 'यह आपका वर्तमान में लॉग इन किया गया खाता है।',
      noAccounts: 'इस डिवाइस पर कोई खाता नहीं मिला।',
      currentBadge: 'वर्तमान',
      usernameLabel: username => `उपयोगकर्ता नाम: ${username}`,
      deleteAccountAria: 'खाता हटाएं',

      sessionHeading: 'मेरा सत्र सक्रिय रखें',
      sessionDescription:
        'तय करें कि पासकी प्रॉम्प्ट के बिना आपका सत्र कितनी देर तक सक्रिय रहना चाहिए। जब यह समाप्त हो जाता है, तो आपकी अगली विज़िट एक बार आपके बायोमेट्रिक/पिन के लिए पूछती है और एक नया सत्र शुरू करती है — इसलिए यह भी बताता है कि आप कितनी बार पुनः प्रमाणीकरण करते हैं। यह सेटिंग केवल STANDARD और YOLO मोड पर लागू होती है। STRICT और PRIMARY मोड हमेशा नए प्रमाणीकरण की आवश्यकता रखते हैं और स्थायी सत्रों का उपयोग नहीं करते।',
      noStoredSessionText:
        'इस डिवाइस पर कोई संग्रहीत सत्र नहीं है। ऐसा लगता है कि आपका ऑथेंटिकेटर WebAuthn PRF एक्सटेंशन का समर्थन नहीं करता, जिसकी w3pk को सत्रों को सुरक्षित रूप से सक्रिय रखने के लिए आवश्यकता होती है। आपका सत्र केवल मेमोरी में रहेगा: जब आप टैब बंद करते हैं तो यह समाप्त हो जाता है, और हर विज़िट पर आपसे आपका बायोमेट्रिक/पिन पूछा जाएगा। बाकी सब कुछ सामान्य रूप से काम करता है।',
      sessionDurationLabel: 'सत्र अवधि',
      dayLabel: n => `${n} दिन`,
      oneDayLabel: '1 दिन',
      thirtyDaysLabel: '30 दिन',
      sessionHowItWorksTitle: 'यह कैसे काम करता है:',
      sessionHowItWorksText:
        'हर बार जब आप अपने बायोमेट्रिक/पिन से लॉगिन करते हैं, तो आपका ऑथेंटिकेटर एक हार्डवेयर-समर्थित सीक्रेट (WebAuthn PRF एक्सटेंशन) जारी करता है जो इस डिवाइस पर आपके सत्र को एन्क्रिप्ट करता है — डिस्क पर संग्रहीत कुछ भी उस कुंजी को फिर से नहीं बना सकता। हर वास्तविक लॉगिन पर काउंटडाउन नए सिरे से शुरू होता है: 7 दिन की अवधि के साथ, आज लॉगिन करने पर आप आज से 7 दिन बाद तक साइन इन रहेंगे, जब आपसे एक बार पूछा जाएगा और सत्र को एक नई कुंजी के तहत फिर से एन्क्रिप्ट किया जाएगा।',

      walletBackupHeading: 'वॉलेट बैकअप',
      walletBackupDescription:
        'यह सुनिश्चित करने के लिए कि आप कभी भी एक्सेस न खोएं, अपने वॉलेट के एन्क्रिप्टेड बैकअप बनाएं',
      currentAccountBackupHeading: 'वर्तमान खाता',
      loggedInAsLabel: 'इस रूप में लॉग इन:',
      loadingAddressesText: 'पते लोड हो रहे हैं...',
      index0Label: 'इंडेक्स #0 पता:',
      mainAddressLabel: 'मूल-विशिष्ट, STANDARD मोड, MAIN-टैग वाला पता (डिफ़ॉल्ट वॉलेट):',
      loadingText: 'लोड हो रहा है...',
      securityStatusHeading: 'सुरक्षा स्थिति',
      checkingStatusText: 'बैकअप स्थिति की जांच हो रही है...',
      refreshHeading: 'बैकअप स्थिति रीफ़्रेश करें',
      refreshDescription: 'अपने वर्तमान सुरक्षा स्कोर और बैकअप सिफारिशों को फिर से लोड करें',
      checkingText: 'जांच हो रही है...',
      refreshButton: 'स्थिति रीफ़्रेश करें',
      createHeading: 'बैकअप बनाएं',
      createDescription: 'अपने पासवर्ड द्वारा सुरक्षित एक एन्क्रिप्टेड बैकअप फ़ाइल डाउनलोड करें',
      creatingText: 'बनाया जा रहा है...',
      createButton: 'बैकअप बनाएं',
      restoreHeadingCard: 'बैकअप से पुनर्स्थापित करें',
      restoreDescriptionCard: 'एक एन्क्रिप्टेड बैकअप फ़ाइल से अपना वॉलेट पुनर्स्थापित करें',
      restoreButtonCard: 'बैकअप पुनर्स्थापित करें',
      aboutBackupHeading: 'क्लाइंट-साइड बैकअप के बारे में',
      aboutBackupPara1:
        'आपके वॉलेट का मूल सीक्रेट (म्नेमोनिक फ्रेज़) पूरी तरह से आपके डिवाइस पर जनरेट और एन्क्रिप्ट किया जाता है। बैकअप प्रक्रिया आपके पासवर्ड का उपयोग करके आपके ब्राउज़र के लोकल स्टोरेज से इस एन्क्रिप्टेड डेटा को प्राप्त करती है, फिर इसे डाउनलोड करने के लिए एक सुरक्षित फ़ाइल में पैकेज करती है।',
      aboutBackupPara2:
        'आपके वॉलेट के लिए एन्क्रिप्शन कुंजी एक WebAuthn हस्ताक्षर का उपयोग करके प्राप्त की जाती है, जिसके लिए आपके बायोमेट्रिक प्रमाणीकरण (फिंगरप्रिंट, फेस स्कैन) या डिवाइस पिन की आवश्यकता होती है। इसका मतलब है कि भले ही कोई आपके ब्राउज़र में संग्रहीत एन्क्रिप्टेड डेटा तक पहुंच प्राप्त कर ले, वे आपके भौतिक डिवाइस और प्रमाणीकरण के बिना इसे डिक्रिप्ट नहीं कर सकते।',
      aboutBackupPara3:
        'आपकी बैकअप फ़ाइल आपके द्वारा दिए गए पासवर्ड से प्राप्त एक कुंजी के साथ AES-256-GCM का उपयोग करके एन्क्रिप्ट की जाती है। इस फ़ाइल को सुरक्षित रूप से संग्रहीत करें और अपना पासवर्ड याद रखें।',
      aboutBackupWarning:
        'यदि आप अपने डिवाइस, पासकी, और बैकअप फ़ाइल/पासवर्ड तक पहुंच खो देते हैं, तो आपका वॉलेट पुनर्प्राप्त नहीं किया जा सकता।',

      socialRecoveryHeading: 'सामाजिक रिकवरी',
      socialRecoveryDescription:
        'Shamir Secret Sharing का उपयोग करके अपने वॉलेट की रिकवरी को विश्वसनीय अभिभावकों के बीच वितरित करें',
      setupHeading: 'सामाजिक रिकवरी सेट अप करें',
      setupDescription: (threshold, count) =>
        `विश्वसनीय अभिभावक जोड़ें जो आपके वॉलेट को पुनर्प्राप्त करने में मदद करेंगे। पुनर्प्राप्त करने के लिए आपको ${count || '?'} में से ${threshold} अभिभावकों की आवश्यकता होगी।`,
      guardianNameLabel: 'अभिभावक का नाम *',
      guardianEmailLabel: 'अभिभावक ईमेल (वैकल्पिक)',
      addGuardianButton: 'अभिभावक जोड़ें',
      guardiansListHeading: n => `अभिभावक (${n})`,
      removeGuardianAria: 'अभिभावक हटाएं',
      thresholdLabel: (threshold, count) => `रिकवरी थ्रेशोल्ड: ${count} में से ${threshold}`,
      thresholdDescription: 'आपके वॉलेट को पुनर्प्राप्त करने के लिए आवश्यक अभिभावकों की संख्या',
      setupSocialRecoveryButton: (threshold, count) =>
        `सामाजिक रिकवरी सेट अप करें (${count || '?'} में से ${threshold})`,
      howItWorksRecoveryInfo: (count, threshold) =>
        `यह कैसे काम करता है: Shamir Secret Sharing का उपयोग करके आपके वॉलेट की रिकवरी को ${count || '?'} एन्क्रिप्टेड शेयरों में विभाजित किया जाएगा। आपके वॉलेट को पुनर्प्राप्त करने के लिए आपको ${threshold} अभिभावकों को अपने शेयर संयोजित करने होंगे। कोई भी अकेला अभिभावक आपके वॉलेट तक पहुंच नहीं सकता।`,
      recoverWalletHeading: 'वॉलेट पुनर्प्राप्त करें',
      hideButton: 'छिपाएं',
      showButton: 'दिखाएं',
      recoverDescription:
        'अपने वॉलेट तक पहुंच खो दी? इसे पुनर्प्राप्त करने के लिए अभिभावक शेयर एकत्र करें।',
      shareCodeLabel: 'अभिभावक शेयर कोड',
      sharePlaceholder:
        'यहां अभिभावक शेयर JSON पेस्ट करें (उदाहरण के लिए, {"guardianId":"...","share":"..."})',
      addShareButton: 'शेयर जोड़ें',
      uploadFileButton: 'फ़ाइल अपलोड करें',
      clearAllButton: 'सभी साफ़ करें',
      collectedSharesHeading: n => `एकत्रित शेयर (${n})`,
      guardianFallback: 'अभिभावक',
      shareIndexLabel: n => `(#${n})`,
      addedAtLabel: time => `${time} को जोड़ा गया`,
      removeShareAria: 'शेयर हटाएं',
      invalidShareLabel: n => `अमान्य शेयर #${n}`,
      progressHeading: 'रिकवरी प्रगति',
      progressText: n =>
        `${n} शेयर एकत्रित हुए। रिकवरी का प्रयास करने के लिए आपको कम से कम 2 शेयर चाहिए।`,
      recoveringText: 'पुनर्प्राप्त हो रहा है...',
      recoverButton: n => `वॉलेट पुनर्प्राप्त करें (${n} शेयर)`,
      importantWarning:
        'महत्वपूर्ण: सुनिश्चित करें कि शेयर सही अभिभावकों से हैं। अमान्य शेयर रिकवरी को विफल कर देंगे।',
      activeHeading: 'सामाजिक रिकवरी सक्रिय है',
      activeDescription: (threshold, count) =>
        `आपका वॉलेट ${count} में से ${threshold} अभिभावक रिकवरी से सुरक्षित है`,
      generateInviteButton: 'आमंत्रण जनरेट करें',
      removeConfigQuestion:
        'क्या सभी अभिभावकों के पास अपने शेयर हैं? अब आप लोकल स्टोरेज से अभिभावक कॉन्फ़िगरेशन हटा सकते हैं। शेयर आपके अभिभावकों के पास सुरक्षित रूप से संग्रहीत हैं और कभी भी रिकवरी के लिए उपयोग किए जा सकते हैं।',
      removeConfigButton: 'लोकल स्टोरेज से अभिभावक कॉन्फ़िगरेशन साफ़ करें',
      invitationHeading: 'अभिभावक आमंत्रण',
      downloadInviteButton: 'आमंत्रण डाउनलोड करें',
      sendInviteText: name => `यह आमंत्रण ${name} को एक सुरक्षित चैनल के माध्यम से भेजें`,

      deviceSyncHeading: 'डिवाइस सिंक',
      deviceSyncDescription:
        'आपकी पासकी प्लेटफ़ॉर्म सेवाओं का उपयोग करके डिवाइसों में स्वचालित रूप से सिंक होती है',
      qrHeading: 'सिंक QR कोड',
      qrDescription:
        'किसी अन्य डिवाइस पर अपनी खाता जानकारी को आसानी से सिंक या सत्यापित करने के लिए अपने वॉलेट पतों वाला एक QR कोड जनरेट करें।',
      generateQrButton: 'सिंक QR कोड जनरेट करें',
      qrNote:
        'नोट: इस QR कोड में केवल आपके सार्वजनिक वॉलेट पते शामिल हैं। इसमें आपकी निजी कुंजियां या रिकवरी फ्रेज़ शामिल नहीं है। किसी अन्य डिवाइस पर अपने खाते को सत्यापित करने के लिए इसका उपयोग करें।',
      hideQrButton: 'QR कोड छिपाएं',
      verifyHeading: 'QR कोड डेटा सत्यापित करें',
      verifyDescription:
        'वॉलेट पतों को सत्यापित करने के लिए स्कैन किए गए QR कोड से JSON स्ट्रिंग पेस्ट करें।',
      verifyPlaceholder:
        'यहां JSON डेटा पेस्ट करें (उदाहरण के लिए, {"username":"...","ethereumAddress":"..."})',
      errorLabel: 'त्रुटि:',
      parsedDataLabel: 'पार्स किया गया डेटा:',
      usernameFieldLabel: 'उपयोगकर्ता नाम:',
      ethAddressLabel: 'एथेरियम पता:',
      index0FieldLabel: 'इंडेक्स #0:',
      mainTaggedLabel: 'MAIN-टैग:',
      openbarTaggedLabel: 'OPENBAR-टैग:',
      generatedLabel: 'जनरेट किया गया:',
      linkWalletButton: 'इस वॉलेट को अपने पासकी खाते से लिंक करें',
      linkExplanation:
        'लिंक करने पर क्या होता है: यह वॉलेट पतों को localStorage और IndexedDB दोनों में सहेजेगा, जिससे आपके पासकी खाते और इस HD वॉलेट के बीच एक स्थायी लिंक बनेगा। आप इसका उपयोग डिवाइसों में वॉलेट डेटा को सत्यापित या सिंक करने के लिए कर सकते हैं।',
      howQrWorksHeading: 'QR कोड वॉलेट सिंक कैसे काम करता है',
      qrStep1:
        'चरण 1: QR कोड जनरेट करें - अपने प्राथमिक डिवाइस पर, अपने वॉलेट के सार्वजनिक पतों वाला एक QR कोड जनरेट करें। यह QR कोड साझा करने के लिए सुरक्षित है क्योंकि इसमें केवल सार्वजनिक जानकारी है।',
      qrStep2:
        'चरण 2: स्कैन करें और सत्यापित करें - अपने द्वितीयक डिवाइस पर, किसी भी QR स्कैनर ऐप का उपयोग करके QR कोड स्कैन करें, या QR कोड में प्रदर्शित JSON डेटा को मैन्युअल रूप से कॉपी करें।',
      qrStep3:
        'चरण 3: वॉलेट लिंक करें - ऊपर दिए गए सत्यापन क्षेत्र में JSON डेटा पेस्ट करें और "इस वॉलेट को लिंक करें" पर क्लिक करें। इससे आपके पासकी खाते और HD वॉलेट पतों के बीच एक स्थायी कनेक्शन बनता है।',
      whatGetsStored:
        'क्या संग्रहीत किया जाता है: localStorage और IndexedDB में केवल सार्वजनिक वॉलेट पते संग्रहीत किए जाते हैं। आपकी निजी कुंजियां और रिकवरी फ्रेज़ सुरक्षित रहते हैं और इस सिंक तंत्र के माध्यम से कभी भी प्रसारित या संग्रहीत नहीं किए जाते।',
      platformSyncHeading: 'पासकी प्लेटफ़ॉर्म सिंक',
      platformSyncIntro:
        'आपकी पासकी क्रेडेंशियल्स एक ही इकोसिस्टम के भीतर डिवाइसों में स्वचालित रूप से सिंक होती हैं:',
      appleSyncNote: 'Apple: iCloud Keychain के माध्यम से सिंक होता है (iPhone, iPad, Mac)',
      googleSyncNote: 'Google: Password Manager के माध्यम से सिंक होता है (Android, Chrome)',
      windowsSyncNote:
        'Windows Hello: डिवाइस-विशिष्ट, नए डिवाइसों के लिए एन्क्रिप्टेड बैकअप का उपयोग करें',
      hardwareSyncNote: 'Hardware Keys: कोई सिंक नहीं, एन्क्रिप्टेड बैकअप अलग से रखें',
      crossPlatformNote:
        'क्रॉस-प्लेटफ़ॉर्म सीमा: पासकी अलग-अलग इकोसिस्टम में सिंक नहीं होती (उदाहरण के लिए, iPhone से Android)। हालांकि, एन्क्रिप्टेड बैकअप पूरी तरह से क्रॉस-प्लेटफ़ॉर्म हैं - आप मूल प्लेटफ़ॉर्म चाहे जो भी हो, बैकअप फ़ाइल और पासवर्ड के साथ किसी भी डिवाइस पर अपना वॉलेट पुनर्स्थापित कर सकते हैं।',
      bestPracticesHeading: 'सर्वोत्तम प्रथाएं',
      practiceBackupFirst: 'नए डिवाइस पर सिंक करने से पहले हमेशा एक एन्क्रिप्टेड बैकअप बनाएं',
      practiceVerifyAddresses: 'सिंक करने के बाद वॉलेट पतों का मिलान सत्यापित करें',
      practiceUseDebugTools:
        'यह सत्यापित करने के लिए कि सिंक डेटा सही ढंग से सहेजा गया था, डिबग और निरीक्षण स्टोरेज टूल्स का उपयोग करें',
      practiceNeverShareQr:
        'अपने QR कोड को कभी भी सार्वजनिक रूप से या अविश्वसनीय चैनलों पर साझा न करें',
      practiceTreatAsSensitive:
        'QR कोड में केवल सार्वजनिक पते होते हैं, लेकिन फिर भी इन्हें संवेदनशील खाता जानकारी के रूप में मानें',

      createBackupModalTitle: 'बैकअप बनाने के लिए पासवर्ड दर्ज करें',
      createBackupModalDescription:
        'बैकअप बनाने के लिए कृपया अपना पासवर्ड दर्ज करें। आपके एन्क्रिप्टेड वॉलेट डेटा तक पहुंचने के लिए w3pk SDK को इसकी आवश्यकता होती है।',
      restoreBackupModalTitle: 'बैकअप पुनर्स्थापित करने के लिए पासवर्ड दर्ज करें',
      restoreBackupModalDescription:
        'कृपया वह पासवर्ड दर्ज करें जिसका उपयोग आपने इस बैकअप फ़ाइल को बनाते समय किया था।',
      chooseUsernameModalTitle: 'पुनर्स्थापित वॉलेट के लिए उपयोगकर्ता नाम चुनें',
      chooseUsernameModalDescription:
        'इस डिवाइस पर कोई मौजूदा क्रेडेंशियल नहीं मिला। कृपया अपने पुनर्स्थापित वॉलेट को नई पासकी के साथ पंजीकृत करने के लिए एक उपयोगकर्ता नाम चुनें।',
      usernameFormatError:
        'उपयोगकर्ता नाम 3-50 अक्षरों का होना चाहिए, अल्फ़ान्यूमेरिक अंडरस्कोर/हाइफ़न के साथ, और अल्फ़ान्यूमेरिक से शुरू/समाप्त होना चाहिए।',
      restoringRegisteringText: 'पुनर्स्थापित और पंजीकृत हो रहा है...',
      restoreRegisterButton: 'पुनर्स्थापित करें और पंजीकृत करें',
      removeAccountModalTitle: 'खाता हटाएं',
      removeAccountConfirm: username => `क्या आप वाकई खाता ${username} हटाना चाहते हैं?`,
      removeAccountWarning:
        'चेतावनी: यह इस डिवाइस से इस खाते के सभी डेटा को हटा देगा। आगे बढ़ने से पहले सुनिश्चित करें कि आपके पास बैकअप है। यह कार्रवाई पूर्ववत नहीं की जा सकती।',
      removeAccountLoggedOutNote:
        'यह आपका वर्तमान में लॉग इन किया गया खाता है। हटाने के बाद आपको लॉग आउट कर दिया जाएगा।',
      removeAccountButton: 'खाता हटाएं',
      localStorageModalTitle: 'LocalStorage निरीक्षण',
      foundItemsText: n => `localStorage में ${n} आइटम मिले`,
      noDataFound: 'कोई डेटा नहीं मिला',
      indexedDBModalTitle: 'IndexedDB निरीक्षण',
      foundDatabasesText: n => `${n} डेटाबेस मिले`,
      noDatabasesFound: 'w3pk-संबंधित कोई डेटाबेस नहीं मिला',

      registrationSuccessTitle: 'पंजीकरण सफल',
      registrationSuccessDescription: 'आपका नया खाता बना दिया गया है।',
      registrationFailedTitle: 'पंजीकरण विफल',
      registrationFailedDefaultDescription: 'पंजीकरण पूरा करने में असमर्थ। कृपया पुनः प्रयास करें।',
      localStorageInspectedTitle: 'LocalStorage निरीक्षित',
      localStorageInspectedDescription: n =>
        `${n} आइटम मिले। परिणाम देखने के लिए नीचे स्क्रॉल करें।`,
      genericErrorTitle: 'त्रुटि',
      failedInspectLocalStorage: 'localStorage का निरीक्षण करने में विफल',
      indexedDBInspectedTitle: 'IndexedDB निरीक्षित',
      indexedDBInspectedDescription: (dbCount, recordCount) =>
        `${recordCount} रिकॉर्ड के साथ ${dbCount} डेटाबेस मिले। परिणाम देखने के लिए नीचे स्क्रॉल करें।`,
      failedInspectIndexedDB: 'IndexedDB का निरीक्षण करने में विफल',
      itemClearedTitle: 'आइटम साफ़ किया गया',
      itemClearedDescription: key => `localStorage से "${key}" हटाया गया`,
      failedClearItem: key => `"${key}" साफ़ करने में विफल`,
      recordClearedTitle: 'रिकॉर्ड साफ़ किया गया',
      recordClearedDescription: (db, store) => `${db}/${store} से रिकॉर्ड हटाया गया`,
      failedClearRecord: 'रिकॉर्ड साफ़ करने में विफल',
      errorLoadingAddressesTitle: 'पते लोड करने में त्रुटि',
      failedDeriveAddresses: 'वॉलेट पते प्राप्त करने में विफल',
      errorLoadingBackupStatusTitle: 'बैकअप स्थिति लोड करने में त्रुटि',
      failedCheckSecurityStatus: 'सुरक्षा स्थिति जांचने में विफल',
      accountRemovedTitle: 'खाता हटाया गया',
      accountRemovedDescription: username => `खाता ${username} इस डिवाइस से हटा दिया गया है।`,
      loggingOutTitle: 'लॉग आउट हो रहा है',
      loggingOutDescription: 'आपने अपना वर्तमान खाता हटा दिया। लॉग आउट हो रहा है...',
      failedRemoveAccount: 'खाता हटाने में विफल। कृपया पुनः प्रयास करें।',
      errorReadingFileTitle: 'फ़ाइल पढ़ने में त्रुटि',
      failedReadBackupFile: 'बैकअप फ़ाइल पढ़ने में विफल',
      noBackupFileSelectedTitle: 'कोई बैकअप फ़ाइल नहीं चुनी गई',
      incompatibleBackupTitle: 'असंगत बैकअप संस्करण',
      incompatibleBackupDescription:
        'यह बैकअप w3pk के पुराने संस्करण के साथ बनाया गया था। कृपया वर्तमान संस्करण के साथ एक नया बैकअप बनाएं।',
      walletRestoredTitle: 'वॉलेट पुनर्स्थापित हुआ!',
      walletRestoredDescription: address =>
        `वॉलेट सफलतापूर्वक पुनर्स्थापित और अधिलेखित किया गया: ${address}`,
      usernameRequiredRestoreDescription:
        'कृपया पुनर्स्थापित वॉलेट के साथ पंजीकरण करने के लिए एक उपयोगकर्ता नाम दर्ज करें।',
      walletRestoredRegisteredTitle: 'वॉलेट पुनर्स्थापित और पंजीकृत हुआ!',
      walletRestoredRegisteredDescription: address =>
        `वॉलेट सफलतापूर्वक पुनर्स्थापित और पंजीकृत किया गया: ${address}`,
      securityReportGeneratedTitle: 'सुरक्षा रिपोर्ट जनरेट हुई',
      securityReportGeneratedDescription: 'नीचे विस्तृत विश्लेषण देखें',
      inspectionFailedTitle: 'निरीक्षण विफल',
      inspectionFailedDescription:
        'होस्ट ऐप निरीक्षण काम नहीं आया। यह संभवतः Anthropic अनुरोध दर सीमा तक पहुंचने के कारण है।',
      backupStatusRetrievedTitle: 'बैकअप स्थिति प्राप्त हुई।',
      errorRetrievingStatusTitle: 'स्थिति प्राप्त करने में त्रुटि।',
      unexpectedErrorDescription: 'एक अप्रत्याशित त्रुटि हुई।',
      errorCreatingBackupTitle: 'बैकअप बनाने में त्रुटि।',
      backupCreatedTitle: 'बैकअप सफलतापूर्वक बनाया गया!',
      invalidInputTitle: 'अमान्य इनपुट',
      guardianNameRequiredDescription: 'अभिभावक का नाम आवश्यक है',
      notEnoughGuardiansTitle: 'पर्याप्त अभिभावक नहीं',
      notEnoughGuardiansDescription:
        'सामाजिक रिकवरी सेट अप करने के लिए आपको कम से कम 2 अभिभावकों की आवश्यकता है',
      invalidThresholdTitle: 'अमान्य थ्रेशोल्ड',
      invalidThresholdDescription: 'थ्रेशोल्ड अभिभावकों की संख्या से अधिक नहीं हो सकता',
      socialRecoveryConfiguredTitle: 'सामाजिक रिकवरी कॉन्फ़िगर हुई!',
      socialRecoveryConfiguredDescription: (threshold, count) =>
        `${count} में से ${threshold} अभिभावक रिकवरी सफलतापूर्वक सेट अप हुई`,
      pleasePasteShareDescription: 'कृपया एक अभिभावक शेयर कोड पेस्ट करें',
      duplicateShareTitle: 'डुप्लिकेट शेयर',
      duplicateShareDescription: 'यह अभिभावक शेयर पहले ही जोड़ा जा चुका है',
      shareAddedTitle: 'शेयर जोड़ा गया',
      shareAddedDescription: name => `${name} से शेयर जोड़ा गया`,
      invalidShareFormatTitle: 'अमान्य शेयर प्रारूप',
      invalidShareFormatDescription: 'कृपया एक मान्य अभिभावक शेयर कोड पेस्ट करें (JSON प्रारूप)',
      notEnoughSharesTitle: 'पर्याप्त शेयर नहीं',
      notEnoughSharesDescription:
        'अपने वॉलेट को पुनर्प्राप्त करने के लिए आपको कम से कम 2 अभिभावक शेयरों की आवश्यकता है',
      passwordRequiredRecoveryDescription:
        'बैकअप फ़ाइल को डिक्रिप्ट करने के लिए आपको अपना पासवर्ड दर्ज करना होगा',
      usernameRequiredRecoveryDescription:
        'अपने पुनर्प्राप्त वॉलेट को पंजीकृत करने के लिए आपको एक उपयोगकर्ता नाम प्रदान करना होगा',
      walletRecoveredTitle: 'वॉलेट सफलतापूर्वक पुनर्प्राप्त हुआ!',
      walletRecoveredDescription: address =>
        `आपका वॉलेट पुनर्प्राप्त कर लिया गया है और नई पासकी के साथ पंजीकृत किया गया है: ${address}`,
      fileLoadedTitle: 'फ़ाइल लोड हुई',
      fileLoadedDescription:
        'फ़ाइल से अभिभावक शेयर लोड हुआ। इसे जोड़ने के लिए "शेयर जोड़ें" पर क्लिक करें।',
      failedReadGuardianFile: 'अभिभावक शेयर फ़ाइल पढ़ने में विफल',
      cannotSaveTitle: 'सहेज नहीं सकते',
      cannotSaveDescription: 'अमान्य QR डेटा या उपयोगकर्ता प्रमाणित नहीं है',
      walletLinkedTitle: 'वॉलेट सफलतापूर्वक लिंक हुआ!',
      walletLinkedDescription: address => `वॉलेट ${address} को आपके पासकी खाते से लिंक किया गया`,
      errorSavingLinkTitle: 'वॉलेट लिंक सहेजने में त्रुटि',
      failedSaveSyncData: 'वॉलेट सिंक डेटा सहेजने में विफल',
      recoveryPasswordPrompt:
        'सामाजिक रिकवरी कॉन्फ़िगर करते समय आपने जो पासवर्ड सेट किया था उसे दर्ज करें।\n\nयह पासवर्ड अभिभावकों के साथ साझा नहीं किया गया था - आपने इसे सेटअप के दौरान सेट किया था।',
      recoveryUsernamePrompt: address =>
        `अपने नए पासकी पंजीकरण के लिए एक उपयोगकर्ता नाम चुनें।\n\nवॉलेट पुनर्प्राप्त हो रहा है: ${address}`,
    },
    header: {
      registerTitle: 'नया खाता पंजीकृत करें',
      walletInfoText:
        'एक एथेरियम वॉलेट बनाया जाएगा और आपके डिवाइस पर सुरक्षित रूप से संग्रहीत किया जाएगा, जो आपके बायोमेट्रिक या पिन द्वारा सुरक्षित होगा, धन्यवाद',
      usernameLabel: 'उपयोगकर्ता नाम',
      usernamePlaceholder: 'अपना उपयोगकर्ता नाम दर्ज करें',
      usernameError:
        'उपयोगकर्ता नाम 3-50 अक्षरों का होना चाहिए और इसमें केवल अक्षर, संख्याएं, अंडरस्कोर और हाइफ़न हो सकते हैं। इसे एक अक्षर या संख्या से शुरू और समाप्त होना चाहिए।',
      createAccount: 'खाता बनाएं',
      optionsAriaLabel: 'विकल्प',
      mainNavAriaLabel: 'मुख्य नेविगेशन',
      usernameRequiredTitle: 'उपयोगकर्ता नाम आवश्यक है',
      usernameRequiredDescription: 'पंजीकरण के लिए कृपया एक उपयोगकर्ता नाम दर्ज करें।',
      noAccountFoundTitle: 'कोई खाता नहीं मिला',
      noAccountFoundDescription: 'कोई पासकी नहीं मिली। नया खाता बनाने के लिए कृपया रजिस्टर करें।',
      alreadyRegisteredLink: 'मैंने पहले ही किसी अन्य डिवाइस पर पंजीकरण कर लिया है',
    },
    passwordModal: {
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      passwordRequiredTitle: 'पासवर्ड आवश्यक है।',
      passwordRequiredDescription: 'कृपया अपना पासवर्ड दर्ज करें।',
      weakPasswordTitle: 'कमज़ोर पासवर्ड।',
      weakPasswordDescription:
        'कृपया एक मजबूत पासवर्ड का उपयोग करें जो सभी आवश्यकताओं को पूरा करता हो।',
      submissionErrorTitle: 'सबमिशन त्रुटि।',
      submissionErrorDefaultDescription: 'एक अप्रत्याशित त्रुटि हुई।',
      requirementsNotMet: 'पासवर्ड सभी आवश्यकताओं को पूरा नहीं करता',
      strongPassword: 'मजबूत पासवर्ड!',
      mustInclude: 'पासवर्ड में शामिल होना चाहिए:',
      reqMinLength: 'कम से कम 12 अक्षर',
      reqUpperCase: 'एक बड़ा अक्षर',
      reqLowerCase: 'एक छोटा अक्षर',
      reqNumber: 'एक संख्या',
      reqSpecialChar: 'एक विशेष वर्ण',
      satisfied: ' (पूर्ण)',
      required: ' (आवश्यक)',
      submit: 'जमा करें',
    },
    about: {
      headingPrefix: 'के बारे में',
      introPart1:
        'w3pk एन्क्रिप्टेड वॉलेट और गोपनीयता सुविधाओं के साथ एक पासवर्ड-रहित Web3 प्रमाणीकरण SDK है। आप इसे किसी भी JS/TS-आधारित वेब ऐप (Next.js, Vue, Angular, Svelte, …) में उपयोग कर सकते हैं।',
      introPart2: 'एक Next.js ऐप टेम्पलेट है, बेझिझक इसे फोर्क करें और जो चाहें बनाएं!',
      emailBoxText:
        'w3pk अभी विकासाधीन है। जब हम नई सुविधाएं जारी करें (EIP-1193 समर्थन, AI क्षमताएं, Viem हेल्पर्स, चेन एब्स्ट्रैक्शन, और अधिक) तो ईमेल प्राप्त करें',
      emailPlaceholder: 'your@email.com',
      subscribeButton: 'सब्सक्राइब करें',
      githubLabel: 'GitHub',
      npmLabel: 'NPM',
      githubAriaLabel: 'GitHub पर w3pk देखें (नए टैब में खुलता है)',
      npmAriaLabel: 'NPM पर w3pk देखें (नए टैब में खुलता है)',
      codeRegisterComment: '// रजिस्टर करें',
      codeLoginComment: '// लॉगिन करें',
      codeLogoutComment: '// लॉगआउट करें',
      featuresHeading: 'विशेषताएं',
      feature1: 'पासवर्ड-रहित प्रमाणीकरण (WebAuthn/FIDO2)',
      feature2: 'टैग-आधारित एक्सेस नियंत्रण के साथ मूल-विशिष्ट कुंजी पृथक्करण',
      feature3: 'सत्र प्रबंधन (इन-मेमोरी + वैकल्पिक स्थायी)',
      feature4: 'HD वॉलेट जनरेशन (BIP39/BIP44)',
      feature5: 'सुरक्षा मोड (STANDARD/STRICT/YOLO) के साथ मल्टी-एड्रेस डेरिवेशन',
      feature6: 'कई हस्ताक्षर विधियां (EIP-191, SIWE/EIP-4361, EIP-712, rawHash)',
      feature7: 'स्वचालित RPC रिज़ॉल्यूशन के साथ ऑन-चेन लेनदेन भेजना (`sendTransaction`)',
      feature8: 'ethers, viem, wagmi, RainbowKit के लिए EIP-1193 प्रोवाइडर (`getEIP1193Provider`)',
      feature9: 'ERC-5564 स्टील्थ पते (ऑप्ट-इन)',
      feature10: 'ZK प्रिमिटिव्स (ज़ीरो-नॉलेज प्रूफ जनरेशन और सत्यापन)',
      feature11: 'Chainlist समर्थन (2390+ नेटवर्क)',
      feature12: 'EIP-7702 नेटवर्क डिटेक्शन (329+ नेटवर्क)',
      feature13:
        'बाहरी वॉलेट एकीकरण (EIP-7702 के माध्यम से MetaMask/Ledger को w3pk को प्रत्यायोजित करें)',
      feature14: 'EIP-7951 PRIMARY मोड (P-256 पासकी हस्ताक्षर)',
      feature15: 'बिल्ड सत्यापन (IPFS CID हैशिंग + DAO-अनुरक्षित ऑनचेन रजिस्ट्री)',
      feature16: 'तीन-परत बैकअप और रिकवरी (पासकी सिंक, एन्क्रिप्टेड बैकअप, सामाजिक रिकवरी)',
      feature17: 'AI-संचालित होस्ट ऐप निरीक्षण',
      invalidEmailTitle: 'अमान्य ईमेल',
      invalidEmailDescription: 'कृपया एक मान्य ईमेल पता दर्ज करें',
      subscribeSuccessTitle: 'सफलता!',
      subscribeSuccessDescription: 'आपने w3pk अपडेट के लिए सब्सक्राइब कर लिया है',
      subscribeErrorTitle: 'त्रुटि',
      subscribeErrorDescription: 'सब्सक्राइब करने में विफल। कृपया पुनः प्रयास करें।',
    },
  },

  // Spanish
  es: {
    common: {
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
      pleaseLogin: 'Por favor inicia sesión',
      cancel: 'Cancelar',
      srLoadingText: 'Cargando, por favor espera...',
      loading: 'Cargando...',
      notAvailable: 'No disponible',
      close: 'Cerrar',
    },
    home: {
      title: '¡Bienvenido!',
      subtitle: '¡Es un placer tenerte aquí!',
      greeting: '¡Hola Anon!',
      greetingSubtitle: '¡Siéntate, relájate y crea algo genial!',
      signMessage: 'Firmar un mensaje',
      messageSignedTitle: 'Mensaje firmado',
      messageSignedDescription: signature => `Firma: ${signature.substring(0, 20)}...`,
    },
    navigation: {
      about: 'Acerca de',
      settings: 'Configuración',
    },
    settings: {
      title: 'Configuración',
      loginRequired: 'Por favor inicia sesión para acceder a tu configuración',
      subtitle: 'Gestiona tus cuentas, copias de seguridad y opciones de recuperación',
      tabAccounts: 'Cuentas',
      tabBackup: 'Copia de seguridad',
      tabSync: 'Sincronización',
      tabRecovery: 'Recuperación social',

      browserInfoHeading: 'Información del navegador',
      browserLabel: 'Navegador:',
      versionLabel: 'Versión:',
      osLabel: 'Sistema operativo:',
      webauthnSupportLabel: 'Compatibilidad con WebAuthn:',
      compatibilityLabel: 'Compatibilidad:',
      available: 'Disponible',
      notAvailable: 'No disponible',
      fullySupported: 'Totalmente compatible',
      knownIssues: 'Problemas conocidos',
      notSupported: 'No compatible',
      browserNotSupportedTitle: 'Navegador no compatible',
      knownIssuesTitle: 'Problemas conocidos detectados',
      recommendationTitle: 'Recomendación',
      webauthnNotAvailableTitle: 'WebAuthn no disponible',
      webauthnNotAvailableText:
        'Tu navegador no admite WebAuthn, que es necesario para la autenticación de w3pk. Actualiza tu navegador o usa uno compatible:',
      browserChrome: 'Chrome 67+ (mayo de 2018)',
      browserFirefox: 'Firefox 60+ (mayo de 2018)',
      browserSafari: 'Safari 14+ (septiembre de 2020)',
      browserEdge: 'Edge 18+ (noviembre de 2018)',
      browserSamsung: 'Samsung Internet 11+ (febrero de 2020)',
      androidRecommendedHeading: 'Navegadores recomendados para Android',
      samsungInternetNote:
        'Samsung Internet (mejor opción para dispositivos Samsung) - ✅ Funcionamiento confirmado',
      chromeNote: 'Chrome - ✅ Fiable',
      edgeNote: 'Edge - ✅ Fiable',
      firefoxMobileNote:
        'Firefox Mobile - ⚠️ Evitar (problemas conocidos de persistencia de claves de acceso)',

      restoreBackupHeading: 'Restaurar desde copia de seguridad',
      restoreBackupDescription:
        'Si tienes un archivo de copia de seguridad, puedes restaurar tu billetera sin iniciar sesión primero.',
      restoreBackupSyncHint:
        'Para sincronizar con otro dispositivo: inicia sesión en tu otro dispositivo, ve a Configuración → Crear copia de seguridad para descargar un archivo de copia de seguridad cifrado, luego súbelo aquí e introduce la misma contraseña.',
      restoringText: 'Restaurando...',
      restoreBackupButton: 'Restaurar desde archivo de copia de seguridad',

      debugStorageHeading: 'Depurar e inspeccionar almacenamiento',
      debugStorageDescription:
        'Inspecciona el almacenamiento del navegador y los registros de actividad',
      inspectingText: 'Inspeccionando...',
      inspectLocalStorageButton: 'Inspeccionar LocalStorage',
      inspectIndexedDBButton: 'Inspeccionar IndexedDB',

      inspectSecurityDescriptionSmall:
        'Analiza esta aplicación en busca de métodos de transacción y firma.',
      inspectSecurityButton: 'Inspeccionar seguridad',
      consoleCommandLabel: 'Comando de consola:',
      clearReportButton: 'Borrar informe',
      filesAnalyzedLabel: 'Archivos analizados:',
      inspectionHeadingBig: 'Inspección de seguridad',
      inspectSecurityDescriptionBig:
        'Genera un informe de seguridad completo de esta aplicación. El informe analizará todos los métodos de transacción y firma.',
      inspectNowButton: 'Inspeccionar ahora',
      consoleHintText:
        'También puedes ejecutar await w3pk.inspectNow() en la consola del navegador',
      securityReportHeading: 'Informe de seguridad',
      appUrlLabel: 'URL de la app:',

      localStorageResultsHeading: 'Resultados de LocalStorage',
      itemsCount: n => `${n} elementos`,
      encryptedBadge: 'Cifrado',
      clearItemAria: 'Borrar elemento',
      indexedDBResultsHeading: 'Resultados de IndexedDB',
      databasesCount: n => `${n} base(s) de datos`,
      storesLabel: 'Almacenes:',
      recordsLabel: 'Registros:',
      clearRecordAria: 'Borrar registro',
      storeKeyLabel: (store, key) => `Almacén: ${store} | Clave: ${key}`,

      currentAccountHeading: 'Cuenta actual',
      currentAccountDescription: 'Esta es la cuenta con la que has iniciado sesión actualmente.',
      noAccounts: 'No se encontraron cuentas en este dispositivo.',
      currentBadge: 'Actual',
      usernameLabel: username => `Nombre de usuario: ${username}`,
      deleteAccountAria: 'Eliminar cuenta',

      sessionHeading: 'Mantener mi sesión activa',
      sessionDescription:
        'Establece cuánto tiempo debe permanecer activa tu sesión sin que se solicite la clave de acceso. Cuando caduque, tu próxima visita te pedirá tu biometría/PIN una vez y comenzará una sesión nueva; por lo tanto, esto también determina con qué frecuencia vuelves a autenticarte. Esta opción se aplica solo a los modos STANDARD y YOLO. Los modos STRICT y PRIMARY siempre requieren una autenticación nueva y no usan sesiones persistentes.',
      noStoredSessionText:
        'No hay ninguna sesión almacenada en este dispositivo. Parece que tu autenticador no admite la extensión PRF de WebAuthn, que w3pk necesita para mantener las sesiones activas de forma segura. Tu sesión permanecerá solo en memoria: terminará al cerrar la pestaña, y cada visita te pedirá tu biometría/PIN. Todo lo demás funciona con normalidad.',
      sessionDurationLabel: 'Duración de la sesión',
      dayLabel: n => `${n} día${n > 1 ? 's' : ''}`,
      oneDayLabel: '1 día',
      thirtyDaysLabel: '30 días',
      sessionHowItWorksTitle: 'Cómo funciona:',
      sessionHowItWorksText:
        'Cada vez que inicias sesión con tu biometría/PIN, tu autenticador libera un secreto respaldado por hardware (extensión PRF de WebAuthn) que cifra tu sesión en este dispositivo; nada almacenado en disco puede recrear esa clave. La cuenta regresiva se reinicia en cada inicio de sesión real: con una duración de 7 días, iniciar sesión hoy te mantiene conectado hasta dentro de 7 días, momento en el que se te pedirá una vez y la sesión se volverá a cifrar con una clave nueva.',

      walletBackupHeading: 'Copia de seguridad de la billetera',
      walletBackupDescription:
        'Crea copias de seguridad cifradas de tu billetera para asegurarte de nunca perder el acceso',
      currentAccountBackupHeading: 'Cuenta actual',
      loggedInAsLabel: 'Sesión iniciada como:',
      loadingAddressesText: 'Cargando direcciones...',
      index0Label: 'Dirección de índice n.º 0:',
      mainAddressLabel:
        'Dirección específica del origen, modo STANDARD, etiquetada como MAIN (billetera predeterminada):',
      loadingText: 'Cargando...',
      securityStatusHeading: 'Estado de seguridad',
      checkingStatusText: 'Comprobando el estado de la copia de seguridad...',
      refreshHeading: 'Actualizar estado de la copia de seguridad',
      refreshDescription:
        'Vuelve a cargar tu puntuación de seguridad actual y las recomendaciones de copia de seguridad',
      checkingText: 'Comprobando...',
      refreshButton: 'Actualizar estado',
      createHeading: 'Crear copia de seguridad',
      createDescription:
        'Descarga un archivo de copia de seguridad cifrado protegido por tu contraseña',
      creatingText: 'Creando...',
      createButton: 'Crear copia de seguridad',
      restoreHeadingCard: 'Restaurar desde copia de seguridad',
      restoreDescriptionCard:
        'Restaura tu billetera desde un archivo de copia de seguridad cifrado',
      restoreButtonCard: 'Restaurar copia de seguridad',
      aboutBackupHeading: 'Acerca de la copia de seguridad del lado del cliente',
      aboutBackupPara1:
        'El secreto principal de tu billetera (la frase mnemotécnica) se genera y se cifra por completo en tu dispositivo. El proceso de copia de seguridad recupera estos datos cifrados del almacenamiento local de tu navegador usando tu contraseña, y luego los empaqueta en un archivo seguro para que lo descargues.',
      aboutBackupPara2:
        'La clave de cifrado de tu billetera se deriva mediante una firma WebAuthn, que requiere tu autenticación biométrica (huella dactilar, escaneo facial) o el PIN del dispositivo. Esto significa que, aunque alguien acceda a los datos cifrados almacenados en tu navegador, no podrá descifrarlos sin tu dispositivo físico y tu autenticación.',
      aboutBackupPara3:
        'Tu archivo de copia de seguridad se cifra con AES-256-GCM utilizando una clave derivada de la contraseña que proporciones. Guarda este archivo de forma segura y recuerda tu contraseña.',
      aboutBackupWarning:
        'Si pierdes el acceso a tu dispositivo, a tu clave de acceso Y al archivo/contraseña de copia de seguridad, tu billetera no podrá recuperarse.',

      socialRecoveryHeading: 'Recuperación social',
      socialRecoveryDescription:
        'Distribuye la recuperación de tu billetera entre guardianes de confianza mediante el reparto de secretos de Shamir',
      setupHeading: 'Configurar recuperación social',
      setupDescription: (threshold, count) =>
        `Añade guardianes de confianza que te ayudarán a recuperar tu billetera. Necesitarás ${threshold} de ${count || '?'} guardianes para recuperarla.`,
      guardianNameLabel: 'Nombre del guardián *',
      guardianEmailLabel: 'Correo electrónico del guardián (opcional)',
      addGuardianButton: 'Añadir guardián',
      guardiansListHeading: n => `Guardianes (${n})`,
      removeGuardianAria: 'Eliminar guardián',
      thresholdLabel: (threshold, count) => `Umbral de recuperación: ${threshold} de ${count}`,
      thresholdDescription: 'Número de guardianes necesarios para recuperar tu billetera',
      setupSocialRecoveryButton: (threshold, count) =>
        `Configurar recuperación social (${threshold}-de-${count || '?'})`,
      howItWorksRecoveryInfo: (count, threshold) =>
        `Cómo funciona: la recuperación de tu billetera se dividirá en ${count || '?'} partes cifradas mediante el reparto de secretos de Shamir. Necesitarás que ${threshold} guardianes combinen sus partes para recuperar tu billetera. Ningún guardián puede acceder a tu billetera por sí solo.`,
      recoverWalletHeading: 'Recuperar billetera',
      hideButton: 'Ocultar',
      showButton: 'Mostrar',
      recoverDescription:
        '¿Perdiste el acceso a tu billetera? Reúne las partes de los guardianes para recuperarla.',
      shareCodeLabel: 'Código de parte del guardián',
      sharePlaceholder:
        'Pega aquí el JSON de la parte del guardián (p. ej., {"guardianId":"...","share":"..."})',
      addShareButton: 'Añadir parte',
      uploadFileButton: 'Subir archivo',
      clearAllButton: 'Borrar todo',
      collectedSharesHeading: n => `Partes recopiladas (${n})`,
      guardianFallback: 'Guardián',
      shareIndexLabel: n => `(#${n})`,
      addedAtLabel: time => `Añadido ${time}`,
      removeShareAria: 'Eliminar parte',
      invalidShareLabel: n => `Parte no válida n.º ${n}`,
      progressHeading: 'Progreso de recuperación',
      progressText: n =>
        `${n} parte(s) recopilada(s). Necesitas al menos 2 partes para intentar la recuperación.`,
      recoveringText: 'Recuperando...',
      recoverButton: n => `Recuperar billetera (${n} partes)`,
      importantWarning:
        'Importante: asegúrate de que las partes provengan de los guardianes correctos. Las partes no válidas harán que la recuperación falle.',
      activeHeading: 'Recuperación social activa',
      activeDescription: (threshold, count) =>
        `Tu billetera está protegida con una recuperación de ${threshold}-de-${count} guardianes`,
      generateInviteButton: 'Generar invitación',
      removeConfigQuestion:
        '¿Todos los guardianes tienen sus partes? Ahora puedes eliminar la configuración de guardianes del almacenamiento local. Las partes están guardadas de forma segura con tus guardianes y pueden usarse para la recuperación en cualquier momento.',
      removeConfigButton: 'Borrar configuración de guardianes del almacenamiento local',
      invitationHeading: 'Invitación de guardián',
      downloadInviteButton: 'Descargar invitación',
      sendInviteText: name => `Envía esta invitación a ${name} a través de un canal seguro`,

      deviceSyncHeading: 'Sincronización de dispositivos',
      deviceSyncDescription:
        'Tu clave de acceso se sincroniza automáticamente entre dispositivos mediante los servicios de la plataforma',
      qrHeading: 'Código QR de sincronización',
      qrDescription:
        'Genera un código QR que contenga las direcciones de tu billetera para sincronizar o verificar fácilmente la información de tu cuenta en otro dispositivo.',
      generateQrButton: 'Generar código QR de sincronización',
      qrNote:
        'Nota: este código QR contiene únicamente las direcciones públicas de tu billetera. NO contiene tus claves privadas ni tu frase de recuperación. Úsalo para verificar tu cuenta en otro dispositivo.',
      hideQrButton: 'Ocultar código QR',
      verifyHeading: 'Verificar datos del código QR',
      verifyDescription:
        'Pega la cadena JSON de un código QR escaneado para verificar las direcciones de la billetera.',
      verifyPlaceholder:
        'Pega aquí los datos JSON (p. ej., {"username":"...","ethereumAddress":"..."})',
      errorLabel: 'Error:',
      parsedDataLabel: 'Datos analizados:',
      usernameFieldLabel: 'Nombre de usuario:',
      ethAddressLabel: 'Dirección de Ethereum:',
      index0FieldLabel: 'Índice n.º 0:',
      mainTaggedLabel: 'Etiquetada como MAIN:',
      openbarTaggedLabel: 'Etiquetada como OPENBAR:',
      generatedLabel: 'Generado:',
      linkWalletButton: 'Vincular esta billetera a tu cuenta de clave de acceso',
      linkExplanation:
        'Qué ocurre al vincular: esto guardará las direcciones de la billetera tanto en localStorage como en IndexedDB, creando un vínculo persistente entre tu cuenta de clave de acceso y esta billetera HD. Puedes usarlo para verificar o sincronizar los datos de la billetera entre dispositivos.',
      howQrWorksHeading: 'Cómo funciona la sincronización de billetera por código QR',
      qrStep1:
        'Paso 1: generar código QR - En tu dispositivo principal, genera un código QR que contenga las direcciones públicas de tu billetera. Este código QR es seguro de compartir, ya que solo contiene información pública.',
      qrStep2:
        'Paso 2: escanear y verificar - En tu dispositivo secundario, escanea el código QR con cualquier aplicación de escaneo de QR, o copia manualmente los datos JSON que se muestran en el código QR.',
      qrStep3:
        'Paso 3: vincular billeteras - Pega los datos JSON en el área de verificación de arriba y haz clic en "Vincular esta billetera". Esto crea una conexión persistente entre tu cuenta de clave de acceso y las direcciones de la billetera HD.',
      whatGetsStored:
        'Qué se almacena: solo las direcciones públicas de la billetera se guardan en localStorage y en IndexedDB. Tus claves privadas y tu frase de recuperación permanecen seguras y nunca se transmiten ni se almacenan mediante este mecanismo de sincronización.',
      platformSyncHeading: 'Sincronización de la clave de acceso entre plataformas',
      platformSyncIntro:
        'Tus credenciales de clave de acceso se sincronizan automáticamente entre dispositivos dentro del mismo ecosistema:',
      appleSyncNote: 'Apple: se sincroniza mediante iCloud Keychain (iPhone, iPad, Mac)',
      googleSyncNote: 'Google: se sincroniza mediante Password Manager (Android, Chrome)',
      windowsSyncNote:
        'Windows Hello: específico del dispositivo, usa una copia de seguridad cifrada para dispositivos nuevos',
      hardwareSyncNote:
        'Llaves de hardware: sin sincronización, guarda una copia de seguridad cifrada por separado',
      crossPlatformNote:
        'Limitación entre plataformas: las claves de acceso no se sincronizan entre ecosistemas diferentes (por ejemplo, de iPhone a Android). Sin embargo, las copias de seguridad cifradas SÍ son totalmente multiplataforma: puedes restaurar tu billetera en cualquier dispositivo con el archivo de copia de seguridad y la contraseña, sin importar la plataforma original.',
      bestPracticesHeading: 'Buenas prácticas',
      practiceBackupFirst:
        'Crea siempre una copia de seguridad cifrada antes de sincronizar con un dispositivo nuevo',
      practiceVerifyAddresses:
        'Verifica que las direcciones de la billetera coincidan después de sincronizar',
      practiceUseDebugTools:
        'Usa las herramientas de depuración e inspección de almacenamiento para verificar que los datos de sincronización se guardaron correctamente',
      practiceNeverShareQr: 'Nunca compartas tu código QR públicamente ni en canales no confiables',
      practiceTreatAsSensitive:
        'Los códigos QR solo contienen direcciones públicas, pero aun así trátalos como información sensible de la cuenta',

      createBackupModalTitle: 'Introduce la contraseña para crear la copia de seguridad',
      createBackupModalDescription:
        'Introduce tu contraseña para crear la copia de seguridad. El SDK de w3pk la requiere para acceder a los datos cifrados de tu billetera.',
      restoreBackupModalTitle: 'Introduce la contraseña para restaurar la copia de seguridad',
      restoreBackupModalDescription:
        'Introduce la contraseña que usaste al crear este archivo de copia de seguridad.',
      chooseUsernameModalTitle: 'Elige un nombre de usuario para la billetera restaurada',
      chooseUsernameModalDescription:
        'No se encontraron credenciales existentes en este dispositivo. Elige un nombre de usuario para registrar tu billetera restaurada con una nueva clave de acceso.',
      usernameFormatError:
        'El nombre de usuario debe tener entre 3 y 50 caracteres, ser alfanumérico con guiones bajos o guiones, y comenzar/terminar con un carácter alfanumérico.',
      restoringRegisteringText: 'Restaurando y registrando...',
      restoreRegisterButton: 'Restaurar y registrar',
      removeAccountModalTitle: 'Eliminar cuenta',
      removeAccountConfirm: username =>
        `¿Estás seguro de que quieres eliminar la cuenta ${username}?`,
      removeAccountWarning:
        'Advertencia: esto eliminará todos los datos de esta cuenta de este dispositivo. Asegúrate de tener una copia de seguridad antes de continuar. Esta acción no se puede deshacer.',
      removeAccountLoggedOutNote:
        'Esta es la cuenta con la que has iniciado sesión actualmente. Se cerrará tu sesión después de eliminarla.',
      removeAccountButton: 'Eliminar cuenta',
      localStorageModalTitle: 'Inspección de LocalStorage',
      foundItemsText: n => `Se encontraron ${n} elementos en localStorage`,
      noDataFound: 'No se encontraron datos',
      indexedDBModalTitle: 'Inspección de IndexedDB',
      foundDatabasesText: n => `Se encontraron ${n} base(s) de datos`,
      noDatabasesFound: 'No se encontraron bases de datos relacionadas con w3pk',

      registrationSuccessTitle: 'Registro exitoso',
      registrationSuccessDescription: 'Tu nueva cuenta ha sido creada.',
      registrationFailedTitle: 'Error de registro',
      registrationFailedDefaultDescription: 'No se pudo completar el registro. Inténtalo de nuevo.',
      localStorageInspectedTitle: 'LocalStorage inspeccionado',
      localStorageInspectedDescription: n =>
        `Se encontraron ${n} elementos. Desplázate hacia abajo para ver los resultados.`,
      genericErrorTitle: 'Error',
      failedInspectLocalStorage: 'No se pudo inspeccionar localStorage',
      indexedDBInspectedTitle: 'IndexedDB inspeccionado',
      indexedDBInspectedDescription: (dbCount, recordCount) =>
        `Se encontraron ${dbCount} base(s) de datos con ${recordCount} registro(s). Desplázate hacia abajo para ver los resultados.`,
      failedInspectIndexedDB: 'No se pudo inspeccionar IndexedDB',
      itemClearedTitle: 'Elemento borrado',
      itemClearedDescription: key => `Se eliminó "${key}" de localStorage`,
      failedClearItem: key => `No se pudo borrar "${key}"`,
      recordClearedTitle: 'Registro borrado',
      recordClearedDescription: (db, store) => `Se eliminó el registro de ${db}/${store}`,
      failedClearRecord: 'No se pudo borrar el registro',
      errorLoadingAddressesTitle: 'Error al cargar las direcciones',
      failedDeriveAddresses: 'No se pudieron derivar las direcciones de la billetera',
      errorLoadingBackupStatusTitle: 'Error al cargar el estado de la copia de seguridad',
      failedCheckSecurityStatus: 'No se pudo comprobar el estado de seguridad',
      accountRemovedTitle: 'Cuenta eliminada',
      accountRemovedDescription: username =>
        `La cuenta ${username} ha sido eliminada de este dispositivo.`,
      loggingOutTitle: 'Cerrando sesión',
      loggingOutDescription: 'Eliminaste tu cuenta actual. Cerrando sesión...',
      failedRemoveAccount: 'No se pudo eliminar la cuenta. Inténtalo de nuevo.',
      errorReadingFileTitle: 'Error al leer el archivo',
      failedReadBackupFile: 'No se pudo leer el archivo de copia de seguridad',
      noBackupFileSelectedTitle: 'No se seleccionó ningún archivo de copia de seguridad',
      incompatibleBackupTitle: 'Versión de copia de seguridad incompatible',
      incompatibleBackupDescription:
        'Esta copia de seguridad se creó con una versión anterior de w3pk. Crea una nueva copia de seguridad con la versión actual.',
      walletRestoredTitle: '¡Billetera restaurada!',
      walletRestoredDescription: address =>
        `Billetera restaurada y sobrescrita correctamente: ${address}`,
      usernameRequiredRestoreDescription:
        'Introduce un nombre de usuario para registrarte con la billetera restaurada.',
      walletRestoredRegisteredTitle: '¡Billetera restaurada y registrada!',
      walletRestoredRegisteredDescription: address =>
        `Billetera restaurada y registrada correctamente: ${address}`,
      securityReportGeneratedTitle: 'Informe de seguridad generado',
      securityReportGeneratedDescription: 'Consulta el análisis detallado a continuación',
      inspectionFailedTitle: 'Error de inspección',
      inspectionFailedDescription:
        'La inspección de la aplicación anfitriona no funcionó. Probablemente se deba a que se alcanzó el límite de solicitudes de Anthropic.',
      backupStatusRetrievedTitle: 'Estado de la copia de seguridad obtenido.',
      errorRetrievingStatusTitle: 'Error al obtener el estado.',
      unexpectedErrorDescription: 'Ocurrió un error inesperado.',
      errorCreatingBackupTitle: 'Error al crear la copia de seguridad.',
      backupCreatedTitle: '¡Copia de seguridad creada correctamente!',
      invalidInputTitle: 'Entrada no válida',
      guardianNameRequiredDescription: 'El nombre del guardián es obligatorio',
      notEnoughGuardiansTitle: 'Guardianes insuficientes',
      notEnoughGuardiansDescription:
        'Necesitas al menos 2 guardianes para configurar la recuperación social',
      invalidThresholdTitle: 'Umbral no válido',
      invalidThresholdDescription: 'El umbral no puede ser mayor que el número de guardianes',
      socialRecoveryConfiguredTitle: '¡Recuperación social configurada!',
      socialRecoveryConfiguredDescription: (threshold, count) =>
        `Recuperación de ${threshold}-de-${count} guardianes configurada correctamente`,
      pleasePasteShareDescription: 'Pega un código de parte de guardián',
      duplicateShareTitle: 'Parte duplicada',
      duplicateShareDescription: 'Esta parte de guardián ya ha sido añadida',
      shareAddedTitle: 'Parte añadida',
      shareAddedDescription: name => `Se añadió la parte de ${name}`,
      invalidShareFormatTitle: 'Formato de parte no válido',
      invalidShareFormatDescription: 'Pega un código de parte de guardián válido (formato JSON)',
      notEnoughSharesTitle: 'Partes insuficientes',
      notEnoughSharesDescription:
        'Necesitas al menos 2 partes de guardián para recuperar tu billetera',
      passwordRequiredRecoveryDescription:
        'Necesitas introducir tu contraseña para descifrar el archivo de copia de seguridad',
      usernameRequiredRecoveryDescription:
        'Necesitas proporcionar un nombre de usuario para registrar tu billetera recuperada',
      walletRecoveredTitle: '¡Billetera recuperada correctamente!',
      walletRecoveredDescription: address =>
        `Tu billetera ha sido recuperada y registrada con una nueva clave de acceso: ${address}`,
      fileLoadedTitle: 'Archivo cargado',
      fileLoadedDescription:
        'Parte de guardián cargada desde el archivo. Haz clic en "Añadir parte" para agregarla.',
      failedReadGuardianFile: 'No se pudo leer el archivo de parte de guardián',
      cannotSaveTitle: 'No se puede guardar',
      cannotSaveDescription: 'Datos de QR no válidos o usuario no autenticado',
      walletLinkedTitle: '¡Billetera vinculada correctamente!',
      walletLinkedDescription: address =>
        `Billetera ${address} vinculada a tu cuenta de clave de acceso`,
      errorSavingLinkTitle: 'Error al guardar el vínculo de la billetera',
      failedSaveSyncData: 'No se pudieron guardar los datos de sincronización de la billetera',
      recoveryPasswordPrompt:
        'Introduce la contraseña que estableciste al configurar la recuperación social.\n\nEsta contraseña NO se compartió con los guardianes: la estableciste durante la configuración.',
      recoveryUsernamePrompt: address =>
        `Elige un nombre de usuario para tu nuevo registro de clave de acceso.\n\nRecuperando billetera: ${address}`,
    },
    header: {
      registerTitle: 'Registrar nueva cuenta',
      walletInfoText:
        'Se creará una billetera de Ethereum y se almacenará de forma segura en tu dispositivo, protegida por tu biometría o PIN gracias a',
      usernameLabel: 'Nombre de usuario',
      usernamePlaceholder: 'Introduce tu nombre de usuario',
      usernameError:
        'El nombre de usuario debe tener entre 3 y 50 caracteres y contener solo letras, números, guiones bajos y guiones. Debe comenzar y terminar con una letra o número.',
      createAccount: 'Crear cuenta',
      optionsAriaLabel: 'Opciones',
      mainNavAriaLabel: 'Navegación principal',
      usernameRequiredTitle: 'Nombre de usuario requerido',
      usernameRequiredDescription: 'Por favor introduce un nombre de usuario para registrarte.',
      noAccountFoundTitle: 'Cuenta no encontrada',
      noAccountFoundDescription:
        'No se encontró ninguna clave de acceso. Por favor regístrate para crear una nueva cuenta.',
      alreadyRegisteredLink: 'Ya me registré en otro dispositivo',
    },
    passwordModal: {
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Introduce tu contraseña',
      passwordRequiredTitle: 'Contraseña requerida.',
      passwordRequiredDescription: 'Por favor introduce tu contraseña.',
      weakPasswordTitle: 'Contraseña débil.',
      weakPasswordDescription:
        'Por favor usa una contraseña más segura que cumpla con todos los requisitos.',
      submissionErrorTitle: 'Error de envío.',
      submissionErrorDefaultDescription: 'Ocurrió un error inesperado.',
      requirementsNotMet: 'La contraseña no cumple con todos los requisitos',
      strongPassword: '¡Contraseña segura!',
      mustInclude: 'La contraseña debe incluir:',
      reqMinLength: 'Al menos 12 caracteres',
      reqUpperCase: 'Una letra mayúscula',
      reqLowerCase: 'Una letra minúscula',
      reqNumber: 'Un número',
      reqSpecialChar: 'Un carácter especial',
      satisfied: ' (cumplido)',
      required: ' (requerido)',
      submit: 'Enviar',
    },
    about: {
      headingPrefix: 'Acerca de',
      introPart1:
        'w3pk es un SDK de autenticación Web3 sin contraseña con billeteras cifradas y funciones de privacidad. Puedes usarlo en cualquier aplicación web basada en JS/TS (Next.js, Vue, Angular, Svelte, …).',
      introPart2:
        'es una plantilla de aplicación Next.js. ¡Siéntete libre de bifurcarla (fork) y crear lo que quieras!',
      emailBoxText:
        'w3pk está en desarrollo. Recibe correos electrónicos cuando publiquemos nuevas funciones (soporte de EIP-1193, capacidades de IA, ayudantes de Viem, abstracción de cadenas y más)',
      emailPlaceholder: 'your@email.com',
      subscribeButton: 'Suscribirse',
      githubLabel: 'GitHub',
      npmLabel: 'NPM',
      githubAriaLabel: 'Ver w3pk en GitHub (se abre en una pestaña nueva)',
      npmAriaLabel: 'Ver w3pk en NPM (se abre en una pestaña nueva)',
      codeRegisterComment: '// Registrarse',
      codeLoginComment: '// Iniciar sesión',
      codeLogoutComment: '// Cerrar sesión',
      featuresHeading: 'Características',
      feature1: 'Autenticación sin contraseña (WebAuthn/FIDO2)',
      feature2:
        'Aislamiento de claves específico por origen con control de acceso basado en etiquetas',
      feature3: 'Gestión de sesiones (en memoria + persistente opcional)',
      feature4: 'Generación de billetera HD (BIP39/BIP44)',
      feature5: 'Derivación de múltiples direcciones con modos de seguridad (STANDARD/STRICT/YOLO)',
      feature6: 'Múltiples métodos de firma (EIP-191, SIWE/EIP-4361, EIP-712, rawHash)',
      feature7:
        'Envío de transacciones on-chain con resolución automática de RPC (`sendTransaction`)',
      feature8: 'Proveedor EIP-1193 para ethers, viem, wagmi, RainbowKit (`getEIP1193Provider`)',
      feature9: 'Direcciones ocultas (stealth) ERC-5564 (opcional)',
      feature10: 'Primitivas ZK (generación y verificación de pruebas de conocimiento cero)',
      feature11: 'Soporte de Chainlist (más de 2390 redes)',
      feature12: 'Detección de redes EIP-7702 (más de 329 redes)',
      feature13:
        'Integración con billeteras externas (delega MetaMask/Ledger a w3pk mediante EIP-7702)',
      feature14: 'Modo PRIMARY EIP-7951 (firma de clave de acceso P-256)',
      feature15:
        'Verificación de compilación (hash CID de IPFS + registro onchain mantenido por una DAO)',
      feature16:
        'Copia de seguridad y recuperación de tres capas (sincronización de clave de acceso, copias de seguridad cifradas, recuperación social)',
      feature17: 'Inspección de la aplicación anfitriona impulsada por IA',
      invalidEmailTitle: 'Correo electrónico no válido',
      invalidEmailDescription: 'Introduce una dirección de correo electrónico válida',
      subscribeSuccessTitle: '¡Éxito!',
      subscribeSuccessDescription: 'Te has suscrito a las actualizaciones de w3pk',
      subscribeErrorTitle: 'Error',
      subscribeErrorDescription: 'No se pudo completar la suscripción. Inténtalo de nuevo.',
    },
  },

  // French
  fr: {
    common: {
      login: 'Connexion',
      logout: 'Déconnexion',
      pleaseLogin: 'Veuillez vous connecter',
      cancel: 'Annuler',
      srLoadingText: 'Chargement, veuillez patienter...',
      loading: 'Chargement...',
      notAvailable: 'Non disponible',
      close: 'Fermer',
    },
    home: {
      title: 'Bienvenue !',
      subtitle: "C'est un plaisir de vous avoir ici !",
      greeting: 'Bonjour Anon !',
      greetingSubtitle: 'Détendez-vous et créez quelque chose de cool !',
      signMessage: 'Signer un message',
      messageSignedTitle: 'Message signé',
      messageSignedDescription: signature => `Signature : ${signature.substring(0, 20)}...`,
    },
    navigation: {
      about: 'À propos',
      settings: 'Paramètres',
    },
    settings: {
      title: 'Paramètres',
      loginRequired: 'Veuillez vous connecter pour accéder à vos paramètres',
      subtitle: 'Gérez vos comptes, sauvegardes et options de récupération',
      tabAccounts: 'Comptes',
      tabBackup: 'Sauvegarde',
      tabSync: 'Synchronisation',
      tabRecovery: 'Récupération sociale',

      browserInfoHeading: 'Informations sur le navigateur',
      browserLabel: 'Navigateur :',
      versionLabel: 'Version :',
      osLabel: "Système d'exploitation :",
      webauthnSupportLabel: 'Support WebAuthn :',
      compatibilityLabel: 'Compatibilité :',
      available: 'Disponible',
      notAvailable: 'Non disponible',
      fullySupported: 'Entièrement pris en charge',
      knownIssues: 'Problèmes connus',
      notSupported: 'Non pris en charge',
      browserNotSupportedTitle: 'Navigateur non pris en charge',
      knownIssuesTitle: 'Problèmes connus détectés',
      recommendationTitle: 'Recommandation',
      webauthnNotAvailableTitle: 'WebAuthn non disponible',
      webauthnNotAvailableText:
        "Votre navigateur ne prend pas en charge WebAuthn, requis pour l'authentification w3pk. Veuillez mettre à jour votre navigateur ou en utiliser un compatible :",
      browserChrome: 'Chrome 67+ (mai 2018)',
      browserFirefox: 'Firefox 60+ (mai 2018)',
      browserSafari: 'Safari 14+ (septembre 2020)',
      browserEdge: 'Edge 18+ (novembre 2018)',
      browserSamsung: 'Samsung Internet 11+ (février 2020)',
      androidRecommendedHeading: 'Navigateurs recommandés pour Android',
      samsungInternetNote:
        'Samsung Internet (idéal pour les appareils Samsung) - ✅ Fonctionnement confirmé',
      chromeNote: 'Chrome - ✅ Fiable',
      edgeNote: 'Edge - ✅ Fiable',
      firefoxMobileNote:
        "Firefox Mobile - ⚠️ À éviter (problèmes connus de persistance des clés d'accès)",

      restoreBackupHeading: 'Restaurer depuis une sauvegarde',
      restoreBackupDescription:
        "Si vous disposez d'un fichier de sauvegarde, vous pouvez restaurer votre portefeuille sans vous connecter au préalable.",
      restoreBackupSyncHint:
        'Pour synchroniser avec un autre appareil : connectez-vous sur votre autre appareil, allez dans Paramètres → Créer une sauvegarde pour télécharger un fichier de sauvegarde chiffré, puis importez-le ici et saisissez le même mot de passe.',
      restoringText: 'Restauration en cours...',
      restoreBackupButton: 'Restaurer depuis un fichier de sauvegarde',

      debugStorageHeading: 'Déboguer et inspecter le stockage',
      debugStorageDescription: "Inspecter le stockage du navigateur et les journaux d'activité",
      inspectingText: 'Inspection en cours...',
      inspectLocalStorageButton: 'Inspecter LocalStorage',
      inspectIndexedDBButton: 'Inspecter IndexedDB',

      inspectSecurityDescriptionSmall:
        'Analyser cette application pour ses méthodes de transaction et de signature.',
      inspectSecurityButton: 'Inspecter la sécurité',
      consoleCommandLabel: 'Commande console :',
      clearReportButton: 'Effacer le rapport',
      filesAnalyzedLabel: 'Fichiers analysés :',
      inspectionHeadingBig: 'Inspection de sécurité',
      inspectSecurityDescriptionBig:
        'Générer un rapport de sécurité complet pour cette application. Le rapport analysera toutes les méthodes de transaction et de signature.',
      inspectNowButton: 'Inspecter maintenant',
      consoleHintText:
        'Vous pouvez également exécuter await w3pk.inspectNow() dans la console du navigateur',
      securityReportHeading: 'Rapport de sécurité',
      appUrlLabel: "URL de l'application :",

      localStorageResultsHeading: 'Résultats LocalStorage',
      itemsCount: n => `${n} éléments`,
      encryptedBadge: 'Chiffré',
      clearItemAria: "Effacer l'élément",
      indexedDBResultsHeading: 'Résultats IndexedDB',
      databasesCount: n => `${n} base(s) de données`,
      storesLabel: 'Magasins :',
      recordsLabel: 'Enregistrements :',
      clearRecordAria: "Effacer l'enregistrement",
      storeKeyLabel: (store, key) => `Magasin : ${store} | Clé : ${key}`,

      currentAccountHeading: 'Compte actuel',
      currentAccountDescription: 'Voici le compte actuellement connecté.',
      noAccounts: 'Aucun compte trouvé sur cet appareil.',
      currentBadge: 'Actuel',
      usernameLabel: username => `Nom d'utilisateur : ${username}`,
      deleteAccountAria: 'Supprimer le compte',

      sessionHeading: 'Garder ma session active',
      sessionDescription:
        "Définissez la durée pendant laquelle votre session doit rester active sans demande de clé d'accès. Une fois expirée, votre prochaine visite vous demandera une fois votre biométrie/code PIN et démarrera une nouvelle session — c'est donc aussi la fréquence à laquelle vous vous réauthentifiez. Ce paramètre s'applique uniquement aux modes STANDARD et YOLO. Les modes STRICT et PRIMARY exigent toujours une authentification à chaque fois et n'utilisent pas de sessions persistantes.",
      noStoredSessionText:
        "Aucune session stockée sur cet appareil. Votre authentificateur ne semble pas prendre en charge l'extension WebAuthn PRF, requise par w3pk pour maintenir les sessions actives de manière sécurisée. Votre session restera uniquement en mémoire : elle se termine à la fermeture de l'onglet, et chaque visite vous demandera votre biométrie/code PIN. Tout le reste fonctionne normalement.",
      sessionDurationLabel: 'Durée de la session',
      dayLabel: n => `${n} jour${n > 1 ? 's' : ''}`,
      oneDayLabel: '1 jour',
      thirtyDaysLabel: '30 jours',
      sessionHowItWorksTitle: 'Comment ça marche :',
      sessionHowItWorksText:
        "Chaque fois que vous vous connectez avec votre biométrie/code PIN, votre authentificateur libère un secret matériel (extension WebAuthn PRF) qui chiffre votre session sur cet appareil — rien de ce qui est stocké sur le disque ne peut recréer cette clé. Le compte à rebours redémarre à chaque connexion réelle : avec une durée de 7 jours, vous connecter aujourd'hui vous maintient connecté jusqu'à 7 jours à partir d'aujourd'hui, moment où il vous sera demandé une fois de vous authentifier et où la session sera rechiffrée avec une nouvelle clé.",

      walletBackupHeading: 'Sauvegarde du portefeuille',
      walletBackupDescription:
        "Créez des sauvegardes chiffrées de votre portefeuille pour ne jamais perdre l'accès",
      currentAccountBackupHeading: 'Compte actuel',
      loggedInAsLabel: 'Connecté en tant que :',
      loadingAddressesText: 'Chargement des adresses...',
      index0Label: 'Adresse index #0 :',
      mainAddressLabel:
        "Adresse spécifique à l'origine, mode STANDARD, étiquetée MAIN (portefeuille par défaut) :",
      loadingText: 'Chargement...',
      securityStatusHeading: 'État de la sécurité',
      checkingStatusText: "Vérification de l'état de la sauvegarde...",
      refreshHeading: "Actualiser l'état de la sauvegarde",
      refreshDescription:
        'Recharger votre score de sécurité actuel et les recommandations de sauvegarde',
      checkingText: 'Vérification...',
      refreshButton: "Actualiser l'état",
      createHeading: 'Créer une sauvegarde',
      createDescription:
        'Téléchargez un fichier de sauvegarde chiffré protégé par votre mot de passe',
      creatingText: 'Création en cours...',
      createButton: 'Créer une sauvegarde',
      restoreHeadingCard: 'Restaurer depuis une sauvegarde',
      restoreDescriptionCard:
        "Restaurez votre portefeuille à partir d'un fichier de sauvegarde chiffré",
      restoreButtonCard: 'Restaurer la sauvegarde',
      aboutBackupHeading: 'À propos de la sauvegarde côté client',
      aboutBackupPara1:
        "Le secret principal de votre portefeuille (la phrase mnémonique) est généré et chiffré entièrement sur votre appareil. Le processus de sauvegarde récupère ces données chiffrées depuis le stockage local de votre navigateur à l'aide de votre mot de passe, puis les regroupe dans un fichier sécurisé à télécharger.",
      aboutBackupPara2:
        "La clé de chiffrement de votre portefeuille est dérivée à partir d'une signature WebAuthn, qui nécessite votre authentification biométrique (empreinte digitale, reconnaissance faciale) ou le code PIN de l'appareil. Cela signifie que même si quelqu'un accède aux données chiffrées stockées dans votre navigateur, il ne pourra pas les déchiffrer sans votre appareil physique et votre authentification.",
      aboutBackupPara3:
        "Votre fichier de sauvegarde est chiffré avec AES-256-GCM à l'aide d'une clé dérivée du mot de passe que vous fournissez. Conservez ce fichier en lieu sûr et n'oubliez pas votre mot de passe.",
      aboutBackupWarning:
        "Si vous perdez l'accès à votre appareil, votre clé d'accès ET le fichier de sauvegarde/mot de passe, votre portefeuille ne pourra pas être récupéré.",

      socialRecoveryHeading: 'Récupération sociale',
      socialRecoveryDescription:
        'Répartissez la récupération de votre portefeuille entre des gardiens de confiance grâce au partage de secret de Shamir',
      setupHeading: 'Configurer la récupération sociale',
      setupDescription: (threshold, count) =>
        `Ajoutez des gardiens de confiance qui vous aideront à récupérer votre portefeuille. Vous aurez besoin de ${threshold} gardiens sur ${count || '?'} pour la récupération.`,
      guardianNameLabel: 'Nom du gardien *',
      guardianEmailLabel: 'E-mail du gardien (facultatif)',
      addGuardianButton: 'Ajouter un gardien',
      guardiansListHeading: n => `Gardiens (${n})`,
      removeGuardianAria: 'Supprimer le gardien',
      thresholdLabel: (threshold, count) => `Seuil de récupération : ${threshold} sur ${count}`,
      thresholdDescription: 'Nombre de gardiens nécessaires pour récupérer votre portefeuille',
      setupSocialRecoveryButton: (threshold, count) =>
        `Configurer la récupération sociale (${threshold} sur ${count || '?'})`,
      howItWorksRecoveryInfo: (count, threshold) =>
        `Comment ça marche : la récupération de votre portefeuille sera divisée en ${count || '?'} parts chiffrées grâce au partage de secret de Shamir. Vous aurez besoin de ${threshold} gardiens pour combiner leurs parts et récupérer votre portefeuille. Aucun gardien ne peut accéder seul à votre portefeuille.`,
      recoverWalletHeading: 'Récupérer le portefeuille',
      hideButton: 'Masquer',
      showButton: 'Afficher',
      recoverDescription:
        "Vous avez perdu l'accès à votre portefeuille ? Rassemblez les parts des gardiens pour le récupérer.",
      shareCodeLabel: 'Code de part du gardien',
      sharePlaceholder:
        'Collez ici le JSON de la part du gardien (ex. : {"guardianId":"...","share":"..."})',
      addShareButton: 'Ajouter la part',
      uploadFileButton: 'Importer un fichier',
      clearAllButton: 'Tout effacer',
      collectedSharesHeading: n => `Parts collectées (${n})`,
      guardianFallback: 'Gardien',
      shareIndexLabel: n => `(#${n})`,
      addedAtLabel: time => `Ajouté ${time}`,
      removeShareAria: 'Supprimer la part',
      invalidShareLabel: n => `Part invalide #${n}`,
      progressHeading: 'Progression de la récupération',
      progressText: n =>
        `${n} part(s) collectée(s). Vous avez besoin d'au moins 2 parts pour tenter la récupération.`,
      recoveringText: 'Récupération en cours...',
      recoverButton: n => `Récupérer le portefeuille (${n} parts)`,
      importantWarning:
        'Important : assurez-vous que les parts proviennent des bons gardiens. Des parts invalides feront échouer la récupération.',
      activeHeading: 'Récupération sociale active',
      activeDescription: (threshold, count) =>
        `Votre portefeuille est protégé par une récupération à ${threshold} gardiens sur ${count}`,
      generateInviteButton: 'Générer une invitation',
      removeConfigQuestion:
        'Tous les gardiens ont-ils leur part ? Vous pouvez désormais supprimer la configuration des gardiens du stockage local. Les parts sont conservées en sécurité chez vos gardiens et peuvent être utilisées à tout moment pour la récupération.',
      removeConfigButton: 'Effacer la configuration des gardiens du stockage local',
      invitationHeading: 'Invitation du gardien',
      downloadInviteButton: "Télécharger l'invitation",
      sendInviteText: name => `Envoyez cette invitation à ${name} via un canal sécurisé`,

      deviceSyncHeading: 'Synchronisation des appareils',
      deviceSyncDescription:
        "Votre clé d'accès se synchronise automatiquement entre vos appareils grâce aux services de la plateforme",
      qrHeading: 'QR code de synchronisation',
      qrDescription:
        'Générez un QR code contenant les adresses de votre portefeuille pour synchroniser ou vérifier facilement les informations de votre compte sur un autre appareil.',
      generateQrButton: 'Générer le QR code de synchronisation',
      qrNote:
        'Remarque : ce QR code contient uniquement les adresses publiques de votre portefeuille. Il ne contient PAS vos clés privées ni votre phrase de récupération. Utilisez-le pour vérifier votre compte sur un autre appareil.',
      hideQrButton: 'Masquer le QR code',
      verifyHeading: 'Vérifier les données du QR code',
      verifyDescription:
        "Collez la chaîne JSON issue d'un QR code scanné pour vérifier les adresses du portefeuille.",
      verifyPlaceholder:
        'Collez les données JSON ici (ex. : {"username":"...","ethereumAddress":"..."})',
      errorLabel: 'Erreur :',
      parsedDataLabel: 'Données analysées :',
      usernameFieldLabel: "Nom d'utilisateur :",
      ethAddressLabel: 'Adresse Ethereum :',
      index0FieldLabel: 'Index #0 :',
      mainTaggedLabel: 'Étiqueté MAIN :',
      openbarTaggedLabel: 'Étiqueté OPENBAR :',
      generatedLabel: 'Généré :',
      linkWalletButton: "Lier ce portefeuille à votre compte à clé d'accès",
      linkExplanation:
        "Ce qui se passe lors de la liaison : les adresses du portefeuille seront enregistrées à la fois dans localStorage et IndexedDB, créant un lien persistant entre votre compte à clé d'accès et ce portefeuille HD. Cela vous permet de vérifier ou de synchroniser les données du portefeuille entre vos appareils.",
      howQrWorksHeading: 'Comment fonctionne la synchronisation du portefeuille par QR code',
      qrStep1:
        'Étape 1 : générer le QR code - Sur votre appareil principal, générez un QR code contenant les adresses publiques de votre portefeuille. Ce QR code peut être partagé sans risque car il ne contient que des informations publiques.',
      qrStep2:
        "Étape 2 : scanner et vérifier - Sur votre appareil secondaire, scannez le QR code avec n'importe quelle application de scan, ou copiez manuellement les données JSON affichées dans le QR code.",
      qrStep3:
        "Étape 3 : lier les portefeuilles - Collez les données JSON dans la zone de vérification ci-dessus et cliquez sur « Lier ce portefeuille ». Cela crée une connexion persistante entre votre compte à clé d'accès et les adresses du portefeuille HD.",
      whatGetsStored:
        'Ce qui est stocké : seules les adresses publiques du portefeuille sont stockées dans localStorage et IndexedDB. Vos clés privées et votre phrase de récupération restent sécurisées et ne sont jamais transmises ni stockées via ce mécanisme de synchronisation.',
      platformSyncHeading: "Synchronisation des clés d'accès par plateforme",
      platformSyncIntro:
        "Vos identifiants de clé d'accès se synchronisent automatiquement entre vos appareils au sein du même écosystème :",
      appleSyncNote: 'Apple : synchronisation via iCloud Keychain (iPhone, iPad, Mac)',
      googleSyncNote: 'Google : synchronisation via Password Manager (Android, Chrome)',
      windowsSyncNote:
        "Windows Hello : spécifique à l'appareil, utilisez une sauvegarde chiffrée pour les nouveaux appareils",
      hardwareSyncNote:
        'Clés matérielles : pas de synchronisation, conservez une sauvegarde chiffrée séparément',
      crossPlatformNote:
        "Limitation multiplateforme : les clés d'accès ne se synchronisent pas entre différents écosystèmes (par exemple, d'iPhone vers Android). En revanche, les sauvegardes chiffrées sont entièrement multiplateformes - vous pouvez restaurer votre portefeuille sur n'importe quel appareil avec le fichier de sauvegarde et le mot de passe, quelle que soit la plateforme d'origine.",
      bestPracticesHeading: 'Bonnes pratiques',
      practiceBackupFirst:
        'Créez toujours une sauvegarde chiffrée avant de synchroniser avec un nouvel appareil',
      practiceVerifyAddresses:
        'Vérifiez que les adresses du portefeuille correspondent après la synchronisation',
      practiceUseDebugTools:
        "Utilisez les outils de débogage et d'inspection du stockage pour vérifier que les données de synchronisation ont été correctement enregistrées",
      practiceNeverShareQr:
        'Ne partagez jamais votre QR code publiquement ou sur des canaux non fiables',
      practiceTreatAsSensitive:
        'Les QR codes ne contiennent que des adresses publiques, mais doivent tout de même être traités comme des informations sensibles sur le compte',

      createBackupModalTitle: 'Entrez le mot de passe pour créer la sauvegarde',
      createBackupModalDescription:
        'Veuillez entrer votre mot de passe pour créer la sauvegarde. Ceci est requis par le SDK w3pk pour accéder à vos données de portefeuille chiffrées.',
      restoreBackupModalTitle: 'Entrez le mot de passe pour restaurer la sauvegarde',
      restoreBackupModalDescription:
        'Veuillez entrer le mot de passe que vous avez utilisé lors de la création de ce fichier de sauvegarde.',
      chooseUsernameModalTitle: "Choisissez un nom d'utilisateur pour le portefeuille restauré",
      chooseUsernameModalDescription:
        "Aucun identifiant existant trouvé sur cet appareil. Veuillez choisir un nom d'utilisateur pour inscrire votre portefeuille restauré avec une nouvelle clé d'accès.",
      usernameFormatError:
        "Le nom d'utilisateur doit comporter entre 3 et 50 caractères alphanumériques, avec tirets bas/tirets autorisés, et commencer/se terminer par un caractère alphanumérique.",
      restoringRegisteringText: 'Restauration et inscription en cours...',
      restoreRegisterButton: 'Restaurer et inscrire',
      removeAccountModalTitle: 'Supprimer le compte',
      removeAccountConfirm: username =>
        `Êtes-vous sûr de vouloir supprimer le compte ${username} ?`,
      removeAccountWarning:
        "Avertissement : cette action supprimera toutes les données de ce compte sur cet appareil. Assurez-vous d'avoir une sauvegarde avant de continuer. Cette action est irréversible.",
      removeAccountLoggedOutNote:
        "Il s'agit de votre compte actuellement connecté. Vous serez déconnecté après la suppression.",
      removeAccountButton: 'Supprimer le compte',
      localStorageModalTitle: 'Inspection de LocalStorage',
      foundItemsText: n => `${n} éléments trouvés dans localStorage`,
      noDataFound: 'Aucune donnée trouvée',
      indexedDBModalTitle: 'Inspection de IndexedDB',
      foundDatabasesText: n => `${n} base(s) de données trouvée(s)`,
      noDatabasesFound: 'Aucune base de données liée à w3pk trouvée',

      registrationSuccessTitle: 'Inscription réussie',
      registrationSuccessDescription: 'Votre nouveau compte a été créé.',
      registrationFailedTitle: "Échec de l'inscription",
      registrationFailedDefaultDescription:
        "Impossible de terminer l'inscription. Veuillez réessayer.",
      localStorageInspectedTitle: 'LocalStorage inspecté',
      localStorageInspectedDescription: n =>
        `${n} éléments trouvés. Faites défiler vers le bas pour voir les résultats.`,
      genericErrorTitle: 'Erreur',
      failedInspectLocalStorage: "Échec de l'inspection de localStorage",
      indexedDBInspectedTitle: 'IndexedDB inspecté',
      indexedDBInspectedDescription: (dbCount, recordCount) =>
        `${dbCount} base(s) de données trouvée(s) avec ${recordCount} enregistrement(s). Faites défiler vers le bas pour voir les résultats.`,
      failedInspectIndexedDB: "Échec de l'inspection de IndexedDB",
      itemClearedTitle: 'Élément effacé',
      itemClearedDescription: key => `« ${key} » supprimé de localStorage`,
      failedClearItem: key => `Échec de la suppression de « ${key} »`,
      recordClearedTitle: 'Enregistrement effacé',
      recordClearedDescription: (db, store) => `Enregistrement supprimé de ${db}/${store}`,
      failedClearRecord: "Échec de la suppression de l'enregistrement",
      errorLoadingAddressesTitle: 'Erreur lors du chargement des adresses',
      failedDeriveAddresses: 'Échec de la dérivation des adresses du portefeuille',
      errorLoadingBackupStatusTitle: "Erreur lors du chargement de l'état de la sauvegarde",
      failedCheckSecurityStatus: "Échec de la vérification de l'état de sécurité",
      accountRemovedTitle: 'Compte supprimé',
      accountRemovedDescription: username =>
        `Le compte ${username} a été supprimé de cet appareil.`,
      loggingOutTitle: 'Déconnexion en cours',
      loggingOutDescription: 'Vous avez supprimé votre compte actuel. Déconnexion en cours...',
      failedRemoveAccount: 'Échec de la suppression du compte. Veuillez réessayer.',
      errorReadingFileTitle: 'Erreur lors de la lecture du fichier',
      failedReadBackupFile: 'Échec de la lecture du fichier de sauvegarde',
      noBackupFileSelectedTitle: 'Aucun fichier de sauvegarde sélectionné',
      incompatibleBackupTitle: 'Version de sauvegarde incompatible',
      incompatibleBackupDescription:
        'Cette sauvegarde a été créée avec une ancienne version de w3pk. Veuillez créer une nouvelle sauvegarde avec la version actuelle.',
      walletRestoredTitle: 'Portefeuille restauré !',
      walletRestoredDescription: address =>
        `Portefeuille restauré et remplacé avec succès : ${address}`,
      usernameRequiredRestoreDescription:
        "Veuillez entrer un nom d'utilisateur pour l'inscrire avec le portefeuille restauré.",
      walletRestoredRegisteredTitle: 'Portefeuille restauré et inscrit !',
      walletRestoredRegisteredDescription: address =>
        `Portefeuille restauré et inscrit avec succès : ${address}`,
      securityReportGeneratedTitle: 'Rapport de sécurité généré',
      securityReportGeneratedDescription: "Consultez l'analyse détaillée ci-dessous",
      inspectionFailedTitle: "Échec de l'inspection",
      inspectionFailedDescription:
        "L'inspection de l'application hôte n'a pas fonctionné. C'est probablement dû à la limite de requêtes Anthropic atteinte.",
      backupStatusRetrievedTitle: 'État de la sauvegarde récupéré.',
      errorRetrievingStatusTitle: "Erreur lors de la récupération de l'état.",
      unexpectedErrorDescription: "Une erreur inattendue s'est produite.",
      errorCreatingBackupTitle: 'Erreur lors de la création de la sauvegarde.',
      backupCreatedTitle: 'Sauvegarde créée avec succès !',
      invalidInputTitle: 'Saisie invalide',
      guardianNameRequiredDescription: 'Le nom du gardien est requis',
      notEnoughGuardiansTitle: 'Pas assez de gardiens',
      notEnoughGuardiansDescription:
        "Vous avez besoin d'au moins 2 gardiens pour configurer la récupération sociale",
      invalidThresholdTitle: 'Seuil invalide',
      invalidThresholdDescription: 'Le seuil ne peut pas être supérieur au nombre de gardiens',
      socialRecoveryConfiguredTitle: 'Récupération sociale configurée !',
      socialRecoveryConfiguredDescription: (threshold, count) =>
        `Récupération à ${threshold} gardiens sur ${count} configurée avec succès`,
      pleasePasteShareDescription: 'Veuillez coller un code de part de gardien',
      duplicateShareTitle: 'Part en double',
      duplicateShareDescription: 'Cette part de gardien a déjà été ajoutée',
      shareAddedTitle: 'Part ajoutée',
      shareAddedDescription: name => `Part de ${name} ajoutée`,
      invalidShareFormatTitle: 'Format de part invalide',
      invalidShareFormatDescription:
        'Veuillez coller un code de part de gardien valide (format JSON)',
      notEnoughSharesTitle: 'Pas assez de parts',
      notEnoughSharesDescription:
        "Vous avez besoin d'au moins 2 parts de gardien pour récupérer votre portefeuille",
      passwordRequiredRecoveryDescription:
        'Vous devez entrer votre mot de passe pour déchiffrer le fichier de sauvegarde',
      usernameRequiredRecoveryDescription:
        "Vous devez fournir un nom d'utilisateur pour inscrire votre portefeuille récupéré",
      walletRecoveredTitle: 'Portefeuille récupéré avec succès !',
      walletRecoveredDescription: address =>
        `Votre portefeuille a été récupéré et inscrit avec une nouvelle clé d'accès : ${address}`,
      fileLoadedTitle: 'Fichier chargé',
      fileLoadedDescription:
        "Part de gardien chargée depuis le fichier. Cliquez sur « Ajouter la part » pour l'ajouter.",
      failedReadGuardianFile: 'Échec de la lecture du fichier de part de gardien',
      cannotSaveTitle: "Impossible d'enregistrer",
      cannotSaveDescription: 'Données QR invalides ou utilisateur non authentifié',
      walletLinkedTitle: 'Portefeuille lié avec succès !',
      walletLinkedDescription: address =>
        `Portefeuille ${address} lié à votre compte à clé d'accès`,
      errorSavingLinkTitle: "Erreur lors de l'enregistrement du lien du portefeuille",
      failedSaveSyncData:
        "Échec de l'enregistrement des données de synchronisation du portefeuille",
      recoveryPasswordPrompt:
        "Entrez le mot de passe que vous avez défini lors de la configuration de la récupération sociale.\n\nCe mot de passe n'a PAS été partagé avec les gardiens - vous l'avez défini lors de la configuration.",
      recoveryUsernamePrompt: address =>
        `Choisissez un nom d'utilisateur pour votre nouvelle inscription de clé d'accès.\n\nRécupération du portefeuille : ${address}`,
    },
    header: {
      registerTitle: 'Créer un nouveau compte',
      walletInfoText:
        'Un portefeuille Ethereum sera créé et stocké en toute sécurité sur votre appareil, protégé par votre biométrie ou votre code PIN grâce à',
      usernameLabel: "Nom d'utilisateur",
      usernamePlaceholder: "Entrez votre nom d'utilisateur",
      usernameError:
        "Le nom d'utilisateur doit comporter entre 3 et 50 caractères et ne contenir que des lettres, chiffres, tirets bas et tirets. Il doit commencer et se terminer par une lettre ou un chiffre.",
      createAccount: 'Créer un compte',
      optionsAriaLabel: 'Options',
      mainNavAriaLabel: 'Navigation principale',
      usernameRequiredTitle: "Nom d'utilisateur requis",
      usernameRequiredDescription: "Veuillez entrer un nom d'utilisateur pour vous inscrire.",
      noAccountFoundTitle: 'Aucun compte trouvé',
      noAccountFoundDescription:
        "Aucune clé d'accès trouvée. Veuillez vous inscrire pour créer un nouveau compte.",
      alreadyRegisteredLink: 'Je suis déjà inscrit sur un autre appareil',
    },
    passwordModal: {
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Entrez votre mot de passe',
      passwordRequiredTitle: 'Mot de passe requis.',
      passwordRequiredDescription: 'Veuillez entrer votre mot de passe.',
      weakPasswordTitle: 'Mot de passe faible.',
      weakPasswordDescription:
        'Veuillez utiliser un mot de passe plus fort qui répond à toutes les exigences.',
      submissionErrorTitle: 'Erreur de soumission.',
      submissionErrorDefaultDescription: "Une erreur inattendue s'est produite.",
      requirementsNotMet: 'Le mot de passe ne répond pas à toutes les exigences',
      strongPassword: 'Mot de passe robuste !',
      mustInclude: 'Le mot de passe doit inclure :',
      reqMinLength: 'Au moins 12 caractères',
      reqUpperCase: 'Une lettre majuscule',
      reqLowerCase: 'Une lettre minuscule',
      reqNumber: 'Un chiffre',
      reqSpecialChar: 'Un caractère spécial',
      satisfied: ' (satisfait)',
      required: ' (requis)',
      submit: 'Soumettre',
    },
    about: {
      headingPrefix: 'À propos',
      introPart1:
        "w3pk est un SDK d'authentification Web3 sans mot de passe, doté de portefeuilles chiffrés et de fonctionnalités de confidentialité. Vous pouvez l'utiliser dans n'importe quelle application web JS/TS (Next.js, Vue, Angular, Svelte, …).",
      introPart2:
        "est un modèle d'application Next.js, n'hésitez pas à le forker et à construire ce que vous voulez !",
      emailBoxText:
        'w3pk est en cours de développement. Recevez des e-mails lorsque nous publions de nouvelles fonctionnalités (support EIP-1193, capacités IA, aides Viem, abstraction de chaîne, et plus encore)',
      emailPlaceholder: 'your@email.com',
      subscribeButton: "S'abonner",
      githubLabel: 'GitHub',
      npmLabel: 'NPM',
      githubAriaLabel: 'Voir w3pk sur GitHub (ouvre un nouvel onglet)',
      npmAriaLabel: 'Voir w3pk sur NPM (ouvre un nouvel onglet)',
      codeRegisterComment: '// Inscription',
      codeLoginComment: '// Connexion',
      codeLogoutComment: '// Déconnexion',
      featuresHeading: 'Fonctionnalités',
      feature1: 'Authentification sans mot de passe (WebAuthn/FIDO2)',
      feature2:
        "Isolation des clés spécifique à l'origine avec contrôle d'accès basé sur des étiquettes",
      feature3: 'Gestion des sessions (en mémoire + persistance optionnelle)',
      feature4: 'Génération de portefeuille HD (BIP39/BIP44)',
      feature5: 'Dérivation multi-adresses avec modes de sécurité (STANDARD/STRICT/YOLO)',
      feature6: 'Plusieurs méthodes de signature (EIP-191, SIWE/EIP-4361, EIP-712, rawHash)',
      feature7:
        'Envoi de transactions on-chain avec résolution RPC automatique (`sendTransaction`)',
      feature8: 'Fournisseur EIP-1193 pour ethers, viem, wagmi, RainbowKit (`getEIP1193Provider`)',
      feature9: 'Adresses furtives ERC-5564 (activation facultative)',
      feature10:
        'Primitives ZK (génération et vérification de preuves à divulgation nulle de connaissance)',
      feature11: 'Support Chainlist (plus de 2390 réseaux)',
      feature12: 'Détection de réseau EIP-7702 (plus de 329 réseaux)',
      feature13:
        'Intégration de portefeuille externe (déléguer MetaMask/Ledger à w3pk via EIP-7702)',
      feature14: "Mode PRIMARY EIP-7951 (signature par clé d'accès P-256)",
      feature15: 'Vérification de build (hachage CID IPFS + registre onchain maintenu par une DAO)',
      feature16:
        "Sauvegarde et récupération à trois niveaux (synchronisation des clés d'accès, sauvegardes chiffrées, récupération sociale)",
      feature17: "Inspection de l'application hôte assistée par IA",
      invalidEmailTitle: 'E-mail invalide',
      invalidEmailDescription: 'Veuillez entrer une adresse e-mail valide',
      subscribeSuccessTitle: 'Succès !',
      subscribeSuccessDescription: 'Vous êtes désormais abonné aux mises à jour de w3pk',
      subscribeErrorTitle: 'Erreur',
      subscribeErrorDescription: "Échec de l'abonnement. Veuillez réessayer.",
    },
  },

  // Arabic
  ar: {
    common: {
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      pleaseLogin: 'الرجاء تسجيل الدخول',
      cancel: 'إلغاء',
      srLoadingText: 'جارٍ التحميل، يرجى الانتظار...',
      loading: 'جارٍ التحميل...',
      notAvailable: 'غير متاح',
      close: 'إغلاق',
    },
    home: {
      title: 'مرحباً!',
      subtitle: 'يسعدنا وجودك هنا!',
      greeting: 'مرحبا أيها المجهول!',
      greetingSubtitle: 'استرخ وابنِ شيئاً رائعاً!',
      signMessage: 'توقيع رسالة',
      messageSignedTitle: 'تم توقيع الرسالة',
      messageSignedDescription: signature => `التوقيع: ${signature.substring(0, 20)}...`,
    },
    navigation: {
      about: 'حول',
      settings: 'الإعدادات',
    },
    settings: {
      title: 'الإعدادات',
      loginRequired: 'يرجى تسجيل الدخول للوصول إلى إعداداتك',
      subtitle: 'إدارة حساباتك ونسخك الاحتياطية وخيارات الاسترداد',
      tabAccounts: 'الحسابات',
      tabBackup: 'النسخ الاحتياطي',
      tabSync: 'المزامنة',
      tabRecovery: 'الاسترداد الاجتماعي',

      browserInfoHeading: 'معلومات المتصفح',
      browserLabel: 'المتصفح:',
      versionLabel: 'الإصدار:',
      osLabel: 'نظام التشغيل:',
      webauthnSupportLabel: 'دعم WebAuthn:',
      compatibilityLabel: 'التوافق:',
      available: 'متاح',
      notAvailable: 'غير متاح',
      fullySupported: 'مدعوم بالكامل',
      knownIssues: 'مشاكل معروفة',
      notSupported: 'غير مدعوم',
      browserNotSupportedTitle: 'المتصفح غير مدعوم',
      knownIssuesTitle: 'تم اكتشاف مشاكل معروفة',
      recommendationTitle: 'التوصية',
      webauthnNotAvailableTitle: 'WebAuthn غير متاح',
      webauthnNotAvailableText:
        'متصفحك لا يدعم WebAuthn، وهو مطلوب لمصادقة w3pk. يرجى تحديث متصفحك أو استخدام متصفح مدعوم:',
      browserChrome: 'Chrome 67+ (مايو 2018)',
      browserFirefox: 'Firefox 60+ (مايو 2018)',
      browserSafari: 'Safari 14+ (سبتمبر 2020)',
      browserEdge: 'Edge 18+ (نوفمبر 2018)',
      browserSamsung: 'Samsung Internet 11+ (فبراير 2020)',
      androidRecommendedHeading: 'المتصفحات الموصى بها لنظام Android',
      samsungInternetNote: 'Samsung Internet (الأفضل لأجهزة Samsung) - ✅ يعمل بشكل مؤكد',
      chromeNote: 'Chrome - ✅ موثوق',
      edgeNote: 'Edge - ✅ موثوق',
      firefoxMobileNote: 'Firefox Mobile - ⚠️ تجنبه (مشاكل معروفة في استمرارية مفتاح المرور)',

      restoreBackupHeading: 'الاستعادة من نسخة احتياطية',
      restoreBackupDescription:
        'إذا كان لديك ملف نسخة احتياطية، يمكنك استعادة محفظتك دون تسجيل الدخول أولاً.',
      restoreBackupSyncHint:
        'للمزامنة مع جهاز آخر: سجّل الدخول على جهازك الآخر، انتقل إلى الإعدادات ← إنشاء نسخة احتياطية لتنزيل ملف نسخة احتياطية مشفّر، ثم قم برفعه هنا وأدخل نفس كلمة المرور.',
      restoringText: 'جارٍ الاستعادة...',
      restoreBackupButton: 'الاستعادة من ملف النسخة الاحتياطية',

      debugStorageHeading: 'تصحيح وفحص التخزين',
      debugStorageDescription: 'فحص تخزين المتصفح وسجلات النشاط',
      inspectingText: 'جارٍ الفحص...',
      inspectLocalStorageButton: 'فحص LocalStorage',
      inspectIndexedDBButton: 'فحص IndexedDB',

      inspectSecurityDescriptionSmall: 'تحليل هذا التطبيق لطرق المعاملات والتوقيع.',
      inspectSecurityButton: 'فحص الأمان',
      consoleCommandLabel: 'أمر وحدة التحكم:',
      clearReportButton: 'مسح التقرير',
      filesAnalyzedLabel: 'الملفات التي تم تحليلها:',
      inspectionHeadingBig: 'فحص الأمان',
      inspectSecurityDescriptionBig:
        'إنشاء تقرير أمني شامل لهذا التطبيق. سيحلل التقرير جميع طرق المعاملات والتوقيع.',
      inspectNowButton: 'افحص الآن',
      consoleHintText: 'يمكنك أيضاً تشغيل await w3pk.inspectNow() في وحدة تحكم المتصفح',
      securityReportHeading: 'تقرير الأمان',
      appUrlLabel: 'رابط التطبيق:',

      localStorageResultsHeading: 'نتائج LocalStorage',
      itemsCount: n => `${n} عنصر`,
      encryptedBadge: 'مشفّر',
      clearItemAria: 'مسح العنصر',
      indexedDBResultsHeading: 'نتائج IndexedDB',
      databasesCount: n => `${n} قاعدة بيانات`,
      storesLabel: 'المخازن:',
      recordsLabel: 'السجلات:',
      clearRecordAria: 'مسح السجل',
      storeKeyLabel: (store, key) => `المخزن: ${store} | المفتاح: ${key}`,

      currentAccountHeading: 'الحساب الحالي',
      currentAccountDescription: 'هذا هو الحساب الذي قمت بتسجيل الدخول إليه حالياً.',
      noAccounts: 'لم يتم العثور على حسابات على هذا الجهاز.',
      currentBadge: 'الحالي',
      usernameLabel: username => `اسم المستخدم: ${username}`,
      deleteAccountAria: 'حذف الحساب',

      sessionHeading: 'إبقاء جلستي نشطة',
      sessionDescription:
        'حدد المدة التي تظل خلالها جلستك نشطة دون طلب مفتاح المرور. عند انتهائها، ستطلب زيارتك التالية بصمتك البيومترية/رمز PIN مرة واحدة وتبدأ جلسة جديدة — وهذا يحدد أيضاً وتيرة إعادة المصادقة. ينطبق هذا الإعداد فقط على وضعي STANDARD وYOLO. تتطلب وضعا STRICT وPRIMARY دائماً مصادقة جديدة ولا يستخدمان جلسات دائمة.',
      noStoredSessionText:
        'لا توجد جلسة مخزنة على هذا الجهاز. يبدو أن جهاز المصادقة الخاص بك لا يدعم امتداد WebAuthn PRF، الذي يحتاجه w3pk للحفاظ على الجلسات نشطة بأمان. ستبقى جلستك في الذاكرة فقط: تنتهي عند إغلاق التبويب، وستطلب كل زيارة بصمتك البيومترية/رمز PIN. كل شيء آخر يعمل بشكل طبيعي.',
      sessionDurationLabel: 'مدة الجلسة',
      dayLabel: n => `${n} يوم`,
      oneDayLabel: 'يوم واحد',
      thirtyDaysLabel: '30 يوماً',
      sessionHowItWorksTitle: 'كيف يعمل:',
      sessionHowItWorksText:
        'في كل مرة تسجل فيها الدخول ببصمتك البيومترية/رمز PIN، يصدر جهاز المصادقة الخاص بك سراً مدعوماً بالأجهزة (امتداد WebAuthn PRF) يقوم بتشفير جلستك على هذا الجهاز — ولا يمكن لأي شيء مخزن على القرص إعادة إنشاء هذا المفتاح. يبدأ العد التنازلي من جديد عند كل تسجيل دخول فعلي: مع مدة 7 أيام، يبقيك تسجيل الدخول اليوم متصلاً حتى مرور 7 أيام من اليوم، حيث سيُطلب منك ذلك مرة واحدة ويُعاد تشفير الجلسة بمفتاح جديد.',

      walletBackupHeading: 'النسخ الاحتياطي للمحفظة',
      walletBackupDescription:
        'أنشئ نسخاً احتياطية مشفّرة لمحفظتك لضمان عدم فقدان الوصول إليها أبداً',
      currentAccountBackupHeading: 'الحساب الحالي',
      loggedInAsLabel: 'تم تسجيل الدخول باسم:',
      loadingAddressesText: 'جارٍ تحميل العناوين...',
      index0Label: 'عنوان الفهرس #0:',
      mainAddressLabel: 'عنوان خاص بالمصدر، وضع STANDARD، بعلامة MAIN (المحفظة الافتراضية):',
      loadingText: 'جارٍ التحميل...',
      securityStatusHeading: 'حالة الأمان',
      checkingStatusText: 'جارٍ التحقق من حالة النسخ الاحتياطي...',
      refreshHeading: 'تحديث حالة النسخ الاحتياطي',
      refreshDescription: 'إعادة تحميل درجة أمانك الحالية وتوصيات النسخ الاحتياطي',
      checkingText: 'جارٍ التحقق...',
      refreshButton: 'تحديث الحالة',
      createHeading: 'إنشاء نسخة احتياطية',
      createDescription: 'قم بتنزيل ملف نسخة احتياطية مشفّر ومحمي بكلمة مرورك',
      creatingText: 'جارٍ الإنشاء...',
      createButton: 'إنشاء نسخة احتياطية',
      restoreHeadingCard: 'الاستعادة من نسخة احتياطية',
      restoreDescriptionCard: 'استعد محفظتك من ملف نسخة احتياطية مشفّر',
      restoreButtonCard: 'استعادة النسخة الاحتياطية',
      aboutBackupHeading: 'حول النسخ الاحتياطي من جانب العميل',
      aboutBackupPara1:
        'يتم إنشاء السر الأساسي لمحفظتك (العبارة التذكيرية) وتشفيره بالكامل على جهازك. تسترجع عملية النسخ الاحتياطي هذه البيانات المشفّرة من التخزين المحلي لمتصفحك باستخدام كلمة مرورك، ثم تحزمها في ملف آمن لتنزيله.',
      aboutBackupPara2:
        'يتم اشتقاق مفتاح تشفير محفظتك باستخدام توقيع WebAuthn، الذي يتطلب مصادقتك البيومترية (بصمة الإصبع، مسح الوجه) أو رمز PIN الخاص بالجهاز. هذا يعني أنه حتى لو تمكن شخص ما من الوصول إلى البيانات المشفّرة المخزنة في متصفحك، فلن يتمكن من فك تشفيرها دون جهازك الفعلي ومصادقتك.',
      aboutBackupPara3:
        'يتم تشفير ملف النسخة الاحتياطية باستخدام AES-256-GCM بمفتاح مشتق من كلمة المرور التي تقدمها. احتفظ بهذا الملف بأمان وتذكر كلمة مرورك.',
      aboutBackupWarning:
        'إذا فقدت الوصول إلى جهازك ومفتاح المرور وملف النسخة الاحتياطية/كلمة المرور معاً، فلن يمكن استرداد محفظتك.',

      socialRecoveryHeading: 'الاسترداد الاجتماعي',
      socialRecoveryDescription:
        'وزّع استرداد محفظتك بين أوصياء موثوقين باستخدام مشاركة سر شامير (Shamir Secret Sharing)',
      setupHeading: 'إعداد الاسترداد الاجتماعي',
      setupDescription: (threshold, count) =>
        `أضف أوصياء موثوقين سيساعدونك على استرداد محفظتك. ستحتاج إلى ${threshold} من أصل ${count || '?'} أوصياء للاسترداد.`,
      guardianNameLabel: 'اسم الوصي *',
      guardianEmailLabel: 'البريد الإلكتروني للوصي (اختياري)',
      addGuardianButton: 'إضافة وصي',
      guardiansListHeading: n => `الأوصياء (${n})`,
      removeGuardianAria: 'إزالة الوصي',
      thresholdLabel: (threshold, count) => `حد الاسترداد: ${threshold} من ${count}`,
      thresholdDescription: 'عدد الأوصياء اللازمين لاسترداد محفظتك',
      setupSocialRecoveryButton: (threshold, count) =>
        `إعداد الاسترداد الاجتماعي (${threshold} من ${count || '?'})`,
      howItWorksRecoveryInfo: (count, threshold) =>
        `كيف يعمل: سيتم تقسيم استرداد محفظتك إلى ${count || '?'} حصص مشفّرة باستخدام مشاركة سر شامير. ستحتاج إلى ${threshold} أوصياء لدمج حصصهم لاسترداد محفظتك. لا يمكن لأي وصي بمفرده الوصول إلى محفظتك.`,
      recoverWalletHeading: 'استرداد المحفظة',
      hideButton: 'إخفاء',
      showButton: 'إظهار',
      recoverDescription: 'هل فقدت الوصول إلى محفظتك؟ اجمع حصص الأوصياء لاستردادها.',
      shareCodeLabel: 'رمز حصة الوصي',
      sharePlaceholder:
        'الصق بيانات JSON لحصة الوصي هنا (مثال: {"guardianId":"...","share":"..."})',
      addShareButton: 'إضافة حصة',
      uploadFileButton: 'رفع ملف',
      clearAllButton: 'مسح الكل',
      collectedSharesHeading: n => `الحصص المجمّعة (${n})`,
      guardianFallback: 'وصي',
      shareIndexLabel: n => `(#${n})`,
      addedAtLabel: time => `أُضيفت ${time}`,
      removeShareAria: 'إزالة الحصة',
      invalidShareLabel: n => `حصة غير صالحة #${n}`,
      progressHeading: 'تقدم الاسترداد',
      progressText: n => `تم جمع ${n} حصة. تحتاج إلى حصتين على الأقل لمحاولة الاسترداد.`,
      recoveringText: 'جارٍ الاسترداد...',
      recoverButton: n => `استرداد المحفظة (${n} حصة)`,
      importantWarning:
        'مهم: تأكد من أن الحصص من الأوصياء الصحيحين. ستؤدي الحصص غير الصالحة إلى فشل الاسترداد.',
      activeHeading: 'الاسترداد الاجتماعي مفعّل',
      activeDescription: (threshold, count) =>
        `محفظتك محمية باسترداد ${threshold} من ${count} أوصياء`,
      generateInviteButton: 'إنشاء دعوة',
      removeConfigQuestion:
        'هل حصل جميع الأوصياء على حصصهم؟ يمكنك الآن إزالة إعدادات الأوصياء من التخزين المحلي. الحصص مخزنة بأمان لدى أوصيائك ويمكن استخدامها للاسترداد في أي وقت.',
      removeConfigButton: 'مسح إعدادات الأوصياء من التخزين المحلي',
      invitationHeading: 'دعوة الوصي',
      downloadInviteButton: 'تنزيل الدعوة',
      sendInviteText: name => `أرسل هذه الدعوة إلى ${name} عبر قناة آمنة`,

      deviceSyncHeading: 'مزامنة الأجهزة',
      deviceSyncDescription:
        'تتم مزامنة مفتاح المرور الخاص بك تلقائياً عبر الأجهزة باستخدام خدمات المنصة',
      qrHeading: 'رمز QR للمزامنة',
      qrDescription:
        'أنشئ رمز QR يحتوي على عناوين محفظتك لمزامنة أو التحقق من معلومات حسابك بسهولة على جهاز آخر.',
      generateQrButton: 'إنشاء رمز QR للمزامنة',
      qrNote:
        'ملاحظة: يحتوي رمز QR هذا على عناوين محفظتك العامة فقط. لا يحتوي على مفاتيحك الخاصة أو عبارة الاسترداد. استخدمه للتحقق من حسابك على جهاز آخر.',
      hideQrButton: 'إخفاء رمز QR',
      verifyHeading: 'التحقق من بيانات رمز QR',
      verifyDescription: 'الصق سلسلة JSON من رمز QR الممسوح ضوئياً للتحقق من عناوين المحفظة.',
      verifyPlaceholder: 'الصق بيانات JSON هنا (مثال: {"username":"...","ethereumAddress":"..."})',
      errorLabel: 'خطأ:',
      parsedDataLabel: 'البيانات المحلَّلة:',
      usernameFieldLabel: 'اسم المستخدم:',
      ethAddressLabel: 'عنوان إيثريوم:',
      index0FieldLabel: 'الفهرس #0:',
      mainTaggedLabel: 'بعلامة MAIN:',
      openbarTaggedLabel: 'بعلامة OPENBAR:',
      generatedLabel: 'تاريخ الإنشاء:',
      linkWalletButton: 'ربط هذه المحفظة بحساب مفتاح المرور الخاص بك',
      linkExplanation:
        'ماذا يحدث عند الربط: سيؤدي هذا إلى حفظ عناوين المحفظة في كل من localStorage وIndexedDB، مما ينشئ رابطاً دائماً بين حساب مفتاح المرور الخاص بك ومحفظة HD هذه. يمكنك استخدام ذلك للتحقق من بيانات المحفظة أو مزامنتها عبر الأجهزة.',
      howQrWorksHeading: 'كيف تعمل مزامنة المحفظة عبر رمز QR',
      qrStep1:
        'الخطوة 1: إنشاء رمز QR - على جهازك الأساسي، أنشئ رمز QR يحتوي على العناوين العامة لمحفظتك. رمز QR هذا آمن للمشاركة لأنه يحتوي فقط على معلومات عامة.',
      qrStep2:
        'الخطوة 2: المسح والتحقق - على جهازك الثانوي، امسح رمز QR باستخدام أي تطبيق لمسح رموز QR، أو انسخ يدوياً بيانات JSON المعروضة في رمز QR.',
      qrStep3:
        'الخطوة 3: ربط المحافظ - الصق بيانات JSON في منطقة التحقق أعلاه وانقر على "ربط هذه المحفظة". يؤدي هذا إلى إنشاء اتصال دائم بين حساب مفتاح المرور الخاص بك وعناوين محفظة HD.',
      whatGetsStored:
        'ما الذي يتم تخزينه: يتم تخزين عناوين المحفظة العامة فقط في localStorage وIndexedDB. تبقى مفاتيحك الخاصة وعبارة الاسترداد آمنة ولا يتم إرسالها أو تخزينها أبداً عبر آلية المزامنة هذه.',
      platformSyncHeading: 'مزامنة منصة مفتاح المرور',
      platformSyncIntro:
        'تتم مزامنة بيانات اعتماد مفتاح المرور الخاص بك تلقائياً عبر الأجهزة ضمن نفس النظام البيئي:',
      appleSyncNote: 'Apple: تتم المزامنة عبر iCloud Keychain (iPhone وiPad وMac)',
      googleSyncNote: 'Google: تتم المزامنة عبر Password Manager (Android وChrome)',
      windowsSyncNote: 'Windows Hello: خاص بالجهاز، استخدم نسخة احتياطية مشفّرة للأجهزة الجديدة',
      hardwareSyncNote:
        'المفاتيح الفعلية (Hardware Keys): لا توجد مزامنة، احتفظ بنسخة احتياطية مشفّرة بشكل منفصل',
      crossPlatformNote:
        'قيود التوافق بين المنصات: لا تتم مزامنة مفاتيح المرور عبر الأنظمة البيئية المختلفة (مثل من iPhone إلى Android). ومع ذلك، فإن النسخ الاحتياطية المشفّرة متوافقة تماماً بين المنصات - يمكنك استعادة محفظتك على أي جهاز باستخدام ملف النسخة الاحتياطية وكلمة المرور، بغض النظر عن المنصة الأصلية.',
      bestPracticesHeading: 'أفضل الممارسات',
      practiceBackupFirst: 'أنشئ دائماً نسخة احتياطية مشفّرة قبل المزامنة مع جهاز جديد',
      practiceVerifyAddresses: 'تحقق من تطابق عناوين المحفظة بعد المزامنة',
      practiceUseDebugTools:
        'استخدم أدوات التصحيح وفحص التخزين للتحقق من حفظ بيانات المزامنة بشكل صحيح',
      practiceNeverShareQr: 'لا تشارك رمز QR الخاص بك أبداً علناً أو عبر قنوات غير موثوقة',
      practiceTreatAsSensitive:
        'تحتوي رموز QR على عناوين عامة فقط، لكن تعامل معها مع ذلك كمعلومات حساب حساسة',

      createBackupModalTitle: 'أدخل كلمة المرور لإنشاء نسخة احتياطية',
      createBackupModalDescription:
        'يرجى إدخال كلمة مرورك لإنشاء النسخة الاحتياطية. هذا مطلوب من قبل حزمة w3pk SDK للوصول إلى بيانات محفظتك المشفّرة.',
      restoreBackupModalTitle: 'أدخل كلمة المرور لاستعادة النسخة الاحتياطية',
      restoreBackupModalDescription:
        'يرجى إدخال كلمة المرور التي استخدمتها عند إنشاء ملف النسخة الاحتياطية هذا.',
      chooseUsernameModalTitle: 'اختر اسم مستخدم للمحفظة المستعادة',
      chooseUsernameModalDescription:
        'لم يتم العثور على بيانات اعتماد موجودة على هذا الجهاز. يرجى اختيار اسم مستخدم لتسجيل محفظتك المستعادة بمفتاح مرور جديد.',
      usernameFormatError:
        'يجب أن يتكون اسم المستخدم من 3 إلى 50 حرفاً، ويحتوي على أحرف وأرقام مع شرطات سفلية/شرطات، ويبدأ وينتهي بحرف أو رقم.',
      restoringRegisteringText: 'جارٍ الاستعادة والتسجيل...',
      restoreRegisterButton: 'استعادة وتسجيل',
      removeAccountModalTitle: 'إزالة الحساب',
      removeAccountConfirm: username => `هل أنت متأكد أنك تريد إزالة الحساب ${username}؟`,
      removeAccountWarning:
        'تحذير: سيؤدي هذا إلى حذف جميع بيانات هذا الحساب من هذا الجهاز. تأكد من وجود نسخة احتياطية لديك قبل المتابعة. لا يمكن التراجع عن هذا الإجراء.',
      removeAccountLoggedOutNote:
        'هذا هو حسابك الذي قمت بتسجيل الدخول إليه حالياً. سيتم تسجيل خروجك بعد الإزالة.',
      removeAccountButton: 'إزالة الحساب',
      localStorageModalTitle: 'فحص LocalStorage',
      foundItemsText: n => `تم العثور على ${n} عنصر في localStorage`,
      noDataFound: 'لم يتم العثور على بيانات',
      indexedDBModalTitle: 'فحص IndexedDB',
      foundDatabasesText: n => `تم العثور على ${n} قاعدة بيانات`,
      noDatabasesFound: 'لم يتم العثور على قواعد بيانات متعلقة بـ w3pk',

      registrationSuccessTitle: 'تم التسجيل بنجاح',
      registrationSuccessDescription: 'تم إنشاء حسابك الجديد.',
      registrationFailedTitle: 'فشل التسجيل',
      registrationFailedDefaultDescription: 'تعذر إكمال التسجيل. يرجى المحاولة مرة أخرى.',
      localStorageInspectedTitle: 'تم فحص LocalStorage',
      localStorageInspectedDescription: n => `تم العثور على ${n} عنصر. مرر لأسفل لرؤية النتائج.`,
      genericErrorTitle: 'خطأ',
      failedInspectLocalStorage: 'فشل فحص localStorage',
      indexedDBInspectedTitle: 'تم فحص IndexedDB',
      indexedDBInspectedDescription: (dbCount, recordCount) =>
        `تم العثور على ${dbCount} قاعدة بيانات تحتوي على ${recordCount} سجل. مرر لأسفل لرؤية النتائج.`,
      failedInspectIndexedDB: 'فشل فحص IndexedDB',
      itemClearedTitle: 'تم مسح العنصر',
      itemClearedDescription: key => `تمت إزالة "${key}" من localStorage`,
      failedClearItem: key => `فشل مسح "${key}"`,
      recordClearedTitle: 'تم مسح السجل',
      recordClearedDescription: (db, store) => `تمت إزالة السجل من ${db}/${store}`,
      failedClearRecord: 'فشل مسح السجل',
      errorLoadingAddressesTitle: 'خطأ في تحميل العناوين',
      failedDeriveAddresses: 'فشل اشتقاق عناوين المحفظة',
      errorLoadingBackupStatusTitle: 'خطأ في تحميل حالة النسخ الاحتياطي',
      failedCheckSecurityStatus: 'فشل التحقق من حالة الأمان',
      accountRemovedTitle: 'تمت إزالة الحساب',
      accountRemovedDescription: username => `تمت إزالة الحساب ${username} من هذا الجهاز.`,
      loggingOutTitle: 'جارٍ تسجيل الخروج',
      loggingOutDescription: 'لقد أزلت حسابك الحالي. جارٍ تسجيل الخروج...',
      failedRemoveAccount: 'فشل إزالة الحساب. يرجى المحاولة مرة أخرى.',
      errorReadingFileTitle: 'خطأ في قراءة الملف',
      failedReadBackupFile: 'فشل قراءة ملف النسخة الاحتياطية',
      noBackupFileSelectedTitle: 'لم يتم تحديد ملف نسخة احتياطية',
      incompatibleBackupTitle: 'إصدار نسخة احتياطية غير متوافق',
      incompatibleBackupDescription:
        'تم إنشاء هذه النسخة الاحتياطية بإصدار أقدم من w3pk. يرجى إنشاء نسخة احتياطية جديدة بالإصدار الحالي.',
      walletRestoredTitle: 'تمت استعادة المحفظة!',
      walletRestoredDescription: address => `تمت استعادة المحفظة والكتابة فوقها بنجاح: ${address}`,
      usernameRequiredRestoreDescription: 'يرجى إدخال اسم مستخدم للتسجيل بالمحفظة المستعادة.',
      walletRestoredRegisteredTitle: 'تمت استعادة المحفظة وتسجيلها!',
      walletRestoredRegisteredDescription: address =>
        `تمت استعادة المحفظة وتسجيلها بنجاح: ${address}`,
      securityReportGeneratedTitle: 'تم إنشاء تقرير الأمان',
      securityReportGeneratedDescription: 'اطلع على التحليل التفصيلي أدناه',
      inspectionFailedTitle: 'فشل الفحص',
      inspectionFailedDescription:
        'لم يعمل فحص التطبيق المضيف. ربما يكون ذلك بسبب الوصول إلى حد معدل الطلبات لدى Anthropic.',
      backupStatusRetrievedTitle: 'تم استرجاع حالة النسخ الاحتياطي.',
      errorRetrievingStatusTitle: 'خطأ في استرجاع الحالة.',
      unexpectedErrorDescription: 'حدث خطأ غير متوقع.',
      errorCreatingBackupTitle: 'خطأ في إنشاء النسخة الاحتياطية.',
      backupCreatedTitle: 'تم إنشاء النسخة الاحتياطية بنجاح!',
      invalidInputTitle: 'إدخال غير صالح',
      guardianNameRequiredDescription: 'اسم الوصي مطلوب',
      notEnoughGuardiansTitle: 'عدد الأوصياء غير كافٍ',
      notEnoughGuardiansDescription: 'تحتاج إلى وصيين على الأقل لإعداد الاسترداد الاجتماعي',
      invalidThresholdTitle: 'حد غير صالح',
      invalidThresholdDescription: 'لا يمكن أن يكون الحد أكبر من عدد الأوصياء',
      socialRecoveryConfiguredTitle: 'تم إعداد الاسترداد الاجتماعي!',
      socialRecoveryConfiguredDescription: (threshold, count) =>
        `تم إعداد استرداد ${threshold} من ${count} أوصياء بنجاح`,
      pleasePasteShareDescription: 'يرجى لصق رمز حصة الوصي',
      duplicateShareTitle: 'حصة مكررة',
      duplicateShareDescription: 'تمت إضافة حصة هذا الوصي بالفعل',
      shareAddedTitle: 'تمت إضافة الحصة',
      shareAddedDescription: name => `تمت إضافة حصة من ${name}`,
      invalidShareFormatTitle: 'تنسيق حصة غير صالح',
      invalidShareFormatDescription: 'يرجى لصق رمز حصة وصي صالح (بتنسيق JSON)',
      notEnoughSharesTitle: 'عدد الحصص غير كافٍ',
      notEnoughSharesDescription: 'تحتاج إلى حصتي وصي على الأقل لاسترداد محفظتك',
      passwordRequiredRecoveryDescription:
        'تحتاج إلى إدخال كلمة مرورك لفك تشفير ملف النسخة الاحتياطية',
      usernameRequiredRecoveryDescription: 'تحتاج إلى تقديم اسم مستخدم لتسجيل محفظتك المستردة',
      walletRecoveredTitle: 'تم استرداد المحفظة بنجاح!',
      walletRecoveredDescription: address =>
        `تم استرداد محفظتك وتسجيلها بمفتاح مرور جديد: ${address}`,
      fileLoadedTitle: 'تم تحميل الملف',
      fileLoadedDescription: 'تم تحميل حصة الوصي من الملف. انقر على "إضافة حصة" لإضافتها.',
      failedReadGuardianFile: 'فشل قراءة ملف حصة الوصي',
      cannotSaveTitle: 'تعذر الحفظ',
      cannotSaveDescription: 'بيانات QR غير صالحة أو المستخدم غير مصادَق عليه',
      walletLinkedTitle: 'تم ربط المحفظة بنجاح!',
      walletLinkedDescription: address => `تم ربط المحفظة ${address} بحساب مفتاح المرور الخاص بك`,
      errorSavingLinkTitle: 'خطأ في حفظ رابط المحفظة',
      failedSaveSyncData: 'فشل حفظ بيانات مزامنة المحفظة',
      recoveryPasswordPrompt:
        'أدخل كلمة المرور التي حددتها عند إعداد الاسترداد الاجتماعي.\n\nلم تتم مشاركة كلمة المرور هذه مع الأوصياء - لقد حددتها أثناء الإعداد.',
      recoveryUsernamePrompt: address =>
        `اختر اسم مستخدم لتسجيل مفتاح المرور الجديد الخاص بك.\n\nجارٍ استرداد المحفظة: ${address}`,
    },
    header: {
      registerTitle: 'تسجيل حساب جديد',
      walletInfoText:
        'سيتم إنشاء محفظة إيثريوم وتخزينها بأمان على جهازك، محمية ببصمتك البيومترية أو رمز PIN بفضل',
      usernameLabel: 'اسم المستخدم',
      usernamePlaceholder: 'أدخل اسم المستخدم الخاص بك',
      usernameError:
        'يجب أن يتكون اسم المستخدم من 3 إلى 50 حرفًا وأن يحتوي فقط على أحرف وأرقام وشرطات سفلية وشرطات. يجب أن يبدأ وينتهي بحرف أو رقم.',
      createAccount: 'إنشاء حساب',
      optionsAriaLabel: 'خيارات',
      mainNavAriaLabel: 'التنقل الرئيسي',
      usernameRequiredTitle: 'اسم المستخدم مطلوب',
      usernameRequiredDescription: 'يرجى إدخال اسم مستخدم للتسجيل.',
      noAccountFoundTitle: 'لم يتم العثور على حساب',
      noAccountFoundDescription: 'لم يتم العثور على مفتاح مرور. يرجى التسجيل لإنشاء حساب جديد.',
      alreadyRegisteredLink: 'لقد قمت بالتسجيل بالفعل على جهاز آخر',
    },
    passwordModal: {
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور الخاصة بك',
      passwordRequiredTitle: 'كلمة المرور مطلوبة.',
      passwordRequiredDescription: 'يرجى إدخال كلمة المرور الخاصة بك.',
      weakPasswordTitle: 'كلمة مرور ضعيفة.',
      weakPasswordDescription: 'يرجى استخدام كلمة مرور أقوى تستوفي جميع المتطلبات.',
      submissionErrorTitle: 'خطأ في الإرسال.',
      submissionErrorDefaultDescription: 'حدث خطأ غير متوقع.',
      requirementsNotMet: 'كلمة المرور لا تستوفي جميع المتطلبات',
      strongPassword: 'كلمة مرور قوية!',
      mustInclude: 'يجب أن تتضمن كلمة المرور:',
      reqMinLength: '12 حرفًا على الأقل',
      reqUpperCase: 'حرف كبير واحد',
      reqLowerCase: 'حرف صغير واحد',
      reqNumber: 'رقم واحد',
      reqSpecialChar: 'رمز خاص واحد',
      satisfied: ' (مستوفى)',
      required: ' (مطلوب)',
      submit: 'إرسال',
    },
    about: {
      headingPrefix: 'حول',
      introPart1:
        'w3pk هي حزمة SDK للمصادقة على Web3 بدون كلمة مرور، مع محافظ مشفّرة وميزات خصوصية. يمكنك استخدامها في أي تطبيق ويب قائم على JS/TS (Next.js وVue وAngular وSvelte و...).',
      introPart2: 'هو قالب تطبيق Next.js، لا تتردد في عمل fork له وبناء ما تريد!',
      emailBoxText:
        'w3pk قيد التطوير. استلم رسائل بريد إلكتروني عند إطلاقنا لميزات جديدة (دعم EIP-1193، وقدرات الذكاء الاصطناعي، ومساعدات Viem، وتجريد السلاسل (chain abstraction)، والمزيد)',
      emailPlaceholder: 'your@email.com',
      subscribeButton: 'اشتراك',
      githubLabel: 'GitHub',
      npmLabel: 'NPM',
      githubAriaLabel: 'عرض w3pk على GitHub (يفتح في تبويب جديد)',
      npmAriaLabel: 'عرض w3pk على NPM (يفتح في تبويب جديد)',
      codeRegisterComment: '// تسجيل',
      codeLoginComment: '// تسجيل الدخول',
      codeLogoutComment: '// تسجيل الخروج',
      featuresHeading: 'الميزات',
      feature1: 'مصادقة بدون كلمة مرور (WebAuthn/FIDO2)',
      feature2: 'عزل مفاتيح خاص بالمصدر مع التحكم في الوصول القائم على العلامات',
      feature3: 'إدارة الجلسات (في الذاكرة + دائمة اختيارية)',
      feature4: 'إنشاء محفظة HD (BIP39/BIP44)',
      feature5: 'اشتقاق عناوين متعددة مع أوضاع أمان (STANDARD/STRICT/YOLO)',
      feature6: 'طرق توقيع متعددة (EIP-191، SIWE/EIP-4361، EIP-712، rawHash)',
      feature7: 'إرسال معاملات على السلسلة مع تحديد RPC تلقائي (`sendTransaction`)',
      feature8: 'موفّر EIP-1193 لـ ethers وviem وwagmi وRainbowKit (`getEIP1193Provider`)',
      feature9: 'عناوين خفية ERC-5564 (اختيارية)',
      feature10: 'عناصر ZK الأساسية (إنشاء والتحقق من إثباتات المعرفة الصفرية)',
      feature11: 'دعم Chainlist (أكثر من 2390 شبكة)',
      feature12: 'اكتشاف شبكات EIP-7702 (أكثر من 329 شبكة)',
      feature13: 'تكامل المحافظ الخارجية (تفويض MetaMask/Ledger إلى w3pk عبر EIP-7702)',
      feature14: 'وضع EIP-7951 PRIMARY (توقيع مفتاح مرور P-256)',
      feature15: 'التحقق من البناء (تجزئة IPFS CID + سجل على السلسلة يديره DAO)',
      feature16:
        'نسخ احتياطي واسترداد ثلاثي الطبقات (مزامنة مفتاح المرور، نسخ احتياطية مشفّرة، استرداد اجتماعي)',
      feature17: 'فحص التطبيق المضيف مدعوم بالذكاء الاصطناعي',
      invalidEmailTitle: 'بريد إلكتروني غير صالح',
      invalidEmailDescription: 'يرجى إدخال عنوان بريد إلكتروني صالح',
      subscribeSuccessTitle: 'تم بنجاح!',
      subscribeSuccessDescription: 'لقد تم اشتراكك في تحديثات w3pk',
      subscribeErrorTitle: 'خطأ',
      subscribeErrorDescription: 'فشل الاشتراك. يرجى المحاولة مرة أخرى.',
    },
  },

  // Bengali
  bn: {
    common: {
      login: 'লগ ইন',
      logout: 'লগ আউট',
      pleaseLogin: 'অনুগ্রহ করে লগইন করুন',
      cancel: 'বাতিল করুন',
      srLoadingText: 'লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...',
      loading: 'লোড হচ্ছে...',
      notAvailable: 'উপলব্ধ নয়',
      close: 'বন্ধ করুন',
    },
    home: {
      title: 'স্বাগতম!',
      subtitle: 'আপনাকে এখানে পেয়ে আনন্দিত!',
      greeting: 'হ্যালো বন্ধু!',
      greetingSubtitle: 'বসুন, আরাম করুন এবং কিছু দুর্দান্ত তৈরি করুন!',
      signMessage: 'একটি বার্তায় স্বাক্ষর করুন',
      messageSignedTitle: 'বার্তা স্বাক্ষরিত হয়েছে',
      messageSignedDescription: signature => `স্বাক্ষর: ${signature.substring(0, 20)}...`,
    },
    navigation: {
      about: 'সম্পর্কে',
      settings: 'সেটিংস',
    },
    settings: {
      title: 'সেটিংস',
      loginRequired: 'আপনার সেটিংস অ্যাক্সেস করতে অনুগ্রহ করে লগইন করুন',
      subtitle: 'আপনার অ্যাকাউন্ট, ব্যাকআপ এবং পুনরুদ্ধার বিকল্পগুলি পরিচালনা করুন',
      tabAccounts: 'অ্যাকাউন্ট',
      tabBackup: 'ব্যাকআপ',
      tabSync: 'সিঙ্ক',
      tabRecovery: 'সামাজিক পুনরুদ্ধার',

      browserInfoHeading: 'ব্রাউজার তথ্য',
      browserLabel: 'ব্রাউজার:',
      versionLabel: 'সংস্করণ:',
      osLabel: 'অপারেটিং সিস্টেম:',
      webauthnSupportLabel: 'WebAuthn সমর্থন:',
      compatibilityLabel: 'সামঞ্জস্যতা:',
      available: 'উপলব্ধ',
      notAvailable: 'উপলব্ধ নয়',
      fullySupported: 'সম্পূর্ণরূপে সমর্থিত',
      knownIssues: 'পরিচিত সমস্যা',
      notSupported: 'সমর্থিত নয়',
      browserNotSupportedTitle: 'ব্রাউজার সমর্থিত নয়',
      knownIssuesTitle: 'পরিচিত সমস্যা সনাক্ত হয়েছে',
      recommendationTitle: 'সুপারিশ',
      webauthnNotAvailableTitle: 'WebAuthn উপলব্ধ নয়',
      webauthnNotAvailableText:
        'আপনার ব্রাউজার WebAuthn সমর্থন করে না, যা w3pk প্রমাণীকরণের জন্য প্রয়োজনীয়। অনুগ্রহ করে আপনার ব্রাউজার আপডেট করুন অথবা একটি সমর্থিত ব্রাউজার ব্যবহার করুন:',
      browserChrome: 'Chrome 67+ (মে ২০১৮)',
      browserFirefox: 'Firefox 60+ (মে ২০১৮)',
      browserSafari: 'Safari 14+ (সেপ্টেম্বর ২০২০)',
      browserEdge: 'Edge 18+ (নভেম্বর ২০১৮)',
      browserSamsung: 'Samsung Internet 11+ (ফেব্রুয়ারি ২০২০)',
      androidRecommendedHeading: 'Android-এর জন্য প্রস্তাবিত ব্রাউজার',
      samsungInternetNote:
        'Samsung Internet (Samsung ডিভাইসের জন্য সেরা) - ✅ কার্যকরী বলে নিশ্চিত করা হয়েছে',
      chromeNote: 'Chrome - ✅ নির্ভরযোগ্য',
      edgeNote: 'Edge - ✅ নির্ভরযোগ্য',
      firefoxMobileNote:
        'Firefox Mobile - ⚠️ এড়িয়ে চলুন (পাসকী স্থায়িত্বের পরিচিত সমস্যা রয়েছে)',

      restoreBackupHeading: 'ব্যাকআপ থেকে পুনরুদ্ধার করুন',
      restoreBackupDescription:
        'যদি আপনার কাছে একটি ব্যাকআপ ফাইল থাকে, তাহলে আগে লগইন না করেই আপনি আপনার ওয়ালেট পুনরুদ্ধার করতে পারেন।',
      restoreBackupSyncHint:
        'অন্য একটি ডিভাইসের সাথে সিঙ্ক করতে: আপনার অন্য ডিভাইসে লগইন করুন, একটি এনক্রিপ্ট করা ব্যাকআপ ফাইল ডাউনলোড করতে Settings → Create Backup-এ যান, তারপর এটি এখানে আপলোড করুন এবং একই পাসওয়ার্ড লিখুন।',
      restoringText: 'পুনরুদ্ধার করা হচ্ছে...',
      restoreBackupButton: 'ব্যাকআপ ফাইল থেকে পুনরুদ্ধার করুন',

      debugStorageHeading: 'ডিবাগ ও স্টোরেজ পরিদর্শন',
      debugStorageDescription: 'ব্রাউজার স্টোরেজ এবং কার্যকলাপ লগ পরিদর্শন করুন',
      inspectingText: 'পরিদর্শন করা হচ্ছে...',
      inspectLocalStorageButton: 'LocalStorage পরিদর্শন করুন',
      inspectIndexedDBButton: 'IndexedDB পরিদর্শন করুন',

      inspectSecurityDescriptionSmall:
        'লেনদেন এবং স্বাক্ষর পদ্ধতির জন্য এই অ্যাপ্লিকেশনটি বিশ্লেষণ করুন।',
      inspectSecurityButton: 'নিরাপত্তা পরিদর্শন করুন',
      consoleCommandLabel: 'কনসোল কমান্ড:',
      clearReportButton: 'রিপোর্ট মুছুন',
      filesAnalyzedLabel: 'বিশ্লেষণ করা ফাইল:',
      inspectionHeadingBig: 'নিরাপত্তা পরিদর্শন',
      inspectSecurityDescriptionBig:
        'এই অ্যাপের একটি বিস্তৃত নিরাপত্তা রিপোর্ট তৈরি করুন। রিপোর্টটি সমস্ত লেনদেন এবং স্বাক্ষর পদ্ধতি বিশ্লেষণ করবে।',
      inspectNowButton: 'এখনই পরিদর্শন করুন',
      consoleHintText: 'আপনি ব্রাউজার কনসোলে await w3pk.inspectNow() চালাতেও পারেন',
      securityReportHeading: 'নিরাপত্তা রিপোর্ট',
      appUrlLabel: 'অ্যাপ URL:',

      localStorageResultsHeading: 'LocalStorage ফলাফল',
      itemsCount: n => `${n}টি আইটেম`,
      encryptedBadge: 'এনক্রিপ্টেড',
      clearItemAria: 'আইটেম মুছুন',
      indexedDBResultsHeading: 'IndexedDB ফলাফল',
      databasesCount: n => `${n}টি ডাটাবেস`,
      storesLabel: 'স্টোর:',
      recordsLabel: 'রেকর্ড:',
      clearRecordAria: 'রেকর্ড মুছুন',
      storeKeyLabel: (store, key) => `স্টোর: ${store} | কী: ${key}`,

      currentAccountHeading: 'বর্তমান অ্যাকাউন্ট',
      currentAccountDescription: 'এটি আপনার বর্তমানে লগইন করা অ্যাকাউন্ট।',
      noAccounts: 'এই ডিভাইসে কোনো অ্যাকাউন্ট পাওয়া যায়নি।',
      currentBadge: 'বর্তমান',
      usernameLabel: username => `ব্যবহারকারীর নাম: ${username}`,
      deleteAccountAria: 'অ্যাকাউন্ট মুছুন',

      sessionHeading: 'আমার সেশন সচল রাখুন',
      sessionDescription:
        'পাসকী প্রম্পট ছাড়া আপনার সেশন কতক্ষণ সক্রিয় থাকবে তা নির্ধারণ করুন। মেয়াদ শেষ হলে, আপনার পরবর্তী ভিজিটে একবার আপনার বায়োমেট্রিক/পিন চাওয়া হবে এবং একটি নতুন সেশন শুরু হবে — অর্থাৎ এটি নির্ধারণ করে আপনি কতবার পুনরায় প্রমাণীকরণ করবেন। এই সেটিংটি শুধুমাত্র STANDARD এবং YOLO মোডে প্রযোজ্য। STRICT এবং PRIMARY মোডে সর্বদা নতুন প্রমাণীকরণ প্রয়োজন এবং সেগুলি স্থায়ী সেশন ব্যবহার করে না।',
      noStoredSessionText:
        'এই ডিভাইসে কোনো সংরক্ষিত সেশন নেই। আপনার প্রমাণীকারী WebAuthn PRF এক্সটেনশন সমর্থন করে বলে মনে হচ্ছে না, যা সেশন নিরাপদে সচল রাখার জন্য w3pk-এর প্রয়োজন। আপনার সেশন শুধুমাত্র মেমরিতে থাকবে: ট্যাব বন্ধ করলে এটি শেষ হয়ে যাবে, এবং প্রতিটি ভিজিটে আপনার বায়োমেট্রিক/পিন চাওয়া হবে। বাকি সবকিছু স্বাভাবিকভাবে কাজ করবে।',
      sessionDurationLabel: 'সেশনের মেয়াদ',
      dayLabel: n => `${n} দিন`,
      oneDayLabel: '১ দিন',
      thirtyDaysLabel: '৩০ দিন',
      sessionHowItWorksTitle: 'এটি যেভাবে কাজ করে:',
      sessionHowItWorksText:
        'প্রতিবার আপনি আপনার বায়োমেট্রিক/পিন দিয়ে লগইন করলে, আপনার প্রমাণীকারী একটি হার্ডওয়্যার-সমর্থিত সিক্রেট (WebAuthn PRF এক্সটেনশন) প্রকাশ করে যা এই ডিভাইসে আপনার সেশন এনক্রিপ্ট করে — ডিস্কে সংরক্ষিত কোনো কিছু দিয়ে সেই কী পুনরায় তৈরি করা যায় না। প্রতিটি প্রকৃত লগইনে কাউন্টডাউন নতুন করে শুরু হয়: ৭ দিনের মেয়াদ সহ, আজ লগইন করলে আপনি আজ থেকে ৭ দিন পর্যন্ত সাইন-ইন অবস্থায় থাকবেন, তখন আপনাকে একবার প্রম্পট করা হবে এবং সেশনটি একটি নতুন কী দিয়ে পুনরায় এনক্রিপ্ট করা হবে।',

      walletBackupHeading: 'ওয়ালেট ব্যাকআপ',
      walletBackupDescription:
        'আপনি যাতে কখনও অ্যাক্সেস না হারান তা নিশ্চিত করতে আপনার ওয়ালেটের এনক্রিপ্ট করা ব্যাকআপ তৈরি করুন',
      currentAccountBackupHeading: 'বর্তমান অ্যাকাউন্ট',
      loggedInAsLabel: 'এই হিসেবে লগইন করা আছে:',
      loadingAddressesText: 'ঠিকানা লোড হচ্ছে...',
      index0Label: 'ইনডেক্স #0 ঠিকানা:',
      mainAddressLabel: 'অরিজিন-নির্দিষ্ট, STANDARD মোড, MAIN-ট্যাগযুক্ত ঠিকানা (ডিফল্ট ওয়ালেট):',
      loadingText: 'লোড হচ্ছে...',
      securityStatusHeading: 'নিরাপত্তা অবস্থা',
      checkingStatusText: 'ব্যাকআপ অবস্থা পরীক্ষা করা হচ্ছে...',
      refreshHeading: 'ব্যাকআপ অবস্থা রিফ্রেশ করুন',
      refreshDescription: 'আপনার বর্তমান নিরাপত্তা স্কোর এবং ব্যাকআপ সুপারিশগুলি পুনরায় লোড করুন',
      checkingText: 'পরীক্ষা করা হচ্ছে...',
      refreshButton: 'অবস্থা রিফ্রেশ করুন',
      createHeading: 'ব্যাকআপ তৈরি করুন',
      createDescription:
        'আপনার পাসওয়ার্ড দ্বারা সুরক্ষিত একটি এনক্রিপ্ট করা ব্যাকআপ ফাইল ডাউনলোড করুন',
      creatingText: 'তৈরি করা হচ্ছে...',
      createButton: 'ব্যাকআপ তৈরি করুন',
      restoreHeadingCard: 'ব্যাকআপ থেকে পুনরুদ্ধার করুন',
      restoreDescriptionCard: 'একটি এনক্রিপ্ট করা ব্যাকআপ ফাইল থেকে আপনার ওয়ালেট পুনরুদ্ধার করুন',
      restoreButtonCard: 'ব্যাকআপ পুনরুদ্ধার করুন',
      aboutBackupHeading: 'ক্লায়েন্ট-সাইড ব্যাকআপ সম্পর্কে',
      aboutBackupPara1:
        'আপনার ওয়ালেটের মূল সিক্রেট (নিমোনিক ফ্রেজ) সম্পূর্ণভাবে আপনার ডিভাইসে তৈরি এবং এনক্রিপ্ট করা হয়। ব্যাকআপ প্রক্রিয়াটি আপনার পাসওয়ার্ড ব্যবহার করে আপনার ব্রাউজারের লোকাল স্টোরেজ থেকে এই এনক্রিপ্ট করা ডেটা পুনরুদ্ধার করে, তারপর এটি একটি নিরাপদ ফাইলে প্যাকেজ করে যা আপনি ডাউনলোড করতে পারেন।',
      aboutBackupPara2:
        'আপনার ওয়ালেটের এনক্রিপশন কী একটি WebAuthn স্বাক্ষর ব্যবহার করে তৈরি করা হয়, যার জন্য আপনার বায়োমেট্রিক প্রমাণীকরণ (আঙুলের ছাপ, ফেস স্ক্যান) অথবা ডিভাইস পিন প্রয়োজন। এর অর্থ হলো, কেউ যদি আপনার ব্রাউজারে সংরক্ষিত এনক্রিপ্ট করা ডেটাতে অ্যাক্সেস পেয়েও যায়, আপনার শারীরিক ডিভাইস এবং প্রমাণীকরণ ছাড়া তারা এটি ডিক্রিপ্ট করতে পারবে না।',
      aboutBackupPara3:
        'আপনার ব্যাকআপ ফাইলটি AES-256-GCM ব্যবহার করে এনক্রিপ্ট করা হয়, যার কী আপনার দেওয়া পাসওয়ার্ড থেকে তৈরি হয়। এই ফাইলটি নিরাপদে সংরক্ষণ করুন এবং আপনার পাসওয়ার্ড মনে রাখুন।',
      aboutBackupWarning:
        'যদি আপনি আপনার ডিভাইস, পাসকী, এবং ব্যাকআপ ফাইল/পাসওয়ার্ড — এই সবগুলির অ্যাক্সেস হারান, তাহলে আপনার ওয়ালেট পুনরুদ্ধার করা যাবে না।',

      socialRecoveryHeading: 'সামাজিক পুনরুদ্ধার',
      socialRecoveryDescription:
        'Shamir Secret Sharing ব্যবহার করে বিশ্বস্ত অভিভাবকদের মধ্যে আপনার ওয়ালেট পুনরুদ্ধার বিতরণ করুন',
      setupHeading: 'সামাজিক পুনরুদ্ধার সেটআপ করুন',
      setupDescription: (threshold, count) =>
        `বিশ্বস্ত অভিভাবক যোগ করুন যারা আপনাকে ওয়ালেট পুনরুদ্ধারে সাহায্য করবে। পুনরুদ্ধার করতে আপনার ${count || '?'} জনের মধ্যে ${threshold} জন অভিভাবক প্রয়োজন হবে।`,
      guardianNameLabel: 'অভিভাবকের নাম *',
      guardianEmailLabel: 'অভিভাবকের ইমেইল (ঐচ্ছিক)',
      addGuardianButton: 'অভিভাবক যোগ করুন',
      guardiansListHeading: n => `অভিভাবক (${n})`,
      removeGuardianAria: 'অভিভাবক সরান',
      thresholdLabel: (threshold, count) => `পুনরুদ্ধার থ্রেশহোল্ড: ${count} এর মধ্যে ${threshold}`,
      thresholdDescription: 'আপনার ওয়ালেট পুনরুদ্ধারের জন্য প্রয়োজনীয় অভিভাবকের সংখ্যা',
      setupSocialRecoveryButton: (threshold, count) =>
        `সামাজিক পুনরুদ্ধার সেটআপ করুন (${count || '?'}-এর মধ্যে-${threshold})`,
      howItWorksRecoveryInfo: (count, threshold) =>
        `এটি যেভাবে কাজ করে: Shamir Secret Sharing ব্যবহার করে আপনার ওয়ালেট পুনরুদ্ধার ${count || '?'}টি এনক্রিপ্ট করা শেয়ারে বিভক্ত করা হবে। আপনার ওয়ালেট পুনরুদ্ধার করতে ${threshold} জন অভিভাবককে তাদের শেয়ার একত্রিত করতে হবে। কোনো একক অভিভাবক একা আপনার ওয়ালেট অ্যাক্সেস করতে পারবে না।`,
      recoverWalletHeading: 'ওয়ালেট পুনরুদ্ধার করুন',
      hideButton: 'লুকান',
      showButton: 'দেখান',
      recoverDescription:
        'আপনার ওয়ালেটের অ্যাক্সেস হারিয়েছেন? এটি পুনরুদ্ধার করতে অভিভাবকদের শেয়ার সংগ্রহ করুন।',
      shareCodeLabel: 'অভিভাবক শেয়ার কোড',
      sharePlaceholder:
        'এখানে অভিভাবক শেয়ার JSON পেস্ট করুন (উদাহরণ, {"guardianId":"...","share":"..."})',
      addShareButton: 'শেয়ার যোগ করুন',
      uploadFileButton: 'ফাইল আপলোড করুন',
      clearAllButton: 'সব মুছুন',
      collectedSharesHeading: n => `সংগৃহীত শেয়ার (${n})`,
      guardianFallback: 'অভিভাবক',
      shareIndexLabel: n => `(#${n})`,
      addedAtLabel: time => `${time}-এ যোগ করা হয়েছে`,
      removeShareAria: 'শেয়ার সরান',
      invalidShareLabel: n => `অবৈধ শেয়ার #${n}`,
      progressHeading: 'পুনরুদ্ধার অগ্রগতি',
      progressText: n =>
        `${n}টি শেয়ার সংগৃহীত হয়েছে। পুনরুদ্ধার করার চেষ্টা করতে আপনার কমপক্ষে ২টি শেয়ার প্রয়োজন।`,
      recoveringText: 'পুনরুদ্ধার করা হচ্ছে...',
      recoverButton: n => `ওয়ালেট পুনরুদ্ধার করুন (${n}টি শেয়ার)`,
      importantWarning:
        'গুরুত্বপূর্ণ: নিশ্চিত করুন যে শেয়ারগুলি সঠিক অভিভাবকদের কাছ থেকে এসেছে। অবৈধ শেয়ারের ফলে পুনরুদ্ধার ব্যর্থ হবে।',
      activeHeading: 'সামাজিক পুনরুদ্ধার সক্রিয়',
      activeDescription: (threshold, count) =>
        `আপনার ওয়ালেট ${count}-এর মধ্যে-${threshold} অভিভাবক পুনরুদ্ধার দ্বারা সুরক্ষিত`,
      generateInviteButton: 'আমন্ত্রণ তৈরি করুন',
      removeConfigQuestion:
        'সব অভিভাবকের কাছে তাদের শেয়ার আছে? আপনি এখন লোকাল স্টোরেজ থেকে অভিভাবক কনফিগারেশন সরিয়ে ফেলতে পারেন। শেয়ারগুলি আপনার অভিভাবকদের কাছে নিরাপদে সংরক্ষিত আছে এবং যেকোনো সময় পুনরুদ্ধারের জন্য ব্যবহার করা যেতে পারে।',
      removeConfigButton: 'লোকাল স্টোরেজ থেকে অভিভাবক কনফিগারেশন মুছুন',
      invitationHeading: 'অভিভাবক আমন্ত্রণ',
      downloadInviteButton: 'আমন্ত্রণ ডাউনলোড করুন',
      sendInviteText: name => `একটি নিরাপদ চ্যানেলের মাধ্যমে ${name}-কে এই আমন্ত্রণ পাঠান`,

      deviceSyncHeading: 'ডিভাইস সিঙ্ক',
      deviceSyncDescription:
        'প্ল্যাটফর্ম পরিষেবা ব্যবহার করে আপনার পাসকী স্বয়ংক্রিয়ভাবে ডিভাইসগুলির মধ্যে সিঙ্ক হয়',
      qrHeading: 'সিঙ্ক QR কোড',
      qrDescription:
        'অন্য একটি ডিভাইসে সহজে সিঙ্ক করতে বা আপনার অ্যাকাউন্টের তথ্য যাচাই করতে আপনার ওয়ালেট ঠিকানা সম্বলিত একটি QR কোড তৈরি করুন।',
      generateQrButton: 'সিঙ্ক QR কোড তৈরি করুন',
      qrNote:
        'দ্রষ্টব্য: এই QR কোডে শুধুমাত্র আপনার পাবলিক ওয়ালেট ঠিকানা রয়েছে। এতে আপনার প্রাইভেট কী বা পুনরুদ্ধার ফ্রেজ নেই। অন্য একটি ডিভাইসে আপনার অ্যাকাউন্ট যাচাই করতে এটি ব্যবহার করুন।',
      hideQrButton: 'QR কোড লুকান',
      verifyHeading: 'QR কোড ডেটা যাচাই করুন',
      verifyDescription:
        'ওয়ালেট ঠিকানা যাচাই করতে স্ক্যান করা QR কোড থেকে JSON স্ট্রিং পেস্ট করুন।',
      verifyPlaceholder:
        'এখানে JSON ডেটা পেস্ট করুন (উদাহরণ, {"username":"...","ethereumAddress":"..."})',
      errorLabel: 'ত্রুটি:',
      parsedDataLabel: 'পার্স করা ডেটা:',
      usernameFieldLabel: 'ব্যবহারকারীর নাম:',
      ethAddressLabel: 'ইথেরিয়াম ঠিকানা:',
      index0FieldLabel: 'ইনডেক্স #0:',
      mainTaggedLabel: 'MAIN-ট্যাগযুক্ত:',
      openbarTaggedLabel: 'OPENBAR-ট্যাগযুক্ত:',
      generatedLabel: 'তৈরি হয়েছে:',
      linkWalletButton: 'এই ওয়ালেটটি আপনার পাসকী অ্যাকাউন্টের সাথে লিঙ্ক করুন',
      linkExplanation:
        'লিঙ্ক করলে যা ঘটবে: এটি localStorage এবং IndexedDB উভয় স্থানে ওয়ালেট ঠিকানা সংরক্ষণ করবে, আপনার পাসকী অ্যাকাউন্ট এবং এই HD ওয়ালেটের মধ্যে একটি স্থায়ী লিঙ্ক তৈরি করবে। ডিভাইসগুলির মধ্যে ওয়ালেট ডেটা যাচাই বা সিঙ্ক করতে আপনি এটি ব্যবহার করতে পারেন।',
      howQrWorksHeading: 'QR কোড ওয়ালেট সিঙ্ক যেভাবে কাজ করে',
      qrStep1:
        'ধাপ ১: QR কোড তৈরি করুন - আপনার প্রধান ডিভাইসে, আপনার ওয়ালেটের পাবলিক ঠিকানা সম্বলিত একটি QR কোড তৈরি করুন। এই QR কোড শেয়ার করা নিরাপদ কারণ এতে শুধুমাত্র পাবলিক তথ্য রয়েছে।',
      qrStep2:
        'ধাপ ২: স্ক্যান ও যাচাই - আপনার দ্বিতীয় ডিভাইসে, যেকোনো QR স্ক্যানার অ্যাপ ব্যবহার করে QR কোড স্ক্যান করুন, অথবা QR কোডে প্রদর্শিত JSON ডেটা ম্যানুয়ালি কপি করুন।',
      qrStep3:
        'ধাপ ৩: ওয়ালেট লিঙ্ক করুন - উপরের যাচাইকরণ এলাকায় JSON ডেটা পেস্ট করুন এবং "Link This Wallet"-এ ক্লিক করুন। এটি আপনার পাসকী অ্যাকাউন্ট এবং HD ওয়ালেট ঠিকানার মধ্যে একটি স্থায়ী সংযোগ তৈরি করে।',
      whatGetsStored:
        'যা সংরক্ষিত হয়: শুধুমাত্র পাবলিক ওয়ালেট ঠিকানা localStorage এবং IndexedDB-তে সংরক্ষিত হয়। আপনার প্রাইভেট কী এবং পুনরুদ্ধার ফ্রেজ নিরাপদ থাকে এবং এই সিঙ্ক পদ্ধতির মাধ্যমে কখনও প্রেরণ বা সংরক্ষণ করা হয় না।',
      platformSyncHeading: 'পাসকী প্ল্যাটফর্ম সিঙ্ক',
      platformSyncIntro:
        'আপনার পাসকী পরিচয়পত্র একই ইকোসিস্টেমের মধ্যে ডিভাইসগুলিতে স্বয়ংক্রিয়ভাবে সিঙ্ক হয়:',
      appleSyncNote: 'Apple: iCloud Keychain-এর মাধ্যমে সিঙ্ক হয় (iPhone, iPad, Mac)',
      googleSyncNote: 'Google: Password Manager-এর মাধ্যমে সিঙ্ক হয় (Android, Chrome)',
      windowsSyncNote:
        'Windows Hello: ডিভাইস-নির্দিষ্ট, নতুন ডিভাইসের জন্য এনক্রিপ্ট করা ব্যাকআপ ব্যবহার করুন',
      hardwareSyncNote:
        'Hardware Keys: কোনো সিঙ্ক নেই, এনক্রিপ্ট করা ব্যাকআপ আলাদাভাবে সংরক্ষণ করুন',
      crossPlatformNote:
        'ক্রস-প্ল্যাটফর্ম সীমাবদ্ধতা: পাসকী বিভিন্ন ইকোসিস্টেমের মধ্যে সিঙ্ক হয় না (উদাহরণ, iPhone থেকে Android)। তবে, এনক্রিপ্ট করা ব্যাকআপ সম্পূর্ণভাবে ক্রস-প্ল্যাটফর্ম - মূল প্ল্যাটফর্ম যাই হোক না কেন, ব্যাকআপ ফাইল এবং পাসওয়ার্ড দিয়ে আপনি যেকোনো ডিভাইসে আপনার ওয়ালেট পুনরুদ্ধার করতে পারেন।',
      bestPracticesHeading: 'সর্বোত্তম অনুশীলন',
      practiceBackupFirst:
        'নতুন ডিভাইসে সিঙ্ক করার আগে সবসময় একটি এনক্রিপ্ট করা ব্যাকআপ তৈরি করুন',
      practiceVerifyAddresses: 'সিঙ্ক করার পরে ওয়ালেট ঠিকানা মিলছে কিনা যাচাই করুন',
      practiceUseDebugTools:
        'সিঙ্ক ডেটা সঠিকভাবে সংরক্ষিত হয়েছে কিনা তা যাচাই করতে Debug & Inspect Storage টুল ব্যবহার করুন',
      practiceNeverShareQr: 'আপনার QR কোড কখনও প্রকাশ্যে বা অবিশ্বস্ত চ্যানেলে শেয়ার করবেন না',
      practiceTreatAsSensitive:
        'QR কোডে শুধুমাত্র পাবলিক ঠিকানা থাকে, তবুও এগুলিকে সংবেদনশীল অ্যাকাউন্ট তথ্য হিসেবে বিবেচনা করুন',

      createBackupModalTitle: 'ব্যাকআপ তৈরি করতে পাসওয়ার্ড লিখুন',
      createBackupModalDescription:
        'ব্যাকআপ তৈরি করতে অনুগ্রহ করে আপনার পাসওয়ার্ড লিখুন। আপনার এনক্রিপ্ট করা ওয়ালেট ডেটা অ্যাক্সেস করার জন্য w3pk SDK-এর এটি প্রয়োজন।',
      restoreBackupModalTitle: 'ব্যাকআপ পুনরুদ্ধার করতে পাসওয়ার্ড লিখুন',
      restoreBackupModalDescription:
        'এই ব্যাকআপ ফাইলটি তৈরি করার সময় আপনি যে পাসওয়ার্ড ব্যবহার করেছিলেন তা লিখুন।',
      chooseUsernameModalTitle: 'পুনরুদ্ধার করা ওয়ালেটের জন্য ব্যবহারকারীর নাম বেছে নিন',
      chooseUsernameModalDescription:
        'এই ডিভাইসে কোনো বিদ্যমান পরিচয়পত্র পাওয়া যায়নি। একটি নতুন পাসকী দিয়ে আপনার পুনরুদ্ধার করা ওয়ালেট নিবন্ধন করতে অনুগ্রহ করে একটি ব্যবহারকারীর নাম বেছে নিন।',
      usernameFormatError:
        'ব্যবহারকারীর নাম অবশ্যই ৩-৫০ অক্ষরের হতে হবে, আন্ডারস্কোর/হাইফেন সহ আলফানিউমেরিক হতে হবে, এবং একটি আলফানিউমেরিক অক্ষর দিয়ে শুরু/শেষ হতে হবে।',
      restoringRegisteringText: 'পুনরুদ্ধার ও নিবন্ধন করা হচ্ছে...',
      restoreRegisterButton: 'পুনরুদ্ধার ও নিবন্ধন করুন',
      removeAccountModalTitle: 'অ্যাকাউন্ট সরান',
      removeAccountConfirm: username =>
        `আপনি কি নিশ্চিত যে আপনি ${username} অ্যাকাউন্টটি সরাতে চান?`,
      removeAccountWarning:
        'সতর্কতা: এটি এই ডিভাইস থেকে এই অ্যাকাউন্টের সমস্ত ডেটা মুছে ফেলবে। এগিয়ে যাওয়ার আগে নিশ্চিত করুন যে আপনার একটি ব্যাকআপ আছে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।',
      removeAccountLoggedOutNote:
        'এটি আপনার বর্তমানে লগইন করা অ্যাকাউন্ট। সরানোর পরে আপনাকে লগ আউট করা হবে।',
      removeAccountButton: 'অ্যাকাউন্ট সরান',
      localStorageModalTitle: 'LocalStorage পরিদর্শন',
      foundItemsText: n => `localStorage-এ ${n}টি আইটেম পাওয়া গেছে`,
      noDataFound: 'কোনো ডেটা পাওয়া যায়নি',
      indexedDBModalTitle: 'IndexedDB পরিদর্শন',
      foundDatabasesText: n => `${n}টি ডাটাবেস পাওয়া গেছে`,
      noDatabasesFound: 'কোনো w3pk-সম্পর্কিত ডাটাবেস পাওয়া যায়নি',

      registrationSuccessTitle: 'নিবন্ধন সফল হয়েছে',
      registrationSuccessDescription: 'আপনার নতুন অ্যাকাউন্ট তৈরি করা হয়েছে।',
      registrationFailedTitle: 'নিবন্ধন ব্যর্থ হয়েছে',
      registrationFailedDefaultDescription:
        'নিবন্ধন সম্পূর্ণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
      localStorageInspectedTitle: 'LocalStorage পরিদর্শন করা হয়েছে',
      localStorageInspectedDescription: n =>
        `${n}টি আইটেম পাওয়া গেছে। ফলাফল দেখতে নিচে স্ক্রল করুন।`,
      genericErrorTitle: 'ত্রুটি',
      failedInspectLocalStorage: 'localStorage পরিদর্শন করতে ব্যর্থ হয়েছে',
      indexedDBInspectedTitle: 'IndexedDB পরিদর্শন করা হয়েছে',
      indexedDBInspectedDescription: (dbCount, recordCount) =>
        `${recordCount} রেকর্ডস সহ ${dbCount}টি ডাটাবেস পাওয়া গেছে। ফলাফল দেখতে নিচে স্ক্রল করুন।`,
      failedInspectIndexedDB: 'IndexedDB পরিদর্শন করতে ব্যর্থ হয়েছে',
      itemClearedTitle: 'আইটেম মুছে ফেলা হয়েছে',
      itemClearedDescription: key => `localStorage থেকে "${key}" সরানো হয়েছে`,
      failedClearItem: key => `"${key}" মুছতে ব্যর্থ হয়েছে`,
      recordClearedTitle: 'রেকর্ড মুছে ফেলা হয়েছে',
      recordClearedDescription: (db, store) => `${db}/${store} থেকে রেকর্ড সরানো হয়েছে`,
      failedClearRecord: 'রেকর্ড মুছতে ব্যর্থ হয়েছে',
      errorLoadingAddressesTitle: 'ঠিকানা লোড করতে ত্রুটি',
      failedDeriveAddresses: 'ওয়ালেট ঠিকানা ডেরাইভ করতে ব্যর্থ হয়েছে',
      errorLoadingBackupStatusTitle: 'ব্যাকআপ অবস্থা লোড করতে ত্রুটি',
      failedCheckSecurityStatus: 'নিরাপত্তা অবস্থা পরীক্ষা করতে ব্যর্থ হয়েছে',
      accountRemovedTitle: 'অ্যাকাউন্ট সরানো হয়েছে',
      accountRemovedDescription: username =>
        `${username} অ্যাকাউন্টটি এই ডিভাইস থেকে সরানো হয়েছে।`,
      loggingOutTitle: 'লগ আউট করা হচ্ছে',
      loggingOutDescription: 'আপনি আপনার বর্তমান অ্যাকাউন্ট সরিয়ে দিয়েছেন। লগ আউট করা হচ্ছে...',
      failedRemoveAccount: 'অ্যাকাউন্ট সরাতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      errorReadingFileTitle: 'ফাইল পড়তে ত্রুটি',
      failedReadBackupFile: 'ব্যাকআপ ফাইল পড়তে ব্যর্থ হয়েছে',
      noBackupFileSelectedTitle: 'কোনো ব্যাকআপ ফাইল নির্বাচিত হয়নি',
      incompatibleBackupTitle: 'বেমানান ব্যাকআপ সংস্করণ',
      incompatibleBackupDescription:
        'এই ব্যাকআপটি w3pk-এর একটি পুরোনো সংস্করণ দিয়ে তৈরি হয়েছিল। অনুগ্রহ করে বর্তমান সংস্করণ দিয়ে একটি নতুন ব্যাকআপ তৈরি করুন।',
      walletRestoredTitle: 'ওয়ালেট পুনরুদ্ধার হয়েছে!',
      walletRestoredDescription: address =>
        `সফলভাবে পুনরুদ্ধার এবং ওভাররাইট করা হয়েছে ওয়ালেট: ${address}`,
      usernameRequiredRestoreDescription:
        'পুনরুদ্ধার করা ওয়ালেট দিয়ে নিবন্ধন করতে অনুগ্রহ করে একটি ব্যবহারকারীর নাম লিখুন।',
      walletRestoredRegisteredTitle: 'ওয়ালেট পুনরুদ্ধার ও নিবন্ধিত হয়েছে!',
      walletRestoredRegisteredDescription: address =>
        `সফলভাবে পুনরুদ্ধার এবং নিবন্ধিত করা হয়েছে ওয়ালেট: ${address}`,
      securityReportGeneratedTitle: 'নিরাপত্তা রিপোর্ট তৈরি হয়েছে',
      securityReportGeneratedDescription: 'নিচে বিস্তারিত বিশ্লেষণ দেখুন',
      inspectionFailedTitle: 'পরিদর্শন ব্যর্থ হয়েছে',
      inspectionFailedDescription:
        'হোস্ট অ্যাপ পরিদর্শন কাজ করেনি। এটি সম্ভবত Anthropic-এর রিকোয়েস্ট রেট সীমা অতিক্রম হওয়ার কারণে।',
      backupStatusRetrievedTitle: 'ব্যাকআপ অবস্থা পুনরুদ্ধার করা হয়েছে।',
      errorRetrievingStatusTitle: 'অবস্থা পুনরুদ্ধার করতে ত্রুটি।',
      unexpectedErrorDescription: 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।',
      errorCreatingBackupTitle: 'ব্যাকআপ তৈরি করতে ত্রুটি।',
      backupCreatedTitle: 'ব্যাকআপ সফলভাবে তৈরি হয়েছে!',
      invalidInputTitle: 'অবৈধ ইনপুট',
      guardianNameRequiredDescription: 'অভিভাবকের নাম প্রয়োজন',
      notEnoughGuardiansTitle: 'পর্যাপ্ত অভিভাবক নেই',
      notEnoughGuardiansDescription:
        'সামাজিক পুনরুদ্ধার সেটআপ করতে আপনার কমপক্ষে ২ জন অভিভাবক প্রয়োজন',
      invalidThresholdTitle: 'অবৈধ থ্রেশহোল্ড',
      invalidThresholdDescription: 'থ্রেশহোল্ড অভিভাবকের সংখ্যার চেয়ে বেশি হতে পারে না',
      socialRecoveryConfiguredTitle: 'সামাজিক পুনরুদ্ধার কনফিগার করা হয়েছে!',
      socialRecoveryConfiguredDescription: (threshold, count) =>
        `সফলভাবে ${count}-এর মধ্যে-${threshold} অভিভাবক পুনরুদ্ধার সেটআপ করা হয়েছে`,
      pleasePasteShareDescription: 'অনুগ্রহ করে একটি অভিভাবক শেয়ার কোড পেস্ট করুন',
      duplicateShareTitle: 'ডুপ্লিকেট শেয়ার',
      duplicateShareDescription: 'এই অভিভাবক শেয়ারটি ইতিমধ্যে যোগ করা হয়েছে',
      shareAddedTitle: 'শেয়ার যোগ করা হয়েছে',
      shareAddedDescription: name => `${name} থেকে শেয়ার যোগ করা হয়েছে`,
      invalidShareFormatTitle: 'অবৈধ শেয়ার ফরম্যাট',
      invalidShareFormatDescription:
        'অনুগ্রহ করে একটি বৈধ অভিভাবক শেয়ার কোড পেস্ট করুন (JSON ফরম্যাট)',
      notEnoughSharesTitle: 'পর্যাপ্ত শেয়ার নেই',
      notEnoughSharesDescription:
        'অপনার ওয়ালেট পুনরুদ্ধার করতে আপনার কমপক্ষে ২টি অভিভাবক শেয়ার প্রয়োজন',
      passwordRequiredRecoveryDescription:
        'ব্যাকআপ ফাইল ডিক্রিপ্ট করতে আপনাকে আপনার পাসওয়ার্ড লিখতে হবে',
      usernameRequiredRecoveryDescription:
        'আপনার পুনরুদ্ধার করা ওয়ালেট নিবন্ধন করতে আপনাকে একটি ব্যবহারকারীর নাম দিতে হবে',
      walletRecoveredTitle: 'ওয়ালেট সফলভাবে পুনরুদ্ধার হয়েছে!',
      walletRecoveredDescription: address =>
        `আপনার ওয়ালেট পুনরুদ্ধার এবং একটি নতুন পাসকী দিয়ে নিবন্ধিত হয়েছে: ${address}`,
      fileLoadedTitle: 'ফাইল লোড হয়েছে',
      fileLoadedDescription:
        'ফাইল থেকে অভিভাবক শেয়ার লোড হয়েছে। এটি যোগ করতে "Add Share"-এ ক্লিক করুন।',
      failedReadGuardianFile: 'অভিভাবক শেয়ার ফাইল পড়তে ব্যর্থ হয়েছে',
      cannotSaveTitle: 'সংরক্ষণ করা যাচ্ছে না',
      cannotSaveDescription: 'অবৈধ QR ডেটা অথবা ব্যবহারকারী প্রমাণীকৃত নয়',
      walletLinkedTitle: 'ওয়ালেট সফলভাবে লিঙ্ক হয়েছে!',
      walletLinkedDescription: address =>
        `ওয়ালেট ${address} আপনার পাসকী অ্যাকাউন্টের সাথে লিঙ্ক করা হয়েছে`,
      errorSavingLinkTitle: 'ওয়ালেট লিঙ্ক সংরক্ষণ করতে ত্রুটি',
      failedSaveSyncData: 'ওয়ালেট সিঙ্ক ডেটা সংরক্ষণ করতে ব্যর্থ হয়েছে',
      recoveryPasswordPrompt:
        'সামাজিক পুনরুদ্ধার কনফিগার করার সময় আপনি যে পাসওয়ার্ড সেট করেছিলেন তা লিখুন।\n\nএই পাসওয়ার্ডটি অভিভাবকদের সাথে শেয়ার করা হয়নি - আপনি এটি সেটআপের সময় নির্ধারণ করেছিলেন।',
      recoveryUsernamePrompt: address =>
        `আপনার নতুন পাসকী নিবন্ধনের জন্য একটি ব্যবহারকারীর নাম বেছে নিন।\n\nপুনরুদ্ধার করা হচ্ছে ওয়ালেট: ${address}`,
    },
    header: {
      registerTitle: 'নতুন অ্যাকাউন্ট নিবন্ধন করুন',
      walletInfoText:
        'একটি ইথেরিয়াম ওয়ালেট তৈরি করা হবে এবং আপনার ডিভাইসে নিরাপদে সংরক্ষিত হবে, যা আপনার বায়োমেট্রিক বা পিন দ্বারা সুরক্ষিত, ধন্যবাদ',
      usernameLabel: 'ব্যবহারকারীর নাম',
      usernamePlaceholder: 'আপনার ব্যবহারকারীর নাম লিখুন',
      usernameError:
        'ব্যবহারকারীর নাম অবশ্যই ৩-৫০ অক্ষরের হতে হবে এবং শুধুমাত্র অক্ষর, সংখ্যা, আন্ডারস্কোর এবং হাইফেন থাকতে পারবে। এটি অবশ্যই একটি অক্ষর বা সংখ্যা দিয়ে শুরু এবং শেষ হতে হবে।',
      createAccount: 'অ্যাকাউন্ট তৈরি করুন',
      optionsAriaLabel: 'বিকল্প',
      mainNavAriaLabel: 'প্রধান নেভিগেশন',
      usernameRequiredTitle: 'ব্যবহারকারীর নাম প্রয়োজন',
      usernameRequiredDescription: 'নিবন্ধনের জন্য অনুগ্রহ করে একটি ব্যবহারকারীর নাম লিখুন।',
      noAccountFoundTitle: 'কোনো অ্যাকাউন্ট পাওয়া যায়নি',
      noAccountFoundDescription:
        'কোনো পাসকী পাওয়া যায়নি। নতুন অ্যাকাউন্ট তৈরি করতে অনুগ্রহ করে নিবন্ধন করুন।',
      alreadyRegisteredLink: 'আমি ইতিমধ্যে অন্য ডিভাইসে নিবন্ধিত হয়েছি',
    },
    passwordModal: {
      passwordLabel: 'পাসওয়ার্ড',
      passwordPlaceholder: 'আপনার পাসওয়ার্ড লিখুন',
      passwordRequiredTitle: 'পাসওয়ার্ড প্রয়োজন।',
      passwordRequiredDescription: 'অনুগ্রহ করে আপনার পাসওয়ার্ড লিখুন।',
      weakPasswordTitle: 'দুর্বল পাসওয়ার্ড।',
      weakPasswordDescription:
        'অনুগ্রহ করে সমস্ত প্রয়োজনীয়তা পূরণ করে এমন একটি শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।',
      submissionErrorTitle: 'জমা দেওয়ার ত্রুটি।',
      submissionErrorDefaultDescription: 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।',
      requirementsNotMet: 'পাসওয়ার্ড সমস্ত প্রয়োজনীয়তা পূরণ করে না',
      strongPassword: 'শক্তিশালী পাসওয়ার্ড!',
      mustInclude: 'পাসওয়ার্ডে অবশ্যই থাকতে হবে:',
      reqMinLength: 'কমপক্ষে ১২টি অক্ষর',
      reqUpperCase: 'একটি বড় হাতের অক্ষর',
      reqLowerCase: 'একটি ছোট হাতের অক্ষর',
      reqNumber: 'একটি সংখ্যা',
      reqSpecialChar: 'একটি বিশেষ অক্ষর',
      satisfied: ' (পূরণ হয়েছে)',
      required: ' (প্রয়োজন)',
      submit: 'জমা দিন',
    },
    about: {
      headingPrefix: 'সম্পর্কে',
      introPart1:
        'w3pk হলো একটি পাসওয়ার্ডবিহীন Web3 প্রমাণীকরণ SDK যাতে এনক্রিপ্ট করা ওয়ালেট এবং গোপনীয়তা বৈশিষ্ট্য রয়েছে। আপনি এটি যেকোনো JS/TS-ভিত্তিক ওয়েব অ্যাপে ব্যবহার করতে পারেন (Next.js, Vue, Angular, Svelte, …)।',
      introPart2:
        'একটি Next.js অ্যাপ টেমপ্লেট, এটি ফর্ক করে আপনার ইচ্ছামতো যা খুশি তৈরি করতে দ্বিধা করবেন না!',
      emailBoxText:
        'w3pk এখনও উন্নয়নাধীন। আমরা যখন নতুন বৈশিষ্ট্য প্রকাশ করি তখন ইমেইল পান (EIP-1193 সমর্থন, AI ক্ষমতা, Viem হেল্পার, চেইন অ্যাবস্ট্র্যাকশন এবং আরও অনেক কিছু)',
      emailPlaceholder: 'your@email.com',
      subscribeButton: 'সাবস্ক্রাইব করুন',
      githubLabel: 'GitHub',
      npmLabel: 'NPM',
      githubAriaLabel: 'GitHub-এ w3pk দেখুন (নতুন ট্যাবে খোলে)',
      npmAriaLabel: 'NPM-এ w3pk দেখুন (নতুন ট্যাবে খোলে)',
      codeRegisterComment: '// নিবন্ধন করুন',
      codeLoginComment: '// লগ ইন',
      codeLogoutComment: '// লগ আউট',
      featuresHeading: 'বৈশিষ্ট্য',
      feature1: 'পাসওয়ার্ডবিহীন প্রমাণীকরণ (WebAuthn/FIDO2)',
      feature2: 'ট্যাগ-ভিত্তিক অ্যাক্সেস নিয়ন্ত্রণ সহ অরিজিন-নির্দিষ্ট কী আইসোলেশন',
      feature3: 'সেশন ব্যবস্থাপনা (ইন-মেমরি + ঐচ্ছিক স্থায়ী)',
      feature4: 'HD ওয়ালেট জেনারেশন (BIP39/BIP44)',
      feature5: 'নিরাপত্তা মোড সহ মাল্টি-অ্যাড্রেস ডেরিভেশন (STANDARD/STRICT/YOLO)',
      feature6: 'একাধিক স্বাক্ষর পদ্ধতি (EIP-191, SIWE/EIP-4361, EIP-712, rawHash)',
      feature7: 'স্বয়ংক্রিয় RPC রেজোলিউশন সহ অন-চেইন লেনদেন প্রেরণ (`sendTransaction`)',
      feature8:
        'ethers, viem, wagmi, RainbowKit-এর জন্য EIP-1193 প্রোভাইডার (`getEIP1193Provider`)',
      feature9: 'ERC-5564 স্টেলথ ঠিকানা (অপ্ট-ইন)',
      feature10: 'ZK প্রিমিটিভ (জিরো-নলেজ প্রুফ জেনারেশন এবং যাচাইকরণ)',
      feature11: 'Chainlist সমর্থন (২৩৯০+ নেটওয়ার্ক)',
      feature12: 'EIP-7702 নেটওয়ার্ক শনাক্তকরণ (৩২৯+ নেটওয়ার্ক)',
      feature13:
        'বহিরাগত ওয়ালেট একীকরণ (EIP-7702-এর মাধ্যমে MetaMask/Ledger-কে w3pk-এ ডেলিগেট করুন)',
      feature14: 'EIP-7951 PRIMARY মোড (P-256 পাসকী স্বাক্ষর)',
      feature15: 'বিল্ড যাচাইকরণ (IPFS CID হ্যাশিং + DAO-পরিচালিত অনচেইন রেজিস্ট্রি)',
      feature16:
        'তিন-স্তরের ব্যাকআপ ও পুনরুদ্ধার (পাসকী সিঙ্ক, এনক্রিপ্ট করা ব্যাকআপ, সামাজিক পুনরুদ্ধার)',
      feature17: 'AI-চালিত হোস্ট অ্যাপ পরিদর্শন',
      invalidEmailTitle: 'অবৈধ ইমেইল',
      invalidEmailDescription: 'অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন',
      subscribeSuccessTitle: 'সফল হয়েছে!',
      subscribeSuccessDescription: 'আপনি w3pk আপডেটের জন্য সাবস্ক্রাইব করেছেন',
      subscribeErrorTitle: 'ত্রুটি',
      subscribeErrorDescription: 'সাবস্ক্রাইব করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    },
  },

  // Russian
  ru: {
    common: {
      login: 'Вход',
      logout: 'Выход',
      pleaseLogin: 'Пожалуйста, войдите',
      cancel: 'Отмена',
      srLoadingText: 'Загрузка, пожалуйста подождите...',
      loading: 'Загрузка...',
      notAvailable: 'Недоступно',
      close: 'Закрыть',
    },
    home: {
      title: 'Добро пожаловать!',
      subtitle: 'Рады видеть вас здесь!',
      greeting: 'Привет, незнакомец!',
      greetingSubtitle: 'Расслабьтесь и создайте что-нибудь крутое!',
      signMessage: 'Подписать сообщение',
      messageSignedTitle: 'Сообщение подписано',
      messageSignedDescription: signature => `Подпись: ${signature.substring(0, 20)}...`,
    },
    navigation: {
      about: 'О нас',
      settings: 'Настройки',
    },
    settings: {
      title: 'Настройки',
      loginRequired: 'Пожалуйста, войдите, чтобы получить доступ к настройкам',
      subtitle: 'Управляйте своими аккаунтами, резервными копиями и параметрами восстановления',
      tabAccounts: 'Аккаунты',
      tabBackup: 'Резервное копирование',
      tabSync: 'Синхронизация',
      tabRecovery: 'Социальное восстановление',

      browserInfoHeading: 'Информация о браузере',
      browserLabel: 'Браузер:',
      versionLabel: 'Версия:',
      osLabel: 'Операционная система:',
      webauthnSupportLabel: 'Поддержка WebAuthn:',
      compatibilityLabel: 'Совместимость:',
      available: 'Доступно',
      notAvailable: 'Недоступно',
      fullySupported: 'Полностью поддерживается',
      knownIssues: 'Известные проблемы',
      notSupported: 'Не поддерживается',
      browserNotSupportedTitle: 'Браузер не поддерживается',
      knownIssuesTitle: 'Обнаружены известные проблемы',
      recommendationTitle: 'Рекомендация',
      webauthnNotAvailableTitle: 'WebAuthn недоступен',
      webauthnNotAvailableText:
        'Ваш браузер не поддерживает WebAuthn, который необходим для аутентификации w3pk. Пожалуйста, обновите браузер или используйте один из поддерживаемых браузеров:',
      browserChrome: 'Chrome 67+ (май 2018)',
      browserFirefox: 'Firefox 60+ (май 2018)',
      browserSafari: 'Safari 14+ (сентябрь 2020)',
      browserEdge: 'Edge 18+ (ноябрь 2018)',
      browserSamsung: 'Samsung Internet 11+ (февраль 2020)',
      androidRecommendedHeading: 'Рекомендуемые браузеры для Android',
      samsungInternetNote:
        'Samsung Internet (лучший выбор для устройств Samsung) — ✅ Подтверждённая работа',
      chromeNote: 'Chrome — ✅ Надёжно работает',
      edgeNote: 'Edge — ✅ Надёжно работает',
      firefoxMobileNote:
        'Firefox Mobile — ⚠️ Не рекомендуется (известны проблемы с сохранением ключей доступа)',

      restoreBackupHeading: 'Восстановление из резервной копии',
      restoreBackupDescription:
        'Если у вас есть файл резервной копии, вы можете восстановить кошелёк без предварительного входа.',
      restoreBackupSyncHint:
        'Чтобы синхронизировать с другим устройством: войдите на другом устройстве, перейдите в Настройки → Создать резервную копию, чтобы скачать зашифрованный файл резервной копии, затем загрузите его здесь и введите тот же пароль.',
      restoringText: 'Восстановление...',
      restoreBackupButton: 'Восстановить из файла резервной копии',

      debugStorageHeading: 'Отладка и проверка хранилища',
      debugStorageDescription: 'Проверка хранилища браузера и журналов активности',
      inspectingText: 'Проверка...',
      inspectLocalStorageButton: 'Проверить LocalStorage',
      inspectIndexedDBButton: 'Проверить IndexedDB',

      inspectSecurityDescriptionSmall:
        'Анализ этого приложения на предмет методов транзакций и подписи.',
      inspectSecurityButton: 'Проверить безопасность',
      consoleCommandLabel: 'Команда консоли:',
      clearReportButton: 'Очистить отчёт',
      filesAnalyzedLabel: 'Проанализировано файлов:',
      inspectionHeadingBig: 'Проверка безопасности',
      inspectSecurityDescriptionBig:
        'Сформируйте подробный отчёт о безопасности этого приложения. Отчёт проанализирует все методы транзакций и подписи.',
      inspectNowButton: 'Проверить сейчас',
      consoleHintText: 'Вы также можете выполнить await w3pk.inspectNow() в консоли браузера',
      securityReportHeading: 'Отчёт о безопасности',
      appUrlLabel: 'URL приложения:',

      localStorageResultsHeading: 'Результаты LocalStorage',
      itemsCount: n => `${n} ${ruPlural(n, 'элемент', 'элемента', 'элементов')}`,
      encryptedBadge: 'Зашифровано',
      clearItemAria: 'Очистить элемент',
      indexedDBResultsHeading: 'Результаты IndexedDB',
      databasesCount: n => `${n} ${ruPlural(n, 'база данных', 'базы данных', 'баз данных')}`,
      storesLabel: 'Хранилища:',
      recordsLabel: 'Записи:',
      clearRecordAria: 'Очистить запись',
      storeKeyLabel: (store, key) => `Хранилище: ${store} | Ключ: ${key}`,

      currentAccountHeading: 'Текущий аккаунт',
      currentAccountDescription: 'Это ваш текущий активный аккаунт.',
      noAccounts: 'На этом устройстве не найдено аккаунтов.',
      currentBadge: 'Текущий',
      usernameLabel: username => `Имя пользователя: ${username}`,
      deleteAccountAria: 'Удалить аккаунт',

      sessionHeading: 'Поддерживать сессию активной',
      sessionDescription:
        'Укажите, как долго ваша сессия должна оставаться активной без запроса ключа доступа. По истечении этого срока при следующем посещении один раз запрашивается биометрия/PIN-код и начинается новая сессия — то есть это значение также определяет, как часто вы будете проходить повторную аутентификацию. Эта настройка применяется только к режимам STANDARD и YOLO. Режимы STRICT и PRIMARY всегда требуют новой аутентификации и не используют постоянные сессии.',
      noStoredSessionText:
        'На этом устройстве нет сохранённой сессии. Похоже, ваш аутентификатор не поддерживает расширение WebAuthn PRF, которое требуется w3pk для безопасного поддержания сессий. Ваша сессия будет храниться только в памяти: она завершается при закрытии вкладки, и при каждом посещении будет запрашиваться биометрия/PIN-код. Всё остальное работает в обычном режиме.',
      sessionDurationLabel: 'Длительность сессии',
      dayLabel: n => `${n} ${ruPlural(n, 'день', 'дня', 'дней')}`,
      oneDayLabel: '1 день',
      thirtyDaysLabel: '30 дней',
      sessionHowItWorksTitle: 'Как это работает:',
      sessionHowItWorksText:
        'Каждый раз, когда вы входите с помощью биометрии/PIN-кода, ваш аутентификатор выдаёт аппаратно защищённый секрет (расширение WebAuthn PRF), который шифрует вашу сессию на этом устройстве — ничто из сохранённого на диске не позволяет воссоздать этот ключ. Отсчёт начинается заново при каждом реальном входе: при длительности сессии 7 дней вход сегодня сохранит вас в системе на 7 дней, после чего система один раз запросит подтверждение, и сессия будет заново зашифрована новым ключом.',

      walletBackupHeading: 'Резервное копирование кошелька',
      walletBackupDescription:
        'Создавайте зашифрованные резервные копии кошелька, чтобы никогда не потерять доступ',
      currentAccountBackupHeading: 'Текущий аккаунт',
      loggedInAsLabel: 'Вы вошли как:',
      loadingAddressesText: 'Загрузка адресов...',
      index0Label: 'Адрес с индексом №0:',
      mainAddressLabel:
        'Адрес, привязанный к источнику, режим STANDARD, с меткой MAIN (кошелёк по умолчанию):',
      loadingText: 'Загрузка...',
      securityStatusHeading: 'Статус безопасности',
      checkingStatusText: 'Проверка статуса резервной копии...',
      refreshHeading: 'Обновить статус резервной копии',
      refreshDescription:
        'Обновите текущую оценку безопасности и рекомендации по резервному копированию',
      checkingText: 'Проверка...',
      refreshButton: 'Обновить статус',
      createHeading: 'Создать резервную копию',
      createDescription: 'Скачайте зашифрованный файл резервной копии, защищённый вашим паролем',
      creatingText: 'Создание...',
      createButton: 'Создать резервную копию',
      restoreHeadingCard: 'Восстановление из резервной копии',
      restoreDescriptionCard: 'Восстановите кошелёк из зашифрованного файла резервной копии',
      restoreButtonCard: 'Восстановить резервную копию',
      aboutBackupHeading: 'О резервном копировании на стороне клиента',
      aboutBackupPara1:
        'Основной секрет вашего кошелька (мнемоническая фраза) полностью генерируется и шифруется на вашем устройстве. Процесс резервного копирования извлекает эти зашифрованные данные из локального хранилища браузера с помощью вашего пароля, а затем упаковывает их в защищённый файл для скачивания.',
      aboutBackupPara2:
        'Ключ шифрования вашего кошелька формируется на основе подписи WebAuthn, для создания которой требуется биометрическая аутентификация (отпечаток пальца, сканирование лица) или PIN-код устройства. Это означает, что даже если кто-то получит доступ к зашифрованным данным, хранящимся в вашем браузере, расшифровать их без вашего физического устройства и аутентификации будет невозможно.',
      aboutBackupPara3:
        'Ваш файл резервной копии зашифрован с использованием AES-256-GCM с ключом, полученным из указанного вами пароля. Храните этот файл в надёжном месте и не забывайте пароль.',
      aboutBackupWarning:
        'Если вы одновременно потеряете доступ к устройству, ключу доступа И файлу резервной копии/паролю, восстановить кошелёк будет невозможно.',

      socialRecoveryHeading: 'Социальное восстановление',
      socialRecoveryDescription:
        'Распределите восстановление кошелька между доверенными хранителями с помощью схемы Шамира (Shamir Secret Sharing)',
      setupHeading: 'Настройка социального восстановления',
      setupDescription: (threshold, count) =>
        `Добавьте доверенных хранителей, которые помогут вам восстановить кошелёк. Вам потребуется ${threshold} из ${count || '?'} хранителей для восстановления.`,
      guardianNameLabel: 'Имя хранителя *',
      guardianEmailLabel: 'Email хранителя (необязательно)',
      addGuardianButton: 'Добавить хранителя',
      guardiansListHeading: n => `Хранители (${n})`,
      removeGuardianAria: 'Удалить хранителя',
      thresholdLabel: (threshold, count) => `Порог восстановления: ${threshold} из ${count}`,
      thresholdDescription: 'Количество хранителей, необходимое для восстановления кошелька',
      setupSocialRecoveryButton: (threshold, count) =>
        `Настроить социальное восстановление (${threshold} из ${count || '?'})`,
      howItWorksRecoveryInfo: (count, threshold) =>
        `Как это работает: восстановление вашего кошелька будет разделено на ${count || '?'} зашифрованных долей с помощью схемы Шамира (Shamir Secret Sharing). Чтобы восстановить кошелёк, потребуется объединить доли от ${threshold} хранителей. Ни один хранитель не может получить доступ к вашему кошельку в одиночку.`,
      recoverWalletHeading: 'Восстановить кошелёк',
      hideButton: 'Скрыть',
      showButton: 'Показать',
      recoverDescription:
        'Потеряли доступ к кошельку? Соберите доли хранителей, чтобы восстановить его.',
      shareCodeLabel: 'Код доли хранителя',
      sharePlaceholder:
        'Вставьте сюда JSON доли хранителя (например, {"guardianId":"...","share":"..."})',
      addShareButton: 'Добавить долю',
      uploadFileButton: 'Загрузить файл',
      clearAllButton: 'Очистить всё',
      collectedSharesHeading: n => `Собранные доли (${n})`,
      guardianFallback: 'Хранитель',
      shareIndexLabel: n => `(№${n})`,
      addedAtLabel: time => `Добавлено ${time}`,
      removeShareAria: 'Удалить долю',
      invalidShareLabel: n => `Недействительная доля №${n}`,
      progressHeading: 'Ход восстановления',
      progressText: n =>
        `Собрано ${n} ${ruPlural(n, 'доля', 'доли', 'долей')}. Для восстановления нужно как минимум 2 доли.`,
      recoveringText: 'Восстановление...',
      recoverButton: n => `Восстановить кошелёк (${n} ${ruPlural(n, 'доля', 'доли', 'долей')})`,
      importantWarning:
        'Важно: убедитесь, что доли получены от правильных хранителей. Недействительные доли приведут к сбою восстановления.',
      activeHeading: 'Социальное восстановление активно',
      activeDescription: (threshold, count) =>
        `Ваш кошелёк защищён восстановлением по схеме ${threshold} из ${count} хранителей`,
      generateInviteButton: 'Сгенерировать приглашение',
      removeConfigQuestion:
        'Все хранители получили свои доли? Теперь вы можете удалить конфигурацию хранителей из локального хранилища. Доли надёжно хранятся у ваших хранителей и могут быть использованы для восстановления в любое время.',
      removeConfigButton: 'Очистить конфигурацию хранителей из локального хранилища',
      invitationHeading: 'Приглашение хранителя',
      downloadInviteButton: 'Скачать приглашение',
      sendInviteText: name =>
        `Отправьте это приглашение пользователю ${name} по защищённому каналу`,

      deviceSyncHeading: 'Синхронизация устройств',
      deviceSyncDescription:
        'Ваш ключ доступа автоматически синхронизируется между устройствами через сервисы платформы',
      qrHeading: 'QR-код синхронизации',
      qrDescription:
        'Сгенерируйте QR-код с адресами вашего кошелька, чтобы легко синхронизировать или проверить информацию об аккаунте на другом устройстве.',
      generateQrButton: 'Сгенерировать QR-код синхронизации',
      qrNote:
        'Примечание: этот QR-код содержит только публичные адреса вашего кошелька. Он НЕ содержит ваши приватные ключи или фразу восстановления. Используйте его для проверки аккаунта на другом устройстве.',
      hideQrButton: 'Скрыть QR-код',
      verifyHeading: 'Проверка данных QR-кода',
      verifyDescription:
        'Вставьте строку JSON из отсканированного QR-кода, чтобы проверить адреса кошелька.',
      verifyPlaceholder:
        'Вставьте сюда данные JSON (например, {"username":"...","ethereumAddress":"..."})',
      errorLabel: 'Ошибка:',
      parsedDataLabel: 'Разобранные данные:',
      usernameFieldLabel: 'Имя пользователя:',
      ethAddressLabel: 'Адрес Ethereum:',
      index0FieldLabel: 'Индекс №0:',
      mainTaggedLabel: 'С меткой MAIN:',
      openbarTaggedLabel: 'С меткой OPENBAR:',
      generatedLabel: 'Сгенерировано:',
      linkWalletButton: 'Привязать этот кошелёк к аккаунту с ключом доступа',
      linkExplanation:
        'Что произойдёт при привязке: адреса кошелька будут сохранены как в localStorage, так и в IndexedDB, что создаст постоянную связь между вашим аккаунтом с ключом доступа и этим HD-кошельком. Это можно использовать для проверки или синхронизации данных кошелька между устройствами.',
      howQrWorksHeading: 'Как работает синхронизация кошелька через QR-код',
      qrStep1:
        'Шаг 1: Сгенерируйте QR-код — на основном устройстве сгенерируйте QR-код, содержащий публичные адреса вашего кошелька. Этим QR-кодом безопасно делиться, так как он содержит только публичную информацию.',
      qrStep2:
        'Шаг 2: Отсканируйте и проверьте — на дополнительном устройстве отсканируйте QR-код с помощью любого приложения для сканирования QR-кодов или вручную скопируйте данные JSON, отображаемые в QR-коде.',
      qrStep3:
        'Шаг 3: Свяжите кошельки — вставьте данные JSON в поле проверки выше и нажмите «Привязать этот кошелёк». Это создаст постоянную связь между вашим аккаунтом с ключом доступа и адресами HD-кошелька.',
      whatGetsStored:
        'Что сохраняется: в localStorage и IndexedDB сохраняются только публичные адреса кошелька. Ваши приватные ключи и фраза восстановления остаются в безопасности и никогда не передаются и не сохраняются через этот механизм синхронизации.',
      platformSyncHeading: 'Синхронизация ключа доступа на платформе',
      platformSyncIntro:
        'Учётные данные вашего ключа доступа автоматически синхронизируются между устройствами в рамках одной экосистемы:',
      appleSyncNote: 'Apple: синхронизация через iCloud Keychain (iPhone, iPad, Mac)',
      googleSyncNote: 'Google: синхронизация через Password Manager (Android, Chrome)',
      windowsSyncNote:
        'Windows Hello: привязан к конкретному устройству, для новых устройств используйте зашифрованную резервную копию',
      hardwareSyncNote:
        'Аппаратные ключи: синхронизация отсутствует, храните зашифрованную резервную копию отдельно',
      crossPlatformNote:
        'Ограничение между платформами: ключи доступа не синхронизируются между разными экосистемами (например, с iPhone на Android). Однако зашифрованные резервные копии полностью кроссплатформенны — вы можете восстановить кошелёк на любом устройстве, имея файл резервной копии и пароль, независимо от исходной платформы.',
      bestPracticesHeading: 'Рекомендации',
      practiceBackupFirst:
        'Всегда создавайте зашифрованную резервную копию перед синхронизацией с новым устройством',
      practiceVerifyAddresses: 'Проверяйте совпадение адресов кошелька после синхронизации',
      practiceUseDebugTools:
        'Используйте инструменты отладки и проверки хранилища, чтобы убедиться в корректном сохранении данных синхронизации',
      practiceNeverShareQr: 'Никогда не публикуйте свой QR-код открыто или в непроверенных каналах',
      practiceTreatAsSensitive:
        'QR-коды содержат только публичные адреса, но всё равно относитесь к ним как к конфиденциальной информации об аккаунте',

      createBackupModalTitle: 'Введите пароль для создания резервной копии',
      createBackupModalDescription:
        'Пожалуйста, введите пароль для создания резервной копии. Это требуется SDK w3pk для доступа к зашифрованным данным кошелька.',
      restoreBackupModalTitle: 'Введите пароль для восстановления резервной копии',
      restoreBackupModalDescription:
        'Пожалуйста, введите пароль, который вы использовали при создании этого файла резервной копии.',
      chooseUsernameModalTitle: 'Выберите имя пользователя для восстановленного кошелька',
      chooseUsernameModalDescription:
        'На этом устройстве не найдено существующих учётных данных. Пожалуйста, выберите имя пользователя, чтобы зарегистрировать восстановленный кошелёк с новым ключом доступа.',
      usernameFormatError:
        'Имя пользователя должно содержать от 3 до 50 символов, включать только буквы, цифры, подчёркивания и дефисы, а также начинаться и заканчиваться буквой или цифрой.',
      restoringRegisteringText: 'Восстановление и регистрация...',
      restoreRegisterButton: 'Восстановить и зарегистрировать',
      removeAccountModalTitle: 'Удалить аккаунт',
      removeAccountConfirm: username => `Вы уверены, что хотите удалить аккаунт ${username}?`,
      removeAccountWarning:
        'Предупреждение: это удалит все данные этого аккаунта с данного устройства. Прежде чем продолжить, убедитесь, что у вас есть резервная копия. Это действие нельзя отменить.',
      removeAccountLoggedOutNote:
        'Это ваш текущий активный аккаунт. После удаления вы будете выведены из системы.',
      removeAccountButton: 'Удалить аккаунт',
      localStorageModalTitle: 'Проверка LocalStorage',
      foundItemsText: n =>
        `Найдено ${n} ${ruPlural(n, 'элемент', 'элемента', 'элементов')} в localStorage`,
      noDataFound: 'Данные не найдены',
      indexedDBModalTitle: 'Проверка IndexedDB',
      foundDatabasesText: n =>
        `Найдено ${n} ${ruPlural(n, 'база данных', 'базы данных', 'баз данных')}`,
      noDatabasesFound: 'Базы данных, связанные с w3pk, не найдены',

      registrationSuccessTitle: 'Регистрация успешна',
      registrationSuccessDescription: 'Ваш новый аккаунт создан.',
      registrationFailedTitle: 'Ошибка регистрации',
      registrationFailedDefaultDescription:
        'Не удалось завершить регистрацию. Пожалуйста, попробуйте снова.',
      localStorageInspectedTitle: 'LocalStorage проверен',
      localStorageInspectedDescription: n =>
        `Найдено ${n} ${ruPlural(n, 'элемент', 'элемента', 'элементов')}. Прокрутите вниз, чтобы увидеть результаты.`,
      genericErrorTitle: 'Ошибка',
      failedInspectLocalStorage: 'Не удалось проверить localStorage',
      indexedDBInspectedTitle: 'IndexedDB проверен',
      indexedDBInspectedDescription: (dbCount, recordCount) =>
        `Найдено ${dbCount} ${ruPlural(dbCount, 'база данных', 'базы данных', 'баз данных')} и ${recordCount} ${ruPlural(recordCount, 'запись', 'записи', 'записей')}. Прокрутите вниз, чтобы увидеть результаты.`,
      failedInspectIndexedDB: 'Не удалось проверить IndexedDB',
      itemClearedTitle: 'Элемент очищен',
      itemClearedDescription: key => `Удалён элемент «${key}» из localStorage`,
      failedClearItem: key => `Не удалось очистить «${key}»`,
      recordClearedTitle: 'Запись очищена',
      recordClearedDescription: (db, store) => `Запись удалена из ${db}/${store}`,
      failedClearRecord: 'Не удалось очистить запись',
      errorLoadingAddressesTitle: 'Ошибка загрузки адресов',
      failedDeriveAddresses: 'Не удалось получить адреса кошелька',
      errorLoadingBackupStatusTitle: 'Ошибка загрузки статуса резервной копии',
      failedCheckSecurityStatus: 'Не удалось проверить статус безопасности',
      accountRemovedTitle: 'Аккаунт удалён',
      accountRemovedDescription: username => `Аккаунт ${username} удалён с этого устройства.`,
      loggingOutTitle: 'Выход из системы',
      loggingOutDescription: 'Вы удалили свой текущий аккаунт. Выполняется выход...',
      failedRemoveAccount: 'Не удалось удалить аккаунт. Пожалуйста, попробуйте снова.',
      errorReadingFileTitle: 'Ошибка чтения файла',
      failedReadBackupFile: 'Не удалось прочитать файл резервной копии',
      noBackupFileSelectedTitle: 'Файл резервной копии не выбран',
      incompatibleBackupTitle: 'Несовместимая версия резервной копии',
      incompatibleBackupDescription:
        'Эта резервная копия была создана в более старой версии w3pk. Пожалуйста, создайте новую резервную копию в текущей версии.',
      walletRestoredTitle: 'Кошелёк восстановлен!',
      walletRestoredDescription: address =>
        `Кошелёк успешно восстановлен и перезаписан: ${address}`,
      usernameRequiredRestoreDescription:
        'Пожалуйста, введите имя пользователя для регистрации восстановленного кошелька.',
      walletRestoredRegisteredTitle: 'Кошелёк восстановлен и зарегистрирован!',
      walletRestoredRegisteredDescription: address =>
        `Кошелёк успешно восстановлен и зарегистрирован: ${address}`,
      securityReportGeneratedTitle: 'Отчёт о безопасности сформирован',
      securityReportGeneratedDescription: 'Просмотрите подробный анализ ниже',
      inspectionFailedTitle: 'Ошибка проверки',
      inspectionFailedDescription:
        'Проверка хост-приложения не удалась. Вероятно, это связано с превышением лимита запросов Anthropic.',
      backupStatusRetrievedTitle: 'Статус резервной копии получен.',
      errorRetrievingStatusTitle: 'Ошибка получения статуса.',
      unexpectedErrorDescription: 'Произошла непредвиденная ошибка.',
      errorCreatingBackupTitle: 'Ошибка создания резервной копии.',
      backupCreatedTitle: 'Резервная копия успешно создана!',
      invalidInputTitle: 'Некорректные данные',
      guardianNameRequiredDescription: 'Требуется имя хранителя',
      notEnoughGuardiansTitle: 'Недостаточно хранителей',
      notEnoughGuardiansDescription:
        'Для настройки социального восстановления требуется как минимум 2 хранителя',
      invalidThresholdTitle: 'Некорректный порог',
      invalidThresholdDescription: 'Порог не может превышать количество хранителей',
      socialRecoveryConfiguredTitle: 'Социальное восстановление настроено!',
      socialRecoveryConfiguredDescription: (threshold, count) =>
        `Восстановление по схеме ${threshold} из ${count} хранителей успешно настроено`,
      pleasePasteShareDescription: 'Пожалуйста, вставьте код доли хранителя',
      duplicateShareTitle: 'Дублирующаяся доля',
      duplicateShareDescription: 'Эта доля хранителя уже добавлена',
      shareAddedTitle: 'Доля добавлена',
      shareAddedDescription: name => `Добавлена доля от ${name}`,
      invalidShareFormatTitle: 'Неверный формат доли',
      invalidShareFormatDescription:
        'Пожалуйста, вставьте корректный код доли хранителя (в формате JSON)',
      notEnoughSharesTitle: 'Недостаточно долей',
      notEnoughSharesDescription:
        'Для восстановления кошелька требуется как минимум 2 доли хранителей',
      passwordRequiredRecoveryDescription:
        'Для расшифровки файла резервной копии необходимо ввести пароль',
      usernameRequiredRecoveryDescription:
        'Для регистрации восстановленного кошелька необходимо указать имя пользователя',
      walletRecoveredTitle: 'Кошелёк успешно восстановлен!',
      walletRecoveredDescription: address =>
        `Ваш кошелёк восстановлен и зарегистрирован с новым ключом доступа: ${address}`,
      fileLoadedTitle: 'Файл загружен',
      fileLoadedDescription:
        'Доля хранителя загружена из файла. Нажмите «Добавить долю», чтобы добавить её.',
      failedReadGuardianFile: 'Не удалось прочитать файл доли хранителя',
      cannotSaveTitle: 'Невозможно сохранить',
      cannotSaveDescription: 'Некорректные данные QR-кода или пользователь не аутентифицирован',
      walletLinkedTitle: 'Кошелёк успешно привязан!',
      walletLinkedDescription: address =>
        `Кошелёк ${address} привязан к вашему аккаунту с ключом доступа`,
      errorSavingLinkTitle: 'Ошибка сохранения привязки кошелька',
      failedSaveSyncData: 'Не удалось сохранить данные синхронизации кошелька',
      recoveryPasswordPrompt:
        'Введите пароль, который вы задали при настройке социального восстановления.\n\nЭтот пароль НЕ передавался хранителям — вы задали его при настройке.',
      recoveryUsernamePrompt: address =>
        `Выберите имя пользователя для регистрации нового ключа доступа.\n\nВосстанавливаемый кошелёк: ${address}`,
    },
    header: {
      registerTitle: 'Регистрация нового аккаунта',
      walletInfoText:
        'Будет создан Ethereum-кошелёк, надёжно хранящийся на вашем устройстве и защищённый биометрией или PIN-кодом благодаря',
      usernameLabel: 'Имя пользователя',
      usernamePlaceholder: 'Введите имя пользователя',
      usernameError:
        'Имя пользователя должно содержать от 3 до 50 символов и включать только буквы, цифры, подчёркивания и дефисы. Оно должно начинаться и заканчиваться буквой или цифрой.',
      createAccount: 'Создать аккаунт',
      optionsAriaLabel: 'Опции',
      mainNavAriaLabel: 'Основная навигация',
      usernameRequiredTitle: 'Требуется имя пользователя',
      usernameRequiredDescription: 'Пожалуйста, введите имя пользователя для регистрации.',
      noAccountFoundTitle: 'Аккаунт не найден',
      noAccountFoundDescription:
        'Ключ доступа не найден. Пожалуйста, зарегистрируйтесь, чтобы создать новый аккаунт.',
      alreadyRegisteredLink: 'Я уже зарегистрирован на другом устройстве',
    },
    passwordModal: {
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Введите пароль',
      passwordRequiredTitle: 'Требуется пароль.',
      passwordRequiredDescription: 'Пожалуйста, введите пароль.',
      weakPasswordTitle: 'Слабый пароль.',
      weakPasswordDescription:
        'Пожалуйста, используйте более надёжный пароль, отвечающий всем требованиям.',
      submissionErrorTitle: 'Ошибка отправки.',
      submissionErrorDefaultDescription: 'Произошла непредвиденная ошибка.',
      requirementsNotMet: 'Пароль не соответствует всем требованиям',
      strongPassword: 'Надёжный пароль!',
      mustInclude: 'Пароль должен содержать:',
      reqMinLength: 'Не менее 12 символов',
      reqUpperCase: 'Одну заглавную букву',
      reqLowerCase: 'Одну строчную букву',
      reqNumber: 'Одну цифру',
      reqSpecialChar: 'Один специальный символ',
      satisfied: ' (выполнено)',
      required: ' (требуется)',
      submit: 'Отправить',
    },
    about: {
      headingPrefix: 'О',
      introPart1:
        'w3pk — это SDK для беспарольной Web3-аутентификации с зашифрованными кошельками и функциями конфиденциальности. Его можно использовать в любом веб-приложении на основе JS/TS (Next.js, Vue, Angular, Svelte и др.).',
      introPart2:
        '— это шаблон приложения на Next.js, не стесняйтесь сделать форк и создать всё, что захотите!',
      emailBoxText:
        'w3pk находится в разработке. Подписывайтесь на рассылку, чтобы узнавать о новых функциях (поддержка EIP-1193, возможности ИИ, хелперы Viem, абстракция сети и многое другое)',
      emailPlaceholder: 'your@email.com',
      subscribeButton: 'Подписаться',
      githubLabel: 'GitHub',
      npmLabel: 'NPM',
      githubAriaLabel: 'Просмотреть w3pk на GitHub (открывается в новой вкладке)',
      npmAriaLabel: 'Просмотреть w3pk на NPM (открывается в новой вкладке)',
      codeRegisterComment: '// Регистрация',
      codeLoginComment: '// Вход',
      codeLogoutComment: '// Выход',
      featuresHeading: 'Возможности',
      feature1: 'Беспарольная аутентификация (WebAuthn/FIDO2)',
      feature2: 'Изоляция ключей по источнику с контролем доступа на основе меток',
      feature3: 'Управление сессиями (в памяти + опциональная постоянная сессия)',
      feature4: 'Генерация HD-кошельков (BIP39/BIP44)',
      feature5: 'Деривация нескольких адресов с режимами безопасности (STANDARD/STRICT/YOLO)',
      feature6: 'Несколько методов подписи (EIP-191, SIWE/EIP-4361, EIP-712, rawHash)',
      feature7: 'Отправка ончейн-транзакций с автоматическим определением RPC (`sendTransaction`)',
      feature8: 'Провайдер EIP-1193 для ethers, viem, wagmi, RainbowKit (`getEIP1193Provider`)',
      feature9: 'Скрытые адреса ERC-5564 (опционально)',
      feature10: 'ZK-примитивы (генерация и проверка доказательств с нулевым разглашением)',
      feature11: 'Поддержка Chainlist (более 2390 сетей)',
      feature12: 'Определение сетей EIP-7702 (более 329 сетей)',
      feature13:
        'Интеграция внешних кошельков (делегирование MetaMask/Ledger в w3pk через EIP-7702)',
      feature14: 'Режим PRIMARY EIP-7951 (подпись ключом доступа P-256)',
      feature15: 'Проверка сборки (хеширование IPFS CID + ончейн-реестр, поддерживаемый DAO)',
      feature16:
        'Трёхуровневое резервное копирование и восстановление (синхронизация ключа доступа, зашифрованные резервные копии, социальное восстановление)',
      feature17: 'Проверка хост-приложения на основе ИИ',
      invalidEmailTitle: 'Неверный email',
      invalidEmailDescription: 'Пожалуйста, введите корректный адрес электронной почты',
      subscribeSuccessTitle: 'Успешно!',
      subscribeSuccessDescription: 'Вы подписались на обновления w3pk',
      subscribeErrorTitle: 'Ошибка',
      subscribeErrorDescription: 'Не удалось подписаться. Пожалуйста, попробуйте снова.',
    },
  },

  // Portuguese
  pt: {
    common: {
      login: 'Entrar',
      logout: 'Sair',
      pleaseLogin: 'Por favor faça login',
      cancel: 'Cancelar',
      srLoadingText: 'Carregando, por favor aguarde...',
      loading: 'Carregando...',
      notAvailable: 'Não disponível',
      close: 'Fechar',
    },
    home: {
      title: 'Bem-vindo!',
      subtitle: 'É um prazer tê-lo aqui!',
      greeting: 'Olá Anon!',
      greetingSubtitle: 'Sente-se, relaxe e construa algo legal!',
      signMessage: 'Assinar uma mensagem',
      messageSignedTitle: 'Mensagem assinada',
      messageSignedDescription: signature => `Assinatura: ${signature.substring(0, 20)}...`,
    },
    navigation: {
      about: 'Sobre',
      settings: 'Configurações',
    },
    settings: {
      title: 'Configurações',
      loginRequired: 'Por favor faça login para acessar suas configurações',
      subtitle: 'Gerencie suas contas, cópias de segurança e opções de recuperação',
      tabAccounts: 'Contas',
      tabBackup: 'Cópia de segurança',
      tabSync: 'Sincronização',
      tabRecovery: 'Recuperação social',

      browserInfoHeading: 'Informações do navegador',
      browserLabel: 'Navegador:',
      versionLabel: 'Versão:',
      osLabel: 'Sistema operativo:',
      webauthnSupportLabel: 'Suporte WebAuthn:',
      compatibilityLabel: 'Compatibilidade:',
      available: 'Disponível',
      notAvailable: 'Não disponível',
      fullySupported: 'Totalmente suportado',
      knownIssues: 'Problemas conhecidos',
      notSupported: 'Não suportado',
      browserNotSupportedTitle: 'Navegador não suportado',
      knownIssuesTitle: 'Problemas conhecidos detetados',
      recommendationTitle: 'Recomendação',
      webauthnNotAvailableTitle: 'WebAuthn não disponível',
      webauthnNotAvailableText:
        'O seu navegador não suporta WebAuthn, que é necessário para a autenticação w3pk. Por favor, atualize o seu navegador ou utilize um navegador suportado:',
      browserChrome: 'Chrome 67+ (maio de 2018)',
      browserFirefox: 'Firefox 60+ (maio de 2018)',
      browserSafari: 'Safari 14+ (setembro de 2020)',
      browserEdge: 'Edge 18+ (novembro de 2018)',
      browserSamsung: 'Samsung Internet 11+ (fevereiro de 2020)',
      androidRecommendedHeading: 'Navegadores recomendados para Android',
      samsungInternetNote:
        'Samsung Internet (melhor para dispositivos Samsung) - ✅ Funcionamento confirmado',
      chromeNote: 'Chrome - ✅ Fiável',
      edgeNote: 'Edge - ✅ Fiável',
      firefoxMobileNote:
        'Firefox Mobile - ⚠️ Evitar (problemas conhecidos de persistência de chaves de acesso)',

      restoreBackupHeading: 'Restaurar a partir de cópia de segurança',
      restoreBackupDescription:
        'Se tiver um ficheiro de cópia de segurança, pode restaurar a sua carteira sem iniciar sessão primeiro.',
      restoreBackupSyncHint:
        'Para sincronizar com outro dispositivo: inicie sessão no seu outro dispositivo, vá a Configurações → Criar cópia de segurança para transferir um ficheiro de cópia de segurança encriptado, depois carregue-o aqui e introduza a mesma senha.',
      restoringText: 'A restaurar...',
      restoreBackupButton: 'Restaurar a partir de ficheiro de cópia de segurança',

      debugStorageHeading: 'Depurar e inspecionar armazenamento',
      debugStorageDescription: 'Inspecione o armazenamento do navegador e os registos de atividade',
      inspectingText: 'A inspecionar...',
      inspectLocalStorageButton: 'Inspecionar LocalStorage',
      inspectIndexedDBButton: 'Inspecionar IndexedDB',

      inspectSecurityDescriptionSmall:
        'Analise esta aplicação quanto a métodos de transação e assinatura.',
      inspectSecurityButton: 'Inspecionar segurança',
      consoleCommandLabel: 'Comando da consola:',
      clearReportButton: 'Limpar relatório',
      filesAnalyzedLabel: 'Ficheiros analisados:',
      inspectionHeadingBig: 'Inspeção de segurança',
      inspectSecurityDescriptionBig:
        'Gere um relatório de segurança abrangente desta aplicação. O relatório irá analisar todos os métodos de transação e assinatura.',
      inspectNowButton: 'Inspecionar agora',
      consoleHintText: 'Também pode executar await w3pk.inspectNow() na consola do navegador',
      securityReportHeading: 'Relatório de segurança',
      appUrlLabel: 'URL da aplicação:',

      localStorageResultsHeading: 'Resultados do LocalStorage',
      itemsCount: n => `${n} itens`,
      encryptedBadge: 'Encriptado',
      clearItemAria: 'Limpar item',
      indexedDBResultsHeading: 'Resultados do IndexedDB',
      databasesCount: n => `${n} base(s) de dados`,
      storesLabel: 'Armazenamentos:',
      recordsLabel: 'Registos:',
      clearRecordAria: 'Limpar registo',
      storeKeyLabel: (store, key) => `Armazenamento: ${store} | Chave: ${key}`,

      currentAccountHeading: 'Conta atual',
      currentAccountDescription: 'Esta é a conta com sessão iniciada atualmente.',
      noAccounts: 'Nenhuma conta encontrada neste dispositivo.',
      currentBadge: 'Atual',
      usernameLabel: username => `Nome de usuário: ${username}`,
      deleteAccountAria: 'Eliminar conta',

      sessionHeading: 'Manter a minha sessão ativa',
      sessionDescription:
        'Defina durante quanto tempo a sua sessão deve permanecer ativa sem pedir a chave de acesso. Quando expirar, a sua próxima visita pedirá a sua biometria/PIN uma vez e iniciará uma nova sessão — por isso, isto também determina a frequência com que volta a autenticar-se. Esta configuração aplica-se apenas aos modos STANDARD e YOLO. Os modos STRICT e PRIMARY exigem sempre uma nova autenticação e não utilizam sessões persistentes.',
      noStoredSessionText:
        'Nenhuma sessão armazenada neste dispositivo. O seu autenticador não parece suportar a extensão WebAuthn PRF, que o w3pk requer para manter as sessões ativas com segurança. A sua sessão permanecerá apenas em memória: termina quando fechar o separador, e cada visita pedirá a sua biometria/PIN. Tudo o resto funciona normalmente.',
      sessionDurationLabel: 'Duração da sessão',
      dayLabel: n => `${n} dia${n > 1 ? 's' : ''}`,
      oneDayLabel: '1 dia',
      thirtyDaysLabel: '30 dias',
      sessionHowItWorksTitle: 'Como funciona:',
      sessionHowItWorksText:
        'Sempre que inicia sessão com a sua biometria/PIN, o seu autenticador liberta um segredo protegido por hardware (extensão WebAuthn PRF) que encripta a sua sessão neste dispositivo — nada armazenado em disco consegue recriar essa chave. A contagem decrescente recomeça a cada início de sessão real: com uma duração de 7 dias, iniciar sessão hoje mantém-no autenticado até 7 dias a partir de hoje, altura em que lhe será pedido uma vez e a sessão será reencriptada com uma nova chave.',

      walletBackupHeading: 'Cópia de segurança da carteira',
      walletBackupDescription:
        'Crie cópias de segurança encriptadas da sua carteira para garantir que nunca perde o acesso',
      currentAccountBackupHeading: 'Conta atual',
      loggedInAsLabel: 'Sessão iniciada como:',
      loadingAddressesText: 'A carregar endereços...',
      index0Label: 'Endereço do índice #0:',
      mainAddressLabel:
        'Endereço específico da origem, modo STANDARD, com etiqueta MAIN (carteira predefinida):',
      loadingText: 'A carregar...',
      securityStatusHeading: 'Estado de segurança',
      checkingStatusText: 'A verificar o estado da cópia de segurança...',
      refreshHeading: 'Atualizar estado da cópia de segurança',
      refreshDescription:
        'Recarregue a sua pontuação de segurança atual e as recomendações de cópia de segurança',
      checkingText: 'A verificar...',
      refreshButton: 'Atualizar estado',
      createHeading: 'Criar cópia de segurança',
      createDescription:
        'Transfira um ficheiro de cópia de segurança encriptado protegido pela sua senha',
      creatingText: 'A criar...',
      createButton: 'Criar cópia de segurança',
      restoreHeadingCard: 'Restaurar a partir de cópia de segurança',
      restoreDescriptionCard:
        'Restaure a sua carteira a partir de um ficheiro de cópia de segurança encriptado',
      restoreButtonCard: 'Restaurar cópia de segurança',
      aboutBackupHeading: 'Sobre a cópia de segurança do lado do cliente',
      aboutBackupPara1:
        'O segredo principal da sua carteira (a frase mnemónica) é gerado e encriptado inteiramente no seu dispositivo. O processo de cópia de segurança recupera estes dados encriptados do armazenamento local do seu navegador utilizando a sua senha, e depois empacota-os num ficheiro seguro para transferir.',
      aboutBackupPara2:
        'A chave de encriptação da sua carteira é derivada a partir de uma assinatura WebAuthn, que requer a sua autenticação biométrica (impressão digital, leitura facial) ou o PIN do dispositivo. Isto significa que, mesmo que alguém obtenha acesso aos dados encriptados armazenados no seu navegador, não os conseguirá desencriptar sem o seu dispositivo físico e autenticação.',
      aboutBackupPara3:
        'O seu ficheiro de cópia de segurança é encriptado utilizando AES-256-GCM com uma chave derivada da senha que fornecer. Guarde este ficheiro em segurança e memorize a sua senha.',
      aboutBackupWarning:
        'Se perder o acesso ao seu dispositivo, à chave de acesso E ao ficheiro/senha da cópia de segurança, a sua carteira não poderá ser recuperada.',

      socialRecoveryHeading: 'Recuperação social',
      socialRecoveryDescription:
        'Distribua a recuperação da sua carteira entre guardiões de confiança utilizando a Partilha de Segredo de Shamir',
      setupHeading: 'Configurar recuperação social',
      setupDescription: (threshold, count) =>
        `Adicione guardiões de confiança que o ajudarão a recuperar a sua carteira. Precisará de ${threshold} de ${count || '?'} guardiões para recuperar.`,
      guardianNameLabel: 'Nome do guardião *',
      guardianEmailLabel: 'Email do guardião (opcional)',
      addGuardianButton: 'Adicionar guardião',
      guardiansListHeading: n => `Guardiões (${n})`,
      removeGuardianAria: 'Remover guardião',
      thresholdLabel: (threshold, count) => `Limiar de recuperação: ${threshold} de ${count}`,
      thresholdDescription: 'Número de guardiões necessários para recuperar a sua carteira',
      setupSocialRecoveryButton: (threshold, count) =>
        `Configurar recuperação social (${threshold}-de-${count || '?'})`,
      howItWorksRecoveryInfo: (count, threshold) =>
        `Como funciona: a recuperação da sua carteira será dividida em ${count || '?'} partes encriptadas utilizando a Partilha de Segredo de Shamir. Precisará de ${threshold} guardiões para combinarem as suas partes e recuperarem a sua carteira. Nenhum guardião sozinho pode aceder à sua carteira.`,
      recoverWalletHeading: 'Recuperar carteira',
      hideButton: 'Ocultar',
      showButton: 'Mostrar',
      recoverDescription:
        'Perdeu o acesso à sua carteira? Recolha as partes dos guardiões para a recuperar.',
      shareCodeLabel: 'Código de partilha do guardião',
      sharePlaceholder:
        'Cole aqui o JSON da partilha do guardião (por exemplo, {"guardianId":"...","share":"..."})',
      addShareButton: 'Adicionar partilha',
      uploadFileButton: 'Carregar ficheiro',
      clearAllButton: 'Limpar tudo',
      collectedSharesHeading: n => `Partilhas recolhidas (${n})`,
      guardianFallback: 'Guardião',
      shareIndexLabel: n => `(#${n})`,
      addedAtLabel: time => `Adicionado ${time}`,
      removeShareAria: 'Remover partilha',
      invalidShareLabel: n => `Partilha inválida #${n}`,
      progressHeading: 'Progresso da recuperação',
      progressText: n =>
        `${n} partilha(s) recolhida(s). Precisa de pelo menos 2 partilhas para tentar a recuperação.`,
      recoveringText: 'A recuperar...',
      recoverButton: n => `Recuperar carteira (${n} partilhas)`,
      importantWarning:
        'Importante: certifique-se de que as partilhas são dos guardiões corretos. Partilhas inválidas farão a recuperação falhar.',
      activeHeading: 'Recuperação social ativa',
      activeDescription: (threshold, count) =>
        `A sua carteira está protegida com recuperação de ${threshold}-de-${count} guardiões`,
      generateInviteButton: 'Gerar convite',
      removeConfigQuestion:
        'Todos os guardiões têm as suas partilhas? Agora pode remover a configuração dos guardiões do armazenamento local. As partilhas estão guardadas em segurança com os seus guardiões e podem ser utilizadas para recuperação a qualquer momento.',
      removeConfigButton: 'Limpar configuração dos guardiões do armazenamento local',
      invitationHeading: 'Convite do guardião',
      downloadInviteButton: 'Transferir convite',
      sendInviteText: name => `Envie este convite para ${name} através de um canal seguro`,

      deviceSyncHeading: 'Sincronização de dispositivos',
      deviceSyncDescription:
        'A sua chave de acesso sincroniza automaticamente entre dispositivos utilizando serviços da plataforma',
      qrHeading: 'Código QR de sincronização',
      qrDescription:
        'Gere um código QR contendo os endereços da sua carteira para sincronizar ou verificar facilmente as informações da sua conta noutro dispositivo.',
      generateQrButton: 'Gerar código QR de sincronização',
      qrNote:
        'Nota: este código QR contém apenas os endereços públicos da sua carteira. NÃO contém as suas chaves privadas nem a frase de recuperação. Utilize-o para verificar a sua conta noutro dispositivo.',
      hideQrButton: 'Ocultar código QR',
      verifyHeading: 'Verificar dados do código QR',
      verifyDescription:
        'Cole a cadeia JSON de um código QR digitalizado para verificar os endereços da carteira.',
      verifyPlaceholder:
        'Cole aqui os dados JSON (por exemplo, {"username":"...","ethereumAddress":"..."})',
      errorLabel: 'Erro:',
      parsedDataLabel: 'Dados analisados:',
      usernameFieldLabel: 'Nome de usuário:',
      ethAddressLabel: 'Endereço Ethereum:',
      index0FieldLabel: 'Índice #0:',
      mainTaggedLabel: 'Etiqueta MAIN:',
      openbarTaggedLabel: 'Etiqueta OPENBAR:',
      generatedLabel: 'Gerado:',
      linkWalletButton: 'Associar esta carteira à sua conta de chave de acesso',
      linkExplanation:
        'O que acontece quando associa: isto guardará os endereços da carteira tanto no localStorage como no IndexedDB, criando uma ligação persistente entre a sua conta de chave de acesso e esta carteira HD. Pode utilizar isto para verificar ou sincronizar dados da carteira entre dispositivos.',
      howQrWorksHeading: 'Como funciona a sincronização da carteira por código QR',
      qrStep1:
        'Passo 1: Gerar código QR - No seu dispositivo principal, gere um código QR contendo os endereços públicos da sua carteira. Este código QR é seguro de partilhar, pois contém apenas informação pública.',
      qrStep2:
        'Passo 2: Digitalizar e verificar - No seu dispositivo secundário, digitalize o código QR utilizando qualquer aplicação leitora de códigos QR, ou copie manualmente os dados JSON apresentados no código QR.',
      qrStep3:
        'Passo 3: Associar carteiras - Cole os dados JSON na área de verificação acima e clique em "Associar esta carteira". Isto cria uma ligação persistente entre a sua conta de chave de acesso e os endereços da carteira HD.',
      whatGetsStored:
        'O que é armazenado: apenas os endereços públicos da carteira são armazenados no localStorage e no IndexedDB. As suas chaves privadas e a frase de recuperação permanecem seguras e nunca são transmitidas ou armazenadas através deste mecanismo de sincronização.',
      platformSyncHeading: 'Sincronização de plataforma da chave de acesso',
      platformSyncIntro:
        'As suas credenciais de chave de acesso sincronizam automaticamente entre dispositivos dentro do mesmo ecossistema:',
      appleSyncNote: 'Apple: sincroniza através do iCloud Keychain (iPhone, iPad, Mac)',
      googleSyncNote: 'Google: sincroniza através do Password Manager (Android, Chrome)',
      windowsSyncNote:
        'Windows Hello: específico do dispositivo, utilize uma cópia de segurança encriptada para novos dispositivos',
      hardwareSyncNote:
        'Chaves de hardware: sem sincronização, guarde uma cópia de segurança encriptada em separado',
      crossPlatformNote:
        'Limitação entre plataformas: as chaves de acesso não sincronizam entre ecossistemas diferentes (por exemplo, de iPhone para Android). No entanto, as cópias de segurança encriptadas SÃO totalmente multiplataforma - pode restaurar a sua carteira em qualquer dispositivo com o ficheiro de cópia de segurança e a senha, independentemente da plataforma original.',
      bestPracticesHeading: 'Boas práticas',
      practiceBackupFirst:
        'Crie sempre uma cópia de segurança encriptada antes de sincronizar com um novo dispositivo',
      practiceVerifyAddresses:
        'Verifique se os endereços da carteira coincidem após a sincronização',
      practiceUseDebugTools:
        'Utilize as ferramentas de depuração e inspeção de armazenamento para verificar se os dados de sincronização foram guardados corretamente',
      practiceNeverShareQr:
        'Nunca partilhe o seu código QR publicamente ou em canais não confiáveis',
      practiceTreatAsSensitive:
        'Os códigos QR contêm apenas endereços públicos, mas ainda assim devem ser tratados como informação sensível da conta',

      createBackupModalTitle: 'Introduza a senha para criar a cópia de segurança',
      createBackupModalDescription:
        'Por favor, introduza a sua senha para criar a cópia de segurança. Isto é necessário pelo SDK w3pk para aceder aos dados encriptados da sua carteira.',
      restoreBackupModalTitle: 'Introduza a senha para restaurar a cópia de segurança',
      restoreBackupModalDescription:
        'Por favor, introduza a senha que utilizou ao criar este ficheiro de cópia de segurança.',
      chooseUsernameModalTitle: 'Escolha o nome de usuário para a carteira restaurada',
      chooseUsernameModalDescription:
        'Nenhuma credencial existente encontrada neste dispositivo. Por favor, escolha um nome de usuário para registar a sua carteira restaurada com uma nova chave de acesso.',
      usernameFormatError:
        'O nome de usuário deve ter entre 3 e 50 caracteres, alfanumérico com sublinhados/hífens, e começar/terminar com um caractere alfanumérico.',
      restoringRegisteringText: 'A restaurar e registar...',
      restoreRegisterButton: 'Restaurar e registar',
      removeAccountModalTitle: 'Remover conta',
      removeAccountConfirm: username => `Tem a certeza de que deseja remover a conta ${username}?`,
      removeAccountWarning:
        'Aviso: isto irá eliminar todos os dados desta conta neste dispositivo. Certifique-se de que tem uma cópia de segurança antes de continuar. Esta ação não pode ser desfeita.',
      removeAccountLoggedOutNote:
        'Esta é a conta com sessão iniciada atualmente. A sua sessão será terminada após a remoção.',
      removeAccountButton: 'Remover conta',
      localStorageModalTitle: 'Inspeção do LocalStorage',
      foundItemsText: n => `Encontrados ${n} itens no localStorage`,
      noDataFound: 'Nenhum dado encontrado',
      indexedDBModalTitle: 'Inspeção do IndexedDB',
      foundDatabasesText: n => `Encontrada(s) ${n} base(s) de dados`,
      noDatabasesFound: 'Nenhuma base de dados relacionada com w3pk encontrada',

      registrationSuccessTitle: 'Registo concluído com sucesso',
      registrationSuccessDescription: 'A sua nova conta foi criada.',
      registrationFailedTitle: 'Falha no registo',
      registrationFailedDefaultDescription:
        'Não foi possível concluir o registo. Por favor, tente novamente.',
      localStorageInspectedTitle: 'LocalStorage inspecionado',
      localStorageInspectedDescription: n =>
        `Encontrados ${n} itens. Desça para ver os resultados.`,
      genericErrorTitle: 'Erro',
      failedInspectLocalStorage: 'Falha ao inspecionar o localStorage',
      indexedDBInspectedTitle: 'IndexedDB inspecionado',
      indexedDBInspectedDescription: (dbCount, recordCount) =>
        `Encontrada(s) ${dbCount} base(s) de dados com ${recordCount} registo(s). Desça para ver os resultados.`,
      failedInspectIndexedDB: 'Falha ao inspecionar o IndexedDB',
      itemClearedTitle: 'Item removido',
      itemClearedDescription: key => `"${key}" removido do localStorage`,
      failedClearItem: key => `Falha ao limpar "${key}"`,
      recordClearedTitle: 'Registo removido',
      recordClearedDescription: (db, store) => `Registo removido de ${db}/${store}`,
      failedClearRecord: 'Falha ao limpar o registo',
      errorLoadingAddressesTitle: 'Erro ao carregar endereços',
      failedDeriveAddresses: 'Falha ao derivar os endereços da carteira',
      errorLoadingBackupStatusTitle: 'Erro ao carregar o estado da cópia de segurança',
      failedCheckSecurityStatus: 'Falha ao verificar o estado de segurança',
      accountRemovedTitle: 'Conta removida',
      accountRemovedDescription: username => `A conta ${username} foi removida deste dispositivo.`,
      loggingOutTitle: 'A terminar sessão',
      loggingOutDescription: 'Removeu a sua conta atual. A terminar sessão...',
      failedRemoveAccount: 'Falha ao remover a conta. Por favor, tente novamente.',
      errorReadingFileTitle: 'Erro ao ler o ficheiro',
      failedReadBackupFile: 'Falha ao ler o ficheiro de cópia de segurança',
      noBackupFileSelectedTitle: 'Nenhum ficheiro de cópia de segurança selecionado',
      incompatibleBackupTitle: 'Versão de cópia de segurança incompatível',
      incompatibleBackupDescription:
        'Esta cópia de segurança foi criada com uma versão mais antiga do w3pk. Por favor, crie uma nova cópia de segurança com a versão atual.',
      walletRestoredTitle: 'Carteira restaurada!',
      walletRestoredDescription: address =>
        `Carteira restaurada e substituída com sucesso: ${address}`,
      usernameRequiredRestoreDescription:
        'Por favor, introduza um nome de usuário para registar com a carteira restaurada.',
      walletRestoredRegisteredTitle: 'Carteira restaurada e registada!',
      walletRestoredRegisteredDescription: address =>
        `Carteira restaurada e registada com sucesso: ${address}`,
      securityReportGeneratedTitle: 'Relatório de segurança gerado',
      securityReportGeneratedDescription: 'Veja a análise detalhada abaixo',
      inspectionFailedTitle: 'Falha na inspeção',
      inspectionFailedDescription:
        'A inspeção da aplicação anfitriã não funcionou. Provavelmente devido ao limite de pedidos da Anthropic ter sido atingido.',
      backupStatusRetrievedTitle: 'Estado da cópia de segurança obtido.',
      errorRetrievingStatusTitle: 'Erro ao obter o estado.',
      unexpectedErrorDescription: 'Ocorreu um erro inesperado.',
      errorCreatingBackupTitle: 'Erro ao criar a cópia de segurança.',
      backupCreatedTitle: 'Cópia de segurança criada com sucesso!',
      invalidInputTitle: 'Entrada inválida',
      guardianNameRequiredDescription: 'O nome do guardião é obrigatório',
      notEnoughGuardiansTitle: 'Guardiões insuficientes',
      notEnoughGuardiansDescription:
        'Precisa de pelo menos 2 guardiões para configurar a recuperação social',
      invalidThresholdTitle: 'Limiar inválido',
      invalidThresholdDescription: 'O limiar não pode ser maior do que o número de guardiões',
      socialRecoveryConfiguredTitle: 'Recuperação social configurada!',
      socialRecoveryConfiguredDescription: (threshold, count) =>
        `Recuperação de ${threshold}-de-${count} guardiões configurada com sucesso`,
      pleasePasteShareDescription: 'Por favor, cole um código de partilha do guardião',
      duplicateShareTitle: 'Partilha duplicada',
      duplicateShareDescription: 'Esta partilha do guardião já foi adicionada',
      shareAddedTitle: 'Partilha adicionada',
      shareAddedDescription: name => `Partilha de ${name} adicionada`,
      invalidShareFormatTitle: 'Formato de partilha inválido',
      invalidShareFormatDescription:
        'Por favor, cole um código de partilha do guardião válido (formato JSON)',
      notEnoughSharesTitle: 'Partilhas insuficientes',
      notEnoughSharesDescription:
        'Precisa de pelo menos 2 partilhas de guardiões para recuperar a sua carteira',
      passwordRequiredRecoveryDescription:
        'Precisa de introduzir a sua senha para desencriptar o ficheiro de cópia de segurança',
      usernameRequiredRecoveryDescription:
        'Precisa de indicar um nome de usuário para registar a sua carteira recuperada',
      walletRecoveredTitle: 'Carteira recuperada com sucesso!',
      walletRecoveredDescription: address =>
        `A sua carteira foi recuperada e registada com uma nova chave de acesso: ${address}`,
      fileLoadedTitle: 'Ficheiro carregado',
      fileLoadedDescription:
        'Partilha do guardião carregada a partir do ficheiro. Clique em "Adicionar partilha" para a adicionar.',
      failedReadGuardianFile: 'Falha ao ler o ficheiro de partilha do guardião',
      cannotSaveTitle: 'Não é possível guardar',
      cannotSaveDescription: 'Dados de QR inválidos ou utilizador não autenticado',
      walletLinkedTitle: 'Carteira associada com sucesso!',
      walletLinkedDescription: address =>
        `Carteira ${address} associada à sua conta de chave de acesso`,
      errorSavingLinkTitle: 'Erro ao guardar a associação da carteira',
      failedSaveSyncData: 'Falha ao guardar os dados de sincronização da carteira',
      recoveryPasswordPrompt:
        'Introduza a senha que definiu ao configurar a recuperação social.\n\nEsta senha NÃO foi partilhada com os guardiões - foi definida por si durante a configuração.',
      recoveryUsernamePrompt: address =>
        `Escolha um nome de usuário para o registo da sua nova chave de acesso.\n\nA recuperar a carteira: ${address}`,
    },
    header: {
      registerTitle: 'Registrar nova conta',
      walletInfoText:
        'Uma carteira Ethereum será criada e armazenada com segurança no seu dispositivo, protegida por sua biometria ou PIN graças ao',
      usernameLabel: 'Nome de usuário',
      usernamePlaceholder: 'Digite seu nome de usuário',
      usernameError:
        'O nome de usuário deve ter entre 3 e 50 caracteres e conter apenas letras, números, sublinhados e hífens. Deve começar e terminar com uma letra ou número.',
      createAccount: 'Criar conta',
      optionsAriaLabel: 'Opções',
      mainNavAriaLabel: 'Navegação principal',
      usernameRequiredTitle: 'Nome de usuário obrigatório',
      usernameRequiredDescription: 'Por favor, digite um nome de usuário para se registrar.',
      noAccountFoundTitle: 'Conta não encontrada',
      noAccountFoundDescription:
        'Nenhuma chave de acesso encontrada. Por favor, registre-se para criar uma nova conta.',
      alreadyRegisteredLink: 'Já me registrei em outro dispositivo',
    },
    passwordModal: {
      passwordLabel: 'Senha',
      passwordPlaceholder: 'Digite sua senha',
      passwordRequiredTitle: 'Senha obrigatória.',
      passwordRequiredDescription: 'Por favor, digite sua senha.',
      weakPasswordTitle: 'Senha fraca.',
      weakPasswordDescription:
        'Por favor, use uma senha mais forte que atenda a todos os requisitos.',
      submissionErrorTitle: 'Erro de envio.',
      submissionErrorDefaultDescription: 'Ocorreu um erro inesperado.',
      requirementsNotMet: 'A senha não atende a todos os requisitos',
      strongPassword: 'Senha forte!',
      mustInclude: 'A senha deve incluir:',
      reqMinLength: 'Pelo menos 12 caracteres',
      reqUpperCase: 'Uma letra maiúscula',
      reqLowerCase: 'Uma letra minúscula',
      reqNumber: 'Um número',
      reqSpecialChar: 'Um caractere especial',
      satisfied: ' (satisfeito)',
      required: ' (obrigatório)',
      submit: 'Enviar',
    },
    about: {
      headingPrefix: 'Sobre',
      introPart1:
        'w3pk é um SDK de autenticação Web3 sem senha, com carteiras encriptadas e funcionalidades de privacidade. Pode utilizá-lo em qualquer aplicação web baseada em JS/TS (Next.js, Vue, Angular, Svelte, …).',
      introPart2:
        'é um modelo de aplicação Next.js, sinta-se à vontade para fazer fork e construir o que quiser!',
      emailBoxText:
        'O w3pk está em desenvolvimento. Receba emails quando lançarmos novas funcionalidades (suporte EIP-1193, capacidades de IA, auxiliares Viem, abstração de cadeia, e mais)',
      emailPlaceholder: 'your@email.com',
      subscribeButton: 'Subscrever',
      githubLabel: 'GitHub',
      npmLabel: 'NPM',
      githubAriaLabel: 'Ver w3pk no GitHub (abre num novo separador)',
      npmAriaLabel: 'Ver w3pk no NPM (abre num novo separador)',
      codeRegisterComment: '// Registar',
      codeLoginComment: '// Entrar',
      codeLogoutComment: '// Sair',
      featuresHeading: 'Funcionalidades',
      feature1: 'Autenticação sem senha (WebAuthn/FIDO2)',
      feature2:
        'Isolamento de chaves específico da origem com controlo de acesso baseado em etiquetas',
      feature3: 'Gestão de sessão (em memória + persistente opcional)',
      feature4: 'Geração de carteira HD (BIP39/BIP44)',
      feature5: 'Derivação de múltiplos endereços com modos de segurança (STANDARD/STRICT/YOLO)',
      feature6: 'Múltiplos métodos de assinatura (EIP-191, SIWE/EIP-4361, EIP-712, rawHash)',
      feature7: 'Envio de transações on-chain com resolução automática de RPC (`sendTransaction`)',
      feature8: 'Fornecedor EIP-1193 para ethers, viem, wagmi, RainbowKit (`getEIP1193Provider`)',
      feature9: 'Endereços furtivos ERC-5564 (opcional)',
      feature10: 'Primitivas ZK (geração e verificação de provas de conhecimento zero)',
      feature11: 'Suporte Chainlist (mais de 2390 redes)',
      feature12: 'Deteção de rede EIP-7702 (mais de 329 redes)',
      feature13:
        'Integração com carteiras externas (delegar MetaMask/Ledger para w3pk via EIP-7702)',
      feature14: 'Modo PRIMARY EIP-7951 (assinatura de chave de acesso P-256)',
      feature15:
        'Verificação de compilação (hashing de CID IPFS + registo onchain mantido por DAO)',
      feature16:
        'Cópia de segurança e recuperação de três camadas (sincronização de chave de acesso, cópias de segurança encriptadas, recuperação social)',
      feature17: 'Inspeção da aplicação anfitriã alimentada por IA',
      invalidEmailTitle: 'Email inválido',
      invalidEmailDescription: 'Por favor, introduza um endereço de email válido',
      subscribeSuccessTitle: 'Sucesso!',
      subscribeSuccessDescription: 'Foi subscrito às atualizações do w3pk',
      subscribeErrorTitle: 'Erro',
      subscribeErrorDescription: 'Falha ao subscrever. Por favor, tente novamente.',
    },
  },

  // Urdu
  ur: {
    common: {
      login: 'لاگ ان',
      logout: 'لاگ آؤٹ',
      pleaseLogin: 'براہ کرم لاگ ان کریں',
      cancel: 'منسوخ کریں',
      srLoadingText: 'لوڈ ہو رہا ہے، براہ کرم انتظار کریں...',
      loading: 'لوڈ ہو رہا ہے...',
      notAvailable: 'دستیاب نہیں',
      close: 'بند کریں',
    },
    home: {
      title: 'خوش آمدید!',
      subtitle: 'آپ کا یہاں ہونا خوشی کی بات ہے!',
      greeting: 'ہیلو دوست!',
      greetingSubtitle: 'آرام سے بیٹھیں اور کچھ شاندار بنائیں!',
      signMessage: 'پیغام پر دستخط کریں',
      messageSignedTitle: 'پیغام پر دستخط ہو گئے',
      messageSignedDescription: signature => `دستخط: ${signature.substring(0, 20)}...`,
    },
    navigation: {
      about: 'کے بارے میں',
      settings: 'ترتیبات',
    },
    settings: {
      title: 'ترتیبات',
      loginRequired: 'اپنی ترتیبات تک رسائی کے لیے براہ کرم لاگ ان کریں',
      subtitle: 'اپنے اکاؤنٹس، بیک اپس، اور بحالی کے اختیارات کا نظم کریں',
      tabAccounts: 'اکاؤنٹس',
      tabBackup: 'بیک اپ',
      tabSync: 'مطابقت پذیری',
      tabRecovery: 'سماجی بحالی',

      browserInfoHeading: 'براؤزر کی معلومات',
      browserLabel: 'براؤزر:',
      versionLabel: 'ورژن:',
      osLabel: 'آپریٹنگ سسٹم:',
      webauthnSupportLabel: 'WebAuthn سپورٹ:',
      compatibilityLabel: 'مطابقت:',
      available: 'دستیاب',
      notAvailable: 'دستیاب نہیں',
      fullySupported: 'مکمل طور پر معاون',
      knownIssues: 'معلوم مسائل',
      notSupported: 'معاون نہیں',
      browserNotSupportedTitle: 'براؤزر معاون نہیں ہے',
      knownIssuesTitle: 'معلوم مسائل کا پتہ چلا',
      recommendationTitle: 'تجویز',
      webauthnNotAvailableTitle: 'WebAuthn دستیاب نہیں',
      webauthnNotAvailableText:
        'آپ کا براؤزر WebAuthn کو سپورٹ نہیں کرتا، جو w3pk کی توثیق کے لیے درکار ہے۔ براہ کرم اپنا براؤزر اپ ڈیٹ کریں یا کوئی معاون براؤزر استعمال کریں:',
      browserChrome: 'Chrome 67+ (مئی 2018)',
      browserFirefox: 'Firefox 60+ (مئی 2018)',
      browserSafari: 'Safari 14+ (ستمبر 2020)',
      browserEdge: 'Edge 18+ (نومبر 2018)',
      browserSamsung: 'Samsung Internet 11+ (فروری 2020)',
      androidRecommendedHeading: 'اینڈرائیڈ کے لیے تجویز کردہ براؤزرز',
      samsungInternetNote:
        'Samsung Internet (سام سنگ ڈیوائسز کے لیے بہترین) - ✅ کام کرنے کی تصدیق شدہ',
      chromeNote: 'Chrome - ✅ قابل اعتماد',
      edgeNote: 'Edge - ✅ قابل اعتماد',
      firefoxMobileNote: 'Firefox Mobile - ⚠️ گریز کریں (پاس کی برقراری کے معلوم مسائل)',

      restoreBackupHeading: 'بیک اپ سے بحال کریں',
      restoreBackupDescription:
        'اگر آپ کے پاس بیک اپ فائل ہے، تو آپ پہلے لاگ ان کیے بغیر اپنا والیٹ بحال کر سکتے ہیں۔',
      restoreBackupSyncHint:
        'کسی دوسرے ڈیوائس کے ساتھ مطابقت پذیر کرنے کے لیے: اپنے دوسرے ڈیوائس پر لاگ ان کریں، ترتیبات → بیک اپ بنائیں پر جا کر ایک خفیہ کردہ بیک اپ فائل ڈاؤن لوڈ کریں، پھر اسے یہاں اپ لوڈ کریں اور وہی پاس ورڈ درج کریں۔',
      restoringText: 'بحال ہو رہا ہے...',
      restoreBackupButton: 'بیک اپ فائل سے بحال کریں',

      debugStorageHeading: 'ڈیبگ اور اسٹوریج کا معائنہ',
      debugStorageDescription: 'براؤزر اسٹوریج اور سرگرمی لاگز کا معائنہ کریں',
      inspectingText: 'معائنہ ہو رہا ہے...',
      inspectLocalStorageButton: 'LocalStorage کا معائنہ کریں',
      inspectIndexedDBButton: 'IndexedDB کا معائنہ کریں',

      inspectSecurityDescriptionSmall:
        'ٹرانزیکشن اور دستخطی طریقوں کے لیے اس ایپلیکیشن کا تجزیہ کریں۔',
      inspectSecurityButton: 'سیکیورٹی کا معائنہ کریں',
      consoleCommandLabel: 'کنسول کمانڈ:',
      clearReportButton: 'رپورٹ صاف کریں',
      filesAnalyzedLabel: 'تجزیہ شدہ فائلیں:',
      inspectionHeadingBig: 'سیکیورٹی معائنہ',
      inspectSecurityDescriptionBig:
        'اس ایپ کی ایک جامع سیکیورٹی رپورٹ تیار کریں۔ رپورٹ تمام ٹرانزیکشن اور دستخطی طریقوں کا تجزیہ کرے گی۔',
      inspectNowButton: 'ابھی معائنہ کریں',
      consoleHintText: 'آپ براؤزر کنسول میں await w3pk.inspectNow() بھی چلا سکتے ہیں',
      securityReportHeading: 'سیکیورٹی رپورٹ',
      appUrlLabel: 'ایپ URL:',

      localStorageResultsHeading: 'LocalStorage نتائج',
      itemsCount: n => `${n} اشیاء`,
      encryptedBadge: 'خفیہ کردہ',
      clearItemAria: 'آئٹم صاف کریں',
      indexedDBResultsHeading: 'IndexedDB نتائج',
      databasesCount: n => `${n} ڈیٹا بیس`,
      storesLabel: 'اسٹورز:',
      recordsLabel: 'ریکارڈز:',
      clearRecordAria: 'ریکارڈ صاف کریں',
      storeKeyLabel: (store, key) => `اسٹور: ${store} | کلید: ${key}`,

      currentAccountHeading: 'موجودہ اکاؤنٹ',
      currentAccountDescription: 'یہ آپ کا فی الحال لاگ ان اکاؤنٹ ہے۔',
      noAccounts: 'اس ڈیوائس پر کوئی اکاؤنٹ نہیں ملا۔',
      currentBadge: 'موجودہ',
      usernameLabel: username => `صارف نام: ${username}`,
      deleteAccountAria: 'اکاؤنٹ حذف کریں',

      sessionHeading: 'میرا سیشن فعال رکھیں',
      sessionDescription:
        'مقرر کریں کہ آپ کا سیشن بغیر پاس کی پرامپٹ کے کتنی دیر فعال رہے۔ جب یہ ختم ہو جائے، تو آپ کا اگلا وزٹ ایک بار آپ کا بائیومیٹرک/پن مانگے گا اور ایک نیا سیشن شروع کرے گا — یعنی یہ بھی طے کرتا ہے کہ آپ کتنی بار دوبارہ توثیق کرتے ہیں۔ یہ ترتیب صرف STANDARD اور YOLO موڈز پر لاگو ہوتی ہے۔ STRICT اور PRIMARY موڈز ہمیشہ نئی توثیق کا تقاضا کرتے ہیں اور مستقل سیشنز استعمال نہیں کرتے۔',
      noStoredSessionText:
        'اس ڈیوائس پر کوئی محفوظ شدہ سیشن نہیں ہے۔ ایسا لگتا ہے کہ آپ کا آتھینٹیکیٹر WebAuthn PRF ایکسٹینشن کو سپورٹ نہیں کرتا، جو w3pk کو سیشنز کو محفوظ طریقے سے فعال رکھنے کے لیے درکار ہے۔ آپ کا سیشن صرف میموری میں رہے گا: یہ ٹیب بند کرنے پر ختم ہو جاتا ہے، اور ہر وزٹ پر آپ کا بائیومیٹرک/پن مانگا جائے گا۔ باقی سب کچھ معمول کے مطابق کام کرتا ہے۔',
      sessionDurationLabel: 'سیشن کا دورانیہ',
      dayLabel: n => `${n} دن`,
      oneDayLabel: '1 دن',
      thirtyDaysLabel: '30 دن',
      sessionHowItWorksTitle: 'یہ کیسے کام کرتا ہے:',
      sessionHowItWorksText:
        'ہر بار جب آپ اپنے بائیومیٹرک/پن سے لاگ ان کرتے ہیں، آپ کا آتھینٹیکیٹر ایک ہارڈویئر بیسڈ سیکرٹ (WebAuthn PRF ایکسٹینشن) جاری کرتا ہے جو اس ڈیوائس پر آپ کے سیشن کو خفیہ کرتا ہے — ڈسک پر محفوظ کوئی بھی چیز اس کلید کو دوبارہ نہیں بنا سکتی۔ ہر حقیقی لاگ ان پر کاؤنٹ ڈاؤن نئے سرے سے شروع ہوتا ہے: 7 دن کے دورانیے کے ساتھ، آج لاگ ان کرنے سے آپ آج سے 7 دن تک سائن ان رہیں گے، جس کے بعد آپ سے ایک بار پرامپٹ کیا جائے گا اور سیشن کو ایک نئی کلید کے تحت دوبارہ خفیہ کیا جائے گا۔',

      walletBackupHeading: 'والیٹ بیک اپ',
      walletBackupDescription:
        'اپنے والیٹ کے خفیہ کردہ بیک اپس بنائیں تاکہ آپ کبھی رسائی نہ کھوئیں',
      currentAccountBackupHeading: 'موجودہ اکاؤنٹ',
      loggedInAsLabel: 'اس نام سے لاگ ان ہیں:',
      loadingAddressesText: 'پتے لوڈ ہو رہے ہیں...',
      index0Label: 'انڈیکس #0 پتہ:',
      mainAddressLabel: 'اوریجن مخصوص، STANDARD موڈ، MAIN-ٹیگ شدہ پتہ (ڈیفالٹ والیٹ):',
      loadingText: 'لوڈ ہو رہا ہے...',
      securityStatusHeading: 'سیکیورٹی کی صورتحال',
      checkingStatusText: 'بیک اپ کی صورتحال چیک ہو رہی ہے...',
      refreshHeading: 'بیک اپ کی صورتحال تازہ کریں',
      refreshDescription: 'اپنا موجودہ سیکیورٹی سکور اور بیک اپ تجاویز دوبارہ لوڈ کریں',
      checkingText: 'چیک ہو رہا ہے...',
      refreshButton: 'صورتحال تازہ کریں',
      createHeading: 'بیک اپ بنائیں',
      createDescription: 'اپنے پاس ورڈ سے محفوظ ایک خفیہ کردہ بیک اپ فائل ڈاؤن لوڈ کریں',
      creatingText: 'بنایا جا رہا ہے...',
      createButton: 'بیک اپ بنائیں',
      restoreHeadingCard: 'بیک اپ سے بحال کریں',
      restoreDescriptionCard: 'اپنے والیٹ کو خفیہ کردہ بیک اپ فائل سے بحال کریں',
      restoreButtonCard: 'بیک اپ بحال کریں',
      aboutBackupHeading: 'کلائنٹ سائیڈ بیک اپ کے بارے میں',
      aboutBackupPara1:
        'آپ کے والیٹ کا بنیادی سیکرٹ (mnemonic فقرہ) مکمل طور پر آپ کے ڈیوائس پر تیار اور خفیہ کیا جاتا ہے۔ بیک اپ کا عمل آپ کے پاس ورڈ کے استعمال سے یہ خفیہ کردہ ڈیٹا آپ کے براؤزر کے لوکل اسٹوریج سے حاصل کرتا ہے، پھر اسے ڈاؤن لوڈ کے لیے ایک محفوظ فائل میں پیک کرتا ہے۔',
      aboutBackupPara2:
        'آپ کے والیٹ کی خفیہ کاری کی کلید ایک WebAuthn دستخط کے ذریعے حاصل کی جاتی ہے، جس کے لیے آپ کی بائیومیٹرک توثیق (فنگر پرنٹ، فیس اسکین) یا ڈیوائس پن درکار ہوتا ہے۔ اس کا مطلب یہ ہے کہ اگر کوئی آپ کے براؤزر میں محفوظ خفیہ کردہ ڈیٹا تک رسائی حاصل کر بھی لے، تو وہ آپ کے حقیقی ڈیوائس اور توثیق کے بغیر اسے ڈی کرپٹ نہیں کر سکتا۔',
      aboutBackupPara3:
        'آپ کی بیک اپ فائل AES-256-GCM کا استعمال کرتے ہوئے اس کلید سے خفیہ کی جاتی ہے جو آپ کے فراہم کردہ پاس ورڈ سے حاصل کی جاتی ہے۔ اس فائل کو محفوظ طریقے سے رکھیں اور اپنا پاس ورڈ یاد رکھیں۔',
      aboutBackupWarning:
        'اگر آپ اپنے ڈیوائس، پاس کی، اور بیک اپ فائل/پاس ورڈ تک رسائی کھو دیتے ہیں، تو آپ کا والیٹ بحال نہیں کیا جا سکتا۔',

      socialRecoveryHeading: 'سماجی بحالی',
      socialRecoveryDescription:
        'Shamir Secret Sharing کا استعمال کرتے ہوئے اپنے والیٹ کی بحالی کو قابل اعتماد گارڈینز کے درمیان تقسیم کریں',
      setupHeading: 'سماجی بحالی سیٹ اپ کریں',
      setupDescription: (threshold, count) =>
        `قابل اعتماد گارڈینز شامل کریں جو آپ کے والیٹ کو بحال کرنے میں مدد کریں گے۔ بحالی کے لیے آپ کو ${count || '?'} میں سے ${threshold} گارڈینز کی ضرورت ہوگی۔`,
      guardianNameLabel: 'گارڈین کا نام *',
      guardianEmailLabel: 'گارڈین ای میل (اختیاری)',
      addGuardianButton: 'گارڈین شامل کریں',
      guardiansListHeading: n => `گارڈینز (${n})`,
      removeGuardianAria: 'گارڈین ہٹائیں',
      thresholdLabel: (threshold, count) => `بحالی کی حد: ${count} میں سے ${threshold}`,
      thresholdDescription: 'آپ کے والیٹ کو بحال کرنے کے لیے درکار گارڈینز کی تعداد',
      setupSocialRecoveryButton: (threshold, count) =>
        `سماجی بحالی سیٹ اپ کریں (${threshold}-از-${count || '?'})`,
      howItWorksRecoveryInfo: (count, threshold) =>
        `یہ کیسے کام کرتا ہے: آپ کے والیٹ کی بحالی کو Shamir Secret Sharing کا استعمال کرتے ہوئے ${count || '?'} خفیہ کردہ حصوں میں تقسیم کیا جائے گا۔ اپنا والیٹ بحال کرنے کے لیے آپ کو ${threshold} گارڈینز کے حصے یکجا کرنے کی ضرورت ہوگی۔ کوئی بھی اکیلا گارڈین آپ کے والیٹ تک رسائی حاصل نہیں کر سکتا۔`,
      recoverWalletHeading: 'والیٹ بحال کریں',
      hideButton: 'چھپائیں',
      showButton: 'دکھائیں',
      recoverDescription:
        'اپنے والیٹ تک رسائی کھو دی؟ اسے بحال کرنے کے لیے گارڈین کے حصے جمع کریں۔',
      shareCodeLabel: 'گارڈین شیئر کوڈ',
      sharePlaceholder:
        'گارڈین شیئر JSON یہاں پیسٹ کریں (مثلاً، {"guardianId":"...","share":"..."})',
      addShareButton: 'شیئر شامل کریں',
      uploadFileButton: 'فائل اپ لوڈ کریں',
      clearAllButton: 'سب صاف کریں',
      collectedSharesHeading: n => `جمع شدہ شیئرز (${n})`,
      guardianFallback: 'گارڈین',
      shareIndexLabel: n => `(#${n})`,
      addedAtLabel: time => `${time} کو شامل کیا گیا`,
      removeShareAria: 'شیئر ہٹائیں',
      invalidShareLabel: n => `غلط شیئر #${n}`,
      progressHeading: 'بحالی کی پیش رفت',
      progressText: n =>
        `${n} شیئر جمع ہو چکے ہیں۔ بحالی کی کوشش کے لیے آپ کو کم از کم 2 شیئرز درکار ہیں۔`,
      recoveringText: 'بحال ہو رہا ہے...',
      recoverButton: n => `والیٹ بحال کریں (${n} شیئرز)`,
      importantWarning:
        'اہم: یقینی بنائیں کہ شیئرز درست گارڈینز کی طرف سے ہیں۔ غلط شیئرز بحالی کی ناکامی کا سبب بنیں گے۔',
      activeHeading: 'سماجی بحالی فعال ہے',
      activeDescription: (threshold, count) =>
        `آپ کا والیٹ ${threshold}-از-${count} گارڈین بحالی سے محفوظ ہے`,
      generateInviteButton: 'دعوت نامہ تیار کریں',
      removeConfigQuestion:
        'کیا تمام گارڈینز کے پاس اپنے شیئرز موجود ہیں؟ اب آپ گارڈین کنفیگریشن کو لوکل اسٹوریج سے ہٹا سکتے ہیں۔ شیئرز آپ کے گارڈینز کے پاس محفوظ طریقے سے رکھے گئے ہیں اور کسی بھی وقت بحالی کے لیے استعمال کیے جا سکتے ہیں۔',
      removeConfigButton: 'گارڈین کنفیگریشن کو لوکل اسٹوریج سے صاف کریں',
      invitationHeading: 'گارڈین دعوت نامہ',
      downloadInviteButton: 'دعوت نامہ ڈاؤن لوڈ کریں',
      sendInviteText: name => `یہ دعوت نامہ ${name} کو ایک محفوظ ذریعے سے بھیجیں`,

      deviceSyncHeading: 'ڈیوائس مطابقت پذیری',
      deviceSyncDescription:
        'آپ کی پاس کی پلیٹ فارم سروسز کا استعمال کرتے ہوئے خودکار طور پر ڈیوائسز کے درمیان مطابقت پذیر ہوتی ہے',
      qrHeading: 'مطابقت پذیری QR کوڈ',
      qrDescription:
        'اپنے والیٹ کے پتے پر مشتمل ایک QR کوڈ تیار کریں تاکہ دوسرے ڈیوائس پر اپنے اکاؤنٹ کی معلومات کو آسانی سے مطابقت پذیر یا تصدیق کیا جا سکے۔',
      generateQrButton: 'مطابقت پذیری QR کوڈ تیار کریں',
      qrNote:
        'نوٹ: اس QR کوڈ میں صرف آپ کے پبلک والیٹ پتے شامل ہیں۔ اس میں آپ کی پرائیویٹ کیز یا بحالی کا فقرہ شامل نہیں ہے۔ اسے دوسرے ڈیوائس پر اپنے اکاؤنٹ کی تصدیق کے لیے استعمال کریں۔',
      hideQrButton: 'QR کوڈ چھپائیں',
      verifyHeading: 'QR کوڈ ڈیٹا کی تصدیق کریں',
      verifyDescription: 'والیٹ کے پتوں کی تصدیق کے لیے اسکین شدہ QR کوڈ سے JSON سٹرنگ پیسٹ کریں۔',
      verifyPlaceholder:
        'JSON ڈیٹا یہاں پیسٹ کریں (مثلاً، {"username":"...","ethereumAddress":"..."})',
      errorLabel: 'خرابی:',
      parsedDataLabel: 'پارس شدہ ڈیٹا:',
      usernameFieldLabel: 'صارف نام:',
      ethAddressLabel: 'ایتھیریم پتہ:',
      index0FieldLabel: 'انڈیکس #0:',
      mainTaggedLabel: 'MAIN-ٹیگ شدہ:',
      openbarTaggedLabel: 'OPENBAR-ٹیگ شدہ:',
      generatedLabel: 'تیار شدہ:',
      linkWalletButton: 'اس والیٹ کو اپنے پاس کی اکاؤنٹ سے منسلک کریں',
      linkExplanation:
        'منسلک کرنے پر کیا ہوتا ہے: یہ والیٹ کے پتے localStorage اور IndexedDB دونوں میں محفوظ کر دے گا، جس سے آپ کے پاس کی اکاؤنٹ اور اس HD والیٹ کے درمیان ایک مستقل ربط بن جائے گا۔ آپ اسے ڈیوائسز کے درمیان والیٹ ڈیٹا کی تصدیق یا مطابقت پذیری کے لیے استعمال کر سکتے ہیں۔',
      howQrWorksHeading: 'QR کوڈ والیٹ مطابقت پذیری کیسے کام کرتی ہے',
      qrStep1:
        'مرحلہ 1: QR کوڈ تیار کریں - اپنے بنیادی ڈیوائس پر، اپنے والیٹ کے پبلک پتوں پر مشتمل ایک QR کوڈ تیار کریں۔ اس QR کوڈ کو شیئر کرنا محفوظ ہے کیونکہ اس میں صرف عوامی معلومات شامل ہیں۔',
      qrStep2:
        'مرحلہ 2: اسکین اور تصدیق - اپنے ثانوی ڈیوائس پر، کسی بھی QR اسکینر ایپ کا استعمال کرتے ہوئے QR کوڈ اسکین کریں، یا QR کوڈ میں دکھائے گئے JSON ڈیٹا کو دستی طور پر کاپی کریں۔',
      qrStep3:
        'مرحلہ 3: والیٹس کو منسلک کریں - JSON ڈیٹا کو اوپر دی گئی تصدیقی جگہ میں پیسٹ کریں اور "اس والیٹ کو منسلک کریں" پر کلک کریں۔ اس سے آپ کے پاس کی اکاؤنٹ اور HD والیٹ کے پتوں کے درمیان ایک مستقل کنکشن بنتا ہے۔',
      whatGetsStored:
        'کیا محفوظ کیا جاتا ہے: صرف عوامی والیٹ پتے localStorage اور IndexedDB میں محفوظ کیے جاتے ہیں۔ آپ کی پرائیویٹ کیز اور بحالی کا فقرہ محفوظ رہتے ہیں اور اس مطابقت پذیری کے طریقہ کار کے ذریعے کبھی منتقل یا محفوظ نہیں کیے جاتے۔',
      platformSyncHeading: 'پاس کی پلیٹ فارم مطابقت پذیری',
      platformSyncIntro:
        'آپ کی پاس کی کی تفصیلات ایک ہی ایکو سسٹم کے اندر ڈیوائسز کے درمیان خودکار طور پر مطابقت پذیر ہوتی ہیں:',
      appleSyncNote: 'Apple: iCloud Keychain کے ذریعے مطابقت پذیر ہوتا ہے (iPhone، iPad، Mac)',
      googleSyncNote: 'Google: Password Manager کے ذریعے مطابقت پذیر ہوتا ہے (Android، Chrome)',
      windowsSyncNote:
        'Windows Hello: ڈیوائس مخصوص، نئے ڈیوائسز کے لیے خفیہ کردہ بیک اپ استعمال کریں',
      hardwareSyncNote: 'ہارڈویئر کیز: کوئی مطابقت پذیری نہیں، خفیہ کردہ بیک اپ الگ سے رکھیں',
      crossPlatformNote:
        'کراس پلیٹ فارم حد: پاس کیز مختلف ایکو سسٹمز کے درمیان مطابقت پذیر نہیں ہوتیں (مثلاً، iPhone سے Android)۔ تاہم، خفیہ کردہ بیک اپس مکمل طور پر کراس پلیٹ فارم ہیں - آپ بیک اپ فائل اور پاس ورڈ کے ساتھ کسی بھی ڈیوائس پر اپنا والیٹ بحال کر سکتے ہیں، خواہ اصل پلیٹ فارم کچھ بھی ہو۔',
      bestPracticesHeading: 'بہترین طریقے',
      practiceBackupFirst:
        'نئے ڈیوائس کے ساتھ مطابقت پذیری سے پہلے ہمیشہ ایک خفیہ کردہ بیک اپ بنائیں',
      practiceVerifyAddresses: 'مطابقت پذیری کے بعد والیٹ کے پتوں کی تصدیق کریں کہ وہ ملتے ہیں',
      practiceUseDebugTools:
        'یہ تصدیق کرنے کے لیے کہ مطابقت پذیری کا ڈیٹا صحیح طریقے سے محفوظ ہوا، ڈیبگ اینڈ انسپیکٹ اسٹوریج ٹولز استعمال کریں',
      practiceNeverShareQr: 'اپنا QR کوڈ کبھی بھی عوامی طور پر یا غیر معتبر ذرائع پر شیئر نہ کریں',
      practiceTreatAsSensitive:
        'QR کوڈز میں صرف عوامی پتے شامل ہوتے ہیں، لیکن پھر بھی انہیں حساس اکاؤنٹ معلومات کے طور پر سمجھیں',

      createBackupModalTitle: 'بیک اپ بنانے کے لیے پاس ورڈ درج کریں',
      createBackupModalDescription:
        'براہ کرم بیک اپ بنانے کے لیے اپنا پاس ورڈ درج کریں۔ یہ آپ کے خفیہ کردہ والیٹ ڈیٹا تک رسائی کے لیے w3pk SDK کی جانب سے درکار ہے۔',
      restoreBackupModalTitle: 'بیک اپ بحال کرنے کے لیے پاس ورڈ درج کریں',
      restoreBackupModalDescription:
        'براہ کرم وہ پاس ورڈ درج کریں جو آپ نے یہ بیک اپ فائل بناتے وقت استعمال کیا تھا۔',
      chooseUsernameModalTitle: 'بحال شدہ والیٹ کے لیے صارف نام منتخب کریں',
      chooseUsernameModalDescription:
        'اس ڈیوائس پر کوئی موجودہ اسناد نہیں ملیں۔ براہ کرم اپنے بحال شدہ والیٹ کو نئی پاس کی کے ساتھ رجسٹر کرنے کے لیے ایک صارف نام منتخب کریں۔',
      usernameFormatError:
        'صارف نام 3-50 حروف کا ہونا چاہیے، حروف/اعداد پر مشتمل ہو جس میں انڈر سکور/ہائیفن شامل ہو سکتے ہیں، اور حرف یا عدد سے شروع اور ختم ہونا چاہیے۔',
      restoringRegisteringText: 'بحال اور رجسٹر ہو رہا ہے...',
      restoreRegisterButton: 'بحال اور رجسٹر کریں',
      removeAccountModalTitle: 'اکاؤنٹ ہٹائیں',
      removeAccountConfirm: username => `کیا آپ واقعی اکاؤنٹ ${username} کو ہٹانا چاہتے ہیں؟`,
      removeAccountWarning:
        'انتباہ: یہ اس اکاؤنٹ کا تمام ڈیٹا اس ڈیوائس سے حذف کر دے گا۔ آگے بڑھنے سے پہلے یقینی بنائیں کہ آپ کے پاس بیک اپ موجود ہے۔ یہ عمل واپس نہیں کیا جا سکتا۔',
      removeAccountLoggedOutNote:
        'یہ آپ کا فی الحال لاگ ان اکاؤنٹ ہے۔ ہٹانے کے بعد آپ لاگ آؤٹ ہو جائیں گے۔',
      removeAccountButton: 'اکاؤنٹ ہٹائیں',
      localStorageModalTitle: 'LocalStorage معائنہ',
      foundItemsText: n => `localStorage میں ${n} اشیاء ملیں`,
      noDataFound: 'کوئی ڈیٹا نہیں ملا',
      indexedDBModalTitle: 'IndexedDB معائنہ',
      foundDatabasesText: n => `${n} ڈیٹا بیس ملے`,
      noDatabasesFound: 'کوئی w3pk سے متعلق ڈیٹا بیس نہیں ملا',

      registrationSuccessTitle: 'رجسٹریشن کامیاب',
      registrationSuccessDescription: 'آپ کا نیا اکاؤنٹ بن گیا ہے۔',
      registrationFailedTitle: 'رجسٹریشن ناکام',
      registrationFailedDefaultDescription: 'رجسٹریشن مکمل نہیں ہو سکی۔ براہ کرم دوبارہ کوشش کریں۔',
      localStorageInspectedTitle: 'LocalStorage کا معائنہ مکمل',
      localStorageInspectedDescription: n =>
        `${n} اشیاء ملیں۔ نتائج دیکھنے کے لیے نیچے سکرول کریں۔`,
      genericErrorTitle: 'خرابی',
      failedInspectLocalStorage: 'localStorage کا معائنہ ناکام ہوا',
      indexedDBInspectedTitle: 'IndexedDB کا معائنہ مکمل',
      indexedDBInspectedDescription: (dbCount, recordCount) =>
        `${recordCount} ریکارڈز کے ساتھ ${dbCount} ڈیٹا بیس ملے۔ نتائج دیکھنے کے لیے نیچے سکرول کریں۔`,
      failedInspectIndexedDB: 'IndexedDB کا معائنہ ناکام ہوا',
      itemClearedTitle: 'آئٹم صاف ہو گیا',
      itemClearedDescription: key => `"${key}" کو localStorage سے ہٹا دیا گیا`,
      failedClearItem: key => `"${key}" کو صاف کرنا ناکام ہوا`,
      recordClearedTitle: 'ریکارڈ صاف ہو گیا',
      recordClearedDescription: (db, store) => `${db}/${store} سے ریکارڈ ہٹا دیا گیا`,
      failedClearRecord: 'ریکارڈ صاف کرنا ناکام ہوا',
      errorLoadingAddressesTitle: 'پتے لوڈ کرنے میں خرابی',
      failedDeriveAddresses: 'والیٹ کے پتے اخذ کرنا ناکام ہوا',
      errorLoadingBackupStatusTitle: 'بیک اپ کی صورتحال لوڈ کرنے میں خرابی',
      failedCheckSecurityStatus: 'سیکیورٹی کی صورتحال چیک کرنا ناکام ہوا',
      accountRemovedTitle: 'اکاؤنٹ ہٹا دیا گیا',
      accountRemovedDescription: username => `اکاؤنٹ ${username} کو اس ڈیوائس سے ہٹا دیا گیا ہے۔`,
      loggingOutTitle: 'لاگ آؤٹ ہو رہا ہے',
      loggingOutDescription: 'آپ نے اپنا موجودہ اکاؤنٹ ہٹا دیا۔ لاگ آؤٹ ہو رہا ہے...',
      failedRemoveAccount: 'اکاؤنٹ ہٹانا ناکام ہوا۔ براہ کرم دوبارہ کوشش کریں۔',
      errorReadingFileTitle: 'فائل پڑھنے میں خرابی',
      failedReadBackupFile: 'بیک اپ فائل پڑھنا ناکام ہوا',
      noBackupFileSelectedTitle: 'کوئی بیک اپ فائل منتخب نہیں کی گئی',
      incompatibleBackupTitle: 'غیر مطابقت پذیر بیک اپ ورژن',
      incompatibleBackupDescription:
        'یہ بیک اپ w3pk کے پرانے ورژن سے بنایا گیا تھا۔ براہ کرم موجودہ ورژن کے ساتھ ایک نیا بیک اپ بنائیں۔',
      walletRestoredTitle: 'والیٹ بحال ہو گیا!',
      walletRestoredDescription: address =>
        `والیٹ کامیابی سے بحال اور اوور رائٹ ہو گیا: ${address}`,
      usernameRequiredRestoreDescription:
        'براہ کرم بحال شدہ والیٹ کے ساتھ رجسٹر کرنے کے لیے ایک صارف نام درج کریں۔',
      walletRestoredRegisteredTitle: 'والیٹ بحال اور رجسٹر ہو گیا!',
      walletRestoredRegisteredDescription: address =>
        `والیٹ کامیابی سے بحال اور رجسٹر ہو گیا: ${address}`,
      securityReportGeneratedTitle: 'سیکیورٹی رپورٹ تیار ہو گئی',
      securityReportGeneratedDescription: 'ذیل میں تفصیلی تجزیہ دیکھیں',
      inspectionFailedTitle: 'معائنہ ناکام ہوا',
      inspectionFailedDescription:
        'ہوسٹ ایپ کا معائنہ کام نہیں کیا۔ اس کی وجہ غالباً Anthropic کی درخواست کی شرح کی حد تک پہنچنا ہے۔',
      backupStatusRetrievedTitle: 'بیک اپ کی صورتحال حاصل ہو گئی۔',
      errorRetrievingStatusTitle: 'صورتحال حاصل کرنے میں خرابی۔',
      unexpectedErrorDescription: 'ایک غیر متوقع خرابی پیش آگئی۔',
      errorCreatingBackupTitle: 'بیک اپ بنانے میں خرابی۔',
      backupCreatedTitle: 'بیک اپ کامیابی سے بن گیا!',
      invalidInputTitle: 'غلط ان پٹ',
      guardianNameRequiredDescription: 'گارڈین کا نام درکار ہے',
      notEnoughGuardiansTitle: 'ناکافی گارڈینز',
      notEnoughGuardiansDescription:
        'سماجی بحالی سیٹ اپ کرنے کے لیے آپ کو کم از کم 2 گارڈینز درکار ہیں',
      invalidThresholdTitle: 'غلط حد',
      invalidThresholdDescription: 'حد گارڈینز کی تعداد سے زیادہ نہیں ہو سکتی',
      socialRecoveryConfiguredTitle: 'سماجی بحالی کنفیگر ہو گئی!',
      socialRecoveryConfiguredDescription: (threshold, count) =>
        `${threshold}-از-${count} گارڈین بحالی کامیابی سے سیٹ اپ ہو گئی`,
      pleasePasteShareDescription: 'براہ کرم ایک گارڈین شیئر کوڈ پیسٹ کریں',
      duplicateShareTitle: 'ڈپلیکیٹ شیئر',
      duplicateShareDescription: 'یہ گارڈین شیئر پہلے ہی شامل کیا جا چکا ہے',
      shareAddedTitle: 'شیئر شامل ہو گیا',
      shareAddedDescription: name => `${name} سے شیئر شامل کیا گیا`,
      invalidShareFormatTitle: 'غلط شیئر فارمیٹ',
      invalidShareFormatDescription: 'براہ کرم ایک درست گارڈین شیئر کوڈ پیسٹ کریں (JSON فارمیٹ)',
      notEnoughSharesTitle: 'ناکافی شیئرز',
      notEnoughSharesDescription:
        'اپنا والیٹ بحال کرنے کے لیے آپ کو کم از کم 2 گارڈین شیئرز درکار ہیں',
      passwordRequiredRecoveryDescription:
        'بیک اپ فائل کو ڈی کرپٹ کرنے کے لیے آپ کو اپنا پاس ورڈ درج کرنا ہوگا',
      usernameRequiredRecoveryDescription:
        'اپنے بحال شدہ والیٹ کو رجسٹر کرنے کے لیے آپ کو ایک صارف نام فراہم کرنا ہوگا',
      walletRecoveredTitle: 'والیٹ کامیابی سے بحال ہو گیا!',
      walletRecoveredDescription: address =>
        `آپ کا والیٹ بحال ہو گیا ہے اور ایک نئی پاس کی کے ساتھ رجسٹر ہو گیا ہے: ${address}`,
      fileLoadedTitle: 'فائل لوڈ ہو گئی',
      fileLoadedDescription:
        'گارڈین شیئر فائل سے لوڈ ہو گیا۔ اسے شامل کرنے کے لیے "شیئر شامل کریں" پر کلک کریں۔',
      failedReadGuardianFile: 'گارڈین شیئر فائل پڑھنا ناکام ہوا',
      cannotSaveTitle: 'محفوظ نہیں کیا جا سکتا',
      cannotSaveDescription: 'غلط QR ڈیٹا یا صارف کی توثیق نہیں ہوئی',
      walletLinkedTitle: 'والیٹ کامیابی سے منسلک ہو گیا!',
      walletLinkedDescription: address =>
        `والیٹ ${address} کو آپ کے پاس کی اکاؤنٹ سے منسلک کر دیا گیا`,
      errorSavingLinkTitle: 'والیٹ لنک محفوظ کرنے میں خرابی',
      failedSaveSyncData: 'والیٹ مطابقت پذیری ڈیٹا محفوظ کرنا ناکام ہوا',
      recoveryPasswordPrompt:
        'وہ پاس ورڈ درج کریں جو آپ نے سماجی بحالی کنفیگر کرتے وقت سیٹ کیا تھا۔\n\nیہ پاس ورڈ گارڈینز کے ساتھ شیئر نہیں کیا گیا تھا - آپ نے اسے سیٹ اپ کے دوران سیٹ کیا تھا۔',
      recoveryUsernamePrompt: address =>
        `اپنی نئی پاس کی رجسٹریشن کے لیے ایک صارف نام منتخب کریں۔\n\nبحال کیا جا رہا والیٹ: ${address}`,
    },
    header: {
      registerTitle: 'نیا اکاؤنٹ رجسٹر کریں',
      walletInfoText:
        'ایک ایتھیریم والیٹ بنایا جائے گا اور آپ کے ڈیوائس پر محفوظ طریقے سے محفوظ کیا جائے گا، جو آپ کے بائیومیٹرک یا پن کے ذریعے محفوظ ہوگا، شکریہ',
      usernameLabel: 'صارف نام',
      usernamePlaceholder: 'اپنا صارف نام درج کریں',
      usernameError:
        'صارف نام 3-50 حروف کا ہونا چاہیے اور اس میں صرف حروف، اعداد، انڈر سکور اور ہائیفن ہونے چاہئیں۔ اسے حرف یا عدد سے شروع اور ختم ہونا چاہیے۔',
      createAccount: 'اکاؤنٹ بنائیں',
      optionsAriaLabel: 'اختیارات',
      mainNavAriaLabel: 'مرکزی نیویگیشن',
      usernameRequiredTitle: 'صارف نام درکار ہے',
      usernameRequiredDescription: 'رجسٹریشن کے لیے براہ کرم صارف نام درج کریں۔',
      noAccountFoundTitle: 'کوئی اکاؤنٹ نہیں ملا',
      noAccountFoundDescription:
        'کوئی پاس کی نہیں ملی۔ نیا اکاؤنٹ بنانے کے لیے براہ کرم رجسٹر کریں۔',
      alreadyRegisteredLink: 'میں پہلے ہی دوسرے ڈیوائس پر رجسٹر ہو چکا ہوں',
    },
    passwordModal: {
      passwordLabel: 'پاس ورڈ',
      passwordPlaceholder: 'اپنا پاس ورڈ درج کریں',
      passwordRequiredTitle: 'پاس ورڈ درکار ہے۔',
      passwordRequiredDescription: 'براہ کرم اپنا پاس ورڈ درج کریں۔',
      weakPasswordTitle: 'کمزور پاس ورڈ۔',
      weakPasswordDescription:
        'براہ کرم ایک مضبوط پاس ورڈ استعمال کریں جو تمام تقاضے پورے کرتا ہو۔',
      submissionErrorTitle: 'جمع کرانے میں خرابی۔',
      submissionErrorDefaultDescription: 'ایک غیر متوقع خرابی پیش آگئی۔',
      requirementsNotMet: 'پاس ورڈ تمام تقاضے پورے نہیں کرتا',
      strongPassword: 'مضبوط پاس ورڈ!',
      mustInclude: 'پاس ورڈ میں شامل ہونا چاہیے:',
      reqMinLength: 'کم از کم 12 حروف',
      reqUpperCase: 'ایک بڑا حرف',
      reqLowerCase: 'ایک چھوٹا حرف',
      reqNumber: 'ایک عدد',
      reqSpecialChar: 'ایک خاص کریکٹر',
      satisfied: ' (پورا ہوگیا)',
      required: ' (درکار ہے)',
      submit: 'جمع کروائیں',
    },
    about: {
      headingPrefix: 'کے بارے میں',
      introPart1:
        'w3pk ایک پاس ورڈ کے بغیر Web3 آتھینٹیکیشن SDK ہے جس میں خفیہ کردہ والیٹس اور پرائیویسی کی خصوصیات شامل ہیں۔ آپ اسے کسی بھی JS/TS پر مبنی ویب ایپ میں استعمال کر سکتے ہیں (Next.js، Vue، Angular، Svelte، …)۔',
      introPart2: 'ایک Next.js ایپ ٹیمپلیٹ ہے، بلا جھجک اسے فورک کریں اور جو چاہیں بنائیں!',
      emailBoxText:
        'w3pk ابھی زیر تعمیر ہے۔ جب ہم نئی خصوصیات شپ کریں (EIP-1193 سپورٹ، AI صلاحیتیں، Viem ہیلپرز، چین ایبسٹریکشن، اور مزید) تو ای میلز حاصل کریں',
      emailPlaceholder: 'your@email.com',
      subscribeButton: 'سبسکرائب کریں',
      githubLabel: 'GitHub',
      npmLabel: 'NPM',
      githubAriaLabel: 'GitHub پر w3pk دیکھیں (نئے ٹیب میں کھلتا ہے)',
      npmAriaLabel: 'NPM پر w3pk دیکھیں (نئے ٹیب میں کھلتا ہے)',
      codeRegisterComment: '// رجسٹر کریں',
      codeLoginComment: '// لاگ ان',
      codeLogoutComment: '// لاگ آؤٹ',
      featuresHeading: 'خصوصیات',
      feature1: 'پاس ورڈ کے بغیر توثیق (WebAuthn/FIDO2)',
      feature2: 'ٹیگ بیسڈ رسائی کنٹرول کے ساتھ اوریجن مخصوص کلید کی علیحدگی',
      feature3: 'سیشن مینجمنٹ (ان-میموری + اختیاری مستقل)',
      feature4: 'HD والیٹ کی تخلیق (BIP39/BIP44)',
      feature5: 'سیکیورٹی موڈز کے ساتھ ملٹی ایڈریس اخذ کاری (STANDARD/STRICT/YOLO)',
      feature6: 'متعدد دستخطی طریقے (EIP-191، SIWE/EIP-4361، EIP-712، rawHash)',
      feature7: 'خودکار RPC ریزولوشن کے ساتھ آن چین ٹرانزیکشن بھیجنا (`sendTransaction`)',
      feature8: 'ethers، viem، wagmi، RainbowKit کے لیے EIP-1193 پرووائیڈر (`getEIP1193Provider`)',
      feature9: 'ERC-5564 اسٹیلتھ پتے (اختیاری شمولیت)',
      feature10: 'ZK پرائمیٹوز (زیرو-نالج پروف کی تخلیق اور تصدیق)',
      feature11: 'Chainlist سپورٹ (2390+ نیٹ ورکس)',
      feature12: 'EIP-7702 نیٹ ورک کی شناخت (329+ نیٹ ورکس)',
      feature13: 'بیرونی والیٹ انضمام (EIP-7702 کے ذریعے MetaMask/Ledger کو w3pk کو تفویض کریں)',
      feature14: 'EIP-7951 PRIMARY موڈ (P-256 پاس کی دستخط)',
      feature15: 'بلڈ تصدیق (IPFS CID ہیشنگ + DAO کی زیر انتظام آن چین رجسٹری)',
      feature16:
        'تین تہوں والا بیک اپ اور بحالی (پاس کی مطابقت پذیری، خفیہ کردہ بیک اپس، سماجی بحالی)',
      feature17: 'AI سے چلنے والا ہوسٹ ایپ معائنہ',
      invalidEmailTitle: 'غلط ای میل',
      invalidEmailDescription: 'براہ کرم ایک درست ای میل ایڈریس درج کریں',
      subscribeSuccessTitle: 'کامیابی!',
      subscribeSuccessDescription: 'آپ w3pk اپ ڈیٹس کے لیے سبسکرائب ہو گئے ہیں',
      subscribeErrorTitle: 'خرابی',
      subscribeErrorDescription: 'سبسکرائب کرنا ناکام ہوا۔ براہ کرم دوبارہ کوشش کریں۔',
    },
  },
}

/**
 * Get translations for the current language
 * @param language Current language code
 * @returns Translation object for the specified language
 */
export function getTranslations(language: Language) {
  return translations[language]
}

/**
 * Hook to use translations in components
 * @param language Current language code
 * @returns Translation object for the current language
 */
export function useTranslations(language: Language) {
  return translations[language]
}
