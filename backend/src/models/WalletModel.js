const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

module.exports = mongoose.model("Wallet", walletSchema);