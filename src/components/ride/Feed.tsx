import { useState, useEffect, useMemo } from 'react';
import { api, Location } from '../../lib/api';
import { 
  Search, Map, Clock, Users, User, ArrowRight, Loader2, X, 
  MapPin, Star, ShieldCheck, ChevronRight, ArrowLeft, Plus, Minus,
  MessageCircle, Leaf, CheckCircle2, Car, Sparkles, Filter,
  Radio, Navigation, Waves, Wifi, Power
} from 'lucide-react';
import JoinRequestModal from './JoinRequestModal';
import RouteMap from './RouteMap';

interface Post {
  id: number;
  content: string;
  departurePoint: string;
  destinationPoint: string;
  pickupLocation?: Location;
  dropoffLocation?: Location;
  mediaUrl?: string;
  rideFrequency?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  stats?: {
    likes: number;
    comments: number;
  };
  // UI helper fields
  priceNum?: number;
  timeStr?: string;
  joinedCount?: number;
  capacity?: number;
  vehicleType?: string;
  driverRating?: string;
  distStr?: string;
  tag?: string;
  gradient?: string;
}

interface FeedProps {
  onStart?: () => void;
  onToggleFooter?: (hide: boolean) => void;
}

// Preset verified student routes
const PRESET_DRIVER_TRIPS: Post[] = [
  {
    id: 101,
    content: "Đi học ca sáng, xe 4 chỗ còn trống ghế sau.",
    departurePoint: "KTX Khu B, ĐHQG TP.HCM",
    destinationPoint: "Đại học Công nghệ Thông tin UIT",
    pickupLocation: { id: "p1", name: "KTX Khu B, ĐHQG TP.HCM", lat: 10.8804, lng: 106.7824 },
    dropoffLocation: { id: "d1", name: "Đại học Công nghệ Thông tin UIT", lat: 10.8700, lng: 106.8030 },
    createdAt: new Date().toISOString(),
    user: { id: 201, name: "Minh Trí" },
    priceNum: 15000,
    timeStr: "07:30",
    joinedCount: 3,
    capacity: 4,
    vehicleType: "Ô tô 4 chỗ · 51F-882.14",
    driverRating: "4.9",
    distStr: "12,4 km · ~35 phút",
    tag: "UIT",
    gradient: "linear-gradient(140deg, #2f6fd8, #8fb6f2 55%, #cfe0f8)"
  },
  {
    id: 102,
    content: "Tiện đường đi làm qua Làng ĐH, đón đúng cổng Vincom.",
    departurePoint: "Vincom Lê Văn Việt",
    destinationPoint: "Làng Đại học Thủ Đức",
    pickupLocation: { id: "p2", name: "Vincom Lê Văn Việt", lat: 10.8465, lng: 106.7725 },
    dropoffLocation: { id: "d2", name: "Làng Đại học Thủ Đức", lat: 10.8750, lng: 106.8000 },
    createdAt: new Date().toISOString(),
    user: { id: 202, name: "Hải Đăng" },
    priceNum: 12000,
    timeStr: "07:45",
    joinedCount: 2,
    capacity: 4,
    vehicleType: "Ô tô 5 chỗ · 51H-114.20",
    driverRating: "4.8",
    distStr: "8,6 km · ~22 phút",
    tag: "Làng ĐH",
    gradient: "linear-gradient(140deg, #1f7a5a, #5fc39b 60%, #cdeadd)"
  },
  {
    id: 103,
    content: "Chở đồ ra bến xe mới, xe 7 chỗ rộng rãi.",
    departurePoint: "Cổng sau UIT",
    destinationPoint: "Bến xe Miền Đông mới",
    pickupLocation: { id: "p3", name: "Cổng sau UIT", lat: 10.8700, lng: 106.8030 },
    dropoffLocation: { id: "d3", name: "Bến xe Miền Đông mới", lat: 10.8845, lng: 106.8285 },
    createdAt: new Date().toISOString(),
    user: { id: 203, name: "Quốc Bảo" },
    priceNum: 20000,
    timeStr: "08:00",
    joinedCount: 1,
    capacity: 3,
    vehicleType: "Ô tô 7 chỗ · 51K-770.03",
    driverRating: "5.0",
    distStr: "6,2 km · ~18 phút",
    tag: "BX Miền Đông",
    gradient: "linear-gradient(140deg, #b8621b, #e8a45f 58%, #f6ddc0)"
  },
  {
    id: 104,
    content: "Đi sân bay chuyến sáng sớm, ai cùng đường ghép cho rẻ.",
    departurePoint: "KTX Khu A, ĐHQG",
    destinationPoint: "Sân bay Tân Sơn Nhất",
    pickupLocation: { id: "p4", name: "KTX Khu A, ĐHQG", lat: 10.8765, lng: 106.7925 },
    dropoffLocation: { id: "d4", name: "Sân bay Tân Sơn Nhất", lat: 10.8185, lng: 106.6588 },
    createdAt: new Date().toISOString(),
    user: { id: 204, name: "Thanh Vy" },
    priceNum: 65000,
    timeStr: "05:15",
    joinedCount: 2,
    capacity: 4,
    vehicleType: "Ô tô 4 chỗ · 51G-201.88",
    driverRating: "4.9",
    distStr: "28,3 km · ~55 phút",
    tag: "TSN",
    gradient: "linear-gradient(140deg, #4b3fa8, #8d84e0 58%, #d9d6f6)"
  }
];

const PRESET_POOLING_REQUESTS: Post[] = [
  {
    id: 201,
    content: "Cần tìm tài xế hoặc 2 bạn sinh viên đi chung về Quận 1 chiều nay.",
    departurePoint: "Cổng chính UIT",
    destinationPoint: "Chợ Bến Thành, Quận 1",
    pickupLocation: { id: "p201", name: "Cổng chính UIT", lat: 10.8700, lng: 106.8030 },
    dropoffLocation: { id: "d201", name: "Chợ Bến Thành, Quận 1", lat: 10.7725, lng: 106.6980 },
    createdAt: new Date().toISOString(),
    user: { id: 301, name: "Ngọc Hân" },
    priceNum: 28000,
    timeStr: "17:30",
    joinedCount: 1,
    capacity: 3,
    vehicleType: "Đang tìm xe",
    driverRating: "4.7",
    distStr: "19,1 km · ~45 phút",
    tag: "Q.1",
    gradient: "linear-gradient(140deg, #c1477d, #e78fb4 58%, #f7d9e6)"
  },
  {
    id: 202,
    content: "Tụi mình có 2 người đi Aeon Bình Tân, cần thêm 1 bạn ghép xe.",
    departurePoint: "Làng Đại học Thủ Đức",
    destinationPoint: "Aeon Mall Bình Tân",
    pickupLocation: { id: "p202", name: "Làng Đại học Thủ Đức", lat: 10.8750, lng: 106.8000 },
    dropoffLocation: { id: "d202", name: "Aeon Mall Bình Tân", lat: 10.7425, lng: 106.6120 },
    createdAt: new Date().toISOString(),
    user: { id: 302, name: "Bảo Trân" },
    priceNum: 32000,
    timeStr: "18:00",
    joinedCount: 2,
    capacity: 4,
    vehicleType: "Đang tìm xe",
    driverRating: "4.9",
    distStr: "24,5 km · ~50 phút",
    tag: "Aeon",
    gradient: "linear-gradient(140deg, #0f7f86, #5cc2c8 58%, #cfeef0)"
  }
];

const formatMoney = (n: number) => {
  return n.toLocaleString('vi-VN').replace(/,/g, '.') + 'đ';
};

const getDestinationTag = (dest: string) => {
  if (dest.includes('UIT') || dest.includes('Công nghệ')) return 'UIT';
  if (dest.includes('Làng')) return 'Làng ĐH';
  if (dest.includes('Miền Đông')) return 'BX Miền Đông';
  if (dest.includes('Sân bay') || dest.includes('Tân Sơn')) return 'TSN';
  if (dest.includes('Quận 1') || dest.includes('Bến Thành')) return 'Q.1';
  if (dest.includes('Aeon')) return 'Aeon';
  return dest.substring(0, 8);
};

const getDestinationGradient = (tag: string, index: number) => {
  if (tag === 'UIT') return 'linear-gradient(140deg, #2f6fd8, #8fb6f2 55%, #cfe0f8)';
  if (tag === 'Làng ĐH') return 'linear-gradient(140deg, #1f7a5a, #5fc39b 60%, #cdeadd)';
  if (tag === 'BX Miền Đông') return 'linear-gradient(140deg, #b8621b, #e8a45f 58%, #f6ddc0)';
  if (tag === 'TSN') return 'linear-gradient(140deg, #4b3fa8, #8d84e0 58%, #d9d6f6)';
  if (tag === 'Q.1') return 'linear-gradient(140deg, #c1477d, #e78fb4 58%, #f7d9e6)';
  if (tag === 'Aeon') return 'linear-gradient(140deg, #0f7f86, #5cc2c8 58%, #cfeef0)';
  
  const gradients = [
    'linear-gradient(140deg, #2f6fd8, #8fb6f2 55%, #cfe0f8)',
    'linear-gradient(140deg, #1f7a5a, #5fc39b 60%, #cdeadd)',
    'linear-gradient(140deg, #b8621b, #e8a45f 58%, #f6ddc0)',
    'linear-gradient(140deg, #4b3fa8, #8d84e0 58%, #d9d6f6)'
  ];
  return gradients[index % gradients.length];
};

export default function Feed({ onStart, onToggleFooter }: FeedProps) {
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Online & Location Radar State
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return localStorage.getItem('cogo_is_online') === 'true';
  });
  const [isScanning, setIsScanning] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [scanStepText, setScanStepText] = useState('Chạm để chia sẻ vị trí và tìm chuyến');
  const [detectedLocation, setDetectedLocation] = useState('KTX Khu B, ĐHQG TP.HCM');

  const [joinStatus, setJoinStatus] = useState<Record<number, 'pending' | 'joined' | 'accepted'>>({});
  const [joiningPost, setJoiningPost] = useState<Post | null>(null);
  const [viewingRouteForPost, setViewingRouteForPost] = useState<Post | null>(null);
  const [selectedDetailPost, setSelectedDetailPost] = useState<Post | null>(null);
  
  const [feedType, setFeedType] = useState<'tham_gia' | 'bat_xe'>('tham_gia');
  
  // Filter chips state
  const [selectedChips, setSelectedChips] = useState<Record<string, boolean>>({
    today: true,
    car: false,
    under20k: false,
    nearMe: false
  });
  
  const [requestedSeats, setRequestedSeats] = useState(1);

  const handleGoOnline = () => {
    if (isScanning || isFadingOut) return;
    setIsScanning(true);
    setScanStepText('Đang lấy tọa độ GPS của bạn...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setDetectedLocation(`Tọa độ: ${lat}°N, ${lng}°E`);
        },
        () => {
          setDetectedLocation('KTX Khu B, ĐHQG TP.HCM');
        },
        { timeout: 2500 }
      );
    }

    setTimeout(() => {
      setScanStepText('Đang phát sóng kết nối các chuyến xe lân cận...');
    }, 450);

    setTimeout(() => {
      setScanStepText('Đã kết nối vị trí! Đang chuyển đến trang chủ...');
      // Start smooth fade out of the offline screen
      setIsFadingOut(true);
    }, 1000);

    setTimeout(() => {
      setIsScanning(false);
      setIsFadingOut(false);
      setIsOnline(true);
      localStorage.setItem('cogo_is_online', 'true');
    }, 1500);
  };

  const handleGoOffline = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsOnline(false);
      setIsFadingOut(false);
      localStorage.setItem('cogo_is_online', 'false');
      setScanStepText('Chạm để chia sẻ vị trí và tìm chuyến');
    }, 350);
  };

  // Sync footer visibility with active modals
  useEffect(() => {
    if (viewingRouteForPost || selectedDetailPost || joiningPost) {
      onToggleFooter?.(true);
    } else {
      onToggleFooter?.(false);
    }
  }, [viewingRouteForPost, selectedDetailPost, joiningPost, onToggleFooter]);

  useEffect(() => {
    return () => {
      onToggleFooter?.(false);
    };
  }, [onToggleFooter]);

  useEffect(() => {
    const fetchPostsAndRequests = async (user: any) => {
      try {
        const data = await api.posts.getAll();
        setDbPosts(data);
        
        if (user) {
          const userId = user.id || user.id_user;
          if (userId) {
            const requests = await api.posts.getUserRequests(userId);
            const statusMap: Record<number, 'pending' | 'joined' | 'accepted'> = {};
            requests.forEach((req: any) => {
              statusMap[req.post_id] = req.status;
            });
            setJoinStatus(statusMap);
          }
        }
      } catch (error) {
        console.error("Failed to fetch posts or requests", error);
      } finally {
        setLoading(false);
      }
    };

    let user = null;
    const userStr = localStorage.getItem('cogo_user');
    if (userStr) {
      user = JSON.parse(userStr);
      setCurrentUser(user);
    }
    
    fetchPostsAndRequests(user);
  }, []);

  const handleJoinSuccess = (postId: number) => {
    setJoinStatus(prev => ({ ...prev, [postId]: 'pending' }));
    setJoiningPost(null);
    setSelectedDetailPost(null);
  };

  const toggleChip = (chipKey: string) => {
    setSelectedChips(prev => ({ ...prev, [chipKey]: !prev[chipKey] }));
  };

  // Merge DB posts with preset sample trips for a rich, realistic feed
  const allPosts = useMemo(() => {
    const rawList = feedType === 'tham_gia' 
      ? [...PRESET_DRIVER_TRIPS, ...dbPosts.filter(p => p.id > 200 || p.departurePoint)]
      : PRESET_POOLING_REQUESTS;

    return rawList.map((p, idx) => {
      const dest = p.destinationPoint || p.dropoffLocation?.name || 'Đại học Công nghệ Thông tin UIT';
      const tag = p.tag || getDestinationTag(dest);
      const gradient = p.gradient || getDestinationGradient(tag, idx);
      const priceNum = p.priceNum || (idx === 0 ? 15000 : idx === 1 ? 12000 : idx === 2 ? 20000 : 65000);
      const timeStr = p.timeStr || (p.content.match(/(\d{1,2}:\d{2})/)?.[0] || '07:30');
      const capacity = p.capacity || 4;
      const joinedCount = p.joinedCount || (idx % 2 === 0 ? 3 : 2);
      
      return {
        ...p,
        destinationPoint: dest,
        departurePoint: p.departurePoint || p.pickupLocation?.name || 'KTX Khu B, ĐHQG TP.HCM',
        tag,
        gradient,
        priceNum,
        timeStr,
        capacity,
        joinedCount,
        vehicleType: p.vehicleType || 'Ô tô 4 chỗ · 51F-882.14',
        driverRating: p.driverRating || '4.9',
        distStr: p.distStr || '12,4 km · ~35 phút'
      };
    });
  }, [dbPosts, feedType]);

  // Filter based on active chips
  const filteredPosts = useMemo(() => {
    return allPosts.filter(p => {
      if (selectedChips.car && p.vehicleType && !p.vehicleType.includes('Ô tô')) {
        return false;
      }
      if (selectedChips.under20k && p.priceNum && p.priceNum > 20000) {
        return false;
      }
      if (selectedChips.nearMe && !p.departurePoint.includes('KTX') && !p.departurePoint.includes('UIT')) {
        return false;
      }
      return true;
    });
  }, [allPosts, selectedChips]);

  const activeTripCountText = useMemo(() => {
    const count = filteredPosts.length;
    if (feedType === 'tham_gia') {
      return `${count} chuyến có tài xế`;
    }
    return `${count} yêu cầu ghép xe`;
  }, [filteredPosts.length, feedType]);

  // If user is not online yet, render the "bạn đã online chưa" radar water-ripple screen
  if (!isOnline) {
    return (
      <div className={`flex-1 w-full h-full relative bg-[#ffffff] text-[#141b2c] flex flex-col font-sans select-none overflow-y-auto no-scrollbar transition-all duration-500 ease-out ${
        isFadingOut ? 'page-transition-exit opacity-0 scale-95' : 'page-transition-enter opacity-100 scale-100'
      }`}>
        {/* Top Header Bar */}
        <div className="px-6 pt-9 pb-3 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[14px] bg-[#e6f2ec] flex items-center justify-center text-[#006b47]">
              <Car className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-[26px] font-black text-[#141b2c] tracking-tight">
              Cogo
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f2f1] text-[#6f7a76] text-[12px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <span>Chưa online</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 text-center z-10">
          
          {/* Header Title */}
          <div className="mb-2">
            <h1 className="text-[28px] sm:text-[30px] font-extrabold text-[#141b2c] tracking-tight leading-tight">
              bạn đã online chưa
            </h1>
            <p className="text-[13.5px] text-[#6f7a76] mt-2 max-w-[290px] mx-auto leading-relaxed">
              Chạm vào nút để bật định vị, chia sẻ vị trí của bạn và khám phá các chuyến xe xung quanh.
            </p>
          </div>

          {/* Central Water Ripple Radar Button */}
          <div className="relative flex items-center justify-center my-8 sm:my-10">
            
            {/* Water Ripple Waves (sóng nước vỗ ra khi ấn) */}
            {isScanning && (
              <>
                <div className="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border-2 border-[#006b47]/70 bg-[#006b47]/10 animate-water-ripple-1 pointer-events-none" />
                <div className="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border-2 border-[#006b47]/50 bg-[#006b47]/10 animate-water-ripple-2 pointer-events-none" />
                <div className="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border-2 border-[#006b47]/30 bg-[#006b47]/5 animate-water-ripple-3 pointer-events-none" />
                <div className="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border border-[#006b47]/20 animate-water-ripple-slow pointer-events-none" />
              </>
            )}

            {/* Double Outer Rings (matching wireframe drawing) */}
            <div className={`w-56 h-56 sm:w-60 sm:h-60 rounded-full border-4 ${isScanning ? 'border-[#006b47]/40 scale-105' : 'border-[#bdcac0]/40'} flex items-center justify-center relative p-2 transition-all duration-500`}>
              
              {/* Inner Circle Interactive Button */}
              <button
                type="button"
                onClick={handleGoOnline}
                disabled={isScanning}
                className={`w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-[#006b47] to-[#00875a] hover:from-[#00875a] hover:to-[#00a86b] text-white shadow-[0_12px_36px_rgba(0,107,71,0.35)] flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300 transform active:scale-95 z-10 select-none ${
                  isScanning ? 'animate-pulse-glow' : 'hover:scale-[1.02]'
                }`}
                title="Bật online và chia sẻ vị trí"
              >
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mb-1.5">
                  {isScanning ? (
                    <Waves className="w-6 h-6 animate-pulse text-white" />
                  ) : (
                    <Navigation className="w-6 h-6 text-white rotate-45" />
                  )}
                </div>

                <span className="font-extrabold text-[15px] tracking-wide uppercase">
                  {isScanning ? "Đang phát sóng..." : "BẬT ONLINE"}
                </span>
                
                <span className="text-[12px] text-white/85 font-medium mt-0.5">
                  Chia sẻ vị trí
                </span>
              </button>
            </div>
          </div>

          {/* Status microcopy box */}
          <div className="w-full max-w-[320px] bg-[#f9f9ff] border border-[#eceeed] rounded-[18px] p-3.5 flex items-center gap-3 text-left transition-all">
            <div className="w-8 h-8 rounded-full bg-[#e6f2ec] flex items-center justify-center text-[#006b47] shrink-0">
              {isScanning ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#006b47]" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-[#8a9490] uppercase tracking-wider">
                Trạng thái định vị
              </div>
              <div className="text-[13px] font-bold text-[#141b2c] truncate">
                {scanStepText}
              </div>
            </div>
          </div>

          {/* Direct CTA button below */}
          <button
            type="button"
            onClick={handleGoOnline}
            disabled={isScanning}
            className="mt-4 w-full max-w-[320px] bg-[#006b47] hover:bg-[#00875a] text-white font-bold py-3.5 px-6 rounded-[16px] text-[14.5px] shadow-[0_4px_16px_rgba(0,107,71,0.25)] active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang phát sóng vị trí...</span>
              </>
            ) : (
              <>
                <span>Chia sẻ vị trí & Xem chuyến</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 w-full h-full relative bg-[#f9f9ff] text-[#141b2c] flex flex-col font-sans select-none overflow-hidden transition-all duration-500 ease-out ${
      isFadingOut ? 'page-transition-exit opacity-0 scale-95' : 'page-transition-enter opacity-100 scale-100'
    }`}>
      
      {/* Active Online Status Bar */}
      <div className="px-5 pt-3 pb-2 bg-[#e6f2ec]/70 border-b border-[#006b47]/10 flex items-center justify-between text-[#006b47] text-[12px] font-medium shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-[#006b47] animate-pulse shrink-0"></span>
          <span className="truncate font-bold">
            Online: <span className="font-normal text-[#141b2c]">{detectedLocation}</span>
          </span>
        </div>
        <button
          onClick={handleGoOffline}
          className="text-[11.5px] font-bold text-[#006b47] hover:text-[#00875a] px-2 py-0.5 rounded-md hover:bg-white transition-all shrink-0"
          title="Chuyển về màn hình radar offline"
        >
          Tắt online
        </button>
      </div>

      {/* Top Header Tabs */}
      <div className="z-30 px-5 pt-4 pb-0 bg-white border-b border-[#edf0ee] shrink-0">
        <div className="flex items-center gap-7">
          <button 
            onClick={() => { setFeedType('tham_gia'); }}
            className={`text-[16px] font-bold transition-all relative pb-3 ${
              feedType === 'tham_gia' 
                ? 'text-[#141b2c]' 
                : 'text-[#8a9490] hover:text-[#141b2c]'
            }`}
          >
            Tham gia cùng
            {feedType === 'tham_gia' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#006b47] rounded-full" />
            )}
          </button>

          <button 
            onClick={() => { setFeedType('bat_xe'); }}
            className={`text-[16px] font-bold transition-all relative pb-3 ${
              feedType === 'bat_xe' 
                ? 'text-[#141b2c]' 
                : 'text-[#8a9490] hover:text-[#141b2c]'
            }`}
          >
            Bắt xe chung
            {feedType === 'bat_xe' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#006b47] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Filter Chips Bar */}
      <div className="z-20 px-5 py-3 bg-[#f9f9ff] flex items-center gap-2.5 overflow-x-auto no-scrollbar shrink-0 border-b border-[#eceeed]/60">
        <button 
          onClick={() => toggleChip('today')}
          className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1 border ${
            selectedChips.today 
              ? 'bg-[#e6f2ec] text-[#006b47] border-[#006b47]/30 shadow-xs' 
              : 'bg-white text-[#5c6763] border-[#e4e8e6]'
          }`}
        >
          <span>Hôm nay</span>
        </button>

        <button 
          onClick={() => toggleChip('car')}
          className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 border ${
            selectedChips.car 
              ? 'bg-[#e6f2ec] text-[#006b47] border-[#006b47]/30 shadow-xs' 
              : 'bg-white text-[#5c6763] border-[#e4e8e6]'
          }`}
        >
          <span>Ô tô</span>
        </button>

        <button 
          onClick={() => toggleChip('under20k')}
          className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 border ${
            selectedChips.under20k 
              ? 'bg-[#e6f2ec] text-[#006b47] border-[#006b47]/30 shadow-xs' 
              : 'bg-white text-[#5c6763] border-[#e4e8e6]'
          }`}
        >
          <span>Dưới 20.000đ</span>
        </button>

        <button 
          onClick={() => toggleChip('nearMe')}
          className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 border ${
            selectedChips.nearMe 
              ? 'bg-[#e6f2ec] text-[#006b47] border-[#006b47]/30 shadow-xs' 
              : 'bg-white text-[#5c6763] border-[#e4e8e6]'
          }`}
        >
          <span>Gần tôi &lt; 2km</span>
        </button>
      </div>

      {/* Sort & Counter Header */}
      <div className="px-5 pt-2 pb-1.5 flex items-center justify-between shrink-0">
        <span className="text-[13.5px] font-bold text-[#141b2c]">
          {activeTripCountText}
        </span>
        <span className="text-[12px] text-[#8a9490] font-medium">
          Sắp xếp: giờ khởi hành
        </span>
      </div>

      {/* Main Feed Card List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 sm:pb-24 pt-1 space-y-3 no-scrollbar">
        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#006b47] mb-2" />
            <span className="text-[13px] text-[#8a9490]">Đang tải chuyến đi...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <div className="w-14 h-14 rounded-full bg-[#e6f2ec] flex items-center justify-center mb-3 text-[#006b47]">
              <Car className="w-7 h-7" />
            </div>
            <p className="font-bold text-[15px] text-[#141b2c]">Không có chuyến phù hợp</p>
            <p className="text-[12.5px] text-[#8a9490] mt-1">Hãy thử bỏ bớt bộ lọc hoặc chọn khung giờ khác nhé.</p>
          </div>
        ) : (
          filteredPosts.map((trip) => {
            const seatsLeft = (trip.capacity || 4) - (trip.joinedCount || 0);
            const badgeText = seatsLeft <= 1 ? "Còn 1 chỗ" : `Còn ${seatsLeft} chỗ`;

            return (
              <div 
                key={trip.id}
                onClick={() => setSelectedDetailPost(trip)}
                className="w-full bg-white rounded-[20px] p-3.5 border border-[#eceeed] shadow-[0_2px_8px_rgba(20,27,44,0.04)] flex gap-3.5 items-center cursor-pointer hover:border-[#bcdccd] active:scale-[0.99] transition-all"
              >
                {/* Left Thumbnail with destination branding */}
                <div 
                  className="w-[76px] h-[76px] sm:w-[80px] sm:h-[80px] rounded-[16px] overflow-hidden relative shrink-0 flex items-end p-2"
                  style={{ background: trip.gradient }}
                >
                  <div className="absolute inset-0 bg-radial from-white/30 to-transparent pointer-events-none" />
                  <span className="relative z-10 text-white font-bold text-[11px] drop-shadow-sm leading-none">
                    {trip.tag}
                  </span>
                </div>

                {/* Right / Middle Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  {/* Top: Destination & Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-[14.5px] text-[#141b2c] line-clamp-1 leading-snug">
                      {trip.destinationPoint}
                    </h3>
                    <span className="px-2 py-0.5 rounded-[8px] bg-[#e6f2ec] text-[#006b47] text-[11px] font-bold shrink-0 whitespace-nowrap">
                      {badgeText}
                    </span>
                  </div>

                  {/* Middle: Pickup Location */}
                  <div className="flex items-center gap-1.5 text-[12px] text-[#6f7a76] mt-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-[#9aa4a0] shrink-0" />
                    <span className="truncate">{trip.departurePoint}</span>
                  </div>

                  {/* Bottom: Time, Seats, and Price */}
                  <div className="flex items-center gap-3 mt-1.5 pt-0.5">
                    <div className="flex items-center gap-1 text-[12px] font-semibold text-[#3f4a46]">
                      <Clock className="w-3.5 h-3.5 text-[#00875a]" />
                      <span>{trip.timeStr}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[12px] font-semibold text-[#3f4a46]">
                      <Users className="w-3.5 h-3.5 text-[#00875a]" />
                      <span>{trip.joinedCount}/{trip.capacity} người</span>
                    </div>

                    <div className="ml-auto font-bold text-[13.5px] text-[#006b47]">
                      {formatMoney(trip.priceNum || 15000)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {filteredPosts.length > 0 && (
          <div className="text-center text-[12px] text-[#9aa4a0] pt-3 pb-2 font-medium">
            Bạn đã xem hết chuyến hôm nay
          </div>
        )}
      </div>

      {/* Interactive Full Route Map Modal */}
      {viewingRouteForPost && viewingRouteForPost.pickupLocation && viewingRouteForPost.dropoffLocation && (
        <div className="absolute inset-0 z-[60] bg-white text-black flex flex-col animate-in fade-in duration-200 overflow-hidden">
          <RouteMap
            pickupLocation={viewingRouteForPost.pickupLocation}
            dropoffLocation={viewingRouteForPost.dropoffLocation}
            price={viewingRouteForPost.priceNum || 15000}
            onJoin={() => {
              const postToJoin = viewingRouteForPost;
              setViewingRouteForPost(null);
              setJoiningPost(postToJoin);
            }}
            onBack={() => setViewingRouteForPost(null)}
            mode="view"
          />
        </div>
      )}

      {/* Join Request Modal */}
      {joiningPost && (
        <div className="absolute inset-0 z-[70] overflow-hidden">
          <JoinRequestModal
            post={joiningPost}
            currentUser={currentUser}
            onClose={() => setJoiningPost(null)}
            onSuccess={handleJoinSuccess}
          />
        </div>
      )}

      {/* Detailed Trip Bottom Sheet / Modal View when a card is selected */}
      {selectedDetailPost && (
        <div className="absolute inset-0 z-50 bg-[#141b2c]/60 backdrop-blur-xs flex flex-col justify-end overflow-hidden animate-in fade-in duration-200">
          <div 
            onClick={() => setSelectedDetailPost(null)}
            className="flex-1 w-full"
          />
          <div className="w-full max-h-[85%] bg-[#f9f9ff] rounded-t-[28px] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Modal Header / Banner */}
            <div 
              className="relative h-[135px] sm:h-[145px] p-4 flex flex-col justify-between shrink-0"
              style={{ background: selectedDetailPost.gradient }}
            >
              <div className="flex items-center justify-between z-10">
                <button 
                  onClick={() => setSelectedDetailPost(null)}
                  className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#141b2c] shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                
                {selectedDetailPost.pickupLocation && selectedDetailPost.dropoffLocation && (
                  <button 
                    onClick={() => setViewingRouteForPost(selectedDetailPost)}
                    className="bg-[#006b47] hover:bg-[#00875a] text-white text-[12px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md"
                  >
                    <Map className="w-3.5 h-3.5" />
                    <span>Xem lộ trình</span>
                  </button>
                )}
              </div>

              <div className="z-10">
                <h2 className="text-[18px] font-bold text-white drop-shadow-md leading-tight line-clamp-2">
                  {selectedDetailPost.destinationPoint}
                </h2>
                <span className="text-[11.5px] text-white/90 font-medium">
                  Điểm đến
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3 no-scrollbar flex-1 min-h-0">
              {/* Trip Info Quick Cards */}
              <div className="bg-white rounded-[18px] p-3.5 border border-[#eceeed] space-y-2.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e6f2ec] text-[#006b47] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[#141b2c] truncate">
                      Tài xế {selectedDetailPost.user?.name || 'có sẵn'}
                    </div>
                    <div className="text-[11px] text-[#6f7a76] truncate">
                      {selectedDetailPost.vehicleType} · {selectedDetailPost.driverRating} ★
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0eded] text-[#3f4a46] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[#141b2c]">
                      Khởi hành: {selectedDetailPost.timeStr}
                    </div>
                    <div className="text-[11px] text-[#6f7a76]">
                      {selectedDetailPost.distStr}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e6f2ec] text-[#006b47] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[#141b2c]">
                      {selectedDetailPost.joinedCount}/{selectedDetailPost.capacity} người tham gia
                    </div>
                    <div className="text-[11px] text-[#6f7a76]">
                      Còn {(selectedDetailPost.capacity || 4) - (selectedDetailPost.joinedCount || 0)} ghế trống
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Summary */}
              <div className="bg-white rounded-[18px] p-3.5 border border-[#eceeed] shadow-xs">
                <h4 className="text-[12.5px] font-bold text-[#141b2c] mb-2">Lộ trình chi tiết</h4>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00875a] mt-1 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#141b2c]">Điểm đón</div>
                      <div className="text-[#6f7a76]">{selectedDetailPost.departurePoint}</div>
                    </div>
                  </div>
                  <div className="w-0.5 h-3 bg-[#eceeed] ml-1" />
                  <div className="flex items-start gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#006b47] mt-1 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#141b2c]">Điểm đến</div>
                      <div className="text-[#6f7a76]">{selectedDetailPost.destinationPoint}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eco Badge */}
              <div className="bg-[#e6f2ec] rounded-[14px] p-3 flex items-center gap-2.5 text-[#006b47]">
                <Leaf className="w-4 h-4 shrink-0" />
                <span className="text-[11.5px] font-medium leading-snug">
                  Ghép chuyến này giúp giảm ~1,8 kg CO₂ và tiết kiệm 60% chi phí di chuyển.
                </span>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-3.5 px-4 bg-white border-t border-[#eceeed] flex items-center justify-between gap-3 shrink-0">
              <div>
                <span className="text-[10.5px] text-[#8a9490] font-semibold block">Chi phí chia sẻ</span>
                <span className="text-[18px] font-bold text-[#006b47]">
                  {formatMoney(selectedDetailPost.priceNum || 15000)}
                </span>
              </div>

              <button 
                onClick={() => {
                  setJoiningPost(selectedDetailPost);
                }}
                className="flex-1 max-w-[200px] bg-[#006b47] hover:bg-[#00875a] text-white font-bold text-[14px] py-3 px-4 rounded-[14px] flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
              >
                <span>Tham gia ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
