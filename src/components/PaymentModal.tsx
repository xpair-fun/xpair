import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { usePayment } from '../hooks/usePayment';

export interface XPairProps {
  /** Recipient Solana address */
  recipient: string;
  /** Amount in USDC (e.g., "0.01" for 1 cent) */
  amount: string;
  /** Optional description for the payment */
  description?: string;
  /** Optional resource identifier */
  resource?: string;
  /** Success callback */
  onSuccess?: (txHash: string) => void;
  /** Error callback */
  onError?: (error: Error) => void;
  /** Cancel callback */
  onCancel?: () => void;
}

/**
 * XPair Payment Modal
 * Simple component to trigger a payment modal
 *
 * @example
 * ```tsx
 * <XPair
 *   recipient="8FE27ioQh3T7o22QsYVT5Re8NnHFqmFNbdqwiF3ywuZQ"
 *   amount="0.01"
 *   description="Premium feature access"
 * />
 * ```
 */
export function XPair({
  recipient,
  amount,
  description = 'Payment',
  resource,
  onSuccess,
  onError,
  onCancel,
}: XPairProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const { publicKey, connected, select, wallets, connect } = useWallet();
  const { executePayment, isLoading, error: paymentError } = usePayment();

  const handlePay = async () => {
    if (!connected) {
      // Auto-select first wallet if available
      if (wallets.length > 0) {
        select(wallets[0].adapter.name);
      }
      try {
        await connect();
      } catch (err) {
        // User rejected wallet connection - don't show error
        console.log('Wallet connection cancelled');
      }
      return;
    }

    try {
      setLocalError(null);
      const result = await executePayment(
        recipient,
        amount,
        {
          mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC
          symbol: 'USDC',
          decimals: 6,
        },
        description,
        resource
      );

      if (result.success && result.transaction) {
        setPaymentSuccess(result.transaction);
        onSuccess?.(result.transaction);
        // Auto-close after showing success
        setTimeout(() => {
          setIsOpen(false);
          setPaymentSuccess(null);
        }, 3000);
      } else if (result.error) {
        setLocalError(result.error);
        onError?.(new Error(result.error));
      }
    } catch (err) {
      const errorMsg = (err as Error).message;
      setLocalError(errorMsg);
      onError?.(err as Error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onCancel?.();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="xpair-trigger"
        style={{
          padding: '12px 24px',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#4f46e5';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#6366f1';
        }}
      >
        Pay ${amount} USDC
      </button>
    );
  }

  return (
    <div
      className="xpair-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={handleClose}
    >
      <div
        className="xpair-modal"
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 700,
              color: '#111827',
            }}
          >
            Complete Payment
          </h2>
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '14px',
              color: '#6b7280',
            }}
          >
            {description}
          </p>
        </div>

        {/* Payment Details */}
        <div
          style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '4px',
              }}
            >
              Amount
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              ${amount}
              <span style={{ fontSize: '20px', color: '#6b7280', marginLeft: '8px' }}>
                USDC
              </span>
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '4px',
              }}
            >
              Recipient
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#374151',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}
            >
              {recipient.slice(0, 8)}...{recipient.slice(-8)}
            </div>
          </div>
        </div>

        {/* Wallet Status */}
        {connected && publicKey && (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
              ✓ Wallet Connected
            </div>
            <div style={{ fontSize: '12px', color: '#047857', fontFamily: 'monospace', marginTop: '4px' }}>
              {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
            </div>
          </div>
        )}

        {/* Success Message */}
        {paymentSuccess && (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '16px', color: '#059669', fontWeight: 600, marginBottom: '8px' }}>
              ✓ Payment Successful!
            </div>
            <div style={{ fontSize: '11px', color: '#047857', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {paymentSuccess}
            </div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '8px' }}>
              Closing in 3 seconds...
            </div>
          </div>
        )}

        {/* Error Message */}
        {!paymentSuccess && (localError || paymentError) && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
              Payment Failed
            </div>
            <div style={{ fontSize: '12px', color: '#991b1b', marginTop: '4px' }}>
              {localError || (paymentError && paymentError.message)}
            </div>
          </div>
        )}

        {/* Actions */}
        {!paymentSuccess && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleClose}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handlePay}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: isLoading ? '#9ca3af' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#6366f1';
                }
              }}
            >
              {isLoading ? 'Processing...' : connected ? 'Pay Now' : 'Connect Wallet'}
            </button>
          </div>
        )}

        {/* Powered by */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '12px',
            color: '#9ca3af',
          }}
        >
          Powered by <strong>xpair</strong> + onchain.fi
        </div>
      </div>
    </div>
  );
}
