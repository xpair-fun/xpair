import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { XPair, useBalance } from 'xpair';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { USDC_MINT, DEFAULT_TOKEN_INFO } from 'xpair';

export default function Home() {
  const { publicKey, connected } = useWallet();
  const [recipient, setRecipient] = useState('8FE27ioQh3T7o22QsYVT5Re8NnHFqmFNbdqwiF3ywuZQ');
  const [amount, setAmount] = useState('0.01');
  const [description, setDescription] = useState('Test payment via xpair');

  const usdcToken = {
    mint: USDC_MINT[WalletAdapterNetwork.Mainnet],
    symbol: DEFAULT_TOKEN_INFO.symbol,
    decimals: DEFAULT_TOKEN_INFO.decimals,
  };

  const { balance, isLoading: balanceLoading, refetch } = useBalance(usdcToken);

  const codeExample = `import { XPair } from 'xpair';

<XPair
  recipient="${recipient}"
  amount="${amount}"
  description="${description}"
  onSuccess={(txHash) => {
    console.log('Success!', txHash);
  }}
/>`;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F8FE' }}>
      {/* Header */}
      <header style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#1A357F',
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 4px 6px rgba(26, 53, 127, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', margin: 0 }}>
            xpair
          </h1>
          <span style={{
            padding: '4px 12px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            fontSize: '12px',
            color: 'white',
            fontWeight: 600,
          }}>
            Demo
          </span>
        </div>

        <WalletMultiButton style={{
          backgroundColor: 'white',
          color: '#1A357F',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 600,
        }} />
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          color: '#1A357F',
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            The simplest way to add<br />USDC payments to your app
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#1A357F',
            opacity: 0.8,
            marginBottom: '24px',
          }}>
            One component. No complexity. Solana mainnet.
          </p>
          <code style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#1A357F',
            color: 'white',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'monospace',
          }}>
            npm install xpair
          </code>
        </div>

        {/* Wallet Status */}
        {connected && publicKey && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                Your Wallet
              </h3>
              <button
                onClick={() => refetch()}
                disabled={balanceLoading}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: balanceLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                }}
              >
                {balanceLoading ? 'Refreshing...' : '🔄 Refresh'}
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: 600 }}>
                  ADDRESS
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#111827',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                }}>
                  {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                </p>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: 600 }}>
                  USDC BALANCE
                </p>
                <p style={{
                  fontSize: '24px',
                  color: '#111827',
                  fontWeight: 700,
                }}>
                  {balanceLoading ? '...' : balance || '0'} <span style={{ fontSize: '16px', color: '#6b7280' }}>USDC</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Demo */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px', color: '#111827' }}>
            Try it yourself
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
            {connected
              ? 'Customize and test with your own wallet address'
              : 'Connect your wallet to test payments'}
          </p>

          {!connected ? (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '2px dashed #d1d5db',
            }}>
              <p style={{ fontSize: '16px', color: '#374151', marginBottom: '16px', fontWeight: 500 }}>
                Connect your wallet to get started
              </p>
              <WalletMultiButton style={{
                backgroundColor: '#1A357F',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: 600,
              }} />
            </div>
          ) : (
            <>
              {/* Form */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Recipient Wallet Address
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter Solana wallet address"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box',
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                    Use your own wallet address to test receiving payments
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                      Amount (USDC)
                    </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.01"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Payment description"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Live Component */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                border: '2px dashed #d1d5db',
              }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live Demo
                </p>
                <XPair
                  recipient={recipient}
                  amount={amount}
                  description={description}
                  onSuccess={(txHash) => {
                    alert(`✅ Payment successful!\n\nTransaction: ${txHash}`);
                    // Refetch balance after successful payment
                    setTimeout(() => refetch(), 1000);
                  }}
                  onError={(error) => {
                    alert(`❌ Payment failed: ${error.message}`);
                  }}
                />
              </div>

              {/* Code Display */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Your Code
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(codeExample);
                      alert('Code copied to clipboard!');
                    }}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Copy Code
                  </button>
                </div>
                <pre
                  style={{
                    backgroundColor: '#1f2937',
                    color: '#f9fafb',
                    padding: '20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    overflow: 'auto',
                    margin: 0,
                  }}
                >
                  {codeExample}
                </pre>
              </div>
            </>
          )}
        </div>

        {/* Features */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: '#111827', textAlign: 'center' }}>
            What you get
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🎨', title: 'Beautiful UI', desc: 'Pre-built payment modal with modern design' },
              { icon: '👛', title: 'Auto Wallet', desc: 'Automatic wallet connection & detection' },
              { icon: '💰', title: 'Zero Fees', desc: 'Users pay nothing extra for transactions' },
              { icon: '🔄', title: 'Smart Routing', desc: '3 facilitators via onchain.fi failover' },
              { icon: '⚡', title: 'Fast', desc: 'Sub-second payment verification' },
              { icon: '🔧', title: 'Zero Config', desc: 'No setup, styling, or API keys needed' },
            ].map((feature, idx) => (
              <div key={idx} style={{
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
                  {feature.title}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.5 }}>
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        textAlign: 'center',
        color: '#1A357F',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <p style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.8 }}>
          Built with xpair • Powered by Solana & onchain.fi
        </p>
        <p style={{ fontSize: '12px', opacity: 0.6 }}>
          Mainnet Environment • Real Payments
        </p>
      </footer>
    </div>
  );
}
