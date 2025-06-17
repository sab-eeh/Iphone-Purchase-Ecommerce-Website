import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddToCart from "./components/AddToCart";
import { ProductDetails } from "./components/ProductDetails";
import { PurchaseForm } from "./components/PurchaseForm";
import MultiPurchaseForm from "./components/MultiPurchaseForm";
import OrderHistory from "./components/OrdersHistory";
import { Footer } from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/purchase/:slug" element={<PurchaseForm />} />
        <Route path="/cart" element={<AddToCart />} />
        <Route path="/cart-checkout" element={<MultiPurchaseForm />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
      
      <Footer />
    </Router>
  );
};

export default App;
