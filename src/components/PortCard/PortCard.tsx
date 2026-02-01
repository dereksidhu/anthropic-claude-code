import { Port } from '../../types/port';
import { StatusBadge, CongestionBadge } from '../StatusBadge/StatusBadge';

interface PortCardProps {
  port: Port;
  onClick?: () => void;
  isSelected?: boolean;
}

const alertTypeIcons: Record<string, string> = {
  weather: '🌧',
  strike: '✊',
  maintenance: '🔧',
  security: '🛡',
  capacity: '📦',
  geopolitical: '🌍',
  other: 'ℹ',
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

export function PortCard({ port, onClick, isSelected }: PortCardProps) {
  const trendIcon = port.portCalls.trend === 'up' ? '↑' : port.portCalls.trend === 'down' ? '↓' : '→';
  const trendColor = port.portCalls.trend === 'up' ? 'text-green-600' : port.portCalls.trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
              #{port.globalRank}
            </span>
            <h3 className="font-semibold text-gray-900 truncate">{port.name}</h3>
          </div>
          <p className="text-sm text-gray-500">{port.country}</p>
        </div>
        <StatusBadge status={port.status} size="sm" />
      </div>

      {/* Throughput */}
      <div className="bg-blue-50 rounded p-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-blue-600 font-medium">Annual TEU</span>
          <span className="font-bold text-blue-800">{port.throughput.teuAnnual}M</span>
        </div>
        <div className="flex justify-between text-xs text-blue-600 mt-1">
          <span>Daily: {formatNumber(port.throughput.teuDaily)} TEU</span>
          <span className={trendColor}>{trendIcon} {port.portCalls.trendPercent.toFixed(1)}%</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-500">Wait</p>
          <p className="font-semibold text-gray-900 text-sm">
            {port.waitTime}h
          </p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-500">At Anchor</p>
          <p className="font-semibold text-gray-900 text-sm">
            {port.anchorageCount}
          </p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-500">Berth</p>
          <p className="font-semibold text-gray-900 text-sm">
            {port.berthOccupancy}%
          </p>
        </div>
      </div>

      {/* Berth Occupancy Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              port.berthOccupancy > 90
                ? 'bg-red-500'
                : port.berthOccupancy > 70
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, port.berthOccupancy)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <CongestionBadge level={port.congestionLevel} size="sm" />
        {port.alerts.length > 0 && (
          <div className="flex items-center gap-1">
            {port.alerts.slice(0, 3).map(alert => (
              <span
                key={alert.id}
                className={`text-sm ${
                  alert.severity === 'critical'
                    ? 'text-red-500'
                    : alert.severity === 'warning'
                    ? 'text-yellow-600'
                    : 'text-blue-500'
                }`}
                title={alert.message}
              >
                {alertTypeIcons[alert.type]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
