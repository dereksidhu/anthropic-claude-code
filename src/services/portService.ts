import { Port, PortStatus, CongestionLevel } from '../types/port';
import { initialPorts } from '../data/ports';

const statusOptions: PortStatus[] = ['open', 'congested', 'closed', 'partial'];
const congestionOptions: CongestionLevel[] = ['none', 'low', 'moderate', 'high', 'severe'];

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
  const newStatus = randomChange(port.status, statusOptions, 0.05);
  const newCongestion = randomChange(port.congestionLevel, congestionOptions, 0.15);

  let waitTimeChange = (Math.random() - 0.5) * 10;
  let vesselCountChange = Math.floor((Math.random() - 0.5) * 6);

  if (newCongestion === 'severe') {
    waitTimeChange = Math.abs(waitTimeChange);
    vesselCountChange = Math.abs(vesselCountChange);
  } else if (newCongestion === 'none' || newCongestion === 'low') {
    waitTimeChange = -Math.abs(waitTimeChange);
    vesselCountChange = -Math.abs(vesselCountChange);
  }

  const newWaitTime = Math.max(0, Math.round(port.waitTime + waitTimeChange));
  const newVesselCount = Math.max(0, Math.min(port.capacity, port.vesselCount + vesselCountChange));

  return {
    ...port,
    status: newStatus === 'closed' ? newStatus : (newVesselCount > port.capacity * 0.9 ? 'congested' : newStatus),
    congestionLevel: newCongestion,
    waitTime: newWaitTime,
    vesselCount: newVesselCount,
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
      const portsToUpdate = Math.ceil(this.ports.length * 0.3);
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

  getStatistics() {
    const total = this.ports.length;
    const byStatus = {
      open: this.ports.filter(p => p.status === 'open').length,
      congested: this.ports.filter(p => p.status === 'congested').length,
      closed: this.ports.filter(p => p.status === 'closed').length,
      partial: this.ports.filter(p => p.status === 'partial').length,
    };
    const avgWaitTime = Math.round(
      this.ports.reduce((sum, p) => sum + p.waitTime, 0) / total
    );
    const totalVessels = this.ports.reduce((sum, p) => sum + p.vesselCount, 0);
    const alertCount = this.ports.reduce((sum, p) => sum + p.alerts.length, 0);

    return {
      total,
      byStatus,
      avgWaitTime,
      totalVessels,
      alertCount,
    };
  }
}

export const portService = new PortService();
