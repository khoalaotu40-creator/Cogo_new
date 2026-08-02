import { CheckCircle2, Phone } from 'lucide-react';
import { AcceptedRideData } from '../../types';

interface AcceptedRideCardProps {
  acceptedRideData: AcceptedRideData;
  onCompleteRide: () => void;
  onPickupRide: () => void;
}

export function AcceptedRideCard({ acceptedRideData, onCompleteRide , onPickupRide }: AcceptedRideCardProps) {
  return (
    <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-5 mx-2 mb-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-[#00A550]">
          <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
          <span className="font-bold text-[16px]">{acceptedRideData.status === 'Arriving' ? 'Đang đón khách' : 'Đang chở khách'}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <Phone className="w-4 h-4 text-gray-600" />
          <span className="text-[14px] font-bold text-gray-800">{acceptedRideData.phone}</span>
        </div>
      </div>
      
      <div className="flex gap-3 mb-5 bg-gray-50 p-3 rounded-xl">
        <div className="mt-1 flex flex-col items-center">
           <div className="w-3 h-3 rounded-full bg-[#00A550]"></div>
           <div className="w-0.5 h-6 bg-gray-300 my-1"></div>
           <div className="w-3 h-3 rounded-full border-[3px] border-[#E43C32] bg-white"></div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="mb-2">
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
              {acceptedRideData.status === 'Arriving' ? 'Vị trí của bạn' : 'Điểm đón'}
            </div>
            <div className="text-[14px] font-bold text-gray-800 truncate">
              {acceptedRideData.status === 'Arriving' 
                ? acceptedRideData.vehicle_location.address 
                : (acceptedRideData.Diem_don?.address || acceptedRideData.user_location.address)}
            </div>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
              {acceptedRideData.status === 'Arriving' ? 'Điểm đón' : 'Điểm đến'}
            </div>
            <div className="text-[14px] font-bold text-gray-800 truncate">
              {acceptedRideData.status === 'Arriving'
                ? (acceptedRideData.Diem_don?.address || acceptedRideData.user_location.address || "Vị trí khách hàng")
                : (acceptedRideData.Diem_den?.address || "Vị trí điểm đến")}
            </div>
          </div>
        </div>
      </div>
      
      {acceptedRideData.status === 'Arriving' ? (
        <button 
          onClick={onPickupRide}
          className="w-full bg-[#00A550] text-white font-bold py-3.5 rounded-xl text-[15px] hover:bg-[#008A43] shadow-[0_4px_12px_rgba(0,165,80,0.25)] transition-all active:scale-[0.98]"
        >
          Đón người dùng thành công
        </button>
      ) : (
        <button 
          onClick={onCompleteRide}
          className="w-full bg-[#E43C32] text-white font-bold py-3.5 rounded-xl text-[15px] hover:bg-red-700 shadow-[0_4px_12px_rgba(228,60,50,0.25)] transition-all active:scale-[0.98]"
        >
          Hoàn thành cuốc
        </button>
      )}
    </div>
  );
}
