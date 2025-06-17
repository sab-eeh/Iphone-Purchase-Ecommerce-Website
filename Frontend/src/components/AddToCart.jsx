import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddToCart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateQuantity = (id, quantity) => {
    if (isNaN(quantity) || quantity < 1) return;

    const itemToUpdate = cartItems.find((item) => item.id === id);
    if (!itemToUpdate) return;

    if (quantity > itemToUpdate.stock) {
      toast.error(`Only ${itemToUpdate.stock} items in stock`, {
        autoClose: 1500,
      });
      return;
    }

    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: quantity } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.success("Quantity updated", { autoClose: 1000 });
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.info("Item removed", { autoClose: 1000 });
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const hasInvalidQuantity = cartItems.some(
    (item) => item.quantity > item.stock
  );

  const handleProceed = () => {
    if (hasInvalidQuantity) {
      toast.error("Fix quantity errors before proceeding");
      return;
    }

    navigate("/cart-checkout", {
      state: {
        items: cartItems,
        total: total.toFixed(2),
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-10 rounded-3xl shadow-black shadow-sm backdrop-blur-2xl">
      <h2 className="text-3xl font-bold mb-6">Your Bag</h2>

      {cartItems.length === 0 ? (
        <p className="text-lg text-gray-600">Your Bag is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => {
            const isQuantityInvalid = item.quantity > item.stock;

            return (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between items-center border-b pb-4"
              >
                <div className="w-full md:w-3/4">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-700">
                    ${item.price} x {item.quantity}
                  </p>
                  <div className="mt-2 flex items-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className={`w-20 border rounded px-2 py-1 ${
                        isQuantityInvalid
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 text-red-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>

                  {isQuantityInvalid && (
                    <p className="text-sm text-red-500 mt-1">
                      Only {item.stock} in stock
                    </p>
                  )}
                </div>

                <img
                  src={`http://localhost:5000${item.image_url}`}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/80x80")
                  }
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg mt-4 md:mt-0"
                />
              </div>
            );
          })}

          <div className="text-right font-semibold text-xl mt-4">
            Total: ${total.toFixed(2)}
          </div>

          <div className="text-right mt-6">
            <button
              onClick={handleProceed}
              disabled={cartItems.length === 0 || hasInvalidQuantity}
              className={`px-6 py-3 rounded-md font-medium text-white transition 
                ${
                  cartItems.length === 0 || hasInvalidQuantity
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
