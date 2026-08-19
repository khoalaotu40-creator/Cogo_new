const fs = require('fs');

// We need to add ZoomControl explicitly if we want buttons, but standard scroll/pinch should work. 
// However, the issue with enabling scroll/pinch is that it breaks scrolling the feed (because the map intercepts scroll and touchmove).
// To prevent the map from blocking the Feed scroll while allowing pinch-to-zoom or double-click to zoom, 
// wait, if dragging=true and scrollWheel=true on the entire background, the user won't be able to scroll to the next post easily.
// A common pattern for this is to keep the map non-interactive, but provide an "Expand Map" or "Tap to View Map" button to open the full interactive map.
// Let's implement that since it's much better UX for a TikTok style feed.

let feedContent = fs.readFileSync('src/components/ride/Feed.tsx', 'utf8');

// I will add a floating button on top of the map to "View Map" 
// Or I can just make tapping the map expand it! 
// Let's make the background map wrapper clickable to expand the map.

feedContent = feedContent.replace(
  /<div className="absolute inset-0 z-0 opacity-60 pointer-events-auto">/,
  '<div className="absolute inset-0 z-0 opacity-60 pointer-events-auto cursor-pointer" onClick={() => { if (post.pickupLocation && post.dropoffLocation) setViewingRouteForPost(post); }}>'
);

fs.writeFileSync('src/components/ride/Feed.tsx', feedContent);

// And we revert the map interactivity to false, otherwise it swallows the click event
let mapContent = fs.readFileSync('src/components/ride/PostBackgroundMap.tsx', 'utf8');
mapContent = mapContent.replace(
  /zoomControl=\{false\}\n\s*dragging=\{true\}\n\s*scrollWheelZoom=\{true\}\n\s*doubleClickZoom=\{true\}\n\s*touchZoom=\{true\}/,
  'zoomControl={false}\n      dragging={false}\n      scrollWheelZoom={false}\n      doubleClickZoom={false}\n      touchZoom={false}'
);
fs.writeFileSync('src/components/ride/PostBackgroundMap.tsx', mapContent);

