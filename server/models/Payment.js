const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        },
        paymentMethod: String,
        status: String,
        transactionId: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);