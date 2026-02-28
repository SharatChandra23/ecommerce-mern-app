const express = require("express");
const router = express.Router();
const {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    decreaseQuantity,
    increaseQuantity,
    mergeGuestCart,
    validateCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", protect, removeFromCart);
router.put("/increase/:productId", protect, increaseQuantity);
router.put("/decrease/:productId", protect, decreaseQuantity);
router.post("/merge", protect, mergeGuestCart);
router.post("/validate", protect, validateCart);

module.exports = router;
