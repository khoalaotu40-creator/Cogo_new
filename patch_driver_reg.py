import re

with open('src/components/driver/DriverRegistration.tsx', 'r') as f:
    content = f.read()

old_logic = """        const userStr = localStorage.getItem('cogo_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const userId = user.id || user.id_user;
          const randomDriverId = userId; // Use id_user from users table
          
          const updatedUser = await api.users.update(userId.toString(), {
            driver_id: randomDriverId
          });
          
          localStorage.setItem('cogo_user', JSON.stringify({ ...user, driver_id: randomDriverId }));
          showToast('Đăng ký lái xe thành công!', 'success');
        }"""

new_logic = """        const userStr = localStorage.getItem('cogo_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const userId = user.id_user || user.id;
          const driverId = user.id_user;
          
          if (!driverId) {
             throw new Error("Missing id_user in user profile. Please login again.");
          }
          
          const updatedUser = await api.users.update(driverId.toString(), {
            driver_id: driverId
          });
          
          localStorage.setItem('cogo_user', JSON.stringify({ ...user, driver_id: driverId, id_user: driverId }));
          showToast('Đăng ký lái xe thành công!', 'success');
        }"""

content = content.replace(old_logic, new_logic)

with open('src/components/driver/DriverRegistration.tsx', 'w') as f:
    f.write(content)
