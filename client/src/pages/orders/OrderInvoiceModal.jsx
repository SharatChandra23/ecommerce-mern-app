import { FaDownload } from "react-icons/fa";
import AppButton from "../../components/common/AppButton";

function InvoicePage({ order, onClose }) {
    if (!order) return null;

    const formatCurrency = (value) =>
        `₹${Number(value).toFixed(2)}`;

    const downloadInvoice = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-10 relative">

                {/* ================= ROW 1 ================= */}
                <div className="grid grid-cols-3 items-center mb-10">

                    {/* LEFT - ORDER */}
                    <div className="text-left">
                        <p className="text-sm text-gray-500">Order</p>
                        <p className="font-semibold text-lg">
                            #{order._id.slice(-6)}
                        </p>
                    </div>

                    {/* CENTER - INVOICE */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-wide">
                            Invoice
                        </h2>
                    </div>

                    {/* RIGHT - DATE */}
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                </div>

                {/* ================= ROW 2 ================= */}
                <div className="flex justify-between mb-12">

                    {/* LEFT - SHIPPING ADDRESS */}
                    <div>
                        <h4 className="font-semibold mb-3 text-gray-800">
                            Shipping Address
                        </h4>

                        <div className="text-sm text-gray-600 leading-relaxed">
                            <p>{order.shippingAddress?.fullName}</p>
                            <p>{order.shippingAddress?.addressLine}</p>
                            <p>
                                {order.shippingAddress?.city} -{" "}
                                {order.shippingAddress?.postalCode}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT - STORE INFO */}
                    <div className="text-right">
                        <h4 className="font-semibold text-gray-800 mb-3">
                            Your Store
                        </h4>
                        <p className="text-sm text-gray-600">
                            support@yourstore.com
                        </p>
                        <p className="text-sm text-gray-600">
                            +91 9999999999
                        </p>
                    </div>

                </div>

                {/* ================= ITEMS TABLE ================= */}
                <div className="border rounded-lg overflow-hidden mb-10">

                    <div className="grid grid-cols-4 bg-gray-100 p-4 text-sm font-semibold">
                        <span>Item</span>
                        <span className="text-center">Qty</span>
                        <span className="text-center">Price</span>
                        <span className="text-right">Subtotal</span>
                    </div>

                    {order.items.map((item) => (
                        <div
                            key={item._id}
                            className="grid grid-cols-4 p-4 text-sm border-t"
                        >
                            <span>{item.name}</span>
                            <span className="text-center">{item.quantity}</span>
                            <span className="text-center">
                                {formatCurrency(item.price)}
                            </span>
                            <span className="text-right font-medium">
                                {formatCurrency(item.subtotal)}
                            </span>
                        </div>
                    ))}

                </div>

                {/* ================= SUMMARY ================= */}
                <div className="flex justify-end mb-12">

                    <div className="w-full max-w-sm space-y-2 text-sm">

                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subtotalAmount)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>{formatCurrency(order.taxAmount)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span>{formatCurrency(order.deliveryCharge)}</span>
                        </div>

                        {order.discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>
                                    -{formatCurrency(order.discountAmount)}
                                </span>
                            </div>
                        )}

                        <hr />

                        <div className="flex justify-between font-bold text-lg">
                            <span>Total Paid</span>
                            <span>{formatCurrency(order.finalAmount)}</span>
                        </div>

                    </div>

                </div>

                {/* ================= BUTTON ROW ================= */}
                <div className="flex justify-between items-center">

                    {/* LEFT - CANCEL */}
                    <AppButton
                        variant="danger"
                        onClick={onClose}
                    >
                        Close
                    </AppButton>

                    {/* RIGHT - DOWNLOAD */}
                    <AppButton
                        variant="green"
                        icon={<FaDownload />}
                        onClick={downloadInvoice}
                    >
                        Download Invoice
                    </AppButton>

                </div>

            </div>
        </div>
    );
}

export default InvoicePage;