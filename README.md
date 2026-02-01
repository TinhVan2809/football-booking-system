![Static Badge](https://img.shields.io/badge/Booking_system_demo-272727?style=flat)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-90%25-green)
![NPM Version](https://img.shields.io/npm/v/react)
###
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Static Badge](https://img.shields.io/badge/REACT-blue?style=for-the-badge&logo=react&logoColor=blue&labelColor=black)
![Static Badge](https://img.shields.io/badge/nodejs-5FA04E?style=for-the-badge&logo=nodedotjs&labelColor=gray)
![Static Badge](https://img.shields.io/badge/php-777BB4?style=for-the-badge&logo=php&labelColor=gray)

# Hasebooking

Hệ thống đặt sân bóng đá trực tuyến hiện đại, kết nối khách hàng với các chủ sân, hỗ trợ quản lý đa chi nhánh và cập nhật trạng thái sân theo thời gian thực.

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Tính năng nổi bật](#tính-năng-nổi-bật)
- [Hướng dẫn cài đặt nhanh](#hướng-dẫn-cài-đặt-nhanh)
- [License](#license)


## Công nghệ sử dụng

- **Frontend**: ReactJS, Tailwind CSS, Vite.
- **Backend Core**: Node.js (Express) xử lý Booking logic, Authentication (JWT), Realtime (Socket.io), Email Service.
- **Backend Management**: PHP (Native API) xử lý CRUD dữ liệu nền tảng (Chi nhánh, Dịch vụ).
- **Database**: MySQL.

## Tính năng nổi bật

- **Đặt sân Realtime**
- **Quản lý giá linh hoạt**
- **Dịch vụ đi kèm**
- **Hệ thống thông báo - email**
- **Phân quyền chặt chẽ**

## Hướng dẫn cài đặt nhanh

1. **Database**: Import file `database/football_system.sql` vào [MYSQL](./database/MYSQL.md). 
2. **Backend** [NodeJS](./backend-node/NODE.md): 
   ```bash
   cd backend-node
   npm install
   # Tạo file .env từ example và cấu hình DB/Email
   node server.js
   ```
3. **Backend** [PhP](./backend-php/PHP.md) Đường dẫn thư mục:
    ```
    C:\xampp\htdocs\football-booking-system>
    ```
4. **Frontend** :
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
## 

Dự án này được phân phối dưới giấy phép [MIT](./LICENSE).
