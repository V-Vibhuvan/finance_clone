const mongoose = require("mongoose");
const getEmbedding = require("../utils/embedding");
const callGroq = require("../utils/groq");
const buildPrompt = require("../utils/promptBuilder");
const { queryRAG } = require("../utils/rag");

const Holdings = require("../models/HoldingsModel");
const Orders = require("../models/OrdersModel");



async function getUserData(userId) {    
    const holdingsData = await Holdings.find({ user: userId });
    
    const holdings = holdingsData.map((h)=> ({
        stock : h.name,    
        qty: h.qty,        
        avgPrice: h.avg,   
        currentPrice: h.price, 
        pnl: (h.price - h.avg) * h.qty
    }));

    if (holdings.length === 0) {
        return { holdings: [], pnl: { total: 0 }, recentOrders: [], topGainer: null, worstStock: null, sectorConcentration: "NONE" };
    }

    const topGainer = holdings.reduce((a, b) => a.pnl > b.pnl ? a : b, holdings[0]);
    const worstStock = holdings.reduce((a, b) => a.pnl < b.pnl ? a : b, holdings[0]);
    const totalInvestment = holdings.reduce((acc, h) => acc + (h.avgPrice * h.qty), 0);
    const sectorConcentration = holdings.length <= 3 ? "HIGH" : "MODERATE";
    const totalPnL = holdings.reduce((acc,h) => acc + h.pnl,0);

    const recentOrders = await Orders.find({ user: userId })
        .sort({createdAt: -1})
        .limit(5);

    console.log("Holdings: ", holdingsData);

    return {
        holdings,
        pnl: {total : totalPnL},
        recentOrders,
        topGainer,
        worstStock,
        sectorConcentration
    };
}

module.exports.chat = async (req,res) => {
    console.log("CHAT HIT");
    try {
        const { query } = req.body;
        const userId = req.user.id;

        const {holdings, pnl, recentOrders} = await getUserData(userId);
        const embedding = await getEmbedding(query);
        const docs = await queryRAG(embedding);
        const prompt = buildPrompt({
            holdings,
            pnl,
            docs,
            query,
            recentOrders
        });
        const response = await callGroq(prompt);
        res.json({message: response});
    }catch(err) {
        console.log(err);
        res.status(500).json({error: "AI Error"});
    }
};

module.exports.insight = async (req,res) => {
    try{
        const userId = req.user.id;
        const { holdings, pnl, topGainer, worstStock, sectorConcentration} = await getUserData(userId);
        if (!holdings.length) {
        return res.json({
            message: "No holdings found. Start investing to get insights."
        });
        }
        const prompt = `
            You are an expert financial trading assistant.

            Portfolio Summary:
            - Total PnL: ₹${pnl.total}
            - Top Gainer: ${topGainer.stock} (₹${topGainer.pnl})
            - Worst Stock: ${worstStock.stock} (₹${worstStock.pnl})
            - Diversification: ${sectorConcentration}

            Holdings:
            ${JSON.stringify(holdings)}

            Tasks:
            1. Explain performance
            2. Identify risks
            3. Suggest actions (buy/sell/hold)
            4. Mention diversification advice

            Keep answer:
            - Short (5–6 lines)
            - Clear
            - Practical
        `;
        const response = await callGroq(prompt);
        res.json({message: response});
    } catch(err) {
        console.log("Insight Error:",err)
        res.status(500).json({error : "AI Insight Error."});
    }
};