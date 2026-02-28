const Payment = require("../models/Payment");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");

exports.createPayment = async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    order.paymentStatus = "Paid";
    order.status = "Pending";
    await order.save();

    res.json({ message: "Payment successful" });
};

exports.getPayments = async (req, res) => {
    try {
        let query = {};

        // If NOT admin → filter by user
        if (req.user.role !== "admin") {
            query.user = req.user._id;
        }

        const page = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;


        const payments = await Payment.find(query)
            .select("amount status createdAt order user")
            .populate({
                path: "order",
                select: "orderNumber finalAmount"
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate({
                path: "order",
                select: "orderNumber finalAmount user"
            });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        // If user → ensure ownership
        if (
            req.user.role !== "admin" &&
            payment.user.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        res.json({
            success: true,
            payment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.paymentSuccess = async (req, res) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        const { orderId } = req.body;

        if (!orderId) {
            throw new Error("Order ID is required");
        }

        const order = await Order.findById(orderId); //.session(session);

        if (!order) {
            throw new Error("Order not found");
        }

        // Idempotency protection
        if (order.paymentStatus === "Paid") {
            // await session.commitTransaction();
            // session.endSession();

            return res.json({
                success: true,
                message: "Order already processed"
            });
        }

        //  Atomic stock reduction
        for (const item of order.items) {
            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: { stock: -item.quantity }
                },
                {
                    new: true,
                    // session
                }
            );

            if (!updatedProduct) {
                throw new Error("Insufficient stock for item");
            }
        }

        // Proper coupon validation
        if (order.coupon?.code) {
            const coupon = await Coupon.findOne({
                code: order.coupon.code
            }); // .session(session);

            if (!coupon) {
                throw new Error("Coupon not found");
            }

            if (
                coupon.usageLimit &&
                coupon.usedCount >= coupon.usageLimit
            ) {
                throw new Error("Coupon usage limit exceeded");
            }

            coupon.usedCount += 1;
            await coupon.save(
                // { session }
            );
        }

        //  Mark order paid
        order.paymentStatus = "Paid";
        order.status = "Pending"; // keep order workflow correct
        order.paidAt = new Date();

        await order.save(
            // { session }
        );

        //  Clear cart after successful payment
        await Cart.findOneAndUpdate(
            { user: order.user },
            { $set: { items: [] } },
            // { session }
        );

        // await session.commitTransaction();
        // session.endSession();

        res.json({
            success: true,
            message: "Payment successful",
            cart: [],
            cartCount: 0
        });

    } catch (error) {
        // await session.abortTransaction();
        // session.endSession();

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
