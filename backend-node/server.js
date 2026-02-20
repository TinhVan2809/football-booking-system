require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http"); // Import http
const { Server } = require("socket.io"); // Import Socket.io
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("./db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const server = http.createServer(app); // Tạo server http từ express app
app.use(express.json());

// Kiểm tra biến môi trường quan trọng
if (!process.env.JWT_SECRET) {
  console.warn("CẢNH BÁO: JWT_SECRET chưa được cấu hình trong file .env");
}

// Configure CORS using environment variables (FRONTEND_URL, ADMIN_URL)
// Fall back to common localhost origins for development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost",
  "http://127.0.0.1",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // Log origin bị chặn để debug
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Cấu hình Socket.io
const io = new Server(server, { cors: corsOptions });

app.use(cookieParser());

// #TẠO TÀI KHOẢN CHO CUSTOMER
app.post("/register", async (req, res) => {
  const { username, password, full_name, phone, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // thư viện bcrypt hashing password

    db.query(
      "SELECT 1 FROM users WHERE username = ?",
      [username],
      (err, rows) => {
        if (rows.length > 0) {
          return res
            .status(409)
            .json({ message: "Tên tài khoản đã được sử dụng. " });
        }

        db.query(
          "INSERT INTO users (username, password, full_name, phone, email) VALUES (?, ?, ?, ?, ?)",
          [username, hashedPassword, full_name, phone, email],
          (err) => {
            if (err && err.code === "ER_DUP_ENTRY") {
              console.error(err);
              return res
                .status(400)
                .json({ message: "Tên tài khoản đã được sử dụng. " });
            }
            res.json({ message: "Customer created successfully" });
          },
        );
      },
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// #LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, users) => {
      if (err) return res.status(500).json({ error: err });

      // Kiểm tra tên tài khoản có nằm trong table hay không.
      if (users.length === 0)
        return res.status(400).json({ message: "Không tìm thấy người dùng." });

      const user = users[0];

      // check password
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Mật khẩu không chính xác.",
        });

      //created token
      const token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.username,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
          email: user.email,
          branch_id: user.branch_id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      // cookie options can be configured via env vars: COOKIE_DOMAIN and COOKIE_SAMESITE
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.COOKIE_SAMESITE || "lax", // 'lax' dễ chịu hơn cho dev localhost khác port
        domain: process.env.COOKIE_DOMAIN || undefined,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      };

      res.cookie("token", token, cookieOptions).json({
        message: "Login success",
        user: {
          user_id: user.user_id,
          role: user.role,
          username: user.username,
          full_name: user.full_name,
          branch_id: user.branch_id,
        },
      });
    },
  );
});

// #FORGOT PASSWORD (Gửi email reset)
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Vui lòng nhập email" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, users) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (users.length === 0)
      return res
        .status(404)
        .json({ message: "Email không tồn tại. Vui lòng thử lại!" });

    const user = users[0];

    // Tạo token reset password (hết hạn sau 15 phút)
    // Dùng secret + password hash cũ để tạo secret key động -> Nếu user đổi pass thì token cũ vô hiệu
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      secret,
      { expiresIn: "15m" },
    );

    // Link reset (Trỏ về Frontend React)
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${user.user_id}/${token}`;

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Hasebooking Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: `
        <h3>Xin chào ${user.full_name},</h3>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào link bên dưới để tiếp tục:</p>
        <a href="${resetLink}" style="padding: 10px 20px; background-color: #166534; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
        <p>Link này chỉ có hiệu lực trong 15 phút.</p>
        <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Gửi email thất bại" });
      }
      res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
    });
  });
});

// #RESET PASSWORD (Cập nhật mật khẩu mới)
app.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [id],
    async (err, users) => {
      if (err || users.length === 0)
        return res.status(404).json({ message: "User không tồn tại" });

      const user = users[0];
      const secret = process.env.JWT_SECRET + user.password;

      try {
        // Verify token
        jwt.verify(token, secret);

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "UPDATE users SET password = ? WHERE user_id = ?",
          [hashedPassword, id],
          (err) => {
            if (err)
              return res.status(500).json({ message: "Lỗi cập nhật mật khẩu" });
            res.json({ message: "Mật khẩu đã được thay đổi thành công!" });
          },
        );
      } catch (error) {
        res.status(400).json({ message: "Link không hợp lệ hoặc đã hết hạn" });
      }
    },
  );
});

// #MIDDLEWARE AUTH
function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded; // Save user infomation after decode
    next();
  });
}

// #ROUTH [Gọi api để xem json user]
app.get("/user", auth, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
    env: req.env,
  });
});

app.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: "/",
    })
    .json({ message: "Logout successful" });
});

//# Route dùng để tìm kiếm
const searchRoutes = require("./routes/search.route");
app.use("/api/search", searchRoutes);

//# Route cho bảng giá
const fieldPricingRuleRoutes = require("./routes/fieldPricingRule.route");
app.use("/api/pricing", fieldPricingRuleRoutes);

//# Route Booking (Kèm socket io)
const bookingRoutes = require("./routes/booking.route");
// Truyền io vào request để sử dụng trong controller
app.use(
  "/api/bookings",
  (req, res, next) => {
    req.io = io;
    next();
  },
  bookingRoutes,
);

// #Lấy danh sách booking của một chi nhánh
app.get("/api/bookings/branch/:branch_id", auth, (req, res) => {
  const { branch_id } = req.params;
  // Có thể thêm filter ngày nếu muốn
  const sql = `
    SELECT b.booking_id, b.final_price, b.created_at, b.duration_minutes, b.booking_status, u.full_name, f.field_name, ft.thumbnail, ft.type_name, ft.players
    FROM bookings b
    JOIN field_field_types fft ON b.field_field_type_id = fft.field_field_type_id
    JOIN fields f ON fft.field_id = f.field_id
    JOIN field_types ft ON fft.field_type_id = ft.field_type_id
    JOIN users u ON b.user_id = u.user_id
    WHERE f.branch_id = ?
    ORDER BY b.created_at DESC
  `;
  db.query(sql, [branch_id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi truy vấn booking" });
    }
    res.json({ success: true, bookings: rows });
  });
});

//# Xem chi tiết booking theo booking_id
app.get("/api/booking/branch/:booking_id", auth, (req, res) => {
  const { booking_id } = req.params;
  const bookingSql = `
    SELECT b.*, u.user_id, u.full_name, u.phone, f.field_name, ft.type_name, ft.players
    FROM bookings b
    JOIN field_field_types fft ON b.field_field_type_id = fft.field_field_type_id
    JOIN fields f ON fft.field_id = f.field_id
    JOIN field_types ft ON fft.field_type_id = ft.field_type_id
    JOIN users u ON b.user_id = u.user_id
    WHERE b.booking_id = ?
  `;
  const servicesSql = `
    SELECT bs.*, s.service_name
    FROM booking_services bs
    JOIN branch_services brs ON bs.branch_service_id = brs.branch_service_id
    JOIN services s ON brs.service_id = s.service_id
    WHERE bs.booking_id = ?
  `;

  db.query(bookingSql, [booking_id], (err, bookingRows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi xem chi tiết lịch đặt sân" });
    }
    db.query(servicesSql, [booking_id], (err2, serviceRows) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: "Lỗi lấy dịch vụ đi kèm" });
      }
      res.json({ success: true, bookings: bookingRows, services: serviceRows });
    });
  });
});

// #Socket connection event
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  // Join branch-specific room for realtime notifications
  socket.on("join_branch", (payload) => {
    const branchId = Number(payload?.branch_id ?? payload);
    if (!branchId) return;
    const room = `branch_${branchId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 8081; // Fallback port 8081 nếu env lỗi
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Network Info:", server.address());
});
