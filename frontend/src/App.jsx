import { useState } from "react";
import AdminBusPanel from "./components/Bus/AdminBusPanel";
import ClientBusPanel from "./components/Bus/ClientBusPanel";

export default function App() {
  const [activeRole, setActiveRole] = useState("admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* En-tête */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-light tracking-tight text-slate-800">
            Fianara Smart City
          </h1>
          <p className="text-sm text-slate-500 font-light mt-1">
            Module de gestion des circuits de bus urbains
          </p>
        </div>
      </header>

      {/* Sélecteur de rôle */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex gap-1 w-full max-w-md">
          <button
            onClick={() => setActiveRole("admin")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeRole === "admin"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Administration
          </button>
          <button
            onClick={() => setActiveRole("client")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeRole === "client"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Citoyens & Touristes
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeRole === "admin" ? <AdminBusPanel /> : <ClientBusPanel />}
      </main>

      {/* Pied de page */}
      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-xs text-slate-400 text-center">
            Fianara Smart City - Solution de mobilité urbaine
          </p>
        </div>
      </footer>
    </div>
  );
}