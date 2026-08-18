const fs = require('fs');
let content = fs.readFileSync('src/components/ride/Feed.tsx', 'utf8');

// I need to properly remove the rest of the route box HTML that got mangled in the previous replace.
// Looking at the output, the ending tags are still there along with the destination point div.

content = content.replace(
  /<div className="flex gap-3 relative">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
  ""
);

content = content.replace(
  /\{\/\* Route Box \*\/\}/,
  ""
);

fs.writeFileSync('src/components/ride/Feed.tsx', content);
