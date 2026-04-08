import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../index.css";

import {
  Line,
  Doughnut
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Analytics() {

  const [pnlData, setPnlData] = useState([]);
  const [investment, setInvestment] = useState(null);
  const [topStocks, setTopStocks] = useState(null);
  const [allocation, setAllocation] = useState([]);

  useEffect(() => {

    // Daily PnL
    API.get("/analytics/pnl").then(res => {
      setPnlData(res.data.data);
    });

    // Investment
    API.get("/analytics/investment").then(res => {
      setInvestment(res.data);
    });

    // Top stocks
    API.get("/analytics/top-stocks").then(res => {
      setTopStocks(res.data);
    });

    // Allocation
    API.get("/analytics/allocation").then(res => {
      setAllocation(res.data.allocation);
    });

  }, []);

  // LINE CHART DATA
  const lineData = {
    labels: pnlData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: "Daily PnL",
        data: pnlData.map(d => d.pnl),
        borderColor: "green",
        fill: false
      }
    ]
  };

  //  PIE CHART
  const pieData = {
    labels: allocation.map(a => a.name),
    datasets: [
      {
        data: allocation.map(a => a.percentage),
        backgroundColor: [
          "#4caf50", "#2196f3", "#ff9800",
          "#e91e63", "#9c27b0"
        ]
      }
    ]
  };

  return (
    <div className="container mt-4">

      <h3 className="page-title">Analytics</h3>

      {/* CHARTS SIDE BY SIDE */}
      <div className="row g-4 mb-4">

        {/* LINE CHART */}
        <div className="col-md-8">
          <div className="app-card app-shadow chart-card">
            <h5>Daily PnL</h5>
            <Line data={lineData} />
          </div>
        </div>

        {/* PIE CHART */}
        <div className="col-md-4">
          <div className="app-card app-shadow chart-card">
            <h5>Portfolio Allocation</h5>
            <Doughnut data={pieData} />
          </div>
        </div>

      </div>

      {/* INVESTMENT */}
      {investment && (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="app-card app-shadow">
              <p className="text-muted">Investment</p>
              <h5>₹{investment.investment}</h5>
            </div>
          </div>

          <div className="col-md-4">
            <div className="app-card app-shadow">
              <p className="text-muted">Current</p>
              <h5>₹{investment.current}</h5>
            </div>
          </div>

          <div className="col-md-4">
            <div className="app-card app-shadow">
              <p className="text-muted">Profit</p>
              <h5 className={investment.profit >= 0 ? "text-profit" : "text-loss"}>
                ₹{investment.profit}
              </h5>
            </div>
          </div>

        </div>
      )}

      {/*TOP STOCK */}
      {topStocks && (
        <div className="app-card app-shadow mb-4">
          <h5>Top Performers</h5>
          <p>Best: {topStocks.best?.name} (₹{topStocks.best?.pnl})</p>
          <p>Worst: {topStocks.worst?.name} (₹{topStocks.worst?.pnl})</p>
        </div>
      )}

    </div>
  );
}