const Payment = require("../models/Payment");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");

exports.createPayment = async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    order.status = "Paid";
    await order.save();

    res.json({ message: "Payment successful" });
};

exports.getPayments = async (req, res) => {
    const payments = await Payment.find()
        .select("amount status createdAt order")
        .populate({
            path: "order",
            select: "orderNumber totalAmount"
        })
        .lean();
    res.json(payments);
};

exports.paymentSuccess = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId)
            .session(session);

        if (!order) {
            throw new Error("Order not found");
        }

        // Prevent double payment
        if (order.paymentStatus === "Paid") {
            throw new Error("Order already paid");
        }

        // Reduce stock safely
        for (const item of order.items) {
            const product = await Product.findById(item.product)
                .session(session);

            if (!product) {
                throw new Error("Product not found");
            }

            if (product.stock < item.quantity) {
                throw new Error(
                    `Insufficient stock for ${product.name}`
                );
            }

            product.stock -= item.quantity;
            await product.save({ session });
        }

        // Mark order paid
        order.paymentStatus = "Paid";
        order.paidAt = new Date();

        if (order.coupon?.code) {
            await Coupon.findOneAndUpdate(
                { code: order.coupon.code },
                { $inc: { usedCount: 1 } }
            );
        }

        await order.save({ session });

        // Clear cart
        await Cart.findOneAndUpdate(
            { user: order.user },
            { items: [] },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.json({
            success: true,
            message: "Payment successful",
            cart: [],
            cartCount: 0
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
