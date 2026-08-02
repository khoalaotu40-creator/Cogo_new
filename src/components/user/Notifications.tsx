import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, MapPin, Loader2, Navigation } from 'lucide-react';
import { api } from '../../../lib/api';

interface NotificationProps {
  onBack: () => void;
  currentUser: any;
}

export default function Notifications({ onBack, currentUser }: NotificationProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const userId = currentUser.id || currentUser.id_user;
      const data = await api.posts.getNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: number, status: 'accepted' | 'rejected') => {
    setProcessingId(requestId);
    try {
      await api.posts.respondToRequest(requestId, status);
      // Remove from list
      setNotifications(prev => prev.filter(n => n.request_id !== requestId));
    } catch (error) {
      console.error("Failed to respond to request", error);
    } finally {
      setProcessingId(null);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col h-full absolute inset-0 z-50 animate-in slide-in-from-right">
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-[22px] h-[22px] text-gray-800" />
          </button>
          <h2 className="text-[18px] font-bold text-gray-900">Thông báo</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#006b3f] mb-2" />
            <p className="text-sm">Đang tải...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-8 text-gray-500 bg-white rounded-[16px] shadow-sm">
            <p className="text-sm font-medium">Bạn không có thông báo nào mới</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div key={notification.request_id} className="bg-white rounded-[16px] p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <img src={notification.requester_avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-[15px] text-gray-900">{notification.requester_name}</h3>
                    <span className="text-[12px] text-gray-500">{formatTimeAgo(notification.created_at)}</span>
                  </div>
                  <p className="text-[13px] text-gray-700 mt-0.5">
                    Muốn tham gia chuyến đi của bạn: <span className="font-medium">"{notification.departure_point} → {notification.destination_point}"</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-[12px] p-3 mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-gray-500 min-w-[60px]">Số lượng:</span>
                  <span className="text-[13px] font-bold text-gray-900">{notification.requested_seats} chỗ</span>
                </div>
                {notification.pickup_point && (
                  <div className="flex items-start gap-2">
                    <span className="text-[12px] font-medium text-gray-500 min-w-[60px] mt-0.5">Điểm đón:</span>
                    <span className="text-[13px] font-medium text-gray-900 leading-tight">
                      {typeof notification.pickup_point === 'string' ? JSON.parse(notification.pickup_point).address : notification.pickup_point?.address || notification.pickup_point?.name}
                    </span>
                  </div>
                )}
                {notification.dropoff_point && (
                  <div className="flex items-start gap-2">
                    <span className="text-[12px] font-medium text-gray-500 min-w-[60px] mt-0.5">Điểm đến:</span>
                    <span className="text-[13px] font-medium text-gray-900 leading-tight">
                      {typeof notification.dropoff_point === 'string' ? JSON.parse(notification.dropoff_point).address : notification.dropoff_point?.address || notification.dropoff_point?.name}
                    </span>
                  </div>
                )}
                {notification.message && (
                  <div className="flex items-start gap-2 border-t border-gray-200 pt-2 mt-2">
                    <span className="text-[12px] font-medium text-gray-500 min-w-[60px] mt-0.5">Lời nhắn:</span>
                    <span className="text-[13px] text-gray-700 italic">"{notification.message}"</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRespond(notification.request_id, 'rejected')}
                  disabled={processingId === notification.request_id}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-[10px] font-semibold text-[14px] transition-colors flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Từ chối
                </button>
                <button
                  onClick={() => handleRespond(notification.request_id, 'accepted')}
                  disabled={processingId === notification.request_id}
                  className="flex-1 bg-[#008f55] hover:bg-[#007a48] text-white py-2 rounded-[10px] font-semibold text-[14px] transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  {processingId === notification.request_id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Chấp nhận
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
