import { useState } from 'react';
import { Phone, GraduationCap, Building2, Loader2, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [authMethod, setAuthMethod] = useState<'phone' | 'student' | 'company'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 10) {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.auth.login(phoneNumber);
        // Save user to local storage for persistence across tabs
        localStorage.setItem('cogo_user', JSON.stringify(response.user));
        onLoginSuccess(response.user);
      } catch (err: any) {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearData = async () => {
    if (confirm('Bạn có chắc muốn xoá toàn bộ dữ liệu người dùng trên server? (Cho mục đích test)')) {
      setIsClearing(true);
      try {
        await api.auth.clearData();
        localStorage.removeItem('cogo_user');
        alert('Đã xoá toàn bộ dữ liệu');
      } catch (e) {
        alert('Lỗi xoá dữ liệu');
      } finally {
        setIsClearing(false);
      }
    }
  };

  return (
    <div className="flex-1 bg-[#008f55] flex flex-col h-full relative">
      {/* Header */}
      <div className="pt-12 px-6 pb-8 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="font-bold text-xl">Co</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">CoGo</h1>
            <p className="text-white/80 text-sm font-medium">Share road - Share future</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[32px] m-4 p-6 shadow-xl relative z-10">
        <h2 className="text-[22px] font-bold text-gray-900 mb-2">Đăng nhập / Đăng ký</h2>
        <p className="text-[14px] text-gray-500 mb-6">
          Xác thực nhanh để bắt đầu ghép chuyến an toàn.
        </p>

        {/* Auth Method Toggle */}
        <div className="bg-gray-100 p-1 rounded-full flex gap-1 mb-6">
          <button
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-colors ${
              authMethod === 'phone' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Phone className="w-4 h-4" />
            SĐT
          </button>
          <button
            onClick={() => setAuthMethod('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-colors ${
              authMethod === 'student' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Sinh viên
          </button>
          <button
            onClick={() => setAuthMethod('company')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-colors ${
              authMethod === 'company' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Công ty
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0901 234 567"
              className="w-full bg-white border border-gray-200 rounded-full px-4 py-3 text-[15px] font-medium outline-none focus:border-[#008f55] focus:ring-1 focus:ring-[#008f55] transition-all"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={phoneNumber.trim().length < 10 || isLoading}
            className="w-full bg-[#008f55] hover:bg-[#007a48] disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-3.5 rounded-full text-[15px] transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            Gửi mã xác thực
          </button>
        </form>

        <p className="text-[12px] text-gray-500 text-center mt-6 leading-relaxed">
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản & Chính sách bảo mật của CoGo.
        </p>
      </div>

      <div className="px-10 z-10 relative">
         <button 
           onClick={handleClearData}
           disabled={isClearing}
           className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/20 text-white rounded-full font-medium hover:bg-red-500/30 transition-colors text-[14px]"
         >
           {isClearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
           Xóa toàn bộ Data (Test)
         </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 w-full text-center">
        <p className="text-white/80 text-[11px] font-medium">
          INNOSTAR 2026 - Bản demo giao diện sản phẩm
        </p>
      </div>
    </div>
  );
}
