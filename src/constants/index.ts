import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
import { SolanaNetwork } from '../types';

export const DEFAULT_FACILITATOR_URL = 'https://facilitator.payai.network';

export const NETWORK_MAP: Record<WalletAdapterNetwork, SolanaNetwork> = {
  [WalletAdapterNetwork.Mainnet]: 'solana',
  [WalletAdapterNetwork.Devnet]: 'solana-devnet',
  [WalletAdapterNetwork.Testnet]: 'solana-testnet',
};

export const RPC_ENDPOINTS: Record<WalletAdapterNetwork, string> = {
  [WalletAdapterNetwork.Mainnet]: 'https://api.mainnet-beta.solana.com',
  [WalletAdapterNetwork.Devnet]: 'https://api.devnet.solana.com',
  [WalletAdapterNetwork.Testnet]: 'https://api.testnet.solana.com',
};

// USDC Token Mints
export const USDC_MINT: Record<WalletAdapterNetwork, PublicKey> = {
  [WalletAdapterNetwork.Mainnet]: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  [WalletAdapterNetwork.Devnet]: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  [WalletAdapterNetwork.Testnet]: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
};

export const DEFAULT_TOKEN_INFO = {
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
};

export const X402_VERSION = 1;
