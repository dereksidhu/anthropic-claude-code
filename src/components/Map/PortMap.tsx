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

function createPortIcon(status: PortStatus, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 24 : 16;
  const borderWidth = isSelected ? 3 : 2;

  return L.divIcon({
    className: 'custom-port-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${statusColors[status]};
        border: ${borderWidth}px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ${isSelected ? 'animation: pulse 1.5s infinite;' : ''}
      "></div>
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
      maxZoom: 10,
      worldCopyJump: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

    markersRef.current.forEach((marker, id) => {
      if (!ports.find(p => p.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    ports.forEach(port => {
      const isSelected = selectedPort?.id === port.id;
      const icon = createPortIcon(port.status, isSelected);

      let marker = markersRef.current.get(port.id);

      if (marker) {
        marker.setLatLng([port.coordinates.lat, port.coordinates.lng]);
        marker.setIcon(icon);
      } else {
        marker = L.marker([port.coordinates.lat, port.coordinates.lng], { icon })
          .addTo(map)
          .on('click', () => onPortSelect(port));

        markersRef.current.set(port.id, marker);
      }

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${port.name}</h3>
          <p style="color: #666; font-size: 12px; margin-bottom: 8px;">${port.country}</p>
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <span style="
              background: ${statusColors[port.status]};
              color: white;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
            ">${port.status.charAt(0).toUpperCase() + port.status.slice(1)}</span>
          </div>
          <div style="font-size: 12px;">
            <p><strong>Wait Time:</strong> ${port.waitTime}h</p>
            <p><strong>Vessels:</strong> ${port.vesselCount}/${port.capacity}</p>
            <p><strong>Congestion:</strong> ${port.congestionLevel}</p>
          </div>
          ${port.alerts.length > 0 ? `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
              <p style="color: #ef4444; font-size: 12px;">
                ${port.alerts.length} active alert(s)
              </p>
            </div>
          ` : ''}
        </div>
      `);
    });
  }, [ports, selectedPort, onPortSelect]);

  useEffect(() => {
    if (selectedPort && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedPort.coordinates.lat, selectedPort.coordinates.lng],
        6,
        { duration: 1 }
      );
    }
  }, [selectedPort]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
