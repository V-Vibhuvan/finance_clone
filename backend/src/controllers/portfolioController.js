const Holdings = require("../models/HoldingsModel");
const Wallet = require("../models/WalletModel");

const wrapAsync = require("../middleware/wrapAsync");

module.exports.getPortfolioSummary = wrapAsync(async (req, res) => {

    const holdings = await Holdings.find({ user: req.user.id });

    let wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
        wallet = { balance: 0 };
    }

    let totalInvestment = 0;
    let holdingsValue = 0;

    const detailed = holdings.map(h => {

        const invested = h.avg * h.qty;
        const current = h.price * h.qty;
        const pnl = current - invested;

        totalInvestment += invested;
        holdingsValue += current;

        return {
            name: h.name,
            qty: h.qty,
            avg: h.avg,
            price: h.price,
            invested,
            current,
            pnl
        };
    });

    const totalCurrentValue = wallet.balance + holdingsValue;

    const totalPNL = totalCurrentValue - totalInvestment;

    res.json({
        success: true,

        walletBalance: wallet.balance,

        totalInvestment,          // only invested money
        holdingsValue,            // current stock value
        totalCurrentValue,        // wallet + stocks

        totalPNL,

        holdings: detailed
    });
});