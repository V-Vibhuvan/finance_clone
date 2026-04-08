const express = require("express");
const router = express.Router();

const { chat, insight } = require("../controllers/aiController"); // ✅ correct
const protect = require("../middleware/authMiddleware"); // ✅ correct

router.post("/chat", protect, chat);
router.post("/insight", protect, insight);

module.exports = router;