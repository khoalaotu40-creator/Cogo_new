import { useState, useEffect } from 'react';
import { api, Location } from '../../lib/api';
import { Search, Share2, Plus, Loader2 } from 'lucide-react';
import JoinRequestModal from './JoinRequestModal';
import RouteMap from './RouteMap';
import PostBackgroundMap from './PostBackgroundMap';

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
  
  const [joinStatus, setJoinStatus] = useState<Record<number, 'pending' | 'joined' | 'accepted'>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({});
  const [joiningPost, setJoiningPost] = useState<Post | null>(null);
  const [viewingRouteForPost, setViewingRouteForPost] = useState<Post | null>(null);
  
  const [feedType, setFeedType] = useState<'tham_gia' | 'bat_xe'>('bat_xe');

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
    
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${Math.floor(diffHours / 24)} ngày trước`;
  };

  const handleJoinSuccess = (postId: number) => {
    setJoinStatus(prev => ({ ...prev, [postId]: 'pending' }));
    setJoiningPost(null);
  };

  return (
    <div className="flex-1 w-full h-full relative bg-[#121212] text-white">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-12 pb-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex-1 flex justify-center items-center gap-6 pr-6">
          <button 
            onClick={() => setFeedType('tham_gia')}
            className={`text-[16px] font-semibold transition-all ${feedType === 'tham_gia' ? 'text-white border-b-2 border-white pb-1' : 'text-white/60'}`}
          >
            Tham gia cùng
          </button>
          <button 
            onClick={() => setFeedType('bat_xe')}
            className={`text-[16px] font-semibold transition-all ${feedType === 'bat_xe' ? 'text-white border-b-2 border-white pb-1' : 'text-white/60'}`}
          >
            Bắt xe chung
          </button>
        </div>
        <button className="absolute right-5 text-white/90">
          <Search className="w-[26px] h-[26px]" strokeWidth={2.5} />
        </button>
      </div>

      {viewingRouteForPost && viewingRouteForPost.pickupLocation && viewingRouteForPost.dropoffLocation && (
        <div className="fixed inset-0 z-[60] bg-white text-black">
          <RouteMap
            pickupLocation={viewingRouteForPost.pickupLocation}
            dropoffLocation={viewingRouteForPost.dropoffLocation}
            onBack={() => setViewingRouteForPost(null)}
            mode="view"
          />
        </div>
      )}

      {joiningPost && (
        <JoinRequestModal
          post={joiningPost}
          currentUser={currentUser}
          onClose={() => setJoiningPost(null)}
          onSuccess={handleJoinSuccess}
        />
      )}

      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2ee6c2] mb-4" />
          <span className="text-white/70">Đang tải...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">Chưa có bài đăng nào.</div>
      ) : (
        <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {posts.map((post) => (
            <div key={post.id} className="w-full h-full snap-start relative bg-gradient-to-b from-[#2a2a2a] to-[#121212]">
              {post.mediaUrl ? (
                <div className="absolute inset-0 opacity-30">
                  <img src={post.mediaUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              ) : (post.pickupLocation && post.dropoffLocation) ? (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
                  <PostBackgroundMap 
                    pickupLocation={post.pickupLocation} 
                    dropoffLocation={post.dropoffLocation} 
                    isJoined={String(currentUser?.id) === String(post.user?.id) || joinStatus[post.id] === 'accepted' || joinStatus[post.id] === 'joined'} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/50 to-[#121212] z-10" />
                </div>
              ) : null}
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 flex items-end justify-between z-10">
                {/* Left Side: Info */}
                <div className="flex-1 pr-16 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-[16px] text-white shadow-sm">{post.user.name}</span>
                    <span className="text-[13px] text-white/70">• {formatTimeAgo(post.createdAt)}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className={`text-[14.5px] leading-[1.4] text-white/90 transition-all duration-300 ${expandedPosts[post.id] ? '' : 'line-clamp-2'}`}>
                      {post.content}
                    </div>
                    {post.content && post.content.length > 80 && (
                      <button 
                        onClick={() => setExpandedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="text-white/60 text-[13px] font-medium mt-1 hover:text-white transition-colors"
                      >
                        {expandedPosts[post.id] ? 'Thu gọn' : 'Xem thêm'}
                      </button>
                    )}
                  </div>

                  
                  
                      
                      
                  </div>
                {/* Right Side: Actions */}
                <div className="flex flex-col items-center gap-6 pb-2 shrink-0">
                  <div className="relative">
                    <div className="w-[50px] h-[50px] rounded-full border-[1.5px] border-white p-[2px]">
                      <img src={post.user.avatarUrl || 'https://i.pravatar.cc/150'} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#2ee6c2] rounded-full flex items-center justify-center border-2 border-[#121212]">
                      <Plus className="w-4 h-4 text-black stroke-[3]" />
                    </button>
                  </div>

                  <button className="flex flex-col items-center gap-1 mt-2">
                    <Share2 className="w-[30px] h-[30px] text-white" strokeWidth={1.5} />
                    <span className="text-[12px] font-medium text-white/90">Chia sẻ</span>
                  </button>

                  <div className="mt-2">
                    {joinStatus[post.id] === 'pending' ? (
                      <button disabled className="bg-white/20 backdrop-blur-sm text-white text-[13px] font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                        Đang chờ
                      </button>
                    ) : joinStatus[post.id] === 'accepted' || joinStatus[post.id] === 'joined' ? (
                      <button disabled className="bg-green-500/20 text-green-400 text-[13px] font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                        Đã tham gia
                      </button>
                    ) : (
                      <button 
                        onClick={() => setJoiningPost(post)}
                        className="bg-[#2ee6c2] text-black text-[14px] font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-[0_0_15px_rgba(46,230,194,0.3)]"
                      >
                        {/* We use a custom SVG for lightning or use Zap */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="black" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                        Tham gia
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
