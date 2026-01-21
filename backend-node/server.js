require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());

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
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser tools or same-origin requests with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());

// TẠO TÀI KHOẢN CHO ADMIN
// app.post("/admin/register", auth, async (req, res) => {
//   const { username, password, full_name, phone } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     db.query(
//       "INSERT INTO users (username, password, full_name, phone, role) VALUES (?, ?, ?, ?, 'admin')",
//       [username, hashedPassword, full_name, phone],
//       (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(400).json({ message: "Register admin failed" });
//         }
//         res.json({ message: "Admin created successfully" });
//       },
//     );
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// TẠO TÀI KHOẢN CHO CUSTOMER
app.post("/register", async (req, res) => {
  const { username, password, full_name, phone } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "SELECT 1 FROM users WHERE username = ?",
      [username],
      (err, rows) => {
        if (rows.length > 0) {
          return res.status(409).json({ message: "Tên tài khoản đã được sử dụng. " });
        }

        db.query(
          "INSERT INTO users (username, password, full_name, phone) VALUES (?, ?, ?, ?)",
          [username, hashedPassword, full_name, phone],
          (err) => {
            if (err && err.code === 'ER_DUP_ENTRY') {
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

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, users) => {
      if (err) return res.status(500).json({ error: err });

      if (users.length === 0)
        return res.status(400).json({ message: "User not found" });

      const user = users[0];

      // check password
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({
            message:
              "Invalid password! Check your password of contact Administrator.",
          });

      //created token
      const token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.username,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
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
        sameSite: process.env.COOKIE_SAMESITE || "strict", // set 'none' for cross-site (must have secure=true)
        domain: process.env.COOKIE_DOMAIN || undefined,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      };

      res.cookie("token", token, cookieOptions).json({
        message: "Login success",
        user: {
          role: user.role,
          username: user.username,
          full_name: user.full_name,
        },
      });
    },
  );
});

// MIDDLEWARE AUTH
function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded; // Save user infomation after decode
    next();
  });
}

// ROUTH [Gọi api để xem json user]
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

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
