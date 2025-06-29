// controllers/authController.js
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  try {
    const { Password, Email, ConfirmPassword, DisplayName } = req.body;
    console.log(req.body);

    if (!Email || !Password || !ConfirmPassword || !DisplayName) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (Password !== ConfirmPassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu và xác nhận mật khẩu không khớp" });
    }

    // Kiểm tra email
    const [emailResults] = await db.query(
      "SELECT * FROM users WHERE Email = ?",
      [Email]
    );
    if (emailResults.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Kiểm tra DisplayName
    const [displayNameResults] = await db.query(
      "SELECT * FROM users WHERE DisplayName = ?",
      [DisplayName]
    );
    if (displayNameResults.length > 0) {
      return res.status(400).json({ message: "Tên hiển thị đã được sử dụng" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    await db.query(
      "INSERT INTO users (Email, Password, DisplayName) VALUES (?, ?, ?)",
      [Email, hashedPassword, DisplayName]
    );

    return res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Lỗi hệ thống:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// dang nhap
module.exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập Email và Mật khẩu" });
    }
    console.log(req.body);

    // tim user theo email
    const [rows] = await db.query("SELECT * FROM users WHERE Email = ?", [
      Email,
    ]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }
    // ✅ Tạo access token (hết hạn sau 15 phút)
    const accessToken = jwt.sign(
      { id: user.id, Email: user.Email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ Tạo refresh token (hết hạn sau 7 ngày)
    const refreshToken = jwt.sign(
      { id: user.id, Email: user.Email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    const token = jwt.sign(
      {
        id: user.id,
        Email: user.Email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      data: {
        message: "Đăng nhập thành công",
        Data: {
          accessToken,
          refreshToken,
          token,
        },
      },
    });
  } catch (error) {
    console.error("Lỗi hệ thống:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
