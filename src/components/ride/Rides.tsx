import React, { useState, useEffect } from 'react';
import { Car, Loader2, MessageSquare, Send, X, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import RideTracking from './RideTracking';

interface RidesProps {
  onFindRide: () => void;
}

interface DisplayRide {
  id: string | number;
  status: 'accepted' | 'waiting' | 'in_progress' | 'completed' | 'canceled';
  statusText: string;
  statusBg: string;
  statusColor: string;
  timeStr: string;
  pickupPoint: string;
  dropoffPoint: string;
  pickupLocation?: any;
  dropoffLocation?: any;
  members: { name: string; isYou?: boolean; avatarColor?: string }[];
  primaryAction: 'chat' | 'detail' | 'tracking' | 'review';
  primaryActionText: string;
  price?: number;
  driverName?: string;
  vehicle?: string;
}

export default function Rides({ onFindRide }: RidesProps) {
  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'history'>('upcoming');
  const [rides, setRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [activeChatRide, setActiveChatRide] = useState<DisplayRide | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; isMe: boolean; time: string }>>([
    { sender: 'Tài xế Minh Tuấn', text: 'Chào bạn, mình sẽ đón bạn tại cổng KTX Khu B lúc 07:25 nhé!', isMe: false, time: '07:15' },
    { sender: 'Bạn', text: 'Dạ vâng, em đã sẵn sàng ở sảnh rồi ạ!', isMe: true, time: '07:18' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');
        const userId = user.id || user.id_user;
        
        if (userId && !isNaN(Number(userId))) {
          const fetchedRides = await api.rides.getByUserId(userId);
          setRides(fetchedRides || []);
        }
      } catch (error: any) {
        console.error('Failed to fetch rides:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRides();
  }, []);

  // Demo rides matching the exact UI in image.png if user has no DB trips yet
  const defaultUpcomingRides: DisplayRide[] = [
    {
      id: 'demo-1',
      status: 'accepted',
      statusText: 'Đã được nhận',
      statusBg: 'bg-[#dcf3e8]',
      statusColor: 'text-[#006b47]',
      timeStr: 'Hôm nay, 07:30',
      pickupPoint: 'KTX Khu B, ĐHQG',
      dropoffPoint: 'Đại học CNTT UIT',
      pickupLocation: { name: 'KTX Khu B, ĐHQG', lat: 10.8804, lng: 106.7820 },
      dropoffLocation: { name: 'Đại học CNTT UIT', lat: 10.8700, lng: 106.8030 },
      members: [
        { name: 'MT', avatarColor: 'bg-[#dcf3e8] text-[#006b47]' },
        { name: 'LA', avatarColor: 'bg-[#dcf3e8] text-[#006b47]' },
        { name: 'Bạn', isYou: true, avatarColor: 'bg-[#dcf3e8] text-[#006b47]' }
      ],
      primaryAction: 'chat',
      primaryActionText: 'Mở chat',
      price: 15000,
      driverName: 'Minh Tuấn',
      vehicle: 'Honda City • 51H-892.45'
    },
    {
      id: 'demo-2',
      status: 'waiting',
      statusText: 'Chờ ghép xe',
      statusBg: 'bg-[#fef3c7]',
      statusColor: 'text-[#b45309]',
      timeStr: 'Mai, 17:30',
      pickupPoint: 'UIT',
      dropoffPoint: 'Chợ Bến Thành',
      pickupLocation: { name: 'UIT', lat: 10.8700, lng: 106.8030 },
      dropoffLocation: { name: 'Chợ Bến Thành', lat: 10.7720, lng: 106.6983 },
      members: [
        { name: 'NH', avatarColor: 'bg-[#dcf3e8] text-[#006b47]' },
        { name: 'Bạn', isYou: true, avatarColor: 'bg-[#dcf3e8] text-[#006b47]' }
      ],
      primaryAction: 'detail',
      primaryActionText: 'Chi tiết',
      price: 35000
    }
  ];

  const defaultHistoryRides: DisplayRide[] = [
    {
      id: 'demo-hist-1',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      statusBg: 'bg-[#f0f2f1]',
      statusColor: 'text-[#5c6763]',
      timeStr: '18 Th08, 08:00',
      pickupPoint: 'KTX Khu A, ĐHQG',
      dropoffPoint: 'Đại học Quốc Tế - ĐHQG',
      members: [
        { name: 'TP', avatarColor: 'bg-[#f0f2f1] text-[#5c6763]' },
        { name: 'Bạn', isYou: true, avatarColor: 'bg-[#f0f2f1] text-[#5c6763]' }
      ],
      primaryAction: 'review',
      primaryActionText: 'Đánh giá',
      price: 12000
    },
    {
      id: 'demo-hist-2',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      statusBg: 'bg-[#f0f2f1]',
      statusColor: 'text-[#5c6763]',
      timeStr: '16 Th08, 17:15',
      pickupPoint: 'Đại học Bách Khoa CS2',
      dropoffPoint: 'Suối Tiên',
      members: [
        { name: 'KD', avatarColor: 'bg-[#f0f2f1] text-[#5c6763]' },
        { name: 'HL', avatarColor: 'bg-[#f0f2f1] text-[#5c6763]' },
        { name: 'Bạn', isYou: true, avatarColor: 'bg-[#f0f2f1] text-[#5c6763]' }
      ],
      primaryAction: 'detail',
      primaryActionText: 'Xem lại',
      price: 18000
    }
  ];

  // Map real backend rides if present
  const transformedBackendRides: DisplayRide[] = rides.map((r: any) => {
    const isCompleted = r.status === 'Completed' || r.Trang_thai === 'Completed';
    const isAccepted = r.status === 'Accepted' || r.Trang_thai === 'Accepted' || r.status === 'in_progress';
    
    return {
      id: r.id_ride || r.id,
      status: isCompleted ? 'completed' : isAccepted ? 'accepted' : 'waiting',
      statusText: isCompleted ? 'Đã hoàn thành' : isAccepted ? 'Đã được nhận' : 'Chờ ghép xe',
      statusBg: isCompleted ? 'bg-[#f0f2f1]' : isAccepted ? 'bg-[#dcf3e8]' : 'bg-[#fef3c7]',
      statusColor: isCompleted ? 'text-[#5c6763]' : isAccepted ? 'text-[#006b47]' : 'text-[#b45309]',
      timeStr: r.departure_time || 'Hôm nay, 14:30',
      pickupPoint: r.Diem_don?.name || r.pickup_location?.name || r.Diem_don?.address || 'Điểm đón',
      dropoffPoint: r.Diem_den?.name || r.dropoff_location?.name || r.Diem_den?.address || 'Điểm đến',
      pickupLocation: r.Diem_don || r.pickup_location,
      dropoffLocation: r.Diem_den || r.dropoff_location,
      members: [
        { name: 'TX', avatarColor: 'bg-[#dcf3e8] text-[#006b47]' },
        { name: 'Bạn', isYou: true, avatarColor: 'bg-[#dcf3e8] text-[#006b47]' }
      ],
      primaryAction: isAccepted ? 'chat' : 'detail',
      primaryActionText: isAccepted ? 'Mở chat' : 'Chi tiết',
      price: r.price || 20000
    };
  });

  const displayList = activeSubTab === 'upcoming' 
    ? (transformedBackendRides.filter(r => r.status !== 'completed').length > 0 
        ? transformedBackendRides.filter(r => r.status !== 'completed') 
        : defaultUpcomingRides)
    : (transformedBackendRides.filter(r => r.status === 'completed').length > 0 
        ? transformedBackendRides.filter(r => r.status === 'completed') 
        : defaultHistoryRides);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'Bạn',
        text: newMessage.trim(),
        isMe: true,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewMessage('');
  };

  if (selectedRide) {
    return (
      <div className="absolute inset-0 z-[100] bg-white flex flex-col">
        <RideTracking
          rideId={String(selectedRide.id || selectedRide.id_ride || 1)}
          onBack={() => setSelectedRide(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-[#f9f9ff] flex flex-col relative font-sans text-[#141b2c] select-none">
      
      {/* Top Header */}
      <div className="px-5 pt-6 pb-0 bg-[#f9f9ff] sticky top-0 z-10">
        <h1 className="text-[24px] font-bold text-[#141b2c] tracking-tight">
          Chuyến của tôi
        </h1>

        {/* Tab Navigation with clean underline indicator */}
        <div className="flex items-center gap-7 mt-3 border-b border-[#eceeed]">
          <button 
            onClick={() => setActiveSubTab('upcoming')}
            className={`pb-2.5 text-[15px] font-bold relative transition-colors ${
              activeSubTab === 'upcoming' 
                ? 'text-[#141b2c]' 
                : 'text-[#8a9490] hover:text-[#5c6763] font-semibold'
            }`}
          >
            <span>Sắp tới</span>
            {activeSubTab === 'upcoming' && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#006b47] rounded-full" />
            )}
          </button>

          <button 
            onClick={() => setActiveSubTab('history')}
            className={`pb-2.5 text-[15px] font-bold relative transition-colors ${
              activeSubTab === 'history' 
                ? 'text-[#141b2c]' 
                : 'text-[#8a9490] hover:text-[#5c6763] font-semibold'
            }`}
          >
            <span>Lịch sử</span>
            {activeSubTab === 'history' && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#006b47] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="px-4 pt-3.5 space-y-3.5 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#006b47] mb-2" />
            <span className="text-[13px] text-[#8a9490]">Đang tải danh sách chuyến đi...</span>
          </div>
        ) : displayList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#e6f2ec] flex items-center justify-center mb-3 text-[#006b47]">
              <Car className="w-7 h-7" />
            </div>
            <p className="font-bold text-[15px] text-[#141b2c]">Không có chuyến đi nào</p>
            <p className="text-[12.5px] text-[#8a9490] mt-1 mb-5">Bạn chưa có chuyến đi nào trong mục này.</p>
            <button
              onClick={onFindRide}
              className="bg-[#006b47] text-white text-[13px] font-bold px-5 py-2.5 rounded-full shadow-xs hover:bg-[#00875a] transition-all"
            >
              Tìm chuyến ngay
            </button>
          </div>
        ) : (
          displayList.map((ride) => (
            <div 
              key={ride.id}
              className="bg-white rounded-[22px] p-4 border border-[#eceeed] shadow-[0_2px_12px_rgba(20,27,44,0.03)] hover:border-[#ccdcd4] transition-all"
            >
              {/* Header: Status Pill & Time */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-[12px] font-bold leading-none ${ride.statusBg} ${ride.statusColor}`}>
                  {ride.statusText}
                </span>
                <span className="text-[#6f7a76] text-[13px] font-medium">
                  {ride.timeStr}
                </span>
              </div>

              {/* Vertical Route Section */}
              <div className="space-y-1.5 pl-1 my-2">
                {/* Pickup Point */}
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full border-[2.2px] border-[#006b47] bg-white mt-1 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11.5px] text-[#8a9490] font-medium leading-none mb-1">
                      Điểm đón
                    </div>
                    <div className="text-[14.5px] font-bold text-[#141b2c] line-clamp-1 leading-snug">
                      {ride.pickupPoint}
                    </div>
                  </div>
                </div>

                {/* Vertical Dashed Line */}
                <div className="w-0 border-l-[1.5px] border-dashed border-[#ccd3cf] ml-[4px] h-3.5" />

                {/* Dropoff Point */}
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#006b47] mt-1 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11.5px] text-[#8a9490] font-medium leading-none mb-1">
                      Điểm đến
                    </div>
                    <div className="text-[14.5px] font-bold text-[#141b2c] line-clamp-1 leading-snug">
                      {ride.dropoffPoint}
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider & Footer: Member Avatars + Action Button */}
              <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-[#f0f2f1]">
                {/* Member Avatars */}
                <div className="flex items-center">
                  {ride.members.map((member, idx) => (
                    <div 
                      key={idx}
                      className={`w-[29px] h-[29px] rounded-full text-[11px] font-bold flex items-center justify-center -mr-1.5 ring-2 ring-white shadow-2xs ${member.avatarColor || 'bg-[#dcf3e8] text-[#006b47]'}`}
                      title={member.name}
                    >
                      {member.name}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div>
                  {ride.primaryAction === 'chat' ? (
                    <button 
                      onClick={() => setActiveChatRide(ride)}
                      className="bg-[#006b47] hover:bg-[#00875a] text-white font-bold text-[13.5px] px-4 py-2 rounded-[14px] shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <span>{ride.primaryActionText}</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => setSelectedRide(ride)}
                      className="bg-white border border-[#d2d8d5] text-[#141b2c] font-bold text-[13.5px] px-4 py-2 rounded-[14px] hover:bg-gray-50 active:scale-95 transition-all shadow-2xs"
                    >
                      <span>{ride.primaryActionText}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* In-App Chat Modal when "Mở chat" is clicked */}
      {activeChatRide && (
        <div className="absolute inset-0 z-50 bg-[#141b2c]/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div 
            onClick={() => setActiveChatRide(null)}
            className="flex-1 w-full"
          />
          <div className="w-full h-[85%] bg-white rounded-t-[28px] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Chat Header */}
            <div className="px-4 py-3.5 bg-white border-b border-[#eceeed] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveChatRide(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#141b2c] active:scale-95 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="font-bold text-[15px] text-[#141b2c] leading-tight flex items-center gap-1.5">
                    <span>Trò chuyện chuyến đi</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006b47]" />
                  </h3>
                  <p className="text-[11.5px] text-[#6f7a76] truncate max-w-[200px]">
                    {activeChatRide.pickupPoint} → {activeChatRide.dropoffPoint}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  const r = activeChatRide;
                  setActiveChatRide(null);
                  setSelectedRide(r);
                }}
                className="bg-[#e6f2ec] text-[#006b47] font-bold text-[12px] px-3 py-1.5 rounded-full hover:bg-[#d5ebd0] transition-colors"
              >
                Xem vị trí
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f9f9ff]">
              <div className="text-center my-1">
                <span className="text-[11px] bg-gray-200/70 text-[#6f7a76] px-2.5 py-0.5 rounded-full font-medium">
                  Hôm nay
                </span>
              </div>

              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                >
                  {!msg.isMe && (
                    <span className="text-[11px] text-[#8a9490] font-semibold mb-1 ml-1">
                      {msg.sender}
                    </span>
                  )}
                  <div 
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-[18px] text-[13.5px] leading-relaxed shadow-2xs ${
                      msg.isMe 
                        ? 'bg-[#006b47] text-white rounded-br-xs' 
                        : 'bg-white text-[#141b2c] border border-[#eceeed] rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#9aa4a0] mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form 
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-[#eceeed] flex items-center gap-2 shrink-0"
            >
              <input 
                type="text"
                placeholder="Nhắn tin cho tài xế và bạn đồng hành..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-[#f0f2f1] text-[13.5px] px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#006b47] text-[#141b2c] placeholder:text-[#8a9490]"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="w-10 h-10 rounded-full bg-[#006b47] hover:bg-[#00875a] text-white flex items-center justify-center disabled:opacity-50 active:scale-95 transition-all shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
