import { useState, useEffect } from 'react';
import { Car, MapPin, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import RideTracking from './RideTracking';

interface RidesProps {
  onFindRide: () => void;
}

export default function Rides({ onFindRide }: RidesProps) {
  const [rideSubTab, setRideSubTab] = useState('upcoming');
  const [rides, setRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<any>(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');
        const userId = user.id || user.id_user;
        if (!userId || isNaN(Number(userId))) {
          // invalid session
          return;
        }
        if (userId) {
          const fetchedRides = await api.rides.getByUserId(userId);
          setRides(fetchedRides);
        }
      } catch (error: any) {
        console.error('Failed to fetch rides:', error);
        if (error.message && error.message.includes('401')) {
          localStorage.removeItem('cogo_user');
          window.location.reload();
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchRides();
  }, []);

  if (selectedRide) {
    return (
      <div className="flex-1 absolute inset-0 z-50 bg-white">
        <RideTracking
          rideId={String(selectedRide.id_ride)}
          onBack={() => setSelectedRide(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-white flex flex-col relative">
      <div className="px-4 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h1 className="text-[22px] font-bold text-gray-900">Chuyến đi của bạn</h1>
      </div>
      
      <div className="px-4 py-4">
        <div className="bg-[#f0f4eb] rounded-full p-1 flex shadow-inner">
          <button 
            className={`flex-1 py-2.5 text-[15px] font-semibold rounded-full transition-all ${rideSubTab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRideSubTab('upcoming')}
          >
            Sắp tới
          </button>
          <button 
            className={`flex-1 py-2.5 text-[15px] font-semibold rounded-full transition-all ${rideSubTab === 'history' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRideSubTab('history')}
          >
            Lịch sử
          </button>
        </div>
      </div>

      <div className="px-4 mt-2 mb-8 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#008f55]" />
          </div>
        ) : rides.length === 0 ? (
          <div className="border-[1.5px] border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center py-16 px-4">
            <Car className="w-10 h-10 text-gray-600 mb-5 stroke-[1.5]" />
            <p className="text-gray-500 text-[15px] mb-5">Bạn chưa có chuyến đi nào sắp tới.</p>
            <button 
              onClick={onFindRide}
              className="text-[#008f55] font-semibold text-[15px] flex items-center gap-1 hover:opacity-80 transition-opacity">
              Tìm chuyến ngay <span className="text-lg leading-none mt-[-2px]">→</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map(ride => (
              <div 
                key={ride.id_ride} 
                onClick={() => setSelectedRide(ride)}
                className="border border-gray-200 rounded-[24px] p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="bg-green-100 text-[#008f55] text-xs font-bold px-3 py-1 rounded-full">Sắp khởi hành</div>
                  <div className="text-gray-500 text-xs">Mã chuyến: {ride.id_ride.toString().substring(0, 8)}...</div>
                </div>

                {(ride.Diem_don || ride.pickup_location) && (
                  <div className="flex items-start gap-3 mt-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Điểm đón: {(ride.Diem_don || ride.pickup_location).name || 'Đang cập nhật'}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{(ride.Diem_don || ride.pickup_location).address}</div>
                    </div>
                  </div>
                )}
                {ride.Diem_den && (
                  <div className="flex items-start gap-3 mt-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                       <MapPin className="w-3.5 h-3.5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Điểm đến: {ride.Diem_den.name || 'Đang cập nhật'}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ride.Diem_den.address}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Car className="w-4 h-4 text-gray-600" />
                  <span className="text-[14px] font-medium text-gray-800">Chờ ghép xe</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
