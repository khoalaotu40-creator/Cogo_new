const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/\{\/\* Floating Action Icons \*\/\}[^]+?<\/div>/, '');
fs.writeFileSync('src/App.tsx', content);
