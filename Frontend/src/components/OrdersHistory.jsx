import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBox, FaMoneyBillWave, FaRegClock } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");

        const groupedOrders = res.data.reduce((acc, order) => {
          const id = order.id;

          if (!acc[id]) {
            acc[id] = {
              id,
              createdAt: order.created_at,
              name: order.name,
              email: order.email,
              phone: order.phone,
              address: order.address,
              paymentMethod: order.paymentMethod,
              status: order.status || "pending",
              products: [],
              totalAmount: 0,
            };
          }

          const product = acc[id].products.find(p => p.name === order.product_name);

          const quantity = Number(order.quantity) || 1;
          const price = parseFloat(order.price) || 0;

          if (product) {
            product.quantity += quantity;
          } else {
            acc[id].products.push({
              name: order.product_name,
              price,
              quantity,
              imageUrl: `/images/${order.image}.jpg`,
            });
          }

          acc[id].totalAmount += price * quantity;

          return acc;
        }, {});

        setOrders(Object.values(groupedOrders));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}/cancel`);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      toast.success("Order cancelled and stock restored.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel order.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-lg font-medium py-12">
        Loading order history...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-600">No orders found.</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        Order History
      </h2>

      <div className="space-y-8">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-2xl p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Order #{order.id}
                </h3>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <FaRegClock />
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-blue-600">
                  ${order.totalAmount.toFixed(2)}
                </p>
                <p className="text-sm capitalize text-gray-600">
                  Status: {order.status}
                </p>
              </div>
            </div>

            {/* Product List */}
            <div className="border-t pt-4 space-y-4">
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name || "Product Image"}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      ${product.price.toFixed(2)} × {product.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Customer Info */}
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />
                Payment Method: {order.paymentMethod}
              </p>
            </div>

            {/* Cancel Button */}
            {order.status === "pending" && (
              <button
                onClick={() => cancelOrder(order.id)}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
