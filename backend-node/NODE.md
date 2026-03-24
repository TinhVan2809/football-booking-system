### Khởi động server
```
cd backend-node
node server.js
```

### Cấu hình .env 
1. **Đổi tên 'example.env' thành '.env'
2. **Truy cập https://myaccount.google.com/**
3. **Tab bảo mật và đăng nhập => bật xác minh 2 bước**
4. **Quay lại, chọn tạo mật khẩu và ứng dụng**
5. **Nhập tên ứng dụng (bất kỳ, dễ nhớ)**
6. **Copy mật khẩu (16 ký tự)**

### Cấu hình JWT_SECRET
**Mở terminal nhập lệnh:**
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```
PORT=8081
JWT_SECRET=e923...7b1
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=football_system

# Email này sẽ gửi thông báo đến các email khác
EMAIL_USER=dia_chi_email_that_cua_ban 
EMAIL_PASS=mat_khau_16_ky_tu 
```
