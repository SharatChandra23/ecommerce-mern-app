const express = require("express");
const router = express.Router();
const {
    createPayment,
    getPayments,
} = require("../controllers/paymentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createPayment);
router.get("/", protect, adminOnly, getPayments);

module.exports = router;