import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PiShoppingCartFill } from "react-icons/pi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { motion } from "framer-motion";

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const carousel1Ref = useRef(null);
  const carousel2Ref = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        window.dispatchEvent(new Event("cartUpdated"));
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
      } else {
        alert("You’ve reached the maximum available stock for this item.");
        return;
      }
    } else {
      if (product.stock > 0) {
        cart.push({ ...product, quantity: 1 });
      } else {
        alert("This product is out of stock.");
        return;
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const enableDragScroll = (ref) => {
    let isDragging = false;
    let startX;
    let scrollLeft;


    const mouseMoveHandler = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 2; 
      ref.current.scrollLeft = scrollLeft - walk;
    };

    const stopDragging = () => {
      isDragging = false;
      ref.current.classList.remove("cursor-grabbing");
    };

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      el.addEventListener("mousemove", mouseMoveHandler);
      el.addEventListener("mouseleave", stopDragging);
      return () => {
        el.removeEventListener("mousemove", mouseMoveHandler);
        el.removeEventListener("mouseleave", stopDragging);
      };
    }, []);
  };

  enableDragScroll(carousel1Ref);
  enableDragScroll(carousel2Ref);

  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-gray-700">
        Loading products...
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50" id="products">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-12">
          Explore All Models
        </h2>

        <div className="space-y-16">
          {/* Carousel 1: drag scroll */}
          <motion.div
            ref={carousel1Ref}
            className="overflow-x-auto cursor-grab select-none"
          >
            <motion.div className="flex space-x-6 w-max my-5">
              {products.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="min-w-[300px] bg-white shadow-md rounded-3xl p-4 transition transform hover:scale-105 cursor-pointer"
                >
                  <img
                    src={`http://localhost:5000${product.image_url}`}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/300x200")
                    }
                  />
                  <div className="flex items-center justify-between mt-2">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <button onClick={() => addToCart(product)}>
                      <PiShoppingCartFill size={20} />
                    </button>
                  </div>
                  <p className="text-black font-medium mt-2">${product.price}</p>
                  {product.stock > 0 ? (
                    <button
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="mt-3 flex items-center font-semibold"
                    >
                      Buy Now <MdOutlineKeyboardArrowRight size={20} />
                    </button>
                  ) : (
                    <p className="mt-3 px-3 py-1 bg-red-500 text-white rounded-md text-sm text-center">
                      Out of Stock
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Carousel 2: drag scroll */}
          <motion.div
            ref={carousel2Ref}
            className="overflow-x-auto cursor-grab select-none"
          >
            <div className="flex space-x-6 w-max my-5">
              {products.slice(6, 12).map((product) => (
                <div
                  key={product.id}
                  className="min-w-[300px] bg-white shadow-md rounded-3xl p-4 transition transform hover:scale-105 cursor-pointer"
                >
                  <img
                    src={`http://localhost:5000${product.image_url}`}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/300x200")
                    }
                  />
                  <div className="flex items-center justify-between mt-2">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <button onClick={() => addToCart(product)}>
                      <PiShoppingCartFill size={20} />
                    </button>
                  </div>
                  <p className="text-black font-medium mt-2">${product.price}</p>
                  {product.stock > 0 ? (
                    <button
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="mt-3 flex items-center font-semibold cursor-pointer"
                    >
                      Buy Now <MdOutlineKeyboardArrowRight size={20} />
                    </button>
                  ) : (
                    <p className="mt-3 px-3 py-1 bg-red-500 text-white rounded-md text-sm text-center">
                      Out of Stock
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
