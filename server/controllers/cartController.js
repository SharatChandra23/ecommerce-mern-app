const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(cart);
};

exports.addToCart = async (req, res) => {
    const { product, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user.id,
            items: [{ product, quantity }],
        });
    } else {
        cart.items.push({ product, quantity });
        await cart.save();
    }

    res.json(cart);
};

exports.updateCartItem = async (req, res) => {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id })
        .populate("items.product");

    const item = cart.items.find(
        (i) => i.product._id.toString() === req.params.productId
    );

    if (!item)
        return res.status(404).json({ message: "Item not found" });

    if (quantity > item.product.stock) {
        return res
            .status(400)
            .json({ message: "Quantity exceeds stock" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
};

exports.removeFromCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id });

    cart.items = cart.items.filter(
        item => item.product.toString() !== req.params.productId
    );

    await cart.save();
    res.json(cart);
};