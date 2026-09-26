import React, { useState, useRef, useEffect } from 'react';
import { TrustScoreBadge } from './reputation/TrustScoreBadge';

interface NavbarProps {
  activeTab: 'home' | 'radar' | 'reputation';
  onSelectTab: (tab: 'home' | 'radar' | 'reputation') => void;
  onOpenContact: () => void;
  onOpenWalletModal: () => void;
  userAddress: string;
  onDisconnectWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenContact,
  onOpenWalletModal,
  userAddress,
  onDisconnectWallet,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const navRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsAccountOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  const handleCopyAddress = () => {
    if (!userAddress) return;
    navigator.clipboard.writeText(userAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedAddress = userAddress
    ? `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`
    : '';

  return (
    <header className={`header ${isMenuOpen ? 'menu-open' : ''}`}>
      {/* Brand Disc Logo */}
      <a
        className="brand"
        href="/"
        aria-label="GraphSentinel home"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('home');
          setIsMenuOpen(false);
        }}
      >
        <svg
          className="brand-disc"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="circle-disc-clip">
              <circle cx="12.5" cy="12.5" r="12.5" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-disc-clip)">
            <circle cx="12.5" cy="12.5" r="12.5" fill="#ededed" />
            <path d="M12.5 1.5L20.5 9.5L12.5 15.5L4.5 9.5Z" fill="#050606" />
            <path d="M12.5 1.5L20.5 9.5L12.5 9.5Z" fill="#737778" />
            <path d="M12.5 1.5L4.5 9.5L12.5 9.5Z" fill="#fafafa" />
            <path d="M12.5 15.5L20.5 9.5L16.5 21.5Z" fill="#0a0b0b" />
            <path d="M12.5 15.5L4.5 9.5L8.5 21.5Z" fill="#737778" />
            <path d="M12.5 15.5L8.5 21.5L12.5 23.5L16.5 21.5Z" fill="#050606" />
          </g>
        </svg>
        <div className="brand-text-container">
          <span className="brand-name">GraphSentinel</span>
          <span className="brand-badge">DEFI DEFENSE</span>
        </div>
      </a>

      {/* Header Actions Container */}
      <div className="header-actions" id="tablet-navigation" ref={navRef}>
        <nav className="nav" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-link nav-link-1 ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('home');
              setIsMenuOpen(false);
            }}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link nav-link-2 ${activeTab === 'radar' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('radar');
              setIsMenuOpen(false);
            }}
          >
            Threat Radar
          </button>
          <button
            type="button"
            className={`nav-link nav-link-3 ${activeTab === 'reputation' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('reputation');
              setIsMenuOpen(false);
            }}
          >
            Reputation
          </button>

          <button
            type="button"
            className="nav-link nav-link-4"
            onClick={() => {
              onOpenContact();
              setIsMenuOpen(false);
            }}
          >
            Contact
          </button>
        </nav>

        {/* Time Panel (Status) */}
        <div className="time-panel">
          <span className="time-panel-label">Status</span>
          <span className="time-panel-value">
            <span className="live-indicator-dot" />
            Monitoring Pool &nbsp; • &nbsp; Live
          </span>
        </div>

        {/* Wallet Control: Connect Wallet Button OR Account Dropdown */}
        {userAddress ? (
          <div ref={accountRef} style={{ position: 'relative', marginLeft: 'clamp(20px, 1.95vw, 29px)' }}>
            <button
              type="button"
              className="wallet-account-btn"
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              style={{
                height: '42px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(34, 211, 238, 0.35)',
                color: '#ffffff',
                padding: '0 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '13px',
                boxShadow: '0 0 12px rgba(34, 211, 238, 0.15)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                }}
              />
              <span style={{ color: '#67e8f9', fontWeight: 600 }}>{formattedAddress}</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>▾</span>
            </button>

            {/* Account Popover Menu */}
            {isAccountOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '270px',
                  background: 'linear-gradient(155deg, rgba(20, 26, 30, 0.98), rgba(6, 11, 14, 0.99))',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.85)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Network:</span>
                  <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, background: 'rgba(56, 189, 248, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    Base Sepolia
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Balance:</span>
                  <span style={{ fontSize: '12px', color: '#f8fafc', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>
                    4.82 ETH
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Sentinel Role:</span>
                  <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 500 }}>Authorized Operator</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Trust Score:</span>
                  <TrustScoreBadge score={96} size="sm" showLabel={false} showLink={false} />
                </div>

                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

                <button
                  type="button"
                  onClick={() => {
                    setIsAccountOpen(false);
                    onSelectTab('reputation');
                  }}
                  style={{
                    background: 'rgba(34, 211, 238, 0.12)',
                    border: '1px solid rgba(34, 211, 238, 0.35)',
                    borderRadius: '6px',
                    color: '#67e8f9',
                    padding: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  ⭐ Open Reputation Sentinel
                </button>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                    padding: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {copied ? '✓ Copied Address!' : '📋 Copy Address'}
                </button>

                <a
                  href={`https://sepolia.basescan.org/address/${userAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#38bdf8',
                    fontSize: '11.5px',
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  ↗ View on BaseScan
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsAccountOpen(false);
                    onDisconnectWallet();
                  }}
                  style={{
                    background: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.35)',
                    borderRadius: '6px',
                    color: '#fb7185',
                    padding: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="sign-up"
            onClick={onOpenWalletModal}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Menu Toggle for Tablet/Mobile */}
      <button
        type="button"
        className="menu-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="3"
            y1={isMenuOpen ? "4" : "7"}
            x2="17"
            y2={isMenuOpen ? "16" : "7"}
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="menu-line"
          />
          <line
            x1="3"
            y1={isMenuOpen ? "16" : "13"}
            x2="17"
            y2={isMenuOpen ? "4" : "13"}
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="menu-line"
          />
        </svg>
      </button>
    </header>
  );
};
