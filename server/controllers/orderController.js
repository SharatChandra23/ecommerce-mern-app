const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
    const order = await Order.create({
        ...req.body,
        user: req.user.id,
    });
    res.json(order);
};

exports.getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
};

exports.getAllOrders = async (req, res) => {
    const orders = await Order.find().populate("user");
    res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );
    res.json(order);
};