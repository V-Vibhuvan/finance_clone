const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const holdingsRoutes = require("./routes/holdingsRoutes");
const positionsRoutes = require("./routes/positionsRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const walletRoutes = require("./routes/walletRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiRoutes = require("./routes/aiRoutes");
const mlRoutes = require("./routes/mlRoutes");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/holdings", holdingsRoutes);
app.use("/api/positions", positionsRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/", mlRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use(errorHandler);

module.exports = app;