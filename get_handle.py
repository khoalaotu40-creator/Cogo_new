with open('src/components/FindRideForm.tsx', 'r') as f:
    content = f.read()

import re
match = re.search(r'const handleCreateRide = async \(\) => \{.*?\n  \};', content, re.DOTALL)
if match:
    print(match.group(0))
