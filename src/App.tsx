"use client"
import { useState, useEffect } from 'react';
import { Search, Users, Car, Wallet, Leaf, Building2, ChevronRight, Home as HomeIcon, MessageCircle, User, Settings as SettingsIcon, Plus, List } from 'lucide-react';
import Rides from './components/Rides';
import FindRideForm from './components/FindRideForm';
import Login from './components/Login';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Feed from './components/Feed';
import AvailableRides from './components/AvailableRides';

export default function Home() {
  const [activeTab, setActiveTab] = useState('login');
  const [previousTab, setPreviousTab] = useState('login');

  useEffect(() => {
    const savedUserStr = localStorage.getItem('cogo_user');
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        const userId = savedUser.id || savedUser.id_user;
        if (isNaN(Number(userId))) {
          // Invalid legacy user
          localStorage.removeItem('cogo_user');
        } else {
          setActiveTab('home');
          setPreviousTab('home');
        }
      } catch (e) {
        localStorage.removeItem('cogo_user');
      }
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
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Car className="w-[26px] h-[26px] text-[#008f55]" />
          <span className="text-[20px] font-bold text-[#008f55] tracking-tight">Cogo</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('rides')} className="text-[#008f55] hover:opacity-80 transition-opacity">
            <List className="w-[22px] h-[22px] stroke-[2]" />
          </button>
          <button onClick={() => navigateTo('settings')} className="text-[#008f55] hover:opacity-80 transition-opacity">
            <SettingsIcon className="w-[22px] h-[22px] text-[#008f55] stroke-[2]" />
          </button>
        </div>
      </div>
      
      <Feed onStart={() => navigateTo('available-rides')} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[850px] bg-white sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col sm:border-8 border-gray-900 mx-auto">
        
        {activeTab === 'login' && <Login onLoginSuccess={() => navigateTo('home')} />}
        {activeTab === 'home' && renderHomeContent()}
        {activeTab === 'available-rides' && <AvailableRides onBack={() => setActiveTab(previousTab)} />}
        {activeTab === 'rides' && <Rides onFindRide={() => navigateTo('find-ride')} />}
        {activeTab === 'find-ride' && <FindRideForm onBack={() => setActiveTab(previousTab)} onSuccess={() => navigateTo('rides')} />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'settings' && <Settings onLogout={handleLogout} onBack={() => setActiveTab(previousTab)} />}

        {/* Bottom Navigation */}
        {activeTab !== 'find-ride' && activeTab !== 'login' && activeTab !== 'settings' && activeTab !== 'available-rides' && (
          <div className="absolute bottom-0 w-full bg-white flex items-center justify-between px-12 pt-3 pb-6 sm:pb-4 border-t border-gray-100 z-50">
            <button 
              onClick={() => navigateTo('home')}
              className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${activeTab === 'home' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <HomeIcon className={`w-[24px] h-[24px] stroke-[2.5] ${activeTab === 'home' ? 'text-[#008f55]' : 'text-gray-600'}`} />
              <span className={`text-[11px] ${activeTab === 'home' ? 'font-bold text-[#008f55]' : 'font-medium text-gray-600'}`}>Trang chủ</span>
            </button>
            
            <div className="relative -mt-6 flex justify-center">
              <button 
                onClick={() => navigateTo('find-ride')}
                className="w-12 h-12 bg-[#008f55] rounded-full flex items-center justify-center shadow-lg hover:bg-[#007a48] transition-colors"
              >
                <Plus className="w-7 h-7 text-white stroke-[3]" />
              </button>
            </div>

            <button 
              onClick={() => navigateTo('profile')}
              className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${activeTab === 'profile' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <User className={`w-[24px] h-[24px] stroke-[2.5] ${activeTab === 'profile' ? 'text-[#008f55]' : 'text-gray-600'}`} />
              <span className={`text-[11px] ${activeTab === 'profile' ? 'font-bold text-[#008f55]' : 'font-medium text-gray-600'}`}>Cá nhân</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

