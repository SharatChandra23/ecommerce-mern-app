const express = require("express");
const router = express.Router();
const {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    decreaseQuantity,
    increaseQuantity,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", protect, removeFromCart);
router.put("increase/:productId", increaseQuantity);
router.put("decrease/:productId", decreaseQuantity);

module.exports = router;
