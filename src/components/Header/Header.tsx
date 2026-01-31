interface HeaderProps {
  statistics: {
    total: number;
    byStatus: {
      open: number;
      congested: number;
      closed: number;
      partial: number;
    };
    avgWaitTime: number;
    totalVessels: number;
    alertCount: number;
  };
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
              <p className="text-slate-400 text-sm">Real-time port closures and congestion monitoring</p>
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
        <div className="flex items-center gap-6 text-sm overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-slate-400">Ports:</span>
            <span className="font-semibold">{statistics.total}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Open: {statistics.byStatus.open}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>Congested: {statistics.byStatus.congested}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Closed: {statistics.byStatus.closed}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span>Partial: {statistics.byStatus.partial}</span>
          </div>
          <div className="border-l border-slate-600 pl-4 flex items-center gap-2 whitespace-nowrap">
            <span className="text-slate-400">Avg Wait:</span>
            <span className="font-semibold">{statistics.avgWaitTime}h</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-slate-400">Vessels:</span>
            <span className="font-semibold">{statistics.totalVessels}</span>
          </div>
          {statistics.alertCount > 0 && (
            <div className="flex items-center gap-2 whitespace-nowrap text-red-400">
              <span>Alerts:</span>
              <span className="font-semibold">{statistics.alertCount}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
