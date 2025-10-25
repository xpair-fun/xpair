import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

/**
 * Get token balance for a wallet
 */
export async function getTokenBalance(
  connection: Connection,
  walletAddress: PublicKey,
  tokenMint: PublicKey
): Promise<bigint> {
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      walletAddress
    );

    const accountInfo = await getAccount(connection, tokenAccount);
    return accountInfo.amount;
  } catch (error) {
    // Token account doesn't exist or other error
    return BigInt(0);
  }
}

/**
 * Get SOL balance for a wallet
 */
export async function getSolBalance(
  connection: Connection,
  walletAddress: PublicKey
): Promise<number> {
  const balance = await connection.getBalance(walletAddress);
  return balance;
}

/**
 * Format token amount from atomic units to human-readable
 */
export function formatTokenAmount(
  amount: bigint | string,
  decimals: number
): string {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** decimals);
  const wholePart = amountBigInt / divisor;
  const fractionalPart = amountBigInt % divisor;

  if (fractionalPart === BigInt(0)) {
    return wholePart.toString();
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');

  return `${wholePart}.${trimmedFractional}`;
}

/**
 * Parse human-readable token amount to atomic units
 */
export function parseTokenAmount(
  amount: string,
  decimals: number
): string {
  const [wholePart, fractionalPart = ''] = amount.split('.');
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
  const atomicAmount = BigInt(wholePart + paddedFractional);
  return atomicAmount.toString();
}

/**
 * Validate Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
