import React, { useState } from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess: (address: string) => void;
}

type ConnectStatus = 'idle' | 'connecting' | 'success' | 'error';

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnectSuccess }) => {
  const [status, setStatus] = useState<ConnectStatus>('idle');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA');

  if (!isOpen) return null;

  // Real Web3 or simulated connection handler
  const handleConnect = async (walletType: 'metamask' | 'coinbase' | 'walletconnect' | 'demo', simulateError = false) => {
    setSelectedWallet(
      walletType === 'metamask'
        ? 'MetaMask'
        : walletType === 'coinbase'
        ? 'Coinbase Wallet'
        : walletType === 'walletconnect'
        ? 'WalletConnect'
        : 'Instant Sentinel Demo'
    );
    setStatus('connecting');
    setErrorMessage('');

    if (simulateError) {
      setTimeout(() => {
        setStatus('error');
        setErrorMessage('User rejected signature authorization or RPC network handshake timed out.');
      }, 1000);
      return;
    }

    if (walletType === 'metamask' || walletType === 'coinbase') {
      const eth = (window as any).ethereum;
      if (eth) {
        try {
          const accounts = await eth.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            const addr = accounts[0];
            setWalletAddress(addr);
            setStatus('success');
            localStorage.setItem('graphsentinel_active_wallet', addr);
            setTimeout(() => {
              onConnectSuccess(addr);
              onClose();
              setStatus('idle');
            }, 1000);
            return;
          }
        } catch (err: any) {
          setStatus('error');
          setErrorMessage(err?.message || 'Wallet connection was cancelled by user.');
          return;
        }
      } else {
        // If window.ethereum is not installed, provide helpful prompt and offer demo wallet
        setTimeout(() => {
          setStatus('error');
          setErrorMessage(
            `${walletType === 'metamask' ? 'MetaMask' : 'Coinbase Wallet'} extension was not detected in this browser session. You can connect using the Instant Demo Wallet below.`
          );
        }, 800);
        return;
      }
    }

    // Default: Instant Demo / WalletConnect testnet operator
    setTimeout(() => {
      const demoAddr = '0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA';
      setWalletAddress(demoAddr);
      setStatus('success');
      localStorage.setItem('graphsentinel_active_wallet', demoAddr);
      setTimeout(() => {
        onConnectSuccess(demoAddr);
        onClose();
        setStatus('idle');
      }, 1100);
    }, 900);
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(155deg, rgba(20, 26, 30, 0.96), rgba(6, 11, 14, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(34, 211, 238, 0.12) inset',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(34, 211, 238, 0.15)',
                border: '1px solid rgba(34, 211, 238, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="4" />
                <path d="M6 10h4" />
                <circle cx="16" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <h3 id="wallet-modal-title" style={{ margin: 0, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.3px' }}>
                Connect Wallet
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(226, 229, 228, 0.65)' }}>
                Base Sepolia Active Defense Network
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

        {/* Status: Idle */}
        {status === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '13px', color: 'rgba(211, 207, 207, 0.8)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
              Authenticate as a Protocol Admin or Sentinel Security Operator:
            </p>

            {/* Instant Sentinel Demo Wallet */}
            <button
              onClick={() => handleConnect('demo')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.22), rgba(16, 185, 129, 0.16))',
                border: '1px solid rgba(34, 211, 238, 0.5)',
                color: '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>⚡</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#67e8f9' }}>
                    Instant Sentinel Demo Wallet
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(226, 229, 228, 0.75)' }}>
                    Pre-authorized on Base Sepolia • 1-Click Launch
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '10.5px', background: '#0891b2', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.4px' }}>
                RECOMMENDED
              </span>
            </button>

            {/* MetaMask */}
            <button
              onClick={() => handleConnect('metamask')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '18px' }}>🦊</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>MetaMask</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>Browser extension or mobile app</div>
              </div>
            </button>

            {/* Coinbase Wallet */}
            <button
              onClick={() => handleConnect('coinbase')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '18px' }}>🔵</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>Coinbase Smart Wallet</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>Passkey & EVM Smart Contract</div>
              </div>
            </button>

            {/* WalletConnect */}
            <button
              onClick={() => handleConnect('walletconnect')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '18px' }}>🌐</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>WalletConnect</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>Scan QR with any Web3 wallet</div>
              </div>
            </button>

            {/* Simulated Error Test Trigger for QA */}
            <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>QA Testing Mode:</span>
              <button
                onClick={() => handleConnect('demo', true)}
                style={{
                  background: 'none',
                  border: '1px dashed rgba(244, 63, 94, 0.45)',
                  color: '#fb7185',
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Simulate Connection Error
              </button>
            </div>
          </div>
        )}

        {/* Status: Connecting */}
        {status === 'connecting' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '3px solid rgba(34, 211, 238, 0.2)',
                borderTopColor: '#22d3ee',
                borderRadius: '50%',
                margin: '0 auto 16px auto',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600 }}>
              Connecting to {selectedWallet}...
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(211, 207, 207, 0.75)' }}>
              Verifying protocol signature on Base Sepolia testnet...
            </p>
          </div>
        )}

        {/* Status: Success */}
        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10b981',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
                fontSize: '24px',
              }}
            >
              ✓
            </div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 600, color: '#34d399' }}>
              Wallet Authenticated!
            </h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>
              Account: <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#22d3ee' }}>{walletAddress}</span>
            </p>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(34, 211, 238, 0.12)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#67e8f9',
              }}
            >
              Role: Authorized Sentinel Operator • Launching Radar...
            </div>
          </div>
        )}

        {/* Status: Error */}
        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '2px solid #f43f5e',
                color: '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
                fontSize: '24px',
              }}
            >
              ✕
            </div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 600, color: '#fb7185' }}>
              Connection Failed
            </h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.4 }}>
              {errorMessage}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleReset}
                style={{
                  background: '#ffffff',
                  color: '#111111',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Retry Connection
              </button>
              <button
                onClick={() => handleConnect('demo')}
                style={{
                  background: 'rgba(34, 211, 238, 0.18)',
                  color: '#22d3ee',
                  border: '1px solid rgba(34, 211, 238, 0.45)',
                  borderRadius: '7px',
                  padding: '9px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Use Instant Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
