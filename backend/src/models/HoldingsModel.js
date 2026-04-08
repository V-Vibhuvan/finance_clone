const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HoldingsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
}, { timestamps: true });

module.exports = mongoose.model("holding", HoldingsSchema);