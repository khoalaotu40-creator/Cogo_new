import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Star, MapPin, User, ChevronRight } from 'lucide-react';
import { api } from '../../lib/api';

interface AvailableRidesProps {
  onBack: () => void;
}

export default function AvailableRides({ onBack }: AvailableRidesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableRides, setAvailableRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableRides = async () => {
      try {
        const data = await api.rides.getAvailable();
        setAvailableRides(data);
      } catch (error) {
        console.error('Error fetching available rides:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableRides();
  }, []);

  const filteredRides = availableRides.filter((ride) => {
    const destName = ride.Diem_den?.name || '';
    return destName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex-1 bg-[#f0f2f5] flex flex-col h-full relative">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-1 -ml-1">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-[20px] font-bold text-[#008f55] tracking-tight">Chuyến đi hiện có</h1>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {/* Avatar placeholder if needed */}
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white shadow-sm border-b border-gray-100 sticky top-[60px] z-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-[18px] w-[18px] text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-[12px] bg-white text-[15px] focus:outline-none focus:ring-1 focus:ring-[#008f55] focus:border-[#008f55] shadow-sm"
            placeholder="Điểm đến (VD: Hà Nội)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Rides List */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 pb-[80px]">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : filteredRides.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Không tìm thấy chuyến đi nào.</div>
        ) : (
          filteredRides.map((ride) => (
            <div key={ride.id_ride} className="bg-white rounded-[16px] shadow-sm overflow-hidden border border-gray-100">
              {/* Driver Info & Price */}
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={ride.avatar_url || "https://i.pravatar.cc/150?img=3"} alt={ride.driver_name || ride.phone} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-[16px] text-gray-900 leading-tight">{ride.driver_name || ride.phone}</h3>
                    <div className="flex items-center text-[13px] text-gray-500 mt-1">
                      <Star className="w-3.5 h-3.5 text-gray-400 fill-current mr-1" />
                      4.9 (120 chuyến)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#008f55] text-[16px] leading-tight">Thỏa thuận</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">/ ghế</div>
                </div>
              </div>

              {/* Route */}
              <div className="p-4 relative">
                <div className="absolute left-[23px] top-[24px] bottom-[24px] w-[2px] bg-gray-200"></div>
                
                <div className="relative z-10 flex items-start mb-6">
                  <div className="w-4 h-4 rounded-full border-[2px] border-[#008f55] bg-white shrink-0 mt-1 mr-3 flex items-center justify-center">
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">ĐIỂM ĐÓN • {new Date(ride.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <div className="text-[15px] font-medium text-[#1a2b4b]">{ride.Diem_don?.name || ride.Diem_don?.address || "Đang cập nhật"}</div>
                  </div>
                </div>

                <div className="relative z-10 flex items-start">
                  <div className="w-4 h-4 rounded-full bg-[#008f55] shrink-0 mt-1 mr-3 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">ĐIỂM ĐẾN</div>
                    <div className="text-[15px] font-medium text-[#1a2b4b]">{ride.Diem_den?.name || ride.Diem_den?.address || "Đang cập nhật"}</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 text-[14px]">
                  <User className="w-[18px] h-[18px]" />
                  Còn 1 chỗ
                </div>
                <button className="bg-[#008f55] hover:bg-[#007a48] text-white px-6 py-2 rounded-full font-bold text-[14px] transition-colors shadow-sm">
                  Tham gia
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
