import re

with open('src/components/driver/DriverHome.tsx', 'r') as f:
    content = f.read()

new_toggle = """  const handleToggleConnect = () => {
    if (!isOnline && vehicles.length === 0) {
      alert("Bạn cần đăng ký phương tiện trước khi bật kết nối!");
      return;
    }
    
    if (isOnline) {"""

content = content.replace("  const handleToggleConnect = () => {\n    if (isOnline) {", new_toggle)

with open('src/components/driver/DriverHome.tsx', 'w') as f:
    f.write(content)

