const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PositionsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: String,
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
    isLoss: Boolean
}, { timestamps: true });

module.exports = mongoose.model("position", PositionsSchema);