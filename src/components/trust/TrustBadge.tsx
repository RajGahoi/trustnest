import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { TrustScore } from '../../types';

interface TrustBadgeProps {
  trustScore: TrustScore;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  trustScore,
  size = 'md',
  showLabel = true,
  onClick
}) => {
  const { overallScore, tier } = trustScore;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2',
  };

  const tierColors = {
    PLATINUM: 'bg-navy-900 text-cream-50 border-orange-500/40 shadow-sm',
    GOLD: 'bg-amber-light text-navy-900 border-amber-400',
    SILVER: 'bg-cream-200 text-navy-900 border-cream-300',
    STANDARD: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`foil inline-flex items-center rounded-full border transition-all duration-200 ${sizeClasses[size]} ${tierColors[tier]} ${
        onClick ? 'hover:scale-105 hover:shadow-md cursor-pointer' : ''
      }`}
      title={onClick ? "Click to view complete 5-Dimension Verification Breakdown" : undefined}
    >
      <span className="relative flex items-center justify-center">
        <ShieldCheck className={`text-orange-500 fill-orange-500/20 ${size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} />
        <CheckCircle2 className="w-2 h-2 text-white absolute -bottom-0.5 -right-0.5 fill-trust-green" />
      </span>
      <span className="num-mono font-bold">{overallScore}</span>
      {showLabel && <span className="opacity-90 font-medium">trust</span>}
    </Component>
  );
};
