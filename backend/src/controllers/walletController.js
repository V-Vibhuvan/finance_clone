const Wallet = require("../models/WalletModel");
const Transaction = require("../models/TransactionModel");
const wrapAsync = require("../middleware/wrapAsync"); // ✅ FIXED
const AppError = require("../utils/AppError");

module.exports.getWallet = wrapAsync(async (req, res) => {
    let wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
        wallet = await Wallet.create({ user: req.user.id });
    }

    res.json({
        success: true,
        balance: wallet.balance
    });
});

module.exports.addMoney = wrapAsync(async (req,res,next) => {
    const {amount} = req.body;

    if(!amount || amount <= 0){
        return next(new AppError("Invalid amount", 400));
    }

    let wallet = await Wallet.findOne({user: req.user.id});

    if (!wallet) {
        wallet = await Wallet.create({ user: req.user.id });
    }

    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({
        user: req.user.id,
        type: "DEPOSIT",
        amount
    });

    res.json({
        success: true,
        balance: wallet.balance
    });
});

module.exports.getTransactions = wrapAsync(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user.id })
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        transactions
    });
});