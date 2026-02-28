const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(cart);
};

exports.addToCart = async (req, res) => {
    try {
        let { product, productId, quantity } = req.body;

        const finalProductId = productId || product;

        if (!finalProductId) {
            return res.status(400).json({
                success: false,
                message: "Product is required"
            });
        }

        quantity = Number(quantity);

        if (isNaN(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid quantity is required"
            });
        }

        // Find product
        const foundProduct = await Product.findById(finalProductId);

        if (!foundProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (foundProduct.stock <= 0) {
            return res.status(400).json({
                success: false,
                message: "Product is out of stock"
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            const safeQty = Math.min(quantity, foundProduct.stock);

            cart = await Cart.create({
                user: req.user._id,
                items: [
                    {
                        product: finalProductId,
                        quantity: safeQty
                    }
                ]
            });

            return res.status(201).json({
                success: true,
                cart
            });
        }

        // Check if product already exists
        const existingItem = cart.items.find(
            item => item.product.toString() === finalProductId
        );

        if (existingItem) {

            const newQty = existingItem.quantity + quantity;

            if (newQty > foundProduct.stock) {
                existingItem.quantity = foundProduct.stock;
            } else {
                existingItem.quantity = newQty;
            }

        } else {

            const safeQty = Math.min(quantity, foundProduct.stock);

            cart.items.push({
                product: finalProductId,
                quantity: safeQty
            });
        }

        await cart.save();

        res.json({
            success: true,
            cart
        });

    } catch (error) {
        console.error("Cart error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update cart"
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

exports.mergeGuestCart = async (req, res) => {
    try {
        const { guestItems } = req.body;

        if (!guestItems || guestItems.length === 0) {
            return res.json({ success: true });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: []
            });
        }

        for (const guestItem of guestItems) {
            const product = await Product.findById(guestItem.product._id);

            if (!product) continue;

            const existingItem = cart.items.find(
                item => item.product.toString() === product._id.toString()
            );

            const safeQty = Math.min(
                guestItem.quantity,
                product.stock
            );

            if (existingItem) {
                existingItem.quantity += safeQty;
            } else {
                cart.items.push({
                    product: product._id,
                    quantity: safeQty
                });
            }
        }

        await cart.save();

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.validateCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${item.product.name} stock insufficient`
                });
            }
        }

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};