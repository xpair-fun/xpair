import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';

export type SolanaNetwork = 'solana' | 'solana-devnet' | 'solana-testnet';

export interface X402Config {
  facilitatorUrl?: string;
  network?: WalletAdapterNetwork;
  rpcEndpoint?: string;
  onchainApiKey?: string; // API key for smart routing
  useOnchainFi?: boolean; // Use aggregator instead of direct facilitator
}

export interface PaymentRequirement {
  scheme: 'exact' | 'dynamic';
  network: SolanaNetwork;
  maxAmountRequired: string;
  asset: string; // Token mint address
  payTo: string; // Recipient wallet address
  resource: string;
  description?: string;
  mimeType?: string;
  outputSchema?: string;
  maxTimeoutSeconds?: number;
  extra?: {
    feePayer?: string;
    [key: string]: any;
  };
}

export interface PaymentPayload {
  x402Version: number;
  scheme: 'exact' | 'dynamic';
  network: SolanaNetwork;
  payload: {
    transaction: string; // Base64 encoded partially signed transaction
  };
}

export interface VerifyRequest {
  paymentPayload: PaymentPayload;
  paymentRequirements: PaymentRequirement;
}

export interface VerifyResponse {
  isValid: boolean;
  payer: string;
  invalidReason?: string;
}

export interface SettleRequest {
  paymentPayload: PaymentPayload;
  paymentRequirements: PaymentRequirement;
}

export interface SettleResponse {
  success: boolean;
  payer: string;
  transaction: string;
  network: string;
  errorReason?: string;
}

export interface PaymentResponse {
  success: boolean;
  transaction?: string;
  error?: string;
  payer?: string;
}

export interface TokenInfo {
  mint: PublicKey;
  symbol: string;
  decimals: number;
  name?: string;
}

export interface PaymentFormProps {
  recipient: string;
  amount: string;
  token: TokenInfo; // Required: PayAI facilitator only supports SPL tokens (USDC)
  description?: string;
  resource?: string;
  onSuccess?: (response: PaymentResponse) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export interface PaymentButtonProps {
  recipient: string;
  amount: string;
  token: TokenInfo; // Required: PayAI facilitator only supports SPL tokens (USDC)
  description?: string;
  resource?: string;
  onSuccess?: (response: PaymentResponse) => void;
  onError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export interface BalanceDisplayProps {
  token?: TokenInfo;
  showRefresh?: boolean;
  className?: string;
  onRefresh?: () => void;
}

export interface SupportedKind {
  x402Version: number;
  scheme: string;
  network: string;
  extra?: Record<string, any>;
}

export interface SupportedResponse {
  kinds: SupportedKind[];
}

export interface ResourceDiscoveryParams {
  type?: string;
  limit?: number;
  offset?: number;
}

export interface ResourceDiscoveryResponse {
  x402Version: number;
  items: PaymentRequirement[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
