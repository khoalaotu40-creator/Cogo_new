with open('src/components/FindRideForm.tsx', 'r') as f:
    content = f.read()

import re

new_handle = """const handleCreateRide = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('cogo_user') || '{}');
      const userId = user.id || user.id_user;
      if (!userId || isNaN(Number(userId))) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng tải lại trang và đăng nhập lại.');
        localStorage.removeItem('cogo_user');
        window.location.reload();
        return;
      }

      if (rideType === 'schedule') {
        const content = `Tìm người đi chung lúc ${time}, ${date}. Lặp lại: ${repeat}. Cần ${seats} chỗ.`;
        await api.posts.create({
          user_id: userId,
          content: content,
          departure_point: pickupLocation?.name || pickup,
          destination_point: dropoffLocation?.name || dropoff,
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          ride_frequency: repeat,
          privacy: 'public'
        });
        await api.rides.create(userId, pickupLocation!, dropoffLocation!, 'đặt lịch');
        alert('Đã tạo chuyến đi và bài đăng thành công!');
        onSuccess();
      } else {
        const response = await api.rides.create(userId, pickupLocation!, dropoffLocation!, 'đi ngay');
        const rideId = response.ride?.id_ride;
        if (!rideId) {
            alert('Lỗi khởi tạo chuyến đi!');
            return;
        }
        
        // Wait until driver accepts
        let isAccepted = false;
        while (!isAccepted) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const statusRes = await api.rides.getStatus(rideId);
            if (statusRes.id_vehicle !== null) {
                isAccepted = true;
            }
        }
        
        onSuccess();
      }
    } catch (error: any) {
      console.error('Create ride error:', error);
      if (error.message && error.message.includes('401')) {
        alert('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        localStorage.removeItem('cogo_user');
        window.location.reload();
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };"""

content = re.sub(r'const handleCreateRide = async \(\) => \{.*?\n  \};', new_handle, content, flags=re.DOTALL)

with open('src/components/FindRideForm.tsx', 'w') as f:
    f.write(content)
