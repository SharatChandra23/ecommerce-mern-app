const express = require("express");
const router = express.Router();

const { adminProtect } = require("../middleware/adminMiddleware");
const { returnRequest } = require("../controllers/returnRequestController");

// router.get("/", getProducts);
// router.get("/:id", getProductById);

// router.post("/", protect, adminProtect, createProduct);
router.put("/:id", protect, adminProtect, returnRequest);
// router.delete("/:id", protect, adminProtect, deleteProduct);

module.exports = router;