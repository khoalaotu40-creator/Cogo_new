const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace active color #006A3B to primary #006b47
content = content.replace(/text-\[#006A3B\]/g, 'text-[#006b47]');

// Replace SOS button bg from #006A3B to primary-container #00875a and hover to primary #006b47
content = content.replace(/bg-\[#006A3B\]/g, 'bg-[#00875a]');
content = content.replace(/hover:bg-\[#00522D\]/g, 'hover:bg-[#006b47]');

// Also add labels to the icons as requested previously (since it failed earlier)
content = content.replace(
  /<button\s+onClick=\{\(\) => navigateTo\('home'\)\}\s+className=\{\`flex flex-col items-center justify-center gap-1 transition-all py-1 \$\{\s*activeTab === 'home' \? 'opacity-100' : 'opacity-70 hover:opacity-100'\s*\}\`\}\s*>\s*<HomeIcon className=\{\`w-\[24px\] h-\[24px\] stroke-\[2\.5\] \$\{\s*activeTab === 'home' \? 'text-\[#006b47\]' : 'text-gray-400'\s*\}\`\} \/>\s*<\/button>/,
  `<button 
              onClick={() => navigateTo('home')}
              className={\`flex flex-col items-center justify-center gap-1 transition-all py-1 \${activeTab === 'home' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}\`}
            >
              <HomeIcon className={\`w-[24px] h-[24px] \${activeTab === 'home' ? 'text-[#006b47]' : 'text-[#4A4A4A]'}\`} fill={activeTab === 'home' ? 'currentColor' : 'none'} strokeWidth={activeTab === 'home' ? 0 : 2} />
              <span className={\`text-[12px] font-medium \${activeTab === 'home' ? 'text-[#006b47]' : 'text-[#4A4A4A]'}\`}>Home</span>
            </button>`
);

content = content.replace(
  /<button\s+onClick=\{\(\) => navigateTo\('profile'\)\}\s+className=\{\`flex flex-col items-center justify-center gap-1 transition-all py-1 \$\{\s*activeTab === 'profile' \? 'opacity-100' : 'opacity-70 hover:opacity-100'\s*\}\`\}\s*>\s*<User className=\{\`w-\[24px\] h-\[24px\] stroke-\[2\.5\] \$\{\s*activeTab === 'profile' \? 'text-\[#006b47\]' : 'text-gray-400'\s*\}\`\} \/>\s*<\/button>/,
  `<button 
              onClick={() => navigateTo('profile')}
              className={\`flex flex-col items-center justify-center gap-1 transition-all py-1 \${activeTab === 'profile' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}\`}
            >
              <User className={\`w-[24px] h-[24px] \${activeTab === 'profile' ? 'text-[#006b47]' : 'text-[#4A4A4A]'}\`} strokeWidth={2.5} />
              <span className={\`text-[12px] font-medium \${activeTab === 'profile' ? 'text-[#006b47]' : 'text-[#4A4A4A]'}\`}>Profile</span>
            </button>`
);

content = content.replace(
  /<button\s+onClick=\{\(\) => navigateTo\('rides'\)\}\s+className=\{\`flex flex-col items-center justify-center gap-1 transition-all py-1 \$\{\s*activeTab === 'rides' \? 'opacity-100' : 'opacity-70 hover:opacity-100'\s*\}\`\}\s*>\s*<List className=\{\`w-\[24px\] h-\[24px\] stroke-\[2\.5\] \$\{\s*activeTab === 'rides' \? 'text-\[#006b47\]' : 'text-gray-400'\s*\}\`\} \/>\s*<\/button>/,
  `<button 
              onClick={() => navigateTo('rides')}
              className={\`flex flex-col items-center justify-center gap-1 transition-all py-1 \${activeTab === 'rides' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}\`}
            >
              <List className={\`w-[24px] h-[24px] \${activeTab === 'rides' ? 'text-[#006b47]' : 'text-[#4A4A4A]'}\`} strokeWidth={2.5} />
              <span className={\`text-[12px] font-medium \${activeTab === 'rides' ? 'text-[#006b47]' : 'text-[#4A4A4A]'}\`}>Chuyến</span>
            </button>`
);

content = content.replace(
  /<button\s+onClick=\{\(\) => navigateTo\('notifications'\)\}\s+className=\{\`flex flex-col items-center justify-center gap-1 transition-all py-1 relative \$\{\s*activeTab === 'notifications' \? 'opacity-100' : 'opacity-70 hover:opacity-100'\s*\}\`\}\s*>\s*<Bell className=\{\`w-\[24px\] h-\[24px\] stroke-\[2\.5\] \$\{\s*activeTab === 'notifications' \? 'text-\[#006b47\]' : 'text-gray-400'\s*\}\`\} \/>\s*<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"><\/span>\s*<\/button>/,
  `<button 
              onClick={() => navigateTo('notifications')}
              className={\`flex flex-col items-center justify-center gap-1 transition-all py-1 relative \${activeTab === 'notifications' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}\`}
            >
              <Bell className={\`w-[24px] h-[24px] \${activeTab === 'notifications' ? 'text-[#006b47]' : 'text-[#4A4A4A]'}\`} strokeWidth={2.5} />
              <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className={\`text-[12px] font-medium \${activeTab === 'notifications' ? 'text-[#006b47]' : 'text-[#4A4A4A]'}\`}>Thông báo</span>
            </button>`
);

fs.writeFileSync('src/App.tsx', content);
