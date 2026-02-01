import { Port, PortStatus, CongestionLevel, PortStatistics } from '../types/port';
import { initialPorts } from '../data/ports';

const statusOptions: PortStatus[] = ['open', 'congested', 'closed', 'partial'];
const congestionOptions: CongestionLevel[] = ['none', 'low', 'moderate', 'high', 'severe'];
const trendOptions: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];

function randomChange<T>(current: T, options: T[], changeChance: number = 0.1): T {
  if (Math.random() < changeChance) {
    const currentIndex = options.indexOf(current);
    const direction = Math.random() > 0.5 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(options.length - 1, currentIndex + direction));
    return options[newIndex];
  }
  return current;
}

function simulatePortUpdate(port: Port): Port {
  const newStatus = randomChange(port.status, statusOptions, 0.03);
  const newCongestion = randomChange(port.congestionLevel, congestionOptions, 0.12);

  // Simulate wait time changes based on congestion
  let waitTimeChange = (Math.random() - 0.5) * 8;
  let vesselCountChange = Math.floor((Math.random() - 0.5) * 4);
  let anchorageChange = Math.floor((Math.random() - 0.5) * 3);

  if (newCongestion === 'severe' || newCongestion === 'high') {
    waitTimeChange = Math.abs(waitTimeChange) * 1.5;
    vesselCountChange = Math.abs(vesselCountChange);
    anchorageChange = Math.abs(anchorageChange);
  } else if (newCongestion === 'none' || newCongestion === 'low') {
    waitTimeChange = -Math.abs(waitTimeChange);
    vesselCountChange = -Math.abs(vesselCountChange);
    anchorageChange = -Math.abs(anchorageChange);
  }

  const newWaitTime = Math.max(0, Math.round(port.waitTime + waitTimeChange));
  const newVesselCount = Math.max(0, Math.min(port.capacity, port.vesselCount + vesselCountChange));
  const newAnchorageCount = Math.max(0, port.anchorageCount + anchorageChange);

  // Simulate throughput variations (±5%)
  const throughputVariation = 1 + (Math.random() - 0.5) * 0.1;
  const newThroughput = {
    ...port.throughput,
    teuDaily: Math.round(port.throughput.teuDaily * throughputVariation),
    importVolume: Math.round(port.throughput.importVolume * throughputVariation),
    exportVolume: Math.round(port.throughput.exportVolume * throughputVariation),
  };

  // Simulate port calls variation
  const callsVariation = 1 + (Math.random() - 0.5) * 0.15;
  const newPortCalls = {
    ...port.portCalls,
    daily: Math.round(port.portCalls.daily * callsVariation),
    trend: randomChange(port.portCalls.trend, trendOptions, 0.1),
    trendPercent: port.portCalls.trendPercent + (Math.random() - 0.5) * 2,
  };

  // Update berth occupancy based on vessel count
  const newBerthOccupancy = Math.min(100, Math.round((newVesselCount / port.capacity) * 100));

  // Determine status based on metrics
  let finalStatus = newStatus;
  if (newStatus !== 'closed') {
    if (newBerthOccupancy > 90 || newAnchorageCount > 20) {
      finalStatus = 'congested';
    } else if (newBerthOccupancy > 75 || newAnchorageCount > 10) {
      finalStatus = port.status === 'partial' ? 'partial' : 'open';
    }
  }

  return {
    ...port,
    status: finalStatus,
    congestionLevel: newCongestion,
    waitTime: newWaitTime,
    vesselCount: newVesselCount,
    anchorageCount: newAnchorageCount,
    berthOccupancy: newBerthOccupancy,
    throughput: newThroughput,
    portCalls: newPortCalls,
    dwellTime: Math.max(1, port.dwellTime + (Math.random() - 0.5) * 0.3),
    lastUpdated: new Date(),
  };
}

class PortService {
  private ports: Port[] = [...initialPorts];
  private listeners: ((ports: Port[]) => void)[] = [];
  private intervalId: number | null = null;

  getPorts(): Port[] {
    return this.ports;
  }

  getPortById(id: string): Port | undefined {
    return this.ports.find(port => port.id === id);
  }

  subscribe(listener: (ports: Port[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  startRealTimeUpdates(intervalMs: number = 5000): void {
    if (this.intervalId) return;

    this.intervalId = window.setInterval(() => {
      // Update ~25% of ports each interval
      const portsToUpdate = Math.ceil(this.ports.length * 0.25);
      const indices = new Set<number>();

      while (indices.size < portsToUpdate) {
        indices.add(Math.floor(Math.random() * this.ports.length));
      }

      this.ports = this.ports.map((port, index) =>
        indices.has(index) ? simulatePortUpdate(port) : port
      );

      this.notifyListeners();
    }, intervalMs);
  }

  stopRealTimeUpdates(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.ports));
  }

  getStatistics(): PortStatistics {
    const total = this.ports.length;
    const openPorts = this.ports.filter(p => p.status === 'open').length;
    const congestedPorts = this.ports.filter(p => p.status === 'congested').length;
    const closedPorts = this.ports.filter(p => p.status === 'closed').length;
    const partialPorts = this.ports.filter(p => p.status === 'partial').length;

    const totalTEU = this.ports.reduce((sum, p) => sum + p.throughput.teuDaily, 0);
    const totalPortCalls = this.ports.reduce((sum, p) => sum + p.portCalls.daily, 0);
    const avgWaitTime = Math.round(
      this.ports.reduce((sum, p) => sum + p.waitTime, 0) / total
    );

    return {
      totalPorts: total,
      openPorts,
      congestedPorts,
      closedPorts,
      partialPorts,
      totalTEU,
      totalPortCalls,
      avgWaitTime,
    };
  }

  // Additional helper methods for the new metrics
  getTopPortsByThroughput(limit: number = 10): Port[] {
    return [...this.ports]
      .sort((a, b) => b.throughput.teuAnnual - a.throughput.teuAnnual)
      .slice(0, limit);
  }

  getCongestedPorts(): Port[] {
    return this.ports.filter(p => p.status === 'congested' || p.congestionLevel === 'severe' || p.congestionLevel === 'high');
  }

  getPortsWithAlerts(): Port[] {
    return this.ports.filter(p => p.alerts.length > 0);
  }
}

export const portService = new PortService();
