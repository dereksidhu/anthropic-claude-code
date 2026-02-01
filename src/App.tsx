import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Port } from './types/port';
import { usePorts } from './hooks/usePorts';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { BottomNav } from './components/Navigation/BottomNav';
import { MapPage } from './pages/MapPage';
import { ListPage } from './pages/ListPage';
import { PortMap } from './components/Map/PortMap';
import { PortDetails } from './components/Dashboard/PortDetails';

function AppContent() {
  const { ports, filters, setFilters, statistics } = usePorts();
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);

  const handlePortSelect = (port: Port) => {
    setSelectedPort(prev => (prev?.id === port.id ? null : port));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header statistics={statistics} />

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
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

      {/* Mobile Layout with Routes */}
      <div className="md:hidden flex-1 overflow-hidden pb-16">
        <Routes>
          <Route
            path="/"
            element={
              <ListPage
                ports={ports}
                selectedPort={selectedPort}
                onPortSelect={handlePortSelect}
                filters={filters}
                onFiltersChange={setFilters}
              />
            }
          />
          <Route
            path="/map"
            element={
              <MapPage
                ports={ports}
                selectedPort={selectedPort}
                onPortSelect={handlePortSelect}
              />
            }
          />
        </Routes>
      </div>

      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/anthropic-claude-code">
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
