import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add a car icon to go to driver mode in the header if not exists
if "navigateTo('driver-home')" not in content.split("renderHomeContent")[1]:
    content = content.replace(
        '<MessageCircle className="w-[22px] h-[22px] stroke-[2]" />',
        '<MessageCircle className="w-[22px] h-[22px] stroke-[2]" />'
    )
    # Actually let's change the MessageCircle button to a steering wheel or car to switch to driver mode, or just add a new button.
    # We will replace MessageCircle button with a Driver mode button
    
    old_btn = '''<button className="text-[#008f55] hover:opacity-80 transition-opacity relative">
            <MessageCircle className="w-[22px] h-[22px] stroke-[2]" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">2</span>
          </button>'''
          
    new_btn = '''<button onClick={() => {
            const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');
            if (user.driver_id) {
              navigateTo('driver-home');
            } else {
              alert('Bạn cần đăng ký làm tài xế trước (trong mục Cài đặt)');
            }
          }} className="text-[#008f55] hover:opacity-80 transition-opacity relative">
            <Car className="w-[22px] h-[22px] stroke-[2]" />
          </button>'''
          
    content = content.replace(old_btn, new_btn)

with open('src/App.tsx', 'w') as f:
    f.write(content)
