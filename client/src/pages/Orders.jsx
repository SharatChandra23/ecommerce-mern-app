import { useEffect, useState } from "react";
import API from "../api/api";
import { OrderTimeline } from "./orders/OrderStatusTimeline";
import toast from "react-hot-toast";
import CustomStatusSelect from "../components/common/CustomStatusSelect";
import { FaEye, FaTimes } from "react-icons/fa";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [role, setRole] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // ---------------- GET ROLE ----------------
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user")) || {};
        if (userInfo?.role) {
            setRole(userInfo.role);
        }
    }, []);

    // ---------------- LOAD ORDERS ----------------
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
            toast.error("Failed to load orders");
        }
    };

    useEffect(() => {
        if (role) loadOrders();
    }, [role]);

    // ---------------- UPDATE STATUS (ADMIN) ----------------
    const updateStatus = async (id, status) => {
        try {
            setLoadingId(id);
            await API.put(`/orders/admin/${id}/status`, { status });
            toast.success("Order status updated");
            loadOrders();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Update failed"
            );
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">

            <h2 className="text-3xl font-bold mb-10">
                {role === "admin" ? "Manage Orders" : "My Orders"}
            </h2>

            {orders.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    No orders found.
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white p-6 rounded-xl shadow border hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start">

                                <div>
                                    <p className="font-semibold text-lg">
                                        Order #{order._id.slice(-6)}
                                    </p>

                                    {role === "admin" && (
                                        <p className="text-sm text-gray-500">
                                            User: {order.user?.name || order.user}
                                        </p>
                                    )}

                                    <p className="mt-2 text-sm text-gray-600">
                                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>

                                    <p className="mt-2 font-medium">
                                        Total: ₹{order.finalAmount}
                                    </p>
                                </div>

                                {/* ADMIN STATUS */}
                                {role === "admin" ? (
                                    <CustomStatusSelect
                                        value={order.status}
                                        disabled={loadingId === order._id}
                                        onChange={(newStatus) =>
                                            updateStatus(order._id, newStatus)
                                        }
                                    />
                                ) : (
                                    <span className="px-4 py-2 text-sm rounded-full bg-blue-100 text-blue-700">
                                        {order.status}
                                    </span>
                                )}
                            </div>

                            {/* ACTION BUTTON */}
                            <div className="mt-5 flex justify-end">
                                <button
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowModal(true);
                                    }}
                                    className="flex items-center gap-2 text-blue-600 hover:underline"
                                >
                                    <FaEye /> View Details
                                </button>
                            </div>

                            {/* USER TIMELINE */}
                            {role !== "admin" && (
                                <div className="mt-6">
                                    <OrderTimeline status={order.status} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ---------------- ORDER DETAILS MODAL ---------------- */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-8 relative animate-fadeIn">

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        >
                            <FaTimes size={18} />
                        </button>

                        <h3 className="text-2xl font-bold mb-6">
                            Order Details
                        </h3>

                        {/* ITEMS */}
                        <div className="space-y-4 mb-6">
                            {selectedOrder.items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex justify-between items-center border-b pb-3"
                                >
                                    <div className="flex items-center gap-4">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-14 h-14 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                ₹{item.discountPrice || item.price} × {item.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="font-medium">
                                        ₹{item.subtotal}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* SUMMARY */}
                        <div className="bg-gray-50 p-5 rounded-lg space-y-2 text-sm">

                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{selectedOrder.subtotalAmount}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹{selectedOrder.taxAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span>₹{selectedOrder.deliveryCharge}</span>
                            </div>

                            {selectedOrder.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{selectedOrder.discountAmount}</span>
                                </div>
                            )}

                            <hr />

                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Paid</span>
                                <span>₹{selectedOrder.finalAmount}</span>
                            </div>

                            {selectedOrder.coupon?.code && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Coupon Applied: {selectedOrder.coupon.code}
                                </p>
                            )}

                            {selectedOrder.deliveryInstructions && (
                                <div className="text-xs text-gray-500 mt-2">
                                    <strong>Delivery Instructions:</strong>
                                    <p>{selectedOrder.deliveryInstructions}</p>
                                </div>
                            )}

                            {/* <div className="mt-3 text-xs">
                                Payment Status:{" "}
                                <span className="font-semibold">
                                    {selectedOrder.paymentStatus}
                                </span>
                            </div> */}

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default Orders;