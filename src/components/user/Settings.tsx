import { useState } from 'react';
import { LogOut, User, Settings as SettingsIcon, Shield, CircleHelp, ChevronRight, ArrowLeft, Search, Car, Contact, UserCog, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
  onBack: () => void;
  onNavigateToProfile: () => void;
  onRegisterDriver: () => void;
  onSwitchToDriverMode?: () => void;
}

export default function Settings({ onLogout, onBack, onNavigateToProfile, onRegisterDriver, onSwitchToDriverMode }: SettingsProps) {
  const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleRegisterDriver = () => {
    if (user.driver_id) {
      showToast("Tài khoản đã đăng ký lái xe", 'success');
    } else {
      onRegisterDriver();
    }
  };

  const handleSwitchToDriverMode = () => {
    if (user.driver_id) {
      if(onSwitchToDriverMode) onSwitchToDriverMode();
      showToast("Đã chuyển sang chế độ lái xe", 'success');
    } else {
      showToast("Chưa đăng ký lái xe. Vui lòng đăng ký trước.", 'error');
    }
  };

  return (
    <div className="flex-1 bg-[#f8f9fa] flex flex-col h-full pb-[70px] relative">
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-[16px] shadow-lg border ${toast.type === 'success' ? 'bg-[#e6f4ed] border-[#bfe6d3] text-[#006b3f]' : 'bg-[#fef2f2] border-[#fecaca] text-[#dc2626]'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium text-[14px]">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="flex items-center px-4 py-4 sticky top-0 bg-[#f8f9fa] z-20 justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-1 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#006b3f]" />
          </button>
          <div className="font-bold text-[20px] text-[#006b3f]">
            Cài đặt & quyền riêng tư
          </div>
        </div>
        <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
          <Search className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4 space-y-6">
          
          {/* Profile Card */}
          <button 
            onClick={onNavigateToProfile}
            className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[16px] shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="text-left">
                <h2 className="text-[17px] font-bold text-[#1a2b4b]">{user.name || 'Người dùng'}</h2>
                <p className="text-[14px] text-gray-500 mt-0.5">Xem trang cá nhân của bạn</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Features for Driver */}
          <div>
            <h3 className="text-[13px] font-bold text-gray-500 mb-3 ml-2 tracking-wide uppercase">
              Tính năng dành cho tài xế
            </h3>
            <div className="bg-white border border-gray-100 rounded-[16px] shadow-sm overflow-hidden">
              <button 
                onClick={handleSwitchToDriverMode}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e6f4ed] flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-[#006b3f]" />
                  </div>
                  <span className="font-semibold text-gray-900 text-[15px]">Chuyển sang chế độ lái xe</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button 
                onClick={handleRegisterDriver}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e6f4ed] flex items-center justify-center shrink-0">
                    <Contact className="w-5 h-5 text-[#006b3f]" />
                  </div>
                  <span className="font-semibold text-gray-900 text-[15px]">Đăng ký lái xe</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* App & Support */}
          <div>
            <h3 className="text-[13px] font-bold text-gray-500 mb-3 ml-2 tracking-wide uppercase">
              Ứng dụng & Hỗ trợ
            </h3>
            <div className="bg-white border border-gray-100 rounded-[16px] shadow-sm overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e6f4ed] flex items-center justify-center shrink-0">
                    <UserCog className="w-5 h-5 text-[#006b3f]" />
                  </div>
                  <span className="font-semibold text-gray-900 text-[15px]">Cài đặt tài khoản</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e6f4ed] flex items-center justify-center shrink-0">
                    <CircleHelp className="w-5 h-5 text-[#006b3f]" />
                  </div>
                  <span className="font-semibold text-gray-900 text-[15px]">Trợ giúp & Hỗ trợ</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-2">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 p-4 bg-[#f4f6fc] text-[#4a5568] rounded-[16px] font-semibold hover:bg-[#eef1f8] transition-colors text-[15px]"
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>

          {/* Footer Version */}
          <div className="text-center pb-4">
            <p className="text-[13px] text-gray-500">
              Cogo v2.4.1 (Emerald Precision Build)
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
