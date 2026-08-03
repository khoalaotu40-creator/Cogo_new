import { useState, useEffect } from 'react';
import L from 'leaflet';
import { Loader2, MapPin, Power } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { AcceptedRideData } from '../../types';

interface MapSectionProps {
  isOnline: boolean;
  isLocating: boolean;
  locationText: string;
  acceptedRideData: AcceptedRideData | null;
  onToggleConnect: () => void;
}

export function MapSection({
  isOnline,
  isLocating,
  locationText,
  acceptedRideData,
  onToggleConnect
}: MapSectionProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  // Create custom icons
const vehicleIcon = L.divIcon({
    className: 'custom-vehicle-icon',
    html: `
      <div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 3px 8px rgba(0,0,0,0.25); border: 2px solid #00A550; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00A550" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

const userIcon = L.divIcon({
    className: 'custom-user-icon',
    html: `
      <div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 3px 8px rgba(0,0,0,0.25); border: 2px solid #E43C32; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E43C32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });



  const destIcon = L.divIcon({
    className: 'custom-dest-icon',
    html: `
      <div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2.5px solid #3b82f6; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });

useEffect(() => {
    if (acceptedRideData) {
      const fetchRoute = async () => {
        try {
          const waypoints: string[] = [];

          if (acceptedRideData.vehicle_location) {
            const startLng = acceptedRideData.vehicle_location.longitude;
            const startLat = acceptedRideData.vehicle_location.latitude;
            if (startLng && startLat) waypoints.push(`${startLng},${startLat}`);
          }

          if (acceptedRideData.Diem_don && acceptedRideData.Diem_don.lng && acceptedRideData.Diem_don.lat) {
            waypoints.push(`${acceptedRideData.Diem_don.lng},${acceptedRideData.Diem_don.lat}`);
          }

          if (Array.isArray(acceptedRideData.passengers_pickups)) {
            acceptedRideData.passengers_pickups.forEach((p: any) => {
              if (p && p.lng && p.lat) {
                waypoints.push(`${p.lng},${p.lat}`);
              }
            });
          }

          if (acceptedRideData.Diem_den && acceptedRideData.Diem_den.lng && acceptedRideData.Diem_den.lat) {
            waypoints.push(`${acceptedRideData.Diem_den.lng},${acceptedRideData.Diem_den.lat}`);
          } else if (acceptedRideData.user_location?.lng && acceptedRideData.user_location?.lat) {
            waypoints.push(`${acceptedRideData.user_location.lng},${acceptedRideData.user_location.lat}`);


          }
          if (waypoints.length >= 2) {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${waypoints.join(';')}?overview=full&geometries=geojson`
            );
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
              const route = data.routes[0];
              const coords = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
              setRouteCoordinates(coords);
            }
          }
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      };
      fetchRoute();
    }
  }, [acceptedRideData]);

  return (
    <div className={`relative ${acceptedRideData ? 'h-full flex-1' : 'h-[280px] shrink-0'} bg-[#E8ECE7] overflow-hidden flex flex-col items-center pt-12 transition-all duration-500`}>
       {/* Map using React Leaflet or placeholder SVG */}
       <div className={`absolute inset-0 ${acceptedRideData ? 'z-10' : 'z-0'}`}>

          {acceptedRideData ? (() => {
            let startLng, startLat, endLng, endLat;
            startLng = acceptedRideData.vehicle_location.longitude;
            startLat = acceptedRideData.vehicle_location.latitude;

            if (acceptedRideData.status === 'Arriving') {
              endLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
              endLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
            } else {
              endLng = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lng : acceptedRideData.user_location.lng;
              endLat = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lat : acceptedRideData.user_location.lat;
            }
            return (
            <MapContainer 
              key={acceptedRideData.status}
              center={[(startLat + endLat) / 2, (startLng + endLng) / 2]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[startLat, startLng]} icon={vehicleIcon} />
              <Marker position={[endLat, endLng]} icon={acceptedRideData.status === 'Arriving' ? userIcon : destIcon} />
              {Array.isArray(acceptedRideData.passengers_pickups) && acceptedRideData.passengers_pickups.map((p: any, idx: number) => (
                p && p.lat && p.lng ? (
                  <Marker key={idx} position={[p.lat, p.lng]} icon={userIcon} />
                ) : null
              ))}              
              <Polyline positions={routeCoordinates.length > 0 ? routeCoordinates : [
                [startLat, startLng],
                [endLat, endLng]
              ]} color="#00A550" weight={5} />
            </MapContainer>
            );
          })() : (
            <svg className="w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M-10,20 Q50,40 110,10" stroke="#A0AAB2" strokeWidth="1" fill="none" />
              <path d="M-10,60 Q40,90 110,50" stroke="#A0AAB2" strokeWidth="1.5" fill="none" />
              <path d="M30,-10 L50,110" stroke="#A0AAB2" strokeWidth="2" fill="none" />
              <path d="M70,-10 L55,110" stroke="#A0AAB2" strokeWidth="1" fill="none" />
              <path d="M0,80 L100,80" stroke="#A0AAB2" strokeWidth="0.5" fill="none" />
            </svg>
          )}
       </div>
       
       {!acceptedRideData && (
         <>
           {/* Power Button */}
           <button 
             onClick={onToggleConnect}
             disabled={isLocating}
             className={`${isOnline ? 'bg-[#E43C32] hover:bg-red-700' : 'bg-[#2D2D2D] hover:bg-black'} text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-bold text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-colors relative z-10`}
           >
             {isLocating ? (
               <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
             ) : (
               <Power className="w-5 h-5" strokeWidth={2.5} />
             )}
             {isLocating ? 'Đang kết nối...' : isOnline ? 'Tắt kết nối' : 'Bật kết nối'}
           </button>

           {/* Location Display */}
           <div className="relative z-10 mt-4 px-6 w-full max-w-[340px] flex justify-center">
              {isLocating && (
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm flex items-center gap-2 text-[13px] font-semibold text-gray-600 animate-pulse">
                  Đang tìm vị trí của bạn...
                </div>
              )}
              {isOnline && !isLocating && (
                <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-[1.25rem] shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center text-center w-full animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-1.5 text-[#00A550] mb-1">
                    <MapPin className="w-4 h-4" strokeWidth={2.5} />
                    <span className="text-[12px] font-bold uppercase tracking-wider">Vị trí hiện tại</span>
                  </div>
                  <p className="text-[14px] font-bold text-gray-800 leading-snug">{locationText}</p>
                </div>
              )}
           </div>
         </>
       )}
    </div>
  );
}
