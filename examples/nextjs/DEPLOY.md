# Deploying Xpair Next.js Example

This guide shows you how to deploy the Xpair Next.js example application.

## Quick Deploy to Vercel

The easiest way to deploy this Next.js app is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Xpair-fun/Xpair/tree/main/examples/nextjs)

### Manual Vercel Deployment

1. **Fork or clone this repository**
   ```bash
   git clone https://github.com/Xpair-fun/Xpair.git
   cd Xpair/examples/nextjs
   ```

2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `Xpair-demo` (or your choice)
   - Directory: `./`
   - Override settings: `N`

5. **Your app is live!**
   Vercel will provide you with a URL like: `https://Xpair-demo.vercel.app`

## Deploy to Other Platforms

### Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   cd examples/nextjs
   netlify deploy --prod
   ```

### Railway

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

## Environment Variables

The example app doesn't require any environment variables by default. However, if you want to use a custom RPC endpoint:

### Optional Variables

- `NEXT_PUBLIC_HELIUS_API_KEY` - Helius RPC API key (optional, for better performance)

To add environment variables in Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add your variables

## Configuration

### Network Configuration

By default, the app uses Solana Mainnet. To change networks, edit `src/pages/_app.tsx`:

```tsx
<X402Provider
  config={{
    network: WalletAdapterNetwork.Mainnet, // Change to Devnet or Testnet
    rpcEndpoint: 'https://api.mainnet-beta.solana.com',
    useOnchainFi: true,
  }}
>
```

### Custom Styling

The app uses Tailwind CSS. Customize styles in:
- `tailwind.config.js` - Tailwind configuration
- `src/styles/globals.css` - Global styles

## Troubleshooting

### Build Fails

If the build fails with webpack errors, ensure `next.config.js` has the correct fallbacks:

```javascript
module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};
```

### Dependencies Not Resolving

If you encounter dependency issues, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Runtime Errors

Check that:
1. Your wallet is connected
2. You're on the correct network (Mainnet/Devnet)
3. You have SOL for transaction fees

## Production Checklist

Before deploying to production:

- [ ] Update the recipient wallet address in demo components
- [ ] Set appropriate payment amounts
- [ ] Test all payment flows
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up analytics
- [ ] Add proper error handling
- [ ] Test on different wallets (Phantom, Solflare, etc.)
- [ ] Verify smart routing works correctly

## Custom Domain

### Vercel

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as shown

### Netlify

1. Go to Site settings > Domain management
2. Add custom domain
3. Follow DNS configuration instructions

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Open an issue on [GitHub](https://github.com/Xpair-fun/Xpair/issues)
- Review [Next.js Deployment Docs](https://nextjs.org/docs/deployment)

## What's Deployed

The deployed app includes:
- Full Xpair payment integration
- Smart routing with multiple facilitators
- Multiple payment examples
- Wallet connection UI
- Balance display components
- Test suite

All using the published `Xpair` npm package.
