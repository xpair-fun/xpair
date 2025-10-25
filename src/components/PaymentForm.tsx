import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { usePayment } from '../hooks/usePayment';
import { PaymentFormProps } from '../types';
import { isValidSolanaAddress } from '../utils';

export const PaymentForm: React.FC<PaymentFormProps> = ({
  recipient: initialRecipient,
  amount: initialAmount,
  token,
  description,
  resource,
  onSuccess,
  onError,
  className = '',
}) => {
  const { connected } = useWallet();
  const { executePayment, isLoading } = usePayment({ onSuccess, onError });

  const [recipient, setRecipient] = useState(initialRecipient);
  const [amount, setAmount] = useState(initialAmount);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!recipient) {
      setValidationError('Recipient address is required');
      return false;
    }

    if (!isValidSolanaAddress(recipient)) {
      setValidationError('Invalid Solana address');
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setValidationError('Amount must be greater than 0');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setError(null);
      await executePayment(recipient, amount, token, description, resource);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
    }
  };

  if (!connected) {
    return (
      <div className={className} style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
          Connect your wallet to make payments
        </p>
        <WalletMultiButton />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="recipient"
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          Recipient Address
        </label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Solana wallet address"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="amount"
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          Amount ({token?.symbol || 'SOL'})
        </label>
        <input
          id="amount"
          type="number"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
      </div>

      {description && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>{description}</p>
        </div>
      )}

      {(validationError || error) && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '6px',
            color: '#c33',
            fontSize: '14px',
          }}
        >
          {validationError || error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isLoading ? '#ccc' : '#9945FF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {isLoading ? 'Processing Payment...' : 'Send Payment'}
      </button>
    </form>
  );
};
