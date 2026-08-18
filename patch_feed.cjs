const fs = require('fs');
let content = fs.readFileSync('src/components/ride/Feed.tsx', 'utf8');

// 1. Add state for expanded posts
content = content.replace(
  /const \[joinStatus, setJoinStatus\] = useState<Record<number, string>>\(\{\}\);/,
  \`const [joinStatus, setJoinStatus] = useState<Record<number, string>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({});\`
);

// 2. Replace the text div to include read more/less functionality
content = content.replace(
  /<div className="text-\[14\.5px\] leading-\[1\.4\] text-white\/90 mb-4 line-clamp-3">\s*\{post\.content\}\s*<\/div>/g,
  \`<div className="mb-4">
                    <div className={\\\`text-[14.5px] leading-[1.4] text-white/90 transition-all duration-300 \\\${expandedPosts[post.id] ? '' : 'line-clamp-2'}\\\`}>
                      {post.content}
                    </div>
                    {post.content && post.content.length > 80 && (
                      <button 
                        onClick={() => setExpandedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="text-white/60 text-[13px] font-medium mt-1 hover:text-white transition-colors"
                      >
                        {expandedPosts[post.id] ? 'Thu gọn' : 'Xem thêm'}
                      </button>
                    )}
                  </div>\`
);

fs.writeFileSync('src/components/ride/Feed.tsx', content);
