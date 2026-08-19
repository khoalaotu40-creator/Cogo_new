const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The bottom nav also needs a white background with a shadow/blur to look exactly like the screenshot. 
// Wait, the screenshot in the previous step showed a dark app, but the new screenshot shows a white navigation bar background with green icons.
// The whole app is dark mode. Does the user want the bottom nav to be white now? 
// The screenshot provided shows a white bottom navigation bar with a green plus button in the center.

content = content.replace(
  /className="absolute bottom-0 w-full bg-gradient-to-t from-black\/80 via-black\/50 to-transparent flex items-center justify-between px-6 pt-12 pb-6 sm:pb-4 z-50"/,
  'className="absolute bottom-0 w-full bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex items-center justify-between px-6 pt-3 pb-6 sm:pb-4 z-50 rounded-t-3xl border-t border-gray-100"'
);

// We need to change the icons color to match the white nav bar.
// Currently they are text-[#2ee6c2] / text-gray-400
// We need to change to text-[#006A3B] / text-gray-400
content = content.replace(/text-\[#2ee6c2\]/g, "text-[#006A3B]");

fs.writeFileSync('src/App.tsx', content);
