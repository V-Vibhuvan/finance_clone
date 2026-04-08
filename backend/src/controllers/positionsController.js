const Positions = require("../models/PositionsModel");
const wrapAsync = require("../middleware/wrapAsync");

module.exports.getPositions = wrapAsync(async (req, res) => {
    const positions = await Positions.find({ user: req.user.id });

    const updatedPositions = positions.map(p => ({
        ...p._doc,
        isLoss: p.price < p.avg,
        pnl: (p.price - p.avg) * p.qty
    }));

    res.json({
        success: true,
        positions: updatedPositions
    });
});