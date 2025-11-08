import { useState } from 'react';
import { XPair } from 'xpair';

export default function Simple() {
  const [recipient, setRecipient] = useState('8FE27ioQh3T7o22QsYVT5Re8NnHFqmFNbdqwiF3ywuZQ');
  const [amount, setAmount] = useState('0.01');
  const [description, setDescription] = useState('Test payment via Xpair');

  const codeExample = `import { XPair } from 'xpair';

<XPair
  recipient="${recipient}"
  amount="${amount}"
  description="${description}"
  onSuccess={(txHash) => {
    console.log('Payment successful!', txHash);
  }}
  onError={(error) => {
    console.error('Payment failed:', error);
  }}
/>`;

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#F3F8FE', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '12px', color: '#1A357F' }}>
          Xpair
        </h1>
        <p style={{ fontSize: '18px', color: '#1A357F', opacity: 0.8, marginBottom: '8px' }}>
          The simplest way to add USDC payments to your Next.js app
        </p>
        <p style={{ fontSize: '14px', color: '#1A357F', opacity: 0.6 }}>
          One component. No complexity.
        </p>
      </div>

      {/* Interactive Demo Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: '#111827' }}>
          Try it out
        </h2>

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

          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
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

            <div style={{ flex: 2 }}>
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
      </div>

      {/* Features */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#111827' }}>
          What you get
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🎨', title: 'Beautiful UI', desc: 'Pre-built payment modal' },
            { icon: '👛', title: 'Auto Wallet', desc: 'Automatic wallet connection' },
            { icon: '💰', title: 'Zero Fees', desc: 'Users pay nothing extra' },
            { icon: '🔄', title: 'Smart Routing', desc: 'Multiple facilitators' },
            { icon: '⚡', title: 'Fast', desc: 'Sub-second verification' },
            { icon: '🔧', title: 'Zero Config', desc: 'No setup or styling needed' },
          ].map((feature, idx) => (
            <div key={idx} style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feature.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                {feature.title}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div style={{ marginTop: '32px', textAlign: 'center', padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: '14px', color: '#1A357F', opacity: 0.8, marginBottom: '12px' }}>
          Ready to integrate?
        </p>
        <code style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: '#1A357F',
          color: '#ffffff',
          borderRadius: '6px',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}>
          npm install Xpair
        </code>
      </div>
    </div>
  );
}
