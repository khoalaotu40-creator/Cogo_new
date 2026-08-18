const fs = require('fs');
let content = fs.readFileSync('src/components/ride/Feed.tsx', 'utf8');

// Import PostBackgroundMap
content = content.replace(
  "import RouteMap from './RouteMap';",
  "import RouteMap from './RouteMap';\nimport PostBackgroundMap from './PostBackgroundMap';"
);

// Replace the image/media/background overlay section
// We want to add the PostBackgroundMap if there is a route
content = content.replace(
  /\{\/\* Optional: Background image\/map blurred if we want it to look like the screenshot \*\/\}\s*\{post\.mediaUrl && \([\s\S]*?<\/div>\s*\)\}/,
  `{post.mediaUrl ? (
                <div className="absolute inset-0 opacity-30">
                  <img src={post.mediaUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              ) : (post.pickupLocation && post.dropoffLocation) ? (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
                  <PostBackgroundMap pickupLocation={post.pickupLocation} dropoffLocation={post.dropoffLocation} />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/50 to-[#121212] z-10" />
                </div>
              ) : null}`
);

// Remove the onClick from the Route Box since the map is already there
content = content.replace(
  /onClick=\{\(\) => \{\s*if \(post\.pickupLocation && post\.dropoffLocation\) \{\s*setViewingRouteForPost\(post\);\s*\}\s*\}\}/,
  ""
);

fs.writeFileSync('src/components/ride/Feed.tsx', content);
