import { useState, useEffect } from 'react';
import { api, Location } from '../../lib/api';
import { ThumbsUp, MessageSquare, MoreHorizontal, Zap, MapPin, Navigation, Car, Clock, Loader2 } from 'lucide-react';
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
    avatarUrl: string;
  };
  stats: {
    likes: number;
    comments: number;
  };
}

interface FeedProps {
  onStart?: () => void;
}

export default function Feed({ onStart }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Tracking join requests locally for demo
  const [joinStatus, setJoinStatus] = useState<Record<number, 'pending' | 'joined' | 'accepted'>>({});
  
  // Modal state
  const [joiningPost, setJoiningPost] = useState<Post | null>(null);

  // Menu state
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // View Route state
  const [viewingRouteForPost, setViewingRouteForPost] = useState<Post | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.post-menu-container')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeletePost = async (postId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá bài viết này không?')) {
      try {
        await api.posts.delete(postId);
        setPosts(posts.filter(p => p.id !== postId));
      } catch (error) {
        console.error("Failed to delete post", error);
        alert('Đã có lỗi xảy ra khi xoá bài viết.');
      }
    }
  };

  useEffect(() => {
    const fetchPostsAndRequests = async (user: any) => {
      try {
        const data = await api.posts.getAll();
        setPosts(data);
        
        if (user) {
          const userId = user.id || user.id_user;
          if (userId) {
            const requests = await api.posts.getUserRequests(userId);
            const statusMap: Record<number, 'pending' | 'joined'> = {};
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

  const handleJoinSuccess = (postId: number) => {
    setJoinStatus(prev => ({ ...prev, [postId]: 'pending' }));
    setJoiningPost(null);
  };

  return (
    <div className="flex flex-col pb-[80px] relative">
      {/* Route Map Modal */}
      {viewingRouteForPost && viewingRouteForPost.pickupLocation && viewingRouteForPost.dropoffLocation && (
        <div className="fixed inset-0 z-[60] bg-white">
          <RouteMap
            pickupLocation={viewingRouteForPost.pickupLocation}
            dropoffLocation={viewingRouteForPost.dropoffLocation}
            onBack={() => setViewingRouteForPost(null)}
            mode="view"
          />
        </div>
      )}

      {/* Join Request Modal */}
      {joiningPost && (
        <JoinRequestModal
          post={joiningPost}
          currentUser={currentUser}
          onClose={() => setJoiningPost(null)}
          onSuccess={handleJoinSuccess}
        />
      )}

      {/* Quick matching banner */}
      <div className="bg-white p-4 flex items-center gap-3 border-b border-gray-100">
        <div className="flex-1">
          <div className="text-[17px] font-bold text-[#1a2b4b] leading-tight mb-0.5">Ghép nhanh đi ngay</div>
          <div className="text-[13px] text-gray-500 leading-tight pr-2">Tìm chuyến đi phù hợp nhất với bạn</div>
        </div>
        <button 
          onClick={onStart}
          className="shrink-0 bg-[#006b3f] hover:bg-[#005a35] text-white px-4 py-2.5 rounded-[12px] font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Zap className="w-[18px] h-[18px] fill-current" />
          <span className="text-[15px]">Bắt đầu</span>
        </button>
      </div>

      <div className="h-2 bg-gray-100 w-full"></div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#006b3f] mb-2" />
          Đang tải bảng tin...
        </div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">Chưa có bài đăng nào.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white pt-3 pb-3 border-b border-gray-100">
            {/* Header */}
            <div className="px-4 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <img src={post.user.avatarUrl || 'https://i.pravatar.cc/150'} alt={post.user.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-[15px] text-gray-900 leading-tight">{post.user.name}</div>
                  <div className="text-[12px] text-gray-500 flex items-center gap-1">
                    {formatTimeAgo(post.createdAt)} 
                    <span>•</span>
                    <span className="w-3 h-3 flex items-center justify-center">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm4.167 4.167c.72 0 1.306.586 1.306 1.306 0 .092-.01.18-.027.267-.272 1.408-1.55 2.516-3.134 2.59H7.667c-1.343 0-2.45-1.042-2.583-2.36-.02-.132-.03-.266-.03-.404 0-.72.586-1.306 1.306-1.306h5.973ZM3.02 11.455c.34-.91.956-1.688 1.762-2.227 1.018-.68 2.215-.815 3.32-.472.932.29 1.748.883 2.348 1.696.53.722.865 1.576.96 2.474a6.666 6.666 0 0 1-8.39-1.47Z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative post-menu-container">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === post.id ? null : post.id);
                  }} 
                  className="text-gray-500 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {activeMenuId === post.id && currentUser && String(currentUser.id_user || currentUser.id) === String(post.user.id) && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-[14px] text-red-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Xoá bài viết
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-4 text-[15px] text-gray-800 leading-normal mb-3">
              {post.content}
            </div>

            {/* Route Info Card */}
            <div 
              className={`mx-4 bg-[#f4f7fb] rounded-[12px] overflow-hidden mb-3 ${post.pickupLocation && post.dropoffLocation ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}`}
              onClick={() => {
                if (post.pickupLocation && post.dropoffLocation) {
                  setViewingRouteForPost(post);
                }
              }}
            >
              {post.mediaUrl && (
                <div className="w-full h-[140px] relative">
                   <img src={post.mediaUrl} alt="Map" className="w-full h-full object-cover" />
                   {post.rideFrequency === 'DAILY' && (
                     <div className="absolute bottom-2 left-2 bg-[#008f55] text-white text-[11px] font-bold px-2 py-1 rounded-[4px]">
                       HÀNG NGÀY
                     </div>
                   )}
                </div>
              )}
              
              <div className="p-3">
                <div className="relative">
                  <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[2px] bg-gray-300"></div>
                  
                  <div className="flex gap-3 mb-2 relative">
                    <div className="w-[16px] h-[16px] rounded-full border-2 border-[#008f55] bg-white flex-shrink-0 mt-0.5 z-10"></div>
                    <div>
                      <div className="text-[12px] font-semibold text-gray-500">ĐIỂM ĐI</div>
                      <div className="text-[14px] text-gray-900">{post.departurePoint}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 relative">
                    <div className="w-[16px] h-[16px] rounded-full bg-[#008f55] flex-shrink-0 mt-0.5 z-10"></div>
                    <div>
                      <div className="text-[12px] font-semibold text-gray-500">ĐIỂM ĐẾN</div>
                      <div className="text-[14px] text-gray-900">{post.destinationPoint}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats (Likes/Comments count) */}
            {(post.stats.likes > 0 || post.stats.comments > 0) && (
              <div className="px-4 py-2 text-[13px] text-gray-500 flex justify-between border-b border-gray-100 mx-4">
                <div className="flex items-center gap-1">
                  {post.stats.likes > 0 && <span>👍 {post.stats.likes} Thích</span>}
                </div>
                <div className="flex items-center gap-3">
                  {post.stats.comments > 0 && <span>{post.stats.comments} Bình luận</span>}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="px-4 py-2 mt-1 flex items-center justify-between">
              <div className="flex gap-4">
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="w-[20px] h-[20px] stroke-[1.5]" />
                  <span className="text-[14px] font-medium">Thích</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700">
                  <MessageSquare className="w-[20px] h-[20px] stroke-[1.5]" />
                  <span className="text-[14px] font-medium">Bình luận</span>
                </button>
              </div>
              
              {joinStatus[post.id] === 'pending' ? (
                <button 
                  disabled
                  className="bg-gray-200 text-gray-600 text-[14px] font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Clock className="w-4 h-4" />
                  Đang chờ duyệt
                </button>
              ) : joinStatus[post.id] === 'accepted' || joinStatus[post.id] === 'joined' ? (
                <button 
                  disabled
                  className="bg-green-100 text-green-700 text-[14px] font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  Đã tham gia
                </button>
              ) : (
                <button 
                  onClick={() => setJoiningPost(post)}
                  className="bg-[#006b3f] hover:bg-[#005a35] text-white text-[14px] font-semibold px-4 py-1.5 rounded-lg transition-colors"
                >
                  Tham gia
                </button>
              )}
            </div>
            
            <div className="h-2 bg-gray-100 w-full mt-3"></div>
          </div>
        ))
      )}
    </div>
  );
}
