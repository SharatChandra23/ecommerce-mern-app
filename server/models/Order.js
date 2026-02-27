const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                name: String,
                image: String,
                price: Number,          // snapshot original price
                discountPrice: Number,  // snapshot discounted price
                quantity: Number,
                subtotal: Number
            }
        ],
        subtotalAmount: Number,     // before tax & discount
        taxAmount: Number,
        discountAmount: Number,
        deliveryCharge: Number,
        finalAmount: Number,

        coupon: {
            code: String,
            discountType: String, // percentage / fixed
            discountValue: Number,
        },

        deliveryInstructions: String,

        shippingAddress: Object,

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },

        status: {
            type: String,
            enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },

        paidAt: Date,
    },
    { timestamps: true }
);

orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);