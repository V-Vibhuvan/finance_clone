import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-card">
      <div className="app-card app-shadow p-4">
        <h4 className="mb-3 text-center">Signup</h4>
        <input
          className="form-control mb-3"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <button className="btn btn-primary w-100" onClick={handleSubmit}>
          Signup
        </button>
      </div>
    </div>
  );
}