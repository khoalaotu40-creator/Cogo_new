const fs = require('fs');
let content = fs.readFileSync('src/components/ride/Rides.tsx', 'utf8');

// The first patch script failed because of a template literal syntax error with backticks. Let's fix that.
// Let's rewrite the entire file to make it cleaner and exact.
const newContent = `import { useState, useEffect } from 'react';
import { Car, MapPin, Loader2, Info } from 'lucide-react';
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
      <div className="flex-1 absolute inset-0 z-50 bg-[#121415]">
        <RideTracking
          rideId={String(selectedRide.id_ride)}
          onBack={() => setSelectedRide(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-[#121415] flex flex-col relative font-sans">
      
      {/* Header */}
      <div className="px-5 pt-8 pb-4 border-transparent sticky top-0 bg-[#121415] z-10">
        <h1 className="text-[26px] font-bold text-white tracking-tight">Chuyến đi của bạn</h1>
      </div>
      
      {/* Tabs */}
      <div className="px-5 py-2">
        <div className="bg-[#1a1c1e] rounded-[16px] p-1 flex border border-white/5">
          <button 
            className={\`flex-1 py-3 text-[14px] font-bold rounded-[14px] transition-all \${rideSubTab === 'upcoming' ? 'bg-[#2ee6c2]/10 text-[#2ee6c2] border border-[#2ee6c2]/20 shadow-none' : 'text-gray-400 hover:text-gray-300'}\`}
            onClick={() => setRideSubTab('upcoming')}
          >
            Sắp tới
          </button>
          <button 
            className={\`flex-1 py-3 text-[14px] font-bold rounded-[14px] transition-all \${rideSubTab === 'history' ? 'bg-[#2ee6c2]/10 text-[#2ee6c2] border border-[#2ee6c2]/20 shadow-none' : 'text-gray-400 hover:text-gray-300'}\`}
            onClick={() => setRideSubTab('history')}
          >
            Lịch sử
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 mt-4 mb-8 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#2ee6c2]" />
          </div>
        ) : rides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 mt-10">
            <Car className="w-10 h-10 text-white/20 mb-5 stroke-[1.5]" />
            <p className="text-white/40 text-[15px] font-medium mb-6">Không có thêm chuyến đi nào</p>
          </div>
        ) : (
          <div className="space-y-5">
            {rides.map(ride => (
              <div 
                key={ride.id_ride} 
                onClick={() => setSelectedRide(ride)}
                className="bg-[#1c1c1e] border-l-[3px] border-l-[#2ee6c2] border-y border-r border-white/5 rounded-[16px] p-5 shadow-none hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden group"
              >
                {/* Header of card */}
                <div className="flex justify-between items-center mb-4">
                  <div className="bg-white/5 text-gray-300 border border-white/10 text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                    Chờ ghép xe
                  </div>
                  <div className="text-gray-400 text-[12px] font-medium">Hôm nay, 14:30</div>
                </div>

                {/* Timeline */}
                <div className="relative pl-2">
                  <div className="absolute left-[11.5px] top-[14px] bottom-[24px] w-[2px] bg-white/10"></div>
                  
                  {/* Pickup */}
                  {(ride.Diem_don || ride.pickup_location) && (
                    <div className="flex items-start gap-4 mb-5 relative z-10">
                      <div className="w-[8px] h-[8px] rounded-full border-[2.5px] border-[#2ee6c2] bg-[#1c1c1e] mt-[6px] shrink-0"></div>
                      <div>
                        <div className="text-[12px] font-medium text-gray-400 mb-0.5">Điểm đón</div>
                        <div className="text-[15px] font-bold text-white line-clamp-1">{(ride.Diem_don || ride.pickup_location).name || (ride.Diem_don || ride.pickup_location).address || 'Đang cập nhật'}</div>
                      </div>
                    </div>
                  )}

                  {/* Dropoff */}
                  {ride.Diem_den && (
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-[8px] h-[8px] rounded-full bg-[#2ee6c2] mt-[6px] shrink-0 shadow-[0_0_8px_rgba(46,230,194,0.5)]"></div>
                      <div>
                        <div className="text-[12px] font-medium text-gray-400 mb-0.5">Điểm đến</div>
                        <div className="text-[15px] font-bold text-white line-clamp-1">{ride.Diem_den.name || ride.Diem_den.address || 'Đang cập nhật'}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer with avatars and button */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
                  <div className="flex items-center">
                    <div className="w-[32px] h-[32px] rounded-full bg-white/10 border-2 border-[#1c1c1e] flex items-center justify-center text-xs text-white/50 z-20">?</div>
                    <div className="w-[32px] h-[32px] rounded-full bg-white/10 border-2 border-[#1c1c1e] flex items-center justify-center text-xs text-white/50 z-10 -ml-2">?</div>
                  </div>
                  <button className="px-5 py-2 rounded-full border border-white/10 text-white text-[13px] font-medium hover:bg-white/10 transition-colors group-hover:border-[#2ee6c2]/30 group-hover:text-[#2ee6c2]">
                    Chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/ride/Rides.tsx', newContent);
