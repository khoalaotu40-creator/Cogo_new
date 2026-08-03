import { useState, useRef, useEffect } from 'react';
import { X, Loader2, Navigation, Car, Users, MapPin } from 'lucide-react';
import { api, Location } from '../../lib/api';

interface Post {
  id: number;
  content: string;
  departurePoint: string;
  destinationPoint: string;
  mediaUrl?: string;
  rideFrequency?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatarUrl: string;
  };
}

interface JoinRequestModalProps {
  post: Post;
  currentUser: any;
  onClose: () => void;
  onSuccess: (postId: number) => void;
}

export default function JoinRequestModal({ post, currentUser, onClose, onSuccess }: JoinRequestModalProps) {
  const [joinNotes, setJoinNotes] = useState('');
  const [requestedSeats, setRequestedSeats] = useState(1);
  
  const [pickupPoint, setPickupPoint] = useState('');
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [pickupResults, setPickupResults] = useState<Location[]>([]);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const pickupRef = useRef<HTMLDivElement>(null);
  
  const [dropoffPoint, setDropoffPoint] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [dropoffResults, setDropoffResults] = useState<Location[]>([]);
  const [isSearchingDropoff, setIsSearchingDropoff] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const dropoffRef = useRef<HTMLDivElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (pickupPoint.trim() && showPickupSuggestions) {
        setIsSearchingPickup(true);
        try {
          const results = await api.locations.suggest(pickupPoint);
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
  }, [pickupPoint, showPickupSuggestions]);

  // Debounced search for dropoff
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (dropoffPoint.trim() && showDropoffSuggestions) {
        setIsSearchingDropoff(true);
        try {
          const results = await api.locations.suggest(dropoffPoint);
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
  }, [dropoffPoint, showDropoffSuggestions]);

  const handleGetCurrentLocation = async (isPickup: boolean) => {
    if (navigator.geolocation) {
      if (isPickup) setIsSearchingPickup(true);
      else setIsSearchingDropoff(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const loc = await api.locations.reverse(position.coords.latitude, position.coords.longitude);
            if (isPickup) {
              setPickupPoint(loc.address || loc.name);
              setPickupLocation(loc);
              setShowPickupSuggestions(false);
            } else {
              setDropoffPoint(loc.address || loc.name);
              setDropoffLocation(loc);
              setShowDropoffSuggestions(false);
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            if (isPickup) setPickupPoint("Vị trí hiện tại");
            else setDropoffPoint("Vị trí hiện tại");
          } finally {
            if (isPickup) setIsSearchingPickup(false);
            else setIsSearchingDropoff(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          if (isPickup) setIsSearchingPickup(false);
          else setIsSearchingDropoff(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  const handleJoinConfirm = async () => {
    if (!currentUser) return;
    const resolvedPickup = pickupLocation || (pickupPoint.trim() ? { name: pickupPoint.trim(), address: pickupPoint.trim() } : null);
    if (!resolvedPickup || (!resolvedPickup.name && !resolvedPickup.address)) {
      alert("Không có điểm đón! Vui lòng xác định điểm đón trước khi tham gia.");
      return;
    }
        
    setIsSubmitting(true);
    try {
      await api.posts.join(post.id, {
        user_id: currentUser.id || currentUser.id_user,
        message: joinNotes,
        requested_seats: requestedSeats,
        pickup_point: resolvedPickup,
        dropoff_point: dropoffLocation || (dropoffPoint ? { name: dropoffPoint, address: dropoffPoint } : null)
      });
      onSuccess(post.id);
    } catch (error) {
      console.error("Failed to join post:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu.");    
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSeekingRide = post.content.includes('Cần');

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-[24px] sm:rounded-[24px] overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4">
        <div className="px-4 py-3 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <h3 className="font-bold text-[18px] text-gray-900">Chi tiết & Xác nhận</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-6">
          {/* Route Info */}
          <div className="bg-[#f8f9fa] p-4 rounded-[16px] border border-gray-100">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
               <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <img src={post.user.avatarUrl || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Đi cùng {post.user.name}</div>
                <div className="text-xs text-gray-500">{isSeekingRide ? 'Vai trò: Tài xế nhận khách' : 'Vai trò: Đi ghép'}</div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[2px] bg-gray-300"></div>
              
              <div className="flex gap-3 mb-4 relative">
                <div className="w-[16px] h-[16px] rounded-full border-2 border-[#008f55] bg-white flex-shrink-0 mt-0.5 z-10"></div>
                <div>
                  <div className="text-[12px] font-semibold text-gray-500 mb-0.5">ĐIỂM ĐI</div>
                  <div className="text-[14px] font-medium text-gray-900 leading-tight">{post.departurePoint}</div>
                </div>
              </div>
              
              <div className="flex gap-3 relative">
                <div className="w-[16px] h-[16px] rounded-full bg-[#008f55] flex-shrink-0 mt-0.5 z-10"></div>
                <div>
                  <div className="text-[12px] font-semibold text-gray-500 mb-0.5">ĐIỂM ĐẾN</div>
                  <div className="text-[14px] font-medium text-gray-900 leading-tight">{post.destinationPoint}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Estimates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-[12px] p-3 flex flex-col items-center justify-center border border-green-100">
              <Navigation className="w-5 h-5 text-[#006b3f] mb-1" />
              <span className="text-[15px] font-bold text-gray-900">~8.5 km</span>
              <span className="text-[11px] text-gray-500">Khoảng cách</span>
            </div>
            <div className="bg-blue-50 rounded-[12px] p-3 flex flex-col items-center justify-center border border-blue-100">
              <Car className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-[15px] font-bold text-gray-900">Thỏa thuận</span>
              <span className="text-[11px] text-gray-500">Chi phí dự kiến</span>
            </div>
          </div>

          {/* Additional Info Form */}
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-[14px] text-gray-900 mb-2">Số lượng {isSeekingRide ? 'nhận chở' : 'ghép'} (người/chỗ)</h4>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setRequestedSeats(Math.max(1, requestedSeats - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xl hover:bg-gray-200"
                >
                  -
                </button>
                <div className="text-lg font-semibold w-8 text-center">{requestedSeats}</div>
                <button 
                  onClick={() => setRequestedSeats(Math.min(7, requestedSeats + 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xl hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[14px] text-gray-900 mb-2">Điểm đón chi tiết <span className="text-red-500 font-semibold">(Bắt buộc)</span></h4>
              <div className="relative" ref={pickupRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text"
                  value={pickupPoint}
                  onChange={(e) => {
                    setPickupPoint(e.target.value);
                    setPickupLocation(null);
                  }}
                  onFocus={() => setShowPickupSuggestions(true)}
                  placeholder="Vd: Cổng trường ĐH Bách Khoa"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[12px] pl-10 pr-10 py-3 text-[14px] outline-none focus:border-[#008f55] focus:bg-white transition-colors"
                />
                <button 
                  onClick={() => handleGetCurrentLocation(true)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#008f55] transition-colors"
                  title="Sử dụng vị trí hiện tại"
                >
                  <Navigation className="h-5 w-5" />
                </button>

                {showPickupSuggestions && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-[12px] shadow-lg py-2 z-50 max-h-[200px] overflow-y-auto">
                    {pickupPoint.trim() === '' ? (
                      <button onMouseDown={() => handleGetCurrentLocation(true)} className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left">
                        <Navigation className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div className="font-semibold text-gray-900 text-[14px]">Vị trí hiện tại</div>
                      </button>
                    ) : pickupResults.map((suggestion) => (
                      <button 
                        key={suggestion.id}
                        onMouseDown={() => {
                          setPickupPoint(suggestion.address || suggestion.name);
                          setPickupLocation(suggestion);
                          setShowPickupSuggestions(false);
                        }}
                        className="w-full px-4 py-2 flex items-start gap-3 hover:bg-gray-50 text-left"
                      >
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900 text-[14px]">{suggestion.name}</div>
                          <div className="text-gray-500 text-[12px] truncate max-w-[300px]">{suggestion.address}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[14px] text-gray-900 mb-2">Điểm đến chi tiết (Tùy chọn)</h4>
              <div className="relative" ref={dropoffRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text"
                  value={dropoffPoint}
                  onChange={(e) => {
                    setDropoffPoint(e.target.value);
                    setDropoffLocation(null);
                  }}
                  onFocus={() => setShowDropoffSuggestions(true)}
                  placeholder="Vd: 302 Lý Thường Kiệt"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[12px] pl-10 pr-10 py-3 text-[14px] outline-none focus:border-[#008f55] focus:bg-white transition-colors"
                />
                <button 
                  onClick={() => handleGetCurrentLocation(false)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#008f55] transition-colors"
                  title="Sử dụng vị trí hiện tại"
                >
                  <Navigation className="h-5 w-5" />
                </button>

                {showDropoffSuggestions && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-[12px] shadow-lg py-2 z-50 max-h-[200px] overflow-y-auto">
                    {dropoffPoint.trim() === '' ? (
                      <button onMouseDown={() => handleGetCurrentLocation(false)} className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left">
                        <Navigation className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div className="font-semibold text-gray-900 text-[14px]">Vị trí hiện tại</div>
                      </button>
                    ) : dropoffResults.map((suggestion) => (
                      <button 
                        key={suggestion.id}
                        onMouseDown={() => {
                          setDropoffPoint(suggestion.address || suggestion.name);
                          setDropoffLocation(suggestion);
                          setShowDropoffSuggestions(false);
                        }}
                        className="w-full px-4 py-2 flex items-start gap-3 hover:bg-gray-50 text-left"
                      >
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900 text-[14px]">{suggestion.name}</div>
                          <div className="text-gray-500 text-[12px] truncate max-w-[300px]">{suggestion.address}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[14px] text-gray-900 mb-2">Lời nhắn cho {post.user.name} (Tùy chọn)</h4>
              <textarea 
                value={joinNotes}
                onChange={(e) => setJoinNotes(e.target.value)}
                placeholder="Ví dụ: Đón mình ở trước cổng trường nhé, mình có một balo nhỏ..."
                className="w-full bg-gray-50 border border-gray-200 rounded-[12px] p-3 text-[14px] outline-none focus:border-[#008f55] focus:bg-white transition-colors resize-none h-20"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-white sticky bottom-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleJoinConfirm}
            disabled={isSubmitting}
            className="w-full bg-[#008f55] text-white font-bold text-[16px] py-3.5 rounded-full shadow-md hover:bg-[#007a48] transition-colors flex items-center justify-center disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Đang gửi yêu cầu...
              </>
            ) : (
              "Gửi yêu cầu đi chung"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
