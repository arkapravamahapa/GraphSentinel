import { useState } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { WalletModal } from './components/WalletModal';
import { WatchDefenseModal } from './components/WatchDefenseModal';
import { ContactModal } from './components/ContactModal';
import { ThreatRadarDashboard } from './components/ThreatRadarDashboard';
import { Spotlight } from './components/ui/spotlight';
import { FlameButton } from './components/ui/flame-button';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'radar'>('home');
  const [userAddress, setUserAddress] = useState<string>(() => {
    return localStorage.getItem('graphsentinel_active_wallet') || '';
  });
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isWatchDefenseOpen, setIsWatchDefenseOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const handleConnectSuccess = (address: string) => {
    setUserAddress(address);
    localStorage.setItem('graphsentinel_active_wallet', address);
    setIsWalletModalOpen(false);
    setActiveTab('radar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDisconnectWallet = () => {
    setUserAddress('');
    localStorage.removeItem('graphsentinel_active_wallet');
  };

  // Launch button immediately opens the Threat Radar Mission Control
  const handleLaunchRadar = () => {
    setActiveTab('radar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Spotlight size={300} />
      <main className="viewport">
<<<<<<< HEAD
        {/* Stable Fixed Navigation Bar */}
=======
        {/* Global Navigation Bar across both Home and Threat Radar screens */}
>>>>>>> origin/main
        <Navbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenWalletModal={() => setIsWalletModalOpen(true)}
          userAddress={userAddress}
          onDisconnectWallet={handleDisconnectWallet}
        />

        {/* View Switcher: Home Landing vs. Threat Radar Dashboard */}
        {activeTab === 'home' ? (
          <div className="home-container">
            {/* Hero Screen with Edge-to-Edge Video */}
            <section className="hero-screen" id="hero">
              <video
                className="background"
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                aria-hidden="true"
              >
                <source
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4"
                  type="video/mp4"
                />
              </video>

              <div className="hero-vignette" />

              <div className="hero-content">
                <h1 className="hero-title">
                  <span className="line line-one">
                    <span className="line-reveal">Autonomous Defense</span>
                  </span>
                  <span className="line line-two">
                    <span className="line-reveal">For DeFi Pools.</span>
                  </span>
                </h1>

                <p className="hero-copy">
                  Market manipulation drains liquidity in seconds. GraphSentinel executes
                  defensive trades autonomously, shielding your protocol before attackers
                  can complete the exploit.
                </p>

                {/* Hero Actions: Launch Radar & Watch Defense */}
                <div className="hero-cta-group">
                  <FlameButton
                    text="Launch Radar"
                    onClick={handleLaunchRadar}
                    id="launch-radar-btn"
                  />
                  <FlameButton
                    text="Watch Defense Demo"
                    onClick={() => setIsWatchDefenseOpen(true)}
                    id="watch-defense-btn"
                  />
                </div>

                {/* Micro Metric Banner in Hero */}
                <div className="hero-telemetry-strip">
                  <div className="telemetry-item">
                    <span className="telemetry-label">TVL Protected</span>
                    <span className="telemetry-val">$42.85M</span>
                  </div>
                  <div className="telemetry-divider" />
                  <div className="telemetry-item">
                    <span className="telemetry-label">Exploits Blocked</span>
                    <span className="telemetry-val">1,429</span>
                  </div>
                  <div className="telemetry-divider" />
                  <div className="telemetry-item">
                    <span className="telemetry-label">Autonomous Latency</span>
                    <span className="telemetry-val">&lt; 390ms</span>
                  </div>
                </div>

                {/* Scroll Down Hint */}
                <button
                  type="button"
                  className="scroll-hint-btn"
                  onClick={() => handleScrollToSection('capabilities')}
                  aria-label="Scroll down to features"
                >
                  <span>Explore Capabilities</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </section>

            {/* Protocol Metrics Ribbon */}
            <section className="metrics-banner" id="stats">
              <div className="metrics-grid">
                <div className="metric-box">
                  <div className="metric-icon-wrap cyan">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="metric-info">
                    <span className="metric-value">$42,850,000</span>
                    <span className="metric-title">TVL Safeguarded</span>
                    <span className="metric-desc">Across Uniswap V3 & Aerodrome Base Pools</span>
                  </div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-wrap emerald">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="metric-info">
                    <span className="metric-value">1,429 Neutralized</span>
                    <span className="metric-title">Attacks Intercepted</span>
                    <span className="metric-desc">Sybil clusters, flash-drains & sandwiches</span>
                  </div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-wrap amber">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="metric-info">
                    <span className="metric-value">390 ms</span>
                    <span className="metric-title">Autonomous Reaction</span>
                    <span className="metric-desc">GNN/CNN inference to on-chain counter-swap</span>
                  </div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-wrap purple">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v12M8 10h8" />
                    </svg>
                  </div>
                  <div className="metric-info">
                    <span className="metric-value">14.29 ETH</span>
                    <span className="metric-title">Operator Micro-Bounties</span>
                    <span className="metric-desc">Automated incentives paid via DefensePool.sol</span>
                  </div>
                </div>
              </div>

              {/* Verified Tech Badges */}
              <div className="tech-badges-strip">
                <span className="tech-badge">Base Sepolia Native</span>
                <span className="tech-badge">PyTorch Geometric GNN</span>
                <span className="tech-badge">ResNet-18 Temporal CNN</span>
                <span className="tech-badge">Uniswap V3 Invariant</span>
                <span className="tech-badge">CrewAI Multi-Agent System</span>
              </div>
            </section>

            {/* SECTION 1: WHAT WE PROVIDE */}
            <section className="home-section" id="capabilities">
              <div className="section-header">
                <span className="section-tag cyan">WHAT WE PROVIDE</span>
                <h2 className="section-title">Multimodal AI Threat Engine &amp; Active Defense</h2>
                <p className="section-subtitle">
                  Traditional DeFi security relies on reactive post-mortems and emergency multisig pauses.
                  GraphSentinel intervenes autonomously inside the transaction block with millisecond precision.
                </p>
              </div>

              <div className="features-grid">
                {/* Feature 1 */}
                <div className="feature-card">
                  <div className="feature-card-header">
                    <div className="feature-icon cyan">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </div>
                    <span className="feature-tag">GRAPH NEURAL NETWORKS</span>
                  </div>
                  <h3 className="feature-title">Topological Sybil Cluster Detection</h3>
                  <p className="feature-desc">
                    PyTorch Geometric GNN dynamically evaluates wallet interactions across 48 graph edges in real-time.
                    Identifies circular wash-trading loops and coordinated multi-wallet liquidity drainage before blocks finalize.
                  </p>
                  <div className="feature-spec">
                    <span className="spec-label">Model Architecture</span>
                    <span className="spec-val">GNN GraphConv + Edge Feature Embeddings</span>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="feature-card">
                  <div className="feature-card-header">
                    <div className="feature-icon emerald">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                        <path d="M7 10l3 3 7-7" />
                      </svg>
                    </div>
                    <span className="feature-tag">COMPUTER VISION</span>
                  </div>
                  <h3 className="feature-title">Temporal CNN Volume Anomaly Sensor</h3>
                  <p className="feature-desc">
                    Transforms high-frequency tick-level price changes and transaction velocity into 2D Gramian Angular Fields (GAF).
                    A specialized ResNet-18 model spots temporal manipulation patterns invisible to standard heuristics.
                  </p>
                  <div className="feature-spec">
                    <span className="spec-label">Visual Representation</span>
                    <span className="spec-val">64x64 GAF Temporal Heatmap Matrix</span>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="feature-card">
                  <div className="feature-card-header">
                    <div className="feature-icon amber">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>
                    <span className="feature-tag">AUTONOMOUS AGENTS</span>
                  </div>
                  <h3 className="feature-title">Sub-400ms On-Chain Interceptor</h3>
                  <p className="feature-desc">
                    When the MLP Threat Fusion model crosses the 0.90 threshold, CrewAI Sentinel Agents trigger an atomic counter-trade
                    via <code className="code-pill">DefensePool.sol::executeDefense()</code> on Base Sepolia, restoring pool balance instantaneously.
                  </p>
                  <div className="feature-spec">
                    <span className="spec-label">Execution Speed</span>
                    <span className="spec-val">Sub-400ms Nonce-Priority Flash Swap</span>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="feature-card">
                  <div className="feature-card-header">
                    <div className="feature-icon purple">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                    <span className="feature-tag">DECENTRALIZED INCENTIVES</span>
                  </div>
                  <h3 className="feature-title">Trustless Micro-Bounty Vault</h3>
                  <p className="feature-desc">
                    Sentinel node operators earn automatic 0.01 ETH micro-bounties credited straight to their Agent Vaults for verified defenses.
                    Smart contracts distribute rewards cryptographically, creating an open decentralized immune system for DeFi.
                  </p>
                  <div className="feature-spec">
                    <span className="spec-label">Bounty Rate</span>
                    <span className="spec-val">0.01 ETH / Successful Defense Transaction</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: HOW TO UTILISE THAT */}
            <section className="home-section alt-bg" id="how-to-utilise">
              <div className="section-header">
                <span className="section-tag emerald">OPERATOR &amp; PROTOCOL PLAYBOOK</span>
                <h2 className="section-title">How To Utilise GraphSentinel</h2>
                <p className="section-subtitle">
                  Whether you are a DeFi protocol securing treasury liquidity or a node runner operating sentinel agents,
                  get protected in four streamlined steps.
                </p>
              </div>

              <div className="steps-container">
                {/* Step 1 */}
                <div className="step-card">
                  <div className="step-badge">STEP 01</div>
                  <div className="step-icon-wrap">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                      <circle cx="16" cy="15" r="1" />
                    </svg>
                  </div>
                  <h3 className="step-title">Connect &amp; Authorize Wallet</h3>
                  <p className="step-desc">
                    Connect your Web3 wallet (MetaMask, Coinbase Wallet) on Base Sepolia. Authenticate your node operator keypair
                    to unlock defense execution rights and live telemetry monitoring.
                  </p>
                  <div className="step-action">
                    <button
                      type="button"
                      className="step-btn"
                      onClick={() => setIsWalletModalOpen(true)}
                    >
                      {userAddress ? '✓ Wallet Connected' : 'Connect Operator Wallet →'}
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="step-card">
                  <div className="step-badge">STEP 02</div>
                  <div className="step-icon-wrap">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <h3 className="step-title">Bind Target Liquidity Pools</h3>
                  <p className="step-desc">
                    Select supported liquidity pools (Uniswap V3 ETH/USDC, Aerodrome AERO/ETH) or register your protocol’s
                    custom pool contract address to initiate 24/7 RPC WebSocket event tracking.
                  </p>
                  <div className="step-chips">
                    <span className="pool-chip">Uniswap V3 ETH/USDC</span>
                    <span className="pool-chip">Aerodrome AERO/ETH</span>
                    <span className="pool-chip">Curve TriCrypto</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="step-card">
                  <div className="step-badge">STEP 03</div>
                  <div className="step-icon-wrap">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8">
                      <line x1="4" y1="21" x2="4" y2="14" />
                      <line x1="4" y1="10" x2="4" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12" y2="3" />
                      <line x1="20" y1="21" x2="20" y2="16" />
                      <line x1="20" y1="12" x2="20" y2="3" />
                      <circle cx="4" cy="12" r="2" />
                      <circle cx="12" cy="10" r="2" />
                      <circle cx="20" cy="14" r="2" />
                    </svg>
                  </div>
                  <h3 className="step-title">Calibrate Defense Guardrails</h3>
                  <p className="step-desc">
                    Tune the multimodal threat threshold (default 0.90), set maximum slippage buffers for defense swaps,
                    and configure emergency circuit-breaker parameters tailored to your pool’s risk profile.
                  </p>
                  <div className="step-parameters">
                    <div className="param-item">
                      <span className="param-key">Threat Threshold:</span>
                      <span className="param-val">0.900 Fused</span>
                    </div>
                    <div className="param-item">
                      <span className="param-key">Max Counter-Trade:</span>
                      <span className="param-val">50.0 ETH</span>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="step-card">
                  <div className="step-badge">STEP 04</div>
                  <div className="step-icon-wrap">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <h3 className="step-title">Autonomous Defense &amp; Bounties</h3>
                  <p className="step-desc">
                    Once armed, Sentinel Agents continually monitor mempools. When threats are detected, counter-trades execute
                    sub-second with zero human intervention, and bounties stream directly into your wallet.
                  </p>
                  <div className="step-action">
                    <button
                      type="button"
                      className="step-btn primary"
                      onClick={handleLaunchRadar}
                    >
                      Open Live Threat Radar →
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: INTERACTIVE THREAT RADAR PREVIEW */}
            <section className="home-section" id="radar-preview">
              <div className="preview-container">
                <div className="preview-left">
                  <span className="section-tag cyan">MISSION CONTROL PREVIEW</span>
                  <h2 className="preview-title">Real-Time Threat Radar &amp; Topology Graph</h2>
                  <p className="preview-copy">
                    Experience decentralized pool defense live. Inspect wallet topology clusters, review neural network
                    inference streaming logs, and run simulated Sybil wash-trading exploits.
                  </p>

                  <div className="preview-feature-list">
                    <div className="preview-f-item">
                      <span className="f-dot cyan" />
                      <span><strong>Interactive Graph Topology:</strong> Click individual wallet nodes to inspect balance, threat score, and Sybil cluster status.</span>
                    </div>
                    <div className="preview-f-item">
                      <span className="f-dot emerald" />
                      <span><strong>Streaming Terminal Logs:</strong> Live WebSocket telemetry broadcasting PyTorch GNN, ResNet-18 CNN, and on-chain contract events.</span>
                    </div>
                    <div className="preview-f-item">
                      <span className="f-dot purple" />
                      <span><strong>Attack Simulator:</strong> Trigger simulated wash-trading bursts and witness autonomous defense trades in real-time.</span>
                    </div>
                  </div>

                  <div className="preview-cta-row">
                    <FlameButton
                      text="Launch Full Radar"
                      onClick={handleLaunchRadar}
                    />
                    <FlameButton
                      text="Watch Defense Demo"
                      onClick={() => setIsWatchDefenseOpen(true)}
                    />
                  </div>
                </div>

                {/* Cyber Console Card Preview */}
                <div className="preview-right">
                  <div className="radar-mock-window">
                    <div className="mock-window-header">
                      <div className="mock-window-dots">
                        <span className="dot red" />
                        <span className="dot yellow" />
                        <span className="dot green" />
                      </div>
                      <div className="mock-window-title">GraphSentinel_Interceptor::BaseSepolia</div>
                      <div className="mock-window-badge">LIVE 390MS</div>
                    </div>

                    <div className="mock-threat-bar">
                      <div className="mock-threat-meta">
                        <span className="threat-label">FUSED THREAT SCORE:</span>
                        <span className="threat-number">0.946 (CRITICAL)</span>
                      </div>
                      <div className="threat-progress-track">
                        <div className="threat-progress-fill" style={{ width: '94.6%' }} />
                      </div>
                    </div>

                    <div className="mock-terminal">
                      <div className="mock-log-line gnn">
                        <span className="log-time">13:13:02</span>
                        <span className="log-tag">[GNN]</span>
                        <span>Monitoring 48 wallet topology edges in Uniswap V3 ETH/USDC</span>
                      </div>
                      <div className="mock-log-line cnn">
                        <span className="log-time">13:13:03</span>
                        <span className="log-tag">[CNN]</span>
                        <span>ResNet-18 GAF temporal matrix computed. Baseline normal market jitter.</span>
                      </div>
                      <div className="mock-log-line alert">
                        <span className="log-time">13:13:08</span>
                        <span className="log-tag">[ALERT]</span>
                        <span>Rapid cyclic transfer pattern across 4 Sybil nodes [0x7A..C4]</span>
                      </div>
                      <div className="mock-log-line fusion">
                        <span className="log-time">13:13:08</span>
                        <span className="log-tag">[FUSION]</span>
                        <span>Threat Score 0.946 &gt; 0.90 threshold. Triggering Sentinel Agent...</span>
                      </div>
                      <div className="mock-log-line defense">
                        <span className="log-time">13:13:09</span>
                        <span className="log-tag">[DEFENSE]</span>
                        <span>DefensePool.sol::executeDefense(0x8f2a...c301) confirmed in 390ms.</span>
                      </div>
                    </div>

                    <div className="mock-action-footer">
                      <span className="footer-status-text">Autonomous Interceptor Armed • Ready</span>
                      <button
                        type="button"
                        className="mock-enter-btn"
                        onClick={handleLaunchRadar}
                      >
                        Enter Mission Control →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: CALL TO ACTION BANNER */}
            <section className="home-section cta-banner-section" id="get-started">
              <div className="cta-box">
                <div className="cta-content">
                  <span className="section-tag emerald">GET STARTED IN MINUTES</span>
                  <h2 className="cta-headline">Fortify Your Liquidity Pools Against Sybil Exploits</h2>
                  <p className="cta-desc">
                    Deploy proactive machine learning defense before your protocol becomes another post-mortem report.
                    Zero setup downtime, transparent on-chain execution on Base Sepolia.
                  </p>

                  <div className="cta-buttons">
                    <FlameButton
                      text="Launch Threat Radar"
                      onClick={handleLaunchRadar}
                    />
                    <FlameButton
                      text="Request Protocol Audit & Integration"
                      onClick={() => setIsContactOpen(true)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SITE FOOTER */}
            <footer className="site-footer">
              <div className="footer-main">
                <div className="footer-brand-col">
                  <div className="footer-brand">
                    <svg className="brand-disc" width="22" height="22" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12.5" cy="12.5" r="12.5" fill="#ededed" />
                      <path d="M12.5 1.5L20.5 9.5L12.5 15.5L4.5 9.5Z" fill="#050606" />
                      <path d="M12.5 1.5L20.5 9.5L12.5 9.5Z" fill="#737778" />
                      <path d="M12.5 1.5L4.5 9.5L12.5 9.5Z" fill="#fafafa" />
                      <path d="M12.5 15.5L20.5 9.5L16.5 21.5Z" fill="#0a0b0b" />
                      <path d="M12.5 15.5L4.5 9.5L8.5 21.5Z" fill="#737778" />
                      <path d="M12.5 15.5L8.5 21.5L12.5 23.5L16.5 21.5Z" fill="#050606" />
                    </svg>
                    <span className="footer-brand-name">GraphSentinel</span>
                  </div>
                  <p className="footer-tagline">
                    Autonomous active defense infrastructure for DeFi liquidity pools. Powered by GNN topological intelligence,
                    temporal CNN computer vision, and on-chain agentic execution.
                  </p>
                </div>

                <div className="footer-links-col">
                  <h4 className="footer-heading">Navigation</h4>
                  <ul className="footer-link-list">
                    <li><button type="button" className="footer-link-btn" onClick={() => handleScrollToSection('hero')}>Home</button></li>
                    <li><button type="button" className="footer-link-btn" onClick={handleLaunchRadar}>Threat Radar</button></li>
                    <li><button type="button" className="footer-link-btn" onClick={() => handleScrollToSection('capabilities')}>Capabilities</button></li>
                    <li><button type="button" className="footer-link-btn" onClick={() => handleScrollToSection('how-to-utilise')}>Operator Playbook</button></li>
                  </ul>
                </div>

                <div className="footer-links-col">
                  <h4 className="footer-heading">Resources</h4>
                  <ul className="footer-link-list">
                    <li><button type="button" className="footer-link-btn" onClick={() => setIsWatchDefenseOpen(true)}>Watch Defense Flow</button></li>
                    <li><button type="button" className="footer-link-btn" onClick={() => setIsContactOpen(true)}>Protocol Contact</button></li>
                    <li><a href="https://sepolia.basescan.org" target="_blank" rel="noreferrer" className="footer-link-btn">BaseScan Explorer ↗</a></li>
                    <li><a href="https://github.com/arkapravamahapa/GraphSentinel" target="_blank" rel="noreferrer" className="footer-link-btn">GitHub Repository ↗</a></li>
                  </ul>
                </div>
              </div>

              <div className="footer-bottom">
                <span className="footer-copy-text">© 2026 GraphSentinel. Built for Hackathon. All rights reserved.</span>
                <span className="footer-security-note">Audited Smart Contracts • Cryptographically Signed Interceptor Payloads</span>
              </div>
            </footer>
          </div>
        ) : (
          /* Live Threat Radar Mission Control Dashboard */
          <div
            style={{
              position: 'fixed',
<<<<<<< HEAD
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: 'calc(100vh - 64px)',
              overflow: 'hidden',
              zIndex: 10,
=======
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden',
              zIndex: 20,
>>>>>>> origin/main
            }}
          >
            <ThreatRadarDashboard
              userAddress={userAddress}
              onDisconnect={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
<<<<<<< HEAD
=======
              onOpenWalletModal={() => setIsWalletModalOpen(true)}
>>>>>>> origin/main
            />
          </div>
        )}
      </main>

      {/* Interactive Modals */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectSuccess={handleConnectSuccess}
      />

      <WatchDefenseModal
        isOpen={isWatchDefenseOpen}
        onClose={() => setIsWatchDefenseOpen(false)}
        onLaunchRadar={() => {
          setIsWatchDefenseOpen(false);
          setActiveTab('radar');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}

export default App;