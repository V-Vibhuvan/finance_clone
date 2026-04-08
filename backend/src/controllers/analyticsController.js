const Transaction = require("../models/TransactionModel");
const Holdings = require("../models/HoldingsModel");

const wrapAsync = require("../middleware/wrapAsync");

module.exports.getDailyPNL = wrapAsync(async (req, res) => {
    const transactions = await Transaction.find({
        user: req.user.id
    }).sort({ createdAt: 1 });

    let cumulative = 0;

    const result = [];

    transactions.forEach(txn => {
        if (!txn.createdAt) return;

        if (txn.type === "SELL") {
            cumulative += txn.amount;
        } else if (txn.type === "BUY") {
            cumulative -= txn.amount;
        }

        result.push({
            date: txn.createdAt.toISOString(), 
            pnl: cumulative
        });
    });

    res.json({
        success: true,
        data: result
    });
});

module.exports.getInvestmentStats = wrapAsync(async (req, res) => {

    const holdings = await Holdings.find({ user: req.user.id });

    let investment = 0;
    let current = 0;

    holdings.forEach(h => {
        investment += h.avg * h.qty;
        current += h.price * h.qty;
    });

    res.json({
        success: true,
        investment,
        current,
        profit: current - investment
    });
});

module.exports.getTopPerformers = wrapAsync(async (req, res) => {

    const holdings = await Holdings.find({ user: req.user.id });

    let best = null;
    let worst = null;

    holdings.forEach(h => {
        const pnl = (h.price - h.avg) * h.qty;

        if (!best || pnl > best.pnl) {
            best = { name: h.name, pnl };
        }

        if (!worst || pnl < worst.pnl) {
            worst = { name: h.name, pnl };
        }
    });

    res.json({
        success: true,
        best,
        worst
    });
});

module.exports.getAllocation = wrapAsync(async (req, res) => {

    const holdings = await Holdings.find({ user: req.user.id });

    let total = 0;

    holdings.forEach(h => {
        total += h.price * h.qty;
    });

    const allocation = holdings.map(h => {
        const value = h.price * h.qty;
        return {
            name: h.name,
            percentage: ((value / total) * 100).toFixed(2)
        };
    });

    res.json({
        success: true,
        allocation
    });
});