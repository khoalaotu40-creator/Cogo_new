with open('src/components/DriverRegistration.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const randomDriverId = Math.floor(100000 + Math.random() * 900000); // 6-digit driver id",
    "const randomDriverId = userId; // Use id_user from users table"
)

with open('src/components/DriverRegistration.tsx', 'w') as f:
    f.write(content)
