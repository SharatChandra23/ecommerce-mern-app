const ReturnRequest = require("../models/ReturnRequest");

exports.returnRequest = async (req, res) => {
    const returnReq = await ReturnRequest.findById(req.params.id);

    if (!returnReq) return res.status(404).json({ message: "Not found" });

    returnReq.status = req.body.status; // Approved or Rejected
    await returnReq.save();

    res.json(returnReq);
};