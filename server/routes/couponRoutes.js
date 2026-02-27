const express = require("express");
const router = express.Router();

const {
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { applyCoupon, createCoupon, updateCoupon, deleteCoupon, getAllCoupons } = require("../controllers/couponController");
const { adminProtect } = require("../middleware/adminMiddleware");

router.post("/", adminProtect, createCoupon);
router.put("/:id", adminProtect, updateCoupon);
router.delete("/:id", adminProtect, deleteCoupon);

router.get("/", protect, getAllCoupons);
router.post("/apply-coupon", protect, applyCoupon);

module.exports = router;