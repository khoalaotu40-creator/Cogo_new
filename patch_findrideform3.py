import re

with open('src/components/FindRideForm.tsx', 'r') as f:
    content = f.read()

# Add vehicleType state
if "const [vehicleType, setVehicleType]" not in content:
    content = content.replace(
        "const [seats, setSeats] = useState(1);",
        "const [seats, setSeats] = useState(1);\n  const [vehicleType, setVehicleType] = useState<'motorbike' | 'car'>('motorbike');"
    )

# Add renderVehicleSelection function
render_vehicle_func = """
  const renderVehicleSelection = () => {
    return (
      <div className="mt-8">
        <h2 className="text-[18px] font-bold text-gray-900 mb-1">Phương tiện</h2>
        <p className="text-[14px] text-gray-500 mb-4">Bạn muốn di chuyển bằng phương tiện gì?</p>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setVehicleType('motorbike')}
            className={`flex flex-col items-center justify-center py-6 rounded-[16px] border transition-colors ${vehicleType === 'motorbike' ? 'bg-[#b6e8d1] border-[#008f55]' : 'bg-white border-gray-200'}`}
          >
            <Bike className={`w-8 h-8 mb-2 ${vehicleType === 'motorbike' ? 'text-[#005e38]' : 'text-gray-700'}`} />
            <span className={`text-[15px] font-semibold ${vehicleType === 'motorbike' ? 'text-[#005e38]' : 'text-gray-900'}`}>Xe máy</span>
          </button>
          <button 
            onClick={() => setVehicleType('car')}
            className={`flex flex-col items-center justify-center py-6 rounded-[16px] border transition-colors ${vehicleType === 'car' ? 'bg-[#b6e8d1] border-[#008f55]' : 'bg-white border-gray-200'}`}
          >
            <Car className={`w-8 h-8 mb-2 ${vehicleType === 'car' ? 'text-[#005e38]' : 'text-gray-700'}`} />
            <span className={`text-[15px] font-semibold ${vehicleType === 'car' ? 'text-[#005e38]' : 'text-gray-900'}`}>Ô tô</span>
          </button>
        </div>
      </div>
    );
  };
"""

if "const renderVehicleSelection = () => {" not in content:
    content = content.replace(
        "const renderStep3 = () => (",
        render_vehicle_func + "\n  const renderStep3 = () => ("
    )

# Insert renderVehicleSelection in step 3
if "{renderVehicleSelection()}" not in content:
    content = content.replace(
        "{renderSeatSelection()}\n        </div>",
        "{renderSeatSelection()}\n          {renderVehicleSelection()}\n        </div>"
    )

# update handleCreateRide logic
content = content.replace(
    "const content = `Tìm người đi chung lúc ${time}, ${date}. Lặp lại: ${repeat}. Cần ${seats} chỗ.`;",
    "const content = `Tìm người đi chung lúc ${time}, ${date}. Lặp lại: ${repeat}. Cần ${seats} chỗ. Bằng ${vehicleType === 'motorbike' ? 'xe máy' : 'ô tô'}.`;"
)

content = content.replace(
    "await api.rides.create(userId, pickupLocation!, dropoffLocation!, 'đặt lịch');",
    "await api.rides.create(userId, pickupLocation!, dropoffLocation!, `đặt lịch - ${vehicleType === 'motorbike' ? 'xe máy' : 'ô tô'}`);"
)

content = content.replace(
    "const response = await api.rides.create(userId, pickupLocation!, dropoffLocation!, 'đi ngay');",
    "const response = await api.rides.create(userId, pickupLocation!, dropoffLocation!, `đi ngay - ${vehicleType === 'motorbike' ? 'xe máy' : 'ô tô'}`);"
)

with open('src/components/FindRideForm.tsx', 'w') as f:
    f.write(content)

