import { PortStatus, CongestionLevel } from '../../types/port';

interface StatusBadgeProps {
  status: PortStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<PortStatus, string> = {
  open: 'bg-green-500',
  congested: 'bg-yellow-500',
  closed: 'bg-red-500',
  partial: 'bg-orange-500',
};

const statusLabels: Record<PortStatus, string> = {
  open: 'Open',
  congested: 'Congested',
  closed: 'Closed',
  partial: 'Partial',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium text-white ${statusColors[status]} ${sizeClasses[size]}`}
    >
      <span className="mr-1.5 h-2 w-2 rounded-full bg-white opacity-75 animate-pulse"></span>
      {statusLabels[status]}
    </span>
  );
}

interface CongestionBadgeProps {
  level: CongestionLevel;
  size?: 'sm' | 'md' | 'lg';
}

const congestionColors: Record<CongestionLevel, string> = {
  none: 'bg-gray-400',
  low: 'bg-green-400',
  moderate: 'bg-yellow-400',
  high: 'bg-orange-500',
  severe: 'bg-red-600',
};

const congestionLabels: Record<CongestionLevel, string> = {
  none: 'None',
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  severe: 'Severe',
};

export function CongestionBadge({ level, size = 'md' }: CongestionBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium text-white ${congestionColors[level]} ${sizeClasses[size]}`}
    >
      {congestionLabels[level]}
    </span>
  );
}
