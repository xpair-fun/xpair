import type { AppProps } from 'next/app';
import { X402Provider } from 'xpair';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <X402Provider
      config={{
        network: WalletAdapterNetwork.Mainnet,
        rpcEndpoint: 'https://mainnet.helius-rpc.com/?api-key=d61f068c-a0c5-46b8-bcde-a32810ed6439',
        onchainApiKey: 'local-proxy',
      }}
      autoConnect={true}
    >
      <Component {...pageProps} />
    </X402Provider>
  );
}
