# API Documentation

Complete API reference for Xpair.

## Table of Contents

- [XPair Component](#xpair-component) - Simple payment modal (start here!)
- [Provider](#provider)
- [Components](#components)
- [Hooks](#hooks)
- [Core Client](#core-client)
- [Types](#types)
- [Utilities](#utilities)
- [Constants](#constants)

---

## XPair Component

**The simplest way to integrate payments** - drop-in payment modal with built-in UI.

```tsx
import { XPair } from 'Xpair';

<XPair
  recipient="8FE27ioQh3T7o22QsYVT5Re8NnHFqmFNbdqwiF3ywuZQ"
  amount="0.01"
  description="Premium feature access"
  resource="https://api.example.com/resource"
  onSuccess={(txHash) => console.log('Payment successful!', txHash)}
  onError={(error) => console.error('Payment failed:', error)}
  onCancel={() => console.log('User cancelled')}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `recipient` | `string` | Yes | Solana wallet address to receive payment |
| `amount` | `string` | Yes | Payment amount in USDC (e.g., "0.01" for 1 cent) |
| `description` | `string` | No | Payment description shown in modal |
| `resource` | `string` | No | Resource identifier for x402 protocol |
| `onSuccess` | `(txHash: string) => void` | No | Callback with transaction signature |
| `onError` | `(error: Error) => void` | No | Error callback |
| `onCancel` | `() => void` | No | Called when user closes modal |

### Features

- ✅ Beautiful pre-built modal UI
- ✅ Automatic wallet connection
- ✅ In-modal success/error display
- ✅ Auto-closes after successful payment
- ✅ No styling required
- ✅ USDC payments on Solana mainnet

---

## Provider

### X402Provider

Main provider component that wraps your application with Solana wallet and x402 functionality.

```tsx
import { X402Provider } from 'Xpair';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

<X402Provider
  config={X402Config}
  wallets={WalletAdapter[]}
  autoConnect={boolean}
>
  {children}
</X402Provider>
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `config` | `X402Config` | No | `{}` | Configuration object |
| `wallets` | `WalletAdapter[]` | No | Default wallets | Custom wallet adapters |
| `autoConnect` | `boolean` | No | `true` | Auto-connect wallet on mount |
| `children` | `ReactNode` | Yes | - | Child components |

#### X402Config

```typescript
interface X402Config {
  facilitatorUrl?: string;        // Default facilitator URL
  network?: WalletAdapterNetwork; // Default: WalletAdapterNetwork.Devnet
  rpcEndpoint?: string;           // Custom RPC endpoint
  useOnchainFi?: boolean;         // Enable aggregator routing
  onchainApiKey?: string;         // API key (optional)
}
```

---

## Components

### PaymentButton

One-click payment button component.

```tsx
import { PaymentButton } from 'Xpair';

<PaymentButton
  recipient="ADDRESS"
  amount="0.01"
  token={tokenInfo}
  description="Payment for service"
  resource="https://api.example.com/data"
  onSuccess={(response) => console.log(response)}
  onError={(error) => console.error(error)}
  className="custom-class"
  disabled={false}
>
  Custom Button Text
</PaymentButton>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `recipient` | `string` | Yes | Solana wallet address |
| `amount` | `string` | Yes | Amount in human-readable format |
| `token` | `TokenInfo` | No | Token to use (default: SOL) |
| `description` | `string` | No | Payment description |
| `resource` | `string` | No | Resource URL for x402 |
| `onSuccess` | `(response: PaymentResponse) => void` | No | Success callback |
| `onError` | `(error: Error) => void` | No | Error callback |
| `className` | `string` | No | CSS class name |
| `children` | `ReactNode` | No | Button content |
| `disabled` | `boolean` | No | Disable button |

---

### PaymentForm

Customizable payment form component.

```tsx
import { PaymentForm } from 'Xpair';

<PaymentForm
  recipient="ADDRESS"
  amount="0.01"
  token={tokenInfo}
  description="Payment description"
  resource="https://api.example.com/data"
  onSuccess={(response) => console.log(response)}
  onError={(error) => console.error(error)}
  className="custom-class"
/>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `recipient` | `string` | Yes | Initial recipient address |
| `amount` | `string` | Yes | Initial amount |
| `token` | `TokenInfo` | No | Token to use (default: SOL) |
| `description` | `string` | No | Payment description |
| `resource` | `string` | No | Resource URL for x402 |
| `onSuccess` | `(response: PaymentResponse) => void` | No | Success callback |
| `onError` | `(error: Error) => void` | No | Error callback |
| `className` | `string` | No | CSS class name |

---

### BalanceDisplay

Display wallet balance component.

```tsx
import { BalanceDisplay } from 'Xpair';

<BalanceDisplay
  token={tokenInfo}
  showRefresh={true}
  className="custom-class"
  onRefresh={() => console.log('Refreshed')}
/>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `token` | `TokenInfo` | No | Token to display (default: SOL) |
| `showRefresh` | `boolean` | No | Show refresh button |
| `className` | `string` | No | CSS class name |
| `onRefresh` | `() => void` | No | Refresh callback |

---

## Hooks

### useX402

Access x402 client and connection.

```tsx
import { useX402 } from 'Xpair';

const { client, connection, network } = useX402();
```

#### Returns

```typescript
{
  client: X402Client;           // x402 client instance
  connection: Connection;        // Solana connection
  network: WalletAdapterNetwork; // Current network
}
```

---

### usePayment

Execute payments programmatically.

```tsx
import { usePayment } from 'Xpair';

const { executePayment, isLoading, error } = usePayment({
  onSuccess: (response) => console.log(response),
  onError: (error) => console.error(error),
});

// Execute payment
await executePayment(
  'RECIPIENT_ADDRESS',
  '0.01',
  tokenInfo,
  'Payment description',
  'https://api.example.com/resource'
);
```

#### Options

```typescript
interface UsePaymentOptions {
  onSuccess?: (response: PaymentResponse) => void;
  onError?: (error: Error) => void;
}
```

#### Returns

```typescript
{
  executePayment: (
    recipient: string,
    amount: string,
    token?: TokenInfo,
    description?: string,
    resource?: string
  ) => Promise<PaymentResponse>;
  isLoading: boolean;
  error: Error | null;
}
```

---

### useBalance

Fetch and display token balances.

```tsx
import { useBalance } from 'Xpair';

const { balance, isLoading, error, refetch } = useBalance(tokenInfo);
```

#### Parameters

- `token?: TokenInfo` - Token to fetch balance for (default: SOL)

#### Returns

```typescript
{
  balance: string;              // Formatted balance
  isLoading: boolean;           // Loading state
  error: Error | null;          // Error if any
  refetch: () => Promise<void>; // Refetch balance
}
```

---

## Core Client

### X402Client

Low-level client for x402 operations.

```tsx
import { X402Client } from 'Xpair';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const client = new X402Client(connection, {
  facilitatorUrl: 'https://facilitator.payai.network',
  network: WalletAdapterNetwork.Devnet,
});
```

#### Methods

##### createPaymentTransaction

Create a payment transaction.

```typescript
async createPaymentTransaction(
  payer: PublicKey,
  recipient: string,
  amount: string,
  tokenMint?: PublicKey
): Promise<Transaction>
```

##### createPaymentPayload

Create x402 payment payload from signed transaction.

```typescript
createPaymentPayload(
  signedTransaction: Transaction,
  scheme?: 'exact' | 'dynamic'
): PaymentPayload
```

##### verify

Verify a payment without settling.

```typescript
async verify(
  paymentPayload: PaymentPayload,
  paymentRequirements: PaymentRequirement
): Promise<VerifyResponse>
```

##### settle

Settle a payment (broadcast to blockchain).

```typescript
async settle(
  paymentPayload: PaymentPayload,
  paymentRequirements: PaymentRequirement
): Promise<SettleResponse>
```

##### executePayment

Complete payment flow (verify + settle).

```typescript
async executePayment(
  signedTransaction: Transaction,
  paymentRequirements: PaymentRequirement
): Promise<SettleResponse>
```

##### getSupported

Get supported payment schemes and networks.

```typescript
async getSupported(): Promise<SupportedResponse>
```

##### discoverResources

Discover x402-enabled resources.

```typescript
async discoverResources(
  params?: ResourceDiscoveryParams
): Promise<ResourceDiscoveryResponse>
```

##### fetchProtectedResource

Make a request to an x402-protected resource.

```typescript
async fetchProtectedResource(
  url: string,
  options?: RequestInit
): Promise<Response>
```

---

## Types

### TokenInfo

```typescript
interface TokenInfo {
  mint: PublicKey;    // Token mint address
  symbol: string;     // Token symbol (e.g., 'USDC')
  decimals: number;   // Token decimals
  name?: string;      // Token name (optional)
}
```

### PaymentResponse

```typescript
interface PaymentResponse {
  success: boolean;
  transaction?: string;  // Transaction signature
  error?: string;        // Error message if failed
  payer?: string;        // Payer wallet address
}
```

### PaymentRequirement

```typescript
interface PaymentRequirement {
  x402Version: number;
  scheme: 'exact' | 'dynamic';
  network: SolanaNetwork;
  maxAmountRequired: string;
  asset: string;           // Token mint or 'native'
  payTo: string;           // Recipient address
  resource: string;        // Resource URL
  description?: string;
  mimeType?: string;
  outputSchema?: string;
  maxTimeoutSeconds?: number;
  extra?: Record<string, any>;
}
```

### VerifyResponse

```typescript
interface VerifyResponse {
  isValid: boolean;
  payer: string;
  invalidReason?: string;
}
```

### SettleResponse

```typescript
interface SettleResponse {
  success: boolean;
  payer: string;
  transaction: string;
  network: string;
  errorReason?: string;
}
```

---

## Utilities

### Token Utilities

```typescript
import {
  getTokenBalance,
  getSolBalance,
  formatTokenAmount,
  parseTokenAmount,
  isValidSolanaAddress,
} from 'Xpair';
```

#### getTokenBalance

Get SPL token balance for a wallet.

```typescript
async function getTokenBalance(
  connection: Connection,
  walletAddress: PublicKey,
  tokenMint: PublicKey
): Promise<bigint>
```

#### getSolBalance

Get SOL balance for a wallet.

```typescript
async function getSolBalance(
  connection: Connection,
  walletAddress: PublicKey
): Promise<number>
```

#### formatTokenAmount

Format token amount from atomic units to human-readable.

```typescript
function formatTokenAmount(
  amount: bigint | string,
  decimals: number
): string
```

Example:
```typescript
formatTokenAmount('1000000', 6) // Returns: '1'
formatTokenAmount('1500000', 6) // Returns: '1.5'
```

#### parseTokenAmount

Parse human-readable amount to atomic units.

```typescript
function parseTokenAmount(
  amount: string,
  decimals: number
): string
```

Example:
```typescript
parseTokenAmount('1.5', 6) // Returns: '1500000'
```

#### isValidSolanaAddress

Validate a Solana address.

```typescript
function isValidSolanaAddress(address: string): boolean
```

---

## Constants

### DEFAULT_FACILITATOR_URL

```typescript
const DEFAULT_FACILITATOR_URL = string; // Default facilitator endpoint
```

### NETWORK_MAP

Maps WalletAdapterNetwork to SolanaNetwork string.

```typescript
const NETWORK_MAP: Record<WalletAdapterNetwork, SolanaNetwork> = {
  [WalletAdapterNetwork.Mainnet]: 'solana',
  [WalletAdapterNetwork.Devnet]: 'solana-devnet',
  [WalletAdapterNetwork.Testnet]: 'solana-testnet',
};
```

### RPC_ENDPOINTS

Default RPC endpoints for each network.

```typescript
const RPC_ENDPOINTS: Record<WalletAdapterNetwork, string> = {
  [WalletAdapterNetwork.Mainnet]: 'https://api.mainnet-beta.solana.com',
  [WalletAdapterNetwork.Devnet]: 'https://api.devnet.solana.com',
  [WalletAdapterNetwork.Testnet]: 'https://api.testnet.solana.com',
};
```

### USDC_MINT

USDC token mint addresses for each network.

```typescript
const USDC_MINT: Record<WalletAdapterNetwork, PublicKey> = {
  [WalletAdapterNetwork.Mainnet]: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  [WalletAdapterNetwork.Devnet]: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  [WalletAdapterNetwork.Testnet]: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
};
```

### DEFAULT_TOKEN_INFO

Default USDC token information.

```typescript
const DEFAULT_TOKEN_INFO = {
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
};
```

### X402_VERSION

Current x402 protocol version.

```typescript
const X402_VERSION = 1;
```

---

## Error Handling

All async operations may throw errors. It's recommended to wrap them in try-catch blocks:

```typescript
try {
  await executePayment('RECIPIENT', '0.01', token);
} catch (error) {
  if (error instanceof Error) {
    console.error('Payment failed:', error.message);
  }
}
```

Common error reasons:
- `insufficient_funds` - Not enough tokens or SOL
- `invalid_signature` - Transaction signature invalid
- `invalid_network` - Network mismatch
- `unsupported_scheme` - Payment scheme not supported
- `Wallet not connected` - No wallet connected

---

## Best Practices

1. **Always handle errors**: Use onError callbacks or try-catch blocks
2. **Validate addresses**: Use `isValidSolanaAddress()` before transactions
3. **Show loading states**: Use `isLoading` from hooks to show feedback
4. **Test on Devnet**: Always test on Devnet before Mainnet
5. **Check balances**: Verify users have sufficient balance before payments
6. **Use TypeScript**: Take advantage of full type safety
