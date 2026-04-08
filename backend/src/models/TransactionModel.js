const mongoose = require("mongoose");
const Schmea = mongoose.Schema;

const transactionSchema = new Schmea({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: String,
        enum: ["DEPOSIT", "WITHDRAW", "BUY", "SELL"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    stock: String,
    qty: Number
}, {timestamps: true});

module.exports = mongoose.model("Transaction", transactionSchema);