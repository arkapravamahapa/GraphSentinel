import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Blocks,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  FileText,
  Lock,
  Stamp,
  RefreshCw,
} from 'lucide-react';
import {
  signReviewAsClient,
  signReviewAsAdminRelayer,
  finalizeDoubleSignedReview,
  formatAddress,
  truncateAddress,
  BASESCAN_CONTRACT_URL,
  REPUTATION_CONTRACT_ADDRESS,
} from '../../lib/reputationService';
import type {
  ReviewSubmissionPayload,
  DoubleSignSubmissionResult,
  Review,
} from '../../lib/reputationService';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewerAddress: string;
  defaultTargetAddress?: string;
  onSuccess: (result: DoubleSignSubmissionResult) => void;
  onOpenWalletModal?: () => void;
}

const CATEGORIES: Review['category'][] = [
  'Liquidity Provision',
  'Counter-Trade Defense',
  'MEV Mitigation',
  'OTC Swap',
  'Protocol Governance',
];

const PRESET_TARGETS = [
  { label: 'Authorized Sentinel (Self)', address: '0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA' },
  { label: 'ATK-SybilA (Attack Ring)', address: '0x91F41029ab81c7f76bA1a82E9bEc423450dFe21B' },
  { label: 'Aerodrome Arbitrageur', address: '0x38bdf8828972C331C98b4F30A29281a8B89Cc988' },
];

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  reviewerAddress,
  defaultTargetAddress = '',
  onSuccess,
  onOpenWalletModal,
}) => {
  // Form fields
  const [targetAddress, setTargetAddress] = useState<string>(defaultTargetAddress);
  const [score, setScore] = useState<number>(85);
  const [category, setCategory] = useState<Review['category']>('Liquidity Provision');
  const [productDetails, setProductDetails] = useState<string>('Uniswap v3 ETH/USDC Pool');
  const [comment, setComment] = useState<string>('');

  // Mode: 'form' | 'receipt'
  const [mode, setMode] = useState<'form' | 'receipt'>('form');

  // Interactive Double-Signing Ceremony States
  const [receiptTimestamp, setReceiptTimestamp] = useState<string>('');
  const [receiptNonce, setReceiptNonce] = useState<string>('');
  const [isSigningParty1, setIsSigningParty1] = useState<boolean>(false);
  const [party1Signature, setParty1Signature] = useState<string | null>(null);

  const [isSigningParty2, setIsSigningParty2] = useState<boolean>(false);
  const [party2Signature, setParty2Signature] = useState<string | null>(null);
  const [onChainTxHash, setOnChainTxHash] = useState<string | null>(null);
  const [blockNumber, setBlockNumber] = useState<number | null>(null);

  const [finalResult, setFinalResult] = useState<DoubleSignSubmissionResult | null>(null);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleResetForm = () => {
    setComment('');
    setScore(85);
    setMode('form');
    setParty1Signature(null);
    setParty2Signature(null);
    setOnChainTxHash(null);
    setBlockNumber(null);
    setFinalResult(null);
    setErrorMessage(null);
  };

  // Step A: Generate Receipt
  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!targetAddress || targetAddress.length < 10) {
      setErrorMessage('Please provide a valid Ethereum wallet address to review.');
      return;
    }

    if (!comment || comment.trim().length < 10) {
      setErrorMessage('Please write a constructive review description (minimum 10 characters).');
      return;
    }

    setReceiptTimestamp(new Date().toISOString());
    setReceiptNonce(`0x${Math.floor(Math.random() * 1e16).toString(16)}`);
    setParty1Signature(null);
    setParty2Signature(null);
    setOnChainTxHash(null);
    setBlockNumber(null);
    setFinalResult(null);
    setMode('receipt');
  };

  // Step B: Party 1 Reviewer Signature / Approval
  const handleApproveParty1 = async () => {
    setIsSigningParty1(true);
    setErrorMessage(null);
    try {
      const activeSigner = reviewerAddress || '0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA';
      const { signature } = await signReviewAsClient(
        targetAddress,
        activeSigner,
        score,
        category,
        comment,
        receiptTimestamp
      );
      setParty1Signature(signature);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reviewer approval cancelled.';
      setErrorMessage(msg);
    } finally {
      setIsSigningParty1(false);
    }
  };

  // Step C: Party 2 Admin Relayer Co-Signature / Approval
  const handleApproveParty2 = async () => {
    if (!party1Signature) return;
    setIsSigningParty2(true);
    setErrorMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 900)); // Relayer check simulation
      const { adminSignature, onChainTxHash: tx, blockNumber: block } =
        await signReviewAsAdminRelayer(targetAddress, score, party1Signature);

      setParty2Signature(adminSignature);
      setOnChainTxHash(tx);
      setBlockNumber(block);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Admin Relayer signing failed.';
      setErrorMessage(msg);
    } finally {
      setIsSigningParty2(false);
    }
  };

  // Step D: Finalize Receipt & Update On-Chain Profile
  const handleFinalizeReceipt = async () => {
    if (!party1Signature || !party2Signature || !onChainTxHash || !blockNumber) return;
    setIsFinalizing(true);
    try {
      const activeSigner = reviewerAddress || '0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA';
      const payload: ReviewSubmissionPayload = {
        targetAddress: formatAddress(targetAddress),
        reviewerAddress: activeSigner,
        score,
        category,
        productDetails: productDetails || 'DeFi Liquidity Pool',
        comment,
      };

      const result = await finalizeDoubleSignedReview(
        payload,
        party1Signature,
        party2Signature,
        onChainTxHash,
        blockNumber
      );

      setFinalResult(result);
      onSuccess(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Finalization failed.';
      setErrorMessage(msg);
    } finally {
      setIsFinalizing(false);
    }
  };

  const stars = Math.round(score / 20);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSigningParty1 && !isSigningParty2 && !isFinalizing) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              <Stamp size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Double-Signing Reputation Protocol
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                  2-KEY ATTESTATION
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Reviewer Client Key (Party 1) + Protocol Relayer Key (Party 2)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* =========================================================================
             VIEW 1: FORM INPUT
             ========================================================================= */}
          {mode === 'form' && (
            <form onSubmit={handleGenerateReceipt} className="space-y-4">
              {/* Reviewer / Author banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <KeyRound size={13} className="text-cyan-400" />
                  Party 1 Signer (You):
                </span>
                <span className="text-cyan-300 font-semibold flex items-center gap-2">
                  {reviewerAddress ? truncateAddress(reviewerAddress, 8, 6) : 'Instant Demo Operator'}
                  {!reviewerAddress && onOpenWalletModal && (
                    <button
                      type="button"
                      onClick={onOpenWalletModal}
                      className="text-[10px] text-slate-400 underline hover:text-slate-200"
                    >
                      Connect Wallet
                    </button>
                  )}
                </span>
              </div>

              {/* Target Address Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Target Counterparty Wallet:</span>
                  <span className="text-[11px] text-slate-500 font-mono">0x...</span>
                </label>
                <input
                  type="text"
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                  placeholder="0x..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500">Presets:</span>
                  {PRESET_TARGETS.map((p) => (
                    <button
                      key={p.address}
                      type="button"
                      onClick={() => setTargetAddress(p.address)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono border border-slate-700/60 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Rating Score Slider & Stars */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Assigned Trust Score (0 – 100):
                  </label>
                  <div className="flex items-center gap-2 font-mono">
                    <span
                      className={`text-lg font-black ${
                        score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {score}
                    </span>
                    <span className="text-xs text-slate-500">/100</span>
                    <div className="flex items-center ml-2 text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span className="text-rose-400">0 (Critical Sybil/Exploiter)</span>
                  <span className="text-amber-400">50 (Neutral)</span>
                  <span className="text-emerald-400">100 (Exemplary Protocol LP)</span>
                </div>
              </div>

              {/* Category & Product details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200">Interaction Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Review['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200">Protocol / Pool Details:</label>
                  <input
                    type="text"
                    value={productDetails}
                    onChange={(e) => setProductDetails(e.target.value)}
                    placeholder="e.g. Uniswap v3 ETH/USDC"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Review Comment Text */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
                  <label>Written Review & Telemetry Notes:</label>
                  <span className="text-[10px] font-mono text-slate-500">{comment.length}/500</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Detail liquidity depth, execution speed, lack of sandwiching, or toxic cyclic order patterns..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-slate-600"
                />
              </div>

              {/* Protocol Note */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 font-sans flex items-start gap-2.5">
                <Lock size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-semibold">Double-Signing Guarantee:</span> Both
                  you (Reviewer) and the GraphSentinel Admin Relayer must explicitly sign and approve this
                  receipt before the final score anchors to Base Sepolia.
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2"
                >
                  <span>Generate Double-Signing Receipt</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
             VIEW 2: CRYPTOGRAPHIC DOUBLE-SIGNING RECEIPT & APPROVAL TERMINAL
             ========================================================================= */}
          {mode === 'receipt' && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* The Visual Receipt Card */}
              <div className="p-5 rounded-2xl bg-black border-2 border-cyan-500/40 relative shadow-[0_0_30px_rgba(34,211,238,0.15)] font-mono space-y-4">
                {/* Receipt Watermark / Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-black tracking-widest uppercase">
                      <FileText size={16} />
                      GraphSentinel Double-Signing Attestation Receipt
                    </div>
                    <div className="text-[10px] text-slate-500 pt-0.5">
                      RECEIPT REF: <span className="text-slate-300">{receiptNonce}</span> • BASE SEPOLIA (84532)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                      OFFICIAL VOUCHER
                    </span>
                  </div>
                </div>

                {/* Receipt Data Table */}
                <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Target Wallet:</span>
                    <span className="text-cyan-300 font-bold truncate block">{targetAddress}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Reviewer (Party 1):</span>
                    <span className="text-slate-200 truncate block">
                      {reviewerAddress ? truncateAddress(reviewerAddress, 8, 6) : 'Authorized Sentinel Operator'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Trust Score Anchor:</span>
                    <span
                      className={`text-sm font-black ${
                        score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {score} / 100 ({score >= 80 ? 'EXEMPLARY' : score >= 50 ? 'MODERATE' : 'RESTRICTED'})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Category / Pool:</span>
                    <span className="text-slate-300 truncate block">
                      {category} • {productDetails}
                    </span>
                  </div>
                </div>

                {/* Review Excerpt */}
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-sans italic">
                  "{comment}"
                </div>

                {/* =====================================================================
                   DUAL APPROVAL SLOTS (Party 1 & Party 2)
                   ===================================================================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* SLOT 1: Party 1 Reviewer Approval */}
                  <div
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all ${
                      party1Signature
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-slate-950/80 border-cyan-500/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <KeyRound size={13} className={party1Signature ? 'text-emerald-400' : 'text-cyan-400'} />
                          Party 1: Reviewer
                        </span>
                        {party1Signature ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            APPROVED
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            Pending Signature
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans pt-1">
                        Reviewer client private key signature authenticating review veracity (EIP-191).
                      </p>
                    </div>

                    {party1Signature ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Signature Proof:</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(party1Signature, 'p1sig')}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            {copiedKey === 'p1sig' ? <Check size={10} /> : <Copy size={10} />}
                            {copiedKey === 'p1sig' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-300 truncate select-all">
                          {party1Signature}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApproveParty1}
                        disabled={isSigningParty1}
                        className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(34,211,238,0.25)] transition-all flex items-center justify-center gap-1.5"
                      >
                        {isSigningParty1 ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            <span>Awaiting Wallet Signature...</span>
                          </>
                        ) : (
                          <>
                            <Stamp size={14} />
                            <span>1. Sign & Approve (Reviewer Key)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* SLOT 2: Party 2 Admin Relayer Co-Signature */}
                  <div
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all ${
                      party2Signature
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : party1Signature
                        ? 'bg-slate-950/80 border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                        : 'bg-slate-950/40 border-slate-800 opacity-60 pointer-events-none'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <ShieldCheck size={13} className={party2Signature ? 'text-emerald-400' : 'text-cyan-400'} />
                          Party 2: Admin Relayer
                        </span>
                        {party2Signature ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            CO-SIGNED & MINED
                          </span>
                        ) : party1Signature ? (
                          <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded animate-pulse">
                            Ready for Relayer
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Awaiting Party 1</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans pt-1">
                        Admin Relayer validates invariant & broadcasts on-chain transaction to Base Sepolia.
                      </p>
                    </div>

                    {party2Signature ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Admin Relayer Tx:</span>
                          {onChainTxHash && (
                            <a
                              href={`https://sepolia.basescan.org/tx/${onChainTxHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline flex items-center gap-0.5"
                            >
                              BaseScan <ExternalLink size={9} />
                            </a>
                          )}
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-300 truncate select-all">
                          {onChainTxHash}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApproveParty2}
                        disabled={!party1Signature || isSigningParty2}
                        className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isSigningParty2 ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            <span>Broadcasting to Base Sepolia...</span>
                          </>
                        ) : (
                          <>
                            <Blocks size={14} />
                            <span>2. Co-Sign & Broadcast (Admin Relayer)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* BOTH SIGNED BANNER */}
                {party1Signature && party2Signature && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-between animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_#10b981]">
                        ✓
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-300 block">
                          Double-Signing Ceremony Complete!
                        </span>
                        <span className="text-[10px] text-slate-300 font-sans">
                          Both Reviewer & Relayer signatures verified. Block #{blockNumber} anchored.
                        </span>
                      </div>
                    </div>

                    <a
                      href={BASESCAN_CONTRACT_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-cyan-500/40 text-[11px] flex items-center gap-1 hover:bg-slate-900"
                    >
                      <span>Contract</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Bottom Actions */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('form')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  ← Edit Review Form
                </button>

                {party1Signature && party2Signature ? (
                  <button
                    type="button"
                    onClick={handleFinalizeReceipt}
                    disabled={isFinalizing}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2"
                  >
                    {isFinalizing ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Updating Profile State...</span>
                      </>
                    ) : (
                      <>
                        <span>Seal Receipt & Finalize On-Chain</span>
                        <Check size={14} />
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">
                    Both parties must approve to complete Double-Signing
                  </span>
                )}
              </div>
            </div>
          )}

          {/* FINAL SUCCESS SCREEN */}
          {finalResult && (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-4 animate-in fade-in duration-200 font-mono">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Double-Signed Attestation Finalized!
                </h3>
                <p className="text-xs text-slate-300 font-sans max-w-md mx-auto pt-1">
                  The target wallet trust score is now updated to{' '}
                  <span className="font-bold text-emerald-400 font-mono">
                    {finalResult.newTrustScore} / 100
                  </span>{' '}
                  on Base Sepolia.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Write Another Review
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with contract verification anchor */}
        <div className="px-6 py-2.5 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Base Sepolia Contract: {REPUTATION_CONTRACT_ADDRESS.slice(0, 10)}...000C</span>
          <a
            href={BASESCAN_CONTRACT_URL}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            BaseScan Contract
            <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </div>
  );
};
