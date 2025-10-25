# Next.js xpair Example

This is an example Next.js application demonstrating how to integrate the **xpair** library for Solana-based x402 payments with **onchain.fi smart routing**.

## Features

- 🎯 **Simple Integration** - Just one component: `<XPair />`
- 💳 **USDC Payments** - Pay with USDC on Solana mainnet
- 🔄 **Smart Routing** - Automatic routing across multiple facilitators via onchain.fi
- 👛 **Wallet Integration** - Full Solana wallet adapter support
- ⚡ **Fast & Reliable** - Sub-second payment verification
- 🎨 **Pre-built UI** - Beautiful payment modal, no styling needed

## Getting Started

### 1. Get Your onchain.fi API Key

Visit [onchain.fi/get-api-key](https://onchain.fi/get-api-key) and enter your email. You'll receive your API key instantly.

Or use cURL:
```bash
curl -X POST https://api.onchain.fi/v1/api-keys/request \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com"}'
```

### 2. Configure Environment

Create `.env.local` and add your API key:
```env
NEXT_PUBLIC_ONCHAIN_API_KEY=your-api-key-here
```

### 3. Install & Run

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features Demonstrated

### 1. Simple Payment Modal (`/simple`)
- **XPair Component**: Drop-in payment modal - the easiest way to integrate
- **One-line Integration**: Just `<XPair recipient="..." amount="..." />`
- **Built-in UI**: Beautiful modal with wallet connection and success states

### 2. Advanced Components (`/`)
- **Wallet Connection**: Connect Solana wallets (Phantom, Solflare, etc.)
- **Balance Display**: Show USDC balance with refresh functionality
- **Quick Payment**: One-click payment button
- **Custom Payment Form**: Form for customizable payment amounts
- **Payment Confirmation**: Display transaction details after successful payment

## Usage

### Connect Your Wallet

Click "Select Wallet" to connect your Solana wallet. Make sure you're on **Solana Mainnet**.

### Get USDC

Make sure you have:
1. SOL for transaction fees (small amount needed)
2. USDC for payments

You can buy USDC on exchanges like Coinbase, Kraken, or Jupiter.

### Make a Payment

- Use the Quick Payment button to send 0.01 USDC instantly
- Or use the Custom Payment form to enter any amount

## How onchain.fi Works

The app uses **onchain.fi smart routing** to automatically select the best facilitator:

- **OctonetAI** - Supports Solana + SVM
- **Aurracloud** - Solana specialist
- **PayAI** - Multi-chain support

onchain.fi handles:
- ✅ Automatic failover if one facilitator is down
- ✅ Intelligent selection by speed, cost, or reliability
- ✅ Built-in retries and error handling

## Project Structure

```
examples/nextjs/
├── src/
│   ├── pages/
│   │   ├── _app.tsx       # X402Provider setup
│   │   ├── index.tsx      # Advanced components demo
│   │   └── simple.tsx     # XPair component demo (start here!)
│   └── styles/
│       └── globals.css    # Global styles
├── next.config.js
├── tsconfig.json
└── package.json
```

**Start with `/simple`** to see the easiest integration with XPair component!

## Learn More

- [onchain.fi Documentation](https://onchain.fi/docs)
- [x402 Protocol](https://github.com/coinbase/x402)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Documentation](https://docs.solana.com/)

## Support

- Email: support@onchain.fi
- Discord: [Join community](https://discord.gg/onchainfi)
- GitHub: [Report issues](https://github.com/zortos/x402api/issues)
