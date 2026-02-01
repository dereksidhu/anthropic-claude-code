import { useState } from 'react';
import { Port } from './types/port';
import { usePorts } from './hooks/usePorts';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { PortMap } from './components/Map/PortMap';
import { PortDetails } from './components/Dashboard/PortDetails';

function App() {
  const { ports, filters, setFilters, statistics } = usePorts();
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);

  const handlePortSelect = (port: Port) => {
    setSelectedPort(prev => (prev?.id === port.id ? null : port));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header statistics={statistics} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          ports={ports}
          selectedPort={selectedPort}
          onPortSelect={handlePortSelect}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <main className="flex-1 relative">
          <PortMap
            ports={ports}
            selectedPort={selectedPort}
            onPortSelect={handlePortSelect}
          />
          {selectedPort && (
            <PortDetails
              port={selectedPort}
              onClose={() => setSelectedPort(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
