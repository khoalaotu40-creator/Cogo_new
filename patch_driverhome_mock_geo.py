import re

with open('src/components/driver/DriverHome.tsx', 'r') as f:
    content = f.read()

new_geo_error = """          (error) => {
            console.error("Lỗi lấy vị trí:", error);
            const fallbackLat = 10.8700;
            const fallbackLng = 106.8000;
            const fallbackAddress = "Dĩ An, Bình Dương (Giả lập)";
            
            setLocationText(fallbackAddress);
            updateVehicleStatus({
              latitude: fallbackLat,
              longitude: fallbackLng,
              address: fallbackAddress,
              isOnline: true
            });
            setIsLocating(false);
            setIsOnline(true);
            setConnectionError("Dùng vị trí giả lập do không lấy được vị trí thực tế.");
            setTimeout(() => setConnectionError(null), 3000);
          },"""

content = re.sub(
    r'          \(error\) => \{\n            console\.error\("Lỗi lấy vị trí:", error\);\n            setLocationText\("Không thể lấy vị trí hiện tại"\);\n            setIsLocating\(false\);\n            setConnectionError\("Lấy vị trí thất bại\. Bật kết nối không thành công\."\);\n            setTimeout\(\(\) => setConnectionError\(null\), 3000\);\n          \},',
    new_geo_error,
    content,
    flags=re.DOTALL
)

new_geo_not_supported = """      } else {
        const fallbackLat = 10.8700;
        const fallbackLng = 106.8000;
        const fallbackAddress = "Dĩ An, Bình Dương (Giả lập)";
        
        setLocationText(fallbackAddress);
        updateVehicleStatus({
          latitude: fallbackLat,
          longitude: fallbackLng,
          address: fallbackAddress,
          isOnline: true
        });
        setIsLocating(false);
        setIsOnline(true);
        setConnectionError("Trình duyệt không hỗ trợ. Dùng vị trí giả lập.");
        setTimeout(() => setConnectionError(null), 3000);
      }"""

content = re.sub(
    r'      \} else \{\n        setLocationText\("Trình duyệt không hỗ trợ định vị"\);\n        setIsLocating\(false\);\n        setConnectionError\("Trình duyệt không hỗ trợ định vị\. Bật kết nối không thành công\."\);\n        setTimeout\(\(\) => setConnectionError\(null\), 3000\);\n      \}',
    new_geo_not_supported,
    content,
    flags=re.DOTALL
)

with open('src/components/driver/DriverHome.tsx', 'w') as f:
    f.write(content)

