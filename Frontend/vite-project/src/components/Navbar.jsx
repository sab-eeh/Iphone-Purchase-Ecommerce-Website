import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaHistory } from "react-icons/fa";
import logo from "../assets/images/logo-1.png";

export default function Navbar() {
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateCartCount = useCallback(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQuantity = cart.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      setCartItemCount(totalQuantity);
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      setCartItemCount(0);
    }
  }, []);

  useEffect(() => {
    updateCartCount();

    const syncEvents = ["storage", "cartUpdated"];
    syncEvents.forEach((event) =>
      window.addEventListener(event, updateCartCount)
    );

    return () => {
      syncEvents.forEach((event) =>
        window.removeEventListener(event, updateCartCount)
      );
    };
  }, [updateCartCount]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleNavClick = (id) => {
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full shadow-md sticky top-0 z-50 bg-white"
    >
      <div className="max-w-7xl mx-auto px-5 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" aria-label="Home">
          <img src={logo} alt="Apple logo" className="w-[30px]" />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8 text-black font-semibold">
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => handleNavClick("models")}
          >
            New
          </li>
          <li
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => handleNavClick("products")}
          >
            Products
          </li>
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/">Support</Link>
          </li>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-5 relative">
          {/* Order History Icon */}
          <Link
            to="/orders"
            className="text-gray-700 hover:text-blue-600 text-xl"
            aria-label="Order History"
          >
            <FaHistory />
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="text-gray-700 hover:text-blue-600 text-xl relative"
            aria-label="Cart"
          >
            <FaShoppingCart />
            {cartItemCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Hamburger Placeholder */}
        <button
          className="md:hidden text-gray-700 focus:outline-none ml-4"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
}
