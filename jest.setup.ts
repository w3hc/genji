import '@testing-library/jest-dom'

// Just mock Reown AppKit as it's essential for the app to render
jest.mock('@reown/appkit/react', () => ({
  useAppKitAccount: () => ({
    address: null,
    isConnected: false,
    caipAddress: null,
  }),
  useAppKitProvider: () => ({
    walletProvider: null,
  }),
}))
