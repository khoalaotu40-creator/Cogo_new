const fs = require('fs');
let content = fs.readFileSync('src/components/ride/RideTracking.tsx', 'utf8');

// Add padding to the bottom of the info panel
content = content.replace(
  /className="bg-white rounded-t-\[32px\] shadow-\[0_-4px_20px_rgba\(0,0,0,0\.08\)\] p-6 z-\[1000\] relative mt-\[-20px\] max-h-\[60vh\] overflow-y-auto"/,
  'className="bg-white rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-6 pb-10 z-[1000] relative mt-[-20px] max-h-[60vh] flex flex-col overflow-y-auto"'
);

fs.writeFileSync('src/components/ride/RideTracking.tsx', content);
