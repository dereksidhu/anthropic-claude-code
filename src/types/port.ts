export type PortStatus = 'open' | 'congested' | 'closed' | 'partial';

export type CongestionLevel = 'none' | 'low' | 'moderate' | 'high' | 'severe';

export interface Port {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: PortStatus;
  congestionLevel: CongestionLevel;

  // Throughput metrics (IMF PortWatch inspired)
  throughput: {
    teuAnnual: number;        // TEU (Twenty-foot Equivalent Units) per year in millions
    teuDaily: number;         // Average daily TEU
    importVolume: number;     // Daily import volume in metric tons
    exportVolume: number;     // Daily export volume in metric tons
  };

  // Activity metrics
  portCalls: {
    daily: number;            // Average daily port calls
    weekly: number;           // Weekly port calls
    trend: 'up' | 'down' | 'stable';  // Trend vs previous period
    trendPercent: number;     // Percentage change
  };

  // Congestion metrics
  waitTime: number;           // Average wait time in hours
  dwellTime: number;          // Average container dwell time in days
  anchorageCount: number;     // Vessels waiting at anchorage
  berthOccupancy: number;     // Percentage of berth utilization

  // Capacity
  vesselCount: number;        // Current vessels in port
  capacity: number;           // Maximum vessel capacity

  // Ranking
  globalRank: number;         // Global ranking by TEU throughput

  lastUpdated: Date;
  alerts: PortAlert[];
}

export interface PortAlert {
  id: string;
  type: 'weather' | 'strike' | 'maintenance' | 'security' | 'capacity' | 'geopolitical' | 'other';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  startDate: Date;
  endDate?: Date;
}

export interface PortFilters {
  status: PortStatus[];
  congestionLevel: CongestionLevel[];
  region: string[];
  searchQuery: string;
}

export interface PortStatistics {
  totalPorts: number;
  openPorts: number;
  congestedPorts: number;
  closedPorts: number;
  partialPorts: number;
  totalTEU: number;           // Total daily TEU across all ports
  totalPortCalls: number;     // Total daily port calls
  avgWaitTime: number;        // Average wait time across all ports
}
