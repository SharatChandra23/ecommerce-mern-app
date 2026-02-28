import StarRating from "./StarRating";
import { useCart } from "../context/CartContext";
import { FaMinus, FaPlus } from "react-icons/fa";
import AppButton from "../components/common/AppButton";
import { useState } from "react";

function ProductCard({ product }) {
  const [bouncing, setBouncing] = useState(false);
  const [animateQty, setAnimateQty] = useState(false);

  const {
    cartItems,
    addToCart,
    increaseQty,
    decreaseQty,
    removeItem,
  } = useCart();

  const cartItem = cartItems.find(
    (item) => item.product._id === product._id
  );

  const handleAdd = () => {
    addToCart(product);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);
  };

  const handleIncrease = () => {
    setAnimateQty(true);
    increaseQty(product._id);
    setTimeout(() => setAnimateQty(false), 200);
  };

  const handleDecrease = () => {
    setAnimateQty(true);
    cartItem.quantity === 1
      ? removeItem(product._id)
      : decreaseQty(product._id);
    setTimeout(() => setAnimateQty(false), 200);
  };

  const hasDiscount =
    product.discountPrice &&
    product.discountPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) /
          product.price) *
          100
      )
    : 0;

  const finalPrice = hasDiscount
    ? product.discountPrice
    : product.price;

  return (
    <div
      className="
        group
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-2xl
        transition-all duration-300
        overflow-hidden
        border border-gray-100
        hover:-translate-y-1
      "
    >
      {/* ================= IMAGE ================= */}
      <div className="relative overflow-hidden">

        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover
          group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="
            absolute top-3 left-3
            bg-red-500 text-white
            text-xs font-semibold
            px-3 py-1 rounded-full shadow
          ">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-5 space-y-3">

        <h2 className="font-semibold text-lg text-slate-800 line-clamp-1">
          {product.name}
        </h2>

        <StarRating rating={product.rating} />

        {/* ================= PRICE ================= */}
        <div className="flex items-center gap-3">

          <span className="text-xl font-bold text-slate-900">
            ${finalPrice}
          </span>

          {hasDiscount && (
            <span className="text-gray-400 line-through text-sm">
              ${product.price}
            </span>
          )}
        </div>

        {/* ================= CART SECTION ================= */}
        {!cartItem ? (
          <AppButton
            variant="primary"
            className={`${bouncing ? "animate-bounce" : ""} rounded-xl`}
            onClick={handleAdd}
            fullWidth
          >
            Add to Cart
          </AppButton>
        ) : (
          <div className="
            mt-3 flex items-center justify-between
            bg-gray-50 rounded-xl p-2 border
          ">

            {/* Minus */}
            <AppButton
              circle
              variant="outline"
              size="md"
              icon={<FaMinus size={14} />}
              onClick={handleDecrease}
              className="hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm"
            />

            {/* Quantity */}
            <span
              className={`text-lg font-semibold px-4 transition-transform ${
                animateQty ? "scale-125 text-emerald-600" : ""
              }`}
            >
              {cartItem.quantity}
            </span>

            {/* Plus */}
            <AppButton
              circle
              variant="outline"
              size="md"
              icon={<FaPlus size={14} />}
              onClick={handleIncrease}
              className="hover:bg-emerald-500 hover:text-white hover:border-emerald-500 shadow-sm"
            />

          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;