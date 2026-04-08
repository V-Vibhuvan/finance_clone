import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-clean px-4">

      {/* Logo */}
      <Link className="navbar-brand fw-bold text-primary" to="/">
        TradeApp
      </Link>

      {/* Links */}
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/analytics">Analytics</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/wallet">Wallet</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/orders">Orders</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/holdings">Holdings</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/positions">Positions</Link>
        </li>
      </ul>

      {/* User */}
      <div className="d-flex align-items-center">
        <span className="me-3 text-muted">{user?.name}</span>
        <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

    </nav>
  );
}