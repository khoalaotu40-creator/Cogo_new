import React, { useState } from 'react';
import { Phone, User, FileText, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
    <div className="flex-1 bg-[#ffffff] flex flex-col h-full relative overflow-y-auto font-sans text-[#141b2c] select-none">
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-[#e6f2ec]/60 to-transparent pointer-events-none" />

      <div className="flex-1 flex flex-col justify-between px-6 pt-12 pb-8 relative z-10">
        
        {/* Top Header & Brand */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-[12px] bg-[#006b47] flex items-center justify-center text-white font-bold text-[18px] shadow-sm">
                C
              </div>
              <span className="font-extrabold text-[22px] tracking-tight text-[#006b47]">
                Cogo
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#e6f2ec] text-[#006b47] px-2.5 py-1 rounded-full text-[11.5px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Đi chung an toàn</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6">
            <h1 className="text-[26px] font-bold text-[#141b2c] tracking-tight mb-1.5">
              {authMode === 'login' ? 'Chào mừng bạn!' : 'Tạo tài khoản mới'}
            </h1>
            <p className="text-[#6f7a76] text-[14px]">
              {authMode === 'login' 
                ? 'Đăng nhập bằng số điện thoại để tiếp tục' 
                : 'Kết nối và chia sẻ chuyến đi cùng sinh viên'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="bg-[#f0f2f1] p-1 rounded-[16px] flex items-center mb-6">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(''); }}
              className={`flex-1 py-2.5 text-[13.5px] font-bold rounded-[13px] transition-all ${
                authMode === 'login'
                  ? 'bg-white text-[#006b47] shadow-xs'
                  : 'text-[#6f7a76] hover:text-[#141b2c]'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(''); }}
              className={`flex-1 py-2.5 text-[13.5px] font-bold rounded-[13px] transition-all ${
                authMode === 'register'
                  ? 'bg-white text-[#006b47] shadow-xs'
                  : 'text-[#6f7a76] hover:text-[#141b2c]'
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-3.5">
            
            {authMode === 'register' && (
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-[#5c6763] pl-1">Họ và tên</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8a9490] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#f9f9ff] border border-[#eceeed] rounded-[16px] pl-11 pr-4 py-3.5 text-[14.5px] font-medium text-[#141b2c] placeholder:text-[#8a9490] outline-none focus:border-[#006b47] focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#5c6763] pl-1">Số điện thoại</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8a9490] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full bg-[#f9f9ff] border border-[#eceeed] rounded-[16px] pl-11 pr-4 py-3.5 text-[14.5px] font-medium text-[#141b2c] placeholder:text-[#8a9490] outline-none focus:border-[#006b47] focus:bg-white transition-all"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-[#5c6763] pl-1">Trường học / Giới thiệu</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#8a9490] absolute left-4 top-4" />
                  <textarea
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    placeholder="VD: Sinh viên ĐH Quốc Tế - ĐHQG..."
                    rows={2}
                    className="w-full bg-[#f9f9ff] border border-[#eceeed] rounded-[16px] pl-11 pr-4 py-3 text-[14px] font-medium text-[#141b2c] placeholder:text-[#8a9490] outline-none focus:border-[#006b47] focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-[12px] bg-red-50 border border-red-200 text-red-600 text-[12.5px] font-medium text-center">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={phoneNumber.trim().length < 10 || (authMode === 'register' && !name.trim()) || isLoading}
                className="w-full bg-[#006b47] hover:bg-[#00875a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-[16px] text-[15px] shadow-[0_4px_16px_rgba(0,107,71,0.25)] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : authMode === 'login' ? (
                  <>
                    <span>Đăng nhập</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Đăng ký tài khoản</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[12px] text-[#8a9490]">
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <span className="text-[#006b47] font-semibold underline cursor-pointer">Điều khoản dịch vụ</span>{' '}
            của Cogo.
          </p>
        </div>

      </div>
    </div>
  );
}
