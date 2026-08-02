import { useState, useEffect } from 'react';
import { ArrowLeft, Car, Phone, MessageCircle, MapPin, Clock, Star, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../../../lib/api';

interface RideTrackingProps {
  rideId: string;
  onBack: () => void;
}

export default function RideTracking({ rideId, onBack }: RideTrackingProps) {
  const [trackingData, setTrackingData] = useState<any>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [eta, setEta] = useState<number | null>(null);

  const vehicleIcon = L.divIcon({
    className: 'custom-vehicle-icon',
    html: `
      <div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2.5px solid #00A550; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00A550" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });

  const userIcon = L.divIcon({
    className: 'custom-user-icon',
    html: `
      <div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2.5px solid #E43C32; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E43C32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
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
    let intervalId: any;
    const fetchTracking = async () => {
      try {
        const data = await api.rides.getTracking(rideId);
        setTrackingData(data);
        
        if (data && data.vehicle_location) {
          let startLng = data.vehicle_location.longitude;
          let startLat = data.vehicle_location.latitude;
          let endLng, endLat;
          
          if (data.status === 'Arriving') {
             endLng = data.Diem_don ? data.Diem_don.lng : data.user_location?.lng;
             endLat = data.Diem_don ? data.Diem_don.lat : data.user_location?.lat;
          } else {
             endLng = data.Diem_den ? data.Diem_den.lng : data.user_location?.lng;
             endLat = data.Diem_den ? data.Diem_den.lat : data.user_location?.lat;
          }
          
          if (endLng && endLat) {
              const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
              );
              const routeData = await response.json();
              if (routeData.routes && routeData.routes.length > 0) {
                const route = routeData.routes[0];
                const coords = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
                setRouteCoordinates(coords);
                setEta(Math.round(route.duration / 60));
              }
          }
        }
        
      } catch(e) {
        console.error("Tracking error:", e);
      }
    };
    
    fetchTracking();
    intervalId = setInterval(fetchTracking, 5000);
    return () => clearInterval(intervalId);
  }, [rideId]);

  if (!trackingData) {
    return <div className="h-full flex items-center justify-center bg-gray-50">Đang tải thông tin...</div>;
  }

  let startLng = trackingData.vehicle_location?.longitude || trackingData.Diem_don?.lng || 0;
  let startLat = trackingData.vehicle_location?.latitude || trackingData.Diem_don?.lat || 0;
  let endLng = trackingData.status === 'Arriving' ? (trackingData.Diem_don?.lng || 0) : (trackingData.Diem_den?.lng || 0);
  let endLat = trackingData.status === 'Arriving' ? (trackingData.Diem_don?.lat || 0) : (trackingData.Diem_den?.lat || 0);
  
  const mapCenterLat = (startLat && endLat) ? (startLat + endLat) / 2 : (startLat || endLat || 21.028511);
  const mapCenterLng = (startLng && endLng) ? (startLng + endLng) / 2 : (startLng || endLng || 105.804817);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 w-full z-[1000] p-4 pointer-events-none flex justify-between items-start">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 w-full relative z-0">
        <MapContainer 
          key={trackingData.status}
          center={[mapCenterLat, mapCenterLng]} 
          zoom={14} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[startLat, startLng]} icon={vehicleIcon} />
          {endLat !== 0 && (
              <Marker position={[endLat, endLng]} icon={trackingData.status === 'Arriving' ? userIcon : destIcon} />
          )}
          {routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="#00A550" weight={5} />
          )}
        </MapContainer>
      </div>

      {/* Info Panel */}
      <div className="bg-white rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-6 z-[1000] relative mt-[-20px] max-h-[60vh] overflow-y-auto">
        
        {trackingData.status === 'Completed' ? (
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[#00A550]" />
              </div>
            </div>
            <h2 className="text-[20px] font-bold text-center text-gray-900 mb-6">Chuyến đi đã hoàn thành</h2>
            
            <h3 className="font-bold text-gray-800 mb-3 text-[15px]">Tài xế</h3>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl mb-5 border border-gray-100">
              <div className="relative">
                 <img 
                   src={trackingData.driver_avatar || 'https://i.pravatar.cc/150?img=11'} 
                   alt={trackingData.driver_name}
                   className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                 />
                 <div className="absolute -bottom-1 -right-1 bg-white rounded-full flex items-center gap-0.5 px-1.5 py-0.5 shadow-sm border border-gray-100">
                   <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                   <span className="text-[10px] font-bold">{trackingData.driver_rating || '5.0'}</span>
                 </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[16px] text-gray-900 leading-tight">{trackingData.driver_name}</h3>
                <p className="text-[13px] text-gray-500">{trackingData.brand} • {trackingData.plate}</p>
              </div>
            </div>

            <h3 className="font-bold text-gray-800 mb-3 text-[15px]">Danh sách người trên xe</h3>
            <div className="flex flex-col gap-3 mb-6">
               {/* Just showing the requester as passenger for now, since it's a 1-on-1 ride system */}
               <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                 <img src={trackingData.passenger_avatar || 'https://i.pravatar.cc/150?img=12'} className="w-12 h-12 rounded-full object-cover" />
                 <div className="flex-1">
                   <h3 className="font-bold text-[15px] text-gray-900">{trackingData.passenger_name}</h3>
                   <p className="text-[13px] text-gray-500">{trackingData.passenger_phone}</p>
                 </div>
                 <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[12px] font-bold">Hành khách</div>
               </div>
            </div>

            <button onClick={onBack} className="w-full bg-[#00A550] text-white font-bold py-3.5 rounded-xl text-[15px] transition-colors hover:bg-[#008A43]">
              Về trang chủ
            </button>
          </div>
        ) : (
          <div>
            {/* Status & ETA */}
            <div className="flex justify-between items-center mb-5">
               <div>
                 <h2 className="text-[18px] font-bold text-gray-900">
                   {trackingData.status === 'Arriving' ? 'Tài xế đang đến' : 'Đang di chuyển'}
                 </h2>
                 {eta !== null && (
                   <p className="text-[14px] text-gray-500 font-medium">Khoảng {eta} phút ({eta} p)</p>
                 )}
               </div>
               <div className="bg-green-100 px-3 py-1.5 rounded-full text-[#00A550] font-bold text-[14px] flex items-center gap-1">
                 <Clock className="w-4 h-4" />
                 {eta} p
               </div>
            </div>

            {/* Driver Details */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl mb-5 border border-gray-100">
              <div className="relative">
                 <img 
                   src={trackingData.driver_avatar || 'https://i.pravatar.cc/150?img=11'} 
                   alt={trackingData.driver_name}
                   className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                 />
                 <div className="absolute -bottom-1 -right-1 bg-white rounded-full flex items-center gap-0.5 px-1.5 py-0.5 shadow-sm border border-gray-100">
                   <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                   <span className="text-[10px] font-bold">{trackingData.driver_rating || '5.0'}</span>
                 </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-[16px] text-gray-900 leading-tight">{trackingData.driver_name}</h3>
                <p className="text-[13px] text-gray-500">{trackingData.brand} • {trackingData.color}</p>
              </div>
              
              <div className="bg-[#f0f4ff] border border-[#d6e4ff] px-3 py-1.5 rounded-lg text-center min-w-[70px]">
                <p className="text-[14px] font-bold text-[#2f54eb]">{trackingData.plate}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-xl text-[15px] transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                Nhắn tin
              </button>
              <a 
                href={`tel:${trackingData.driver_phone}`} 
                className="flex-1 bg-[#00A550] hover:bg-[#008A43] text-white font-bold py-3.5 rounded-xl text-[15px] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-5 h-5" />
                Gọi điện
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
