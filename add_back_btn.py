with open('src/components/driver/DriverHome.tsx', 'r') as f:
    content = f.read()

# Add ArrowLeft import if missing
if "import { ArrowLeft" not in content:
    content = content.replace("import { Ride, AcceptedRideData }", "import { ArrowLeft } from 'lucide-react';\nimport { Ride, AcceptedRideData }")

# Add back button at the top of MapSection or outside
header = '''
        <div className="absolute top-4 left-4 z-[1000]">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
        </div>
'''

content = content.replace('<MapSection', header + '\n            <MapSection')

with open('src/components/driver/DriverHome.tsx', 'w') as f:
    f.write(content)
