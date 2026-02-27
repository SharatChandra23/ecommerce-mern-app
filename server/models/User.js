const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return !v || /^[0-9]{10}$/.test(v);
                },
                message: "Phone number must be 10 digits"
            }
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        addresses: [
            {
                fullName: String,
                phone: String,
                addressLine: String,
                city: String,
                postalCode: String,
                isDefault: Boolean,
                isDeleted: { type: Boolean, default: false }
            }
        ]
    },
    { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phoneNumber: 1 }, { sparse: true });
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);