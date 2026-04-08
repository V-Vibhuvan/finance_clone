import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Wallet() {

  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchWallet = async () => {
    const res = await API.get("/wallet");
    setBalance(res.data.balance);
  };

  const fetchTransactions = async () => {
    const res = await API.get("/wallet/transactions");
    setTransactions(res.data.transactions);
  };

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const handleDeposit = async () => {
    await API.post("/wallet/add", { amount: Number(amount) });
    fetchWallet();
    fetchTransactions();
  };
  if (balance == null) return <p className="text-center mt-5">Loading Wallet...</p>;
  return (
    <div className="container mt-4">

      <h3 className="page-title">Wallet</h3>

      <div className="app-card app-shadow">
        <h5>Balance: ₹{balance}</h5>
      </div>

      <div className="app-card app-shadow">
        <div className="d-flex gap-2">
          <input
            type="number"
            className="form-control"
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleDeposit}>
            Add
          </button>
        </div>
      </div>

      <div className="app-card app-shadow">
        <h5>Transactions</h5>
        <table className="table table-hover table-clean">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td>{t.type}</td>
                <td>₹{t.amount}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}