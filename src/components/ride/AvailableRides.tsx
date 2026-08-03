import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Star, MapPin, User, ChevronRight, Navigation } from 'lucide-react';
import { api, Location } from '../../lib/api';

interface AvailableRidesProps {
  onBack: () => void;
}

export default function AvailableRides({ onBack }: AvailableRidesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupQuery, setPickupQuery] = useState('');
  const [availableRides, setAvailableRides] = useState<any[]>([]);

  const [waitingForRide, setWaitingForRide] = useState<number | null>(null);
  const [joinRequestId, setJoinRequestId] = useState<number | null>(null);
  const [joinRequestStatus, setJoinRequestStatus] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [pickupResults, setPickupResults] = useState<Location[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const pickupRef = useRef<HTMLDivElement>(null);

  const [dropoffResults, setDropoffResults] = useState<Location[]>([]);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const dropoffRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  
  useEffect(() => {
    let interval: any;
    if (joinRequestId && joinRequestStatus !== 'accepted') {
      interval = setInterval(async () => {
        try {
          const res = await api.rides.getJoinRequestStatus(joinRequestId);
          setJoinRequestStatus(res.status);
          if (res.status === 'accepted') {
             clearInterval(interval);
             alert('Yêu cầu ghép chuyến đã được chấp nhận!');
             setWaitingForRide(null);
             setJoinRequestId(null);
             setJoinRequestStatus(null);
             onBack(); // go back or to the tracking view
          }
        } catch (e) {}
      }, 3000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [joinRequestId, joinRequestStatus]);

  const handleJoinClick = (rideId: number) => {
    const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');
    const userId = user.id || user.id_user;
    if (!userId) return alert('Vui lòng đăng nhập');

    
    if (!pickupQuery || !pickupQuery.trim()) {
      alert("Không có điểm đón! Vui lòng chọn hoặc nhập điểm đón ở trên trước khi tham gia.");
      if (pickupRef.current) {
        const inputEl = pickupRef.current.querySelector('input');
        if (inputEl) inputEl.focus();
      }
      return;
    }

    const pickupText = pickupQuery.trim();
       
    // get location and join
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
         const lat = pos.coords.latitude;
         const lng = pos.coords.longitude;
         try {
            const res = await api.rides.requestJoin(rideId, { lat, lng, id: 'pickup', name: pickupText, address: pickupText }, userId);
            if (res.status === 'ok') {
               setWaitingForRide(rideId);
               setJoinRequestId(res.request.id);
               setJoinRequestStatus('pending');
            }
          } catch (e: any) { 
            alert(e.message || 'Lỗi khi gửi yêu cầu'); 
          }
        },
        async (err) => {
          // Fallback if geolocation permission is denied/fails but pickupQuery is entered
          try {
            const res = await api.rides.requestJoin(rideId, { lat: 10.7769, lng: 106.7009, id: 'pickup', name: pickupText, address: pickupText }, userId);
            if (res.status === 'ok') {
               setWaitingForRide(rideId);
               setJoinRequestId(res.request.id);
               setJoinRequestStatus('pending');
            }
          } catch (e: any) { alert(e.message || 'Lỗi khi gửi yêu cầu'); }
        }
      );
    } else {
       // Fallback without geolocation
       api.rides.requestJoin(rideId, { lat: 10.7769, lng: 106.7009, id: 'pickup', name: pickupText, address: pickupText }, userId)
         .then(res => {
           if (res.status === 'ok') {
              setWaitingForRide(rideId);
              setJoinRequestId(res.request.id);
              setJoinRequestStatus('pending');
           }
         })
         .catch(e => alert(e.message || 'Lỗi khi gửi yêu cầu'));
    }
  };

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
      if (pickupQuery.trim() && showPickupSuggestions) {
        try {
          const results = await api.locations.suggest(pickupQuery);
          setPickupResults(results);
        } catch (error) {
          console.error("Error fetching pickup suggestions:", error);
        }
      } else {
        setPickupResults([]);
      }
    }, 400);
    return () => clearTimeout(searchTimer);
  }, [pickupQuery, showPickupSuggestions]);

  // Debounced search for dropoff
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim() && showDropoffSuggestions) {
        try {
          const results = await api.locations.suggest(searchQuery);
          setDropoffResults(results);
        } catch (error) {
          console.error("Error fetching dropoff suggestions:", error);
        }
      } else {
        setDropoffResults([]);
      }
    }, 400);
    return () => clearTimeout(searchTimer);
  }, [searchQuery, showDropoffSuggestions]);

  const handleGetCurrentLocation = async (isPickup: boolean) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const loc = await api.locations.reverse(position.coords.latitude, position.coords.longitude);
            if (isPickup) {
              setPickupQuery(loc.address || loc.name);
              setShowPickupSuggestions(false);
            } else {
              setSearchQuery(loc.address || loc.name);
              setShowDropoffSuggestions(false);
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            if (isPickup) setPickupQuery("Vị trí hiện tại");
            else setSearchQuery("Vị trí hiện tại");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

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
    const destName = (ride.Diem_den?.name || '') + ' ' + (ride.Diem_den?.address || '');
    const pickupName = (ride.Diem_don?.name || '') + ' ' + (ride.Diem_don?.address || '');
    
    const matchesDest = destName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPickup = pickupName.toLowerCase().includes(pickupQuery.toLowerCase());
    
    return matchesDest && matchesPickup;
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
        <div className="bg-[#f8f9fc] rounded-[16px] p-3 shadow-sm border border-gray-100">
          <div className="space-y-3 relative">
            <div className="absolute left-[20px] top-[24px] bottom-[24px] w-[2px] bg-gray-200 z-0"></div>
            
            <div className="relative z-20" ref={pickupRef}>
              <div className="flex items-center bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm">
                <Navigation className="w-[18px] h-[18px] text-[#008f55] mr-3 stroke-[2.5]" />
                <input 
                  type="text" 
                  placeholder="123 Nguyễn Văn Linh, Quận 7" 
                  value={pickupQuery}
                  onChange={(e) => setPickupQuery(e.target.value)}
                  onFocus={() => setShowPickupSuggestions(true)}
                  className="flex-1 outline-none text-[14px] placeholder-gray-500 text-gray-800" 
                />
              </div>
              {showPickupSuggestions && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-[12px] shadow-lg py-2 z-50 max-h-[200px] overflow-y-auto">
                  {pickupQuery.trim() === '' ? (
                    <button onMouseDown={() => handleGetCurrentLocation(true)} className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left">
                      <Navigation className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div className="font-semibold text-gray-900 text-[14px]">Vị trí hiện tại</div>
                    </button>
                  ) : pickupResults.map((suggestion) => (
                    <button 
                      key={suggestion.id}
                      onMouseDown={() => {
                        setPickupQuery(suggestion.address || suggestion.name);
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropoffSuggestions(true)}
                  className="flex-1 outline-none text-[14px] placeholder-gray-400 text-gray-800 bg-transparent" 
                />
              </div>
              {showDropoffSuggestions && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-[12px] shadow-lg py-2 z-50 max-h-[200px] overflow-y-auto">
                  {searchQuery.trim() === '' ? (
                    <button onMouseDown={() => handleGetCurrentLocation(false)} className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left">
                      <Navigation className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div className="font-semibold text-gray-900 text-[14px]">Vị trí hiện tại</div>
                    </button>
                  ) : dropoffResults.map((suggestion) => (
                    <button 
                      key={suggestion.id}
                      onMouseDown={() => {
                        setSearchQuery(suggestion.address || suggestion.name);
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

      {/* Rides List */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 pb-[80px]">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : filteredRides.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Không tìm thấy chuyến đi nào.</div>
        ) : (
          filteredRides.map((ride) => (
            <div key={ride.id_ride} className="bg-white rounded-[16px] shadow-sm overflow-hidden border border-gray-100">
              {/* People Info & Price */}
              <div className="p-4 border-b border-gray-50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  {/* Passenger (Requester) */}
                  <div className="flex items-center gap-3">
                    <img src={ride.passenger_avatar_url || "https://i.pravatar.cc/150?img=3"} alt={ride.passenger_name || ride.passenger_phone} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
                    <div>
                      <h3 className="font-bold text-[16px] text-gray-900 leading-tight">{ride.passenger_name || ride.passenger_phone || "Hành khách"}</h3>
                      <div className="flex items-center text-[13px] text-gray-500 mt-1">
                        <User className="w-3.5 h-3.5 text-gray-400 mr-1" />
                        Người đặt chuyến
                      </div>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <div className="font-bold text-[#008f55] text-[16px] leading-tight">Thỏa thuận</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">/ ghế</div>
                  </div>
                </div>

                {/* Driver (if ride is in progress or arriving) */}
                {(ride.status === 'Arriving' || ride.status === 'In Progress') && ride.driver_name && (
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-50 mt-1">
                    <img src={ride.driver_avatar || "https://i.pravatar.cc/150?img=4"} alt={ride.driver_name || ride.driver_phone} className="w-12 h-12 rounded-full object-cover border-2 border-[#008f55]" />
                    <div>
                      <h3 className="font-bold text-[16px] text-gray-900 leading-tight">{ride.driver_name || ride.driver_phone}</h3>
                      <div className="flex items-center text-[13px] text-gray-500 mt-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current mr-1" />
                        4.9 (Tài xế)
                      </div>
                    </div>
                  </div>
                )}
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
                {ride.status === 'Requested' ? (
                  <button onClick={() => handleJoinClick(ride.id_ride)} className="bg-[#008f55] hover:bg-[#007a48] text-white px-6 py-2 rounded-full font-bold text-[14px] transition-colors shadow-sm">
                    Tham gia
                  </button>
                ) : (
                  <button onClick={() => handleJoinClick(ride.id_ride)} className="bg-[#008f55] hover:bg-[#007a48] text-white px-6 py-2 rounded-full font-bold text-[14px] transition-colors shadow-sm">
                    Tham gia
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
