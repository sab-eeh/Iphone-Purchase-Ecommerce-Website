import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Models } from "./Models";
import axios from "axios";

export function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // Function to fetch product data
  const fetchProduct = () => {
    axios
      .get(`http://localhost:5000/api/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProduct(); 

    const interval = setInterval(() => {
      fetchProduct();
    }, 5000);

    return () => clearInterval(interval); 
  }, [slug]);

  if (!product)
    return (
      <div className="text-center py-20 text-lg">
        Loading product details...
      </div>
    );

  return (
    <>
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <img
            src={`http://localhost:5000${product.image_url}`}
            alt={product.name}
            className="rounded-xl w-full object-cover shadow-md"
          />

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-xl text-blue-600 font-semibold mb-2">
              ${product.price}
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              {product.description}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Available stock: {product.stock}
            </p>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Specifications:
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li><strong>RAM:</strong> {product.ram || "—"}</li>
                <li><strong>Storage:</strong> {product.storage || "—"}</li>
                <li><strong>Processor:</strong> {product.processor || "—"}</li>
                <li><strong>Display:</strong> {product.display || "—"}</li>
                <li><strong>Battery:</strong> {product.battery || "—"}</li>
              </ul>
            </div>

            {product.stock > 0 ? (
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                onClick={() => navigate(`/purchase/${product.slug}`)}
              >
                Buy Now
              </button>
            ) : (
              <p className="text-red-500 font-semibold text-lg">Out of Stock</p>
            )}
          </div>
        </div>
      </section>

      <Models />
    </>
  );
}
