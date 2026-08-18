const fs = require('fs');
let content = fs.readFileSync('src/components/ride/Feed.tsx', 'utf8');
content = content.replace(/scrollbar-hide/g, '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]');
fs.writeFileSync('src/components/ride/Feed.tsx', content);
