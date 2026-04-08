const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const Holdings = require("../models/HoldingsModel");

let io;

let stocks = [
    { name: "TCS", price: 3500 },
    { name: "INFY", price: 1500 },
    { name: "HDFC", price: 2800 },
    { name: "ICICI", price: 950 },
    { name: "SBIN", price: 600 },
    { name: "RELIANCE", price: 2900 },
    { name: "WIPRO", price: 450 },
    { name: "HCL", price: 1200 },
    { name: "AXIS", price: 1100 },
    { name: "KOTAK", price: 1800 },
    { name: "ITC", price: 420 },
    { name: "LT", price: 3200 },
    { name: "MARUTI", price: 10500 },
    { name: "TITAN", price: 3300 },
    { name: "BAJAJ", price: 7000 },
    { name: "ADANI", price: 2500 },
    { name: "ONGC", price: 250 },
    { name: "NTPC", price: 300 },
    { name: "POWERGRID", price: 280 },
    { name: "COALINDIA", price: 400 }
];

const updatePrices = () => {
    stocks = stocks.map(stock => {
        const changePercent = (Math.random() - 0.5) * 0.02; // ±1%
        let newPrice = stock.price + stock.price * changePercent;

        if (newPrice < 1) newPrice = 1;

        return {
            ...stock,
            price: Number(newPrice.toFixed(2))
        };
    });
};

const getUserHoldings = async (userId) => {
    const holdings = await Holdings.find({ user: userId });

    return holdings.map(h => {
        const stock = stocks.find(s => s.name === h.name);

        const livePrice = stock ? stock.price : h.price;

        const invested = h.avg * h.qty;
        const current = livePrice * h.qty;
        const pnl = current - invested;

        return {
            ...h.toObject(),
            livePrice,
            current,
            pnl
        };
    });
};

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) throw new Error("No token");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.userId);
        socket.join(socket.userId);
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.userId);
        });
    });

    setInterval(async () => {
        try {
            updatePrices();
            const sockets = await io.fetchSockets();
            for (let s of sockets) {
                const userId = s.userId;
                if (!userId) continue;

                const holdings = await getUserHoldings(userId);
                io.to(userId).emit("marketData", {
                    stocks,
                    holdings
                });
            }

        } catch (err) {
            console.error("Socket error:", err.message);
        }
    }, 1000);
};

module.exports = initSocket;