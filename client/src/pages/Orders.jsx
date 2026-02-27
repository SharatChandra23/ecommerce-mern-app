import { useEffect, useState } from "react";
import API from "../api/api";
import { OrderTimeline } from "./OrderTimeline";
import toast from "react-hot-toast";
import CustomStatusSelect from "../components/common/CustomStatusSelect";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loadingId, setLoadingId] = useState(false);
    const [role, setRole] = useState("");

    useEffect(() => {
        // Get role from localStorage (or your auth context)
        const userInfo = JSON.parse(localStorage.getItem("user")) || {};
        if (userInfo) {
            setRole(userInfo.role);
        }
    }, []);

    const loadOrders = async () => {
        try {
            let res;

            if (role === "admin") {
                res = await API.get("/orders/admin/all-orders");
            } else {
                res = await API.get("/orders");
            }

            setOrders(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (role) {
            loadOrders();
        }
    }, [role]);

    const updateStatus = async (id, status) => {
        try {
            setLoadingId(id);
            await API.put(`/orders/admin/${id}/status`, { status });
            toast.success("Order status updated successfully");
            loadOrders(); // Refresh
        } catch (error) {
            console.error(error);
            const message =
                error.response?.data?.message ||
                "Something went wrong";
            toast.error(message);
        } finally {
            setLoadingId(null);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Shipped":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "Delivered":
                return "bg-green-100 text-green-800 border-green-300";
            case "Cancelled":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
                {role === "admin" ? "Manage Orders" : "My Orders"}
            </h2>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div
                        key={order._id}
                        className="border p-4 rounded mb-6 shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">
                                    Order ID: {order._id}
                                </p>

                                {role === "admin" && (
                                    <p>User: {order.user?.name || order.user}</p>
                                )}

                                <p>
                                    Total: ₹{order.totalAmount || order.totalPrice}
                                </p>
                            </div>

                            {/* Admin Status Dropdown */}
                            {role === "admin" ? (

                                <CustomStatusSelect
                                    value={order.status}
                                    disabled={loadingId === order._id}
                                    onChange={(newStatus) =>
                                        updateStatus(order._id, newStatus)
                                    }
                                />

                            ) : (
                                <p className="font-medium">
                                    Status: {order.status}
                                </p>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="mt-3">
                            {order.items?.map((item) => (
                                <div key={item._id}>
                                    {item.name} x {item.quantity}
                                </div>
                            ))}
                        </div>

                        {/* Timeline only for normal user */}
                        {role !== "admin" && (
                            <OrderTimeline status={order.status} />
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Orders;