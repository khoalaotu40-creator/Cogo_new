const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// I need to try replacing the Plus button again since the previous script didn't apply properly on it

content = content.replace(
  /isSos \n                     \? 'w-24 h-24 bg-red-600 rounded-\[20px\] scale-110 animate-pulse -mt-4 shadow-\[0_0_20px_rgba\(220,38,38,0\.6\)\]'\n                     : 'w-\[48px\] h-\[36px\] bg-\[#2ee6c2\] rounded-\[10px\] hover:bg-\[#20d0ad\]'/g,
  `isSos 
                     ? 'w-24 h-24 bg-red-600 rounded-full scale-110 animate-pulse -mt-4 shadow-[0_0_20px_rgba(220,38,38,0.6)]' 
                     : 'w-[56px] h-[56px] bg-[#008f55] rounded-full hover:bg-[#00824d] -mt-4'`
);

// Oh wait, the previous code had ' ' spaces in the regex instead of new lines maybe. Let's do a more robust replace.
content = content.replace(
  /className=\{\`flex items-center justify-center shadow-lg transition-all duration-300 \$\{\s*isSos\s*\?\s*'[^']*'\s*:\s*'[^']*'\s*\}\`\}/,
  "className={`flex items-center justify-center shadow-lg transition-all duration-300 ${isSos ? 'w-24 h-24 bg-red-600 rounded-full scale-110 animate-pulse -mt-4 shadow-[0_0_20px_rgba(220,38,38,0.6)]' : 'w-[52px] h-[52px] bg-[#006A3B] rounded-full hover:bg-[#00522D] -mt-4'}`}"
);

// We need to change the plus icon color to white to match the green button
content = content.replace(
  /<Plus className="w-6 h-6 text-black stroke-\[3\]" \/>/,
  '<Plus className="w-7 h-7 text-white stroke-[2.5]" />'
);


fs.writeFileSync('src/App.tsx', content);
