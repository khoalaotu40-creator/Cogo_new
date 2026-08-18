const fs = require('fs');
let content = fs.readFileSync('src/components/ride/Feed.tsx', 'utf8');

// The route box that we want to hide when the map is present:
// We need to hide the Route Box. Since we added the background map, we don't need the dark translucent box anymore.
// The route box code starts with className="bg-[#1c1c1c]/90 backdrop-blur-md...

content = content.replace(
  /<div\s*className="bg-\[#1c1c1c\]\/90 backdrop-blur-md rounded-\[12px\] p-3 w-full max-w-\[280px\] border border-white\/5"\s*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
  ""
);

fs.writeFileSync('src/components/ride/Feed.tsx', content);
