import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/api";
import toast from "react-hot-toast";
import AppButton from "./AppButton";
import { FaTimes } from "react-icons/fa";

export default function CartCouponDrawer({
    open,
    onClose,
    subtotal,
    onApply
}) {
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        if (open) loadCoupons();
    }, [open]);

    const loadCoupons = async () => {
        try {
            const res = await API.get("/coupons?status=active");
            setCoupons(res.data.coupons);
        } catch {
            toast.error("Failed to load coupons");
        }
    };

    const applyCoupon = async (coupon) => {
        try {
            const res = await API.post("/coupons/apply-coupon", {
                code: coupon.code,
                subtotalAmount: subtotal
            });

            onApply(res.data.discountAmount, coupon.code);
            toast.success("Coupon applied");
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 260, damping: 25 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, info) => {
                            if (info.offset.x > 120) {
                                onClose();
                            }
                        }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[40%] bg-white z-50 shadow-2xl flex flex-col"
                    >
                        {/* Edge Shadow */}
                        <div className="absolute left-0 top-0 h-full w-3 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />

                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold">
                                Available Coupons
                            </h3>
                            <AppButton
                                onClick={onClose}
                                variant="danger"
                                icon={<FaTimes size={14} />}
                            />
                        </div>

                        {/* Coupon List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {coupons.length === 0 ? (
                                <p className="text-gray-500">
                                    No active coupons
                                </p>
                            ) : (
                                coupons.map((c) => (
                                    <motion.div
                                        key={c._id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="border p-4 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition"
                                    >
                                        <div>
                                            <p className="font-semibold text-lg">
                                                {c.code}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {c.discountValue}
                                                {c.discountType === "percentage"
                                                    ? "% OFF"
                                                    : "₹ OFF"}
                                            </p>
                                        </div>

                                        <AppButton
                                            onClick={() => applyCoupon(c)}
                                            variant="yellow"
                                        >
                                            Apply
                                        </AppButton>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}