# Next.js xpair Example

This is an example Next.js application demonstrating how to integrate the **xpair** library for Solana-based x402 payments.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xpair-fun/xpair/tree/main/examples/nextjs)

## Features

- 🎯 **Simple Integration** - Just one component: `<XPair />`
- 💳 **USDC Payments** - Pay with USDC on Solana mainnet
- 🔄 **Smart Routing** - Automatic routing across multiple facilitators
- 👛 **Wallet Integration** - Full Solana wallet adapter support
- ⚡ **Fast & Reliable** - Sub-second payment verification
- 🎨 **Pre-built UI** - Beautiful payment modal, no styling needed

## Getting Started

### 1. Install & Run

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

## Deploy Your Own

Want to deploy this example? Check out the [Deployment Guide](./DEPLOY.md) for instructions on deploying to Vercel, Netlify, or Railway.

Quick deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Xpair-fun/Xpair/tree/main/examples/nextjs)

## Learn More

- [x402 Protocol](https://github.com/coinbase/x402)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Documentation](https://docs.solana.com/)

## Support

- GitHub: [Report issues](https://github.com/Xpair-fun/Xpair/issues)
