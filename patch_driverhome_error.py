import re

with open('src/components/driver/DriverHome.tsx', 'r') as f:
    content = f.read()

# Add state
if "const [connectionError, setConnectionError] = useState<string | null>(null);" not in content:
    content = content.replace(
        "const [locationText, setLocationText] = useState(\"\");",
        "const [locationText, setLocationText] = useState(\"\");\n  const [connectionError, setConnectionError] = useState<string | null>(null);"
    )

# Replace handleToggleConnect
new_handle = """  const handleToggleConnect = () => {
    setConnectionError(null);
    if (!isOnline && vehicles.length === 0) {
      setConnectionError("Bạn cần đăng ký phương tiện trước khi bật kết nối!");
      setTimeout(() => setConnectionError(null), 3000);
      return;
    }
    
    if (isOnline) {"""

content = re.sub(
    r'  const handleToggleConnect = \(\) => \{\n    if \(!isOnline && vehicles\.length === 0\) \{\n      alert\("Bạn cần đăng ký phương tiện trước khi bật kết nối!"\);\n      return;\n    \}\n    \n    if \(isOnline\) \{',
    new_handle,
    content,
    flags=re.DOTALL
)

# Render toast
toast_ui = """
        {/* Connection Error Toast */}
        {connectionError && (
          <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-lg z-[1000] flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium">{connectionError}</span>
            </div>
            <button onClick={() => setConnectionError(null)} className="text-red-500 hover:text-red-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}
"""

if "Connection Error Toast" not in content:
    content = content.replace(
        "{/* Scrollable Content Area */}",
        toast_ui + "\n        {/* Scrollable Content Area */}"
    )

with open('src/components/driver/DriverHome.tsx', 'w') as f:
    f.write(content)

