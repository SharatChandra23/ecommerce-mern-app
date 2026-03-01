require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const csrf = require("csurf");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// ===============================
//  CONNECT DATABASE FIRST
// ===============================
connectDB();

// ===============================
//  SECURITY MIDDLEWARE
// ===============================

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// Prevent NoSQL injection
// app.use(mongoSanitize());

// Compression (only once)
app.use(compression());

// ===============================
//  CORS CONFIGURATION
// ===============================

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    process.env.FRONTEND_URL,
].filter(Boolean); // remove undefined values

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, false); // safer than throwing error
            }
        },
        credentials: true,
    })
);

// ===============================
//  BODY PARSING
// ===============================

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
//  RATE LIMITING (Production Only)
// ===============================

if (process.env.NODE_ENV === "production") {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use("/api", limiter);
}

// ====================================================
//  CSRF PROTECTION (Only for state-changing methods)
// ====================================================

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    },
});

// Route to generate CSRF token
app.get("/api/auth/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Apply CSRF only to state-changing routes
app.use("/api", (req, res, next) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
        return csrfProtection(req, res, next);
    }
    next();
});

// ===============================
//  TRUST PROXY (Production Only)
// ===============================

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// ===============================
//  ROUTES
// ===============================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/profileRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

// ===============================
//  HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "Server is running" });
});

// ===============================
//  ERROR HANDLER (LAST)
// ===============================

app.use(errorHandler);

// ===============================
//  GRACEFUL SHUTDOWN
// ===============================

process.on("SIGINT", () => {
    console.log("Gracefully shutting down...");
    process.exit(0);
});

// ===============================
//  START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});