const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The bottom nav has bg-[#0a0a0a] and border-t border-[#222].
// It needs to be totally transparent and borderless.
// We also need to change the plus button from a rounded rectangle to a circle.

// 1. Update the nav container
content = content.replace(
  /className="absolute bottom-0 w-full bg-\[#0a0a0a\] flex items-center justify-between px-6 pt-3 pb-6 sm:pb-4 border-t border-\[#222\] z-50"/,
  'className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-center justify-between px-6 pt-12 pb-6 sm:pb-4 z-50"'
);

// 2. Update the Plus button
content = content.replace(
  /isSos \n                     \? 'w-24 h-24 bg-red-600 rounded-\[20px\] scale-110 animate-pulse -mt-4 shadow-\[0_0_20px_rgba\(220,38,38,0\.6\)\]' \n                     : 'w-\[48px\] h-\[36px\] bg-\[#2ee6c2\] rounded-\[10px\] hover:bg-\[#20d0ad\]'/,
  `isSos 
                     ? 'w-24 h-24 bg-red-600 rounded-full scale-110 animate-pulse -mt-4 shadow-[0_0_20px_rgba(220,38,38,0.6)]' 
                     : 'w-[48px] h-[48px] bg-[#2ee6c2] rounded-full hover:bg-[#20d0ad] -mt-2'`
);

content = content.replace(
  /isSos \n                     \? 'w-24 h-24 bg-red-600 rounded-\[20px\] scale-110 animate-pulse -mt-4 shadow-\[0_0_20px_rgba\(220,38,38,0\.6\)\]'\n                     : 'w-\[48px\] h-\[36px\] bg-\[#2ee6c2\] rounded-\[10px\] hover:bg-\[#20d0ad\]'/,
  `isSos 
                     ? 'w-24 h-24 bg-red-600 rounded-full scale-110 animate-pulse -mt-4 shadow-[0_0_20px_rgba(220,38,38,0.6)]' 
                     : 'w-[48px] h-[48px] bg-[#2ee6c2] rounded-full hover:bg-[#20d0ad] -mt-2'`
);

fs.writeFileSync('src/App.tsx', content);
