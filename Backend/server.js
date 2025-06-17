const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./db");
const ordersRoute = require("./routes/orders");
const productsRoute = require("./routes/products");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for product images
app.use("/images", express.static(path.join(__dirname, "images")));

// API routes
app.use("/api", ordersRoute);
app.use(productsRoute);

// Get all products
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Get product by slug
app.get("/api/products/:slug", (req, res) => {
  const { slug } = req.params;
  const query = "SELECT * FROM products WHERE slug = ?";
  db.query(query, [slug], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send("Product not found");
    res.json(result[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
