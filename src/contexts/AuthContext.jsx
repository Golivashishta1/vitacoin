
import React, { createContext, useContext, useState } from "react";

const API_URL = "http://localhost:5000/api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("bolt_token", data.token);
      setUser(data.user);
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const signup = async (username, email, password) => {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("bolt_token", data.token);
      setUser(data.user);
      setShowWelcomeBonus(true);
    } else {
      throw new Error(data.message || "Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("bolt_token");
    setUser(null);
    setShowWelcomeBonus(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, showWelcomeBonus, setShowWelcomeBonus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
