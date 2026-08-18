const fs = require('fs');
let content = fs.readFileSync('src/components/ride/Feed.tsx', 'utf8');

// Modify the Feed to pass isJoined correctly
content = content.replace(
  /<PostBackgroundMap pickupLocation=\{post\.pickupLocation\} dropoffLocation=\{post\.dropoffLocation\} \/>/,
  `<PostBackgroundMap 
                    pickupLocation={post.pickupLocation} 
                    dropoffLocation={post.dropoffLocation} 
                    isJoined={String(currentUser?.id) === String(post.user?.id) || joinStatus[post.id] === 'accepted' || joinStatus[post.id] === 'joined'} 
                  />`
);

fs.writeFileSync('src/components/ride/Feed.tsx', content);
