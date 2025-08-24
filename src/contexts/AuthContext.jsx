const API_URL = "http://localhost:5000/api/auth";

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
