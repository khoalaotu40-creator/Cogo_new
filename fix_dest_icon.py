import re

with open('src/components/driver/MapSection.tsx', 'r') as f:
    content = f.read()

dest_svg = """<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>"""

dest_icon = f"""
  const destIcon = L.divIcon({{
    className: 'custom-dest-icon',
    html: `
      <div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2.5px solid #3b82f6; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
        {dest_svg}
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  }});
"""

if "const destIcon = L.divIcon" not in content:
    content = content.replace(
        "useEffect(() => {\n    if (acceptedRideData) {",
        dest_icon + "\nuseEffect(() => {\n    if (acceptedRideData) {"
    )

with open('src/components/driver/MapSection.tsx', 'w') as f:
    f.write(content)
