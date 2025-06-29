const jwt = require("jsonwebtoken");

// Nên để secret key vào .env
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Token phải được gửi theo dạng: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token. Truy cập bị từ chối." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Gán user đã decode vào req để dùng sau này
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

module.exports = verifyToken;
