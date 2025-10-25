import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram,
  TransactionInstruction,
  SystemProgram,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
  getMint,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import {
  X402Config,
  PaymentRequirement,
  PaymentPayload,
  VerifyRequest,
  VerifyResponse,
  SettleRequest,
  SettleResponse,
  SupportedResponse,
  ResourceDiscoveryParams,
  ResourceDiscoveryResponse,
  SolanaNetwork,
} from '../types';
import {
  DEFAULT_FACILITATOR_URL,
  NETWORK_MAP,
  X402_VERSION,
} from '../constants';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export class X402Client {
  private facilitatorUrl: string;
  private connection: Connection;
  private network: SolanaNetwork;
  private onchainApiKey?: string;
  private useOnchainFi: boolean;

  constructor(
    connection: Connection,
    config?: X402Config
  ) {
    this.connection = connection;
    this.facilitatorUrl = config?.facilitatorUrl || DEFAULT_FACILITATOR_URL;
    this.network = NETWORK_MAP[config?.network || WalletAdapterNetwork.Devnet];
    this.onchainApiKey = config?.onchainApiKey;
    this.useOnchainFi = config?.useOnchainFi ?? !!config?.onchainApiKey;
  }

  /**
   * Create a payment transaction for x402
   * Implementation based on onchain.fi's reference: github.com/onchainfi/connect
   * Uses VersionedTransaction with PayAI's fee payer
   */
  async createPaymentTransaction(
    payer: PublicKey,
    recipient: string,
    amount: string,
    tokenMint?: PublicKey
  ): Promise<VersionedTransaction> {
    if (!tokenMint) {
      throw new Error('Token mint is required. Onchain.fi facilitators only support SPL token payments (USDC), not native SOL.');
    }

    const destination = new PublicKey(recipient);
    const { blockhash } = await this.connection.getLatestBlockhash('confirmed');

    // Determine token program (TOKEN vs TOKEN_2022)
    const mintInfo = await this.connection.getAccountInfo(tokenMint, 'confirmed');
    const programId = mintInfo?.owner?.toBase58() === TOKEN_2022_PROGRAM_ID.toBase58()
      ? TOKEN_2022_PROGRAM_ID
      : TOKEN_PROGRAM_ID;

    // Fetch mint to get decimals
    const mint = await getMint(this.connection, tokenMint, undefined, programId);

    // Get associated token accounts
    const sourceAta = await getAssociatedTokenAddress(tokenMint, payer, false, programId);
    const destinationAta = await getAssociatedTokenAddress(tokenMint, destination, false, programId);

    // Check if source ATA exists (user must have tokens)
    const sourceAtaInfo = await this.connection.getAccountInfo(sourceAta, 'confirmed');
    if (!sourceAtaInfo) {
      throw new Error(`You don't have a USDC token account. Please fund your Solana wallet with USDC first.`);
    }

    const instructions: TransactionInstruction[] = [];

    // CRITICAL: ComputeBudget instructions MUST be at positions 0 and 1
    // Facilitators require these for proper transaction processing
    instructions.push(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 40_000, // Sufficient for SPL transfer + ATA creation
      })
    );

    instructions.push(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1, // Minimal priority fee
      })
    );

    // Check if destination ATA exists, create if needed
    // Facilitator will be the fee payer for ATA creation
    const destAtaInfo = await this.connection.getAccountInfo(destinationAta, 'confirmed');
    if (!destAtaInfo) {
      const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

      const createAtaInstruction = new TransactionInstruction({
        keys: [
          { pubkey: payer, isSigner: false, isWritable: true }, // Fee payer (facilitator will replace)
          { pubkey: destinationAta, isSigner: false, isWritable: true },
          { pubkey: destination, isSigner: false, isWritable: false },
          { pubkey: tokenMint, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: programId, isSigner: false, isWritable: false },
        ],
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([0]), // CreateATA discriminator
      });

      instructions.push(createAtaInstruction);
    }

    // SPL token transfer instruction
    instructions.push(
      createTransferCheckedInstruction(
        sourceAta,
        tokenMint,
        destinationAta,
        payer,
        BigInt(amount),
        mint.decimals,
        [],
        programId
      )
    );

    // Create versioned transaction
    // Use PayAI's feePayer as transaction payer (they pay fees, not user)
    const PAYAI_FEE_PAYER = new PublicKey('2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4');

    const message = new TransactionMessage({
      payerKey: PAYAI_FEE_PAYER, // PayAI's fee payer (will co-sign and pay fees)
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    return new VersionedTransaction(message);
  }

  /**
   * Create payment payload from signed transaction
   */
  createPaymentPayload(
    signedTransaction: VersionedTransaction,
    scheme: 'exact' | 'dynamic' = 'exact'
  ): PaymentPayload {
    // Serialize the partially-signed VersionedTransaction
    const serialized = Buffer.from(signedTransaction.serialize());

    return {
      x402Version: X402_VERSION,
      scheme,
      network: this.network,
      payload: {
        transaction: serialized.toString('base64'),
      },
    };
  }

  /**
   * Verify a payment without settling
   */
  async verify(
    paymentPayload: PaymentPayload,
    paymentRequirements: PaymentRequirement
  ): Promise<VerifyResponse> {
    if (this.useOnchainFi) {
      return this.verifyOnchainFi(paymentPayload, paymentRequirements);
    }

    const request: VerifyRequest = {
      paymentPayload,
      paymentRequirements,
    };

    const response = await fetch(`${this.facilitatorUrl}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Verify failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Verify payment using onchain.fi aggregator
   */
  private async verifyOnchainFi(
    paymentPayload: PaymentPayload,
    paymentRequirements: PaymentRequirement
  ): Promise<VerifyResponse> {
    // Use local proxy to keep API key secure
    const apiUrl = this.onchainApiKey?.startsWith('http')
      ? this.onchainApiKey  // Allow custom proxy URL
      : '/api/onchain/verify'; // Default to local proxy

    // Convert paymentPayload to base64 encoded payment header
    const paymentHeader = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');

    // Parse amount from atomic units to decimal (USDC has 6 decimals)
    const expectedAmount = (parseFloat(paymentRequirements.maxAmountRequired) / 1_000_000).toFixed(6);

    const request = {
      paymentHeader,
      sourceNetwork: this.network,
      destinationNetwork: this.network, // Same network for Solana payments
      expectedAmount,
      expectedToken: 'USDC',
      recipientAddress: paymentRequirements.payTo,
      priority: 'balanced',
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Onchain.fi verify failed: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();

    // Convert onchain.fi response to VerifyResponse format
    return {
      isValid: data.data.valid || false,
      payer: data.data.from || '',
      invalidReason: data.data.valid ? undefined : 'Payment validation failed',
    };
  }

  /**
   * Settle a payment (broadcast to blockchain)
   */
  async settle(
    paymentPayload: PaymentPayload,
    paymentRequirements: PaymentRequirement
  ): Promise<SettleResponse> {
    if (this.useOnchainFi) {
      return this.settleOnchainFi(paymentPayload);
    }

    const request: SettleRequest = {
      paymentPayload,
      paymentRequirements,
    };

    const response = await fetch(`${this.facilitatorUrl}/settle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Settle failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Settle payment using onchain.fi aggregator
   */
  private async settleOnchainFi(
    paymentPayload: PaymentPayload
  ): Promise<SettleResponse> {
    // Use local proxy to keep API key secure
    const apiUrl = this.onchainApiKey?.startsWith('http')
      ? this.onchainApiKey.replace('/verify', '/settle')  // Allow custom proxy URL
      : '/api/onchain/settle'; // Default to local proxy

    // Convert paymentPayload to base64 encoded payment header
    const paymentHeader = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');

    const request = {
      paymentHeader,
      sourceNetwork: this.network,
      destinationNetwork: this.network, // Same network for Solana payments
      priority: 'balanced',
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Onchain.fi settle failed: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();

    // Convert onchain.fi response to SettleResponse format
    return {
      success: data.data.success || data.data.settled || false,
      payer: data.data.from || '',
      transaction: data.data.txHash || '',
      network: this.network,
      errorReason: data.data.success ? undefined : 'Settlement failed',
    };
  }

  /**
   * Get supported payment schemes and networks
   */
  async getSupported(): Promise<SupportedResponse> {
    const response = await fetch(`${this.facilitatorUrl}/supported`);

    if (!response.ok) {
      throw new Error(`Get supported failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Discover x402-enabled resources
   */
  async discoverResources(
    params?: ResourceDiscoveryParams
  ): Promise<ResourceDiscoveryResponse> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${this.facilitatorUrl}/discovery/resources${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Discover resources failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Make a request to an x402-protected resource
   */
  async fetchProtectedResource(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    // First request to get payment requirements
    const initialResponse = await fetch(url, options);

    if (initialResponse.status !== 402) {
      return initialResponse;
    }

    // Extract payment requirements from response (for future use)
    // const paymentRequirements = await initialResponse.json() as PaymentRequirement;

    return initialResponse;
  }

  /**
   * Complete payment flow with automatic verify and settle
   */
  async executePayment(
    signedTransaction: VersionedTransaction,
    paymentRequirements: PaymentRequirement
  ): Promise<SettleResponse> {
    const paymentPayload = this.createPaymentPayload(signedTransaction);

    // First verify
    const verifyResult = await this.verify(paymentPayload, paymentRequirements);

    if (!verifyResult.isValid) {
      throw new Error(
        `Payment verification failed: ${verifyResult.invalidReason}`
      );
    }

    // Then settle
    const settleResult = await this.settle(paymentPayload, paymentRequirements);

    if (!settleResult.success) {
      throw new Error(
        `Payment settlement failed: ${settleResult.errorReason}`
      );
    }

    return settleResult;
  }
}
