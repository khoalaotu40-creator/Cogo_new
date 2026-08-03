import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { ArrowLeft, UserPlus } from 'lucide-react';
import { Ride, AcceptedRideData } from '../../types';
import { api } from '../../lib/api';
import { MapSection } from './MapSection';
import { AcceptedRideCard } from './AcceptedRideCard';
import { StatusCard } from './StatusCard';
import { OnlineRidesList } from './OnlineRidesList';
import { BottomNavigation } from './BottomNavigation';
import { EarningsScreen } from './EarningsScreen';
import { VehicleRegistrationScreen } from './VehicleRegistrationScreen';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DriverHome({ onBack }: { onBack?: () => void }) {
  const currentUser = JSON.parse(localStorage.getItem('cogo_user') || '{}');
  const driverId = currentUser?.id_user || currentUser?.driver_id;
  const [currentTab, setCurrentTab] = useState<'home' | 'earnings'>('home');

  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [acceptingRequest, setAcceptingRequest] = useState<number | null>(null);

  const [showVehicleRegistration, setShowVehicleRegistration] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoadingRides, setIsLoadingRides] = useState(false);
  const [acceptedRideData, setAcceptedRideData] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`/api/vehicles?driver_id=${driverId}`);
      const data = await res.json();
      if (data.status === 'ok') {
        setVehicles(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchAvailableRides = async () => {
    try {
      if (acceptedRideData) return; // Don't fetch if already in a ride
      const res = await fetch('/api/rides/available');
      const data = await res.json();
      if (Array.isArray(data)) {
        setRides(data);
      } else if (data.status === 'ok') {
        setRides(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    try {
      const res = await fetch('/api/rides/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_ride: rideId, driver_id: driverId })
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setAcceptedRideData(data.data);
        setRides([]); // Clear available rides
      } else {
        alert("Có lỗi xảy ra hoặc chuyến đi đã được nhận.");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối.");
    }
  };

  const updateVehicleStatus = async (statusParams: {
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    isOnline: boolean;
  }) => {
    try {
      await fetch('/api/vehicles/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...statusParams, driver_id: driverId })
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isOnline) {
      setIsLoadingRides(true);
      fetchAvailableRides().finally(() => setIsLoadingRides(false));
      intervalId = setInterval(fetchAvailableRides, 5000);
    } else {
      setRides([]);
    }

  return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnline]);

  const handleToggleConnect = () => {
    setConnectionError(null);
    if (!isOnline && vehicles.length === 0) {
      setConnectionError("Bạn cần đăng ký phương tiện trước khi bật kết nối!");
      setTimeout(() => setConnectionError(null), 3000);
      return;
    }
    
    if (isOnline) {
      setIsOnline(false);
      setLocationText("");
      updateVehicleStatus({
        latitude: null,
        longitude: null,
        address: null,
        isOnline: false
      });
    } else {
      setIsLocating(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`, {
                headers: {
                  'Accept-Language': 'vi'
                }
              });
              const data = await response.json();
              let locationAddress = "";
              if (data && data.display_name) {
                const addressParts = data.display_name.split(', ');
                locationAddress = addressParts.slice(0, 3).join(', ');
                setLocationText(locationAddress);
              } else {
                locationAddress = `Vĩ độ: ${latitude.toFixed(4)}, Kinh độ: ${longitude.toFixed(4)}`;
                setLocationText(locationAddress);
              }

              // Ghi lại vị trí vào Supabase
              updateVehicleStatus({
                latitude,
                longitude,
                address: locationAddress,
                isOnline: true
              });

            } catch (error) {
              setLocationText(`Vĩ độ: ${position.coords.latitude.toFixed(4)}, Kinh độ: ${position.coords.longitude.toFixed(4)}`);
            } finally {
              setIsLocating(false);
              setIsOnline(true);
            }
          },
          (error) => {
            console.error("Lỗi lấy vị trí:", error);
            const fallbackLat = 10.8700;
            const fallbackLng = 106.8000;
            const fallbackAddress = "Dĩ An, Bình Dương (Giả lập)";
            
            setLocationText(fallbackAddress);
            updateVehicleStatus({
              latitude: fallbackLat,
              longitude: fallbackLng,
              address: fallbackAddress,
              isOnline: true
            });
            setIsLocating(false);
            setIsOnline(true);
            setConnectionError("Dùng vị trí giả lập do không lấy được vị trí thực tế.");
            setTimeout(() => setConnectionError(null), 3000);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        const fallbackLat = 10.8700;
        const fallbackLng = 106.8000;
        const fallbackAddress = "Dĩ An, Bình Dương (Giả lập)";
        
        setLocationText(fallbackAddress);
        updateVehicleStatus({
          latitude: fallbackLat,
          longitude: fallbackLng,
          address: fallbackAddress,
          isOnline: true
        });
        setIsLocating(false);
        setIsOnline(true);
        setConnectionError("Trình duyệt không hỗ trợ. Dùng vị trí giả lập.");
        setTimeout(() => setConnectionError(null), 3000);
      }
    }
  };

  
  const handlePickupRide = async () => {
    if (!acceptedRideData) return;
    try {
      await api.rides.pickup(acceptedRideData.id_ride);
      setAcceptedRideData({ ...acceptedRideData, status: 'In Progress' });
    } catch (error) {
      console.error("Failed to pickup ride:", error);
      alert("Lỗi khi cập nhật trạng thái đón");
    }
  };

  const handleCompleteRide = async () => {
    if (!acceptedRideData) return;
    try {
      await api.rides.complete(acceptedRideData.id_ride);
      setAcceptedRideData(null);
      // Refresh available rides
      fetchAvailableRides();
    } catch (error) {
      console.error("Failed to complete ride:", error);
      alert("Lỗi khi hoàn thành chuyến đi");
    }
  };


  useEffect(() => {
    let interval: any;
    if (acceptedRideData && acceptedRideData.id_ride) {
      interval = setInterval(async () => {
        try {
          const reqs = await api.rides.getJoinRequestsForRide(acceptedRideData.id_ride);
          setJoinRequests(reqs);

          const updatedRide = await api.rides.getTracking(acceptedRideData.id_ride);
          if (updatedRide && updatedRide.id_ride) {
            setAcceptedRideData((prev: any) => ({
              ...prev,
              ...updatedRide,
            }));
          }


        } catch (e) {}
      }, 3000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [acceptedRideData?.id_ride]);

  const handleAcceptJoin = async (requestId: number) => {
    try {
      setAcceptingRequest(requestId);
      const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');
      await api.rides.acceptJoinRequest(requestId, user.id || user.id_user, 'driver');
      setJoinRequests(prev => prev.filter(req => req.id !== requestId));
      
      if (acceptedRideData?.id_ride) {
        const updatedRide = await api.rides.getTracking(acceptedRideData.id_ride);
        if (updatedRide && updatedRide.id_ride) {
          setAcceptedRideData((prev: any) => ({
            ...prev,
            ...updatedRide,
          }));
        }
      }      
      
      
      
      
      
      alert('Đã chấp nhận yêu cầu ghép chuyến');
    } catch (e) {
      alert('Lỗi khi chấp nhận');
    } finally {
      setAcceptingRequest(null);
    }
  };

  return (
    <div className="h-full bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full bg-[#F5F7F8] h-full relative overflow-hidden flex flex-col">

      {joinRequests.length > 0 && (
        <div className="absolute top-20 left-0 right-0 px-4 z-[400] flex flex-col gap-3 pointer-events-none">
          {joinRequests.map(req => (
            <div key={req.id} className="bg-white rounded-[16px] shadow-lg p-3 flex items-center justify-between pointer-events-auto border border-gray-100">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E5E9FF] flex items-center justify-center text-[#1a2b4b] font-medium text-lg">
                    {req.user_name ? req.user_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-[16px] text-gray-900 leading-tight mb-1">{req.user_name || 'Người dùng'}</div>
                    <div className="text-[13px] text-gray-600">
                      Cách bạn 500m • Gần điểm đến
                    </div>
                  </div>
               </div>
               <button 
                 onClick={() => handleAcceptJoin(req.id)}
                 disabled={acceptingRequest === req.id}
                 className="w-12 h-12 rounded-xl bg-[#c5ebd4] text-[#008f55] flex items-center justify-center hover:bg-[#a6dfbe] transition-colors flex-shrink-0 ml-2"
               >
                 {acceptingRequest === req.id ? (
                   <div className="w-5 h-5 border-2 border-[#008f55] border-t-transparent rounded-full animate-spin" />
                 ) : (
                   <UserPlus className="w-6 h-6" strokeWidth={2.5} />
                 )}
               </button>
            </div>
          ))}
        </div>
      )}

        
        
        {/* Connection Error Toast */}
        {connectionError && (
          <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-lg z-[1000] flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium">{connectionError}</span>
            </div>
            <button onClick={() => setConnectionError(null)} className="text-red-500 hover:text-red-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        {/* Scrollable Content Area */}
        {showVehicleRegistration ? (
          <VehicleRegistrationScreen 
            onBack={() => setShowVehicleRegistration(false)} 
            onSuccess={() => {
              fetchVehicles();
              setShowVehicleRegistration(false);
            }}
          />
        ) : currentTab === 'home' ? (
          <div className="flex-1 overflow-y-auto pb-24 no-scrollbar relative">
            
            
        <div className="absolute top-4 left-4 z-[1000]">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
        </div>

            <MapSection
              isOnline={isOnline}
              isLocating={isLocating}
              locationText={locationText}
              acceptedRideData={acceptedRideData}
              onToggleConnect={handleToggleConnect}
            />

            {/* Content overlaying the map */}
            <div className={`px-3 ${acceptedRideData ? 'absolute bottom-20 w-full z-20' : '-mt-6 relative z-20'} flex flex-col gap-3`}>
              
              {/* Accepted Ride Card */}
              {acceptedRideData && (
                <AcceptedRideCard 
                  acceptedRideData={acceptedRideData} 
                  onCompleteRide={handleCompleteRide}
                  onPickupRide={handlePickupRide} 
                />
              )}

              {!acceptedRideData && (
                <>
                  <StatusCard 
                    isOnline={isOnline} 
                    onRegisterVehicle={() => setShowVehicleRegistration(true)}
                    vehicles={vehicles}
                  />

                  {isOnline && (
                    <OnlineRidesList 
                      isLoadingRides={isLoadingRides} 
                      rides={rides} 
                      onAcceptRide={handleAcceptRide} 
                    />
                  )}
                </>
              )}

            </div>
          </div>
        ) : (
          <EarningsScreen />
        )}

        {!showVehicleRegistration && (
          <BottomNavigation currentTab={currentTab} onChangeTab={setCurrentTab} />
        )}
      </div>
    </div>
  );
}
