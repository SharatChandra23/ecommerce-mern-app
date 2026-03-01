const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
    try {
        const payload = req.body;
        if (req.file) {
          payload.image = `/uploads/products/${req.file.filename}`;
        }
        const product = new Product(payload);
        await product.save();
        res.status(201).json({
            success: true,
            data: product,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

exports.getProducts = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 6, 1);
        const search = req.query.search || "";
        const category = req.query.category || "";
        const sort = req.query.sort || "newest";
        const minPrice = Number(req.query.minPrice) || 0;
        const maxPrice = req.query.maxPrice
            ? Number(req.query.maxPrice)
            : Number.MAX_SAFE_INTEGER;
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
        console.log("total ", total);
        console.log("limit ", limit);

        const products = await Product.find(query)
            .select("name price category stock image description discountPrice rating createdAt") // select only needed fields
            .populate({
                path: "category",
                select: "name" // only needed category fields
            })
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(); // VERY IMPORTANT

        const totalPages = Math.ceil(total / limit);
        console.log("totalPages ", totalPages);
        res.json({
            products,
            totalPages: totalPages,
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
    try {
        const existingProduct = await Product.findById(req.params.id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const payload = {
            ...req.body,
        };

        // Only update image if new file uploaded
        if (req.file) {
            payload.image = `/uploads/products/${req.file.filename}`; // req.file.path;
        }

        const modifiedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            payload,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: modifiedProduct,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
};