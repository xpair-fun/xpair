import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useX402 } from '../context/X402Provider';
import {
  PaymentRequirement,
  PaymentResponse,
  TokenInfo,
} from '../types';
import { parseTokenAmount } from '../utils';

export interface UsePaymentOptions {
  onSuccess?: (response: PaymentResponse) => void;
  onError?: (error: Error) => void;
}

export const usePayment = (options?: UsePaymentOptions) => {
  const { client } = useX402();
  const { publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executePayment = useCallback(
    async (
      recipient: string,
      amount: string,
      token?: TokenInfo,
      description?: string,
      resource?: string
    ): Promise<PaymentResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        if (!publicKey || !signTransaction) {
          throw new Error('Wallet not connected');
        }

        if (!token) {
          throw new Error('Token is required. PayAI facilitator only supports SPL token payments (USDC), not native SOL.');
        }

        // Parse amount to atomic units (USDC has 6 decimals)
        const atomicAmount = parseTokenAmount(amount, token.decimals);

        // Create payment requirements
        const paymentRequirements: PaymentRequirement = {
          scheme: 'exact',
          network: 'solana', // Mainnet
          maxAmountRequired: atomicAmount,
          asset: token.mint.toString(),
          payTo: recipient,
          resource: resource || '',
          description,
          mimeType: 'application/json',
          maxTimeoutSeconds: 60,
          extra: {
            feePayer: '2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4', // PayAI facilitator fee payer
          },
        };

        // Create transaction
        const transaction = await client.createPaymentTransaction(
          publicKey,
          recipient,
          atomicAmount,
          token?.mint
        );

        // Sign transaction
        const signedTransaction = await signTransaction(transaction);

        // Execute payment through x402
        const result = await client.executePayment(
          signedTransaction,
          paymentRequirements
        );

        const response: PaymentResponse = {
          success: result.success,
          transaction: result.transaction,
          payer: result.payer,
        };

        if (result.success) {
          options?.onSuccess?.(response);
        } else {
          const error = new Error(result.errorReason || 'Payment failed');
          options?.onError?.(error);
          throw error;
        }

        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [client, publicKey, signTransaction, options]
  );

  return {
    executePayment,
    isLoading,
    error,
  };
};
