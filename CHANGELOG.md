# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-11-08

### Changed
- **BREAKING**: Package renamed from `@solana-x402/connect` to `Xpair`
- Package now focuses on simple payment modal experience

### Added
- **XPair Component**: New one-line payment modal component for effortless integration
  - Simple usage: `<XPair recipient="..." amount="..." />`
  - Built-in beautiful payment UI with modal overlay
  - Automatic wallet connection handling
  - In-modal success display with transaction hash
  - Auto-close after successful payment (3 second countdown)
  - Clean error handling separating wallet rejection from payment errors
- **onchain.fi Integration**: Smart routing across multiple facilitators
  - Automatic failover between 3 facilitators
  - Zero-fee transactions for users (facilitator pays)
  - Improved payment reliability
- Simple demo page at `examples/nextjs/src/pages/simple.tsx`
- Server-side API key security via Next.js API proxy

### Fixed
- Wallet connection rejection no longer shows error message
- Success notification now displays in modal instead of external alert
- Improved error handling for wallet vs payment failures

### Features
- Drop-in payment solution with `<XPair />` component
- Beautiful pre-built UI with no styling required
- Supports callbacks: onSuccess, onError, onCancel
- Automatic ATA (Associated Token Account) creation
- USDC payments on Solana mainnet

## [0.1.0] - 2024-11-07

### Added
- Initial release of @solana-x402/connect
- X402Provider for Next.js applications
- PaymentButton component for one-click payments
- PaymentForm component for customizable payments
- BalanceDisplay component for wallet balances
- usePayment hook for programmatic payments
- useBalance hook for fetching balances
- useX402 hook for accessing x402 client
- Full TypeScript support
- Support for USDC and SOL payments
- Integration with Solana wallet adapters (Phantom, Solflare, Torus, Ledger)
- x402 protocol implementation (verify and settle)
- Resource discovery API
- Next.js example application
- Comprehensive documentation

### Features
- Instant micropayments on Solana
- No API keys or accounts required
- AI agent-ready payment protocol
- Multi-wallet support
- Customizable UI components
- Full type safety with TypeScript
