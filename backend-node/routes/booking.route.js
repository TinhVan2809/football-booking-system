const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // Import nodemailer

// Middleware xác thực đơn giản (hoặc import auth middleware từ server.js nếu đã tách file)
const verifyToken = (req, res, next) => {
  console.log("--- DEBUG AUTH ---");
  console.log("Origin:", req.headers.origin);
  console.log("Cookies nhận được:", req.cookies);

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });
    req.user = decoded;
    next();
  });
};

// API Tạo Booking
router.post("/create", verifyToken, async (req, res) => {
  console.log("Nhận request booking:", req.body); // Log kiểm tra dữ liệu đầu vào

  const {
    field_field_type_id,
    booking_date,
    start_time,
    end_time,
    price_per_hour,
    duration_minutes,
    total_price,
    booking_services, // Nhận thêm mảng dịch vụ
  } = req.body;
  const user_id = req.user.user_id;

  if (!field_field_type_id || !booking_date || !start_time || !end_time) {
    return res.status(400).json({ message: "Thiếu thông tin đặt sân" });
  }

  try {
    // 1. Kiểm tra xem khung giờ đó đã có ai đặt chưa (trạng thái != cancelled)
    const checkQuery = `
      SELECT booking_id FROM bookings 
      WHERE field_field_type_id = ? 
      AND booking_date = ? 
      AND booking_status != 'cancelled'
      AND (
        (start_time < ? AND end_time > ?) OR -- Booking mới nằm trong booking cũ
        (start_time >= ? AND start_time < ?) OR -- Bắt đầu nằm trong khoảng cũ
        (end_time > ? AND end_time <= ?) -- Kết thúc nằm trong khoảng cũ
      )
    `;

    db.query(
      checkQuery,
      [
        field_field_type_id,
        booking_date,
        end_time,
        start_time, // Logic overlap
        start_time,
        end_time,
        start_time,
        end_time,
      ],
      (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi kiểm tra lịch trùng" });
        }
        if (results.length > 0) {
          return res
            .status(409)
            .json({ message: "Khung giờ này đã có người đặt!" });
        }

        // Tính toán final_price (Giá sân + Giá dịch vụ)
        let serviceTotal = 0;
        if (booking_services && Array.isArray(booking_services)) {
          serviceTotal = booking_services.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        const final_price = Number(total_price) + serviceTotal;

        // 2. Nếu không trùng, tiến hành insert Booking
        const insertBookingQuery = `
            INSERT INTO bookings 
            (field_field_type_id, booking_date, start_time, end_time, user_id, duration_minutes, price_per_hour, total_price, final_price, booking_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending') 
        `;

        db.query(
          insertBookingQuery,
          [
            field_field_type_id,
            booking_date,
            start_time,
            end_time,
            user_id,
            duration_minutes,
            price_per_hour,
            total_price,
            final_price, // Lưu giá cuối cùng
          ],
          (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Lỗi tạo booking" });
            }
            const newBookingId = result.insertId;

            // 2.1 Insert Booking Services (Nếu có)
            if (booking_services && Array.isArray(booking_services) && booking_services.length > 0) {
              const serviceValues = booking_services.map(s => [
                newBookingId,
                s.branch_service_id, // ID từ bảng branch_services
                s.quantity,
                s.price * s.quantity, // total_price của service đó
                s.price
              ]);
              
              const insertServicesQuery = `INSERT INTO booking_services (booking_id, branch_service_id, quantity, total_price, unit_price) VALUES ?`;
              db.query(insertServicesQuery, [serviceValues], (err) => {
                 if(err) console.error("Lỗi insert services:", err);
              });
            }

            // 3. Tạo record Payment (Unpaid)
            const insertPaymentQuery = `
                INSERT INTO payments (booking_id, amount, payment_method, payment_status, user_id, note)
                VALUES (?, ?, 'cash', 'unpaid', ?, 'Chờ thanh toán')
            `;
            db.query(insertPaymentQuery, [newBookingId, final_price, user_id]); // Payment theo final_price

            // 4. Tạo Notification
            const notiContent = `Bạn đã đặt sân thành công (ID: ${newBookingId}) vào ngày ${booking_date} lúc ${start_time}`;
            const insertNotiQuery = `INSERT INTO notifications (user_id, content) VALUES (?, ?)`;
            db.query(insertNotiQuery, [user_id, notiContent]);

            // --- 5. GỬI EMAIL XÁC NHẬN ---
            // Lấy thông tin chi tiết sân và chi nhánh để gửi mail
            const detailQuery = `
                SELECT f.field_name, ft.type_name, b.branch_name, b.address
                FROM field_field_types fft
                JOIN fields f ON fft.field_id = f.field_id
                JOIN field_types ft ON fft.field_type_id = ft.field_type_id
                JOIN branches b ON f.branch_id = b.branch_id
                WHERE fft.field_field_type_id = ?
            `;

            db.query(detailQuery, [field_field_type_id], async (err, detailRows) => {
                if (!err && detailRows.length > 0) {
                    const info = detailRows[0];
                    
                    // Cấu hình transporter
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        },
                    });

                    // Tạo danh sách dịch vụ HTML
                    let servicesHtml = "";
                    if (booking_services && booking_services.length > 0) {
                        servicesHtml = `<h3>Dịch vụ đi kèm:</h3><ul>` + 
                        booking_services.map(s => `<li>${s.service_name}: ${s.quantity} x ${new Intl.NumberFormat('vi-VN').format(s.price)} đ</li>`).join('') + 
                        `</ul>`;
                    }

                    // Nội dung email
                    const mailOptions = {
                        from: `"Football Booking System" <${process.env.EMAIL_USER}>`,
                        to: req.user.username,
                        subject: `Xác nhận đặt sân thành công #${newBookingId}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                                <h2 style="color: #166534; text-align: center;">Đặt Sân Thành Công!</h2>
                                <p>Xin chào <strong>${req.user.full_name || 'Quý khách'}</strong>,</p>
                                <p>Cảm ơn bạn đã sử dụng dịch vụ. Dưới đây là thông tin đặt sân của bạn:</p>
                                
                                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Mã đặt sân:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">#${newBookingId}</td></tr>
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Sân:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${info.field_name} - ${info.type_name}</td></tr>
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Chi nhánh:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${info.branch_name}</td></tr>
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Địa chỉ:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${info.address}</td></tr>
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Thời gian:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${start_time} - ${end_time}, ngày ${booking_date}</td></tr>
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tổng tiền:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd; color: #d32f2f; font-weight: bold;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(final_price)}</td></tr>
                                </table>

                                ${servicesHtml}

                                <p style="margin-top: 20px; text-align: center; color: #757575;">Vui lòng đến đúng giờ. Chúc bạn có trận đấu vui vẻ!</p>
                            </div>
                        `,
                    };

                    // Gửi mail (Không await để tránh block response)
                    transporter.sendMail(mailOptions).catch(err => console.error("Lỗi gửi mail:", err));
                }
            });

            // 5. Gửi Socket IO thông báo realtime
            // Gửi cho tất cả client để cập nhật lại giao diện (nếu đang xem cùng sân)
            req.io.emit("new_booking", {
              field_field_type_id,
              booking_date,
              start_time,
              end_time,
              message: "Vừa có khách đặt sân!",
            });

            return res.status(201).json({
              success: true,
              message: "Đặt sân thành công!",
              booking_id: newBookingId,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
