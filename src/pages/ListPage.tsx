import { Port, PortFilters } from '../types/port';
import { PortCard } from '../components/PortCard/PortCard';
import { useState } from 'react';

interface ListPageProps {
  ports: Port[];
  selectedPort: Port | null;
  onPortSelect: (port: Port) => void;
  filters: PortFilters;
  onFiltersChange: (filters: PortFilters) => void;
}

export function ListPage({ ports, selectedPort, onPortSelect, filters, onFiltersChange }: ListPageProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-100">
      {/* Search and Filter Header */}
      <div className="bg-white border-b p-4 space-y-3">
        <input
          type="text"
          placeholder="Search ports..."
          value={filters.searchQuery}
          onChange={e => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-600 text-sm font-medium"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showFilters && (
          <div className="space-y-3 pt-2">
            {/* Status Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {(['open', 'congested', 'closed', 'partial'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      const newStatus = filters.status.includes(status)
                        ? filters.status.filter(s => s !== status)
                        : [...filters.status, status];
                      onFiltersChange({ ...filters, status: newStatus });
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm capitalize ${
                      filters.status.includes(status)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Congestion Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Congestion</p>
              <div className="flex flex-wrap gap-2">
                {(['none', 'low', 'moderate', 'high', 'severe'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => {
                      const newLevels = filters.congestionLevel.includes(level)
                        ? filters.congestionLevel.filter(l => l !== level)
                        : [...filters.congestionLevel, level];
                      onFiltersChange({ ...filters, congestionLevel: newLevels });
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm capitalize ${
                      filters.congestionLevel.includes(level)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(filters.status.length > 0 || filters.congestionLevel.length > 0) && (
              <button
                onClick={() => onFiltersChange({ ...filters, status: [], congestionLevel: [], region: [] })}
                className="text-red-600 text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Port Count */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <p className="text-sm text-gray-600">{ports.length} ports</p>
      </div>

      {/* Port List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {ports.map(port => (
          <PortCard
            key={port.id}
            port={port}
            isSelected={selectedPort?.id === port.id}
            onClick={() => onPortSelect(port)}
          />
        ))}
        {ports.length === 0 && (
          <p className="text-center text-gray-500 py-8">No ports match your filters</p>
        )}
      </div>
    </div>
  );
}
