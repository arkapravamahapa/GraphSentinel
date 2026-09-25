import React, { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    protocolName: '',
    email: '',
    poolTvl: '$10M - $50M',
    network: 'Base / Ethereum',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(150deg, rgba(20, 26, 30, 0.96), rgba(6, 10, 13, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '18px',
          padding: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(34, 211, 238, 0.1) inset',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <div>
              <h3 id="contact-modal-title" style={{ margin: 0, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.3px' }}>
                Protocol Integration Inquiry
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(226, 229, 228, 0.65)' }}>
                Deploy Autonomous Sentinel Shields for your Liquidity Pools
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10b981',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                fontSize: '24px',
              }}
            >
              ✓
            </div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', color: '#34d399' }}>
              Inquiry Dispatched to Sentinel Core!
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(226, 229, 228, 0.8)' }}>
              Our protocol engineering team will reach out with integration testnet keys shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(226, 229, 228, 0.7)', marginBottom: '5px' }}>
                DeFi Protocol / DAO Treasury Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Liquidity DAO"
                value={formData.protocolName}
                onChange={(e) => setFormData({ ...formData, protocolName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(226, 229, 228, 0.7)', marginBottom: '5px' }}>
                Admin Email / Telegram Handle
              </label>
              <input
                type="text"
                required
                placeholder="e.g. security@apexdao.io"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(226, 229, 228, 0.7)', marginBottom: '5px' }}>
                  Total Pool TVL to Protect
                </label>
                <select
                  value={formData.poolTvl}
                  onChange={(e) => setFormData({ ...formData, poolTvl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: '#0a1014',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  <option>$1M - $10M</option>
                  <option>$10M - $50M</option>
                  <option>$50M - $250M</option>
                  <option>&gt; $250M (Institutional)</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(226, 229, 228, 0.7)', marginBottom: '5px' }}>
                  Target EVM Chain
                </label>
                <select
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: '#0a1014',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  <option>Base Sepolia / Base</option>
                  <option>Ethereum Mainnet</option>
                  <option>Arbitrum One</option>
                  <option>Polygon Amoy / PoS</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(226, 229, 228, 0.7)', marginBottom: '5px' }}>
                Specific Protection Requirements (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Wash-trading mitigation on Uniswap V3 concentrated liquidity hooks..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px',
                width: '100%',
                padding: '11px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#111111',
                fontWeight: 600,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              Submit Integration Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
