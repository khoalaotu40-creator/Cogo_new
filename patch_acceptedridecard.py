import re

with open('src/components/driver/AcceptedRideCard.tsx', 'r') as f:
    content = f.read()

# Update props
if "onPickupRide: () => void;" not in content:
    content = content.replace("onCompleteRide: () => void;", "onCompleteRide: () => void;\n  onPickupRide: () => void;")
    content = content.replace("}: AcceptedRideCardProps)", ", onPickupRide }: AcceptedRideCardProps)")

# Update button logic
old_btn = """<button 
        onClick={onCompleteRide}
        className="w-full bg-[#00A550] text-white font-bold py-3.5 rounded-xl text-[15px] hover:bg-[#008A43] shadow-[0_4px_12px_rgba(0,165,80,0.25)] transition-all active:scale-[0.98]"
      >
        Hoàn thành cuốc
      </button>"""

new_btn = """{acceptedRideData.status === 'Arriving' ? (
        <button 
          onClick={onPickupRide}
          className="w-full bg-[#00A550] text-white font-bold py-3.5 rounded-xl text-[15px] hover:bg-[#008A43] shadow-[0_4px_12px_rgba(0,165,80,0.25)] transition-all active:scale-[0.98]"
        >
          Đón người dùng thành công
        </button>
      ) : (
        <button 
          onClick={onCompleteRide}
          className="w-full bg-[#E43C32] text-white font-bold py-3.5 rounded-xl text-[15px] hover:bg-red-700 shadow-[0_4px_12px_rgba(228,60,50,0.25)] transition-all active:scale-[0.98]"
        >
          Hoàn thành cuốc
        </button>
      )}"""

content = content.replace(old_btn, new_btn)

# Update heading text
old_heading = """<span className="font-bold text-[16px]">Đang đón khách</span>"""
new_heading = """<span className="font-bold text-[16px]">{acceptedRideData.status === 'Arriving' ? 'Đang đón khách' : 'Đang chở khách'}</span>"""
content = content.replace(old_heading, new_heading)

with open('src/components/driver/AcceptedRideCard.tsx', 'w') as f:
    f.write(content)

