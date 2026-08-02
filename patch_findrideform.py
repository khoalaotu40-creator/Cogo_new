with open('src/components/FindRideForm.tsx', 'r') as f:
    content = f.read()

# Add artificial delay
content = content.replace(
    "await api.rides.create(userId, pickupLocation!, dropoffLocation!, 'đi ngay');",
    "await new Promise(resolve => setTimeout(resolve, 2500));\n        await api.rides.create(userId, pickupLocation!, dropoffLocation!, 'đi ngay');"
)

with open('src/components/FindRideForm.tsx', 'w') as f:
    f.write(content)

