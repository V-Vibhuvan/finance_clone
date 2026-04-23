const express = require("express");
const router = express.Router();
const { getRisk } = require("../controllers/mlController");

router.post("/risk", getRisk);

module.exports = router;