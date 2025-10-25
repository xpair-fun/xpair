import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { usePayment } from '../hooks/usePayment';
import { PaymentButtonProps } from '../types';

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  recipient,
  amount,
  token,
  description,
  resource,
  onSuccess,
  onError,
  className = '',
  children,
  disabled = false,
}) => {
  const { connected } = useWallet();
  const { executePayment, isLoading } = usePayment({ onSuccess, onError });
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setError(null);
      await executePayment(recipient, amount, token, description, resource);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
    }
  };

  if (!connected) {
    return <WalletMultiButton />;
  }

  return (
    <div className={className}>
      <button
        onClick={handlePayment}
        disabled={disabled || isLoading}
        className={`payment-button ${isLoading ? 'loading' : ''}`}
        style={{
          padding: '12px 24px',
          backgroundColor: disabled || isLoading ? '#ccc' : '#9945FF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {isLoading
          ? 'Processing...'
          : children || `Pay ${amount} ${token?.symbol || 'SOL'}`}
      </button>
      {error && (
        <div
          style={{
            marginTop: '8px',
            color: '#ef4444',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
