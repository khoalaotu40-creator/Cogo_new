with open('server/api/rides.ts', 'r') as f:
    content = f.read()

content = content.replace("export default router;\n\n// Accept ride API", "// Accept ride API")
content = content.replace("export default router;\n// Accept ride API", "// Accept ride API")
content = content.replace("export default router;", "")

content += "\nexport default router;\n"

content = content.replace(
    "await pool.query('UPDATE rides SET id_vehicle = $1 WHERE id_ride = $2', [actualVehicleId, id_ride]);",
    "await pool.query('UPDATE rides SET id_vehicle = $1, status = $2 WHERE id_ride = $3', [actualVehicleId, 'Arriving', id_ride]);"
)

with open('server/api/rides.ts', 'w') as f:
    f.write(content)

