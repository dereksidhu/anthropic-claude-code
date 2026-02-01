import { Port } from '../../types/port';
import { StatusBadge, CongestionBadge } from '../StatusBadge/StatusBadge';

interface PortDetailsProps {
  port: Port;
  onClose: () => void;
}

const alertTypeLabels: Record<string, string> = {
  weather: 'Weather Alert',
  strike: 'Labor Strike',
  maintenance: 'Maintenance',
  security: 'Security Notice',
  capacity: 'Capacity Issue',
  geopolitical: 'Geopolitical',
  other: 'General Notice',
};

const alertSeverityColors: Record<string, string> = {
  info: 'bg-blue-100 border-blue-500 text-blue-800',
  warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
  critical: 'bg-red-100 border-red-500 text-red-800',
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

export function PortDetails({ port, onClose }: PortDetailsProps) {
  const trendIcon = port.portCalls.trend === 'up' ? '↑' : port.portCalls.trend === 'down' ? '↓' : '→';
  const trendColor = port.portCalls.trend === 'up' ? 'text-green-600' : port.portCalls.trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 md:p-6 max-w-2xl z-[1000] max-h-[80vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl leading-none"
      >
        &times;
      </button>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4 pr-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
              #{port.globalRank} Global
            </span>
            <StatusBadge status={port.status} size="sm" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{port.name}</h2>
          <p className="text-gray-500 text-sm">
            {port.country} &bull; {port.region}
          </p>
        </div>
      </div>

      {/* Throughput Section */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Throughput</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <p className="text-2xl font-bold text-blue-900">{port.throughput.teuAnnual}M</p>
            <p className="text-xs text-blue-600">Annual TEU</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-900">{formatNumber(port.throughput.teuDaily)}</p>
            <p className="text-xs text-blue-600">Daily TEU</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-900">{formatNumber(port.throughput.importVolume)}</p>
            <p className="text-xs text-blue-600">Import (MT/day)</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-900">{formatNumber(port.throughput.exportVolume)}</p>
            <p className="text-xs text-blue-600">Export (MT/day)</p>
          </div>
        </div>
      </div>

      {/* Activity Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-gray-900">{port.portCalls.daily}</p>
          <p className="text-xs text-gray-500">Port Calls/Day</p>
          <p className={`text-xs ${trendColor}`}>{trendIcon} {port.portCalls.trendPercent.toFixed(1)}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-gray-900">{port.waitTime}h</p>
          <p className="text-xs text-gray-500">Avg Wait Time</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-gray-900">{port.dwellTime.toFixed(1)}d</p>
          <p className="text-xs text-gray-500">Dwell Time</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-gray-900">{port.anchorageCount}</p>
          <p className="text-xs text-gray-500">At Anchorage</p>
        </div>
      </div>

      {/* Capacity Metrics */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Berth Occupancy</span>
          <span className="text-sm font-bold text-gray-900">{port.berthOccupancy}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
          <div
            className={`h-2.5 rounded-full transition-all ${
              port.berthOccupancy > 90 ? 'bg-red-500'
                : port.berthOccupancy > 70 ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, port.berthOccupancy)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Vessels in port: {port.vesselCount}</span>
          <span>Capacity: {port.capacity}</span>
        </div>
      </div>

      {/* Congestion */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Congestion Level</span>
        <CongestionBadge level={port.congestionLevel} />
      </div>

      {/* Alerts */}
      {port.alerts.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Active Alerts ({port.alerts.length})</h3>
          <div className="space-y-2">
            {port.alerts.map(alert => (
              <div
                key={alert.id}
                className={`border-l-4 p-3 rounded ${alertSeverityColors[alert.severity]}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{alertTypeLabels[alert.type]}</span>
                  <span className="text-xs uppercase tracking-wide">{alert.severity}</span>
                </div>
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t text-xs text-gray-400">
        <p>Coordinates: {port.coordinates.lat.toFixed(4)}, {port.coordinates.lng.toFixed(4)}</p>
        <p>Last updated: {port.lastUpdated.toLocaleString()}</p>
      </div>
    </div>
  );
}
