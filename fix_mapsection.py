import re

with open('src/components/driver/MapSection.tsx', 'r') as f:
    content = f.read()

content = content.replace("  return (\n  isOnline,\n  isLocating,\n  locationText,\n  acceptedRideData,\n  onToggleConnect\n}: MapSectionProps) {\n  return (", "  return (")
content = content.replace("  return (  isOnline,  isLocating,  locationText,  acceptedRideData,  onToggleConnect}: MapSectionProps) {  return (", "  return (")

with open('src/components/driver/MapSection.tsx', 'w') as f:
    f.write(content)

