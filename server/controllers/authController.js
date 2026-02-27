const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { generateAccessToken, generateRefreshToken, hashToken } = require("../utils/tokenUtils");

// ========================
//  SIGNUP
// ========================
exports.signup = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All required fields missing" });
        }

        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (phoneNumber) {
            const phoneExists = await User.findOne({ phoneNumber }).lean();
            if (phoneExists) {
                return res.status(400).json({ message: "Phone number already exists" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user WITHOUT refresh token first
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber: phoneNumber || undefined,
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;

        await user.save(); // single save

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(201).json({
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ========================
//  LOGIN
// ========================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Hash refresh token before saving
        user.refreshToken = hashToken(refreshToken);
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ========================
//  REFRESH TOKEN
// ========================
exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || !user.refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const hashedIncoming = hashToken(token);

        if (user.refreshToken !== hashedIncoming) {
            return res.status(403).json({ message: "Token mismatch" });
        }

        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        return res.status(403).json({ message: "Refresh failed" });
    }
};

// ========================
//  GET ME
// ========================
exports.getMe = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(req.user.id)
            .select("-password -refreshToken")
            .lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

// ========================
//  lOGOUT
// ========================
exports.logout = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (token) {
        const hashed = hashToken(token);

        const user = await User.findOne({ refreshToken: hashed });

        if (user) {
            user.refreshToken = null;
            await user.save();
        }
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
};
