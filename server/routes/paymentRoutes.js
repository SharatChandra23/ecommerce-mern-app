const express = require("express");
const router = express.Router();
const {
    createPayment,
    getPayments,
    paymentSuccess,
} = require("../controllers/paymentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminMiddleware");

router.post("/", protect, createPayment);
router.post("/", adminProtect, paymentSuccess);
router.get("/", protect, adminOnly, getPayments);

module.exports = router;