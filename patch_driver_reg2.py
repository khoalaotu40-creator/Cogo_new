import re

with open('src/components/driver/DriverRegistration.tsx', 'r') as f:
    content = f.read()

old_logic = """      } catch (error) {
        console.error('Error registering driver:', error);
        showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
      }"""

new_logic = """      } catch (error: any) {
        console.error('Error registering driver:', error);
        showToast(`Có lỗi xảy ra: ${error.message || 'vui lòng thử lại'}`, 'error');
      }"""

content = content.replace(old_logic, new_logic)

with open('src/components/driver/DriverRegistration.tsx', 'w') as f:
    f.write(content)
