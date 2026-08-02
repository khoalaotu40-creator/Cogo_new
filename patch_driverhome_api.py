with open('src/components/driver/DriverHome.tsx', 'r') as f:
    content = f.read()

content = content.replace("if (data.status === 'ok') {\n        setRides(data.data);\n      }", "if (Array.isArray(data)) {\n        setRides(data);\n      } else if (data.status === 'ok') {\n        setRides(data.data);\n      }")

with open('src/components/driver/DriverHome.tsx', 'w') as f:
    f.write(content)
