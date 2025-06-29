const db = require("../config/db");
const jwt = require("jsonwebtoken");
module.exports.getByToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // Kiểm tra token có tồn tại không
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    const token = authHeader.split(" ")[1];

    // Xác thực token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Token hết hạn hoặc không hợp lệ" });
    }

    // Lấy userId hoặc email từ payload
    const userId = decoded.id; // hoặc decoded.email tùy payload

    const sql = "SELECT id, Email, DisplayName FROM users WHERE id = ?";
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      return res.status(200).json({ user: results[0] });
    });
  } catch (error) {
    console.error("Lỗi hệ thống:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
