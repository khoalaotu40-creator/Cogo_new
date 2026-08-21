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
import Messages from './components/user/Messages';

export default function Home() {
  const [activeTab, setActiveTab] = useState('login');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [previousTab, setPreviousTab] = useState('login');
  const [hideFooter, setHideFooter] = useState(false);
  const [isSos, setIsSos] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const getUrlForTab = (tab: string, mode: 'login' | 'register' = authMode) => {
    if (tab === 'login') {
      return mode === 'register' ? '/register' : '/login';
    }
    if (tab === 'register') {
      return '/register';
    }

    let userQuery = '';
    try {
      const savedUser = JSON.parse(localStorage.getItem('cogo_user') || '{}');
      const userId = savedUser.id || savedUser.id_user;
      if (userId) {
        userQuery = `?id=${userId}`;
      }
    } catch {}

    switch (tab) {
      case 'home':
        return `/home${userQuery}`;
      case 'rides':
        return `/rides${userQuery}`;
      case 'available-rides':
        return `/available-rides${userQuery}`;
      case 'find-ride':
        return `/find-ride${userQuery}`;
      case 'messages':
        return `/messages${userQuery}`;
      case 'profile':
        return `/profile${userQuery}`;
      case 'settings':
        return `/settings${userQuery}`;
      case 'notifications':
        return `/notifications${userQuery}`;
      case 'driver-home':
        return `/driver${userQuery}`;
      case 'driver-registration':
        return `/driver-registration${userQuery}`;
      default:
        return `/${tab}${userQuery}`;
    }
  };

  const parseUrlToTab = (pathname: string): { tab: string; mode: 'login' | 'register' } => {
    const cleanPath = pathname.replace(/\/+$/, '') || '/';
    
    if (cleanPath === '/login') return { tab: 'login', mode: 'login' };
    if (cleanPath === '/register') return { tab: 'login', mode: 'register' };
    if (cleanPath === '/home' || cleanPath === '/') return { tab: 'home', mode: 'login' };
    if (cleanPath === '/rides') return { tab: 'rides', mode: 'login' };
    if (cleanPath === '/available-rides') return { tab: 'available-rides', mode: 'login' };
    if (cleanPath === '/find-ride') return { tab: 'find-ride', mode: 'login' };
    if (cleanPath === '/messages') return { tab: 'messages', mode: 'login' };
    if (cleanPath === '/profile') return { tab: 'profile', mode: 'login' };
    if (cleanPath === '/settings') return { tab: 'settings', mode: 'login' };
    if (cleanPath === '/notifications') return { tab: 'notifications', mode: 'login' };
    if (cleanPath === '/driver' || cleanPath === '/driver-home') return { tab: 'driver-home', mode: 'login' };
    if (cleanPath === '/driver-registration') return { tab: 'driver-registration', mode: 'login' };

    return { tab: 'home', mode: 'login' };
  };

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

  // Initialize and parse initial URL
  useEffect(() => {
    const savedUserStr = localStorage.getItem('cogo_user');
    let hasValidUser = false;
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        const userId = savedUser.id || savedUser.id_user;
        if (!isNaN(Number(userId)) && userId) {
          hasValidUser = true;
        } else {
          localStorage.removeItem('cogo_user');
        }
      } catch (e) {
        localStorage.removeItem('cogo_user');
      }
    }

    const { tab: urlTab, mode: urlMode } = parseUrlToTab(window.location.pathname);
    setAuthMode(urlMode);

    if (hasValidUser) {
      const targetTab = urlTab === 'login' ? 'home' : urlTab;
      setActiveTab(targetTab);
      setPreviousTab(targetTab);
      const targetUrl = getUrlForTab(targetTab, urlMode);
      window.history.replaceState({ tab: targetTab }, '', targetUrl);
    } else {
      setActiveTab('login');
      setPreviousTab('login');
      const targetUrl = urlMode === 'register' ? '/register' : '/login';
      window.history.replaceState({ tab: 'login', mode: urlMode }, '', targetUrl);
    }

    const handlePopState = () => {
      const { tab, mode } = parseUrlToTab(window.location.pathname);
      setAuthMode(mode);
      setActiveTab(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleNavigate = (e: CustomEvent<string>) => {
      navigateTo(e.detail);
    };
    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, [activeTab, authMode]);

  const navigateTo = (tab: string, mode?: 'login' | 'register') => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
    const targetMode = mode || authMode;
    if (mode) setAuthMode(mode);

    const targetUrl = getUrlForTab(tab, targetMode);
    if (window.location.pathname + window.location.search !== targetUrl) {
      window.history.pushState({ tab, mode: targetMode }, '', targetUrl);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cogo_user');
    navigateTo('login', 'login');
  };

  const handleLoginModeChange = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    const targetUrl = mode === 'register' ? '/register' : '/login';
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ tab: 'login', mode }, '', targetUrl);
    }
  };

  const renderHomeContent = () => (
    <div className={`flex-1 overflow-hidden bg-[#f9f9ff] flex flex-col relative text-[#141b2c] h-full ${hideFooter ? 'pb-0' : 'pb-[65px] sm:pb-[75px]'}`}>
      {/* Feed */}
      <Feed onStart={() => navigateTo('available-rides')} onToggleFooter={setHideFooter} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[850px] bg-[#f9f9ff] sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col sm:border-8 border-gray-900 mx-auto">
        
        <div key={activeTab} className="flex-1 w-full h-full flex flex-col page-transition-enter overflow-hidden relative">
          {activeTab === 'login' && (
            <Login 
              initialMode={authMode} 
              onModeChange={handleLoginModeChange}
              onLoginSuccess={() => navigateTo('home')} 
            />
          )}
          {activeTab === 'home' && renderHomeContent()}
          {activeTab === 'available-rides' && <AvailableRides onBack={() => setActiveTab(previousTab)} />}
          {activeTab === 'rides' && <Rides onFindRide={() => navigateTo('find-ride')} />}
          {activeTab === 'find-ride' && <FindRideForm onBack={() => setActiveTab(previousTab)} onSuccess={(type) => navigateTo(type === 'schedule' ? 'home' : 'rides')} />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'messages' && <Messages />}
          {activeTab === 'settings' && <Settings onLogout={handleLogout} onBack={() => setActiveTab(previousTab)} onNavigateToProfile={() => navigateTo('profile')} onRegisterDriver={() => navigateTo('driver-registration')} onSwitchToDriverMode={() => navigateTo('driver-home')} />}
          {activeTab === 'driver-home' && <DriverHome onBack={() => setActiveTab('settings')} />}
          {activeTab === 'driver-registration' && <DriverRegistration onBack={() => setActiveTab(previousTab)} onSuccess={() => navigateTo('settings')} />}
          {activeTab === 'notifications' && (
            <Notifications 
              onBack={() => setActiveTab(previousTab)} 
              currentUser={localStorage.getItem('cogo_user') ? JSON.parse(localStorage.getItem('cogo_user') as string) : null}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        {!hideFooter && activeTab !== 'find-ride' && activeTab !== 'login' && activeTab !== 'settings' && activeTab !== 'available-rides' && activeTab !== 'driver-registration' && activeTab !== 'notifications' && activeTab !== 'driver-home' && (
          <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.04)] flex items-center justify-between px-6 pt-2.5 pb-5 sm:pb-4 z-50 rounded-t-[28px] border-t border-[#eceeed]">
            <button 
              onClick={() => navigateTo('home')}
              className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${activeTab === 'home' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <HomeIcon className={`w-[23px] h-[23px] ${activeTab === 'home' ? 'text-[#006b47]' : 'text-[#8a9490]'}`} fill={activeTab === 'home' ? 'currentColor' : 'none'} strokeWidth={activeTab === 'home' ? 0 : 2.2} />
              <span className={`text-[12px] font-semibold ${activeTab === 'home' ? 'text-[#006b47]' : 'text-[#8a9490]'}`}>Khám phá</span>
            </button>
            
            <button 
              onClick={() => navigateTo('rides')}
              className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${activeTab === 'rides' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <List className={`w-[23px] h-[23px] ${activeTab === 'rides' ? 'text-[#006b47]' : 'text-[#8a9490]'}`} strokeWidth={2.2} />
              <span className={`text-[12px] font-semibold ${activeTab === 'rides' ? 'text-[#006b47]' : 'text-[#8a9490]'}`}>Chuyến</span>
            </button>

            <div className="relative -mt-6 flex justify-center">
              <button 
                onClick={() => {
                  if (!isSos) navigateTo('find-ride');
                }}
                onPointerDown={startPress}
                onPointerUp={cancelPress}
                onPointerLeave={cancelPress}
                className={`flex items-center justify-center shadow-lg transition-all duration-300 ${isSos ? 'w-24 h-24 bg-red-600 rounded-full scale-110 animate-pulse -mt-4 shadow-[0_0_20px_rgba(220,38,38,0.6)]' : 'w-[52px] h-[52px] bg-[#00875a] rounded-full hover:bg-[#006b47] -mt-4 shadow-[0_6px_18px_rgba(0,135,90,0.34)]'}`}
              >
                {isSos ? (
                  <span className="font-bold text-white text-2xl tracking-wider">SOS</span>
                ) : (
                  <Plus className="w-7 h-7 text-white stroke-[2.5]" />
                )}
              </button>
            </div>

            <button 
              onClick={() => navigateTo('messages')}
              className={`flex flex-col items-center justify-center gap-1 transition-all py-1 relative ${activeTab === 'messages' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <MessageCircle className={`w-[23px] h-[23px] ${activeTab === 'messages' ? 'text-[#006b47]' : 'text-[#8a9490]'}`} strokeWidth={2.2} />
              <span className="absolute top-1 right-2.5 w-2 h-2 bg-[#006b47] rounded-full"></span>
              <span className={`text-[12px] font-semibold ${activeTab === 'messages' ? 'text-[#006b47]' : 'text-[#8a9490]'}`}>Tin nhắn</span>
            </button>

            <button 
              onClick={() => navigateTo('profile')}
              className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${activeTab === 'profile' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <User className={`w-[23px] h-[23px] ${activeTab === 'profile' ? 'text-[#006b47]' : 'text-[#8a9490]'}`} strokeWidth={2.2} />
              <span className={`text-[12px] font-semibold ${activeTab === 'profile' ? 'text-[#006b47]' : 'text-[#8a9490]'}`}>Tôi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

