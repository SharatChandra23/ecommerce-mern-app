const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get all users (Admin)
exports.getUsers = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const users = await User.find()
        .select("name email role createdAt")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    res.json(users);
};

// Get single user
exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id)
        .select("name email role createdAt")
        .lean();
    res.json(user);
};

// Delete user
exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
};


// ========================
//  GET PROFILE
// ========================
exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id)
        .select("-password -refreshToken");

    res.json(user);
};

// ========================
//  UPDATE PROFILE
// ========================
exports.updateProfile = async (req, res) => {
    const { name, phoneNumber } = req.body;

    const user = await User.findById(req.user.id);

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();

    res.json(user);
};

// ========================
//  CHANGE PASSWORD
// ========================
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Wrong current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated" });
};

// Addresses API's

// ========================
//  GET ADDRESS
// ========================
exports.getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("addresses");

        res.json(user.addresses.filter(a => !a.isDeleted));
        // res.json(user.addresses);
    } catch {
        res.status(500).json({ message: "Failed to fetch addresses" });
    }
};


// ========================
//  ADD ADDRESS
// ========================
exports.addAddress = async (req, res) => {
    try {
        const { fullName, phone, addressLine, city, postalCode } = req.body;

        if (!fullName || !phone || !addressLine || !city || !postalCode) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (!/^\d{6}$/.test(postalCode)) {
            return res.status(400).json({ message: "Invalid postal code" });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        const user = await User.findById(req.user.id);

        // If first address → make default automatically
        const isFirstAddress = user.addresses.length === 0;

        user.addresses.push({
            fullName,
            phone,
            addressLine,
            city,
            postalCode,
            isDefault: isFirstAddress,
        });

        await user.save();

        res.status(201).json(user.addresses);
    } catch {
        res.status(500).json({ message: "Failed to add address" });
    }
};


// ========================
//  UPDATE ADDRESS
// ========================
exports.updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        address.fullName = req.body.fullName || address.fullName;
        address.phone = req.body.phone || address.phone;
        address.addressLine = req.body.addressLine || address.addressLine;
        address.city = req.body.city || address.city;
        address.postalCode = req.body.postalCode || address.postalCode;

        await user.save();

        res.json(user.addresses);
    } catch {
        res.status(500).json({ message: "Failed to update address" });
    }
};

// ========================
//  DELETE ADDRESS
// ========================
exports.deleteAddress = async (req, res) => {
    const user = await User.findById(req.user.id);

    const address = user.addresses.id(req.params.id);

    if (!address) {
        return res.status(404).json({ message: "Address not found" });
    }

    address.isDeleted = true;

    if (address.isDefault) {
        const next = user.addresses.find(a => !a.isDeleted && a._id.toString() !== req.params.id);
        if (next) next.isDefault = true;
    }

    await user.save();

    res.json(user.addresses.filter(a => !a.isDeleted));
};

// ========================
//  SET DEFAULT ADDRESS
// ========================
exports.setDefaultAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Remove existing default
        user.addresses.forEach(addr => {
            addr.isDefault = false;
        });

        address.isDefault = true;

        await user.save();

        res.json(user.addresses);
    } catch {
        res.status(500).json({ message: "Failed to set default address" });
    }
};