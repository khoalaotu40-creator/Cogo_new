const fs = require('fs');
const content = `import React, { useState, useEffect } from 'react';
import { Camera, Car, Plus, Pencil, Briefcase, GraduationCap, Home, MapPin, Heart, MoreHorizontal, X, Loader2, Waypoints, Bell, List, Settings as SettingsIcon, ShieldCheck, Lock, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';

export default function Profile() {
  const [user, setUser] = useState<any>({});
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [departurePoint, setDeparturePoint] = useState('');
  const [destinationPoint, setDestinationPoint] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(true);
  
  const [avatar, setAvatar] = useState<string>('https://i.pravatar.cc/150?img=11');
  const [coverPhoto, setCoverPhoto] = useState<string>('https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80');

  const [activeTab, setActiveTab] = useState<'posts' | 'photos'>('posts');
  const [userPosts, setUserPosts] = useState<any[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem('cogo_user');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      if (parsedUser.avatar_url) setAvatar(parsedUser.avatar_url);
      if (parsedUser.background_url) setCoverPhoto(parsedUser.background_url);
      
      const fetchPosts = async () => {
        try {
          const allPosts = await api.posts.getAll();
          const myPosts = allPosts.filter((p: any) => p.user.id === (parsedUser.id || parsedUser.id_user));
          setUserPosts(myPosts);
        } catch (e) {
          console.error("Failed to fetch user posts", e);
        }
      };
      fetchPosts();
    }
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newPost = await api.posts.create({
        userId: user.id || user.id_user,
        content: postContent,
        departurePoint: departurePoint || 'Không xác định',
        destinationPoint: destinationPoint || 'Không xác định'
      });
      setUserPosts([newPost, ...userPosts]);
      setIsCreatingPost(false);
      setPostContent('');
      setDeparturePoint('');
      setDestinationPoint('');
    } catch (error) {
      console.error("Failed to create post", error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        try {
          if (type === 'cover') {
            setCoverPhoto(result);
            localStorage.setItem('cogo_cover_photo', result);
            if (user.id_user) {
              await api.users.update(user.id_user, { background_url: result });
              const updatedUser = { ...user, background_url: result };
              setUser(updatedUser);
              localStorage.setItem('cogo_user', JSON.stringify(updatedUser));
            }
          } else {
            setAvatar(result);
            if (user.id_user) {
              await api.users.update(user.id_user, { avatar_url: result });
            }
            const updatedUser = { ...user, avatar_url: result };
            setUser(updatedUser);
            localStorage.setItem('cogo_user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error("Failed to update user profile image", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return \`\${diffMins} phút trước\`;
    if (diffHours < 24) return \`\${diffHours} giờ trước\`;
    return \`\${Math.floor(diffHours / 24)} ngày trước\`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#121415] h-full pb-[80px] no-scrollbar relative font-sans">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#2ee6c2]/15 to-transparent pointer-events-none"></div>

      {/* Top Header Icons for Profile */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <button 
          onClick={() => {
            const storedUser = JSON.parse(localStorage.getItem('cogo_user') || '{}');
            if (storedUser.driver_id) {
              window.dispatchEvent(new CustomEvent('navigate', { detail: 'driver-home' }));
            } else {
              alert('Bạn cần đăng ký làm tài xế trước (trong mục Cài đặt)');
            }
          }} 
          className="bg-black/30 p-2 rounded-full text-white hover:bg-black/40 transition-colors relative"
        >
          <Car className="w-5 h-5" />
        </button>
        <button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'rides' }))} className="bg-black/30 p-2 rounded-full text-white hover:bg-black/40 transition-colors">
          <List className="w-5 h-5" />
        </button>
        <button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'settings' }))} className="bg-black/30 p-2 rounded-full text-white hover:bg-black/40 transition-colors">
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center pt-20 px-4 relative z-10">
        
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-[100px] h-[100px] rounded-full p-[3px] bg-gradient-to-br from-gray-700 to-gray-900 shadow-xl">
            <img 
              src={avatar} 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover border-2 border-[#121415]"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#1a1c1e] p-1.5 rounded-full border-2 border-[#121415]">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <h1 className="text-[22px] font-bold text-white tracking-tight">{user.name || "Người dùng"}</h1>
            <CheckCircle2 className="w-5 h-5 text-[#3b82f6] fill-current" />
          </div>
          <p className="text-[13px] text-gray-400 font-medium">{user.intro_text || "Đại học Công Nghệ Thông Tin ĐHQG (UIT)"}</p>
        </div>

        {/* Private Mode Toggle Block */}
        <div className="w-full bg-[#1c1c1c] rounded-[24px] p-5 mb-6 border border-white/5">
          <div className="flex items-center justify-center gap-3 mb-3">
            <button 
              onClick={() => setIsPrivateMode(!isPrivateMode)}
              className={\`w-12 h-6 rounded-full relative transition-colors \${isPrivateMode ? 'bg-[#2ee6c2]' : 'bg-gray-600'}\`}
            >
              <div className={\`absolute top-1 w-4 h-4 rounded-full bg-white transition-all \${isPrivateMode ? 'left-7' : 'left-1'}\`}></div>
            </button>
            <span className="text-white font-bold text-[15px] flex items-center gap-2">
              Chế độ cá nhân <ShieldCheck className="w-4 h-4 text-[#2ee6c2]" />
            </span>
          </div>
          <p className="text-[12px] text-gray-400 text-center leading-relaxed px-4">
            Trang cá nhân của bạn đã ở chế độ private<br/>
            Only followers can see your content.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('posts')}
            className={\`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-colors \${activeTab === 'posts' ? 'bg-[#2a2a2a] text-white' : 'bg-transparent text-gray-500 hover:text-gray-300'}\`}
          >
            <FileText className="w-4 h-4" />
            Bài viết
            <Lock className="w-3 h-3 ml-1 opacity-50" />
          </button>
          <button 
            onClick={() => setActiveTab('photos')}
            className={\`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-colors \${activeTab === 'photos' ? 'bg-[#2a2a2a] text-white' : 'bg-transparent text-gray-500 hover:text-gray-300'}\`}
          >
            <ImageIcon className="w-4 h-4" />
            Ảnh
            <Lock className="w-3 h-3 ml-1 opacity-50" />
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full">
          {activeTab === 'photos' ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-30">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/50 text-sm">Chưa có hình ảnh nào</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {userPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 opacity-30">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/50 text-sm">Chưa có bài viết nào</p>
                </div>
              ) : (
                userPosts.map(post => (
                  <div key={post.id} className="bg-[#1c1c1c] rounded-[20px] p-4 border border-white/5 w-full text-left">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={avatar} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="text-white font-semibold text-[14.5px]">{user.name}</div>
                        <div className="text-gray-500 text-[12px]">{formatTimeAgo(post.createdAt)}</div>
                      </div>
                    </div>
                    <p className="text-white/90 text-[14.5px] leading-relaxed mb-3">{post.content}</p>
                    <div className="bg-[#2a2a2a] rounded-[12px] p-3 border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full border-2 border-[#2ee6c2]"></div>
                        <span className="text-gray-300 text-[13px]">{post.departurePoint}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#2ee6c2]"></div>
                        <span className="text-gray-300 text-[13px]">{post.destinationPoint}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
`
fs.writeFileSync('src/components/user/Profile.tsx', content);
