import { Loader2, Car, Navigation, Phone } from 'lucide-react';
import { Ride } from '../../types';

interface OnlineRidesListProps {
  isLoadingRides: boolean;
  rides: Ride[];
  onAcceptRide: (rideId: string) => void;
}

export function OnlineRidesList({ isLoadingRides, rides, onAcceptRide }: OnlineRidesListProps) {
  return (
    <div className="flex flex-col gap-3 pb-4">
      {isLoadingRides && rides.length === 0 ? (
        <div className="bg-white rounded-[1.25rem] p-8 flex flex-col items-center justify-center border border-gray-100 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mb-3 text-[#00A550]" />
          <span className="text-[13px] font-medium">Đang tìm chuyến đi gần bạn...</span>
        </div>
      ) : rides.length > 0 ? (
        rides.map((ride) => (
          <div key={ride.id_ride} className="bg-white rounded-[1.25rem] shadow-[0_4px_15px_rgba(0,0,0,0.06)] border border-gray-100 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2.5 text-[#00A550]">
                <div className="bg-[#E5F6EC] p-1.5 rounded-full">
                  <Navigation className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-[14px]">Cuốc xe mới</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[12px] font-bold text-gray-600">{ride.phone}</span>
              </div>
            </div>
            
            <div className="flex gap-3 mb-4">
              <div className="mt-1 flex flex-col items-center">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#00A550]"></div>
                 <div className="w-0.5 h-6 bg-gray-200 my-1"></div>
                 <div className="w-2.5 h-2.5 rounded-full border-[2.5px] border-[#E43C32] bg-white"></div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-3">
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Điểm đón</div>
                  <div className="text-[14px] font-bold text-gray-800 leading-snug line-clamp-2">
                    {ride.location?.name || "Vị trí khách hàng"}
                    {ride.location?.address && <div className="text-[12px] font-medium text-gray-500 mt-0.5 truncate">{ride.location.address}</div>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl text-[14px] hover:bg-gray-200 transition-colors">
                Bỏ qua
              </button>
              <button 
                onClick={() => onAcceptRide(ride.id_ride)}
                className="flex-1 bg-[#00A550] text-white font-bold py-3 rounded-xl text-[14px] hover:bg-[#008A43] shadow-[0_4px_12px_rgba(0,165,80,0.25)] transition-all active:scale-[0.98]">
                Nhận cuốc
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-[1.25rem] p-8 flex flex-col items-center justify-center border border-gray-100 text-gray-400">
          <Car className="w-10 h-10 mb-3 text-gray-300" strokeWidth={1.5} />
          <span className="text-[13px] font-medium text-center">Hiện chưa có chuyến đi nào quanh đây.<br/>Vui lòng chờ trong giây lát.</span>
        </div>
      )}
    </div>
  );
}
