import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "./components/ui/Toast";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import CitizenDashboard from "./pages/CitizenDashboard";
import CitoyenPage from "./pages/CitoyenPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import QueuePage from "./pages/QueuePage";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/login";
import Register from "./pages/register";
import HistoricHome from "./pages/historicPlaces/home";
import HistoricAdmin from "./pages/historicPlaces/AdminPlaces";
import ClientBusPanel from "./components/Bus/ClientBusPanel";

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/ticket" element={<CitoyenPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/admin/*" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
          <Route path="/places" element={<ProtectedRoute><HistoricHome /></ProtectedRoute>} />
          <Route path="/admin/places" element={<ProtectedRoute requireAdmin><HistoricAdmin /></ProtectedRoute>} />
          <Route path="/bus" element={<ProtectedRoute><ClientBusPanel /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}
