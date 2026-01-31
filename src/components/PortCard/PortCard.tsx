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
  other: 'ℹ',
};

export function PortCard({ port, onClick, isSelected }: PortCardProps) {
  const utilizationPercent = Math.round((port.vesselCount / port.capacity) * 100);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{port.name}</h3>
          <p className="text-sm text-gray-500">{port.country}</p>
        </div>
        <StatusBadge status={port.status} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-500">Wait Time</p>
          <p className="font-semibold text-gray-900">
            {port.waitTime > 0 ? `${port.waitTime}h` : 'N/A'}
          </p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-500">Vessels</p>
          <p className="font-semibold text-gray-900">
            {port.vesselCount}/{port.capacity}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Utilization</span>
          <span className="text-xs font-medium text-gray-700">{utilizationPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              utilizationPercent > 90
                ? 'bg-red-500'
                : utilizationPercent > 70
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, utilizationPercent)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <CongestionBadge level={port.congestionLevel} size="sm" />
        {port.alerts.length > 0 && (
          <div className="flex items-center gap-1">
            {port.alerts.map(alert => (
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

      <p className="text-xs text-gray-400 mt-2">
        Updated: {port.lastUpdated.toLocaleTimeString()}
      </p>
    </div>
  );
}
