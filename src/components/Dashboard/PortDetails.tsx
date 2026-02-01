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
  other: 'General Notice',
};

const alertSeverityColors: Record<string, string> = {
  info: 'bg-blue-100 border-blue-500 text-blue-800',
  warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
  critical: 'bg-red-100 border-red-500 text-red-800',
};

export function PortDetails({ port, onClose }: PortDetailsProps) {
  const utilizationPercent = Math.round((port.vesselCount / port.capacity) * 100);

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-6 max-w-2xl z-[1000]">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
      >
        &times;
      </button>

      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{port.name}</h2>
          <p className="text-gray-500">
            {port.country} &bull; {port.region}
          </p>
        </div>
        <StatusBadge status={port.status} size="lg" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{port.waitTime}h</p>
          <p className="text-sm text-gray-500">Wait Time</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{port.vesselCount}</p>
          <p className="text-sm text-gray-500">Vessels</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{port.capacity}</p>
          <p className="text-sm text-gray-500">Capacity</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{utilizationPercent}%</p>
          <p className="text-sm text-gray-500">Utilization</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Congestion Level</span>
          <CongestionBadge level={port.congestionLevel} />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
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

      {port.alerts.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Active Alerts</h3>
          <div className="space-y-2">
            {port.alerts.map(alert => (
              <div
                key={alert.id}
                className={`border-l-4 p-3 rounded ${alertSeverityColors[alert.severity]}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{alertTypeLabels[alert.type]}</span>
                  <span className="text-xs uppercase tracking-wide">{alert.severity}</span>
                </div>
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t text-sm text-gray-400">
        <p>
          Coordinates: {port.coordinates.lat.toFixed(4)}, {port.coordinates.lng.toFixed(4)}
        </p>
        <p>Last updated: {port.lastUpdated.toLocaleString()}</p>
      </div>
    </div>
  );
}
