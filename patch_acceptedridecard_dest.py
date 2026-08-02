import re

with open('src/components/driver/AcceptedRideCard.tsx', 'r') as f:
    content = f.read()

old_locations = """          <div className="mb-2">
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Vị trí của bạn</div>
            <div className="text-[14px] font-bold text-gray-800 truncate">{acceptedRideData.vehicle_location.address}</div>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Điểm đón</div>
            <div className="text-[14px] font-bold text-gray-800 truncate">{acceptedRideData.user_location.address || "Vị trí khách hàng"}</div>
          </div>"""

new_locations = """          <div className="mb-2">
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
              {acceptedRideData.status === 'Arriving' ? 'Vị trí của bạn' : 'Điểm đón'}
            </div>
            <div className="text-[14px] font-bold text-gray-800 truncate">
              {acceptedRideData.status === 'Arriving' 
                ? acceptedRideData.vehicle_location.address 
                : (acceptedRideData.Diem_don?.address || acceptedRideData.user_location.address)}
            </div>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
              {acceptedRideData.status === 'Arriving' ? 'Điểm đón' : 'Điểm đến'}
            </div>
            <div className="text-[14px] font-bold text-gray-800 truncate">
              {acceptedRideData.status === 'Arriving'
                ? (acceptedRideData.Diem_don?.address || acceptedRideData.user_location.address || "Vị trí khách hàng")
                : (acceptedRideData.Diem_den?.address || "Vị trí điểm đến")}
            </div>
          </div>"""

content = content.replace(old_locations, new_locations)

with open('src/components/driver/AcceptedRideCard.tsx', 'w') as f:
    f.write(content)

