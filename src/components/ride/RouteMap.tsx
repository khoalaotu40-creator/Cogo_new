import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ArrowLeft, Clock, MapPin, Car, Navigation, ArrowRight } from 'lucide-react';
import type { Location } from '../../lib/api';

// Fix leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-png.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteMapProps {
  pickupLocation: Location;
  dropoffLocation: Location;
  onBack: () => void;
  onConfirm?: (distance?: number) => void;
  onJoin?: () => void;
  price?: number;
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

export default function RouteMap({ 
  pickupLocation, 
  dropoffLocation, 
  onBack, 
  onConfirm, 
  onJoin,
  price = 15000,
  mode = 'create', 
  ride 
}: RouteMapProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
  };

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickupLocation.lng},${pickupLocation.lat};${dropoffLocation.lng},${dropoffLocation.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
          );
          setRouteCoordinates(coordinates);
          setDistance(data.routes[0].distance);
          setDuration(data.routes[0].duration);
        }
      } catch (error) {
        console.error("Failed to fetch route", error);
        // Fallback straight line
        setRouteCoordinates([
          [pickupLocation.lat, pickupLocation.lng],
          [dropoffLocation.lat, dropoffLocation.lng]
        ]);
        
        // Rough estimate
        const R = 6371e3;
        const φ1 = pickupLocation.lat * Math.PI/180;
        const φ2 = dropoffLocation.lat * Math.PI/180;
        const Δφ = (dropoffLocation.lat-pickupLocation.lat) * Math.PI/180;
        const Δλ = (dropoffLocation.lng-pickupLocation.lng) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;
        
        setDistance(d);
        setDuration(Math.round(d / 10)); // rough estimate: 36km/h -> 10m/s
      }
    };

    fetchRoute();
  }, [pickupLocation, dropoffLocation]);

  const bounds = L.latLngBounds([
    [pickupLocation.lat, pickupLocation.lng],
    [dropoffLocation.lat, dropoffLocation.lng]
  ]);

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
    <div className="flex-1 bg-white flex flex-col h-full w-full relative select-none overflow-hidden">
      {/* Top Header Floating Buttons */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between pointer-events-none">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:bg-gray-50 active:scale-95 transition-all text-[#141b2c] border border-black/5"
          title="Trở về"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Quick info pill on top right */}
        {distance !== null && (
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md pointer-events-auto border border-black/5 flex items-center gap-2">
            <span className="text-[#006b47] font-bold text-[13px] flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              {formatDistance(distance)}
            </span>
            {duration !== null && (
              <span className="text-[#3f4a46] font-semibold text-[12px]">
                · {formatDuration(duration)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full relative z-0">
        <MapContainer 
          bounds={bounds} 
          scrollWheelZoom={true} 
          className="w-full h-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
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
              color="#006b47" 
              weight={5} 
              opacity={0.85}
            />
          )}
        </MapContainer>
      </div>

      {/* Route Info Bottom Panel (Collapsible / Expandable) */}
      <div 
        className={`bg-white rounded-t-[28px] shadow-[0_-8px_30px_rgba(20,27,44,0.12)] z-[1000] relative border-t border-[#eceeed] transition-all duration-300 ease-out flex flex-col shrink-0 ${
          isCollapsed ? 'p-4 pb-6 sm:pb-7' : 'p-4 pb-6 sm:pb-7'
        }`}
      >
        {/* Drag / Toggle Handle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center pt-1 pb-2 cursor-pointer group"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full group-hover:bg-gray-400 transition-colors"></div>
        </button>
        
        {isConfirming ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-[#006b47] rounded-full opacity-20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute inset-2 bg-[#006b47] rounded-full opacity-40 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
              <div className="absolute inset-4 bg-[#006b47] rounded-full opacity-60 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }}></div>
              <div className="absolute inset-5 bg-[#006b47] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,107,71,0.5)] z-10">
                <Car className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-[#141b2c] mb-1">Đang tìm tài xế...</h2>
            <p className="text-[12.5px] text-gray-500 text-center max-w-[240px]">
              Vui lòng đợi trong giây lát, hệ thống đang kết nối bạn với tài xế phù hợp.
            </p>
          </div>
        ) : isCollapsed ? (
          /* Mini Collapsed Summary Row with Price & Action */
          <div className="flex items-center justify-between pt-1">
            <div className="min-w-0 pr-2">
              <span className="text-[10.5px] text-[#8a9490] font-semibold block leading-none">Chi phí chia sẻ</span>
              <span className="text-[17px] font-bold text-[#006b47] leading-tight">
                {formatMoney(price)}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {mode === 'view' && onJoin ? (
                <button 
                  onClick={onJoin}
                  className="bg-[#006b47] hover:bg-[#00875a] text-white font-bold text-[13px] px-4 py-2 rounded-[12px] flex items-center gap-1.5 shadow-sm active:scale-98 transition-all"
                >
                  <span>Tham gia ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button 
                  onClick={onBack}
                  className="bg-[#e6f2ec] hover:bg-[#d5ebd0] text-[#006b47] font-bold text-[12.5px] px-3.5 py-1.5 rounded-full transition-colors"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Full Expanded Details */
          <div className="space-y-3 pt-1 animate-in fade-in duration-200">
            {/* Header: Title + Distance/Duration Badges */}
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-[#141b2c]">Chi tiết lộ trình</h2>
              <div className="flex items-center gap-2">
                {distance !== null && (
                  <div className="flex items-center gap-1 text-[#006b47] font-bold text-[12px] bg-[#e6f2ec] px-2.5 py-0.5 rounded-full">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{formatDistance(distance)}</span>
                  </div>
                )}
                {duration !== null && (
                  <div className="flex items-center gap-1 text-[#2f6fd8] font-bold text-[12px] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(duration)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Route Points */}
            <div className="bg-[#f9f9ff] rounded-[16px] p-3 border border-[#eceeed] space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2f6fd8] mt-1 shrink-0"></div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-bold text-[#141b2c] truncate">{pickupLocation.name}</div>
                  <div className="text-[11px] text-[#6f7a76] truncate">{pickupLocation.address || pickupLocation.name}</div>
                </div>
              </div>

              <div className="w-0.5 h-3 bg-[#d7ded9] ml-1"></div>

              <div className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#006b47] mt-1 shrink-0"></div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-bold text-[#141b2c] truncate">{dropoffLocation.name}</div>
                  <div className="text-[11px] text-[#6f7a76] truncate">{dropoffLocation.address || dropoffLocation.name}</div>
                </div>
              </div>
            </div>

            {/* Actions: View Mode or Create Mode */}
            {mode === 'create' && (
              <button 
                onClick={async () => {
                  setIsConfirming(true);
                  try {
                    if (onConfirm) await onConfirm(distance !== null ? distance : undefined);
                  } finally {
                    setIsConfirming(false);
                  }
                }}
                disabled={isConfirming}
                className="w-full bg-[#006b47] text-white font-bold text-[15px] py-3.5 rounded-[16px] shadow-md hover:bg-[#00875a] transition-all disabled:opacity-70 flex items-center justify-center active:scale-98"
              >
                {isConfirming ? "Đang tìm tài xế..." : "Xác nhận tạo chuyến"}
              </button>
            )}

            {mode === 'view' && (
              <div className="pt-2 border-t border-[#eceeed] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10.5px] text-[#8a9490] font-semibold block">Chi phí chia sẻ</span>
                  <span className="text-[19px] font-bold text-[#006b47]">
                    {formatMoney(price)}
                  </span>
                </div>

                <button 
                  onClick={onJoin || onBack}
                  className="flex-1 max-w-[200px] bg-[#006b47] hover:bg-[#00875a] text-white font-bold text-[14px] py-3 px-4 rounded-[14px] flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                >
                  <span>Tham gia ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
