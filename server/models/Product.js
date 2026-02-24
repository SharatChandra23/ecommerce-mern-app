const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        price: Number,
        stock: Number,
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        image: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);