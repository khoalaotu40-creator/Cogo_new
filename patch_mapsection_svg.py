import re

with open('src/components/driver/MapSection.tsx', 'r') as f:
    content = f.read()

car_svg = """<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00A550" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>"""

user_svg = """<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E43C32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>"""

vehicle_icon = f"""
  const vehicleIcon = L.divIcon({{
    className: 'custom-vehicle-icon',
    html: `
      <div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 3px 8px rgba(0,0,0,0.25); border: 2px solid #00A550; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        {car_svg}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  }});
"""

user_icon = f"""
  const userIcon = L.divIcon({{
    className: 'custom-user-icon',
    html: `
      <div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 3px 8px rgba(0,0,0,0.25); border: 2px solid #E43C32; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        {user_svg}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  }});
"""

content = re.sub(r'  const vehicleIcon = L.divIcon\(.*?\}\);', vehicle_icon.strip(), content, flags=re.DOTALL)
content = re.sub(r'  const userIcon = L.divIcon\(.*?\}\);', user_icon.strip(), content, flags=re.DOTALL)

with open('src/components/driver/MapSection.tsx', 'w') as f:
    f.write(content)

