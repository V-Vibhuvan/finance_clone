
const express = require("express");
const router = express.Router();

const {
    getDailyPNL,
    getInvestmentStats,
    getTopPerformers,
    getAllocation
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");

router.get("/pnl", protect, getDailyPNL);
router.get("/investment", protect, getInvestmentStats);
router.get("/top-stocks", protect, getTopPerformers);
router.get("/allocation", protect, getAllocation);

module.exports = router;