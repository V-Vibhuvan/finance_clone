import React, { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; 

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      login(res.data);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Account not found. Let's get you signed up!");
        return navigate("/signup");
      }

      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-card">
      <div className="app-card app-shadow p-4">
        <h4 className="mb-3 text-center">Login</h4>
        
        <input
          className="form-control mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-4"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>

        <div className="text-center mt-3">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/signup" className="text-decoration-none fw-bold">
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
}