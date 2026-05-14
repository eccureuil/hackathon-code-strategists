<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import PageCitoyen from './pages/PageCitoyen'
import PageAdmin from './pages/PageAdmin'
import Notification from './components/commun/Notification'

function App() {
  return (
    <BrowserRouter>
      <Notification />
      <h1 className="text-red-500 text-5xl text-center">Fianar Smart City</h1>

      <nav style={{ textAlign: 'center', margin: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>📱 Citoyen</Link>
        <Link to="/admin">👑 Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PageCitoyen />} />
        <Route path="/admin" element={<PageAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./hooks/useToast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/historicPlaces/home";
import AdminPlaces from "./pages/historicPlaces/AdminPlaces";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
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
>>>>>>> 4121fc1381db0668d1f6d8fd3179a18e7d4df151
