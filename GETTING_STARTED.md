# Getting Started with Xpair

This guide will walk you through adding USDC payments to your Next.js application in just 2 steps.

## Prerequisites

- Node.js 18+ installed
- A Next.js project (or create one with `npx create-next-app@latest`)
- Basic knowledge of React and Next.js
- A Solana wallet (Phantom, Solflare, etc.)

## Installation

Install Xpair in your Next.js project:

```bash
npm install Xpair
```

Or with bun:

```bash
bun add Xpair
```

## Step 1: Setup the Provider

Wrap your application with the `X402Provider` in your `_app.tsx` file:

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { X402Provider } from 'Xpair';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <X402Provider
      config={{
        network: WalletAdapterNetwork.Mainnet,
        rpcEndpoint: 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY',
      }}
      autoConnect={true}
    >
      <Component {...pageProps} />
    </X402Provider>
  );
}
```

## Step 2: Add XPair Component

That's it! Just drop in the XPair component:

```tsx
// pages/payment.tsx
import { XPair } from 'Xpair';

export default function PaymentPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Payment Demo</h1>

      <XPair
        recipient="8FE27ioQh3T7o22QsYVT5Re8NnHFqmFNbdqwiF3ywuZQ"
        amount="0.01"
        description="Premium feature access"
        onSuccess={(txHash) => {
          console.log('Payment successful!', txHash);
          alert(`Payment successful! TX: ${txHash}`);
        }}
        onError={(error) => {
          console.error('Payment failed:', error);
          alert(`Payment failed: ${error.message}`);
        }}
      />
    </div>
  );
}
```

**Done!** Your users can now:
- Click the button to open a beautiful payment modal
- Connect their wallet automatically
- Complete the payment with USDC
- See confirmation in the modal before it auto-closes

No styling needed, no complex setup. Just works.

## Step 3: Configure Next.js

Update your `next.config.js` to handle Solana dependencies:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
```

## Step 3: Test Your Integration

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to your payment page (e.g., http://localhost:3000/payment)

3. Connect your wallet using the wallet button

4. Try making a test payment

## Advanced Usage

### Using Hooks for Custom UI

If you need custom UI, use the `usePayment` hook:

```tsx
import { usePayment } from 'Xpair';

function CustomPaymentComponent() {
  const { executePayment, isLoading, error } = usePayment({
    onSuccess: (response) => console.log('Success:', response),
    onError: (error) => console.error('Error:', error),
  });

  const handleClick = async () => {
    await executePayment(
      'RECIPIENT_ADDRESS',
      '0.01',
      usdcToken,
      'Custom payment'
    );
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
```

### Using Other Components

Xpair also includes PaymentButton, PaymentForm, and BalanceDisplay for more control:

```tsx
import { PaymentButton, BalanceDisplay } from 'Xpair';

<BalanceDisplay token={usdcToken} showRefresh={true} />
<PaymentButton
  recipient="ADDRESS"
  amount="0.01"
  token={usdcToken}
  onSuccess={handleSuccess}
>
  Pay Now
</PaymentButton>
```

## What's Included

- **XPair**: Simple payment modal (easiest way)
- **Smart Routing**: Automatic failover across multiple facilitators
- **Zero Fees**: Users pay nothing extra
- **USDC Payments**: Stablecoin payments on Solana mainnet
- **Automatic ATA Creation**: No manual setup needed

## Troubleshooting

### "Wallet not connected" error
- Make sure the user has connected their wallet
- Check that the wallet is on Mainnet (not Devnet or Testnet)

### "Insufficient funds" error
- User needs SOL for transaction fees (very small amount)
- User needs USDC for the payment amount

### Build errors in Next.js
- Ensure you've configured webpack fallbacks in `next.config.js`
- Make sure all peer dependencies are installed

## Next Steps

- Check out the [full example](./examples/nextjs) for more advanced usage
- Read the [API Reference](./README.md#api-reference) for detailed documentation
- Learn about [x402 protocol](https://github.com/coinbase/x402)

## Support

For issues or questions:
- Open an issue on GitHub
- Check the [x402 documentation](https://github.com/coinbase/x402)
