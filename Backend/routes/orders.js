const express = require("express");
const router = express.Router();
const db = require("../db");
const util = require("util");

const query = util.promisify(db.query).bind(db);

//  1. Single-product order with stock decrement
router.post("/orders", async (req, res) => {
  try {
    const {
      name, email, phone, address, paymentMethod,
      cardNumber, expiry, cvv, productId, productName, price, quantity = 1
    } = req.body;

    if (!productId || !name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check stock
    const stockCheck = await query("SELECT stock FROM products WHERE id = ?", [productId]);
    if (stockCheck.length === 0 || stockCheck[0].stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Insert order
    const insertSql = `
      INSERT INTO orders 
      (name, email, phone, address, payment_method, card_number, expiry, cvv, product_id, product_name, price, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(insertSql, [
      name, email, phone, address,
      paymentMethod, cardNumber, expiry, cvv,
      productId, productName, price * quantity, quantity
    ]);

    // Update stock
    const updateResult = await query(
      "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
      [quantity, productId, quantity]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ message: "Stock not available" });
    }

    res.status(201).json({ message: "Order placed and stock updated" });
  } catch (err) {
    console.error("Error placing single-product order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//  2. Multi-product cart order
router.post("/orders/cart", async (req, res) => {
  const { user, products } = req.body;

  if (!user || !products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Invalid order request" });
  }

  const {
    name, email, phone, address,
    paymentMethod, cardNumber, expiry, cvv
  } = user;

  try {
    const failed = [];

    // Check stock first
    for (const p of products) {
      const check = await query("SELECT stock FROM products WHERE id = ?", [p.id]);
      if (!check.length || check[0].stock < p.quantity) {
        failed.push(p.name);
      }
    }

    if (failed.length > 0) {
      return res.status(400).json({ message: `Insufficient stock for: ${failed.join(", ")}` });
    }

    // Insert all orders
    const values = products.map(p => [
      name, email, phone, address,
      paymentMethod, cardNumber, expiry, cvv,
      p.id, p.name, p.price * p.quantity, p.quantity
    ]);

    const insertSql = `
      INSERT INTO orders 
      (name, email, phone, address, payment_method, card_number, expiry, cvv, product_id, product_name, price, quantity)
      VALUES ?
    `;
    await query(insertSql, [values]);

    // Update stock for each product
    for (const p of products) {
      await query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [p.quantity, p.id]
      );
    }

    res.status(201).json({ message: "Cart order placed and stock updated" });
  } catch (err) {
    console.error("Error processing cart order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//  3. Cancel an order and restore stock
router.delete("/orders/:orderId/cancel", async (req, res) => {
  const { orderId } = req.params;

  try {
    const orders = await query("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orders[0];

    await query("UPDATE products SET stock = stock + ? WHERE id = ?", [order.quantity || 1, order.product_id]);
    await query("DELETE FROM orders WHERE id = ?", [orderId]);

    res.json({ message: "Order canceled and stock restored" });
  } catch (err) {
    console.error("Error canceling order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//  4. Fetch all orders
router.get("/orders", async (req, res) => {
  try {
    const sql = `
      SELECT id, name, email, phone, address, payment_method, product_id, product_name, price, quantity, created_at
      FROM orders ORDER BY created_at DESC
    `;
    const orders = await query(sql);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
