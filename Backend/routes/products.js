// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// PATCH /api/products/:slug/decrement
router.patch("/api/products/:slug/decrement", (req, res) => {
  const { slug } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  const selectQuery = "SELECT stock FROM products WHERE slug = ?";
  db.query(selectQuery, [slug], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const currentStock = results[0].stock;

    if (currentStock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    const updateQuery = "UPDATE products SET stock = stock - ? WHERE slug = ?";
    db.query(updateQuery, [quantity, slug], (updateErr) => {
      if (updateErr) {
        console.error("Stock update failed:", updateErr);
        return res.status(500).json({ error: "Failed to update stock" });
      }

      res.json({ message: "Stock updated", newStock: currentStock - quantity });
    });
  });
});

module.exports = router;
