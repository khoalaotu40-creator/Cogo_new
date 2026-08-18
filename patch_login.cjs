const fs = require('fs');
const content = `import React, { useState } from 'react';
import { Phone, User, FileText, Loader2, ArrowRight } from 'lucide-react';
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
    <div className="flex-1 bg-[#121415] flex flex-col h-full relative overflow-hidden font-sans">
      {/* Background Gradient Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2ee6c2]/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="flex-1 flex flex-col px-8 pt-16 pb-8 relative z-10">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          {authMode === 'login' ? (
            <>
              <h1 className="text-[28px] font-bold text-white mb-2 tracking-tight">Chào mừng trở lại</h1>
              <p className="text-[#a0a5ab] text-[15px]">Đăng nhập để tiếp tục trải nghiệm</p>
            </>
          ) : (
            <>
              <h1 className="text-[42px] font-extrabold text-[#2ee6c2] tracking-tight mb-2">Cogo</h1>
              <h2 className="text-[24px] font-bold text-white mb-2">Tham gia Cogo</h2>
              <p className="text-[#a0a5ab] text-[15px]">Khám phá thế giới qua những chuyến đi</p>
            </>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          
          {authMode === 'register' && (
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50">
                <User className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Họ và tên"
                className="w-full bg-[#1c1c1c] border border-transparent rounded-[16px] pl-12 pr-4 py-4 text-[15px] font-medium text-white placeholder-white/50 outline-none focus:border-white/10 transition-all"
              />
            </div>
          )}

          <div className="relative">
            {authMode === 'register' && (
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50">
                <Phone className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </div>
            )}
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Điện thoại"
              className={\`w-full bg-[#1c1c1c] border border-transparent rounded-[16px] \${authMode === 'register' ? 'pl-12' : 'px-5'} py-4 text-[15px] font-medium text-white placeholder-white/50 outline-none focus:border-white/10 transition-all\`}
            />
          </div>

          {authMode === 'register' && (
            <div className="relative">
              <div className="absolute left-5 top-4 text-white/50">
                <FileText className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </div>
              <textarea
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                placeholder="Giới thiệu bản thân (không bắt buộc)"
                rows={1}
                className="w-full bg-[#1c1c1c] border border-transparent rounded-[16px] pl-12 pr-4 py-4 text-[15px] font-medium text-white placeholder-white/50 outline-none focus:border-white/10 transition-all resize-none min-h-[56px]"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-[13px] text-center mt-1 font-medium">{error}</p>}

          {authMode === 'login' ? (
            <div className="mt-4 mb-8">
              <button
                type="submit"
                disabled={phoneNumber.trim().length < 10 || isLoading}
                className="w-full bg-[#2ee6c2] hover:bg-[#20d0ad] disabled:opacity-50 text-black font-bold py-4 rounded-[16px] text-[15px] transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                Đăng nhập
              </button>
              
              <div className="flex items-center gap-4 my-8">
                <div className="h-[1px] flex-1 bg-white/10"></div>
                <div className="h-[1px] flex-1 bg-white/10"></div>
              </div>

              <div className="text-center text-[#a0a5ab] text-[15px]">
                Chưa có tài khoản?{' '}
                <button 
                  type="button" 
                  onClick={() => { setAuthMode('register'); setError(''); }} 
                  className="text-[#2ee6c2] font-medium hover:underline"
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <button
                type="submit"
                disabled={phoneNumber.trim().length < 10 || name.trim().length === 0 || isLoading}
                className="w-full bg-[#2ee6c2] hover:bg-[#20d0ad] disabled:opacity-50 text-black font-bold py-4 rounded-[30px] text-[15px] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(46,230,194,0.15)]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Đăng ký <ArrowRight className="w-5 h-5 ml-1" strokeWidth={3} />
              </button>
              
              <div className="text-center mt-8">
                <button 
                  type="button" 
                  onClick={() => { setAuthMode('login'); setError(''); }} 
                  className="text-[#a0a5ab] text-[15px] hover:text-white transition-colors"
                >
                  Đăng nhập nếu đã có tài khoản
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
`
fs.writeFileSync('src/components/auth/Login.tsx', content);
