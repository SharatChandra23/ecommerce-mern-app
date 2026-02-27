const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.adminProtect = async (req, res, next) => {
    try {

        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) return res.status(401).json({ success: false, message: "Not authorized, no token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id)
            .select("_id role email")
            .lean();

        if (!user || user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin access only" });
        }

        req.user = {
            _id: user._id,
            id: user._id,
            role: user.role,
            email: user.email,
            name: user.name
        };
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};