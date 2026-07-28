import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, MapPin, Calendar, Repeat, Car, Bike, Plus, Minus, Navigation, Clock, Loader2 } from 'lucide-react';
import { api, Location } from '../../lib/api';
import RouteMap from './RouteMap';

interface FindRideFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function FindRideForm({ onBack, onSuccess }: FindRideFormProps) {
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [repeat, setRepeat] = useState('Thứ 2 - 6');
  const [vehicle, setVehicle] = useState('Bất kỳ');
  const [seats, setSeats] = useState(1);
  const [detour, setDetour] = useState(20);
  
  const [pickup, setPickup] = useState('');
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [pickupResults, setPickupResults] = useState<Location[]>([]);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const pickupRef = useRef<HTMLDivElement>(null);

  const [dropoff, setDropoff] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [dropoffResults, setDropoffResults] = useState<Location[]>([]);
  const [isSearchingDropoff, setIsSearchingDropoff] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const dropoffRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setShowPickupSuggestions(false);
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) {
        setShowDropoffSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickupRef, dropoffRef]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
  };

  // Debounced search for pickup
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (pickup.trim() && showPickupSuggestions) {
        setIsSearchingPickup(true);
        try {
          const results = await api.locations.suggest(pickup);
          setPickupResults(results);
        } catch (error) {
          console.error("Error fetching pickup suggestions:", error);
        } finally {
          setIsSearchingPickup(false);
        }
      } else {
        setPickupResults([]);
      }
    }, 400);

    return () => clearTimeout(searchTimer);
  }, [pickup, showPickupSuggestions]);

  // Debounced search for dropoff
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (dropoff.trim() && showDropoffSuggestions) {
        setIsSearchingDropoff(true);
        try {
          const results = await api.locations.suggest(dropoff);
          setDropoffResults(results);
        } catch (error) {
          console.error("Error fetching dropoff suggestions:", error);
        } finally {
          setIsSearchingDropoff(false);
        }
      } else {
        setDropoffResults([]);
      }
    }, 400);

    return () => clearTimeout(searchTimer);
  }, [dropoff, showDropoffSuggestions]);

  const handleGetCurrentLocation = async (isPickup: boolean) => {
    if (navigator.geolocation) {
      if (isPickup) setIsSearchingPickup(true);
      else setIsSearchingDropoff(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const loc = await api.locations.reverse(position.coords.latitude, position.coords.longitude);
            if (isPickup) {
              setPickup(loc.address || loc.name);
              setPickupLocation(loc);
              setShowPickupSuggestions(false);
            } else {
              setDropoff(loc.address || loc.name);
              setDropoffLocation(loc);
              setShowDropoffSuggestions(false);
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            if (isPickup) setPickup("Vị trí hiện tại");
            else setDropoff("Vị trí hiện tại");
          } finally {
            if (isPickup) setIsSearchingPickup(false);
            else setIsSearchingDropoff(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          if (isPickup) setIsSearchingPickup(false);
          else setIsSearchingDropoff(false);
        }
      );
    }
  };

  if (showRouteMap && pickupLocation && dropoffLocation) {
    return (
      <RouteMap 
        pickupLocation={pickupLocation} 
        dropoffLocation={dropoffLocation} 
        onBack={() => setShowRouteMap(false)} 
        onConfirm={async () => {
          try {
            const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');
            if (!user.id) {
              alert('Vui lòng đăng nhập lại');
              return;
            }
            await api.rides.create(user.id, pickupLocation, dropoffLocation);
            onSuccess();
          } catch (error) {
            console.error('Create ride error:', error);
            alert('Có lỗi xảy ra khi tạo chuyến đi');
          }
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col relative h-full">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-20">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-[17px] font-bold text-gray-900 ml-2">Tìm xe đi chung</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto no-scrollbar pb-28">
        
        {/* Locations */}
        <div className="space-y-3 mb-6 relative">
           {/* Connecting line */}
           <div className="absolute left-[23px] top-[24px] bottom-[24px] w-[2px] bg-gray-200 z-0"></div>
           
           <div className="relative z-20" ref={pickupRef}>
             <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm focus-within:border-[#008f55] focus-within:ring-1 focus-within:ring-[#008f55] transition-all">
               <div className="w-[10px] h-[10px] bg-[#008f55] rounded-full mr-3"></div>
               <input 
                 type="text" 
                 placeholder="Điểm đón" 
                 value={pickup}
                 onChange={(e) => {
                   setPickup(e.target.value);
                   setPickupLocation(null);
                 }}
                 onFocus={() => setShowPickupSuggestions(true)}
                 className="flex-1 outline-none text-[15px] placeholder-gray-500 text-gray-800" 
               />
             </div>
             
             {/* Dropdown Suggestions */}
             {showPickupSuggestions && (
               <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2 z-50 overflow-hidden">
                 {pickup.trim() === '' ? (
                   <button 
                     onClick={() => handleGetCurrentLocation(true)}
                     className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                   >
                     <div className="mt-0.5 bg-gray-100 p-1.5 rounded-full">
                       {isSearchingPickup ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin" /> : <Navigation className="w-4 h-4 text-blue-500" />}
                     </div>
                     <div className="flex-1 overflow-hidden">
                       <div className="font-semibold text-gray-900 text-[14.5px] truncate">Vị trí hiện tại</div>
                       <div className="text-gray-500 text-[12.5px] truncate mt-0.5">Lấy vị trí GPS của bạn</div>
                     </div>
                   </button>
                 ) : isSearchingPickup ? (
                   <div className="px-4 py-4 flex items-center justify-center text-gray-500">
                     <Loader2 className="w-5 h-5 animate-spin mr-2" />
                     <span className="text-[14px]">Đang tìm kiếm...</span>
                   </div>
                 ) : pickupResults.length > 0 ? (
                   pickupResults.map((suggestion) => (
                     <button 
                       key={suggestion.id}
                       onClick={() => {
                         setPickup(suggestion.address || suggestion.name);
                         setPickupLocation(suggestion);
                         setShowPickupSuggestions(false);
                       }}
                       className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                     >
                       <div className="mt-0.5 bg-gray-100 p-1.5 rounded-full">
                         <MapPin className="w-4 h-4 text-gray-400" />
                       </div>
                       <div className="flex-1 overflow-hidden">
                         <div className="font-semibold text-gray-900 text-[14.5px] truncate">{suggestion.name}</div>
                         <div className="text-gray-500 text-[12.5px] truncate mt-0.5">{suggestion.address}</div>
                       </div>
                     </button>
                   ))
                 ) : (
                   <div className="px-4 py-4 text-center text-gray-500 text-[14px]">
                     Không tìm thấy kết quả
                   </div>
                 )}
               </div>
             )}
           </div>
           
           <div className="relative z-10" ref={dropoffRef}>
             <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all">
               <MapPin className="w-[14px] h-[14px] text-red-500 mr-2 ml-[-2px] stroke-[2.5]" />
               <input 
                 type="text" 
                 placeholder="Điểm đến" 
                 value={dropoff}
                 onChange={(e) => {
                   setDropoff(e.target.value);
                   setDropoffLocation(null);
                 }}
                 onFocus={() => setShowDropoffSuggestions(true)}
                 className="flex-1 outline-none text-[15px] placeholder-gray-500 text-gray-800" 
               />
             </div>
             
             {/* Dropdown Suggestions */}
             {showDropoffSuggestions && (
               <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2 z-50 overflow-hidden">
                 {dropoff.trim() === '' ? (
                   <button 
                     onClick={() => handleGetCurrentLocation(false)}
                     className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                   >
                     <div className="mt-0.5 bg-gray-100 p-1.5 rounded-full">
                       {isSearchingDropoff ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin" /> : <Navigation className="w-4 h-4 text-blue-500" />}
                     </div>
                     <div className="flex-1 overflow-hidden">
                       <div className="font-semibold text-gray-900 text-[14.5px] truncate">Vị trí hiện tại</div>
                       <div className="text-gray-500 text-[12.5px] truncate mt-0.5">Lấy vị trí GPS của bạn</div>
                     </div>
                   </button>
                 ) : isSearchingDropoff ? (
                   <div className="px-4 py-4 flex items-center justify-center text-gray-500">
                     <Loader2 className="w-5 h-5 animate-spin mr-2" />
                     <span className="text-[14px]">Đang tìm kiếm...</span>
                   </div>
                 ) : dropoffResults.length > 0 ? (
                   dropoffResults.map((suggestion) => (
                     <button 
                       key={suggestion.id}
                       onClick={() => {
                         setDropoff(suggestion.address || suggestion.name);
                         setDropoffLocation(suggestion);
                         setShowDropoffSuggestions(false);
                       }}
                       className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                     >
                       <div className="mt-0.5 bg-gray-100 p-1.5 rounded-full">
                         <MapPin className="w-4 h-4 text-gray-400" />
                       </div>
                       <div className="flex-1 overflow-hidden">
                         <div className="font-semibold text-gray-900 text-[14.5px] truncate">{suggestion.name}</div>
                         <div className="text-gray-500 text-[12.5px] truncate mt-0.5">{suggestion.address}</div>
                       </div>
                     </button>
                   ))
                 ) : (
                   <div className="px-4 py-4 text-center text-gray-500 text-[14px]">
                     Không tìm thấy kết quả
                   </div>
                 )}
               </div>
             )}
           </div>

          {pickupLocation?.lat && pickupLocation?.lng && dropoffLocation?.lat && dropoffLocation?.lng && (
            <div className="flex items-center justify-end text-sm text-gray-500 mt-2 px-2">
              <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                Khoảng cách dự tính: {calculateDistance(pickupLocation.lat, pickupLocation.lng, dropoffLocation.lat, dropoffLocation.lng).toFixed(1)} km
              </span>
            </div>
          )}
        </div>

        {/* Departure Time */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-3 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="text-[13px] font-medium">Thời gian khởi hành</span>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center border border-gray-200 rounded-full px-4 py-2.5 shadow-sm">
              <input type="text" defaultValue="07/28/2026" className="flex-1 outline-none text-[15px] text-gray-800 w-full bg-transparent" />
              <Calendar className="w-4 h-4 text-gray-500 ml-2" />
            </div>
            <div className="flex-1 flex items-center border border-gray-200 rounded-full px-4 py-2.5 shadow-sm">
              <select className="flex-1 outline-none text-[15px] text-gray-800 w-full bg-transparent appearance-none">
                <option>07:30</option>
                <option>08:00</option>
              </select>
              <div className="pointer-events-none">
                 <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Repeat */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-3 text-gray-500">
            <Repeat className="w-4 h-4" />
            <span className="text-[13px] font-medium">Lặp lại</span>
          </div>
          <div className="flex gap-2">
            {['Một lần', 'Thứ 2 - 6', 'Hàng ngày'].map(opt => (
              <button 
                key={opt}
                onClick={() => setRepeat(opt)}
                className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors border ${repeat === opt ? 'bg-[#008f55] text-white border-[#008f55]' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle */}
        <div className="mb-6">
          <div className="mb-3 text-gray-500">
            <span className="text-[13px] font-medium">Phương tiện</span>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={() => setVehicle('Bất kỳ')}
                className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors border flex items-center justify-center gap-1.5 ${vehicle === 'Bất kỳ' ? 'bg-[#008f55] text-white border-[#008f55]' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                Bất kỳ
              </button>
              <button 
                onClick={() => setVehicle('Xe máy')}
                className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors border flex items-center justify-center gap-1.5 ${vehicle === 'Xe máy' ? 'bg-[#008f55] text-white border-[#008f55]' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                <Bike className="w-4 h-4" /> Xe máy
              </button>
              <button 
                onClick={() => setVehicle('Ô tô')}
                className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors border flex items-center justify-center gap-1.5 ${vehicle === 'Ô tô' ? 'bg-[#008f55] text-white border-[#008f55]' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                <Car className="w-4 h-4" /> Ô tô
              </button>
          </div>
        </div>

        {/* Seats Needed */}
        <div className="mb-6 border border-gray-200 rounded-[24px] p-4 flex items-center justify-between shadow-sm">
           <div>
             <div className="font-semibold text-gray-900 text-[15px]">Số chỗ cần</div>
             <div className="text-gray-400 text-[12px]">Tối đa 4 chỗ</div>
           </div>
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setSeats(Math.max(1, seats - 1))}
               className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
             >
               <Minus className="w-4 h-4" />
             </button>
             <span className="font-semibold text-gray-900 w-3 text-center">{seats}</span>
             <button 
               onClick={() => setSeats(Math.min(4, seats + 1))}
               className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
             >
               <Plus className="w-4 h-4" />
             </button>
           </div>
        </div>

        {/* Detour Acceptance */}
        <div className="mb-6 border border-gray-200 rounded-[24px] p-5 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <div className="font-semibold text-gray-900 text-[15px]">Mức chấp nhận đi vòng</div>
             <div className="font-bold text-[#008f55]">{detour}%</div>
           </div>
           
           {/* Custom Slider */}
           <div className="relative w-full h-1 bg-gray-100 rounded-full mb-4">
              <div className="absolute top-0 left-0 h-full bg-[#008f55] rounded-full" style={{ width: `${detour}%` }}></div>
              <input 
                type="range" 
                min="0" max="100" 
                value={detour} 
                onChange={(e) => setDetour(parseInt(e.target.value))}
                className="absolute top-[-8px] left-0 w-full h-5 opacity-0 cursor-pointer"
              />
              <div 
                className="absolute top-[-5px] w-3.5 h-3.5 bg-white border-2 border-[#008f55] rounded-full pointer-events-none shadow-sm"
                style={{ left: `calc(${detour}% - 7px)` }}
              ></div>
           </div>

           <p className="text-[11.5px] text-gray-500 leading-relaxed">
             Hệ thống sẽ ưu tiên ghép những chuyến có lộ trình trùng khớp cao trong giới hạn này.
           </p>
        </div>

      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 z-20">
        <button 
          onClick={() => {
            if (pickupLocation && dropoffLocation) {
              setShowRouteMap(true);
            } else {
              alert('Vui lòng chọn đầy đủ điểm đón và điểm đến');
            }
          }}
          className="w-full bg-[#008f55] text-white font-bold text-[16px] py-3.5 rounded-full shadow-md hover:bg-[#00824d] transition-colors"
        >
          Tìm chuyến ghép phù hợp
        </button>
      </div>

    </div>
  );
}
