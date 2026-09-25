import React, { useState } from 'react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'multimodal' | 'agent' | 'contracts'>('overview');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="docs-modal-title"
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
          maxWidth: '780px',
          maxHeight: '85vh',
          background: 'linear-gradient(150deg, rgba(20, 26, 30, 0.96), rgba(6, 10, 13, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '18px',
          padding: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(34, 211, 238, 0.1) inset',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📄</span>
            <div>
              <h3 id="docs-modal-title" style={{ margin: 0, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.3px' }}>
                GraphSentinel Protocol Documentation
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(226, 229, 228, 0.65)' }}>
                Autonomous DeFi Active Defense Architecture & Specifications
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

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
          {[
            { id: 'overview', label: 'Overview & Problem' },
            { id: 'multimodal', label: 'Multimodal ML (GNN+CNN)' },
            { id: 'agent', label: 'Agentic Interceptor' },
            { id: 'contracts', label: 'DefensePool.sol' },
          ].map((tab) => (
            <button
              key={tab.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
                border: activeTab === tab.id ? '1px solid rgba(34, 211, 238, 0.35)' : '1px solid transparent',
                color: activeTab === tab.id ? '#67e8f9' : 'rgba(226, 229, 228, 0.7)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 160ms ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content (Scrollable) */}
        <div style={{ overflowY: 'auto', paddingRight: '6px', fontSize: '13.5px', lineHeight: 1.6, color: 'rgba(226, 229, 228, 0.85)' }}>
          {activeTab === 'overview' && (
            <div>
              <h4 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '15px' }}>Shifting from Reactive Forensics to Autonomous Active Defense</h4>
              <p>
                The DeFi ecosystem loses billions of dollars annually to coordinated market manipulation, specifically wash trading and pump-and-dump schemes. Existing tools (Chainalysis, Forta) are purely passive—alerting human operators after liquidity has already vanished.
              </p>
              <div style={{ background: 'rgba(34, 211, 238, 0.08)', border: '1px solid rgba(34, 211, 238, 0.2)', padding: '12px 16px', borderRadius: '8px', margin: '14px 0' }}>
                <strong style={{ color: '#22d3ee' }}>The GraphSentinel Paradigm:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                  Combine Multimodal Deep Learning (GNN structural topology + CNN temporal visual patterns) with an Agentic AI that autonomously signs and executes counter-trades in milliseconds.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'multimodal' && (
            <div>
              <h4 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '15px' }}>Multimodal Threat Detection Pipeline</h4>
              <p>Incoming transaction batches undergo simultaneous dual-stream analysis:</p>
              <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#38bdf8' }}>Graph Neural Network (PyTorch Geometric):</strong> Maps wallet transaction graphs. Employs EdgeConv/GCN to detect topological ring anomalies, cyclic fund routing, and dense Sybil clusters.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#f43f5e' }}>Convolutional Neural Network (PyTS + ResNet-18):</strong> Converts transaction time series (volume, swap velocity, price divergence) into 2D Gramian Angular Field (GAF) images to identify algorithmic manipulation footprints.
                </li>
                <li>
                  <strong style={{ color: '#fbbf24' }}>Multimodal Fusion Layer:</strong> An MLP combines structural topological probability with temporal visual probability into a unified Threat_Score (0.0 to 1.0).
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'agent' && (
            <div>
              <h4 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '15px' }}>Autonomous Interceptor Agent (The Hands)</h4>
              <p>
                Built using CrewAI / LangChain, the agent awakens automatically when Threat_Score &gt; 0.90. It operates with strictly scoped tool calls:
              </p>
              <div style={{ background: '#070f14', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px 14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', color: '#67e8f9', margin: '12px 0' }}>
                1. check_threat_level() -&gt; {`{ score: 0.946, loop_size: 4, pool: "ETH/USDC" }`}<br />
                2. calculate_counter_trade() -&gt; {`{ target: "ETH/USDC", amount: 45.2, type: "STABILIZE" }`}<br />
                3. execute_defense_on_chain() -&gt; Signs payload &amp; broadcasts to Base Sepolia DefensePool
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div>
              <h4 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '15px' }}>Smart Contract Execution Layer (Base Sepolia)</h4>
              <p>
                The trustless on-chain layer ensures only authorized, cryptographically verified agents can trigger pool shielding:
              </p>
              <div style={{ background: '#070f14', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px 14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', color: '#34d399', margin: '12px 0' }}>
                // DefensePool.sol (Base Sepolia)<br />
                function executeDefense(bytes calldata signature, address targetPool, uint256 amount)<br />
                &nbsp;&nbsp;external nonReentrant onlyAuthorizedAgent<br />
                &#123;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;require(_verifyAgentSignature(signature), "Invalid Agent Sig");<br />
                &nbsp;&nbsp;&nbsp;&nbsp;_executeStabilizingSwap(targetPool, amount);<br />
                &nbsp;&nbsp;&nbsp;&nbsp;BountyManager(bountyVault).payout(msg.sender, 0.01 ether);<br />
                &#125;
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
