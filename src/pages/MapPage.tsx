import { Port } from '../types/port';
import { PortMap } from '../components/Map/PortMap';
import { PortDetails } from '../components/Dashboard/PortDetails';

interface MapPageProps {
  ports: Port[];
  selectedPort: Port | null;
  onPortSelect: (port: Port) => void;
}

export function MapPage({ ports, selectedPort, onPortSelect }: MapPageProps) {
  return (
    <div className="flex-1 relative h-full">
      <PortMap
        ports={ports}
        selectedPort={selectedPort}
        onPortSelect={onPortSelect}
      />
      {selectedPort && (
        <PortDetails
          port={selectedPort}
          onClose={() => onPortSelect(selectedPort)}
        />
      )}
    </div>
  );
}
