import re

with open('src/components/driver/DriverHome.tsx', 'r') as f:
    content = f.read()

# Make sure we can call api.rides.complete. We need to import api from '../../lib/api'
# Let's check if it's already imported.
if "import { api }" not in content and "import { api," not in content and "import api" not in content:
    # Look for imports
    content = content.replace(
        "import { Ride, AcceptedRideData } from '../../types';",
        "import { Ride, AcceptedRideData } from '../../types';\nimport { api } from '../../lib/api';"
    )

new_complete_handler = """  const handleCompleteRide = async () => {
    if (!acceptedRideData) return;
    try {
      await api.rides.complete(acceptedRideData.id_ride);
      setAcceptedRideData(null);
      // Refresh available rides
      fetchAvailableRides();
    } catch (error) {
      console.error("Failed to complete ride:", error);
      alert("Lỗi khi hoàn thành chuyến đi");
    }
  };"""

if "const handleCompleteRide" not in content:
    content = content.replace(
        "  return (",
        new_complete_handler + "\n\n  return ("
    )

content = content.replace(
    "onCompleteRide={() => setAcceptedRideData(null)}",
    "onCompleteRide={handleCompleteRide}"
)

with open('src/components/driver/DriverHome.tsx', 'w') as f:
    f.write(content)

