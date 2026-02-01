import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Port, PortStatus } from '../../types/port';

interface PortMapProps {
  ports: Port[];
  selectedPort: Port | null;
  onPortSelect: (port: Port) => void;
}

const statusColors: Record<PortStatus, string> = {
  open: '#22c55e',
  congested: '#eab308',
  closed: '#ef4444',
  partial: '#f97316',
};

function createPortIcon(status: PortStatus, isSelected: boolean, rank: number): L.DivIcon {
  const size = isSelected ? 32 : 20;
  const fontSize = isSelected ? 10 : 8;

  return L.divIcon({
    className: 'custom-port-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${statusColors[status]};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${fontSize}px;
        font-weight: bold;
        cursor: pointer;
        ${isSelected ? 'animation: pulse 1.5s infinite; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);' : ''}
      ">${rank <= 10 ? rank : ''}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function PortMap({ ports, selectedPort, onPortSelect }: PortMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      worldCopyJump: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove markers for ports that no longer exist
    markersRef.current.forEach((marker, id) => {
      if (!ports.find(p => p.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Update or create markers
    ports.forEach(port => {
      const isSelected = selectedPort?.id === port.id;
      const icon = createPortIcon(port.status, isSelected, port.globalRank);

      let marker = markersRef.current.get(port.id);

      if (marker) {
        marker.setLatLng([port.coordinates.lat, port.coordinates.lng]);
        marker.setIcon(icon);
      } else {
        marker = L.marker([port.coordinates.lat, port.coordinates.lng], { icon })
          .addTo(map)
          .on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            onPortSelect(port);
          });

        markersRef.current.set(port.id, marker);
      }

      // Add tooltip on hover (not popup on click)
      marker.unbindTooltip();
      marker.bindTooltip(`
        <div style="text-align: center;">
          <strong>#${port.globalRank} ${port.name}</strong><br/>
          <span style="font-size: 11px; color: #666;">${port.country}</span><br/>
          <span style="
            display: inline-block;
            margin-top: 4px;
            background: ${statusColors[port.status]};
            color: white;
            padding: 1px 6px;
            border-radius: 8px;
            font-size: 10px;
          ">${port.status}</span>
          <span style="font-size: 11px; margin-left: 4px;">Wait: ${port.waitTime}h</span>
        </div>
      `, {
        direction: 'top',
        offset: [0, -10],
        className: 'port-tooltip',
      });
    });
  }, [ports, selectedPort, onPortSelect]);

  // Fly to selected port
  useEffect(() => {
    if (selectedPort && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedPort.coordinates.lat, selectedPort.coordinates.lng],
        6,
        { duration: 0.8 }
      );
    }
  }, [selectedPort]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] text-xs">
        <p className="font-semibold mb-2">Port Status</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>Congested</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Closed</span>
          </div>
        </div>
        <p className="mt-2 text-gray-500">Tap port for details</p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .port-tooltip {
          background: white;
          border: none;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          padding: 8px 12px;
        }
        .port-tooltip::before {
          border-top-color: white;
        }
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
}
