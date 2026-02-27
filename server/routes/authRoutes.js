const express = require("express");
const router = express.Router();
const { signup, login, getMe, logout, refreshToken } = require("../controllers/authController");

const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.get("/refresh", refreshToken);

// Login rate limiter (stronger)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 attempts only
    message: "Too many login attempts. Try again later.",
});

router.post("/login", loginLimiter, login);

router.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

router.post("/logout", protect, logout);
router.get("/me", protect, getMe);


module.exports = router;