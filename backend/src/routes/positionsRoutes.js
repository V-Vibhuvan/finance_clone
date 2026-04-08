const express = require("express");
const router = express.Router();

const {
    getPositions
} = require("../controllers/positionsController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getPositions);

module.exports = router;