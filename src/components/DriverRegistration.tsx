import { useState } from 'react';
import { ArrowLeft, Upload, ScanFace, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

interface DriverRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function DriverRegistration({ onBack, onSuccess }: DriverRegistrationProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleNextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const userStr = localStorage.getItem('cogo_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const userId = user.id || user.id_user;
          const randomDriverId = userId; // Use id_user from users table
          
          const updatedUser = await api.users.update(userId.toString(), {
            driver_id: randomDriverId
          });
          
          localStorage.setItem('cogo_user', JSON.stringify({ ...user, driver_id: randomDriverId }));
          showToast('Đăng ký lái xe thành công!', 'success');
        }
        setTimeout(() => {
            onSuccess();
        }, 1500); // delay success callback to allow user to see toast
      } catch (error) {
        console.error('Error registering driver:', error);
        showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full relative">
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-[16px] shadow-lg border ${toast.type === 'success' ? 'bg-[#e6f4ed] border-[#bfe6d3] text-[#006b3f]' : 'bg-[#fef2f2] border-[#fecaca] text-[#dc2626]'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium text-[14px]">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="flex items-center px-4 py-4 sticky top-0 bg-white z-20">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#006b3f]" />
        </button>
        <div className="flex-1 text-center font-bold text-[20px] text-[#006b3f] mr-6">
          Đăng ký lái xe
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center pt-8">
        {step === 1 && (
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-[#e6f4ed] rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#006b3f]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#1a2b4b] mb-3 self-start">Xác thực CCCD</h2>
            <p className="text-[15px] text-gray-500 mb-8 self-start">
              Tải ảnh mặt trước CCCD để hệ thống trích xuất thông tin (OCR mô phỏng cho bản demo).
            </p>

            <button 
              onClick={handleNextStep}
              className="w-full aspect-[2/1] border-2 border-dashed border-gray-300 rounded-[24px] flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-600 mb-3" />
              <span className="text-gray-600 font-medium text-[15px]">Ảnh mặt trước CCCD</span>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-[#e6f4ed] rounded-full flex items-center justify-center mb-6">
              <ScanFace className="w-8 h-8 text-[#006b3f]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#1a2b4b] mb-3 self-start">Xác thực khuôn mặt</h2>
            <p className="text-[15px] text-gray-500 mb-8 self-start">
              Chụp một ảnh selfie để đối chiếu với giấy tờ (liveness check mô phỏng).
            </p>

            <button 
              onClick={handleNextStep}
              className="w-full aspect-[2/1] border-2 border-dashed border-gray-300 rounded-[24px] flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-600 mb-3" />
              <span className="text-gray-600 font-medium text-[15px]">Chụp ảnh selfie</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-sm flex flex-col items-start">
            <h2 className="text-[22px] font-bold text-[#1a2b4b] mb-4">Thỏa thuận & Điều khoản</h2>
            <div className="bg-gray-50 p-4 rounded-[16px] text-[14px] text-gray-600 mb-8 h-64 overflow-y-auto border border-gray-100 w-full text-left">
              <p className="mb-2 font-semibold">1. Trách nhiệm của tài xế</p>
              <p className="mb-4">Tài xế phải đảm bảo an toàn, tuân thủ luật lệ giao thông và các quy định của Cogo.</p>
              <p className="mb-2 font-semibold">2. Phí dịch vụ</p>
              <p className="mb-4">Cogo sẽ thu một khoản phí dịch vụ dựa trên mỗi chuyến đi thành công.</p>
              <p className="mb-2 font-semibold">3. Hủy chuyến</p>
              <p>Việc hủy chuyến không đúng quy định có thể dẫn đến việc khóa tài khoản.</p>
            </div>

            <button 
              onClick={handleNextStep}
              disabled={loading}
              className="w-full py-4 bg-[#006b3f] text-white rounded-[16px] font-bold text-[16px] shadow-sm hover:bg-[#005a35] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đồng ý & Đăng ký'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
