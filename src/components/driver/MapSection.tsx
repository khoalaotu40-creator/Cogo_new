import { Loader2, MapPin, Power } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { AcceptedRideData } from '../types';

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
  return (
    <div className={`relative ${acceptedRideData ? 'h-full flex-1' : 'h-[280px] shrink-0'} bg-[#E8ECE7] overflow-hidden flex flex-col items-center pt-12 transition-all duration-500`}>
       {/* Map using React Leaflet or placeholder SVG */}
       <div className={`absolute inset-0 ${acceptedRideData ? 'z-10' : 'z-0'}`}>
          {acceptedRideData ? (
            <MapContainer 
              center={[(acceptedRideData.vehicle_location.latitude + acceptedRideData.user_location.lat) / 2, (acceptedRideData.vehicle_location.longitude + acceptedRideData.user_location.lng) / 2]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[acceptedRideData.vehicle_location.latitude, acceptedRideData.vehicle_location.longitude]} />
              <Marker position={[acceptedRideData.user_location.lat, acceptedRideData.user_location.lng]} />
              <Polyline positions={[
                [acceptedRideData.vehicle_location.latitude, acceptedRideData.vehicle_location.longitude],
                [acceptedRideData.user_location.lat, acceptedRideData.user_location.lng]
              ]} color="#00A550" weight={4} dashArray="10, 10" />
            </MapContainer>
          ) : (
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
