"use client"

import { useState, useEffect } from 'react';
import { Search, Users, Car, Wallet, Leaf, Building2, ChevronRight, Home as HomeIcon, MessageCircle, User } from 'lucide-react';
import Rides from './components/Rides';
import FindRideForm from './components/FindRideForm';
import Login from './components/Login';
import Profile from './components/Profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState('login');
  const [previousTab, setPreviousTab] = useState('login');

  useEffect(() => {
    const savedUser = localStorage.getItem('cogo_user');
    if (savedUser) {
      setActiveTab('home');
      setPreviousTab('home');
    }
  }, []);

  const navigateTo = (tab: string) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('cogo_user');
    navigateTo('login');
  };

  const renderHomeContent = () => (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          
          {/* Map Section Placeholder */}
          <div className="h-[280px] bg-[#f0f4eb] relative flex items-center justify-center overflow-hidden border-b border-gray-100">
             {/* Map texture/pattern */}
             <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '150px 150px'
             }}></div>
             
             {/* Map Text */}
             <div className="z-10 text-center flex flex-col items-center mt-6">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <h1 className="text-[22px] font-bold text-[#1a3852] tracking-wide uppercase">Thành</h1>
                  <div className="w-[10px] h-[10px] bg-[#008f55] rounded-full"></div>
                  <h1 className="text-[22px] font-bold text-[#1a3852] tracking-wide uppercase">Phố</h1>
                </div>
                <h1 className="text-[22px] font-bold text-[#1a3852] tracking-wide uppercase mt-[-4px]">Hồ Chí Minh</h1>
             </div>

             {/* Fake river graphic and labels */}
             <div className="absolute right-[-20px] bottom-14 w-[120px] h-20 bg-blue-100/60 rounded-l-[40px] blur-[2px] transform rotate-12"></div>
             <div className="absolute bottom-16 right-4 text-[10px] text-blue-700/60 italic font-medium">Sông Sài Gòn</div>
             <div className="absolute bottom-8 left-14 text-[10px] text-gray-500/80 -rotate-[35deg] font-medium tracking-wide">Đường Võ Văn Kiệt</div>
          </div>

          {/* Search Bar - Overlapping the map */}
          <div className="px-4 -mt-6 relative z-20">
            <div className="bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 p-3.5 flex items-center gap-3">
              <Search className="w-[22px] h-[22px] text-gray-500 ml-1 stroke-[2]" />
              <input 
                type="text" 
                placeholder="Bạn muốn đi đâu hôm nay?" 
                className="outline-none flex-1 text-gray-800 placeholder-gray-500 bg-transparent text-[15px] font-medium"
              />
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="px-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Find Ride */}
              <div 
                onClick={() => navigateTo('find-ride')}
                className="bg-[#e8f6ef] rounded-[24px] p-4 flex flex-col justify-between aspect-[1.25] cursor-pointer hover:bg-[#dff0e7] transition-colors relative overflow-hidden group">
                <div className="w-11 h-11 rounded-full bg-[#008f55] flex items-center justify-center text-white mb-2 shadow-sm">
                  <Users className="w-[22px] h-[22px]" />
                </div>
                <div className="z-10 relative">
                  <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-1">Tìm xe đi chung</h3>
                  <p className="text-[12px] text-gray-600 leading-tight">Tiết kiệm 30–40% chi phí</p>
                </div>
              </div>

              {/* Offer Ride */}
              <div className="bg-[#e9f2f8] rounded-[24px] p-4 flex flex-col justify-between aspect-[1.25] cursor-pointer hover:bg-[#dce9f2] transition-colors relative overflow-hidden group">
                <div className="w-11 h-11 rounded-full bg-[#0087d3] flex items-center justify-center text-white mb-2 shadow-sm">
                  <Car className="w-[22px] h-[22px]" />
                </div>
                <div className="z-10 relative">
                  <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-1">Cho đi chung xe</h3>
                  <p className="text-[12px] text-gray-600 leading-tight">Chia sẻ chi phí xăng xe</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="px-4 mt-5">
            <div className="grid grid-cols-3 gap-3">
              {/* Stat 1 */}
              <div className="bg-white border border-gray-200 rounded-[28px] py-4 px-1 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <Wallet className="w-[24px] h-[24px] text-[#008f55] mb-2 stroke-[1.5]" />
                <span className="font-bold text-gray-900 text-[15px] leading-none mb-1">0k</span>
                <span className="text-[11px] text-gray-500 whitespace-nowrap">Đã tiết kiệm</span>
              </div>
              
              {/* Stat 2 */}
              <div className="bg-white border border-gray-200 rounded-[28px] py-4 px-1 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <Leaf className="w-[24px] h-[24px] text-[#008f55] mb-2 stroke-[1.5]" />
                <span className="font-bold text-gray-900 text-[15px] leading-none mb-1">0.0kg</span>
                <span className="text-[11px] text-gray-500 whitespace-nowrap">CO₂ giảm</span>
              </div>

              {/* Stat 3 */}
              <div className="bg-white border border-gray-200 rounded-[28px] py-4 px-1 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <Users className="w-[24px] h-[24px] text-[#008f55] mb-2 stroke-[1.5]" />
                <span className="font-bold text-gray-900 text-[15px] leading-none mb-1">0</span>
                <span className="text-[11px] text-gray-500 whitespace-nowrap">Chuyến đi</span>
              </div>
            </div>
          </div>

          {/* Enterprise Banner */}
          <div className="px-4 mt-5">
            <div className="bg-[#009156] rounded-[24px] p-4 flex items-center gap-4 cursor-pointer hover:bg-[#00824d] transition-colors shadow-[0_6px_16px_rgba(0,145,86,0.25)]">
              <div className="text-white">
                <Building2 className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-[15.5px] leading-tight mb-1">CoGo Enterprise</h3>
                <p className="text-white/95 text-[12px] leading-snug font-medium pr-1">
                  Báo cáo ESG & tối ưu bãi đỗ xe cho doanh nghiệp
                </p>
              </div>
              <div className="text-white">
                <ChevronRight className="w-5 h-5 opacity-90 stroke-[2.5]" />
              </div>
            </div>
          </div>

        </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[850px] bg-white sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col sm:border-8 border-gray-900 mx-auto">
        
        {activeTab === 'login' && <Login onLoginSuccess={() => navigateTo('home')} />}
        {activeTab === 'home' && renderHomeContent()}
        {activeTab === 'rides' && <Rides onFindRide={() => navigateTo('find-ride')} />}
        {activeTab === 'find-ride' && <FindRideForm onBack={() => setActiveTab(previousTab)} onSuccess={() => navigateTo('rides')} />}
        {activeTab === 'profile' && <Profile onLogout={handleLogout} />}

        {/* Bottom Navigation */}
        {activeTab !== 'find-ride' && activeTab !== 'login' && (
          <div className="absolute bottom-0 w-full bg-white flex items-center justify-between px-2 pt-3 pb-6 sm:pb-4 border-t border-gray-100 z-50">
            <button 
              onClick={() => navigateTo('home')}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all py-1 ${activeTab === 'home' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <HomeIcon className={`w-[24px] h-[24px] stroke-[2.5] ${activeTab === 'home' ? 'text-[#008f55]' : 'text-gray-600'}`} />
              <span className={`text-[10px] ${activeTab === 'home' ? 'font-bold text-[#008f55]' : 'font-semibold text-gray-600'}`}>Trang chủ</span>
            </button>
            
            <button 
              onClick={() => navigateTo('rides')}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all py-1 ${activeTab === 'rides' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <Car className={`w-[24px] h-[24px] stroke-[2.5] ${activeTab === 'rides' ? 'text-[#008f55]' : 'text-gray-600'}`} />
              <span className={`text-[10px] ${activeTab === 'rides' ? 'font-bold text-[#008f55]' : 'font-semibold text-gray-600'}`}>Chuyến đi</span>
            </button>
            
            <button className="flex-1 flex flex-col items-center justify-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity py-1">
              <Wallet className="w-[24px] h-[24px] text-gray-600 stroke-[2]" />
              <span className="text-[10px] font-semibold text-gray-600">Ví & Tác động</span>
            </button>
            
            <button className="flex-1 flex flex-col items-center justify-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
              <MessageCircle className="w-[24px] h-[24px] text-gray-600 stroke-[2]" />
              <span className="text-[10px] font-semibold text-gray-600">Tin nhắn</span>
            </button>

            <button 
              onClick={() => navigateTo('profile')}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all py-1 ${activeTab === 'profile' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <User className={`w-[24px] h-[24px] stroke-[2.5] ${activeTab === 'profile' ? 'text-[#008f55]' : 'text-gray-600'}`} />
              <span className={`text-[10px] ${activeTab === 'profile' ? 'font-bold text-[#008f55]' : 'font-semibold text-gray-600'}`}>Cá nhân</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

