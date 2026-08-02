with open('server/api/vehicles.ts', 'r') as f:
    content = f.read()

# We still receive `driver_id` from the frontend, but let's change it to `id_user` everywhere.
# Or keep receiving `driver_id` from frontend but insert into `id_user`. Let's just change the column name in queries.

content = content.replace("driver_id =", "id_user =")
content = content.replace("driver_id = $", "id_user = $")
content = content.replace("(driver_id, type_vehicle, name_vehicle)", "(id_user, type_vehicle, name_vehicle)")
content = content.replace("WHERE driver_id =", "WHERE id_user =")
content = content.replace("SELECT id_vehicle FROM vehicles WHERE driver_id =", "SELECT id_vehicle FROM vehicles WHERE id_user =")

with open('server/api/vehicles.ts', 'w') as f:
    f.write(content)
