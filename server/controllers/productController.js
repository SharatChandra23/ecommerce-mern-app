const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.json(product);
};

exports.getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const search = req.query.search || "";
        const category = req.query.category || "";
        const sort = req.query.sort || "newest";
        const minPrice = Number(req.query.minPrice) || 0;
        const maxPrice = Number(req.query.maxPrice) || 100000;
        const rating = Number(req.query.rating) || 0;

        const query = {
            price: { $gte: minPrice, $lte: maxPrice },
        };

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (category) {
            query.category = category;
        }

        if (rating > 0) {
            query.rating = { $gte: rating };
        }

        let sortOption = {};
        if (sort === "price_low") sortOption.price = 1;
        if (sort === "price_high") sortOption.price = -1;
        if (sort === "newest") sortOption.createdAt = -1;

        const total = await Product.countDocuments(query);

        const products = await Product.find(query)
            .populate("category")
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category");
    res.json(product);
};

exports.updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(product);
};

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
};