import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Checkout() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      const res = await API.get("/user/addresses");
      setAddresses(res.data);

      const defaultAddr = res.data.find(a => a.isDefault);
      if (defaultAddr) setSelected(defaultAddr._id);
    };

    loadAddresses();
  }, []);

  const handleCheckout = async () => {
    if (!selected) return alert("Select address");

    setLoading(true);

    const selectedAddress = addresses.find(a => a._id === selected);

    const res = await API.post("/orders", {
      shippingAddress: selectedAddress
    });

    if (!res.data?.order?._id) {
      toast.error("Failed to create order");
      return;
    }
    const orderId = res.data?.order?._id;
    navigate(`/payment/${orderId}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Shipping Address</h2>

      {addresses.map(addr => (
        <div
          key={addr._id}
          className={`border p-4 rounded mb-4 ${selected === addr._id ? "border-blue-500" : ""
            }`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="address"
              checked={selected === addr._id}
              onChange={() => setSelected(addr._id)}
            />
            <div>
              <p className="font-semibold">{addr.fullName}</p>
              <p>{addr.addressLine}</p>
              <p>{addr.city} - {addr.postalCode}</p>
              {addr.isDefault && (
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
          </label>
        </div>
      ))}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
}

export default Checkout;