import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./hooks/useToast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/historicPlaces/home";
import AdminPlaces from "./pages/historicPlaces/AdminPlaces";
import ProtectedRoute from "./components/ProtectedRoute";
import PageAdmin from "./pages/PageAdmin";
import PageCitoyen from "./pages/PageCitoyen";


export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signalementAdmin" element={<ProtectedRoute><PageAdmin/></ProtectedRoute>} />
          <Route path="/signalement" element={<PageCitoyen/>} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPlaces />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-slate-300">404</h1>
                  <p className="text-slate-500 mt-2">Page non trouvée</p>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
