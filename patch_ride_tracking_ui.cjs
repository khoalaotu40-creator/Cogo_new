const fs = require('fs');
let content = fs.readFileSync('src/components/ride/RideTracking.tsx', 'utf8');

// The accept function wasn't injected correctly either because 'return (' matches multiple places.
const acceptFn = `
  const handleAcceptJoin = async (requestId: number) => {
    try {
      setAcceptingRequest(requestId);
      const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');
      await api.rides.acceptJoinRequest(requestId, user.id || user.id_user, 'passenger');
      setJoinRequests(prev => prev.filter(req => req.id !== requestId));
      alert('Đã chấp nhận yêu cầu ghép chuyến');
    } catch (e) {
      alert('Lỗi khi chấp nhận');
    } finally {
      setAcceptingRequest(null);
    }
  };
`;

if (!content.includes('handleAcceptJoin')) {
    content = content.replace(/(return \(\s*<div className="flex flex-col h-full bg-gray-50">)/, acceptFn + '\n  $1');
}

const notificationUI = `
      {/* Join Requests Notifications */}
      {joinRequests.length > 0 && (
        <div className="absolute top-20 left-0 right-0 px-4 z-[400] flex flex-col gap-3 pointer-events-none">
          {joinRequests.map(req => (
            <div key={req.id} className="bg-white rounded-[16px] shadow-lg p-3 flex items-center justify-between pointer-events-auto border border-gray-100">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E5E9FF] flex items-center justify-center text-[#1a2b4b] font-medium text-lg">
                    {req.user_name ? req.user_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-[16px] text-gray-900 leading-tight mb-1">{req.user_name || 'Người dùng'}</div>
                    <div className="text-[13px] text-gray-600">
                      Cách bạn 500m • Gần điểm đến
                    </div>
                  </div>
               </div>
               <button 
                 onClick={() => handleAcceptJoin(req.id)}
                 disabled={acceptingRequest === req.id}
                 className="w-12 h-12 rounded-xl bg-[#c5ebd4] text-[#008f55] flex items-center justify-center hover:bg-[#a6dfbe] transition-colors flex-shrink-0 ml-2"
               >
                 {acceptingRequest === req.id ? (
                   <div className="w-5 h-5 border-2 border-[#008f55] border-t-transparent rounded-full animate-spin" />
                 ) : (
                   <UserPlus className="w-6 h-6" strokeWidth={2.5} />
                 )}
               </button>
            </div>
          ))}
        </div>
      )}
`;

content = content.replace(/(<div className="absolute top-0 w-full z-\[1000\] p-4 pointer-events-none flex justify-between items-start">[\s\S]*?<\/div>)/, '$1\n' + notificationUI);

fs.writeFileSync('src/components/ride/RideTracking.tsx', content);
