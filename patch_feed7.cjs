const fs = require('fs');
let content = fs.readFileSync('src/components/ride/Feed.tsx', 'utf8');

// There's a lingering </div></div> in the middle that needs to go
content = content.replace(
  /<\/div>\s*<\/div>\s*\{\/\* Right Side: Actions \*\/\}/g,
  "{/* Right Side: Actions */}"
);

fs.writeFileSync('src/components/ride/Feed.tsx', content);
