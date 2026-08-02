import re

with open('src/components/driver/DriverHome.tsx', 'r') as f:
    content = f.read()

# Remove the one inside useEffect
content = re.sub(r'    const handleCompleteRide = async \(\) => \{.*?  \};\n\n  return \(\) => \{', '  return () => {', content, flags=re.DOTALL)

# Add handlePickupRide
pickup_handler = """
  const handlePickupRide = async () => {
    if (!acceptedRideData) return;
    try {
      await api.rides.pickup(acceptedRideData.id_ride);
      setAcceptedRideData({ ...acceptedRideData, status: 'In Progress' });
    } catch (error) {
      console.error("Failed to pickup ride:", error);
      alert("Lỗi khi cập nhật trạng thái đón");
    }
  };
"""

if "handlePickupRide" not in content:
    content = content.replace("const handleCompleteRide = async () => {", pickup_handler + "\n  const handleCompleteRide = async () => {")

content = content.replace(
    "onCompleteRide={handleCompleteRide}",
    "onCompleteRide={handleCompleteRide}\n                  onPickupRide={handlePickupRide}"
)

with open('src/components/driver/DriverHome.tsx', 'w') as f:
    f.write(content)

