import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand" to={"/"}>
          <img src={logo} alt="Zerodha Logo" width="120" />
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item mx-3">
              <Link className="nav-link" to={"/signup"}>Signup</Link>
            </li>

            <li className="nav-item mx-3">
              <Link className="nav-link" to={"/about"}>About</Link>
            </li>

            <li className="nav-item mx-3">
              <Link className="nav-link" to={"/product"}>Product</Link>
            </li>

            <li className="nav-item mx-3">
              <Link className="nav-link" to={"/pricing"}>Pricing</Link>
            </li>

            <li className="nav-item mx-3">
              <Link className="nav-link" to={"/support"}>Support</Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}