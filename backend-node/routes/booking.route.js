const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // Import nodemailer
const path = require("path"); // Import path để xử lý đường dẫn file

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
    // 1. Kiểm tra xem khung giờ đó đã có ai đặt chưa (trạng thái != cancelled, completed)
    const checkQuery = `
      SELECT booking_id FROM bookings 
      WHERE field_field_type_id = ? 
      AND booking_date = ? 
      AND booking_status IN ('pending', 'confirmed') -- Đang xác nhận và đã xác nhận
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
          serviceTotal = booking_services.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );
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
            if (
              booking_services &&
              Array.isArray(booking_services) &&
              booking_services.length > 0
            ) {
              const serviceValues = booking_services.map((s) => [
                newBookingId,
                s.branch_service_id, // ID từ bảng branch_services
                s.quantity,
                s.price * s.quantity, // total_price của service đó
                s.price,
              ]);

              const insertServicesQuery = `INSERT INTO booking_services (booking_id, branch_service_id, quantity, total_price, unit_price) VALUES ?`;
              db.query(insertServicesQuery, [serviceValues], (err) => {
                if (err) console.error("Lỗi insert services:", err);
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
                SELECT f.field_name, ft.type_name, b.branch_id, b.branch_name, b.address
                FROM field_field_types fft
                JOIN fields f ON fft.field_id = f.field_id
                JOIN field_types ft ON fft.field_type_id = ft.field_type_id
                JOIN branches b ON f.branch_id = b.branch_id
                WHERE fft.field_field_type_id = ?
            `;

            db.query(
              detailQuery,
              [field_field_type_id],
              async (err, detailRows) => {
                if (!err && detailRows.length > 0) {
                  const info = detailRows[0];

                  // Emit realtime notification to the branch owner room
                  if (info.branch_id) {
                    const branchNotiContent = `Co khach dat ${info.field_name} - ${info.type_name} ngay ${booking_date} luc ${start_time}`;

                    const insertBranchNotiQuery =
                      "INSERT INTO branch_notifications (branch_id, booking_id, content) VALUES (?, ?, ?)";
                    db.query(insertBranchNotiQuery, [
                      info.branch_id,
                      newBookingId,
                      branchNotiContent,
                    ]);

                    req.io.to(`branch_${info.branch_id}`).emit("branch_new_booking", {
                      booking_id: newBookingId,
                      branch_id: info.branch_id,
                      field_field_type_id,
                      field_name: info.field_name,
                      type_name: info.type_name,
                      booking_date,
                      start_time,
                      end_time,
                      final_price,
                      customer_name: req.user?.full_name || req.user?.username,
                      message: branchNotiContent,
                      created_at: new Date().toISOString(),
                    });
                  }

                  // Lấy email mới nhất từ database để đảm bảo chính xác
                  db.query("SELECT email FROM users WHERE user_id = ?", [user_id], (err, userRows) => {
                    if (err || userRows.length === 0 || !userRows[0].email) return;
                    const userEmail = userRows[0].email;

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
                    servicesHtml =
                      `<h3>Dịch vụ đi kèm:</h3><ul>` +
                      booking_services
                        .map(
                          (s) =>
                            `<li>${s.service_name}: ${s.quantity} x ${new Intl.NumberFormat("vi-VN").format(s.price)} đ</li>`,
                        )
                        .join("") +
                      `</ul>`;
                  }

                  // Nội dung email
                  const mailOptions = {
                    from: `"Hasebooking" <${process.env.EMAIL_USER}>`,
                    to: userEmail,
                    subject: `Xác nhận đặt sân thành công #${newBookingId}`,
                    html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                                <div style="display:flex; justify-content:center; align-items:center; width:100%">
                                  <img src="cid:hasebooking_logo" style="width: 57px; height: auto" alt="Logo" />
                                  <h2 style="color: #166534; text-align: center;">Đặt Sân Thành Công!</h2>
                                </div>
                                <img src="cid:field_bg" style="width: 100%; height: auto; display: block; margin: 0 auto;" alt="Logo" />
                                <p>Xin chào <strong>${req.user.full_name || "Quý khách"}</strong></p>
                                <p>Cảm ơn bạn đã sử dụng dịch vụ. Dưới đây là thông tin đặt sân của bạn:</p>
                                
                                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Mã đặt sân:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">#${newBookingId}</td></tr>
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Sân:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${info.field_name} - ${info.type_name}</td></tr>
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Chi nhánh:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${info.branch_name}</td></tr>
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Địa chỉ:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${info.address}</td></tr>
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Thời gian:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${start_time} - ${end_time}, ngày ${booking_date}</td></tr>
                                    <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tổng tiền:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd; color: #d32f2f; font-weight: bold;">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(final_price)}</td></tr>
                                </table>

                                <div style="widthL 100%; margin-top: 2rem; display: flex; justify-content: center; alight-items: center; gap: 5px">
                                  <img src="cid:qrcode" style="width: 100%; height: auto; display: block; margin: 0 auto;" />
                                  
                                  <div style="display: flex; justify-content: center; flex-direction: column alight-items: center; gap: 3px">
                                    <p>Bạn vui lòng đặt cọc để được giữ sân nhé</p>
                                    <p>Nội dung chuyển khoản:</p>
                                     <strong style="font-size: 2rem">[Tên_của_bạn]_${newBookingId}_${new Intl.NumberFormat("vi-VN").format(final_price * (50/100))}</strong>
                                  </div>
                                </div>

                                ${servicesHtml}

                                <p style="margin-top: 20px; text-align: center; color: #757575;">Vui lòng đến đúng giờ. Chúc bạn có trận đấu vui vẻ!</p>
                                <p style="margin-top: 20px; text-align: center; color: #757575;">Mọi thông tin xin vui lòng liên hệ 0818177533 - 0813502952. Hoặc tinhlu703@gmail.com để được hỗ trợ chi tiết.</p>
                            </div>
                        `,
                    attachments: [
                      {
                        filename: "HASEBOOKING-Photoroom.png",
                        path: path.join(
                          __dirname,
                          "../../frontend/assets/HASEBOOKING-Photoroom.png",
                        ), // Đường dẫn tuyệt đối tới file ảnh
                        cid: "hasebooking_logo", // Content-ID để tham chiếu trong thẻ img src="cid:..."
                      },
                      {
                        filename: "pexels-anaussieinvietnam-33370012.jpg",
                        path: path.join(
                          __dirname,
                          "../../frontend/assets/pexels-anaussieinvietnam-33370012.jpg",
                        ), // Đường dẫn tuyệt đối tới file ảnh
                        cid: "field_bg", // Content-ID để tham chiếu trong thẻ img src="cid:..."
                      },
                      {
                        filename: "z6585034699868_cf9fa8ade72b0fcc7bf6755cb3a180d8.jpg",
                        path: path.join(
                          __dirname,
                          "../../frontend/assets/z6585034699868_cf9fa8ade72b0fcc7bf6755cb3a180d8.jpg",
                        ),
                        cid: "qrcode",
                      },
                    ],
                  };

                  // Gửi mail (Không await để tránh block response)
                  transporter
                    .sendMail(mailOptions)
                    .catch((err) => console.error("Lỗi gửi mail:", err));
                  });
                }
              },
            );

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
          },
        );
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Lấy lịch sử thông báo cho chi nhánh
router.get("/branch/:branch_id/notifications", verifyToken, (req, res) => {
  const { branch_id } = req.params;
  if (!branch_id) return res.status(400).json({ message: "Missing branch_id" });

  if (
    req.user?.role !== "admin" &&
    String(req.user?.branch_id) !== String(branch_id)
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const parsedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(parsedLimit) ? Math.min(parsedLimit, 100) : 20;
  const parsedPage = Number.parseInt(req.query.page, 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const offset = (page - 1) * limit;
  const status = req.query.status === "unread" ? "unread" : "all";

  const baseWhere = status === "unread" ? "WHERE branch_id = ? AND is_read = 0" : "WHERE branch_id = ?";

  const totalSql = `SELECT COUNT(*) AS total FROM branch_notifications ${baseWhere}`;
  const unreadSql =
    "SELECT COUNT(*) AS unread_count FROM branch_notifications WHERE branch_id = ? AND is_read = 0";
  const dataSql = `
    SELECT branch_notification_id, booking_id, content, created_at, is_read
    FROM branch_notifications
    ${baseWhere}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.query(totalSql, [branch_id], (err, totalRows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Loi lay thong bao" });
    }
    const total = totalRows?.[0]?.total || 0;

    db.query(unreadSql, [branch_id], (err2, unreadRows) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: "Loi lay thong bao" });
      }
      const unreadCount = unreadRows?.[0]?.unread_count || 0;

      db.query(dataSql, [branch_id, limit, offset], (err3, rows) => {
        if (err3) {
          console.error(err3);
          return res.status(500).json({ message: "Loi lay thong bao" });
        }
        res.json({
          success: true,
          notifications: rows,
          total,
          unread_count: unreadCount,
          page,
          limit,
        });
      });
    });
  });
});

// Đánh dấu đã đọc/chưa đọc
router.patch("/branch/:branch_id/notifications/read", verifyToken, (req, res) => {
  const { branch_id } = req.params;
  if (!branch_id) return res.status(400).json({ message: "Missing branch_id" });

  if (
    req.user?.role !== "branch_owner" &&
    String(req.user?.branch_id) !== String(branch_id)
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const ids = Array.isArray(req.body?.ids)
    ? req.body.ids.map((id) => Number(id)).filter((id) => Number.isFinite(id))
    : [];
  const isRead = Number(req.body?.is_read) === 0 ? 0 : 1;
  const markAll = Boolean(req.body?.all);

  if (!markAll && ids.length === 0) {
    return res.status(400).json({ message: "Missing ids" });
  }

  const updateSql = markAll
    ? "UPDATE branch_notifications SET is_read = ? WHERE branch_id = ?"
    : "UPDATE branch_notifications SET is_read = ? WHERE branch_id = ? AND branch_notification_id IN (?)";

  const params = markAll ? [isRead, branch_id] : [isRead, branch_id, ids];

  db.query(updateSql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Loi cap nhat thong bao" });
    }
    res.json({ success: true, affected: result?.affectedRows || 0 });
  });
});

// Xóa lịch sử thông báo theo chi nhánh
router.delete("/branch/:branch_id/notifications", verifyToken, (req, res) => {
  const { branch_id } = req.params;
  if (!branch_id) return res.status(400).json({ message: "Missing branch_id" });

  if (
    req.user?.role !== "admin" &&
    String(req.user?.branch_id) !== String(branch_id)
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  db.query(
    "DELETE FROM branch_notifications WHERE branch_id = ?",
    [branch_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Loi xoa thong bao" });
      }
      res.json({ success: true, affected: result?.affectedRows || 0 });
    },
  );
});

module.exports = router;
