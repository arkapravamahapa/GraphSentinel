import React, { useState, useEffect, useRef } from 'react';

interface ThreatRadarDashboardProps {
  userAddress: string;
  onDisconnect: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'system' | 'gnn' | 'cnn' | 'fusion' | 'agent' | 'defense' | 'bounty';
  message: string;
}

interface NodeData {
  id: string;
  x: number;
  y: number;
  type: 'normal' | 'suspicious' | 'attack';
  address: string;
  balance: string;
  threatScore: number;
}

export const ThreatRadarDashboard: React.FC<ThreatRadarDashboardProps> = ({ userAddress, onDisconnect }) => {
  const [selectedPool, setSelectedPool] = useState<string>('Uniswap V3 ETH/USDC');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [attackActive, setAttackActive] = useState<boolean>(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Metric stats
  const [stats, setStats] = useState({
    tvlProtected: 42850000,
    attacksBlocked: 1429,
    bountiesPaid: 14.29,
    currentThreat: 0.946,
  });

  // Streaming terminal logs
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '13:13:01.014', type: 'system', message: 'WebSocket initialized. Connected to Base Sepolia RPC wss://base-sepolia.g.alchemy.com/v2/...' },
    { id: '2', timestamp: '13:13:02.120', type: 'gnn', message: 'PyTorch Geometric GNN: Monitoring 48 wallet topology edges in Uniswap V3 ETH/USDC' },
    { id: '3', timestamp: '13:13:03.450', type: 'cnn', message: 'ResNet-18 CNN: GAF temporal matrix computed. Baseline normal market jitter.' },
    { id: '4', timestamp: '13:13:05.890', type: 'fusion', message: 'MLP Fusion: Threat_Score 0.124 (Pool Safe • Autonomous Guard Armed)' },
    { id: '5', timestamp: '13:13:08.200', type: 'gnn', message: 'ALERT: Rapid cyclic transfer pattern identified across 4 Sybil nodes [0x7A..C4]' },
    { id: '6', timestamp: '13:13:08.310', type: 'cnn', message: 'CNN GAF Anomaly: Chaotic diagonal pattern detected. Temporal anomaly score: 91.8%' },
    { id: '7', timestamp: '13:13:08.430', type: 'fusion', message: 'FUSED THREAT SCORE: 0.946 (> 0.90 THRESHOLD). Triggering Autonomous Interceptor...' },
    { id: '8', timestamp: '13:13:08.520', type: 'agent', message: 'CrewAI Sentinel Agent: Evaluating counter-trade parameters. Calculating optimal stabilizing swap.' },
    { id: '9', timestamp: '13:13:08.680', type: 'defense', message: 'Executing DefensePool.sol::executeDefense(0x8f2a...c301) on Base Sepolia. Nonce: pending' },
    { id: '10', timestamp: '13:13:08.910', type: 'bounty', message: 'CONFIRMED: Defensive swap executed in 390ms. 0.01 ETH Micro-Bounty credited to Agent Vault.' },
  ]);

  // Network graph nodes
  const nodes: NodeData[] = [
    // Safe Liquidity Providers (Cyan)
    { id: 'node-1', x: 80, y: 160, type: 'normal', address: '0x12a9...48b1', balance: '184.2 ETH', threatScore: 0.04 },
    { id: 'node-2', x: 140, y: 120, type: 'normal', address: '0x99e2...c801', balance: '92.5 ETH', threatScore: 0.06 },
    { id: 'node-3', x: 190, y: 190, type: 'normal', address: '0x33b1...77fa', balance: '410.0 ETH', threatScore: 0.02 },
    { id: 'node-4', x: 110, y: 250, type: 'normal', address: '0x88f1...19a2', balance: '54.1 ETH', threatScore: 0.08 },
    { id: 'node-5', x: 220, y: 280, type: 'normal', address: '0x55c3...44e9', balance: '312.8 ETH', threatScore: 0.03 },

    // Suspicious Cluster (Amber)
    { id: 'node-6', x: 280, y: 230, type: 'suspicious', address: '0x44d1...82bc', balance: '28.4 ETH', threatScore: 0.68 },
    { id: 'node-7', x: 340, y: 210, type: 'suspicious', address: '0x77c2...51aa', balance: '19.9 ETH', threatScore: 0.72 },
    { id: 'node-8', x: 310, y: 290, type: 'suspicious', address: '0x22a0...93f4', balance: '34.0 ETH', threatScore: 0.65 },

    // Attack Ring (Rose Red Wash-Trading Loop)
    { id: 'node-9', x: 320, y: 90, type: attackActive ? 'attack' : 'normal', address: '0x91F4...e21B', balance: '82.4 ETH', threatScore: attackActive ? 0.96 : 0.05 },
    { id: 'node-10', x: 390, y: 70, type: attackActive ? 'attack' : 'normal', address: '0x4B21...8a90', balance: '81.9 ETH', threatScore: attackActive ? 0.94 : 0.04 },
    { id: 'node-11', x: 420, y: 140, type: attackActive ? 'attack' : 'normal', address: '0x8C19...b3f2', balance: '83.1 ETH', threatScore: attackActive ? 0.95 : 0.05 },
    { id: 'node-12', x: 350, y: 160, type: attackActive ? 'attack' : 'normal', address: '0x2A98...77e1', balance: '82.0 ETH', threatScore: attackActive ? 0.97 : 0.04 },
  ];

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSimulateAttack = () => {
    setIsSimulating(true);
    setAttackActive(true);
    setToastMessage('⚠️ High-Frequency Wash Attack Injected into Uniswap V3 Pool');

    const now = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { id: String(Date.now()), timestamp: now, type: 'gnn', message: `SIMULATED ATTACK: 4-wallet circular wash cycle detected with $1.8M volume spike.` },
      ]);
    }, 400);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { id: String(Date.now() + 1), timestamp: now, type: 'cnn', message: `CNN GAF Confidence: 95.4% algorithmic manipulation pattern match.` },
      ]);
    }, 900);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { id: String(Date.now() + 2), timestamp: now, type: 'fusion', message: `Multimodal Fused Threat Score: 0.958 (> 0.90). Waking Interceptor Agent!` },
      ]);
    }, 1400);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { id: String(Date.now() + 3), timestamp: now, type: 'agent', message: `Agentic Interceptor: Executed counter-trade of 38.5 ETH. DefensePool.sol signature verified.` },
        { id: String(Date.now() + 4), timestamp: now, type: 'bounty', message: `ATTACK NEUTRALIZED: Defense TX: 0x${Math.random().toString(16).substring(2, 10)}... Base Sepolia. 0.01 ETH bounty transferred.` },
      ]);
      setStats((prev) => ({
        ...prev,
        attacksBlocked: prev.attacksBlocked + 1,
        bountiesPaid: Number((prev.bountiesPaid + 0.01).toFixed(2)),
        tvlProtected: prev.tvlProtected + 1800000,
      }));
      setToastMessage('🛡️ Autonomous Defense Executed: $1.8M Liquidity Protected! (0.01 ETH Bounty Paid)');
      setIsSimulating(false);
    }, 2200);

    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#020617', // slate-950
        color: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 99999,
            background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.98))',
            border: '1px solid #22d3ee',
            borderRadius: '10px',
            padding: '12px 20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(34, 211, 238, 0.3)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
            fontWeight: 500,
          }}
        >
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <header
        style={{
          height: '60px',
          borderBottom: '1px solid #1e293b', // border-slate-800
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          zIndex: 30,
        }}
      >
        {/* Brand & Pool Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={onDisconnect}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#ededed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(34, 211, 238, 0.3)',
              }}
            >
              <div style={{ width: '12px', height: '12px', transform: 'rotate(45deg)', background: '#050606' }} />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px', color: '#ffffff' }}>
                GraphSentinel
              </span>
              <span style={{ fontSize: '10px', color: '#22d3ee', marginLeft: '6px', fontWeight: 600, border: '1px solid rgba(34, 211, 238, 0.4)', padding: '1px 5px', borderRadius: '4px' }}>
                ACTIVE RADAR
              </span>
            </div>
          </div>

          <div style={{ height: '24px', width: '1px', background: '#334155' }} />

          {/* Target Pool Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Pool:</span>
            <select
              value={selectedPool}
              onChange={(e) => setSelectedPool(e.target.value)}
              style={{
                background: '#0f172a',
                border: '1px solid #334155',
                color: '#f8fafc',
                fontSize: '12.5px',
                padding: '5px 10px',
                borderRadius: '6px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option>Uniswap V3 ETH/USDC</option>
              <option>Aerodrome AERO/USDC (Base)</option>
              <option>Camelot ARB/USDC (Arbitrum)</option>
            </select>
          </div>
        </div>

        {/* Center Threat Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(2, 6, 23, 0.8)',
            border: '1px solid #1e293b',
            padding: '5px 16px',
            borderRadius: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                display: 'inline-block',
                animation: 'pulse 1.8s infinite',
              }}
            />
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Sentinel AI Agent: <strong style={{ color: '#34d399' }}>ARMED</strong></span>
          </div>
          <span style={{ color: '#475569' }}>|</span>
          <div style={{ fontSize: '12px' }}>
            <span style={{ color: '#94a3b8' }}>Fused Threat: </span>
            <span style={{ color: attackActive ? '#f43f5e' : '#34d399', fontWeight: 700, fontFamily: 'monospace' }}>
              {(stats.currentThreat * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Right Actions & Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleSimulateAttack}
            disabled={isSimulating}
            style={{
              background: isSimulating ? '#334155' : 'linear-gradient(135deg, #e11d48, #be123c)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '7px',
              padding: '7px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 15px rgba(225, 29, 72, 0.3)',
            }}
          >
            <span>{isSimulating ? '⚡ Intercepting...' : '⚠️ Simulate Attack'}</span>
          </button>

          <div
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              padding: '6px 12px',
              borderRadius: '7px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
            {userAddress || '0x71C8...39FA'}
          </div>

          <button
            onClick={onDisconnect}
            title="Disconnect and return to landing page"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#cbd5e1',
              borderRadius: '7px',
              padding: '7px 12px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Exit Radar
          </button>
        </div>
      </header>

      {/* Main Body: Sidebar + 12-Column Grid */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Left Sidebar (w-64 = 256px) */}
        <aside
          style={{
            width: '256px',
            borderRight: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            flexShrink: 0,
            overflowY: 'auto',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
              Protocol Health
            </div>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Network:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>Base Sepolia</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Contract:</span>
                <span style={{ color: '#22d3ee', fontFamily: 'monospace' }}>DefensePool.sol</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Response Latency:</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>38ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#94a3b8' }}>Vault Balance:</span>
                <span style={{ color: '#f8fafc', fontFamily: 'monospace' }}>250.0 ETH</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
              Multimodal Models
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#38bdf8' }}>PyG GNN v2.4</span>
                  <span style={{ fontSize: '10px', background: '#0369a1', color: '#e0f2fe', padding: '1px 5px', borderRadius: '4px' }}>Active</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                  EdgeConv structural ring topology detector
                </div>
              </div>

              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#f43f5e' }}>ResNet-18 GAF</span>
                  <span style={{ fontSize: '10px', background: '#9f1239', color: '#ffe4e6', padding: '1px 5px', borderRadius: '4px' }}>Active</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                  Temporal trade-velocity visual heatmap
                </div>
              </div>

              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#a855f7' }}>CrewAI Interceptor</span>
                  <span style={{ fontSize: '10px', background: '#6b21a8', color: '#f3e8ff', padding: '1px 5px', borderRadius: '4px' }}>Autonomous</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                  On-chain counter-trade signer
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', background: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '10px', padding: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#22d3ee', marginBottom: '4px' }}>
              Base Sepolia Oracle Feed
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
              Zero-latency event stream connected via Alchemy RPC node.
            </div>
          </div>
        </aside>

        {/* Main Content Area (12-Column Grid) */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Top Row: 3 Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
            {/* Stat Card 1 */}
            <div
              style={{
                gridColumn: 'span 4',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(12px)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Value Protected
                </span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.5px' }}>
                ${(stats.tvlProtected / 1000000).toFixed(2)}M
              </div>
              <div style={{ fontSize: '12px', color: '#34d399', marginTop: '4px' }}>
                ↑ +$1.8M shielded in last 24h
              </div>
            </div>

            {/* Stat Card 2 */}
            <div
              style={{
                gridColumn: 'span 4',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(12px)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Attacks Blocked
                </span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee' }} />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.5px' }}>
                {stats.attacksBlocked.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#67e8f9', marginTop: '4px' }}>
                100% Autonomous Zero-Human Intervention
              </div>
            </div>

            {/* Stat Card 3 */}
            <div
              style={{
                gridColumn: 'span 4',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(12px)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  AI Bounties Paid
                </span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.5px' }}>
                {stats.bountiesPaid} ETH
              </div>
              <div style={{ fontSize: '12px', color: '#fde68a', marginTop: '4px' }}>
                BountyManager.sol automated gas subsidies
              </div>
            </div>
          </div>

          {/* Middle Row: Network Graph (8 cols) & Agent Terminal (4 cols) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', minHeight: '380px' }}>
            {/* Live Network Graph */}
            <div
              style={{
                gridColumn: 'span 8',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee' }} />
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Live Wallet Network Topology (GNN)
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee' }} /> Normal LP
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} /> Suspicious
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} /> Attack Ring
                  </span>
                </div>
              </div>

              {/* Graph Visualizer Canvas / SVG */}
              <div
                style={{
                  flex: 1,
                  background: '#040911',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '290px',
                }}
              >
                {/* Background Grid Lines */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <defs>
                    <pattern id="dashGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(34,211,238,0.05)" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dashGrid)" />

                  {/* Edges between normal nodes */}
                  <g stroke="rgba(34,211,238,0.25)" strokeWidth="1.2">
                    <line x1="80" y1="160" x2="140" y2="120" />
                    <line x1="140" y1="120" x2="190" y2="190" />
                    <line x1="190" y1="190" x2="110" y2="250" />
                    <line x1="110" y1="250" x2="80" y2="160" />
                    <line x1="190" y1="190" x2="220" y2="280" />
                  </g>

                  {/* Edges to suspicious cluster */}
                  <g stroke="rgba(251,191,36,0.4)" strokeWidth="1.4">
                    <line x1="220" y1="280" x2="280" y2="230" strokeDasharray="3 2" />
                    <line x1="280" y1="230" x2="340" y2="210" />
                    <line x1="340" y1="210" x2="310" y2="290" />
                    <line x1="310" y1="290" x2="280" y2="230" />
                  </g>

                  {/* Edges of Attack Ring (Wash Loop) */}
                  {attackActive && (
                    <g stroke="#f43f5e" strokeWidth="2.2" strokeDasharray="5 3">
                      <line x1="320" y1="90" x2="390" y2="70" />
                      <line x1="390" y1="70" x2="420" y2="140" />
                      <line x1="420" y1="140" x2="350" y2="160" />
                      <line x1="350" y1="160" x2="320" y2="90" />
                    </g>
                  )}
                </svg>

                {/* Interactive HTML Nodes */}
                {nodes.map((node) => {
                  const isAttack = node.type === 'attack';
                  const isSuspicious = node.type === 'suspicious';
                  const color = isAttack ? '#f43f5e' : isSuspicious ? '#fbbf24' : '#22d3ee';

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{
                        position: 'absolute',
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        transform: 'translate(-50%, -50%)',
                        width: isAttack ? '22px' : '16px',
                        height: isAttack ? '22px' : '16px',
                        borderRadius: '50%',
                        background: color,
                        border: '2px solid #ffffff',
                        boxShadow: `0 0 12px ${color}`,
                        cursor: 'pointer',
                        transition: 'transform 160ms ease',
                        animation: isAttack ? 'pulse 1.2s infinite' : 'none',
                      }}
                      title={`${node.address} (Threat: ${(node.threatScore * 100).toFixed(0)}%)`}
                    />
                  );
                })}

                {/* Node Detail Popup when clicked */}
                {selectedNode && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '16px',
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid #38bdf8',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
                      zIndex: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ color: '#ffffff' }}>Node Inspector</strong>
                      <button
                        onClick={() => setSelectedNode(null)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 4px' }}
                      >
                        ✕
                      </button>
                    </div>
                    <div>Address: <span style={{ color: '#38bdf8' }}>{selectedNode.address}</span></div>
                    <div>Balance: <span style={{ color: '#f8fafc' }}>{selectedNode.balance}</span></div>
                    <div>Threat Score: <span style={{ color: selectedNode.threatScore > 0.8 ? '#f43f5e' : '#34d399', fontWeight: 700 }}>{(selectedNode.threatScore * 100).toFixed(1)}%</span></div>
                    <div>Classification: <span style={{ textTransform: 'uppercase', color: selectedNode.type === 'attack' ? '#f43f5e' : '#38bdf8' }}>{selectedNode.type}</span></div>
                  </div>
                )}
              </div>
            </div>

            {/* Agent Terminal (4 cols) */}
            <div
              style={{
                gridColumn: 'span 4',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Agent Terminal
                  </h3>
                </div>
                <span style={{ fontSize: '11px', color: '#22d3ee', fontFamily: 'monospace' }}>LIVE REASONING</span>
              </div>

              {/* Terminal CLI Window */}
              <div
                style={{
                  flex: 1,
                  background: '#000000',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '12px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  lineHeight: 1.5,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {logs.map((log) => {
                  let color = '#94a3b8';
                  if (log.type === 'gnn') color = '#38bdf8';
                  if (log.type === 'cnn') color = '#fbbf24';
                  if (log.type === 'fusion') color = '#f43f5e';
                  if (log.type === 'agent') color = '#a855f7';
                  if (log.type === 'defense') color = '#34d399';
                  if (log.type === 'bounty') color = '#22d3ee';

                  return (
                    <div key={log.id} style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#475569', fontSize: '10px' }}>[{log.timestamp}]</span>
                      <span style={{ color }}>{log.message}</span>
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>

          {/* Bottom Row: GAF Heatmap (6 cols) & Recent Threat Log (6 cols) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
            {/* GAF Heatmap Viewer (6 cols) */}
            <div
              style={{
                gridColumn: 'span 6',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} />
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Gramian Angular Field (GAF) Viewer
                  </h3>
                </div>
                <span style={{ fontSize: '11px', color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(244, 63, 94, 0.3)', fontFamily: 'monospace' }}>
                  CNN CONFIDENCE: 94.2%
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {/* 6x6 GAF Matrix Visual */}
                <div
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridTemplateRows: 'repeat(6, 1fr)',
                    gap: '2px',
                    padding: '4px',
                    background: '#020617',
                    flexShrink: 0,
                  }}
                >
                  {[
                    '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#fbbf24', '#f43f5e',
                    '#0284c7', '#0369a1', '#38bdf8', '#f59e0b', '#f43f5e', '#be123c',
                    '#0ea5e9', '#38bdf8', '#0284c7', '#f43f5e', '#be123c', '#e11d48',
                    '#38bdf8', '#f59e0b', '#f43f5e', '#e11d48', '#be123c', '#f43f5e',
                    '#fbbf24', '#f43f5e', '#be123c', '#be123c', '#f43f5e', '#fbbf24',
                    '#f43f5e', '#be123c', '#e11d48', '#f43f5e', '#fbbf24', '#38bdf8',
                  ].map((cellColor, idx) => (
                    <div key={idx} style={{ background: cellColor, borderRadius: '2px' }} />
                  ))}
                </div>

                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                  <p style={{ margin: '0 0 6px 0', color: '#f8fafc', fontWeight: 600 }}>
                    Temporal Visual Representation of Swap Bursts
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    Converts 1-second price impact time-series into a 2D polar matrix. The chaotic red diagonal band indicates synchronized wash volume across Sybil clusters.
                  </p>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#22d3ee' }}>
                    ResNet-18 Heatmap Anomaly Score: 0.942
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Threat & Defense Log (6 cols) */}
            <div
              style={{
                gridColumn: 'span 6',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Recent Neutralized Threats
                  </h3>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Base Sepolia Ledger</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      <th style={{ padding: '6px 8px' }}>Threat ID</th>
                      <th style={{ padding: '6px 8px' }}>Score</th>
                      <th style={{ padding: '6px 8px' }}>Action</th>
                      <th style={{ padding: '6px 8px' }}>On-Chain TX</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '8px', fontFamily: 'monospace', color: '#f8fafc' }}>#WASH-489</td>
                      <td style={{ padding: '8px', color: '#f43f5e', fontWeight: 700 }}>94.6%</td>
                      <td style={{ padding: '8px', color: '#34d399' }}>Counter-Swap (45.2 ETH)</td>
                      <td style={{ padding: '8px', fontFamily: 'monospace', color: '#38bdf8' }}>0x8f2a...c301</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '8px', fontFamily: 'monospace', color: '#f8fafc' }}>#PUMP-488</td>
                      <td style={{ padding: '8px', color: '#fbbf24', fontWeight: 700 }}>88.2%</td>
                      <td style={{ padding: '8px', color: '#34d399' }}>Liquidity Shield Lock</td>
                      <td style={{ padding: '8px', fontFamily: 'monospace', color: '#38bdf8' }}>0x33e1...91ba</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', fontFamily: 'monospace', color: '#f8fafc' }}>#SYBIL-487</td>
                      <td style={{ padding: '8px', color: '#f43f5e', fontWeight: 700 }}>96.1%</td>
                      <td style={{ padding: '8px', color: '#34d399' }}>Invariant Stabilize</td>
                      <td style={{ padding: '8px', fontFamily: 'monospace', color: '#38bdf8' }}>0x19a0...44df</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
