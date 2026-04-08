const express = require("express");
const router = express.Router();

const {
    getHoldings,
    deleteHolding
} = require("../controllers/holdingsController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getHoldings);
router.delete("/:id", protect, deleteHolding);

module.exports = router;