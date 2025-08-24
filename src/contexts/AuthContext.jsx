
import React, { createContext, useContext, useState } from "react";

const API_URL = "/api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);

  React.useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch(`${API_URL}/me`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user) setUser(data.user);
      } catch {}
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const signup = async (username, email, password) => {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setShowWelcomeBonus(true);
    } else {
      throw new Error(data.message || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setShowWelcomeBonus(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, showWelcomeBonus, setShowWelcomeBonus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
