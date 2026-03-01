import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import { FaShoppingBag } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Addresses from "./Addresses";
import AppButton from "../components/common/AppButton";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get coupon + delivery instructions from Cart
  const { deliveryInstructions, appliedCoupon } = location.state || {};

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const addrRes = await API.get("/user/addresses");
      setAddresses(addrRes.data);

      const defaultAddr = addrRes.data.find(a => a.isDefault);
      if (defaultAddr) setSelected(defaultAddr._id);

      const cartRes = await API.get("/cart");
      setCartItems(cartRes.data.items || []);
    };

    loadData();
  }, []);

  const handleCheckout = async () => {
    if (!selected) return alert("Select address");

    setLoading(true);

    const selectedAddress = addresses.find(a => a._id === selected);

    const res = await API.post("/orders", {
      shippingAddress: selectedAddress,
      deliveryInstructions,
      couponCode: appliedCoupon
    });

    if (!res.data?.order?._id) {
      toast.error("Failed to create order");
      return;
    }

    const orderId = res.data.order._id;
    navigate(`/payment/${orderId}`);
  };

  // ---------------- Calculations ----------------
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.product.discountPrice || item.product.price) *
      item.quantity,
    0
  );

  const tax = subtotal * 0.05;
  const deliveryCharge = subtotal > 1000 ? 0 : 50;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-10">
        Checkout summary
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ---------------- LEFT SIDE - ADDRESS ---------------- */}
        <div className="lg:col-span-2 space-y-6">

          <Addresses
            type="checkout"
            selectedAddressId={selected}
            onSelectAddress={setSelected}
          />

        </div>

        {/* ---------------- RIGHT SIDE - ORDER SUMMARY ---------------- */}
        <div className="bg-white p-6 rounded-xl shadow-md border sticky top-24 h-fit">

          <h3 className="text-xl font-semibold mb-6">
            Order Summary
          </h3>

          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.product._id}
                className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  ₹
                  {(
                    (item.product.discountPrice ||
                      item.product.price) *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr className="mb-4" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{deliveryCharge}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({appliedCoupon})</span>
                <span>Applied</span>
              </div>
            )}

            {deliveryInstructions && (
              <div className="mt-3 text-gray-500 text-xs">
                <strong>Delivery Instructions:</strong>
                <p>{deliveryInstructions}</p>
              </div>
            )}

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total Payable</span>
              <span>
                ₹{(subtotal + tax + deliveryCharge).toFixed(2)}
              </span>
            </div>
          </div>

          <AppButton
            onClick={handleCheckout}
            disabled={loading}
            variant="primary"
            fullWidth
            className="mt-3"
            icon={<FaShoppingBag size={16} />}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </AppButton>

        </div>
      </div>
    </div>
  );
}

export default Checkout;