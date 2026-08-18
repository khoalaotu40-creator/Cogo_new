const fs = require('fs');
let content = fs.readFileSync('src/components/user/Profile.tsx', 'utf8');
content = content.replace(/import \{ Camera, /, 'import { Camera, Car, ');
fs.writeFileSync('src/components/user/Profile.tsx', content);
