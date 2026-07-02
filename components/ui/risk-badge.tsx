import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskLevel } from '@/lib/types';
import { RISK_LEVELS } from '@/lib/constants';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const RISK_ICONS = {
  LOW: ShieldCheck,
  MEDIUM: ShieldAlert,
  HIGH: ShieldX,
};

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const config = RISK_LEVELS[level];
  const Icon = RISK_ICONS[level];

  return (
    <span
      role="status"
      aria-label={`Risk level: ${config.label}`}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
        config.bg,
        config.border,
        config.color,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}
