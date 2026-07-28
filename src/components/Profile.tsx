import { LogOut, User, Settings, Shield, CircleHelp, ChevronRight } from 'lucide-react';

interface ProfileProps {
  onLogout: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
  const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');

  return (
    <div className="flex-1 bg-white flex flex-col h-full pb-[70px]">
      <div className="pt-12 px-6 pb-6 bg-white border-b border-gray-100">
        <h1 className="text-[22px] font-bold text-gray-900">Trang cá nhân</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Người dùng</h2>
              <p className="text-sm text-gray-500">{user.phone || '0901 234 567'}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-[20px] hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900 text-[15px]">Cài đặt tài khoản</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-[20px] hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900 text-[15px]">Quyền riêng tư</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-[20px] hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <CircleHelp className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900 text-[15px]">Trợ giúp & Hỗ trợ</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full mt-10 flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-[20px] font-semibold hover:bg-red-100 transition-colors text-[15px]"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
