import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { Connection } from '@solana/web3.js';
import { X402Client } from '../core/x402Client';
import { X402Config } from '../types';
import { RPC_ENDPOINTS } from '../constants';

// Import default styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface X402ContextValue {
  client: X402Client;
  connection: Connection;
  network: WalletAdapterNetwork;
}

const X402Context = createContext<X402ContextValue | null>(null);

export interface X402ProviderProps {
  children: ReactNode;
  config?: X402Config;
  wallets?: any[];
  autoConnect?: boolean;
}

export const X402Provider: React.FC<X402ProviderProps> = ({
  children,
  config = {},
  wallets: customWallets,
  autoConnect = true,
}) => {
  const network = config.network || WalletAdapterNetwork.Devnet;
  const endpoint = config.rpcEndpoint || RPC_ENDPOINTS[network];

  // Initialize connection
  const connection = useMemo(() => new Connection(endpoint, 'confirmed'), [endpoint]);

  // Initialize x402 client
  const client = useMemo(
    () => new X402Client(connection, config),
    [connection, config]
  );

  // Setup wallets
  const wallets = useMemo(
    () =>
      customWallets || [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new TorusWalletAdapter(),
        new LedgerWalletAdapter(),
      ],
    [customWallets]
  );

  const contextValue: X402ContextValue = useMemo(
    () => ({
      client,
      connection,
      network,
    }),
    [client, connection, network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <WalletModalProvider>
          <X402Context.Provider value={contextValue}>
            {children}
          </X402Context.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const useX402 = (): X402ContextValue => {
  const context = useContext(X402Context);
  if (!context) {
    throw new Error('useX402 must be used within X402Provider');
  }
  return context;
};
