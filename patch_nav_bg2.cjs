const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Looking closely at the user's second screenshot, they still have the DARK gradient background for the navigation bar,
// but they want the PLUS BUTTON to be a GREEN CIRCLE with a WHITE cross, instead of the rounded cyan square.
// Oh wait, the FIRST screenshot shows a WHITE bottom bar with a dark green plus button!
// The user uploaded 2 images. The first image `image.png` shows a WHITE bottom navigation bar, with a dark green circle `+` button in the center.
// The second image `screenshot_1.png` shows the full app screen, with the SAME black background navigation bar, but circling the bottom nav area with red.
// Ah, the user says "đổi lại màu sắc như này" (change color like this) pointing to the first image.
// So we want the dark nav bar to become the white nav bar, or at least have the same button and icon colors.
// Let's make the nav bar white to match the first image exactly.

// Reverting shadow to be subtle for a white nav bar
content = content.replace(
  /shadow-\[0_-10px_40px_rgba\(0,0,0,0\.8\)\]/,
  'shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'
);

// We need to add labels "Home" and "Profile" under the icons if they don't exist, as shown in the screenshot.
// Currently the code has HomeIcon and User icon inside buttons.
// Let's replace the buttons to include the text and match the screenshot exactly.

content = content.replace(
  /<button \n               onClick=\{\(\) => navigateTo\('home'\)\}\n              className=\{\`flex flex-col items-center justify-center gap-1 transition-all py-1 \$\{\s*activeTab === 'home' \? 'opacity-100' : 'opacity-70 hover:opacity-100'\s*\}\`\}\n            >\n              <HomeIcon className=\{\`w-\[24px\] h-\[24px\] stroke-\[2\.5\] \$\{\s*activeTab === 'home' \? 'text-\[#006A3B\]' : 'text-gray-400'\s*\}\`\} \/>\n            <\/button>/,
  `<button 
               onClick={() => navigateTo('home')}
              className={\`flex flex-col items-center justify-center gap-1 transition-all py-1 \${activeTab === 'home' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}\`}
            >
              <HomeIcon className={\`w-[24px] h-[24px] \${activeTab === 'home' ? 'text-[#006A3B]' : 'text-[#4A4A4A]'}\`} fill={activeTab === 'home' ? 'currentColor' : 'none'} strokeWidth={activeTab === 'home' ? 0 : 2} />
              <span className={\`text-[12px] font-medium \${activeTab === 'home' ? 'text-[#006A3B]' : 'text-[#4A4A4A]'}\`}>Home</span>
            </button>`
);

content = content.replace(
  /<button \n               onClick=\{\(\) => navigateTo\('profile'\)\}\n              className=\{\`flex flex-col items-center justify-center gap-1 transition-all py-1 \$\{\s*activeTab === 'profile' \? 'opacity-100' : 'opacity-70 hover:opacity-100'\s*\}\`\}\n            >\n              <User className=\{\`w-\[24px\] h-\[24px\] stroke-\[2\.5\] \$\{\s*activeTab === 'profile' \? 'text-\[#006A3B\]' : 'text-gray-400'\s*\}\`\} \/>\n            <\/button>/,
  `<button 
               onClick={() => navigateTo('profile')}
              className={\`flex flex-col items-center justify-center gap-1 transition-all py-1 \${activeTab === 'profile' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}\`}
            >
              <User className={\`w-[24px] h-[24px] \${activeTab === 'profile' ? 'text-[#006A3B]' : 'text-[#4A4A4A]'}\`} strokeWidth={2.5} />
              <span className={\`text-[12px] font-medium \${activeTab === 'profile' ? 'text-[#006A3B]' : 'text-[#4A4A4A]'}\`}>Profile</span>
            </button>`
);

// Do the same for Rides and Notifications to keep it consistent
content = content.replace(
  /<button \n               onClick=\{\(\) => navigateTo\('rides'\)\}\n              className=\{\`flex flex-col items-center justify-center gap-1 transition-all py-1 \$\{\s*activeTab === 'rides' \? 'opacity-100' : 'opacity-70 hover:opacity-100'\s*\}\`\}\n            >\n              <List className=\{\`w-\[24px\] h-\[24px\] stroke-\[2\.5\] \$\{\s*activeTab === 'rides' \? 'text-\[#006A3B\]' : 'text-gray-400'\s*\}\`\} \/>\n            <\/button>/,
  `<button 
               onClick={() => navigateTo('rides')}
              className={\`flex flex-col items-center justify-center gap-1 transition-all py-1 \${activeTab === 'rides' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}\`}
            >
              <List className={\`w-[24px] h-[24px] \${activeTab === 'rides' ? 'text-[#006A3B]' : 'text-[#4A4A4A]'}\`} strokeWidth={2.5} />
              <span className={\`text-[12px] font-medium \${activeTab === 'rides' ? 'text-[#006A3B]' : 'text-[#4A4A4A]'}\`}>Chuyến</span>
            </button>`
);

content = content.replace(
  /<button \n               onClick=\{\(\) => navigateTo\('notifications'\)\}\n              className=\{\`flex flex-col items-center justify-center gap-1 transition-all py-1 relative \$\{\s*activeTab === 'notifications' \? 'opacity-100' : 'opacity-70 hover:opacity-100'\s*\}\`\}\n            >\n              <Bell className=\{\`w-\[24px\] h-\[24px\] stroke-\[2\.5\] \$\{\s*activeTab === 'notifications' \? 'text-\[#006A3B\]' : 'text-gray-400'\s*\}\`\} \/>\n              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"><\/span>\n            <\/button>/,
  `<button 
               onClick={() => navigateTo('notifications')}
              className={\`flex flex-col items-center justify-center gap-1 transition-all py-1 relative \${activeTab === 'notifications' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}\`}
            >
              <Bell className={\`w-[24px] h-[24px] \${activeTab === 'notifications' ? 'text-[#006A3B]' : 'text-[#4A4A4A]'}\`} strokeWidth={2.5} />
              <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className={\`text-[12px] font-medium \${activeTab === 'notifications' ? 'text-[#006A3B]' : 'text-[#4A4A4A]'}\`}>Thông báo</span>
            </button>`
);

fs.writeFileSync('src/App.tsx', content);
