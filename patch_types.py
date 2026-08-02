with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace("  vehicle_location: {", "  Diem_don?: any;\n  Diem_den?: any;\n  vehicle_location: {")

with open('src/types.ts', 'w') as f:
    f.write(content)
