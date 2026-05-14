import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminBusPanel from "./components/Bus/AdminBusPanel";
import ClientBusPanel from "./components/Bus/ClientBusPanel";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {user && (
          <div className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <h1 className="text-xl font-bold">
                Fianara Smart City - Transport
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {user.role === "admin" ? "👑 Admin" : "👤 Citoyen"} : {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            user ? (
              user.role === "admin" ? 
                <Navigate to="/admin" /> : 
                <Navigate to="/client" />
            ) : (
              <Navigate to="/login" />
            )
          } />

          <Route path="/login" element={
            <Login onLogin={handleLogin} />
          } />
          
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={
            user?.role === "admin" ? (
              <div className="container mx-auto py-6">
                <AdminBusPanel />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />

          <Route path="/client" element={
            user?.role === "client" ? (
              <div className="container mx-auto py-6">
                <ClientBusPanel />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />

          <Route path="*" element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-2xl font-bold">404 - Page not found</h1>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}