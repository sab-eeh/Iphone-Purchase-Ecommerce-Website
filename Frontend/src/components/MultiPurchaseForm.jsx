// MultiPurchaseForm.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaPaypal,
  FaStripe,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const loggedInUser = {
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  address: "123 Main St, Springfield",
};

const paymentMethods = [
  {
    value: "credit",
    label: "Credit Card",
    icon: <FaCreditCard className="text-blue-600" />,
  },
  {
    value: "paypal",
    label: "PayPal",
    icon: <FaPaypal className="text-blue-500" />,
  },
  {
    value: "stripe",
    label: "Stripe",
    icon: <FaStripe className="text-indigo-600" />,
  },
];

const inputFields = [
  { name: "name", type: "text", placeholder: "Your Name", icon: <FaUser /> },
  {
    name: "email",
    type: "email",
    placeholder: "Email Address",
    icon: <FaEnvelope />,
  },
  {
    name: "phone",
    type: "tel",
    placeholder: "Phone Number",
    icon: <FaPhone />,
  },
  {
    name: "address",
    type: "text",
    placeholder: "Shipping Address",
    icon: <FaMapMarkerAlt />,
  },
];

export default function MultiPurchaseForm() {
  const { state } = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (loggedInUser) {
      setForm((prev) => ({
        ...prev,
        name: loggedInUser.name,
        email: loggedInUser.email,
        phone: loggedInUser.phone,
        address: loggedInUser.address,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state?.items?.length) {
      toast.error("Cart is empty.");
      return;
    }

    if (form.paymentMethod === "credit") {
      if (!form.cardNumber || !form.expiry || !form.cvv) {
        toast.error("Please complete credit card details.");
        return;
      }
    }

    const orderPayload = {
      user: { ...form },
      products: state.items,
      totalAmount: state.total,
    };

    try {
      // Place Order
      await axios.post("http://localhost:5000/api/orders/cart", orderPayload);

      toast.success("Order placed and stock updated!");
      localStorage.removeItem("cart");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to process your order."
      );
    }
  };

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Cart Checkout & Payment
      </h2>

      <div className="flex flex-col md:flex-row gap-10 bg-white shadow-lg rounded-2xl p-8">
        {/* Cart Summary */}
        <div className="md:w-1/2 w-full space-y-6">
          {state?.items?.map((item) => (
            <div key={item.slug} className="flex items-center gap-4">
              <img
                src={`http://localhost:5000${item.image_url}`}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600">
                  ${item.price} × {item.quantity}
                </p>
              </div>
            </div>
          ))}
          <div className="mt-4 text-right font-bold text-xl text-gray-800">
            Total: ${state?.total ?? 0}
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="md:w-1/2 w-full space-y-5">
          {inputFields.map(({ name, type, placeholder, icon }) => (
            <div
              key={name}
              className="flex items-center border rounded-lg px-3 py-2"
            >
              <span className="text-gray-500 mr-3">{icon}</span>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full outline-none"
                required
              />
            </div>
          ))}

          {/* Payment Method */}
          <div>
            <p className="text-sm font-semibold mb-2 text-gray-700">
              Payment Method:
            </p>
            <div className="flex gap-6">
              {paymentMethods.map(({ value, label, icon }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={form.paymentMethod === value}
                    onChange={handleInputChange}
                  />
                  {icon}
                  {label}
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
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Confirm & Pay
          </button>
        </form>
      </div>
    </section>
  );
}
