const fs = require('fs');
let content = fs.readFileSync('src/components/ride/Feed.tsx', 'utf8');

// There's a missing closing div for the Left Side Info container
content = content.replace(
  "{/* Right Side: Actions */}",
  "</div>\n                {/* Right Side: Actions */}"
);

fs.writeFileSync('src/components/ride/Feed.tsx', content);
