import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
if "import DriverHome from './components/driver/DriverHome';" not in content:
    content = content.replace("import DriverRegistration from './components/DriverRegistration';", "import DriverRegistration from './components/DriverRegistration';\nimport DriverHome from './components/driver/DriverHome';")

# Update settings
if "onSwitchToDriverMode={() => navigateTo('driver-home')}" not in content:
    content = content.replace("onRegisterDriver={() => navigateTo('driver-registration')} />}", "onRegisterDriver={() => navigateTo('driver-registration')} onSwitchToDriverMode={() => navigateTo('driver-home')} />}")

# Add DriverHome route
if "{activeTab === 'driver-home' && <DriverHome onBack={() => setActiveTab('settings')} />}" not in content:
    content = content.replace("{activeTab === 'driver-registration'", "{activeTab === 'driver-home' && <DriverHome onBack={() => setActiveTab('settings')} />}\n        {activeTab === 'driver-registration'")

# Hide bottom nav on driver-home
content = content.replace("&& activeTab !== 'driver-registration' && activeTab !== 'notifications'", "&& activeTab !== 'driver-registration' && activeTab !== 'notifications' && activeTab !== 'driver-home'")

with open('src/App.tsx', 'w') as f:
    f.write(content)
