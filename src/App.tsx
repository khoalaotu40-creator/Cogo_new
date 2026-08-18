"use client"
import { useState, useEffect, useRef } from 'react';
import { Search, Users, Car, Wallet, Leaf, Building2, ChevronRight, Home as HomeIcon, MessageCircle, User, Settings as SettingsIcon, Plus, List, Bell } from 'lucide-react';
import Rides from './components/ride/Rides';
import FindRideForm from './components/ride/FindRideForm';
import Login from './components/auth/Login';
import Profile from './components/user/Profile';
import Settings from './components/user/Settings';
import Feed from './components/ride/Feed';
import AvailableRides from './components/ride/AvailableRides';
import DriverRegistration from './components/driver/DriverRegistration';
import DriverHome from './components/driver/DriverHome';
import Notifications from './components/user/Notifications';

export default function Home() {
  const [activeTab, setActiveTab] = useState('login');
  const [previousTab, setPreviousTab] = useState('login');
  const [isSos, setIsSos] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      setIsSos(true);
    }, 1000); // 1 second long press
  };

  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setIsSos(false);
  };


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

  useEffect(() => {
    const handleNavigate = (e: CustomEvent<string>) => {
      navigateTo(e.detail);
    };
    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, [activeTab]);

  const navigateTo = (tab: string) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('cogo_user');
    navigateTo('login');
  };

  const renderHomeContent = () => (
    <div className="flex-1 overflow-hidden bg-[#121212] flex flex-col relative text-white h-full pb-[60px] sm:pb-[70px]">
      {/* Feed */}
      <Feed onStart={() => navigateTo('available-rides')} />
      
      
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[850px] bg-[#121212] sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col sm:border-8 border-gray-900 mx-auto">
        
        {activeTab === 'login' && <Login onLoginSuccess={() => navigateTo('home')} />}
        {activeTab === 'home' && renderHomeContent()}
        {activeTab === 'available-rides' && <AvailableRides onBack={() => setActiveTab(previousTab)} />}
        {activeTab === 'rides' && <Rides onFindRide={() => navigateTo('find-ride')} />}
        {activeTab === 'find-ride' && <FindRideForm onBack={() => setActiveTab(previousTab)} onSuccess={(type) => navigateTo(type === 'schedule' ? 'home' : 'rides')} />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'settings' && <Settings onLogout={handleLogout} onBack={() => setActiveTab(previousTab)} onNavigateToProfile={() => navigateTo('profile')} onRegisterDriver={() => navigateTo('driver-registration')} onSwitchToDriverMode={() => navigateTo('driver-home')} />}
        {activeTab === 'driver-home' && <DriverHome onBack={() => setActiveTab('settings')} />}
        {activeTab === 'driver-registration' && <DriverRegistration onBack={() => setActiveTab(previousTab)} onSuccess={() => navigateTo('settings')} />}
        {activeTab === 'notifications' && (
          <Notifications 
            onBack={() => setActiveTab(previousTab)} 
            currentUser={localStorage.getItem('cogo_user') ? JSON.parse(localStorage.getItem('cogo_user') as string) : null}
          />
        )}

        {/* Bottom Navigation */}
        {activeTab !== 'find-ride' && activeTab !== 'login' && activeTab !== 'settings' && activeTab !== 'available-rides' && activeTab !== 'driver-registration' && activeTab !== 'notifications' && activeTab !== 'driver-home' && (
          <div className="absolute bottom-0 w-full bg-[#0a0a0a] flex items-center justify-between px-6 pt-3 pb-6 sm:pb-4 border-t border-[#222] z-50">
            <button 
              onClick={() => navigateTo('home')}
              className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${activeTab === 'home' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <HomeIcon className={`w-[24px] h-[24px] stroke-[2.5] ${activeTab === 'home' ? 'text-[#2ee6c2]' : 'text-gray-400'}`} />
            </button>
            
            <button 
              onClick={() => navigateTo('rides')}
              className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${activeTab === 'rides' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <List className={`w-[24px] h-[24px] stroke-[2.5] ${activeTab === 'rides' ? 'text-[#2ee6c2]' : 'text-gray-400'}`} />
            </button>

            <div className="relative -mt-6 flex justify-center">
              <button 
                onClick={() => {
                  if (!isSos) navigateTo('find-ride');
                }}
                onPointerDown={startPress}
                onPointerUp={cancelPress}
                onPointerLeave={cancelPress}
                className={`flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isSos 
                    ? 'w-24 h-24 bg-red-600 rounded-[20px] scale-110 animate-pulse -mt-4 shadow-[0_0_20px_rgba(220,38,38,0.6)]' 
                    : 'w-[48px] h-[36px] bg-[#2ee6c2] rounded-[10px] hover:bg-[#20d0ad]'
                }`}
              >
                {isSos ? (
                  <span className="font-bold text-white text-2xl tracking-wider">SOS</span>
                ) : (
                  <Plus className="w-6 h-6 text-black stroke-[3]" />
                )}
              </button>
            </div>

            <button 
              onClick={() => navigateTo('notifications')}
              className={`flex flex-col items-center justify-center gap-1 transition-all py-1 relative ${activeTab === 'notifications' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <Bell className={`w-[24px] h-[24px] stroke-[2.5] ${activeTab === 'notifications' ? 'text-[#2ee6c2]' : 'text-gray-400'}`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button 
              onClick={() => navigateTo('profile')}
              className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${activeTab === 'profile' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <User className={`w-[24px] h-[24px] stroke-[2.5] ${activeTab === 'profile' ? 'text-[#2ee6c2]' : 'text-gray-400'}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

