const Payment = require("../models/Payment");

exports.createPayment = async (req, res) => {
    const payment = await Payment.create(req.body);
    res.json(payment);
};

exports.getPayments = async (req, res) => {
    const payments = await Payment.find().populate("order");
    res.json(payments);
};