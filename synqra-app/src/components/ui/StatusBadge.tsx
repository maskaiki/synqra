import React from 'react';
import { ReportStatus } from '@/types/synqra';
import { AlertTriangle, Clock, Search, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const configs: Record<ReportStatus, {
    label: string;
    icon: React.ReactNode;
    classes: string;
  }> = {
    PRADUGA: {
      label: 'PRADUGA',
      icon: <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />,
      classes: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 border-l-[3.5px] border-l-amber-500',
    },
    TRIAGE: {
      label: 'TRIAGE DEPT',
      icon: <Clock className="w-3.5 h-3.5 flex-shrink-0" />,
      classes: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30 border-l-[3.5px] border-l-sky-500',
    },
    INVESTIGATION: {
      label: 'INVESTIGASI',
      icon: <Search className="w-3.5 h-3.5 flex-shrink-0" />,
      classes: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30 border-l-[3.5px] border-l-purple-500',
    },
    VERIFIED: {
      label: 'TERVERIFIKASI',
      icon: <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />,
      classes: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 border-l-[3.5px] border-l-emerald-500',
    },
  };

  const config = configs[status] || configs.PRADUGA;

  const sizeClasses = {
    sm: 'text-[10.5px] py-1 px-2 gap-1.5',
    md: 'text-[11.5px] py-1.5 px-3 gap-2',
    lg: 'text-[12.5px] py-2 px-3.5 gap-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-['Poppins',sans-serif] font-bold uppercase tracking-wider rounded-[7px] border shadow-sm select-none transition-all ${config.classes} ${sizeClasses} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
