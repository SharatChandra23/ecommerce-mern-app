const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect (User + Admin)
exports.protect = async (req, res, next) => {
    try {
        // console.log("Authorization Header:", req.headers.authorization);
        // Read accessToken from cookie
        // const token = req.cookies.accessToken;
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id)
            .select("_id role email")
            .lean();

        if (!user) {
            return res.status(401).json({ success: false, message: "User no longer exists" });
        }

        req.user = {
            _id: user._id,
            id: user._id,
            role: user.role,
            email: user.email,
            name: user.name
        };;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token invalid or expired" });
    }
};

exports.adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};
