import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  BarChart3,
  Layers,
  Award,
  Settings,
  LogOut,
  ChevronDown,
  X,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Cpu,
  TrendingUp,
  Sliders,
} from 'lucide-react';

interface ThreatRadarDashboardProps {
  userAddress: string;
  onDisconnect: () => void;
  onOpenWalletModal?: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'system' | 'gnn' | 'cnn' | 'fusion' | 'agent' | 'defense' | 'bounty';
  message: string;
}

interface NodeData {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'normal' | 'suspicious' | 'attack';
  address: string;
  balance: string;
  threatScore: number;
  cluster: string;
  role: string;
}

interface RecentThreat {
  id: string;
  type: string;
  score: number;
  action: string;
  txHash: string;
  pool: string;
  timestamp: string;
  status: 'neutralized' | 'intercepted' | 'stabilized';
  details: {
    gnnScore: number;
    cnnScore: number;
    fusedScore: number;
    washVolume: string;
    targetContract: string;
  };
}

const defaultSelectedNode: NodeData = {
  id: 'node-9',
  label: 'ATK-SybilA',
  x: 68,
  y: 18,
  type: 'normal',
  address: '0x91F4...e21B',
  balance: '82.4 ETH',
  threatScore: 0.05,
  cluster: '#SYBIL-487 Attack Ring',
  role: 'Sybil Coordinator',
};

export const ThreatRadarDashboard: React.FC<ThreatRadarDashboardProps> = ({
  userAddress,
  onDisconnect,
  onOpenWalletModal,
}) => {
  const [activeRail, setActiveRail] = useState<'radar' | 'analytics' | 'pools' | 'bounties' | 'settings'>('radar');
  const [selectedPool, setSelectedPool] = useState<string>('Uniswap v3 ETH/USDC');
  const [isPoolDropdownOpen, setIsPoolDropdownOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isDefending, setIsDefending] = useState<boolean>(false);
  const [attackActive, setAttackActive] = useState<boolean>(false);
  const [currentThreat, setCurrentThreat] = useState<number>(0.114);
  const [gafImage, setGafImage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(defaultSelectedNode);
  const [selectedThreat, setSelectedThreat] = useState<RecentThreat | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    tvlProtected: 42850000,
    attacksBlocked: 1429,
    bountiesPaid: 14.29,
  });

  // Terminal Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '20:25:56', type: 'system', message: 'Connecting to GraphSentinel Base-Sepolia Subgraph...' },
    { id: '2', timestamp: '20:25:58', type: 'system', message: 'WebSocket Connected: Streaming mempool transactions on port 8000.' },
    { id: '3', timestamp: '20:26:01', type: 'gnn', message: 'PyG GNN v2.4 (EdgeConv) topology engine online. Ring threshold: 0.85.' },
    { id: '4', timestamp: '20:26:02', type: 'cnn', message: 'ResNet-18 GAF computer vision model loaded. Polar projection ready.' },
    { id: '5', timestamp: '20:26:04', type: 'agent', message: 'CrewAI Autonomous Interceptor armed via DefensePool.sol signer.' },
    { id: '6', timestamp: '20:26:10', type: 'system', message: 'Batch Processed: 14 Txs. Status: Normal LP Flow.' },
  ]);

  // Network Graph Nodes (Dynamic positions in viewport percentage)
  const nodes: NodeData[] = [
    // Safe Liquidity Providers (Cyan)
    { id: 'node-1', label: 'LP-Alpha', x: 22, y: 35, type: 'normal', address: '0x12a9...48b1', balance: '184.2 ETH', threatScore: 0.04, cluster: 'Safe Liquidity Cluster', role: 'Concentrated LP' },
    { id: 'node-2', label: 'LP-Beta', x: 34, y: 26, type: 'normal', address: '0x99e2...c801', balance: '92.5 ETH', threatScore: 0.06, cluster: 'Safe Liquidity Cluster', role: 'Arbitrage Provider' },
    { id: 'node-3', label: 'LP-Gamma', x: 44, y: 40, type: 'normal', address: '0x33b1...77fa', balance: '410.0 ETH', threatScore: 0.02, cluster: 'Safe Liquidity Cluster', role: 'Institutional Vault' },
    { id: 'node-4', label: 'LP-Delta', x: 28, y: 55, type: 'normal', address: '0x88f1...19a2', balance: '54.1 ETH', threatScore: 0.08, cluster: 'Safe Liquidity Cluster', role: 'Retail Pool Provider' },
    { id: 'node-5', label: 'LP-Epsilon', x: 48, y: 62, type: 'normal', address: '0x55c3...44e9', balance: '312.8 ETH', threatScore: 0.03, cluster: 'Safe Liquidity Cluster', role: 'Market Maker Vault' },

    // Suspicious Cluster (Amber)
    { id: 'node-6', label: 'SUSP-01', x: 62, y: 50, type: 'suspicious', address: '0x44d1...82bc', balance: '28.4 ETH', threatScore: 0.68, cluster: 'Unusual Velocity Cluster', role: 'High-Freq Rebalancer' },
    { id: 'node-7', label: 'SUSP-02', x: 74, y: 44, type: 'suspicious', address: '0x77c2...51aa', balance: '19.9 ETH', threatScore: 0.72, cluster: 'Unusual Velocity Cluster', role: 'Rapid Gas Escalator' },
    { id: 'node-8', label: 'SUSP-03', x: 68, y: 66, type: 'suspicious', address: '0x22a0...93f4', balance: '34.0 ETH', threatScore: 0.65, cluster: 'Unusual Velocity Cluster', role: 'Split Wallet Relay' },

    // Attack Ring (Rose Red Wash-Trading Loop)
    { id: 'node-9', label: 'ATK-SybilA', x: 68, y: 18, type: attackActive ? 'attack' : 'normal', address: '0x91F4...e21B', balance: '82.4 ETH', threatScore: attackActive ? 0.961 : 0.05, cluster: '#SYBIL-487 Attack Ring', role: 'Sybil Coordinator' },
    { id: 'node-10', label: 'ATK-SybilB', x: 84, y: 14, type: attackActive ? 'attack' : 'normal', address: '0x4B21...8a90', balance: '81.9 ETH', threatScore: attackActive ? 0.942 : 0.04, cluster: '#SYBIL-487 Attack Ring', role: 'Wash Trader 1' },
    { id: 'node-11', label: 'ATK-SybilC', x: 88, y: 30, type: attackActive ? 'attack' : 'normal', address: '0x8C19...b3f2', balance: '83.1 ETH', threatScore: attackActive ? 0.954 : 0.05, cluster: '#SYBIL-487 Attack Ring', role: 'Wash Trader 2' },
    { id: 'node-12', label: 'ATK-SybilD', x: 73, y: 32, type: attackActive ? 'attack' : 'normal', address: '0x2A98...77e1', balance: '82.0 ETH', threatScore: attackActive ? 0.971 : 0.04, cluster: '#SYBIL-487 Attack Ring', role: 'Flash Swap Siphon' },
  ];

  // Recent Neutralized Threats Data
  const recentThreats: RecentThreat[] = [
    {
      id: '#SYBIL-487',
      type: 'Wash-Trading Ring',
      score: 96.1,
      action: 'Invariant Stabilize',
      txHash: '0x19a0...44df',
      pool: 'Uniswap v3 ETH/USDC',
      timestamp: '2m ago',
      status: 'stabilized',
      details: {
        gnnScore: 0.85,
        cnnScore: 0.92,
        fusedScore: 0.961,
        washVolume: '45.2 ETH',
        targetContract: 'DefensePool.sol',
      },
    },
    {
      id: '#WASH-489',
      type: 'Cyclic Volume Burst',
      score: 94.6,
      action: 'Counter-Swap (45.2 ETH)',
      txHash: '0x8f2a...c301',
      pool: 'Uniswap v3 ETH/USDC',
      timestamp: '6m ago',
      status: 'neutralized',
      details: {
        gnnScore: 0.91,
        cnnScore: 0.88,
        fusedScore: 0.946,
        washVolume: '88.5 ETH',
        targetContract: 'DefensePool.sol',
      },
    },
    {
      id: '#PUMP-488',
      type: 'Spoofed Liquidity Spike',
      score: 88.2,
      action: 'Liquidity Shield Lock',
      txHash: '0x33e1...91ba',
      pool: 'Aerodrome AERO/USDC',
      timestamp: '14m ago',
      status: 'intercepted',
      details: {
        gnnScore: 0.79,
        cnnScore: 0.86,
        fusedScore: 0.882,
        washVolume: '120.0 AERO',
        targetContract: 'DefensePool.sol',
      },
    },
    {
      id: '#SANDWICH-486',
      type: 'Cross-Block Toxic Arbitrage',
      score: 91.4,
      action: 'Priority Gas Front-Run',
      txHash: '0x7b11...902a',
      pool: 'Camelot ARB/USDC',
      timestamp: '28m ago',
      status: 'neutralized',
      details: {
        gnnScore: 0.88,
        cnnScore: 0.94,
        fusedScore: 0.914,
        washVolume: '32.8 ETH',
        targetContract: 'DefensePool.sol',
      },
    },
  ];

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Live WebSocket Connection with graceful fallback
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket('ws://127.0.0.1:8000/ws/threat-radar');

      ws.onopen = () => {
        const now = new Date().toTimeString().split(' ')[0];
        setLogs((prev) => [
          ...prev,
          { id: String(Date.now()), timestamp: now, type: 'system', message: 'WebSocket Live Stream connected to backend.' },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const now = new Date().toTimeString().split(' ')[0];
          setCurrentThreat(data.threat_score);
          if (data.gaf_image_base64) {
            setGafImage(data.gaf_image_base64);
          }
          const isAttack = data.threat_score > 0.9;
          setAttackActive(isAttack);
          if (isAttack) {
            setLogs((prev) => [
              ...prev.slice(-40),
              { id: String(Date.now()), timestamp: now, type: 'fusion', message: `ALERT: Fused Threat Anomaly detected: ${(data.threat_score * 100).toFixed(1)}%` },
              { id: String(Date.now() + 1), timestamp: now, type: 'agent', message: 'CrewAI Agent: Autonomous counter-swap dispatched to Base Sepolia mempool.' },
            ]);
          }
        } catch (e) {
          console.error(e);
        }
      };

      ws.onerror = () => {
        // Fallback gracefully without breaking UI
      };
    } catch {
      // Offline fallback
    }

    return () => {
      ws?.close();
    };
  }, []);

  // Trigger Simulated Attack
  const handleSimulateAttack = async () => {
    setIsSimulating(true);
    setToastMessage('⚠️ Injecting simulated wash-trading burst into mempool...');

    setAttackActive(true);
    setCurrentThreat(0.961);
    setSelectedNode(nodes[8]);
    setIsDrawerOpen(true);

    const now = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [
      ...prev.slice(-40),
      { id: String(Date.now()), timestamp: now, type: 'system', message: '--- ATTACK SIMULATION INITIATED ---' },
      { id: String(Date.now() + 1), timestamp: now, type: 'gnn', message: 'PyG GNN Alert: 4-Node cyclic wash topology identified. Ring score: 0.961' },
      { id: String(Date.now() + 2), timestamp: now, type: 'cnn', message: 'ResNet-18 Vision: Severe diagonal intensity on GAF polar matrix. P-value < 0.001' },
      { id: String(Date.now() + 3), timestamp: now, type: 'fusion', message: 'Multimodal Fusion: Sybil threat confidence verified at 96.1% (CRITICAL).' },
    ]);

    try {
      await fetch('http://127.0.0.1:8000/api/simulate-attack', { method: 'POST' });
    } catch {
      // Local simulated response is active
    }

    setTimeout(() => {
      setIsSimulating(false);
      setToastMessage('⚠️ Attack ring active! Click "Trigger Defense" to execute intercept.');
    }, 1500);
  };

  // Trigger Defense Intercept
  const handleTriggerDefense = () => {
    setIsDefending(true);
    const now = new Date().toTimeString().split(' ')[0];

    setToastMessage('🛡️ Executing autonomous defensive counter-trade via DefensePool.sol...');

    setTimeout(() => {
      setAttackActive(false);
      setCurrentThreat(0.125);
      setIsDefending(false);

      setStats((prev) => ({
        ...prev,
        attacksBlocked: prev.attacksBlocked + 1,
        bountiesPaid: Number((prev.bountiesPaid + 0.01).toFixed(2)),
        tvlProtected: prev.tvlProtected + 1800000,
      }));

      setLogs((prev) => [
        ...prev.slice(-40),
        { id: String(Date.now()), timestamp: now, type: 'defense', message: 'DefensePool.sol: executeDefense(0x91F4...e21B) confirmed on Base Sepolia in 38ms.' },
        { id: String(Date.now() + 1), timestamp: now, type: 'bounty', message: 'BountyManager.sol: 0.01 ETH micro-incentive distributed to operator wallet.' },
        { id: String(Date.now() + 2), timestamp: now, type: 'system', message: 'Pool invariant restored. Threat neutralized successfully.' },
      ]);

      setToastMessage('✅ Threat Neutralized! Defense confirmed on Base Sepolia in 38ms.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  // Click on a node in the graph
  const handleNodeClick = (node: NodeData) => {
    setSelectedNode(node);
    setSelectedThreat(null);
    setIsDrawerOpen(true);
  };

  // Click on a threat in the bottom strip
  const handleThreatClick = (threat: RecentThreat) => {
    setSelectedThreat(threat);
    // Find matching or closest node
    const matchingNode = nodes.find((n) => n.cluster.includes(threat.id)) || nodes[8];
    setSelectedNode(matchingNode);
    setIsDrawerOpen(true);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] mt-16 bg-[#020617] text-slate-100 flex overflow-hidden font-sans select-none relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[100] bg-slate-900/95 border border-cyan-500/50 rounded-xl px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(34,211,238,0.25)] flex items-center gap-3 text-xs md:text-sm text-slate-100 backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200">
          <span className="text-cyan-400 font-mono text-base">●</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
         1. LEFT ICON RAIL
         ========================================================================= */}
      <aside className="w-16 md:w-[70px] bg-slate-950/95 border-r border-slate-800 flex flex-col items-center py-4 justify-between z-40 flex-shrink-0 backdrop-blur-xl">
        {/* Brand Disc Logo Button */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={onDisconnect}
            title="GraphSentinel Home"
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:scale-105 transition-all"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="circle-disc-clip-rail">
                  <circle cx="12.5" cy="12.5" r="12.5" />
                </clipPath>
              </defs>
              <g clipPath="url(#circle-disc-clip-rail)">
                <circle cx="12.5" cy="12.5" r="12.5" fill="#ededed" />
                <path d="M12.5 1.5L20.5 9.5L12.5 15.5L4.5 9.5Z" fill="#050606" />
                <path d="M12.5 1.5L20.5 9.5L12.5 9.5Z" fill="#737778" />
                <path d="M12.5 1.5L4.5 9.5L12.5 9.5Z" fill="#fafafa" />
                <path d="M12.5 15.5L20.5 9.5L16.5 21.5Z" fill="#0a0b0b" />
                <path d="M12.5 15.5L4.5 9.5L8.5 21.5Z" fill="#737778" />
                <path d="M12.5 15.5L8.5 21.5L12.5 23.5L16.5 21.5Z" fill="#050606" />
              </g>
            </svg>
          </button>

          {/* Icon Rail Destinations */}
          <nav className="flex flex-col items-center gap-3">
            {/* Threat Radar */}
            <button
              onClick={() => setActiveRail('radar')}
              title="Threat Radar"
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                activeRail === 'radar'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <ShieldAlert size={20} />
            </button>

            {/* Analytics */}
            <button
              onClick={() => setActiveRail('analytics')}
              title="Predictive Analytics"
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                activeRail === 'analytics'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <BarChart3 size={20} />
            </button>

            {/* Protected Pools */}
            <button
              onClick={() => setActiveRail('pools')}
              title="Liquidity Pools"
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                activeRail === 'pools'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Layers size={20} />
            </button>

            {/* Bounties */}
            <button
              onClick={() => setActiveRail('bounties')}
              title="Operator Bounties"
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                activeRail === 'bounties'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Award size={20} />
            </button>

            {/* Settings */}
            <button
              onClick={() => setActiveRail('settings')}
              title="Defense Configuration"
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                activeRail === 'settings'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Settings size={20} />
            </button>
          </nav>
        </div>

        {/* Bottom Rail Actions */}
        <div className="flex flex-col items-center gap-4">
          {/* Agent status indicator */}
          <div
            title="Autonomous Sentinel: ARMED & INTERCEPTING"
            className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
          />

          {/* Exit / Return to Landing Page */}
          <button
            onClick={onDisconnect}
            title="Exit to Landing Page"
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* =========================================================================
         2. MAIN WORKSPACE (Header KPIs + Center Network Canvas + Bottom Strip)
         ========================================================================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* =====================================================================
           SUB-TOOLBAR: Target Pool & Live Operations HUD
           ===================================================================== */}
        <div className="h-12 bg-slate-900/90 border-b border-slate-800/80 px-4 md:px-5 flex items-center justify-between z-30 backdrop-blur-md flex-shrink-0">
          {/* Left: Pool Selector Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              <span className="text-xs font-mono font-medium text-slate-300">Live Pool:</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsPoolDropdownOpen(!isPoolDropdownOpen)}
                className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 flex items-center gap-2 transition-all shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{selectedPool}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {isPoolDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-xs font-mono">
                  {['Uniswap v3 ETH/USDC', 'Aerodrome AERO/USDC (Base)', 'Camelot ARB/USDC (Arbitrum)'].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setSelectedPool(p);
                        setIsPoolDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-800/90 transition-colors flex items-center justify-between ${
                        selectedPool === p ? 'text-cyan-400 font-semibold bg-cyan-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span>{p}</span>
                      {selectedPool === p && <CheckCircle2 size={13} className="text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hidden lg:inline-block">
              Base Sepolia Native
            </span>
          </div>

          {/* Center: Glanceable Numbers (Background facts, not competing cards) */}
          <div className="hidden xl:flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Protected:</span>
              <span className="text-slate-100 font-bold">${(stats.tvlProtected / 1000000).toFixed(2)}M</span>
              <span className="text-emerald-400 text-[10px]">(+$1.8M)</span>
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Blocked:</span>
              <span className="text-cyan-400 font-bold">{stats.attacksBlocked.toLocaleString()}</span>
              <span className="text-slate-500 text-[10px]">(100% Auto)</span>
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Bounties:</span>
              <span className="text-amber-400 font-bold">{stats.bountiesPaid} ETH</span>
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Agent:</span>
              <span className="text-emerald-400 font-semibold">ARMED</span>
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Threat:</span>
              <span className={`font-bold ${attackActive ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                {(currentThreat * 100).toFixed(1)}% {attackActive ? '(CRITICAL)' : '(NORMAL)'}
              </span>
            </div>
          </div>

          {/* Right: Quick Action Buttons & Wallet */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateAttack}
              disabled={isSimulating}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <AlertTriangle size={13} className="text-rose-400" />
              <span>{isSimulating ? 'Injecting...' : 'Simulate Attack'}</span>
            </button>

            <button
              onClick={handleTriggerDefense}
              disabled={isDefending}
              className="bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(34,211,238,0.15)]"
            >
              <Zap size={13} className="text-cyan-400" />
              <span>{isDefending ? 'Intercepting...' : 'Trigger Defense'}</span>
            </button>

            {/* Wallet Button */}
            <button
              onClick={onOpenWalletModal}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono flex items-center gap-2 transition-colors"
            >
              <Wallet size={13} className="text-cyan-400" />
              <span>{userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Connect Wallet'}</span>
            </button>

            {/* Context Drawer Toggle */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              title={isDrawerOpen ? 'Collapse Inspector' : 'Expand Inspector'}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isDrawerOpen
                  ? 'bg-slate-800 border-slate-700 text-cyan-400'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 animate-pulse'
              }`}
            >
              <Activity size={16} />
            </button>
          </div>
        </div>

        {/* =====================================================================
           CENTER BODY: Subheader + Hero Force Graph Canvas + Context Drawer OR Subviews
           ===================================================================== */}
        {activeRail === 'radar' && (
          <div className="flex-1 flex overflow-hidden relative">
            {/* Main Network Graph Canvas (The Hero: answers "is something wrong right now") */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-[#040810]">
              {/* Graph Header Overlay */}
              <div className="absolute top-4 left-6 z-20 pointer-events-none flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm md:text-base font-semibold text-slate-200 tracking-tight uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    Live Wallet Network Topology
                  </h2>
                  <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                    PyG EdgeConv Ring Topology
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Click any cluster or node to inspect live multimodal reasoning in the context drawer.
                </p>
              </div>

              {/* Graph Legend Overlay */}
              <div className="absolute top-4 right-6 z-20 pointer-events-none flex items-center gap-4 text-xs font-mono bg-slate-950/70 border border-slate-800/80 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" /> Normal LP
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" /> Suspicious
                </span>
                <span className="flex items-center gap-1.5 text-rose-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e] animate-pulse" /> Attack Ring
                </span>
              </div>

              {/* SVG FORCE GRAPH VISUALIZER */}
              <div className="flex-1 w-full h-full relative cursor-crosshair">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <pattern id="radarGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34, 211, 238, 0.04)" strokeWidth="0.8" />
                    </pattern>
                    <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(34, 211, 238, 0.06)" />
                      <stop offset="100%" stopColor="rgba(2, 6, 23, 0)" />
                    </radialGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#radarGridPattern)" />
                  <rect width="100%" height="100%" fill="url(#radarCenterGlow)" />

                  {/* Normal LP Edge Connections */}
                  <g stroke="rgba(34, 211, 238, 0.3)" strokeWidth="1.2">
                    <line x1="22%" y1="35%" x2="34%" y2="26%" />
                    <line x1="34%" y1="26%" x2="44%" y2="40%" />
                    <line x1="44%" y1="40%" x2="28%" y2="55%" />
                    <line x1="28%" y1="55%" x2="22%" y2="35%" />
                    <line x1="44%" y1="40%" x2="48%" y2="62%" />
                  </g>

                  {/* Bridge to Suspicious Cluster */}
                  <g stroke="rgba(251, 191, 36, 0.35)" strokeWidth="1.4" strokeDasharray="4 3">
                    <line x1="48%" y1="62%" x2="62%" y2="50%" />
                    <line x1="62%" y1="50%" x2="74%" y2="44%" />
                    <line x1="74%" y1="44%" x2="68%" y2="66%" />
                    <line x1="68%" y1="66%" x2="62%" y2="50%" />
                  </g>

                  {/* Attack Ring Loop */}
                  {attackActive ? (
                    <g stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="6 4">
                      <line x1="68%" y1="18%" x2="84%" y2="14%" className="animate-pulse" />
                      <line x1="84%" y1="14%" x2="88%" y2="30%" className="animate-pulse" />
                      <line x1="88%" y1="30%" x2="73%" y2="32%" className="animate-pulse" />
                      <line x1="73%" y1="32%" x2="68%" y2="18%" className="animate-pulse" />
                    </g>
                  ) : (
                    <g stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1">
                      <line x1="68%" y1="18%" x2="84%" y2="14%" />
                      <line x1="84%" y1="14%" x2="88%" y2="30%" />
                      <line x1="88%" y1="30%" x2="73%" y2="32%" />
                      <line x1="73%" y1="32%" x2="68%" y2="18%" />
                    </g>
                  )}
                </svg>

                {/* Render Network Nodes */}
                {nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isAttack = node.type === 'attack';
                  const isSuspicious = node.type === 'suspicious';

                  let dotColor = '#22d3ee';
                  let glowColor = 'rgba(34, 211, 238, 0.4)';
                  if (isAttack) {
                    dotColor = '#f43f5e';
                    glowColor = 'rgba(244, 63, 94, 0.6)';
                  } else if (isSuspicious) {
                    dotColor = '#fbbf24';
                    glowColor = 'rgba(251, 191, 36, 0.5)';
                  }

                  return (
                    <div
                      key={node.id}
                      onClick={() => handleNodeClick(node)}
                      style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 transition-transform duration-200 hover:scale-125"
                    >
                      {isSelected && (
                        <div className="absolute -inset-2.5 rounded-full border border-cyan-400 animate-spin [animation-duration:8s] pointer-events-none" />
                      )}

                      <div
                        style={{
                          backgroundColor: dotColor,
                          boxShadow: `0 0 16px ${glowColor}`,
                        }}
                        className={`rounded-full border-2 border-slate-950 flex items-center justify-center transition-all ${
                          isAttack ? 'w-6 h-6 animate-pulse' : 'w-4 h-4'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>

                      <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-[11px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap text-slate-200 z-30">
                        <div className="font-semibold text-cyan-400">{node.label}</div>
                        <div>{node.address}</div>
                        <div className={isAttack ? 'text-rose-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'}>
                          Threat: {(node.threatScore * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 5. BOTTOM HORIZONTAL SCAN STRIP */}
              <div className="h-16 bg-slate-950/90 border-t border-slate-800/80 px-5 flex items-center gap-4 z-20 backdrop-blur-md flex-shrink-0 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-2 flex-shrink-0 text-xs font-mono text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <span className="font-semibold text-slate-200 uppercase tracking-wider">Recent Neutralized:</span>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {recentThreats.map((threat) => {
                    const isSelected = selectedThreat?.id === threat.id;
                    const isCritical = threat.score >= 90;

                    return (
                      <button
                        key={threat.id}
                        onClick={() => handleThreatClick(threat)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                            : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-bold text-slate-100">{threat.id}</span>
                        <span className={`font-semibold ${isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
                          {threat.score}%
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-emerald-400">{threat.action}</span>
                        <span className="text-slate-500 text-[10px] hidden sm:inline">{threat.txHash}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. CONTEXT INSPECTOR DRAWER */}
            <div
              className={`w-full sm:w-[420px] lg:w-[440px] bg-slate-900/95 border-l border-slate-800 flex flex-col h-full z-30 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
                isDrawerOpen ? 'translate-x-0' : 'translate-x-full absolute right-0'
              }`}
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  <h3 className="font-semibold text-sm text-slate-100 tracking-tight uppercase">
                    Context Inspector
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                    Detail on Demand
                  </span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
                {/* Node Card */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>{selectedThreat?.id || selectedNode?.label || '#SYBIL-487'}</span>
                      <span className="text-slate-400 font-normal text-xs">({selectedNode?.cluster || 'Sybil Loop'})</span>
                    </div>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                        (selectedThreat?.score || (selectedNode?.threatScore ? selectedNode.threatScore * 100 : 96.1)) > 80
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {(selectedThreat?.score || (selectedNode?.threatScore ? selectedNode.threatScore * 100 : 96.1)).toFixed(1)}% THREAT
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-slate-800/60">
                    <div>
                      <span className="text-slate-500">Address:</span>
                      <p className="text-cyan-400 truncate">{selectedNode?.address || '0x91F4...e21B'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Classification:</span>
                      <p className="text-slate-300 font-semibold uppercase">{selectedNode?.role || 'Sybil Coordinator'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Balance:</span>
                      <p className="text-slate-200">{selectedNode?.balance || '82.4 ETH'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Target Contract:</span>
                      <p className="text-emerald-400 font-semibold">DefensePool.sol</p>
                    </div>
                  </div>
                </div>

                {/* Multimodal Reasoning */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Cpu size={14} className="text-cyan-400" />
                      Multimodal AI Reasoning
                    </span>
                    <span className="font-mono text-[11px] text-cyan-400">GNN + CNN Fusion</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center font-mono pt-1">
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">PyG GNN</span>
                      <span className="text-sm font-bold text-sky-400">85.0%</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">ResNet CNN</span>
                      <span className="text-sm font-bold text-rose-400">92.0%</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Fused Action</span>
                      <span className="text-sm font-bold text-emerald-400">DEFEND</span>
                    </div>
                  </div>
                </div>

                {/* GAF Heatmap */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                      <Activity size={14} className="text-rose-400" />
                      GAF Heatmap (pyts Polar Matrix)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                      Anomaly: {currentThreat.toFixed(3)}
                    </span>
                  </div>

                  <div className="flex gap-3 items-center">
                    {gafImage ? (
                      <img
                        src={`data:image/png;base64,${gafImage}`}
                        alt="GAF Polar Heatmap"
                        className="w-24 h-24 rounded-lg border border-slate-700 flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-lg border border-slate-700 bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 flex-shrink-0 relative overflow-hidden flex items-center justify-center shadow-inner">
                        <div className="absolute inset-0 opacity-80 grid grid-cols-4 grid-rows-4">
                          <div className="bg-purple-600/70" />
                          <div className="bg-purple-700/80" />
                          <div className="bg-rose-600/90" />
                          <div className="bg-amber-500/80" />
                          <div className="bg-purple-800/70" />
                          <div className="bg-rose-500/90" />
                          <div className="bg-amber-400/90" />
                          <div className="bg-purple-600/70" />
                          <div className="bg-rose-700/80" />
                          <div className="bg-amber-400/90" />
                          <div className="bg-purple-900/80" />
                          <div className="bg-indigo-900/70" />
                          <div className="bg-amber-500/80" />
                          <div className="bg-purple-600/70" />
                          <div className="bg-indigo-800/70" />
                          <div className="bg-indigo-950/80" />
                        </div>
                        <span className="relative z-10 text-[9px] font-mono text-white/90 bg-black/60 px-1 rounded">
                          2D Polar
                        </span>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 leading-relaxed font-sans space-y-1">
                      <p className="text-slate-200 font-medium">Temporal Swap Burst Projection</p>
                      <p>
                        Converts 1-second price delta vectors into angular matrices. Dense diagonal bands indicate wash-volume collusion.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terminal Feed */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Agent Terminal Feed
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">Live Reasoning</span>
                  </div>

                  <div className="bg-black/90 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] leading-relaxed h-44 overflow-y-auto space-y-1.5 select-text">
                    {logs.map((log) => {
                      let col = 'text-slate-400';
                      if (log.type === 'gnn') col = 'text-sky-400';
                      if (log.type === 'cnn') col = 'text-amber-400';
                      if (log.type === 'fusion') col = 'text-rose-400 font-bold';
                      if (log.type === 'agent') col = 'text-purple-400';
                      if (log.type === 'defense') col = 'text-emerald-400 font-semibold';
                      if (log.type === 'bounty') col = 'text-cyan-400';

                      return (
                        <div key={log.id} className="flex gap-2">
                          <span className="text-slate-600 text-[10px] flex-shrink-0">[{log.timestamp}]</span>
                          <span className={col}>{log.message}</span>
                        </div>
                      );
                    })}
                    <div ref={terminalEndRef} />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleSimulateAttack}
                    disabled={isSimulating}
                    className="flex-1 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <AlertTriangle size={14} className="text-rose-400" />
                    <span>{isSimulating ? 'Injecting Attack...' : 'Simulate Attack'}</span>
                  </button>

                  <button
                    onClick={handleTriggerDefense}
                    disabled={isDefending}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
                  >
                    <Zap size={14} className="text-slate-950" />
                    <span>{isDefending ? 'Intercepting...' : 'Trigger Defense'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
           SUBVIEW: ANALYTICS
           ===================================================================== */}
        {activeRail === 'analytics' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#040810] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
                  <BarChart3 className="text-cyan-400" size={20} />
                  Predictive Defense Intelligence & Benchmarks
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Autonomous latency tracking, precision-recall metrics, and TVL capital efficiency.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                Base Sepolia Testnet
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                <span className="text-slate-400 text-xs">PyG GNN v2.4 Accuracy</span>
                <div className="text-2xl font-bold text-cyan-400 mt-1">98.4%</div>
                <span className="text-[11px] text-emerald-400">EdgeConv Ring Topology Precision</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                <span className="text-slate-400 text-xs">ResNet-18 Vision Recall</span>
                <div className="text-2xl font-bold text-rose-400 mt-1">96.7%</div>
                <span className="text-[11px] text-slate-400">GAF Polar Anomaly Detection</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                <span className="text-slate-400 text-xs">Mean On-Chain Intercept</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">38ms</div>
                <span className="text-[11px] text-cyan-400">Sub-Block Defense Execution</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                  <TrendingUp size={16} className="text-cyan-400" />
                  Attack Vector Distribution (Past 30 Days)
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Wash-Trading Collusion Rings</span>
                      <span className="text-rose-400">54.2%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '54.2%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Toxic Arbitrage & MEV Sandwiches</span>
                      <span className="text-amber-400">26.8%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '26.8%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Spoofed Invariant Slippage Exploits</span>
                      <span className="text-cyan-400">19.0%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: '19.0%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Cumulative Loss Prevention
                </h3>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Capital Preserved:</span>
                    <span className="text-slate-100 font-bold">$42.85M USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attacks Defended:</span>
                    <span className="text-cyan-400 font-bold">1,429 incidents</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">False Positive Ratio:</span>
                    <span className="text-emerald-400 font-bold">0.012%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Gas per Intercept:</span>
                    <span className="text-amber-400 font-bold">0.0028 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
           SUBVIEW: POOLS
           ===================================================================== */}
        {activeRail === 'pools' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#040810] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
                  <Layers className="text-cyan-400" size={20} />
                  Monitored Liquidity Pools & Invariant Safeguards
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Autonomous liquidity protection active across Base Sepolia DEX protocols.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: 'Uniswap v3 ETH/USDC', tvl: '$24.80M', status: 'Optimal', fee: '0.05%', def: 'DefensePool.sol', active: true },
                { name: 'Aerodrome AERO/USDC (Base)', tvl: '$12.50M', status: 'Optimal', fee: '0.30%', def: 'DefensePool.sol', active: true },
                { name: 'Camelot ARB/USDC (Arbitrum)', tvl: '$5.55M', status: 'Optimal', fee: '0.25%', def: 'DefensePool.sol', active: true },
              ].map((p) => (
                <div key={p.name} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{p.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                    <div className="flex justify-between">
                      <span>Total Value Locked:</span>
                      <span className="text-cyan-400 font-semibold">{p.tvl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pool Fee Tier:</span>
                      <span className="text-slate-200">{p.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Smart Interceptor:</span>
                      <span className="text-emerald-400">{p.def}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
           SUBVIEW: BOUNTIES
           ===================================================================== */}
        {activeRail === 'bounties' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#040810] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
                  <Award className="text-amber-400" size={20} />
                  BountyManager.sol On-Chain Incentives
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Autonomous gas subsidies and micro-bounties paid to decentralized sentinel operators.
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-slate-400">Total Bounties Dispersed:</span>
                <div className="text-xl font-bold text-amber-400">{stats.bountiesPaid} ETH</div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="p-3.5">Threat ID</th>
                    <th className="p-3.5">Recipient Operator</th>
                    <th className="p-3.5">Defense Action</th>
                    <th className="p-3.5">Bounty Payout</th>
                    <th className="p-3.5">On-Chain Tx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="p-3.5 font-bold text-slate-100">#SYBIL-487</td>
                    <td className="p-3.5 text-cyan-400">0x71C8...39FA</td>
                    <td className="p-3.5 text-emerald-400">Invariant Stabilize</td>
                    <td className="p-3.5 text-amber-400 font-bold">0.010 ETH</td>
                    <td className="p-3.5 text-slate-400">0x19a0...44df</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-100">#WASH-489</td>
                    <td className="p-3.5 text-cyan-400">0x34A1...92BC</td>
                    <td className="p-3.5 text-emerald-400">Counter-Swap Intercept</td>
                    <td className="p-3.5 text-amber-400 font-bold">0.015 ETH</td>
                    <td className="p-3.5 text-slate-400">0x8f2a...c301</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-100">#PUMP-488</td>
                    <td className="p-3.5 text-cyan-400">0x99F2...77E1</td>
                    <td className="p-3.5 text-emerald-400">Liquidity Shield Lock</td>
                    <td className="p-3.5 text-amber-400 font-bold">0.010 ETH</td>
                    <td className="p-3.5 text-slate-400">0x33e1...91ba</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =====================================================================
           SUBVIEW: SETTINGS
           ===================================================================== */}
        {activeRail === 'settings' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#040810] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
                  <Sliders className="text-cyan-400" size={20} />
                  Defense Policy & AI Parameter Controls
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Fine-tune machine learning thresholds and autonomous execution constraints.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-sm text-slate-200">GNN Topological Anomaly Cutoff</h3>
                <p className="text-slate-400 text-[11px] font-sans">
                  Controls the EdgeConv ring detection sensitivity for wash-trading cycle detection.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-cyan-400 font-bold">Current: 0.850</span>
                  <span className="text-slate-500">Default: 0.850</span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-sm text-slate-200">ResNet-18 Heatmap Threshold</h3>
                <p className="text-slate-400 text-[11px] font-sans">
                  Confidence score required from the Gramian Angular Field polar projection to flag anomalies.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-rose-400 font-bold">Current: 0.900</span>
                  <span className="text-slate-500">Default: 0.900</span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-sm text-slate-200">Autonomous Counter-Trade Execution</h3>
                <p className="text-slate-400 text-[11px] font-sans">
                  Allows CrewAI agent to broadcast signed defense transactions directly to Base Sepolia mempool.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-emerald-400 font-bold">STATUS: ENABLED</span>
                  <span className="text-cyan-400 text-[11px]">Zero Human In The Loop</span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-sm text-slate-200">Contract Verification</h3>
                <p className="text-slate-400 text-[11px] font-sans">
                  Base Sepolia audited smart contract endpoints.
                </p>
                <div className="space-y-1 text-[11px] text-slate-400 pt-1">
                  <div>DefensePool: <span className="text-cyan-400">0x8F32...b109</span></div>
                  <div>BountyManager: <span className="text-amber-400">0x2A19...c442</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatRadarDashboard;
