import { useState } from 'react';
import { ArrowLeft, Car, Camera, Upload, Loader2 } from 'lucide-react';

interface VehicleRegistrationScreenProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export function VehicleRegistrationScreen({ onBack, onSuccess }: VehicleRegistrationScreenProps) {
  const [vehicleType, setVehicleType] = useState<'motorcycle' | 'car'>('motorcycle');
  const [plateNumber, setPlateNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!plateNumber || !brand || !model) {
      alert("Vui lòng điền đủ thông tin xe!");
      return;
    }

    setIsLoading(true);
    
    const name_vehicle = `${brand} ${model} ${color ? color + ' - ' : '- '}${plateNumber}`;
    const type_vehicle = vehicleType === 'motorcycle' ? 'Xe máy' : 'Ô tô';

    try {
      const response = await fetch('/api/vehicles/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          driver_id: JSON.parse(localStorage.getItem('cogo_user') || '{}')?.id_user,
          type_vehicle,
          name_vehicle
        })
      });

      if (!response.ok) {
        let errStr = '';
        try {
          const errData = await response.json();
          errStr = errData.details || errData.message || '';
        } catch(e) {}
        throw new Error(`Failed to register vehicle: ${errStr}`);
      }

      alert("Đăng ký phương tiện thành công!");
      if (onSuccess) {
        onSuccess();
      } else {
        onBack();
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-white w-full flex flex-col absolute inset-0 z-50 h-full">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={onBack} disabled={isLoading} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-[18px] font-bold text-gray-800">Đăng ký phương tiện</h1>
      </div>

      <div className="px-4 py-6 flex flex-col gap-6">
        {/* Vehicle Type Selection */}
        <div>
          <label className="text-[13px] font-bold text-gray-700 mb-3 block">Loại phương tiện</label>
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setVehicleType('motorcycle')}
              className={`border-2 ${vehicleType === 'motorcycle' ? 'border-[#00A550] bg-emerald-50' : 'border-gray-200 hover:border-gray-300'} rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors`}
            >
              <Car className={`w-8 h-8 ${vehicleType === 'motorcycle' ? 'text-[#00A550]' : 'text-gray-400'}`} strokeWidth={1.5} />
              <span className={`font-bold text-[14px] ${vehicleType === 'motorcycle' ? 'text-[#00A550]' : 'text-gray-600'}`}>Xe máy (2 bánh)</span>
            </div>
            <div 
              onClick={() => setVehicleType('car')}
              className={`border-2 ${vehicleType === 'car' ? 'border-[#00A550] bg-emerald-50' : 'border-gray-200 hover:border-gray-300'} rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors`}
            >
              <Car className={`w-8 h-8 ${vehicleType === 'car' ? 'text-[#00A550]' : 'text-gray-400'}`} strokeWidth={1.5} />
              <span className={`font-bold text-[14px] ${vehicleType === 'car' ? 'text-[#00A550]' : 'text-gray-600'}`}>Ô tô (4 bánh)</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-bold text-gray-700 mb-1.5 block">Biển số xe</label>
            <input 
              type="text" 
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="VD: 59A-123.45"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-800 focus:outline-none focus:border-[#00A550] focus:ring-1 focus:ring-[#00A550] transition-all uppercase placeholder:normal-case"
            />
          </div>
          
          <div>
            <label className="text-[13px] font-bold text-gray-700 mb-1.5 block">Hãng xe</label>
            <input 
              type="text" 
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="VD: Honda, Yamaha, Toyota..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-800 focus:outline-none focus:border-[#00A550] focus:ring-1 focus:ring-[#00A550] transition-all"
            />
          </div>

          <div>
            <label className="text-[13px] font-bold text-gray-700 mb-1.5 block">Dòng xe</label>
            <input 
              type="text" 
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="VD: Vision, Vios..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-800 focus:outline-none focus:border-[#00A550] focus:ring-1 focus:ring-[#00A550] transition-all"
            />
          </div>

          <div>
            <label className="text-[13px] font-bold text-gray-700 mb-1.5 block">Màu xe</label>
            <input 
              type="text" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="VD: Trắng, Đỏ..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-800 focus:outline-none focus:border-[#00A550] focus:ring-1 focus:ring-[#00A550] transition-all"
            />
          </div>
        </div>

        {/* Document Upload */}
        <div>
          <label className="text-[13px] font-bold text-gray-700 mb-3 block">Ảnh xe và giấy tờ</label>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <div className="w-28 h-28 shrink-0 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#00A550] hover:bg-emerald-50 transition-colors group">
              <Camera className="w-6 h-6 text-gray-400 group-hover:text-[#00A550]" />
              <span className="text-[11px] font-semibold text-gray-500 group-hover:text-[#00A550] text-center px-2">Chụp ảnh</span>
            </div>
            <div className="w-28 h-28 shrink-0 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#00A550] hover:bg-emerald-50 transition-colors group">
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#00A550]" />
              <span className="text-[11px] font-semibold text-gray-500 group-hover:text-[#00A550] text-center px-2">Tải lên giấy đăng ký</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="mt-auto px-4 py-4 bg-white border-t border-gray-100 pb-8 sm:pb-4">
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-[#00A550] text-white font-bold py-3.5 rounded-xl text-[15px] hover:bg-[#008A43] shadow-[0_4px_12px_rgba(0,165,80,0.25)] transition-all active:scale-[0.98] flex justify-center items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu đăng ký'}
        </button>
      </div>
    </div>
  );
}
