const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "sabeeh",
  password: "sabeeh123",
  database: "mobileapp",
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database.");
});

module.exports = connection;