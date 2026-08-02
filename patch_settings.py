with open('src/components/Settings.tsx', 'r') as f:
    content = f.read()

if "onSwitchToDriverMode?: () => void;" not in content:
    content = content.replace("onRegisterDriver: () => void;", "onRegisterDriver: () => void;\n  onSwitchToDriverMode?: () => void;")
    content = content.replace("onRegisterDriver }: SettingsProps", "onRegisterDriver, onSwitchToDriverMode }: SettingsProps")
    
    # modify handleSwitchToDriverMode
    content = content.replace("showToast(\"Đã chuyển sang chế độ lái xe\", 'success');", "if(onSwitchToDriverMode) onSwitchToDriverMode();\n      showToast(\"Đã chuyển sang chế độ lái xe\", 'success');")

with open('src/components/Settings.tsx', 'w') as f:
    f.write(content)
