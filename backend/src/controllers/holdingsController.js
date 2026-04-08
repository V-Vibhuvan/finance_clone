const Holdings = require("../models/HoldingsModel");
const wrapAsync = require("../middleware/wrapAsync");

module.exports.getHoldings = wrapAsync(async (req,res) => {
    const holdings = await Holdings.find({ user: req.user.id })
        .sort({ createdAt: -1 });

     res.json({
        success: true,
        count: holdings.length,
        holdings
    });
});

module.exports.deleteHolding = wrapAsync(async (req, res) => {
    const holding = await Holdings.findById(req.params.id);

    if (!holding) {
        return res.status(404).json({ message: "Holding not found" });
    }

    if (holding.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
    }

    await holding.deleteOne();

    res.json({
        success: true,
        message: "Holding deleted"
    });
});