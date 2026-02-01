import { PortStatistics } from '../../types/port';

interface HeaderProps {
  statistics: PortStatistics;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

export function Header({ statistics }: HeaderProps) {
  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚢</div>
            <div>
              <h1 className="text-xl font-bold">Global Port Status Tracker</h1>
              <p className="text-slate-400 text-sm">Top 50 ports by TEU throughput - Real-time monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-700 px-4 py-2">
        <div className="flex items-center gap-4 text-sm overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-slate-400">Ports:</span>
            <span className="font-semibold">{statistics.totalPorts}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span>{statistics.openPorts}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span>{statistics.congestedPorts}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>{statistics.closedPorts}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>{statistics.partialPorts}</span>
          </div>
          <div className="border-l border-slate-600 pl-4 flex items-center gap-2 whitespace-nowrap">
            <span className="text-slate-400">Daily TEU:</span>
            <span className="font-semibold text-blue-400">{formatNumber(statistics.totalTEU)}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-slate-400">Port Calls:</span>
            <span className="font-semibold">{formatNumber(statistics.totalPortCalls)}/day</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-slate-400">Avg Wait:</span>
            <span className={`font-semibold ${statistics.avgWaitTime > 30 ? 'text-yellow-400' : 'text-green-400'}`}>
              {statistics.avgWaitTime}h
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
