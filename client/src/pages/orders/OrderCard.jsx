import AppButton from "../../components/common/AppButton";
import { FaEye, FaRedo, FaTimes } from "react-icons/fa";
import OrderStatusTimeline from "./OrderStatusTimeline";
import CustomStatusSelect from "../../components/common/CustomStatusSelect";

function OrderCard({ order, role, onView, onCancel, onReorder, loadingId, onStatusUpdate }) {

    const canCancel = order.status === "Pending";
    const canReorder = order.status === "Delivered";

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">

            {/* TOP ROW */}
            <div className="flex items-center justify-between mb-4">

                {/* LEFT STATUS */}
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {order.status}
                </span>

                {/* CENTER ORDER ID */}
                <h3 className="text-base font-semibold text-gray-800 text-center">
                    Order #{order._id.slice(-6)}
                </h3>

                {/* RIGHT VIEW BUTTON */}
                <AppButton
                    variant="blue"
                    className="text-sm px-4 py-2"
                    icon={<FaEye size={14} />}
                    onClick={() => onView(order)}
                >
                    View Details
                </AppButton>
            </div>

            {/* SECOND ROW */}
            <div className="flex justify-between text-sm text-gray-600 mb-4">
                <p>
                    Placed on:{" "}
                    <span className="font-medium text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                </p>

                <p className="font-semibold text-gray-900">
                    ₹{order.finalAmount}
                </p>
            </div>

            {/* TIMELINE */}
            <OrderStatusTimeline status={order.status} />

            <div className="flex gap-3 justify-between">
                {/* ADMIN STATUS */}
                {role === "admin" && (
                    <div className="mt-6 gap-3 justify-start">
                        <CustomStatusSelect
                            value={order.status}
                            disabled={loadingId === order._id}
                            onChange={(newStatus) =>
                                onStatusUpdate(order._id, newStatus)
                            }
                        />
                    </div>
                )}


                {/* ACTION BUTTONS */}
                <div className="mt-6 gap-3 justify-end">
                    {canCancel && (
                        <AppButton
                            variant="danger"
                            icon={<FaTimes size={12} />}
                            onClick={() => onCancel(order._id)}
                        >
                            Cancel Order
                        </AppButton>
                    )}
                    {canReorder && (
                        <AppButton
                            variant="green"
                            icon={<FaRedo size={12} />}
                            onClick={() => onReorder(order)}
                        >
                            Reorder
                        </AppButton>
                    )}
                </div>

            </div>

        </div>
    );
}

export default OrderCard;