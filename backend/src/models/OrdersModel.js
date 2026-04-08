const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: String,
    qty: Number,
    price: Number,
    mode: String,
},{timestamps: true});

module.exports = mongoose.model("order", OrdersSchema);
