const mongoose = require("mongoose");

const Orders = require("../models/OrdersModel");
const Holdings = require("../models/HoldingsModel");
const Wallet = require("../models/WalletModel");
const Transaction = require("../models/TransactionModel");
const Positions = require("../models/PositionsModel");

const wrapAsync = require("../middleware/wrapAsync");
const AppError = require("../utils/AppError");

module.exports.createOrder = wrapAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {name , qty, price, mode} = req.body;
        if(!name || !qty || !price || !mode){
            throw new AppError("All field required", 400);
        }
        if (qty <= 0 || price <= 0) {
            throw new AppError("Invalid qty or price", 400);
        }

        const totalCost = qty*price;
        let wallet = await Wallet.findOne({user: req.user.id}).session(session);
        if (!wallet) {
            wallet = await Wallet.create([{
                user: req.user.id
            }], { session });

            wallet = wallet[0];
        }

        if(mode == "BUY"){
            if(wallet.balance < totalCost){
                throw new AppError("Insufficient balance", 400);
            }
            wallet.balance -= totalCost;
            await Transaction.create([{
                user: req.user.id,
                type: "BUY",
                amount: totalCost,
                stock: name,
                qty
            }], {session});
        }

        let holding = await Holdings.findOne({
            user: req.user.id,
            name
        }).session(session);

        if (mode === "BUY") {
            if (holding) {
                const totalQty = holding.qty + qty;
                const totalCostHolding =
                    holding.avg * holding.qty + price * qty;

                holding.qty = totalQty;
                holding.avg = totalCostHolding / totalQty;
                holding.price = price;
            } else {
                holding = await Holdings.create([{
                    user: req.user.id,
                    name,
                    qty,
                    avg: price,
                    price
                }], { session });

                holding = holding[0];
            }
        }

        if (mode === "SELL") {
            if (!holding) {
                throw new AppError("No holdings to sell", 400);
            }

            if (qty > holding.qty) {
                throw new AppError("Not enough stock", 400);
            }

            holding.qty -= qty;
            holding.price = price;

            wallet.balance += totalCost;

            await Transaction.create([{
                user: req.user.id,
                type: "SELL",
                amount: totalCost,
                stock: name,
                qty
            }], { session });

            if (holding.qty === 0) {
                await Holdings.deleteOne({ _id: holding._id }).session(session);
                holding = null;
            }
        }

        await wallet.save({ session });

        if (holding && holding.qty > 0) {
            await Positions.findOneAndUpdate(
                { user: req.user.id, name },
                {
                $set: {
                    price,
                    avg: holding.avg,
                    qty: holding.qty,
                },
                },
                { upsert: true, session }
            );
        } else {
            await Positions.deleteOne({ user: req.user.id, name }).session(session);
        }

        if (holding) await holding.save({ session });

        const order = await Orders.create([{
            user: req.user.id,
            name,
            qty,
            price,
            mode
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "Order executed safely",
            order: order[0],
            balance: wallet.balance
        });

    }catch(err){
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
});


module.exports.getOrders = wrapAsync(async (req, res) => {
    const orders = await Orders.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .populate("user", "name email");

    res.json({
        success: true,
        count: orders.length,
        orders
    });
});