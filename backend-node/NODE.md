### Khởi động server
```
cd backend-node
node server.js
```

### Cấu hình .env 
1. **Truy cập https://myaccount.google.com/**
2. **Tab bảo mật và đăng nhập => bật xác minh 2 bước**
3. **Quay lại, chọn tạo mật khẩu và ứng dụng**
4. **Nhập tên ứng dụng (bất kỳ, dễ nhớ)**
5. **Copy mật khẩu (16 ký tự)**

```
PORT=8081
JWT_SECRET=e923...7b1
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=football_system

EMAIL_USER=dia_chi_email_cua_ban 
EMAIL_PASS=mat_khau_16_ky_tu 
```
