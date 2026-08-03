const fs = require('fs');
let content = fs.readFileSync('src/components/ride/RideTracking.tsx', 'utf8');

const oldCode = `        const data = await api.rides.getTracking(rideId);
        setTrackingData(data);`;

const newCode = `        const data = await api.rides.getTracking(rideId);
        setTrackingData(data);
        
        try {
          const requests = await api.rides.getJoinRequestsForRide(rideId);
          setJoinRequests(requests);
        } catch (err) {}`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/components/ride/RideTracking.tsx', content);
