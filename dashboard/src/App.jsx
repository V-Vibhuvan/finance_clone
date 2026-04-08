import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Wallet from "./pages/Wallet";
import Orders from "./pages/Orders";
import Holdings from "./pages/Holdings";
import Positions from "./pages/Positions";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AIFloatingButton from "./components/Ai/AIFloatingButton"; 

import { AuthProvider, AuthContext } from "./context/AuthContext";

function AppRoutes() {
  const { user } = useContext(AuthContext);
  const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/signup";

  return (
    <>
      {/* Navbar */}
      {user && <Navbar />}

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />

        <Route path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route path="/holdings"
          element={
            <ProtectedRoute>
              <Holdings />
            </ProtectedRoute>
          }
        />

        <Route path="/positions"
          element={
            <ProtectedRoute>
              <Positions />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* AI FLOATING BUTTON (GLOBAL) */}
      {user && !isAuthPage && <AIFloatingButton />}

    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}