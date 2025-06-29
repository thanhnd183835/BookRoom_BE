const db = require("../config/db"); // kết nối MySQL từ db.js

const createTableIfNotExists = async (req, res, next) => {
  const tableName = "users";

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      Password VARCHAR(255) NOT NULL,
      Email VARCHAR(100),
      DisplayName VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  const alterTableSQL = `ALTER TABLE ${tableName} ADD UNIQUE (Email);`;
  try {
    db.query(createTableSQL, (err, result) => {
      if (err) {
        console.error(`❌ Error creating table '${tableName}':`, err);
        return res.status(500).send("Internal Server Error");
      }

      console.log(`Table '${tableName}' created or already exists`);

      // Thêm UNIQUE cho email
      db.query(alterTableSQL, (err, result) => {
        if (err && err.code !== "ER_DUP_KEYNAME") {
          console.error(`Error adding UNIQUE constraint:`, err);
        } else {
          console.log(`UNIQUE constraint added to email`);
        }

        next();
      });
    });
  } catch (error) {
    console.error(`❌ Unexpected error:`, error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = createTableIfNotExists;
