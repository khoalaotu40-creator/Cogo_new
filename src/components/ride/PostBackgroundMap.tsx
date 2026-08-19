import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leafet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
  isJoined?: boolean;
  pickupLocation: any;
  dropoffLocation: any;
}

function ChangeView({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

export default function PostBackgroundMap({ pickupLocation, dropoffLocation, isJoined = false }: Props) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickupLocation.lng},${pickupLocation.lat};${dropoffLocation.lng},${dropoffLocation.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
          setRouteCoordinates(coords);
        }
      } catch (error) {
        setRouteCoordinates([
          [pickupLocation.lat, pickupLocation.lng],
          [dropoffLocation.lat, dropoffLocation.lng]
        ]);
      }
    };
    if (pickupLocation && dropoffLocation && pickupLocation.lat && dropoffLocation.lat) {
      if (isJoined) {
        fetchRoute();
      } else {
        setRouteCoordinates([]);
      }
    }
  }, [pickupLocation, dropoffLocation, isJoined]);

  if (!pickupLocation || !dropoffLocation || !pickupLocation.lat || !dropoffLocation.lat) return null;

  const bounds = L.latLngBounds(
    [pickupLocation.lat, pickupLocation.lng],
    [dropoffLocation.lat, dropoffLocation.lng]
  );
  
  const areaBounds = bounds.pad(0.3);
  
  if (routeCoordinates.length > 0) {
    routeCoordinates.forEach(coord => bounds.extend(coord as [number, number]));
  }

  return (
    <MapContainer 
      bounds={isJoined ? bounds : areaBounds} 
      className="w-full h-full bg-[#121212]"
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ChangeView bounds={isJoined ? bounds : areaBounds} />
      {isJoined && routeCoordinates.length > 0 && (
        <Polyline 
          positions={routeCoordinates} 
          color="#2ee6c2" 
          weight={4} 
          opacity={0.8}
        />
      )}
      {!isJoined && (
        <Rectangle 
          bounds={areaBounds} 
          color="#2ee6c2" 
          weight={2} 
          fillOpacity={0.15} 
          dashArray="8, 8" 
        />
      )}
    </MapContainer>
  );
}
