import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { BASESCAN_CONTRACT_URL, REPUTATION_CONTRACT_ADDRESS } from '../../lib/reputationService';

interface TrustScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'radial';
  showLabel?: boolean;
  showLink?: boolean;
  showContractHint?: boolean;
  className?: string;
  tooltipText?: string;
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
  showLink = true,
  showContractHint = false,
  className = '',
  tooltipText,
}) => {
  // Score gradient classification: Green 80-100, Yellow 50-79, Red <50
  const isGreen = score >= 80;
  const isYellow = score >= 50 && score < 80;

  const tierName = isGreen
    ? 'EXEMPLARY TRUST'
    : isYellow
    ? 'MODERATE TRUST'
    : 'ELEVATED RISK';

  // Styling configurations
  const colorConfig = isGreen
    ? {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
        hoverGlow: 'hover:shadow-[0_0_18px_rgba(16,185,129,0.4)]',
        ringColor: '#10b981',
        gradient: 'from-emerald-400 via-teal-300 to-cyan-400',
        icon: ShieldCheck,
      }
    : isYellow
    ? {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
        hoverGlow: 'hover:shadow-[0_0_18px_rgba(245,158,11,0.4)]',
        ringColor: '#f59e0b',
        gradient: 'from-amber-400 via-yellow-300 to-orange-400',
        icon: AlertTriangle,
      }
    : {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/40',
        glow: 'shadow-[0_0_12px_rgba(244,63,94,0.25)]',
        hoverGlow: 'hover:shadow-[0_0_18px_rgba(244,63,94,0.4)]',
        ringColor: '#f43f5e',
        gradient: 'from-rose-500 via-red-400 to-pink-500',
        icon: ShieldAlert,
      };

  const Icon = colorConfig.icon;

  const defaultTooltip =
    tooltipText ||
    `Immutable On-Chain Score: ${score}/100 on Base Sepolia. Smart Contract: ${REPUTATION_CONTRACT_ADDRESS.slice(0, 10)}... Click to verify on BaseScan.`;

  // RADIAL GAUGE VARIANT
  if (size === 'radial') {
    const strokeWidth = 8;
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

    const radialContent = (
      <div
        className={`relative inline-flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border ${colorConfig.border} ${colorConfig.glow} ${colorConfig.hoverGlow} transition-all duration-300 group ${className}`}
        title={defaultTooltip}
      >
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active Progress Bar */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={colorConfig.ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: 'stroke-dashoffset 0.8s ease-out',
                filter: `drop-shadow(0 0 6px ${colorConfig.ringColor})`,
              }}
            />
          </svg>

          {/* Central Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black tracking-tight font-mono text-slate-100 flex items-baseline">
              {score}
              <span className="text-xs text-slate-500 font-sans ml-0.5">/100</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              TRUST SCORE
            </span>
          </div>
        </div>

        {/* Badge Metadata */}
        <div className="mt-2 flex flex-col items-center gap-1 text-center">
          <span
            className={`text-[11px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full ${colorConfig.bg} ${colorConfig.text} border ${colorConfig.border} flex items-center gap-1`}
          >
            <Icon size={12} />
            {tierName}
          </span>

          {showContractHint && (
            <span className="text-[10px] text-cyan-400/90 font-mono flex items-center gap-1 mt-1 group-hover:underline">
              <span>Base Sepolia Verified</span>
              <ExternalLink size={10} />
            </span>
          )}
        </div>
      </div>
    );

    return showLink ? (
      <a
        href={BASESCAN_CONTRACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block no-underline cursor-pointer"
        aria-label="Inspect Base Sepolia Smart Contract on BaseScan"
      >
        {radialContent}
      </a>
    ) : (
      radialContent
    );
  }

  // COMPACT / STANDARD BADGE VARIANT
  const badgeContent = (
    <div
      className={`inline-flex items-center gap-2 rounded-lg font-mono transition-all duration-200 border ${
        colorConfig.bg
      } ${colorConfig.border} ${colorConfig.text} ${colorConfig.glow} ${colorConfig.hoverGlow} ${
        size === 'sm'
          ? 'px-2 py-0.5 text-xs'
          : size === 'lg'
          ? 'px-3.5 py-1.5 text-sm font-semibold'
          : 'px-2.5 py-1 text-xs'
      } ${className}`}
      title={defaultTooltip}
    >
      <Icon size={size === 'sm' ? 12 : 14} className="flex-shrink-0 animate-pulse" />
      <span className="font-bold tracking-wide">
        {score}
        <span className="opacity-60 text-[10px] ml-0.5">/100</span>
      </span>

      {showLabel && (
        <span className="opacity-80 text-[10px] uppercase font-sans tracking-wider border-l border-current/30 pl-1.5 ml-0.5">
          {tierName}
        </span>
      )}

      {showLink && (
        <ExternalLink
          size={size === 'sm' ? 10 : 12}
          className="opacity-70 group-hover:opacity-100 transition-opacity ml-0.5"
        />
      )}
    </div>
  );

  if (showLink) {
    return (
      <a
        href={BASESCAN_CONTRACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block no-underline group cursor-pointer"
        aria-label={`Inspect Base Sepolia Smart Contract on BaseScan (Score: ${score})`}
      >
        {badgeContent}
      </a>
    );
  }

  return badgeContent;
};
