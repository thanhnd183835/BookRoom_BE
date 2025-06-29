require("dotenv").config(); // Thêm dòng này ở đầu
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const http = require("http");
const server = http.createServer(app);
const db = require("./config/db");
const cors = require("cors"); //
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    exposedHeaders: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    limit: "500mb",
  })
);
app.get("/", (req, res) => {
  res.send("BookRoomBE is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
