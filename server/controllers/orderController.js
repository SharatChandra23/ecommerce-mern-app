const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
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

        // 1. Validate stock first
        for (const item of cart.items) {
            if (!item.product) {
                return res.status(400).json({
                    success: false,
                    message: "Product not found"
                });
            }

            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${item.product.name} is out of stock`
                });
            }
        }

        // 2. Prepare snapshot
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
                subtotal: Number((finalPrice * item.quantity).toFixed(2))
            };
        });

        // 3. Calculate subtotal
        const subtotalAmount = Number(
            orderItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)
        );

        const taxAmount = Number((subtotalAmount * 0.05).toFixed(2));

        const deliveryCharge =
            subtotalAmount > 1000 ? 0 : 50;

        let discountAmount = 0;
        let coupon = null;

        // 4. Coupon Validation
        if (couponCode) {
            const foundCoupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true,
                expiryDate: { $gt: new Date() }
            });

            if (!foundCoupon) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired coupon"
                });
            }

            if (subtotalAmount < foundCoupon.minOrderAmount) {
                return res.status(400).json({
                    success: false,
                    message: `Minimum order ₹${foundCoupon.minOrderAmount} required`
                });
            }

            if (foundCoupon.usedCount >= foundCoupon.usageLimit) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon usage limit exceeded"
                });
            }

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

            discountAmount = Number(discountAmount.toFixed(2));
        }

        // Prevent negative totals
        if (discountAmount > subtotalAmount) {
            discountAmount = subtotalAmount;
        }

        const finalAmount = Number(
            (
                subtotalAmount +
                taxAmount +
                deliveryCharge -
                discountAmount
            ).toFixed(2)
        );

        // 5. Create order
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
