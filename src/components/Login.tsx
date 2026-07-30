import React, { useState } from 'react';
import { Phone, GraduationCap, Building2, Loader2, Trash2, LogIn, UserPlus } from 'lucide-react';
import { api } from '../../lib/api';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [introText, setIntroText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 10) {
      setIsLoading(true);
      setError('');
      try {
        let user;
        if (authMode === 'login') {
          const response = await api.auth.login(phoneNumber);
          user = response.user;
        } else {
          if (!name.trim()) {
            setError('Vui lòng nhập họ và tên');
            setIsLoading(false);
            return;
          }
          const response = await api.auth.register(phoneNumber, name, introText);
          user = response.user;
        }
        
        // Save user to local storage for persistence across tabs
        localStorage.setItem('cogo_user', JSON.stringify(user));
        onLoginSuccess(user);
      } catch (err: any) {
        setError(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
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
        <h2 className="text-[22px] font-bold text-gray-900 mb-2">
          {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        </h2>
        <p className="text-[14px] text-gray-500 mb-6">
          {authMode === 'login' ? 'Đăng nhập để ghép chuyến an toàn.' : 'Tạo tài khoản mới để bắt đầu.'}
        </p>

        {/* Auth Method Toggle */}
        <div className="bg-gray-100 p-1 rounded-full flex gap-1 mb-6">
          <button
            onClick={() => setAuthMode('login')}
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-colors ${
              authMode === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Đăng nhập
          </button>
          <button
            onClick={() => setAuthMode('register')}
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-colors ${
              authMode === 'register' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Đăng ký
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
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
          </div>

          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-white border border-gray-200 rounded-full px-4 py-3 text-[15px] font-medium outline-none focus:border-[#008f55] focus:ring-1 focus:ring-[#008f55] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Giới thiệu bản thân (Không bắt buộc)
                </label>
                <textarea
                  value={introText}
                  onChange={(e) => setIntroText(e.target.value)}
                  placeholder="Một vài điều về bạn..."
                  rows={2}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-[15px] font-medium outline-none focus:border-[#008f55] focus:ring-1 focus:ring-[#008f55] transition-all resize-none"
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={phoneNumber.trim().length < 10 || (authMode === 'register' && name.trim().length === 0) || isLoading}
            className="w-full bg-[#008f55] hover:bg-[#007a48] disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-3.5 rounded-full text-[15px] transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-[12px] text-gray-500 text-center mt-6 leading-relaxed">
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản & Chính sách bảo mật của CoGo.
        </p>
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
