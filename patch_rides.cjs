const fs = require('fs');
let content = fs.readFileSync('src/components/ride/Rides.tsx', 'utf8');

content = content.replace(
  /bg-white flex flex-col relative/,
  'bg-[#121415] flex flex-col relative font-sans'
);

content = content.replace(
  /border-gray-100 sticky top-0 bg-white z-10/,
  'border-transparent sticky top-0 bg-[#121415] z-10'
);

content = content.replace(
  /text-gray-900">Chuyến đi của bạn/,
  'text-white">Chuyến đi của bạn'
);

content = content.replace(
  /bg-\[#f0f4eb\] rounded-full p-1 flex shadow-inner/,
  'bg-[#1a1c1e] rounded-[16px] p-1 flex border border-white/5'
);

content = content.replace(
  /bg-white text-gray-900 shadow-sm border border-gray-200/g,
  'bg-[#2ee6c2]/10 text-[#2ee6c2] border border-[#2ee6c2]/20 shadow-none rounded-[14px]'
);

content = content.replace(
  /text-gray-500 hover:text-gray-700/g,
  'text-gray-400 hover:text-gray-300 rounded-[14px]'
);

content = content.replace(
  /border-\[1.5px\] border-dashed border-gray-200 rounded-\[32px\]/,
  'border-[1.5px] border-dashed border-white/10 rounded-[32px]'
);

content = content.replace(
  /text-gray-500 text-\[15px\] mb-5">Bạn chưa có chuyến đi nào sắp tới\./,
  'text-gray-400 text-[15px] mb-5">Không có thêm chuyến đi nào.'
);

content = content.replace(
  /text-\[#008f55\] font-semibold/,
  'text-[#2ee6c2] font-semibold'
);

content = content.replace(
  /border border-gray-200 rounded-\[24px\] p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer/g,
  'bg-[#1c1c1e] border-l-[3px] border-l-[#2ee6c2] border-y border-r border-white/5 rounded-[16px] p-4 shadow-none hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden'
);

content = content.replace(
  /bg-green-100 text-\[#008f55\]/,
  'bg-white/10 text-[#2ee6c2]'
);
content = content.replace(
  /Sắp khởi hành/,
  'Chờ ghép xe'
);

content = content.replace(
  /Mã chuyến: \{ride.id_ride.toString\(\).substring\(0, 8\)\}\.\.\./,
  'Hôm nay, 14:30' // Mock time for visual matching
);

// We need to replace the entire ride item content structure to match the new image
content = content.replace(
  /\{\(ride\.Diem_don \|\| ride\.pickup_location\) && \([\s\S]*?Chờ ghép xe<\/span>\s*<\/div>\s*<\/div>/g,
  \`{(ride.Diem_don || ride.pickup_location) && (
                  <div className="flex items-start gap-3 mt-4 relative">
                    <div className="w-[1px] bg-white/10 absolute top-5 bottom-[-16px] left-[7px]"></div>
                    <div className="w-4 h-4 rounded-full border-2 border-[#2ee6c2] bg-transparent flex items-center justify-center shrink-0 mt-0.5 z-10"></div>
                    <div>
                      <div className="text-[12px] font-medium text-gray-400">Điểm đón</div>
                      <div className="text-[15px] font-bold text-white mt-0.5 line-clamp-1">{(ride.Diem_don || ride.pickup_location).name || (ride.Diem_don || ride.pickup_location).address || 'Đang cập nhật'}</div>
                    </div>
                  </div>
                )}
                {ride.Diem_den && (
                  <div className="flex items-start gap-3 mt-4 mb-2 relative">
                    <div className="w-4 h-4 rounded-full bg-[#2ee6c2] flex items-center justify-center shrink-0 mt-0.5 z-10"></div>
                    <div>
                      <div className="text-[12px] font-medium text-gray-400">Điểm đến</div>
                      <div className="text-[15px] font-bold text-white mt-0.5 line-clamp-1">{ride.Diem_den.name || ride.Diem_den.address || 'Đang cập nhật'}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-[-8px]">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-2 border-[#1c1c1e] text-xs text-white z-20">?</div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-2 border-[#1c1c1e] text-xs text-white z-10 -ml-2">?</div>
                  </div>
                  <button className="px-4 py-1.5 rounded-full border border-white/20 text-white text-[13px] font-medium hover:bg-white/10 transition-colors">
                    Chi tiết
                  </button>
                </div>
              </div>\`
);

fs.writeFileSync('src/components/ride/Rides.tsx', content);
