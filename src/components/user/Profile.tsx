import React, { useState, useRef } from 'react';
import { Camera, Plus, Pencil, Briefcase, GraduationCap, Home, MapPin, Heart, MoreHorizontal, X, Loader2, Waypoints } from 'lucide-react';
import { api } from '../../../lib/api';

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('cogo_user') || '{}'));
  
  const [coverPhoto, setCoverPhoto] = useState(user.background_url || localStorage.getItem('cogo_cover_photo') || "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800");
  const [avatar, setAvatar] = useState(user.avatar_url || "https://i.pravatar.cc/150?img=11");
  
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [departurePoint, setDeparturePoint] = useState('');
  const [destinationPoint, setDestinationPoint] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsSubmitting(true);
    try {
      await api.posts.create({
        user_id: user.id_user,
        content: postContent,
        departure_point: departurePoint,
        destination_point: destinationPoint,
        privacy: privacy
      });
      setIsCreatingPost(false);
      setPostContent('');
      setDeparturePoint('');
      setDestinationPoint('');
      setPrivacy('public');
      alert('Đã tạo bài viết thành công!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Lỗi tạo bài viết. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'avatar') => {
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

  return (
    <div className="flex-1 overflow-y-auto bg-white h-full pb-[80px] no-scrollbar">
      {/* Banner */}
      <label htmlFor="cover-upload" className="relative h-48 bg-gray-200 block cursor-pointer">
        <img 
          src={coverPhoto} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-white p-2.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center z-10">
          <Camera className="w-5 h-5 text-gray-700" />
          <input 
            id="cover-upload"
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => handleFileChange(e, 'cover')} 
          />
        </div>
      </label>

      {/* Profile Info */}
      <div className="px-4 relative">
        <label 
          htmlFor="avatar-upload"
          className="w-[110px] h-[110px] rounded-full border-4 border-white bg-white -mt-[55px] relative z-10 shadow-sm cursor-pointer block"
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            <img 
              src={avatar} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-gray-100 p-1.5 rounded-full border-2 border-white shadow-sm hover:bg-gray-200 transition-colors z-20 flex items-center justify-center">
            <Camera className="w-4 h-4 text-gray-700" />
            <input 
              id="avatar-upload"
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleFileChange(e, 'avatar')} 
            />
          </div>
        </label>
        
        <div className="mt-3">
          <h1 className="text-[24px] font-bold text-gray-900">{user.name || "Người dùng"}</h1>
          <p className="text-[15px] text-gray-700 mt-1.5 leading-relaxed">
            {user.intro_text || "Đam mê xê dịch, thích kết nối và chia sẻ những chuyến đi xanh. 🌿"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => setIsCreatingPost(true)}
            className="flex-1 bg-[#008f55] text-white flex items-center justify-center gap-1.5 py-2 rounded-[8px] font-semibold text-[15px] hover:bg-[#007a48] transition-colors"
          >
            <Plus className="w-[20px] h-[20px]" /> Tạo bài viết
          </button>
          <button className="flex-1 bg-[#e4e6eb] text-gray-900 flex items-center justify-center gap-1.5 py-2 rounded-[8px] font-semibold text-[15px] hover:bg-[#d8dadf] transition-colors">
            <Pencil className="w-[16px] h-[16px]" /> Chỉnh sửa trang
          </button>
        </div>
      </div>

      <div className="h-2 bg-[#f0f2f5] w-full mt-5"></div>

      {/* Details Section */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#f4f6fc] rounded-[16px] p-5 flex flex-col items-center justify-center border border-transparent shadow-sm">
            <Waypoints className="w-8 h-8 text-[#006b3f] mb-3 stroke-[2]" />
            <span className="text-[32px] font-bold text-[#1a2b4b] leading-tight mb-1">120</span>
            <span className="text-[13px] font-bold text-gray-500 tracking-wide">SỐ CHUYẾN ĐI</span>
          </div>
          <div className="bg-[#f4f6fc] rounded-[16px] p-5 flex flex-col items-center justify-center border border-transparent shadow-sm">
            <MapPin className="w-8 h-8 text-[#006b3f] mb-3 stroke-[2]" />
            <span className="text-[32px] font-bold text-[#1a2b4b] leading-tight mb-1">2,450</span>
            <span className="text-[13px] font-bold text-gray-500 tracking-wide">TỔNG SỐ KM</span>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {isCreatingPost && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h3 className="font-bold text-[18px]">Tạo bài viết</h3>
              <button 
                onClick={() => setIsCreatingPost(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePost} className="p-4 flex flex-col gap-4">
              <div className="flex gap-3">
                <img 
                  src={avatar} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[15px]">{user.name || "Người dùng"}</h4>
                  <select 
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="mt-1 text-[13px] bg-gray-100 px-2 py-1 rounded-[6px] font-medium outline-none"
                  >
                    <option value="public">Công khai</option>
                    <option value="friends">Bạn bè</option>
                    <option value="only_me">Chỉ mình tôi</option>
                  </select>
                </div>
              </div>

              <textarea 
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Bạn đang nghĩ gì?"
                className="w-full text-[16px] outline-none resize-none min-h-[100px]"
                autoFocus
              />

              <div className="flex flex-col gap-2">
                <input 
                  type="text"
                  value={departurePoint}
                  onChange={(e) => setDeparturePoint(e.target.value)}
                  placeholder="Điểm đi (Tùy chọn)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#008f55]"
                />
                <input 
                  type="text"
                  value={destinationPoint}
                  onChange={(e) => setDestinationPoint(e.target.value)}
                  placeholder="Điểm đến (Tùy chọn)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#008f55]"
                />
              </div>

              <button
                type="submit"
                disabled={!postContent.trim() || isSubmitting}
                className="w-full bg-[#008f55] hover:bg-[#007a48] disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-3 rounded-[8px] text-[15px] transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                Đăng bài
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
