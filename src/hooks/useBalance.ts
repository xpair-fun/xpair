import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useX402 } from '../context/X402Provider';
import { getTokenBalance, getSolBalance, formatTokenAmount } from '../utils';
import { TokenInfo } from '../types';

export const useBalance = (token?: TokenInfo) => {
  const { connection } = useX402();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance('0');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (token) {
        const tokenBalance = await getTokenBalance(
          connection,
          publicKey,
          token.mint
        );
        setBalance(formatTokenAmount(tokenBalance, token.decimals));
      } else {
        const solBalance = await getSolBalance(connection, publicKey);
        setBalance(formatTokenAmount(BigInt(solBalance), 9));
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch balance');
      setError(error);
      setBalance('0');
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey, token]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
  };
};
