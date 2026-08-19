const fs = require('fs');

let content = fs.readFileSync('src/components/ride/PostBackgroundMap.tsx', 'utf8');

// Enable zoom controls and map interaction
content = content.replace(
  /zoomControl=\{false\}\n\s*dragging=\{false\}\n\s*scrollWheelZoom=\{false\}\n\s*doubleClickZoom=\{false\}\n\s*touchZoom=\{false\}/,
  'zoomControl={false}\n      dragging={true}\n      scrollWheelZoom={true}\n      doubleClickZoom={true}\n      touchZoom={true}'
);

fs.writeFileSync('src/components/ride/PostBackgroundMap.tsx', content);

let feedContent = fs.readFileSync('src/components/ride/Feed.tsx', 'utf8');

// Allow pointer events on the map wrapper in Feed.tsx
// It was: <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
feedContent = feedContent.replace(
  /className="absolute inset-0 z-0 pointer-events-none opacity-60"/,
  'className="absolute inset-0 z-0 opacity-60 pointer-events-auto"'
);

// We should also remove pointer-events-none from the gradient overlay if it has it,
// actually the gradient overlay is z-10 and pointer-events-none by default. Let's make sure it doesn't block interactions.
feedContent = feedContent.replace(
  /<div className="absolute inset-0 bg-gradient-to-b from-transparent via-\[#121212\]\/50 to-\[#121212\] z-10" \/>/,
  '<div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/50 to-[#121212] z-10 pointer-events-none" />'
);


fs.writeFileSync('src/components/ride/Feed.tsx', feedContent);
