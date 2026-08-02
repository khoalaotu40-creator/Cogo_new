import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { ArrowLeft } from 'lucide-react';
import { Ride, AcceptedRideData } from '../../types';
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
  const driverId = currentUser?.driver_id;
  const [currentTab, setCurrentTab] = useState<'home' | 'earnings'>('home');
  const [showVehicleRegistration, setShowVehicleRegistration] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationText, setLocationText] = useState("");
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
            setLocationText("Không thể lấy vị trí hiện tại");
            setIsLocating(false);
            setIsOnline(true);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setLocationText("Trình duyệt không hỗ trợ định vị");
        setIsLocating(false);
        setIsOnline(true);
      }
    }
  };

  return (
    <div className="h-full bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full bg-[#F5F7F8] h-full relative overflow-hidden flex flex-col">
        
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
                  onCompleteRide={() => setAcceptedRideData(null)} 
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
