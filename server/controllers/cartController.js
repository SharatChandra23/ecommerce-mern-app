const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(cart);
};

exports.addToCart = async (req, res) => {
    try {
        let { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Product and quantity required"
            });
        }

        // IMPORTANT FIX
        quantity = Number(quantity);

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [
                    {
                        product: productId,
                        quantity
                    }
                ]
            });

            return res.status(201).json(cart);
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.log("Cart error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
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

exports.increaseQuantity = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            i => i.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // STOCK VALIDATION
        if (item.quantity >= product.stock) {
            return res.status(400).json({
                message: "Cannot add more. Stock limit reached."
            });
        }

        item.quantity += 1;

        await cart.save();

        res.json(cart);

    } catch (error) {
        console.log("Increase error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.decreaseQuantity = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            i => i.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Prevent negative
        if (item.quantity <= 1) {
            // Remove item if quantity becomes 0
            cart.items = cart.items.filter(
                i => i.product.toString() !== productId
            );
        } else {
            item.quantity -= 1;
        }

        await cart.save();

        res.json(cart);

    } catch (error) {
        console.log("Decrease error:", error);
        res.status(500).json({ message: error.message });
    }
};