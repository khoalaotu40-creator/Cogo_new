import { Home, Wallet } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: 'home' | 'earnings';
  onChangeTab: (tab: 'home' | 'earnings') => void;
}

export function BottomNavigation({ currentTab, onChangeTab }: BottomNavigationProps) {
  return (
    <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 pt-3 pb-7 px-2 flex justify-around items-center sm:rounded-b-[2rem] z-30">
      <div 
        className="flex flex-col items-center justify-center gap-1 cursor-pointer w-16"
        onClick={() => onChangeTab('home')}
      >
        <Home className={`w-6 h-6 ${currentTab === 'home' ? 'text-[#00A550]' : 'text-gray-500'}`} fill={currentTab === 'home' ? 'currentColor' : 'none'} strokeWidth={2} />
        <span className={`text-[10px] font-bold ${currentTab === 'home' ? 'text-[#00A550]' : 'text-gray-500'}`}>Trang chủ</span>
      </div>
      <div 
        className="flex flex-col items-center justify-center gap-1 cursor-pointer w-16"
        onClick={() => onChangeTab('earnings')}
      >
        <Wallet className={`w-6 h-6 ${currentTab === 'earnings' ? 'text-[#00A550]' : 'text-gray-500'}`} fill={currentTab === 'earnings' ? 'currentColor' : 'none'} strokeWidth={2} />
        <span className={`text-[10px] font-bold ${currentTab === 'earnings' ? 'text-[#00A550]' : 'text-gray-500'}`}>Thu nhập</span>
      </div>
    </div>
  );
}
