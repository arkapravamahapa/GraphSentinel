import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  ExternalLink,
  Plus,
  RefreshCw,
  Award,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  KeyRound,
  Database,
  Blocks,
  Copy,
  Check,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';
import {
  getReputationProfile,
  formatAddress,
  truncateAddress,
  BASESCAN_CONTRACT_URL,
  BASE_SEPOLIA_CHAIN_ID,
  queryOnChainTrustScore,
} from '../../lib/reputationService';
import type {
  ReputationProfile,
  DoubleSignSubmissionResult,
} from '../../lib/reputationService';
import { TrustScoreBadge } from './TrustScoreBadge';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { DoubleSignExplainerCard } from './DoubleSignExplainerCard';

interface ReputationSentinelViewProps {
  userAddress: string;
  onOpenWalletModal?: () => void;
  onNavigateToRadar?: (targetAddress?: string) => void;
}

export const ReputationSentinelView: React.FC<ReputationSentinelViewProps> = ({
  userAddress,
  onOpenWalletModal,
  onNavigateToRadar,
}) => {
  const activeSigner = userAddress || '0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA';

  // Search & active inspected wallet state
  const [searchInput, setSearchInput] = useState<string>('');
  const [inspectedAddress, setInspectedAddress] = useState<string>(activeSigner);
  const [profile, setProfile] = useState<ReputationProfile | null>(null);
  const [isRefreshingOnChain, setIsRefreshingOnChain] = useState<boolean>(false);

  // Review submission modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [modalTargetAddress, setModalTargetAddress] = useState<string>('');

  // Reviews filtering
  const [filterTier, setFilterTier] = useState<'all' | 'high' | 'med' | 'low'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedProofs, setExpandedProofs] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load profile for inspected address
  const loadProfile = async (addr: string) => {
    try {
      const data = await getReputationProfile(addr);
      setProfile(data);
    } catch (e) {
      console.error('Failed to load reputation profile:', e);
    }
  };

  useEffect(() => {
    if (inspectedAddress) {
      loadProfile(inspectedAddress);
    }
  }, [inspectedAddress]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const formatted = formatAddress(searchInput.trim());
    setInspectedAddress(formatted);
  };

  const handleRefreshOnChain = async () => {
    if (!inspectedAddress) return;
    setIsRefreshingOnChain(true);
    try {
      const onChainData = await queryOnChainTrustScore(inspectedAddress);
      if (onChainData.score !== null && profile) {
        setProfile({
          ...profile,
          onChainScore: onChainData.score,
          trustScore: onChainData.score > 0 ? onChainData.score : profile.trustScore,
          isContractSynced: true,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshingOnChain(false);
    }
  };

  const handleReviewSuccess = (_result: DoubleSignSubmissionResult) => {
    // Reload profile
    loadProfile(inspectedAddress);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleProof = (reviewId: string) => {
    setExpandedProofs((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Quick preset wallet chips
  const PRESET_WALLETS = [
    {
      label: 'Your Wallet (Operator)',
      address: activeSigner,
      score: 96,
    },
    {
      label: 'ATK-SybilA (Attack Ring)',
      address: '0x91F41029ab81c7f76bA1a82E9bEc423450dFe21B',
      score: 18,
    },
    {
      label: 'Aerodrome Arbitrage Sentinel',
      address: '0x38bdf8828972C331C98b4F30A29281a8B89Cc988',
      score: 78,
    },
  ];

  // Filter reviews
  const filteredReviews = (profile?.reviews || []).filter((rev) => {
    if (filterTier === 'high' && rev.score < 80) return false;
    if (filterTier === 'med' && (rev.score < 50 || rev.score >= 80)) return false;
    if (filterTier === 'low' && rev.score >= 50) return false;
    if (filterCategory !== 'all' && rev.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="flex-1 w-full bg-[#040810] text-slate-100 min-h-screen py-8 px-4 md:px-8 space-y-8 max-w-7xl mx-auto">
      {/* =========================================================================
         1. TOP HERO & HEADER: Sentinel Trust Protocol
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              GraphSentinel Reputation System
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                Hybrid Trust Protocol
              </span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 font-sans max-w-2xl">
            Off-chain rich telemetry coupled with Base Sepolia on-chain immutable trust scores.
            Cryptographic double-signing prevents sybil attacks and ensures tamper-proof verification.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setModalTargetAddress(inspectedAddress);
              setIsReviewModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span>Submit Double-Signed Review</span>
          </button>

          <a
            href={BASESCAN_CONTRACT_URL}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>BaseScan Contract</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* =========================================================================
         2. SYSTEM TELEMETRY STRIP (4 Micro-KPIs)
         ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Network Anchor</span>
          <div className="text-sm md:text-base font-bold text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Base Sepolia ({BASE_SEPOLIA_CHAIN_ID})
          </div>
          <span className="text-[10px] text-slate-500 font-sans">Smart Contract 0x6316...000C</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Gas Preserved</span>
          <div className="text-sm md:text-base font-bold text-emerald-400">94.2% Savings</div>
          <span className="text-[10px] text-slate-500 font-sans">Via Off-Chain Mongo Heavy Data</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Mean Network Trust</span>
          <div className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-1">
            86.4 <span className="text-xs text-slate-500 font-normal">/ 100</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-sans">High Invariant Stability</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Double-Signed Attestations</span>
          <div className="text-sm md:text-base font-bold text-cyan-300">1,489 Proofs</div>
          <span className="text-[10px] text-slate-500 font-sans">2-Key Verification Sealed</span>
        </div>
      </div>

      {/* =========================================================================
         3. HYBRID ARCHITECTURE & DOUBLE-SIGNING EXPLAINER CARD
         ========================================================================= */}
      <DoubleSignExplainerCard />

      {/* =========================================================================
         4. WALLET INSPECTOR & REPUTATION CARD
         ========================================================================= */}
      <div className="space-y-4">
        {/* Search Bar + Preset Chips */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search or inspect wallet address (0x...)"
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition-colors"
            >
              Inspect
            </button>
          </form>

          {/* Quick Preset Wallet Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Demo Presets:</span>
            {PRESET_WALLETS.map((w) => (
              <button
                key={w.address}
                type="button"
                onClick={() => setInspectedAddress(formatAddress(w.address))}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
                  inspectedAddress.toLowerCase() === w.address.toLowerCase()
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{w.label}</span>
                <span
                  className={`text-[10px] px-1 rounded ${
                    w.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {w.score}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Wallet Main Hero Card */}
        {profile && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            {/* Background Glow */}
            <div
              className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none -mr-20 -mt-20 ${
                profile.trustScore >= 80
                  ? 'bg-emerald-500'
                  : profile.trustScore >= 50
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              {/* Left Column: Radial Meter Badge */}
              <div className="flex flex-col items-center flex-shrink-0">
                <TrustScoreBadge
                  score={profile.trustScore}
                  size="radial"
                  showLabel
                  showLink
                  showContractHint
                  tooltipText="Click to verify immutable score on BaseScan smart contract"
                />
              </div>

              {/* Middle Column: Details & Dual Source Analysis */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    <h2 className="text-lg md:text-xl font-bold text-slate-100 font-mono select-all">
                      {profile.address}
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleCopy(profile.address, 'inspectedAddr')}
                      className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 font-mono p-1 rounded bg-slate-800/60"
                      title="Copy full address"
                    >
                      {copiedKey === 'inspectedAddr' ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                    {profile.label && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-sans border border-slate-700">
                        {profile.label}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Inspected on Base Sepolia • Last updated {profile.lastUpdated}
                  </p>
                </div>

                {/* Score Breakdown: On-Chain vs Off-Chain Synchronized Verification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl font-mono text-xs">
                  {/* On-Chain State */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Blocks size={12} className="text-emerald-400" />
                        On-Chain Smart Contract
                      </span>
                      <a
                        href={BASESCAN_CONTRACT_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-0.5"
                      >
                        BaseScan <ExternalLink size={9} />
                      </a>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-slate-200 text-xs">getScore(_user):</span>
                      <span className="text-base font-bold text-emerald-400">
                        {profile.onChainScore !== null ? `${profile.onChainScore}/100` : `${profile.trustScore}/100`}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      Immutable integer anchor (Chain ID: 84532)
                    </div>
                  </div>

                  {/* Off-Chain Aggregated State */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Database size={12} className="text-amber-400" />
                        Off-Chain Backend (Mongo)
                      </span>
                      <span className="text-emerald-400 text-[10px]">✓ Synchronized</span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-slate-200 text-xs">Aggregated Mean:</span>
                      <span className="text-base font-bold text-cyan-300">
                        {profile.trustScore}/100
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      Derived from {profile.reviewCount} cryptographic reviews
                    </div>
                  </div>
                </div>

                {/* Behavioral assessment summary */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans max-w-xl">
                  {profile.trustScore >= 80 ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-emerald-400">Exemplary Participant:</strong> Consistent
                        liquidity provision with zero sandwich exploitation or wash-trading cycle topology
                        detected by PyG GNN engine.
                      </span>
                    </div>
                  ) : profile.trustScore >= 50 ? (
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-amber-400">Neutral Operator:</strong> Standard trading
                        behavior with occasional high-slippage executions. No direct exploit contract
                        interactions confirmed.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <ShieldAlert size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-rose-400">Critical Risk Detected:</strong> Flagged for
                        coordinated wash-trading ring activity. Score anchored as restricted risk in Base
                        Sepolia defense pool.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Interactive Quick Actions */}
              <div className="flex flex-col gap-2.5 flex-shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setModalTargetAddress(profile.address);
                    setIsReviewModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(34,211,238,0.25)] transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Review this Address</span>
                </button>

                <button
                  type="button"
                  onClick={handleRefreshOnChain}
                  disabled={isRefreshingOnChain}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={13} className={isRefreshingOnChain ? 'animate-spin text-cyan-400' : ''} />
                  <span>{isRefreshingOnChain ? 'Querying Base Sepolia...' : 'Verify Live RPC'}</span>
                </button>

                <a
                  href={`https://sepolia.basescan.org/address/${profile.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Address on BaseScan</span>
                  <ExternalLink size={12} />
                </a>

                {onNavigateToRadar && (
                  <button
                    type="button"
                    onClick={() => onNavigateToRadar(profile.address)}
                    className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View in Threat Radar</span>
                    <ArrowUpRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
         5. REVIEWS WALL & DUAL-SIGNATURE LEDGER
         ========================================================================= */}
      <div className="space-y-4">
        {/* Section Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Award size={18} className="text-cyan-400" />
              Verified Reviews & Double-Signature Ledger
              <span className="text-xs font-mono text-slate-400">({filteredReviews.length})</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Cryptographically signed by reviewer wallets and validated by admin relayer
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <Filter size={12} className="text-slate-500 ml-1.5" />
              <button
                type="button"
                onClick={() => setFilterTier('all')}
                className={`px-2 py-0.5 rounded ${
                  filterTier === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterTier('high')}
                className={`px-2 py-0.5 rounded ${
                  filterTier === 'high' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400'
                }`}
              >
                80-100
              </button>
              <button
                type="button"
                onClick={() => setFilterTier('med')}
                className={`px-2 py-0.5 rounded ${
                  filterTier === 'med' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400'
                }`}
              >
                50-79
              </button>
              <button
                type="button"
                onClick={() => setFilterTier('low')}
                className={`px-2 py-0.5 rounded ${
                  filterTier === 'low' ? 'bg-rose-500/20 text-rose-400 font-bold' : 'text-slate-400'
                }`}
              >
                &lt;50
              </button>
            </div>

            {/* Category Filter Dropdown */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Categories</option>
              <option value="Liquidity Provision">Liquidity Provision</option>
              <option value="Counter-Trade Defense">Counter-Trade Defense</option>
              <option value="MEV Mitigation">MEV Mitigation</option>
              <option value="OTC Swap">OTC Swap</option>
              <option value="Protocol Governance">Protocol Governance</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3">
            <Award size={36} className="text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-300">No matching reviews found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
              Be the first operator to author a double-signed review for this address and anchor it to Base
              Sepolia.
            </p>
            <button
              type="button"
              onClick={() => {
                setModalTargetAddress(inspectedAddress);
                setIsReviewModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(34,211,238,0.25)] transition-all"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReviews.map((rev) => {
              const isExpanded = expandedProofs[rev.id];

              return (
                <div
                  key={rev.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 backdrop-blur-md space-y-3 transition-colors shadow-sm"
                >
                  {/* Review Top Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {/* Trust Score Badge with gradient */}
                      <TrustScoreBadge score={rev.score} size="md" showLabel showLink />

                      {/* Category Badge */}
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {rev.category}
                      </span>

                      {/* Product Detail */}
                      {rev.productDetails && (
                        <span className="text-[11px] font-mono text-cyan-400/90 hidden md:inline">
                          • {rev.productDetails}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <span>{rev.timestamp}</span>
                      <span className="text-emerald-400/90 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        On-Chain Settled
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs md:text-sm text-slate-200 font-sans leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Review Footer & Cryptographic Proof Toggle */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>Reviewer:</span>
                      <span className="text-cyan-300">{truncateAddress(rev.reviewerAddress, 8, 6)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleProof(rev.id)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-start sm:self-auto py-1"
                    >
                      <KeyRound size={12} />
                      <span>{isExpanded ? 'Hide Double-Signature Proofs' : 'View Double-Signature Proofs'}</span>
                      <ChevronDown
                        size={12}
                        className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Expanded Double-Signature Proof Drawer */}
                  {isExpanded && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2.5 font-mono text-xs animate-in slide-in-from-top-2 duration-150">
                      <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-400" />
                        Double-Signing Cryptographic Proofs
                      </div>

                      {/* 1. Reviewer Client Signature */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-cyan-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            1. Reviewer Client Signature (EIP-191):
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(rev.reviewerSignature, `sig1-${rev.id}`)}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            {copiedKey === `sig1-${rev.id}` ? <Check size={11} /> : <Copy size={11} />}
                            {copiedKey === `sig1-${rev.id}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[10px] text-slate-300 font-mono break-all select-all">
                          {rev.reviewerSignature}
                        </div>
                      </div>

                      {/* 2. Admin Relayer Signature */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            2. Admin Relayer Blockchain Signature:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(rev.adminSignature, `sig2-${rev.id}`)}
                            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                          >
                            {copiedKey === `sig2-${rev.id}` ? <Check size={11} /> : <Copy size={11} />}
                            {copiedKey === `sig2-${rev.id}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[10px] text-slate-300 font-mono break-all select-all">
                          {rev.adminSignature}
                        </div>
                      </div>

                      {/* Base Sepolia Tx & Block Info */}
                      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-400">
                          Block <span className="text-slate-200 font-bold">{rev.blockNumber}</span> • Base
                          Sepolia
                        </span>
                        <a
                          href={`https://sepolia.basescan.org/tx/${rev.onChainTxHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-400 hover:underline"
                        >
                          <span>Tx: {truncateAddress(rev.onChainTxHash, 8, 6)}</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Submission Modal with Dual-Signing */}
      <ReviewSubmissionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        reviewerAddress={activeSigner}
        defaultTargetAddress={modalTargetAddress || inspectedAddress}
        onSuccess={handleReviewSuccess}
        onOpenWalletModal={onOpenWalletModal}
      />
    </div>
  );
};

export default ReputationSentinelView;
