import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/historicPlaces/home";
import AdminPlaces from "./pages/historicPlaces/AdminPlaces";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* route par défaut */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<AdminPlaces />} />

          {/* auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* fallback 404 */}
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