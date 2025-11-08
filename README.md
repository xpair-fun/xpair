# Xpair

The simplest way to add USDC payments to your Next.js app. One component, no complexity.

Drop-in payment modal for Solana micropayments using USDC with smart routing via onchain.fi.

## What is x402?

x402 is an open payment protocol that brings stablecoin payments to plain HTTP. It leverages the HTTP 402 status code ("Payment Required") to enable servers to charge for APIs and digital content. Key features include:

- **Simple HTTP integration** using status code 402
- **Micropayments** with stablecoins (USDC on Solana)
- **Agent-native**: AI agents can discover and pay automatically
- **No accounts or API keys** required

## Features

- **One Component**: Just drop in `<XPair />` and you're done
- **Beautiful UI**: Pre-built payment modal, no styling needed
- **Smart Routing**: onchain.fi routes to 3 facilitators for maximum reliability
- **Zero Fees**: Users pay nothing extra, facilitator covers fees
- **Wallet Support**: Works with Phantom, Solflare, and all Solana wallets
- **TypeScript**: Full type safety included
- **React Hooks**: Advanced hooks available if needed

## Installation

```bash
npm install Xpair
```

Or with yarn:

```bash
yarn add Xpair
```

Or with bun:

```bash
bun add Xpair
```

## Quick Start

### 1. Wrap your app with X402Provider

```tsx
// pages/_app.tsx
import { X402Provider } from 'Xpair';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export default function App({ Component, pageProps }) {
  return (
    <X402Provider
      config={{
        network: WalletAdapterNetwork.Mainnet,
        rpcEndpoint: 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY',
        useOnchainFi: true, // Enable smart routing
      }}
      autoConnect={true}
    >
      <Component {...pageProps} />
    </X402Provider>
  );
}
```

### 2. Add XPair payment modal

That's it! Just drop in the XPair component:

```tsx
import { XPair } from 'Xpair';

export default function PaymentPage() {
  return (
    <div>
      <h1>Make a Payment</h1>

      <XPair
        recipient="8FE27ioQh3T7o22QsYVT5Re8NnHFqmFNbdqwiF3ywuZQ"
        amount="0.01"
        description="Premium feature access"
        onSuccess={(txHash) => console.log('Payment successful!', txHash)}
        onError={(error) => console.error('Payment failed:', error)}
      />
    </div>
  );
}
```

**That's it!** Your users can now:
- Click the button to open the payment modal
- Connect their wallet automatically
- Complete the payment
- See success confirmation in the modal

No styling needed, no complex setup, just works.

## API Reference

### XPair

The main payment modal component - use this for the simplest integration.

```tsx
import { XPair } from 'Xpair';

<XPair
  recipient="WALLET_ADDRESS"
  amount="0.01"
  description="Payment for service"
  resource="https://api.example.com/resource"
  onSuccess={(txHash) => console.log('Success!', txHash)}
  onError={(error) => console.error('Error:', error)}
  onCancel={() => console.log('User cancelled')}
/>
```

**Props:**
- `recipient` (string): Recipient wallet address
- `amount` (string): Payment amount in USDC
- `description` (string, optional): Payment description
- `resource` (string, optional): Resource URL for x402
- `onSuccess` (function, optional): Callback with transaction hash
- `onError` (function, optional): Error callback
- `onCancel` (function, optional): Cancel callback

### X402Provider

The provider component that wraps your application.

```tsx
<X402Provider
  config={{
    network: WalletAdapterNetwork.Mainnet,
    rpcEndpoint: 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY',
    useOnchainFi: true, // Enable smart routing
  }}
  wallets={[]} // optional, custom wallet adapters
  autoConnect={true} // optional, default true
>
  {children}
</X402Provider>
```

### PaymentButton

A button component for one-click payments.

**Props:**
- `recipient` (string): Recipient wallet address
- `amount` (string): Payment amount in human-readable format
- `token` (TokenInfo, optional): Token to use (defaults to SOL)
- `description` (string, optional): Payment description
- `resource` (string, optional): Resource URL for x402
- `onSuccess` (function, optional): Success callback
- `onError` (function, optional): Error callback
- `className` (string, optional): CSS class
- `children` (ReactNode, optional): Button content
- `disabled` (boolean, optional): Disable button

### PaymentForm

A form component for customizable payments.

**Props:**
- `recipient` (string): Initial recipient address
- `amount` (string): Initial amount
- `token` (TokenInfo, optional): Token to use
- `description` (string, optional): Payment description
- `resource` (string, optional): Resource URL for x402
- `onSuccess` (function, optional): Success callback
- `onError` (function, optional): Error callback
- `className` (string, optional): CSS class

### BalanceDisplay

Display wallet balance for a specific token.

**Props:**
- `token` (TokenInfo, optional): Token to display (defaults to SOL)
- `showRefresh` (boolean, optional): Show refresh button
- `className` (string, optional): CSS class
- `onRefresh` (function, optional): Refresh callback

## Hooks

### usePayment

Hook for executing payments programmatically.

```tsx
import { usePayment } from 'Xpair';

function MyComponent() {
  const { executePayment, isLoading, error } = usePayment({
    onSuccess: (response) => console.log('Success:', response),
    onError: (error) => console.error('Error:', error),
  });

  const handlePay = async () => {
    await executePayment(
      'RECIPIENT_ADDRESS',
      '0.01',
      usdcToken,
      'Payment description'
    );
  };

  return <button onClick={handlePay}>Pay</button>;
}
```

### useBalance

Hook for fetching wallet balances.

```tsx
import { useBalance } from 'Xpair';

function MyComponent() {
  const { balance, isLoading, error, refetch } = useBalance(usdcToken);

  return <div>Balance: {balance} USDC</div>;
}
```

### useX402

Hook for accessing the x402 client.

```tsx
import { useX402 } from 'Xpair';

function MyComponent() {
  const { client, connection, network } = useX402();

  // Use client for advanced x402 operations
}
```

## Advanced Usage

### Custom Token

```tsx
import { PublicKey } from '@solana/web3.js';

const customToken = {
  mint: new PublicKey('YOUR_TOKEN_MINT_ADDRESS'),
  symbol: 'TOKEN',
  decimals: 6,
  name: 'Custom Token',
};

<PaymentButton
  recipient="RECIPIENT_ADDRESS"
  amount="1.0"
  token={customToken}
/>
```

### Direct X402 Client Usage

```tsx
import { useX402 } from 'Xpair';
import { useWallet } from '@solana/wallet-adapter-react';

function AdvancedPayment() {
  const { client } = useX402();
  const { publicKey, signTransaction } = useWallet();

  const handlePayment = async () => {
    // Create transaction
    const transaction = await client.createPaymentTransaction(
      publicKey,
      'RECIPIENT_ADDRESS',
      '1000000', // amount in atomic units
      tokenMint
    );

    // Sign transaction
    const signed = await signTransaction(transaction);

    // Create payment requirements
    const requirements = {
      x402Version: 1,
      scheme: 'exact',
      network: 'solana-devnet',
      maxAmountRequired: '1000000',
      asset: tokenMint.toString(),
      payTo: 'RECIPIENT_ADDRESS',
      resource: 'https://example.com/api',
    };

    // Execute payment
    const result = await client.executePayment(signed, requirements);
  };
}
```

## Examples

Check out the [examples/nextjs](./examples/nextjs) directory for a complete Next.js application demonstrating all features.

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch mode for development
npm run dev

# Type checking
npm run type-check
```

## Resources

- [x402 Protocol Documentation](https://docs.payai.network/x402/introduction)
- [PayAI Network](https://payai.network/)
- [Solana Documentation](https://docs.solana.com/)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
