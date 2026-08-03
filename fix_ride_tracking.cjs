const fs = require('fs');
let content = fs.readFileSync('src/components/ride/RideTracking.tsx', 'utf8');

// Remove the handleAcceptJoin from inside the useEffect
const brokenCode = `  const handleAcceptJoin = async (requestId: number) => {
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

  return () => clearInterval(intervalId);`;

content = content.replace(brokenCode, '    return () => clearInterval(intervalId);');

// Now inject it right before the main return statement
const correctCode = `  const handleAcceptJoin = async (requestId: number) => {
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

  return (`;
  
content = content.replace(/  return \(\n    <div className="flex flex-col h-full bg-gray-50">/, correctCode + '\n    <div className="flex flex-col h-full bg-gray-50">');

fs.writeFileSync('src/components/ride/RideTracking.tsx', content);
