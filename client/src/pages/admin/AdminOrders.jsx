import { useEffect, useState } from "react";
import API from "../../api/api";

function OrderManagement() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await API.get("/orders/admin/all-orders");
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/orders/admin/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order._id}
            className="border p-4 rounded shadow"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  Order ID: {order._id}
                </p>
                <p>User: {order.user}</p>
                <p>Total: ₹{order.totalAmount}</p>
              </div>

              <div>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                  className="border px-3 py-2 rounded"
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              {order.items.map(item => (
                <div key={item._id}>
                  {item.name} x {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderManagement;