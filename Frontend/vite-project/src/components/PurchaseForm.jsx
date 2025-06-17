import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCreditCard, FaPaypal, FaStripe,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Replace this with actual user context or auth logic
const loggedInUser = {
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  address: "123 Main St, Springfield",
};

export function PurchaseForm() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "credit",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/${slug}`);
        setProduct(res.data);
      } catch (err) {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();

    if (loggedInUser) {
      setForm((prev) => ({
        ...prev,
        name: loggedInUser.name,
        email: loggedInUser.email,
        phone: loggedInUser.phone,
        address: loggedInUser.address,
      }));
    }
  }, [slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (product?.stock === 0) {
      toast.error("Sorry, this product is out of stock.");
      return;
    }

    if (
      form.paymentMethod === "credit" &&
      (!form.cardNumber.trim() || !form.expiry.trim() || !form.cvv.trim())
    ) {
      toast.error("Please fill in all credit card details.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...form,
        productId: product?.id || product?._id,
        productName: product.name,
        price: product.price,
      };

      await axios.post(`${API_URL}/api/orders`, orderData);

      // Only decrement stock if order is successful
    
      toast.success("Purchase successful!");
      navigate("/");
    } catch (err) {
      toast.error("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="text-center py-12 text-lg font-medium">
        Loading product details...
      </div>
    );
  }

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Checkout & Payment
      </h2>

      <div className="flex flex-col md:flex-row gap-10 bg-white shadow-lg rounded-2xl p-8">
        {/* Left: Product Details */}
        <div className="md:w-1/2 w-full">
          <img
            src={`${API_URL}${product.image_url}`}
            alt={product.name}
            className="rounded-xl w-full object-cover shadow"
          />
          <p className="text-2xl font-semibold text-gray-900 mt-6">${product.price}</p>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className={`mt-4 text-sm font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }`}>
            {product.stock > 0
              ? `Available stock: ${product.stock}`
              : "Out of Stock"}
          </p>
        </div>

        {/* Right: Payment Form */}
        <form onSubmit={handleSubmit} className="md:w-1/2 w-full space-y-5">
          {["name", "email", "phone", "address"].map((field) => (
            <div key={field} className="flex items-center border rounded-lg px-3 py-2">
              <span className="text-gray-500 mr-3">
                {field === "name" && <FaUser />}
                {field === "email" && <FaEnvelope />}
                {field === "phone" && <FaPhone />}
                {field === "address" && <FaMapMarkerAlt />}
              </span>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={form[field]}
                onChange={handleInputChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="w-full outline-none"
                required
              />
            </div>
          ))}

          {/* Payment Method */}
          <div>
            <p className="text-sm font-semibold mb-2 text-gray-700">Payment Method:</p>
            <div className="flex gap-6">
              {["credit", "paypal", "stripe"].map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={handleInputChange}
                  />
                  {method === "credit" && <FaCreditCard className="text-blue-600" />}
                  {method === "paypal" && <FaPaypal className="text-blue-500" />}
                  {method === "stripe" && <FaStripe className="text-indigo-600" />}
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Credit Card Fields */}
          {form.paymentMethod === "credit" && (
            <>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <span className="text-gray-500 mr-3">
                  <FaCreditCard />
                </span>
                <input
                  type="text"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleInputChange}
                  placeholder="Card Number"
                  className="w-full outline-none"
                  required
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={handleInputChange}
                  className="w-1/2 px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={form.cvv}
                  onChange={handleInputChange}
                  className="w-1/2 px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || product.stock === 0}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading || product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
        </form>
      </div>
    </section>
  );
}
