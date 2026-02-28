import { useEffect, useState } from "react";
import API from "../../api/api";
import OrderInvoiceModal from "./OrderInvoiceModal";
import OrderCard from "./OrderCard";
import toast from "react-hot-toast";

function OrdersList() {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loadingId, setLoadingId] = useState(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user")) || {};
        setRole(userInfo.role);

        loadOrders(userInfo.role);
    }, []);

    const loadOrders = async (role) => {
        let res;
        if (role === "admin") {
            res = await API.get("/orders/admin/all-orders");
        } else {
            res = await API.get("/orders");
        }
        setOrders(res.data);
    };

    const cancelOrder = async (id) => {
        try {
            await API.put(`/orders/${id}/cancel`);
            loadOrders(role);
        } catch (err) {
            console.error(err);
        }
    };

    const reorder = async (order) => {
        try {
            for (const item of order.items) {
                await API.post("/cart", {
                    productId: item.product,
                    quantity: item.quantity
                });
            }
            window.location.href = "/cart";
        } catch (err) {
            console.error(err);
        }
    };

    const onStatusUpdate = async (id, status) => {
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
        <div className="max-w-5xl mx-auto p-6 space-y-6">

            {orders.map(order => (
                <OrderCard
                    key={order._id}
                    order={order}
                    role={role}
                    onView={setSelectedOrder}
                    onCancel={cancelOrder}
                    onReorder={reorder}
                    loadingId={loadingId}
                    onStatusUpdate={onStatusUpdate}
                />
            ))}

            {selectedOrder && (
                <OrderInvoiceModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

        </div>
    );
}

export default OrdersList;