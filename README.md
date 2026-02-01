![Static Badge](https://img.shields.io/badge/Booking_system_demo-272727?style=flat)
![NPM Version](https://img.shields.io/npm/v/react)
###
![Static Badge](https://img.shields.io/badge/REACT-blue?style=for-the-badge&logo=react&logoColor=blue&labelColor=black)
![Static Badge](https://img.shields.io/badge/nodejs-5FA04E?style=for-the-badge&logo=nodedotjs&labelColor=gray)

# Football Booking System (Hasebooking)

Hệ thống đặt sân bóng đá trực tuyến hiện đại, kết nối khách hàng với các chủ sân, hỗ trợ quản lý đa chi nhánh và cập nhật trạng thái sân theo thời gian thực.

## Công nghệ sử dụng

- **Frontend**: ReactJS, Tailwind CSS, Vite.
- **Backend Core**: Node.js (Express) xử lý Booking logic, Authentication (JWT), Realtime (Socket.io), Email Service.
- **Backend Management**: PHP (Native API) xử lý CRUD dữ liệu nền tảng (Chi nhánh, Dịch vụ).
- **Database**: MySQL.

## Tính năng nổi bật

- **Đặt sân Realtime**: Trạng thái sân (trống/đã đặt) được cập nhật tức thì qua Socket.io mà không cần tải lại trang.
- **Quản lý giá linh hoạt**: Hỗ trợ thiết lập giá theo khung giờ (Sáng/Tối), ngày thường/cuối tuần hoặc ngày lễ.
- **Dịch vụ đi kèm**: Tích hợp chọn dịch vụ (nước, thuê giày/áo) ngay trong quá trình đặt sân.
- **Hệ thống thông báo**: Gửi Email xác nhận đơn đặt hàng và thông báo trạng thái thanh toán.
- **Phân quyền chặt chẽ**: Admin, Chủ chi nhánh (Branch Owner), Nhân viên và Khách hàng.

## Hướng dẫn cài đặt nhanh

1. **Database**: Import file `database/football_system.sql` vào MySQL.
2. **Backend Node**:
   ```bash
   cd backend-node
   npm install
   # Tạo file .env từ example và cấu hình DB/Email
   node server.js
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
![Static Badge](https://img.shields.io/badge/php-777BB4?style=for-the-badge&logo=php&labelColor=gray)
