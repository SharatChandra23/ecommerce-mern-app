const Coupon = require("../models/Coupon");


exports.getAllCoupons = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            status = "all"
        } = req.query;

        const query = {};

        //  Search by code
        if (search) {
            query.code = { $regex: search, $options: "i" };
        }

        //  Filter by status
        if (status === "active") {
            query.isActive = true;
            query.expiryDate = { $gt: new Date() };
        }

        if (status === "inactive") {
            query.isActive = false;
        }

        if (status === "expired") {
            query.expiryDate = { $lt: new Date() };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Coupon.countDocuments(query);

        res.json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            coupons
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createCoupon = async (req, res) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minOrderAmount,
            expiryDate,
            usageLimit
        } = req.body;

        // Validate discount
        if (discountType === "percentage" && discountValue > 100) {
            return res.status(400).json({
                success: false,
                message: "Percentage discount cannot exceed 100"
            });
        }

        const existingCoupon = await Coupon.findOne({
            code: code.toUpperCase()
        });

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists"
            });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minOrderAmount,
            expiryDate,
            usageLimit
        });

        res.status(201).json({
            success: true,
            coupon
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            coupon: updatedCoupon
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        coupon.isActive = false;
        await coupon.save();

        res.json({
            success: true,
            message: "Coupon deactivated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.hardDeleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Coupon deleted permanently"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.applyCoupon = async (req, res) => {
    try {
        const { code, subtotalAmount } = req.body;

        const coupon = await Coupon.findOne({
            code,
            isActive: true,
            expiryDate: { $gt: new Date() }
        });

        if (!coupon) {
            return res.status(400).json({
                message: "Invalid or expired coupon"
            });
        }

        // Minimum order validation
        if (subtotalAmount < coupon.minOrderAmount) {
            return res.status(400).json({
                message: `Minimum order amount ₹${coupon.minOrderAmount} required`
            });
        }

        // Usage limit validation
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                message: "Coupon usage limit exceeded"
            });
        }

        let discountAmount = 0;

        if (coupon.discountType === "percentage") {
            discountAmount =
                (subtotalAmount * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
        }

        res.json({
            success: true,
            discountAmount,
            coupon
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
