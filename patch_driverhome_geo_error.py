import re

with open('src/components/driver/DriverHome.tsx', 'r') as f:
    content = f.read()

new_geo_error = """          (error) => {
            console.error("Lỗi lấy vị trí:", error);
            setLocationText("Không thể lấy vị trí hiện tại");
            setIsLocating(false);
            setConnectionError("Lấy vị trí thất bại. Bật kết nối không thành công.");
            setTimeout(() => setConnectionError(null), 3000);
          },"""

content = re.sub(
    r'          \(error\) => \{\n            console\.error\("Lỗi lấy vị trí:", error\);\n            setLocationText\("Không thể lấy vị trí hiện tại"\);\n            setIsLocating\(false\);\n            setIsOnline\(true\);\n          \},',
    new_geo_error,
    content,
    flags=re.DOTALL
)

new_geo_not_supported = """      } else {
        setLocationText("Trình duyệt không hỗ trợ định vị");
        setIsLocating(false);
        setConnectionError("Trình duyệt không hỗ trợ định vị. Bật kết nối không thành công.");
        setTimeout(() => setConnectionError(null), 3000);
      }"""

content = re.sub(
    r'      \} else \{\n        setLocationText\("Trình duyệt không hỗ trợ định vị"\);\n        setIsLocating\(false\);\n        setIsOnline\(true\);\n      \}',
    new_geo_not_supported,
    content,
    flags=re.DOTALL
)

with open('src/components/driver/DriverHome.tsx', 'w') as f:
    f.write(content)

