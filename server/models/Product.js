const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        discountPrice: {
            type: Number,
            min: 0
        },

        description: {
            type: String,
            required: true
        },

        stock: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true
        },

        image: { type: String }
    },
    { timestamps: true }
);

productSchema.index({ name: "text", description: "text" }); // search
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);