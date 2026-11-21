import React from 'react';
import { ReportStatus, RiskLevel, SlaInfo } from '@/types/synqra';
import {
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

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
    { label: string; icon: React.ReactNode; style: React.CSSProperties }
  > = {
    PRADUGA: {
      label: 'PRADUGA',
      icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" />,
      style: {
        backgroundColor: 'var(--amber-bg)',
        color: 'var(--amber)',
        borderColor: 'var(--amber-border)',
        borderLeftColor: 'var(--amber)',
      },
    },
    TRIAGE: {
      label: 'TRIAGE DEPT',
      icon: <Clock className="w-3.5 h-3.5 shrink-0" />,
      style: {
        backgroundColor: 'var(--info-bg)',
        color: 'var(--info)',
        borderColor: 'var(--info-border)',
        borderLeftColor: 'var(--info)',
      },
    },
    INVESTIGATION: {
      label: 'INVESTIGASI',
      icon: <Search className="w-3.5 h-3.5 shrink-0" />,
      style: {
        backgroundColor: 'var(--purple-bg)',
        color: 'var(--purple)',
        borderColor: 'var(--purple-border)',
        borderLeftColor: 'var(--purple)',
      },
    },
    VERIFIED: {
      label: 'TERVERIFIKASI',
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
      style: {
        backgroundColor: 'var(--green-bg)',
        color: 'var(--green)',
        borderColor: 'var(--green-border)',
        borderLeftColor: 'var(--green)',
      },
    },
  };

  const cfg = configs[status] || configs.PRADUGA;
  const paddingClass =
    size === 'sm' ? 'px-2.5 py-1 text-[11.5px]' : 'px-3 py-1.5 text-xs';

  return (
    <span
      style={cfg.style}
      className={`inline-flex items-center gap-1.5 font-heading font-bold uppercase tracking-wider rounded-[7px] border border-l-[3.5px] whitespace-nowrap select-none ${paddingClass} ${className}`}
    >
      {cfg.icon}
      <span>{cfg.label}</span>
    </span>
  );
};

interface SlaBadgeProps {
  sla: SlaInfo;
  compact?: boolean;
}

export const SlaBadge: React.FC<SlaBadgeProps> = ({ sla, compact = false }) => {
  const styleMap: Record<SlaInfo['level'], React.CSSProperties> = {
    green: {
      backgroundColor: 'var(--green-bg)',
      color: 'var(--green)',
      borderColor: 'var(--green-border)',
      borderLeftColor: 'var(--green)',
    },
    yellow: {
      backgroundColor: 'var(--amber-bg)',
      color: 'var(--amber)',
      borderColor: 'var(--amber-border)',
      borderLeftColor: 'var(--amber)',
    },
    red: {
      backgroundColor: 'var(--red-bg)',
      color: 'var(--red)',
      borderColor: 'var(--red-border)',
      borderLeftColor: 'var(--red)',
    },
  };

  return (
    <span
      style={styleMap[sla.level]}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] border border-l-[3.5px] font-heading font-bold text-[11.5px] whitespace-nowrap select-none"
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>{compact ? sla.shortLabel : sla.label}</span>
    </span>
  );
};

interface RiskBadgeProps {
  level?: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level = 'MEDIUM' }) => {
  const styles: Record<RiskLevel, React.CSSProperties> = {
    LOW: {
      backgroundColor: 'var(--green-bg)',
      color: 'var(--green)',
      borderColor: 'var(--green-border)',
      borderLeftColor: 'var(--green)',
    },
    MEDIUM: {
      backgroundColor: 'var(--info-bg)',
      color: 'var(--info)',
      borderColor: 'var(--info-border)',
      borderLeftColor: 'var(--info)',
    },
    HIGH: {
      backgroundColor: 'var(--amber-bg)',
      color: 'var(--amber)',
      borderColor: 'var(--amber-border)',
      borderLeftColor: 'var(--amber)',
    },
    CRITICAL: {
      backgroundColor: 'var(--red-bg)',
      color: 'var(--red)',
      borderColor: 'var(--red-border)',
      borderLeftColor: 'var(--red)',
    },
  };

  return (
    <span
      style={styles[level]}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] border border-l-[3.5px] font-heading font-bold text-[11.5px] uppercase whitespace-nowrap"
    >
      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
      <span>RISK: {level}</span>
    </span>
  );
};
