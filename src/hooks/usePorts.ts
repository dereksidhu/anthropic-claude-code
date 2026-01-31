import { useState, useEffect } from 'react';
import { Port, PortFilters } from '../types/port';
import { portService } from '../services/portService';

export function usePorts() {
  const [ports, setPorts] = useState<Port[]>(portService.getPorts());
  const [filters, setFilters] = useState<PortFilters>({
    status: [],
    congestionLevel: [],
    region: [],
    searchQuery: '',
  });

  useEffect(() => {
    const unsubscribe = portService.subscribe(setPorts);
    portService.startRealTimeUpdates(5000);

    return () => {
      unsubscribe();
      portService.stopRealTimeUpdates();
    };
  }, []);

  const filteredPorts = ports.filter(port => {
    if (filters.status.length > 0 && !filters.status.includes(port.status)) {
      return false;
    }
    if (filters.congestionLevel.length > 0 && !filters.congestionLevel.includes(port.congestionLevel)) {
      return false;
    }
    if (filters.region.length > 0 && !filters.region.includes(port.region)) {
      return false;
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        port.name.toLowerCase().includes(query) ||
        port.country.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const statistics = portService.getStatistics();

  return {
    ports: filteredPorts,
    allPorts: ports,
    filters,
    setFilters,
    statistics,
  };
}
