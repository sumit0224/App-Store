import React, { createContext, useContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext(null);

// Hook for easy usage
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user object (optional)
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // initialize user from token if you want: decode token or fetch profile
  useEffect(() => {
    if (token) {
      // Optionally, fetch user profile from backend using token
      // fetch('/api/me', { headers: { Authorization: `Bearer ${token}` }})...
      // For demo, we'll just store a fake user
      setUser({ name: "Demo User", email: "demo@example.com" });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      // TODO: replace with actual API call:
      // const res = await fetch("/api/auth/login", { method: 'POST', body: JSON.stringify({email,password}) })
      // const data = await res.json(); // { token, user }
      // Example mock:
      await new Promise((r) => setTimeout(r, 600));
      const fakeToken = "FAKE_JWT_TOKEN_EXAMPLE"; // replace with real token from backend
      localStorage.setItem("token", fakeToken);
      setToken(fakeToken);
      setUser({ name: "Demo User", email });
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: err.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
