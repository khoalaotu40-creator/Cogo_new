import { LogOut, User, Settings as SettingsIcon, Shield, CircleHelp, ChevronRight, ArrowLeft } from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
  onBack: () => void;
}

export default function Settings({ onLogout, onBack }: SettingsProps) {
  const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');

  return (
    <div className="flex-1 bg-[#f8f9fa] flex flex-col h-full pb-[70px]">
      <div className="flex items-center px-4 py-4 sticky top-0 bg-[#f8f9fa] z-20">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex-1 text-center font-bold text-[20px] text-gray-900 mr-6">
          Cài đặt
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Người dùng</h2>
              <p className="text-sm text-gray-500">{user.phone || '0901 234 567'}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[20px] hover:border-[#008f55] hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900 text-[15px]">Cài đặt tài khoản</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[20px] hover:border-[#008f55] hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900 text-[15px]">Quyền riêng tư</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[20px] hover:border-[#008f55] hover:shadow-sm transition-all">
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
