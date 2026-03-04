const express = require("express");
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

router.get("/", protect, getMyOrders);
router.put("/admin/:id/status", protect, adminOnly, updateOrderStatus);

router.get("/admin/all-orders", protect, adminOnly, getAllOrders);

module.exports = router;