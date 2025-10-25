import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBalance } from '../hooks/useBalance';
import { BalanceDisplayProps } from '../types';

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  token,
  showRefresh = true,
  className = '',
  onRefresh,
}) => {
  const { connected, publicKey } = useWallet();
  const { balance, isLoading, refetch } = useBalance(token);

  const handleRefresh = () => {
    refetch();
    onRefresh?.();
  };

  if (!connected || !publicKey) {
    return (
      <div className={className} style={{ padding: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Connect wallet to view balance
        </p>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            Balance
          </p>
          <p style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
            {isLoading ? (
              <span style={{ color: '#999' }}>Loading...</span>
            ) : (
              <>
                {balance} <span style={{ fontSize: '16px', color: '#666' }}>
                  {token?.symbol || 'SOL'}
                </span>
              </>
            )}
          </p>
        </div>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? '...' : '↻ Refresh'}
          </button>
        )}
      </div>
      <p style={{ fontSize: '12px', color: '#999', marginTop: '8px', marginBottom: 0 }}>
        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
      </p>
    </div>
  );
};
