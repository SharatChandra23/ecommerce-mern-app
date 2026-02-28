const express = require("express");
const router = express.Router();
const {
    createPayment,
    getPayments,
    paymentSuccess,
    getPaymentById,
} = require("../controllers/paymentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminMiddleware");

// router.post("/", protect, createPayment);
router.post("/", protect, paymentSuccess);
router.get("/", protect, getPayments);
router.get("/:id", protect, getPaymentById);

module.exports = router;