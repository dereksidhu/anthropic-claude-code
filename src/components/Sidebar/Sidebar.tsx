import { Port, PortFilters, PortStatus, CongestionLevel } from '../../types/port';
import { PortCard } from '../PortCard/PortCard';

interface SidebarProps {
  ports: Port[];
  selectedPort: Port | null;
  onPortSelect: (port: Port) => void;
  filters: PortFilters;
  onFiltersChange: (filters: PortFilters) => void;
}

const statusOptions: { value: PortStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'congested', label: 'Congested' },
  { value: 'closed', label: 'Closed' },
  { value: 'partial', label: 'Partial' },
];

const congestionOptions: { value: CongestionLevel; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
  { value: 'severe', label: 'Severe' },
];

const regionOptions = [
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Africa',
  'Middle East',
  'Oceania',
];

export function Sidebar({
  ports,
  selectedPort,
  onPortSelect,
  filters,
  onFiltersChange,
}: SidebarProps) {
  const toggleStatus = (status: PortStatus) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const toggleCongestion = (level: CongestionLevel) => {
    const newLevels = filters.congestionLevel.includes(level)
      ? filters.congestionLevel.filter(l => l !== level)
      : [...filters.congestionLevel, level];
    onFiltersChange({ ...filters, congestionLevel: newLevels });
  };

  const toggleRegion = (region: string) => {
    const newRegions = filters.region.includes(region)
      ? filters.region.filter(r => r !== region)
      : [...filters.region, region];
    onFiltersChange({ ...filters, region: newRegions });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      congestionLevel: [],
      region: [],
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.congestionLevel.length > 0 ||
    filters.region.length > 0 ||
    filters.searchQuery.length > 0;

  return (
    <aside className="w-96 bg-gray-100 flex flex-col h-full">
      <div className="p-4 bg-white border-b">
        <input
          type="text"
          placeholder="Search ports..."
          value={filters.searchQuery}
          onChange={e => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <div className="flex flex-wrap gap-1">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    filters.status.includes(option.value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Congestion</p>
            <div className="flex flex-wrap gap-1">
              {congestionOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleCongestion(option.value)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    filters.congestionLevel.includes(option.value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Region</p>
            <div className="flex flex-wrap gap-1">
              {regionOptions.map(region => (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    filters.region.includes(region)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700">Ports ({ports.length})</h3>
        </div>
        <div className="space-y-3">
          {ports.map(port => (
            <PortCard
              key={port.id}
              port={port}
              isSelected={selectedPort?.id === port.id}
              onClick={() => onPortSelect(port)}
            />
          ))}
          {ports.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No ports match your filters
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
