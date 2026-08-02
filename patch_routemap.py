import re

with open('src/components/RouteMap.tsx', 'r') as f:
    content = f.read()

# Add Lucide icon
if "Zap," not in content:
    content = content.replace("import { ArrowLeft,", "import { ArrowLeft, Zap,")

loading_ui = '''
        {isConfirming ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-[#008f55] rounded-full opacity-20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute inset-2 bg-[#008f55] rounded-full opacity-40 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
              <div className="absolute inset-4 bg-[#008f55] rounded-full opacity-60 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }}></div>
              <div className="absolute inset-6 bg-[#008f55] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,143,85,0.5)] z-10">
                <Car className="w-7 h-7 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Đang tìm tài xế...</h2>
            <p className="text-[13px] text-gray-500 text-center max-w-[250px]">
              Vui lòng đợi trong giây lát, hệ thống đang kết nối bạn với tài xế phù hợp gần nhất.
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
'''

content = content.replace(
    '<div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>',
    loading_ui
)

content = content.replace(
    "        {mode === 'create' && (",
    "        </>\n        )}\n        {mode === 'create' && !isConfirming && ("
)

with open('src/components/RouteMap.tsx', 'w') as f:
    f.write(content)

