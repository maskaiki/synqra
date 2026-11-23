import React from 'react';
import { ReportStatus, RiskLevel, SlaInfo } from '@/types/synqra';
import { Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const configs: Record<
    ReportStatus,
    { label: string; style: React.CSSProperties }
  > = {
    PRADUGA: {
      label: 'PRADUGA',
      style: {
        backgroundColor: '#D97706',
        color: '#FFFFFF',
      },
    },
    TRIAGE: {
      label: 'TRIAGE',
      style: {
        backgroundColor: '#2563EB',
        color: '#FFFFFF',
      },
    },
    INVESTIGATION: {
      label: 'INVESTIGASI',
      style: {
        backgroundColor: 'var(--pop-bg)',
        color: 'var(--pop-ink)',
      },
    },
    VERIFIED: {
      label: 'TERVERIFIKASI',
      style: {
        backgroundColor: '#059669',
        color: '#FFFFFF',
      },
    },
  };

  const cfg = configs[status] || configs.PRADUGA;
  const paddingClass =
    size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-[11.5px]';

  return (
    <span
      style={cfg.style}
      className={`inline-flex items-center font-heading font-bold uppercase tracking-wider rounded-[7px] whitespace-nowrap select-none shadow-sm ${paddingClass} ${className}`}
    >
      {cfg.label}
    </span>
  );
};

interface SlaBadgeProps {
  sla: SlaInfo;
  compact?: boolean;
}

export const SlaBadge: React.FC<SlaBadgeProps> = ({ sla, compact = false }) => {
  const colorMap: Record<SlaInfo['level'], string> = {
    green: 'var(--green)',
    yellow: 'var(--amber)',
    red: 'var(--red)',
  };

  const text = compact
    ? `${sla.hoursElapsed}j`
    : sla.level === 'red'
      ? `${sla.hoursElapsed}j Overdue`
      : `${sla.hoursElapsed}j`;

  return (
    <span
      style={{ color: colorMap[sla.level] }}
      title={sla.label}
      className="inline-flex items-center gap-1 font-heading font-bold text-xs whitespace-nowrap select-none"
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>{text}</span>
    </span>
  );
};

interface RiskBadgeProps {
  level?: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level = 'MEDIUM' }) => {
  const colorMap: Record<RiskLevel, string> = {
    LOW: 'var(--green)',
    MEDIUM: 'var(--info)',
    HIGH: 'var(--amber)',
    CRITICAL: 'var(--red)',
  };

  return (
    <span
      style={{ color: colorMap[level] }}
      className="inline-flex items-center font-heading font-extrabold text-xs uppercase tracking-wide whitespace-nowrap select-none"
    >
      {level}
    </span>
  );
};
