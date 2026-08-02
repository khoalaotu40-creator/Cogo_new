import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, MapPin, Calendar, Repeat, Car, Bike, Plus, Navigation, Clock, Loader2, ArrowLeft, Zap, Users, UserPlus } from 'lucide-react';
import { api, Location } from '../../../lib/api';
import RouteMap from './RouteMap';
import RideTracking from './RideTracking';

interface FindRideFormProps {
  onBack: () => void;
  onSuccess: (type?: string) => void;
}

export default function FindRideForm({ onBack, onSuccess }: FindRideFormProps) {
  const [step, setStep] = useState(1);
  const [rideType, setRideType] = useState<'now' | 'schedule' | null>(null);
  
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [trackedRideId, setTrackedRideId] = useState<string | null>(null);
  const [repeat, setRepeat] = useState('Thứ 2 - 6');
  const [seats, setSeats] = useState(1);
  const [vehicleType, setVehicleType] = useState<'motorbike' | 'car'>('motorbike');
  const [time, setTime] = useState('08:00 AM');
  const [date, setDate] = useState('Hôm nay,');
  
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

  const handleCreateRide = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');
      const userId = user.id || user.id_user;
      if (!userId || isNaN(Number(userId))) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng tải lại trang và đăng nhập lại.');
        localStorage.removeItem('cogo_user');
        window.location.reload();
        return;
      }

      if (rideType === 'schedule') {
        const content = `Tìm người đi chung lúc ${time}, ${date}. Lặp lại: ${repeat}. Cần ${seats} chỗ. Bằng ${vehicleType === 'motorbike' ? 'xe máy' : 'ô tô'}.`;
        await api.posts.create({
          user_id: userId,
          content: content,
          departure_point: pickupLocation?.name || pickup,
          destination_point: dropoffLocation?.name || dropoff,
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          ride_frequency: repeat,
          privacy: 'public'
        });
        await api.rides.create(userId, pickupLocation!, dropoffLocation!, `đặt lịch - ${vehicleType === 'motorbike' ? 'xe máy' : 'ô tô'}`);
        alert('Đã tạo chuyến đi và bài đăng thành công!');
        onSuccess('schedule');
      } else {
        const response = await api.rides.create(userId, pickupLocation!, dropoffLocation!, `đi ngay - ${vehicleType === 'motorbike' ? 'xe máy' : 'ô tô'}`);
        const rideId = response.ride?.id_ride;
        if (!rideId) {
            alert('Lỗi khởi tạo chuyến đi!');
            return;
        }
        
        // Wait until driver accepts
        let isAccepted = false;
        while (!isAccepted) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            try {
                const statusRes = await api.rides.getStatus(rideId);
                if (statusRes && statusRes.id_vehicle !== null) {
                    isAccepted = true;
                }
            } catch (err: any) {
                console.warn(`[FindRideForm] Status poll warning for ride ${rideId}:`, err.message || err);
                // continue polling
            }
        }
        
        onSuccess();
      }
    } catch (error: any) {
      console.error('Create ride error:', error);
      if (error.message && error.message.includes('401')) {
        alert('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        localStorage.removeItem('cogo_user');
        window.location.reload();
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  const renderStep1 = () => (
    <div className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col relative h-full">
      <div className="flex items-center px-4 py-4 sticky top-0 bg-[#f8f9fa] z-20">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex-1 text-center font-bold text-[20px] text-[#008f55] mr-6">Cogo</div>
      </div>
      <div className="px-6 pt-8 pb-12 flex flex-col items-center flex-1">
        <h1 className="text-[22px] font-bold text-gray-900 mb-2 text-center">Bạn muốn đi khi nào?</h1>
        <p className="text-[14px] text-gray-500 mb-8 text-center">Chọn thời gian phù hợp với chuyến đi của bạn</p>

        <button 
          onClick={() => { setRideType('now'); setStep(2); }}
          className="w-full bg-white border border-gray-200 rounded-[20px] p-6 mb-4 flex flex-col items-center text-center hover:border-[#008f55] hover:shadow-md transition-all group"
        >
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 text-[#008f55]" fill="currentColor" />
          </div>
          <h2 className="text-[18px] font-bold text-gray-900 mb-2">Đi ngay</h2>
          <p className="text-[14px] text-gray-500 leading-relaxed">Tìm tài xế gần nhất và bắt đầu chuyến đi ngay lập tức.</p>
        </button>

        <button 
          onClick={() => { setRideType('schedule'); setStep(2); }}
          className="w-full bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col items-center text-center hover:border-[#008f55] hover:shadow-md transition-all group"
        >
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6 text-[#008f55]" />
          </div>
          <h2 className="text-[18px] font-bold text-gray-900 mb-2">Đặt lịch</h2>
          <p className="text-[14px] text-gray-500 leading-relaxed">Lên lịch trước cho chuyến đi của bạn để đảm bảo có xe.</p>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col relative h-full">
      <div className="flex items-center px-4 py-4 sticky top-0 bg-[#f8f9fa] z-20">
        <button onClick={() => setStep(1)} className="p-1 -ml-1 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex-1 text-center font-bold text-[20px] text-[#008f55] mr-6">Cogo</div>
      </div>
      
      {/* Map Background (Visual only for now) */}
      <div className="relative mb-28">
        <div className="h-[250px] w-full relative bg-[#e3f2e1] flex items-center justify-center overflow-hidden">
          {/* Map grid pattern */}
          <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '150px 150px'
          }}></div>
          {/* Fake streets */}
          <div className="absolute w-[300px] h-2 bg-white/60 -rotate-12 top-10"></div>
          <div className="absolute w-[200px] h-3 bg-white/50 rotate-45 left-0"></div>
          <div className="absolute w-[150px] h-2 bg-blue-200/50 -rotate-12 bottom-10 right-0"></div>
        </div>

        {/* Inputs on top of map */}
        <div className="absolute -bottom-16 left-4 right-4 z-30">
          <div className="bg-[#f8f9fc] rounded-[16px] p-3 shadow-sm border border-white">
            <div className="space-y-3 relative">
              <div className="absolute left-[20px] top-[24px] bottom-[24px] w-[2px] bg-gray-200 z-0"></div>
              
              <div className="relative z-20" ref={pickupRef}>
                <div className="flex items-center bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm">
                  <Navigation className="w-[18px] h-[18px] text-[#008f55] mr-3 stroke-[2.5]" />
                  <input 
                    type="text" 
                    placeholder="123 Nguyễn Văn Linh, Quận 7" 
                    value={pickup}
                    onChange={(e) => {
                      setPickup(e.target.value);
                      setPickupLocation(null);
                    }}
                    onFocus={() => setShowPickupSuggestions(true)}
                    className="flex-1 outline-none text-[14px] placeholder-gray-500 text-gray-800" 
                  />
                </div>
                {showPickupSuggestions && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-[12px] shadow-lg py-2 z-50 max-h-[200px] overflow-y-auto">
                    {pickup.trim() === '' ? (
                      <button onMouseDown={() => handleGetCurrentLocation(true)} className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left">
                        <Navigation className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div className="font-semibold text-gray-900 text-[14px]">Vị trí hiện tại</div>
                      </button>
                    ) : pickupResults.map((suggestion) => (
                      <button 
                        key={suggestion.id}
                        onMouseDown={() => {
                          setPickup(suggestion.address || suggestion.name);
                          setPickupLocation(suggestion);
                          setShowPickupSuggestions(false);
                        }}
                        className="w-full px-4 py-2 flex items-start gap-3 hover:bg-gray-50 text-left"
                      >
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900 text-[14px]">{suggestion.name}</div>
                          <div className="text-gray-500 text-[12px] truncate max-w-[200px]">{suggestion.address}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative z-10" ref={dropoffRef}>
                <div className="flex items-center bg-white border border-[#008f55] rounded-lg px-3 py-2 shadow-sm">
                  <MapPin className="w-[18px] h-[18px] text-red-500 mr-3 stroke-[2.5]" />
                  <input 
                    type="text" 
                    placeholder="Bạn muốn đến đâu?" 
                    value={dropoff}
                    onChange={(e) => {
                      setDropoff(e.target.value);
                      setDropoffLocation(null);
                    }}
                    onFocus={() => setShowDropoffSuggestions(true)}
                    className="flex-1 outline-none text-[14px] placeholder-gray-400 text-gray-800 bg-transparent" 
                  />
                </div>
                {showDropoffSuggestions && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-[12px] shadow-lg py-2 z-50 max-h-[200px] overflow-y-auto">
                    {dropoff.trim() === '' ? (
                      <button onMouseDown={() => handleGetCurrentLocation(false)} className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left">
                        <Navigation className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div className="font-semibold text-gray-900 text-[14px]">Vị trí hiện tại</div>
                      </button>
                    ) : dropoffResults.map((suggestion) => (
                      <button 
                        key={suggestion.id}
                        onMouseDown={() => {
                          setDropoff(suggestion.address || suggestion.name);
                          setDropoffLocation(suggestion);
                          setShowDropoffSuggestions(false);
                        }}
                        className="w-full px-4 py-2 flex items-start gap-3 hover:bg-gray-50 text-left"
                      >
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900 text-[14px]">{suggestion.name}</div>
                          <div className="text-gray-500 text-[12px] truncate max-w-[200px]">{suggestion.address}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-20 flex-1">
        <h3 className="text-[13px] font-medium text-gray-500 mb-4 uppercase tracking-wide">Những người đang ghép cặp quanh bạn</h3>
        <div className="space-y-3">
          {/* Dummy match 1 */}
          <div className="bg-white border border-gray-100 rounded-[16px] p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-[15px]">H</div>
              <div>
                <div className="font-semibold text-gray-900 text-[14px]">Hoàng Trần</div>
                <div className="text-[12px] text-gray-500">Cách bạn 300m • Cùng tuyến đ...</div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-green-100 flex items-center justify-center text-[#008f55]">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          {/* Dummy match 2 */}
          <div className="bg-white border border-gray-100 rounded-[16px] p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-[15px]">L</div>
              <div>
                <div className="font-semibold text-gray-900 text-[14px]">Linh Lê</div>
                <div className="text-[12px] text-gray-500">Cách bạn 500m • Gần điểm đến</div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-green-100 flex items-center justify-center text-[#008f55]">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          {/* Dummy match 3 */}
          <div className="bg-white border border-gray-100 rounded-[16px] p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium text-[15px]">M</div>
              <div>
                <div className="font-semibold text-gray-900 text-[14px]">Minh Phạm</div>
                <div className="text-[12px] text-gray-500">Cách bạn 800m • Đi cùng hướng</div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-green-100 flex items-center justify-center text-[#008f55]">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 z-20">
        <button 
          onClick={() => {
            if (pickupLocation && dropoffLocation) {
              setStep(3);
            } else {
              alert('Vui lòng chọn điểm đón và điểm đến');
            }
          }}
          className="w-full bg-[#008f55] text-white font-bold text-[16px] py-3.5 rounded-[12px] shadow-sm hover:bg-[#007a48] transition-colors flex items-center justify-center gap-2"
        >
          Tiếp tục <ArrowLeft className="w-5 h-5 rotate-180" />
        </button>
      </div>
    </div>
  );

  const renderSeatSelection = () => {
    const seatOptions = [
      { id: 1, label: '1 chỗ' },
      { id: 2, label: '2 chỗ' },
      { id: 3, label: '3 chỗ' },
      { id: 4, label: '4+ chỗ' }
    ];

    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        {seatOptions.map((opt) => (
          <button 
            key={opt.id}
            onClick={() => setSeats(opt.id)}
            className={`flex flex-col items-center justify-center py-6 rounded-[16px] border transition-colors ${seats === opt.id ? 'bg-[#b6e8d1] border-[#008f55]' : 'bg-white border-gray-200'}`}
          >
            <Users className={`w-8 h-8 mb-2 ${seats === opt.id ? 'text-[#005e38]' : 'text-gray-700'}`} />
            <span className={`text-[15px] font-semibold ${seats === opt.id ? 'text-[#005e38]' : 'text-gray-900'}`}>{opt.label}</span>
          </button>
        ))}
      </div>
    );
  };

  
  const renderVehicleSelection = () => {
    return (
      <div className="mt-8">
        <h2 className="text-[18px] font-bold text-gray-900 mb-1">Phương tiện</h2>
        <p className="text-[14px] text-gray-500 mb-4">Bạn muốn di chuyển bằng phương tiện gì?</p>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setVehicleType('motorbike')}
            className={`flex flex-col items-center justify-center py-6 rounded-[16px] border transition-colors ${vehicleType === 'motorbike' ? 'bg-[#b6e8d1] border-[#008f55]' : 'bg-white border-gray-200'}`}
          >
            <Bike className={`w-8 h-8 mb-2 ${vehicleType === 'motorbike' ? 'text-[#005e38]' : 'text-gray-700'}`} />
            <span className={`text-[15px] font-semibold ${vehicleType === 'motorbike' ? 'text-[#005e38]' : 'text-gray-900'}`}>Xe máy</span>
          </button>
          <button 
            onClick={() => setVehicleType('car')}
            className={`flex flex-col items-center justify-center py-6 rounded-[16px] border transition-colors ${vehicleType === 'car' ? 'bg-[#b6e8d1] border-[#008f55]' : 'bg-white border-gray-200'}`}
          >
            <Car className={`w-8 h-8 mb-2 ${vehicleType === 'car' ? 'text-[#005e38]' : 'text-gray-700'}`} />
            <span className={`text-[15px] font-semibold ${vehicleType === 'car' ? 'text-[#005e38]' : 'text-gray-900'}`}>Ô tô</span>
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col relative h-full pb-20">
      <div className="flex items-center px-4 py-4 sticky top-0 bg-[#f8f9fa] z-20">
        <button onClick={() => setStep(2)} className="p-1 -ml-1 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex-1 text-center font-bold text-[20px] text-gray-900 mr-6">
          {rideType === 'now' ? 'Số chỗ' : 'Đặt lịch'}
        </div>
      </div>

      <div className="px-4 pt-4">
        {rideType === 'now' ? (
           <div className="bg-[#f0f4fb] rounded-[16px] p-4 flex items-center gap-4 mb-6">
             <div className="w-10 h-10 bg-[#c2f0d9] rounded-full flex items-center justify-center">
               <Zap className="w-5 h-5 text-[#008f55]" fill="currentColor" />
             </div>
             <div>
               <div className="text-[12px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Loại chuyến đi</div>
               <div className="text-[15px] font-bold text-gray-900">Đi ngay</div>
             </div>
           </div>
        ) : (
           <div className="space-y-6 mb-6">
             <div className="bg-white border border-gray-100 rounded-[16px] p-4 shadow-sm">
               <div className="text-[13px] font-medium text-gray-500 mb-3 uppercase tracking-wide">Thời gian khởi hành</div>
               <div className="flex gap-3">
                  <div className="flex-1 flex items-center border border-gray-200 rounded-[8px] px-3 py-2.5">
                    <Calendar className="w-4 h-4 text-[#008f55] mr-2" />
                    <input type="text" value={date} onChange={e => setDate(e.target.value)} className="flex-1 outline-none text-[14px] text-gray-800 bg-transparent" />
                  </div>
                  <div className="flex-1 flex items-center border border-gray-200 rounded-[8px] px-3 py-2.5">
                    <Clock className="w-4 h-4 text-[#008f55] mr-2" />
                    <input type="text" value={time} onChange={e => setTime(e.target.value)} className="flex-1 outline-none text-[14px] text-gray-800 bg-transparent" />
                  </div>
               </div>
             </div>

             <div className="bg-white border border-gray-100 rounded-[16px] p-4 shadow-sm">
               <div className="text-[13px] font-medium text-gray-500 mb-3 uppercase tracking-wide">Lặp lại</div>
               <div className="flex gap-2">
                 {['Một lần', 'Thứ 2 - 6', 'Hàng ngày'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setRepeat(opt)}
                      className={`flex-1 py-2 rounded-full text-[13px] font-medium transition-colors border ${repeat === opt ? 'bg-[#008f55] text-white border-[#008f55]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                    >
                      {opt}
                    </button>
                  ))}
               </div>
             </div>
           </div>
        )}

        <div className={rideType === 'now' ? '' : 'bg-white border border-gray-100 rounded-[16px] p-4 shadow-sm'}>
          <h2 className="text-[18px] font-bold text-gray-900 mb-1">Số chỗ bạn cần là bao nhiêu?</h2>
          <p className="text-[14px] text-gray-500">Vui lòng chọn số lượng hành khách cho chuyến đi này.</p>
          {renderSeatSelection()}
          {renderVehicleSelection()}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 z-20">
        <button 
          onClick={async () => {
            if (pickupLocation && dropoffLocation) {
              if (rideType === 'schedule') {
                await handleCreateRide();
              } else {
                setShowRouteMap(true);
              }
            } else {
              alert('Vui lòng chọn đầy đủ điểm đón và điểm đến');
            }
          }}
          className="w-full bg-[#008f55] text-white font-bold text-[16px] py-3.5 rounded-[12px] shadow-sm hover:bg-[#007a48] transition-colors flex items-center justify-center gap-2"
        >
          {rideType === 'now' ? 'Tiếp tục' : (
             <>
               <Navigation className="w-5 h-5 -rotate-90" />
               Đăng bài
             </>
          )}
        </button>
      </div>
    </div>
  );

  if (trackedRideId) {
    return <RideTracking rideId={trackedRideId} onBack={() => onSuccess('now')} />;
  }

  if (showRouteMap && pickupLocation && dropoffLocation) {
    return (
      <RouteMap
        pickupLocation={pickupLocation} 
        dropoffLocation={dropoffLocation} 
        onBack={() => setShowRouteMap(false)} 
        onConfirm={handleCreateRide}
      />
    );
  }

  return (
    <div className="h-full">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}

