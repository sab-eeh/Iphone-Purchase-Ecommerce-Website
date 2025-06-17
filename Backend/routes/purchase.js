const express = require("express");
const router = express.Router();
const db = require("../db");
const util = require("util");

const query = util.promisify(db.query).bind(db);

router.post("/api/purchase", async (req, res) => {
  const { name, email, phone, items, total } = req.body;

  // Basic validation
  if (!name || !email || !phone || !items || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const sql = `
      INSERT INTO purchases (name, email, phone, items, total)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [name, email, phone, JSON.stringify(items), total];

    await query(sql, values);

    res.status(201).json({ message: "Purchase recorded!" });
  } catch (err) {
    console.error("❌ Error inserting purchase:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
