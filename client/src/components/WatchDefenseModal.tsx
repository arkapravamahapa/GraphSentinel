import React, { useState, useEffect } from 'react';

interface WatchDefenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchRadar: () => void;
}

export const WatchDefenseModal: React.FC<WatchDefenseModalProps> = ({ isOpen, onClose, onLaunchRadar }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const steps = [
    {
      title: "1. Sybil Wash-Trading Attack Injected",
      badge: "MEMPOOL SURVEILLANCE",
      badgeColor: "#fbbf24",
      desc: "Four Sybil wallets (0x91F... 0x4B2... 0x8C1... 0x2A9...) initiate 120 circular swaps within 3 seconds to manipulate the Uniswap V3 ETH/USDC spot price and drain retail liquidity.",
      metric: "Volume Burst: $2.4M in 3.2s | Price Impact: +8.4%",
    },
    {
      title: "2. Multimodal AI Analysis (GNN + CNN)",
      badge: "THREAT FUSION: 94.6%",
      badgeColor: "#f43f5e",
      desc: "PyTorch Geometric GNN identifies closed circular topological loops. Simultaneously, ResNet-18 analyzes the Gramian Angular Field (GAF) heatmap of temporal trade velocity.",
      metric: "GNN Structural: 94.2% | CNN Temporal: 91.8% | Combined: 94.6% (> 0.90)",
    },
    {
      title: "3. Agentic Interceptor Decision",
      badge: "AUTONOMOUS AGENT",
      badgeColor: "#22d3ee",
      desc: "GraphSentinel Interceptor Agent triggers automatically with zero human latency. It calculates the exact counter-trade parameters needed to restore the pool price invariant.",
      metric: "Counter-Trade: 42.5 ETH Stabilizing Swap | Response Latency: 38ms",
    },
    {
      title: "4. Trustless Smart Contract Execution",
      badge: "BASE SEPOLIA CONFIRMED",
      badgeColor: "#10b981",
      desc: "Agent cryptographically signs transaction and calls DefensePool.sol::executeDefense(). The smart contract verifies the authorized Agent signature and executes the defense.",
      metric: "TX Hash: 0x8f2a1b94e...c301 | Gas Used: 142,390 | Block: #12,840,991",
    },
    {
      title: "5. Liquidity Shielded & Micro-Bounty Paid",
      badge: "DEFENSE COMPLETE",
      badgeColor: "#34d399",
      desc: "Pool liquidity of $1,420,000 remains completely intact. BountyManager.sol automatically transfers a 0.01 ETH micro-bounty to the AI Agent wallet for autonomous compute coverage.",
      metric: "TVL Preserved: $1.42M | Bounty Paid: 0.01 ETH | Pool Status: Normal",
    }
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, steps.length]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="watch-defense-title"
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
          maxWidth: '680px',
          background: 'linear-gradient(150deg, rgba(20, 26, 30, 0.96), rgba(6, 10, 13, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '18px',
          padding: '26px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(34, 211, 238, 0.1) inset',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <div>
              <h3 id="watch-defense-title" style={{ margin: 0, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.3px' }}>
                Autonomous Defense Playback
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(226, 229, 228, 0.65)' }}>
                Live Simulation: Coordinated Wash-Trading Neutralization
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

        {/* Step Progression Bar */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveStep(idx);
                setIsPlaying(false);
              }}
              style={{
                flex: 1,
                height: '5px',
                borderRadius: '3px',
                background: idx === activeStep ? s.badgeColor : idx < activeStep ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 250ms ease',
                padding: 0,
              }}
              title={s.title}
            />
          ))}
        </div>

        {/* Main Simulation Screen Box */}
        <div
          style={{
            background: 'linear-gradient(180deg, #050b0e, #020608)',
            border: '1px solid rgba(34, 211, 238, 0.25)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: steps[activeStep].badgeColor,
                background: 'rgba(0, 0, 0, 0.5)',
                border: `1px solid ${steps[activeStep].badgeColor}40`,
                padding: '4px 10px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
              }}
            >
              {steps[activeStep].badge}
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}>
              PHASE {activeStep + 1} OF 5
            </span>
          </div>

          <h4 style={{ margin: '0 0 10px 0', fontSize: '17px', color: '#ffffff', fontWeight: 600 }}>
            {steps[activeStep].title}
          </h4>

          <p style={{ margin: '0 0 16px 0', fontSize: '13.5px', color: 'rgba(226, 229, 228, 0.82)', lineHeight: 1.5 }}>
            {steps[activeStep].desc}
          </p>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#67e8f9',
            }}
          >
            ▶ {steps[activeStep].metric}
          </div>
        </div>

        {/* Controls & CTA Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                borderRadius: '7px',
                padding: '8px 14px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              onClick={() => {
                setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
                setIsPlaying(false);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderRadius: '7px',
                padding: '8px 12px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              ← Prev
            </button>
            <button
              onClick={() => {
                setActiveStep((prev) => (prev + 1) % steps.length);
                setIsPlaying(false);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderRadius: '7px',
                padding: '8px 12px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Next →
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onLaunchRadar();
            }}
            style={{
              background: '#ffffff',
              color: '#111111',
              border: 'none',
              borderRadius: '7px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            <span>Launch Live Radar</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
