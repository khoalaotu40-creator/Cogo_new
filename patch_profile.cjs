const fs = require('fs');
let content = fs.readFileSync('src/components/user/Profile.tsx', 'utf8');

// Apply the Emerald Precision design system to Profile.tsx

// 1. Change the main background
// From: bg-[#121415]
// To: bg-[#f9f9ff] (background from Emerald Precision)
content = content.replace(/bg-\[#121415\]/g, "bg-[#f9f9ff]");

// 2. Change the background gradient
// From: bg-gradient-to-b from-[#2ee6c2]/15 to-transparent
// To: bg-gradient-to-b from-[#00875a]/15 to-transparent
content = content.replace(/from-\[#2ee6c2\]\/15/g, "from-[#00875a]/15");

// 3. Change icon buttons at the top
// From: bg-black/30 p-2 rounded-full text-white hover:bg-black/40
// To: bg-white/60 p-2 rounded-full text-[#141b2c] hover:bg-white/80 shadow-sm border border-[#bdcac0]/30
content = content.replace(/bg-black\/30 p-2 rounded-full text-white hover:bg-black\/40/g, "bg-white/60 p-2 rounded-full text-[#141b2c] hover:bg-white/80 shadow-sm border border-[#bdcac0]/30");

// 4. Change avatar border and container
// From: bg-gradient-to-br from-gray-700 to-gray-900 shadow-xl
// To: bg-gradient-to-br from-[#00875a] to-[#006b47] shadow-xl
content = content.replace(/bg-gradient-to-br from-gray-700 to-gray-900/g, "bg-gradient-to-br from-[#00875a] to-[#006b47]");
// From: border-[#121415]
// To: border-[#f9f9ff]
content = content.replace(/border-\[#121415\]/g, "border-[#f9f9ff]");

// 5. Change shield icon background
// From: bg-[#1a1c1e] 
// To: bg-[#e9edff]
content = content.replace(/bg-\[#1a1c1e\]/g, "bg-[#e9edff]");
// From: text-gray-400 (shield) -> wait, shield text color is in the same div or next?
// Let's replace the whole shield icon section
content = content.replace(
  /<div className="absolute -bottom-1 -right-1 bg-\[#e9edff\] p-1\.5 rounded-full border-2 border-\[#f9f9ff\]">\n            <ShieldCheck className="w-5 h-5 text-gray-400" \/>/,
  `<div className="absolute -bottom-1 -right-1 bg-[#e9edff] p-1.5 rounded-full border-2 border-[#f9f9ff]">
            <ShieldCheck className="w-5 h-5 text-[#006b47]" />`
);

// Ah, wait. The shield icon replacement didn't run yet, so the original text is there. Let's do a more robust replace.
content = content.replace(
  /<div className="absolute -bottom-1 -right-1 bg-\[#1a1c1e\] p-1\.5 rounded-full border-2 border-\[#f9f9ff\]">\s*<ShieldCheck className="w-5 h-5 text-gray-400" \/>/,
  `<div className="absolute -bottom-1 -right-1 bg-[#e9edff] p-1.5 rounded-full border-2 border-[#f9f9ff]">
            <ShieldCheck className="w-5 h-5 text-[#006b47]" />`
);

// 6. Change Text colors
// Name: text-white -> text-[#141b2c]
content = content.replace(/<h1 className="text-\[22px\] font-bold text-white tracking-tight">/g, '<h1 className="text-[22px] font-bold text-[#141b2c] tracking-tight font-[Hanken Grotesk]">');
// Intro: text-gray-400 -> text-[#3e4942]
content = content.replace(/<p className="text-\[13px\] text-gray-400 font-medium">/g, '<p className="text-[13px] text-[#3e4942] font-medium font-[Inter]">');


// 7. Change Private Mode Toggle Block
// Container: bg-[#1c1c1c] ... border-white/5 -> bg-[#ffffff] ... border-[#bdcac0]/30 shadow-sm
content = content.replace(
  /className="w-full bg-\[#1c1c1c\] rounded-\[24px\] p-5 mb-6 border border-white\/5"/g,
  'className="w-full bg-[#ffffff] rounded-[24px] p-5 mb-6 border border-[#bdcac0]/30 shadow-[0_4px_24px_rgba(0,107,71,0.08)]"'
);

// Toggle switch background: bg-[#2ee6c2] -> bg-[#00875a], bg-gray-600 -> bg-[#dbe2f9]
content = content.replace(/bg-\[#2ee6c2\]/g, "bg-[#00875a]");
content = content.replace(/bg-gray-600/g, "bg-[#dbe2f9]");

// Toggle Title: text-white -> text-[#141b2c]
// Toggle Icon: text-[#2ee6c2] -> text-[#00875a]
content = content.replace(
  /<span className="text-white font-bold text-\[15px\] flex items-center gap-2">/g,
  '<span className="text-[#141b2c] font-bold text-[15px] flex items-center gap-2">'
);
content = content.replace(
  /<ShieldCheck className="w-4 h-4 text-\[#00875a\]" \/>/g, // because we replaced #2ee6c2 earlier
  '<ShieldCheck className="w-4 h-4 text-[#00875a]" />'
);

// Toggle Description: text-gray-400 -> text-[#3e4942]
content = content.replace(
  /<p className="text-\[12px\] text-gray-400 text-center leading-relaxed px-4">/g,
  '<p className="text-[12px] text-[#3e4942] text-center leading-relaxed px-4">'
);

// 8. Change Tabs
// Active tab: bg-[#2a2a2a] text-white -> bg-[#e9edff] text-[#006b47]
content = content.replace(/bg-\[#2a2a2a\] text-white/g, "bg-[#e9edff] text-[#006b47]");
// Inactive tab: text-gray-500 hover:text-gray-300 -> text-[#6e7a71] hover:text-[#3e4942]
content = content.replace(/text-gray-500 hover:text-gray-300/g, "text-[#6e7a71] hover:text-[#3e4942]");


// 9. Change Content Area (Empty State)
content = content.replace(/text-white\/40/g, "text-[#6e7a71]");
content = content.replace(/text-white\/50/g, "text-[#3e4942]");
content = content.replace(/bg-white\/5/g, "bg-[#e9edff]");

// 10. Change Content Area (Posts)
// Post container: bg-[#1c1c1c] ... border-white/5 -> bg-[#ffffff] ... border-[#bdcac0]/30 shadow-sm
content = content.replace(
  /bg-\[#1c1c1c\] rounded-\[20px\] p-4 border border-white\/5/g,
  'bg-[#ffffff] rounded-[20px] p-4 border border-[#bdcac0]/30 shadow-[0_4px_24px_rgba(0,107,71,0.08)]'
);
// Post header text: text-white -> text-[#141b2c]
content = content.replace(/<div className="text-white font-semibold text-\[14\.5px\]">/g, '<div className="text-[#141b2c] font-semibold text-[14.5px]">');
// Post date: text-gray-500 -> text-[#6e7a71]
content = content.replace(/<div className="text-gray-500 text-\[12px\]">/g, '<div className="text-[#6e7a71] text-[12px]">');
// Post body text: text-white/90 -> text-[#141b2c]
content = content.replace(/<p className="text-white\/90 text-\[14\.5px\] leading-relaxed mb-3">/g, '<p className="text-[#141b2c] text-[14.5px] leading-relaxed mb-3">');

// Route box: bg-[#2a2a2a] ... border-white/5 -> bg-[#f1f3ff] ... border-[#dbe2f9]
content = content.replace(
  /bg-\[#2a2a2a\] rounded-\[12px\] p-3 border border-white\/5/g,
  'bg-[#f1f3ff] rounded-[12px] p-3 border border-[#dbe2f9]'
);
// Route text: text-gray-300 -> text-[#3e4942]
content = content.replace(/text-gray-300/g, "text-[#3e4942]");
// Route dots: border-[#2ee6c2] -> border-[#00875a], bg-[#2ee6c2] -> bg-[#00875a]
// They are already changed by the previous global replacement of #2ee6c2.

fs.writeFileSync('src/components/user/Profile.tsx', content);
