const fs = require('fs');
let content = fs.readFileSync('src/components/user/Profile.tsx', 'utf8');

// There are a few more texts and borders that might have been missed due to precise regex matches.
// Let's do a wider replace for text-white and text-gray-500, etc.

content = content.replace(/text-white/g, "text-[#141b2c]");
content = content.replace(/text-gray-400/g, "text-[#6e7a71]");
content = content.replace(/text-gray-500/g, "text-[#6e7a71]");

// Ensure icons in top header have right color against white
// Currently they are: bg-white/60 p-2 rounded-full text-[#141b2c]
// So the text-[#141b2c] is correct there.

// We need to fix the outline of the route start point (border-[#2ee6c2] -> border-[#00875a])
content = content.replace(/border-\[#2ee6c2\]/g, "border-[#00875a]");

fs.writeFileSync('src/components/user/Profile.tsx', content);
