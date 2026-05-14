import { useState, useEffect } from "react";

export function parseToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name || payload.email?.split("@")[0] || "Utilisateur",
    };
  } catch {
    return null;
  }
}

export default function useAuth() {
  const [user, setUser] = useState(() => parseToken(localStorage.getItem("token")));

  useEffect(() => {
    const handler = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setUser(parseToken(token));
      } else {
        setUser(null);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser(parseToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, isAuthenticated: !!user, isAdmin: user?.role === "admin", login, logout };
}
