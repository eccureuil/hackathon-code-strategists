// frontend/src/App.jsx
import { useState } from "react";
import { CitoyenPage } from "./pages/CitoyenPage";
import { AdminDashboard } from "./components/admin/AdminDashboard";

function App() {
  const [role, setRole] = useState("citoyen"); // "citoyen" ou "admin"

  const mockUser = {
    id: 1,
    name: "RAKOTO Jean",
    phone: "034 12 345 67",
    email: "rakoto.jean@email.com",
    cin: "123 456 789 012",
  };

  return (
    <div className="font-sans">
      {/* Switch de rôle (pour démo) */}
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-full shadow-lg p-1 flex gap-1">
        <button
          onClick={() => setRole("citoyen")}
          className={`px-4 py-2 rounded-full text-sm transition ${
            role === "citoyen"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          👤 Citoyen
        </button>
        <button
          onClick={() => setRole("admin")}
          className={`px-4 py-2 rounded-full text-sm transition ${
            role === "admin"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          🛡️ Admin
        </button>
      </div>

      {role === "citoyen" ? (
        <CitoyenPage user={mockUser} />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
}

export default App;