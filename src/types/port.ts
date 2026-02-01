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
  waitTime: number; // in hours
  vesselCount: number;
  capacity: number;
  lastUpdated: Date;
  alerts: PortAlert[];
}

export interface PortAlert {
  id: string;
  type: 'weather' | 'strike' | 'maintenance' | 'security' | 'capacity' | 'other';
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
