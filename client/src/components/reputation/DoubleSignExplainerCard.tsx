import React, { useState } from 'react';
import {
  Database,
  Blocks,
  KeyRound,
  ExternalLink,
  Zap,
  Code,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  BASESCAN_CONTRACT_URL,
  REPUTATION_CONTRACT_ADDRESS,
  BASE_SEPOLIA_CHAIN_ID,
  queryOnChainTrustScore,
  REPUTATION_ABI,
} from '../../lib/reputationService';

export const DoubleSignExplainerCard: React.FC = () => {
  const [isAbiExpanded, setIsAbiExpanded] = useState<boolean>(false);
  const [rpcStatus, setRpcStatus] = useState<{
    testing: boolean;
    result: string | null;
  }>({ testing: false, result: null });

  const handleTestRpc = async () => {
    setRpcStatus({ testing: true, result: null });
    const res = await queryOnChainTrustScore(REPUTATION_CONTRACT_ADDRESS);
    setRpcStatus({
      testing: false,
      result:
        res.error
          ? `RPC Warning: ${res.error}`
          : `✓ Base Sepolia RPC responded: getScore(${REPUTATION_CONTRACT_ADDRESS.slice(0, 10)}...) = ${res.score ?? 0} [Chain ID: ${BASE_SEPOLIA_CHAIN_ID}]`,
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-xl space-y-5 shadow-xl">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
              Hybrid Off-Chain / On-Chain Architecture
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                LIVE ON BASE SEPOLIA
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Decentralized double-signing pipeline optimizing gas performance while guaranteeing immutable trust
            </p>
          </div>
        </div>

        {/* Contract Link Button */}
        <div className="flex items-center gap-2">
          <a
            href={BASESCAN_CONTRACT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 hover:border-cyan-400/60 text-cyan-300 font-mono text-xs transition-all shadow-sm"
          >
            <span>Contract: 0x6316...000C</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* 3-Column Architecture Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Pillar 1: Off-Chain */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                <Database size={15} className="text-amber-400" />
                Off-Chain (Heavy Data)
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                Node.js / Mongo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Stores full markdown review text, timestamps, transaction context, and pool telemetry without incurring L2 gas fees.
            </p>
          </div>

          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 text-[10px] text-slate-300 space-y-1">
            <div className="text-amber-400/90 font-semibold">• Review text & comments</div>
            <div className="text-slate-400">• High-frequency timestamps</div>
            <div className="text-slate-400">• Pool invariant metrics</div>
          </div>
        </div>

        {/* Pillar 2: Double Signing Protocol */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30 flex flex-col justify-between space-y-3 shadow-[0_0_15px_rgba(34,211,238,0.08)]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <KeyRound size={15} className="text-cyan-400" />
                Double Signing Protocol
              </span>
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                2-Key Receipt
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Both parties must sign receipt: Reviewer signs voucher (Key 1), then Admin Relayer co-signs (Key 2) to broadcast.
            </p>
          </div>

          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 text-[10px] text-slate-300 space-y-1">
            <div className="text-cyan-400 font-semibold">• 1. Reviewer Client Signature</div>
            <div className="text-emerald-400 font-semibold">• 2. Admin Relayer Blockchain Sig</div>
            <div className="text-slate-400">• Anti-Sybil cryptographic sealing</div>
          </div>
        </div>

        {/* Pillar 3: On-Chain Source of Truth */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                <Blocks size={15} className="text-emerald-400" />
                On-Chain (Source of Truth)
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Base Sepolia: 84532
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Stores only the final, aggregated 0–100 integer trust score in immutable storage, guaranteeing cryptographic verifiability.
            </p>
          </div>

          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 text-[10px] text-slate-300 space-y-1">
            <div className="text-emerald-400 font-semibold">• getScore(address) → uint256</div>
            <div className="text-slate-400">• Immutable L2 state anchor</div>
            <div className="text-slate-400">• Auditable on BaseScan</div>
          </div>
        </div>
      </div>

      {/* Interactive Blockchain Configuration Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            Network: <span className="text-cyan-400 font-semibold">Base Sepolia (Chain ID: {BASE_SEPOLIA_CHAIN_ID})</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            Contract: <span className="text-slate-200 select-all">{REPUTATION_CONTRACT_ADDRESS}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestRpc}
            disabled={rpcStatus.testing}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw size={12} className={rpcStatus.testing ? 'animate-spin' : ''} />
            {rpcStatus.testing ? 'Querying Base Sepolia...' : 'Test On-Chain RPC Query'}
          </button>

          <button
            type="button"
            onClick={() => setIsAbiExpanded(!isAbiExpanded)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors flex items-center gap-1"
          >
            <Code size={12} />
            {isAbiExpanded ? 'Hide ABI' : 'View Read ABI'}
          </button>
        </div>
      </div>

      {/* Live RPC Test Result Banner */}
      {rpcStatus.result && (
        <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
            <span>{rpcStatus.result}</span>
          </div>
          <button
            onClick={() => setRpcStatus({ testing: false, result: null })}
            className="text-slate-500 hover:text-slate-300 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ABI JSON Viewer Dropdown */}
      {isAbiExpanded && (
        <div className="p-3 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-cyan-400/90 overflow-x-auto select-all animate-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] text-slate-500 mb-1">// Read-Only ABI for getScore(_user)</div>
          <code>{JSON.stringify(REPUTATION_ABI, null, 2)}</code>
        </div>
      )}
    </div>
  );
};

export const DualSignExplainerCard = DoubleSignExplainerCard;
export default DoubleSignExplainerCard;
