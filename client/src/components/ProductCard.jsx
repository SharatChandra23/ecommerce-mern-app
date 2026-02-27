import StarRating from "./StarRating";
import { useCart } from "../context/CartContext";
import { FaMinus, FaPlus } from "react-icons/fa";

function ProductCard({ product }) {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
  } = useCart();

  // Check if product already in cart
  const cartItem = cartItems.find(
    (item) => item._id === product._id
  );

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover rounded"
      />

      <h2 className="mt-4 font-semibold text-lg">
        {product.name}
      </h2>

      <StarRating rating={product.rating} />

      <p className="text-xl font-bold mt-2">
        ${product.price}
      </p>

      {/* If NOT in cart → show Add button */}
      {!cartItem ? (
        <button
          onClick={() => addToCart(product)}
          className="mt-4 bg-slate-900 text-white px-4 py-2 rounded w-full hover:scale-105 transition-transform"
        >
          Add to Cart
        </button>
      ) : (
        /* If already in cart → show quantity controls */
        <div className="mt-4 flex items-center justify-between bg-gray-100 rounded-lg p-2">

          {/* Minus Button */}
          <button
            onClick={() =>
              cartItem.quantity === 1
                ? removeItem(product._id)
                : updateQuantity(product._id, cartItem.quantity - 1)
            }
            className="w-10 h-10 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-slate-900 hover:text-white transition active:scale-90"
          >
            <FaMinus size={14} />
          </button>

          {/* Quantity */}
          <span className="text-lg font-semibold px-4">
            {cartItem.quantity}
          </span>

          {/* Plus Button */}
          <button
            onClick={() =>
              updateQuantity(product._id, cartItem.quantity + 1)
            }
            className="w-10 h-10 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-slate-900 hover:text-white transition active:scale-90"
          >
            <FaPlus size={14} />
          </button>

        </div>
      )}
    </div>
  );
}

export default ProductCard;