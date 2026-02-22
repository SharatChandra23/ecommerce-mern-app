import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />

      <h4 className="mt-4 font-semibold text-lg">
        {product.name}
      </h4>

      <p className="text-gray-600 mt-1">
        ${product.price}
      </p>

      <button
        onClick={() => addToCart(product)}
        className="mt-4 w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;