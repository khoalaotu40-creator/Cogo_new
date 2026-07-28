# Cogo - Ứng dụng ghép xe tiện lợi

Cogo là một ứng dụng web Full-stack giúp người dùng tìm kiếm và đặt các chuyến xe ghép một cách nhanh chóng, trực quan và tiện lợi.

## Tính năng nổi bật
- **Xác thực người dùng:** Đăng nhập thông qua số điện thoại.
- **Bản đồ và Định tuyến (Routing):** Tích hợp bản đồ trực quan với Leaflet và tính toán lộ trình chi tiết (hiển thị khoảng cách, thời gian dự kiến) thông qua OSRM (Open Source Routing Machine).
- **Tìm kiếm địa điểm (Geocoding):** Hỗ trợ tìm kiếm điểm đón và điểm đến nhanh chóng, kết hợp gợi ý từ OpenStreetMap (Nominatim).
- **Quản lý chuyến đi:** Người dùng có thể tạo yêu cầu chuyến đi và theo dõi danh sách các chuyến đi sắp tới của mình (lưu trữ trên cơ sở dữ liệu PostgreSQL).
- **Thiết kế Responsive (Mobile-first):** Giao diện được tối ưu hóa cho trải nghiệm trên thiết bị di động, sử dụng Tailwind CSS.

## Công nghệ sử dụng
- **Frontend:** React (Vite), Tailwind CSS, Lucide React, React-Leaflet
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (sử dụng thư viện `pg`)
- **Map & API:** Leaflet, OpenStreetMap (Nominatim API), OSRM API

## Hướng dẫn cài đặt và chạy (Development)

### Yêu cầu hệ thống
- Node.js (phiên bản 18+ khuyến nghị)
- Cơ sở dữ liệu PostgreSQL đã được cài đặt và đang chạy.

### Các bước cài đặt
1. **Clone repository (nếu có):**
2. **Cài đặt thư viện (Dependencies):**
   ```bash
   npm install
   ```
3. **Cấu hình môi trường:**
   Tạo file `.env` ở thư mục gốc và thêm chuỗi kết nối database của bạn:
   ```env
   DATABASE_URL="postgres://user:password@localhost:5432/dbname"
   ```
4. **Khởi chạy ứng dụng:**
   ```bash
   npm run dev
   ```
   *Lưu ý: Script `dev` sẽ tự động tạo các bảng (`users`, `vehicles`, `rides`) trong CSDL nếu chưa tồn tại.*
5. Mở trình duyệt và truy cập `http://localhost:3000`.

## Cấu trúc CSDL (Database Schema)
- **`users`**: Lưu thông tin người dùng (id, số điện thoại, vị trí hiện tại `location`).
- **`vehicles`**: Lưu thông tin xe (id, vị trí hiện tại, danh sách khách hàng).
- **`rides`**: Lưu lịch sử đặt chuyến (mã chuyến, mã người dùng, mã xe).
