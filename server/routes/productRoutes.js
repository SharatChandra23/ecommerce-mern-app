const express = require("express");
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const { adminProtect } = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/",
    adminProtect,
    upload.single("image"),  // field name must match frontend
    createProduct);

router.put("/:id",
    adminProtect,
    upload.single("image"),  // field name must match frontend
    updateProduct);
router.delete("/:id", adminProtect, deleteProduct);

module.exports = router;