import { TrendingUp, Car, Bike, Utensils, Percent } from 'lucide-react';

export function EarningsScreen() {
  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-[#F5F7F8] w-full">
      <div className="px-4 pt-12 pb-6 flex flex-col gap-6">
        
        {/* Top Earnings Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm relative overflow-hidden border border-gray-100">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-gray-500 text-sm font-medium mb-1">Tổng thu nhập hôm nay</h2>
            <div className="text-[32px] font-bold text-[#00A550] leading-tight mb-2">450.000đ</div>
            
            <div className="flex items-center gap-1.5 text-[#00A550] text-xs font-semibold mb-6">
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
              <span>+15% so với hôm qua</span>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <div>
                <div className="text-gray-400 text-xs font-medium mb-1">Số cuốc xe</div>
                <div className="text-gray-800 text-lg font-bold">12</div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-xs font-medium mb-1">Thời gian online</div>
                <div className="text-gray-800 text-lg font-bold">5h 30m</div>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div>
          <h3 className="text-gray-800 font-bold text-lg mb-4">Lịch sử thu nhập</h3>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 flex flex-col">
            {/* History Item 1 */}
            <div className="flex items-center justify-between p-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5 text-[#00A550]" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-800">GrabCar - #GC12345</div>
                  <div className="text-xs text-gray-500 mt-0.5">Hôm nay, 14:30</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-[#00A550]">+ 45.000đ</div>
                <div className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-[#00A550] text-[10px] font-bold rounded-full">
                  Hoàn thành
                </div>
              </div>
            </div>

            {/* History Item 2 */}
            <div className="flex items-center justify-between p-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Bike className="w-5 h-5 text-[#00A550]" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-800">GrabBike - #GB98765</div>
                  <div className="text-xs text-gray-500 mt-0.5">Hôm nay, 11:15</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-[#00A550]">+ 25.000đ</div>
                <div className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-[#00A550] text-[10px] font-bold rounded-full">
                  Hoàn thành
                </div>
              </div>
            </div>

            {/* History Item 3 */}
            <div className="flex items-center justify-between p-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-800">GrabFood - #GF45678</div>
                  <div className="text-xs text-gray-500 mt-0.5">Hôm qua, 19:45</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-[#00A550]">+ 32.000đ</div>
                <div className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-[#00A550] text-[10px] font-bold rounded-full">
                  Hoàn thành
                </div>
              </div>
            </div>

            {/* History Item 4 */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Percent className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-800">Chiết khấu ứng dụng</div>
                  <div className="text-xs text-gray-500 mt-0.5">Hôm qua, 23:59</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-gray-800">- 15.000đ</div>
                <div className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full">
                  Khấu trừ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full mt-2 py-3.5 rounded-xl border-2 border-[#00A550] text-[#00A550] font-bold text-sm hover:bg-emerald-50 transition-colors">
          Xem tất cả lịch sử
        </button>

      </div>
    </div>
  );
}
