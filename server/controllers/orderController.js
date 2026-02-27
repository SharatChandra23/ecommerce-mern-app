const Cart = require("../models/Cart");
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, couponCode, deliveryInstructions } = req.body;

        const cart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Prepare order items (snapshot)
        const orderItems = cart.items.map(item => {
            const finalPrice =
                item.product.discountPrice || item.product.price;

            return {
                product: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                discountPrice: finalPrice,
                quantity: item.quantity,
                subtotal: finalPrice * item.quantity
            };
        });

        // ✅ Correct subtotal
        const subtotalAmount = orderItems.reduce(
            (acc, item) => acc + item.subtotal,
            0
        );

        const taxAmount = subtotalAmount * 0.05;

        const deliveryCharge =
            subtotalAmount > 1000 ? 0 : 50;

        let discountAmount = 0;
        let coupon = null;

        if (couponCode) {
            const foundCoupon = await Coupon.findOne({
                code: couponCode,
                isActive: true,
                expiryDate: { $gt: new Date() }
            });

            if (foundCoupon) {
                coupon = {
                    code: foundCoupon.code,
                    discountType: foundCoupon.discountType,
                    discountValue: foundCoupon.discountValue
                };

                if (foundCoupon.discountType === "percentage") {
                    discountAmount =
                        (subtotalAmount * foundCoupon.discountValue) / 100;
                } else {
                    discountAmount = foundCoupon.discountValue;
                }
            }
        }

        const finalAmount =
            subtotalAmount +
            taxAmount +
            deliveryCharge -
            discountAmount;

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            subtotalAmount,
            taxAmount,
            discountAmount,
            deliveryCharge,
            finalAmount,
            coupon,
            deliveryInstructions,
            shippingAddress,
            paymentStatus: "Pending",
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
};

exports.getAllOrders = async (req, res) => {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "Delivered" || order.status === status) {
            return res.status(400).json({
                message: "Delivered orders cannot be changed"
            });
        }

        order.status = status;
        await order.save();

        res.json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
