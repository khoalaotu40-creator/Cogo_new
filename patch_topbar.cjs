const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The main App background was #121212. If we want the whole app or at least the profile to look right, 
// the container needs to support it. But wait, App.tsx has:
// <div className="flex-1 overflow-hidden bg-[#121212] flex flex-col relative text-white h-full pb-[60px] sm:pb-[70px]">
// Let's change the global dark backgrounds to the Emerald Precision light backgrounds in App.tsx

content = content.replace(/bg-\[#121212\]/g, "bg-[#f9f9ff]");
content = content.replace(/text-white/g, "text-[#141b2c]");

fs.writeFileSync('src/App.tsx', content);
