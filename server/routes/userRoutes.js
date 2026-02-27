const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUserById,
    deleteUser,
} = require("../controllers/userController");

const { adminOnly } = require("../middleware/authMiddleware");

router.get("/", adminOnly, getUsers);
router.get("/:id", adminOnly, getUserById);
router.delete("/:id", adminOnly, deleteUser);

module.exports = router;