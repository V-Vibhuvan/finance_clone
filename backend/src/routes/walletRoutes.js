// routes/walletRoutes.js

const express = require("express");
const router = express.Router();

const {
    getWallet,
    addMoney,
    getTransactions
} = require("../controllers/walletController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getWallet);
router.post("/add", protect, addMoney);
router.get("/transactions", protect, getTransactions);

module.exports = router;