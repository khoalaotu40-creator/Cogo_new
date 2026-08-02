import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ArrowLeft, Zap, Clock, MapPin, Car } from 'lucide-react';
import type { Location } from '../../../lib/api';

// Fix leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteMapProps {
  pickupLocation: Location;
  dropoffLocation: Location;
  onBack: () => void;
  onConfirm?: () => void;
  mode?: 'create' | 'view';
  ride?: any;
}

// Component to adjust map view to fit bounds
function ChangeView({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function RouteMap({ pickupLocation, dropoffLocation, onBack, onConfirm, mode = 'create', ride }: RouteMapProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickupLocation.lng},${pickupLocation.lat};${dropoffLocation.lng},${dropoffLocation.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          // OSRM returns coordinates as [lng, lat], Leaflet needs [lat, lng]
          const coords = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
          setRouteCoordinates(coords);
          setDistance(route.distance); // in meters
          setDuration(route.duration); // in seconds
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        // Fallback to simple line
        setRouteCoordinates([
          [pickupLocation.lat, pickupLocation.lng],
          [dropoffLocation.lat, dropoffLocation.lng]
        ]);
      }
    };

    fetchRoute();
  }, [pickupLocation, dropoffLocation]);

  const bounds = L.latLngBounds(
    [pickupLocation.lat, pickupLocation.lng],
    [dropoffLocation.lat, dropoffLocation.lng]
  );
  if (routeCoordinates.length > 0) {
    routeCoordinates.forEach(coord => bounds.extend(coord as [number, number]));
  }

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} p`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}p`;
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full relative">
      {/* Header overlay */}
      <div className="absolute top-0 w-full z-[1000] p-4 pointer-events-none">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full relative z-0">
        <MapContainer 
          bounds={bounds} 
          scrollWheelZoom={true} 
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView bounds={bounds} />
          
          <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
            <Popup>
              <div className="font-semibold text-sm">Điểm đón</div>
              <div className="text-xs text-gray-600">{pickupLocation.address || pickupLocation.name}</div>
            </Popup>
          </Marker>

          <Marker position={[dropoffLocation.lat, dropoffLocation.lng]}>
            <Popup>
              <div className="font-semibold text-sm">Điểm đến</div>
              <div className="text-xs text-gray-600">{dropoffLocation.address || dropoffLocation.name}</div>
            </Popup>
          </Marker>

          {routeCoordinates.length > 0 && (
            <Polyline 
              positions={routeCoordinates} 
              color="#008f55" 
              weight={5} 
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>

      {/* Route Info Bottom Panel */}
      <div className="bg-white rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-6 z-[1000] relative mt-[-20px]">
        
        {isConfirming ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-[#008f55] rounded-full opacity-20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute inset-2 bg-[#008f55] rounded-full opacity-40 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
              <div className="absolute inset-4 bg-[#008f55] rounded-full opacity-60 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }}></div>
              <div className="absolute inset-6 bg-[#008f55] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,143,85,0.5)] z-10">
                <Car className="w-7 h-7 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Đang tìm tài xế...</h2>
            <p className="text-[13px] text-gray-500 text-center max-w-[250px]">
              Vui lòng đợi trong giây lát, hệ thống đang kết nối bạn với tài xế phù hợp gần nhất.
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

        
        {mode === 'view' && ride && (
          <div className="flex justify-between items-center mb-4">
            <div className="bg-green-100 text-[#008f55] text-xs font-bold px-3 py-1 rounded-full">Sắp khởi hành</div>
            <div className="text-gray-500 text-xs">Mã chuyến: {ride.id_ride?.toString().substring(0, 8)}...</div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Chi tiết lộ trình</h2>
          <div className="flex gap-4">
            {distance !== null && (
              <div className="flex items-center gap-1.5 text-[#008f55] font-semibold bg-green-50 px-3 py-1.5 rounded-full">
                <MapPin className="w-4 h-4" />
                <span>{formatDistance(distance)}</span>
              </div>
            )}
            {duration !== null && (
              <div className="flex items-center gap-1.5 text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(duration)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{pickupLocation.name}</div>
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{pickupLocation.address}</div>
            </div>
          </div>
          <div className="w-0.5 h-6 bg-gray-200 ml-3"></div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
               <MapPin className="w-3.5 h-3.5 text-red-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{dropoffLocation.name}</div>
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{dropoffLocation.address}</div>
            </div>
          </div>
        </div>

        </>
        )}
        {mode === 'create' && !isConfirming && (
          <button 
            onClick={async () => {
              setIsConfirming(true);
              try {
                if (onConfirm) await onConfirm();
              } finally {
                setIsConfirming(false);
              }
            }}
            disabled={isConfirming}
            className="w-full bg-[#008f55] text-white font-bold text-[16px] py-3.5 rounded-full shadow-md hover:bg-[#00824d] transition-colors disabled:opacity-70 flex items-center justify-center"
          >
            {isConfirming ? "Đang tìm tài xế..." : "Xác nhận tạo chuyến"}
          </button>
        )}
        {mode === 'view' && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Chờ ghép xe</span>
            </div>
            <button 
              onClick={onBack}
              className="w-full bg-[#f4f6fc] text-[#4a5568] font-bold text-[16px] py-3.5 rounded-full shadow-sm hover:bg-[#eef1f8] transition-colors flex items-center justify-center"
            >
              Trở về
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
