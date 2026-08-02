import { Car, CalendarCheck, CheckCircle2 } from 'lucide-react';

interface StatusCardProps {
  isOnline: boolean;
  onRegisterVehicle?: () => void;
  vehicles?: any[];
}

export function StatusCard({ isOnline, onRegisterVehicle, vehicles = [] }: StatusCardProps) {
  return (
    <div className="bg-white rounded-[1.25rem] shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100">
      <div className="px-4 py-3.5 flex items-center gap-2.5 border-b border-gray-100">
         <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-[#00A550] shadow-[0_0_4px_rgba(0,165,80,0.4)] animate-pulse' : 'bg-[#E43C32] shadow-[0_0_4px_rgba(228,60,50,0.4)]'}`}></div>
         <span className="font-bold text-[#1C1C1C] text-[15px]">
           {isOnline ? 'Bạn đang online. Đang tìm chuyến...' : 'Bạn đang offline.'}
         </span>
      </div>
      
      {!isOnline && (
        <div className="flex flex-col">
          <div className="px-2 py-5 flex justify-center gap-8 items-start animate-in fade-in zoom-in-95 duration-200">
            {/* Action 1 */}
            <div className="flex flex-col items-center gap-2" onClick={onRegisterVehicle}>
              <div className="w-[48px] h-[48px] rounded-full bg-[#F5F7F8] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <Car className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-semibold text-center text-gray-600 leading-tight">Đăng ký xe</span>
            </div>

            {/* Action 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-[48px] h-[48px] rounded-full bg-[#F5F7F8] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <CalendarCheck className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-semibold text-center text-gray-600 leading-tight">Lịch nhận<br/>cuốc</span>
            </div>
          </div>
          
          {vehicles.length > 0 && (
            <div className="px-4 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="text-[13px] font-bold text-gray-800 mb-2">Phương tiện đã đăng ký</h4>
              <div className="flex flex-col gap-2">
                {vehicles.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5 text-[#00A550]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[13px] text-gray-800 truncate">{v.name_vehicle}</div>
                      <div className="text-[11px] font-medium text-gray-500 mt-0.5">{v.type_vehicle}</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
