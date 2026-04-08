import React, { useEffect, useState } from "react";
import API from "../api/api";
import { createSocket } from "../socket/socket";
import TradeModal from "../components/TradeModel";
import "../index.css";

export default function Dashboard() {
    const [portfolio, setPortfolio] = useState(null);
    const [holdings, setHoldings] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [open, setOpen] = useState(false);
    const [stocks, setStocks] = useState([]);
    const [insight , setInsight] = useState("");

    useEffect(() => {
      API.get("/portfolio/summary").then((res) => {
        setPortfolio(res.data);
      });

      API.get("/holdings").then((res) => {
        setHoldings(res.data.holdings);
      });

      API.post("/ai/insight").then((res)=> {
        setInsight(res.data.message);
      });
      
      const socket = createSocket();

      socket.on("marketData", (data) => {
        setStocks(data.stocks)
        setHoldings(data.holdings);
      });

      return () => socket.disconnect();
    }, []);

    if (!portfolio) return <p className="text-center mt-5" style={{ fontWeight: "500", color: "#777" }}>Loading...</p>;
    const defaultStocks = [
      { name: "TCS", price: 3500 },
      { name: "INFY", price: 1500 },
      { name: "HDFC", price: 2800 },
      { name: "RELIANCE", price: 2900 }
    ];

    const mergedStocks = stocks.map(stock => {
      const found = holdings.find(h => h.name === stock.name);

      return found
        ? { ...stock, ...found }  
        : stock;
    });
    return (
      <div className="container mt-4">

        <h3 className="page-title">Dashboard</h3>

        {insight && (
          <div className="app-card app-shadow mb-4 ai-insight">
            <h6 className="text-muted mb-2">🤖 AI Insight</h6>
            <div className="d-flex align-items-start">
              <span style={{ fontSize: "18px", marginRight: "10px" }}>🤖</span>
              <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                {insight}
              </p>
            </div>
          </div>
        )}
        
        <div className="row g-3 mb-4">
          {[
            { title: "Wallet", value: portfolio.walletBalance },
            { title: "Investment", value: portfolio.totalInvestment },
            { title: "Current Value", value: portfolio.totalCurrentValue },
            { title: "PnL", value: portfolio.totalPNL }
          ].map((item, i) => (
            <div className="col-md-3" key={i}>
              <div className="app-card app-shadow kpi-card">
                <small className="text-muted">{item.title}</small>
                <h5 className={
                  item.title === "PnL"
                    ? item.value >= 0 ? "text-profit" : "text-loss"
                    : ""
                }>
                  ₹{item.value}
                </h5>
              </div>
            </div>
          ))}
        </div>

        <div className="app-card app-shadow">
          <h5 className="mb-3">Holdings</h5>

          <table className="table table-hover table-clean">
            <thead className="table-light">
              <tr>
                <th>Stock</th>
                <th>Qty</th>
                <th>Avg</th>
                <th>LTP</th>
                <th>Current</th>
                <th>PnL</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {mergedStocks.map((h, i) => (
                <tr key={i}>
                  <td className="fw-semibold">{h.name}</td>
                  <td>{h.qty}</td>
                  <td>{h.avg}</td>
                  <td>{h.livePrice}</td>
                  <td>₹{h.current}</td>
                  <td className={h.pnl >= 0 ? "text-profit" : "text-loss"}>
                    ₹{h.pnl}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setSelectedStock({
                          name: h.name,
                          price: h.livePrice || h.price
                        });
                        setOpen(true);
                      }}
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedStock && (
            <TradeModal
              open={open}
              onClose={() => setOpen(false)}
              stock={selectedStock}
            />
          )}
        </div>
      </div>
    );
}