import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const quickModules = [
  {
    path: "/ticket",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: "Prendre un ticket",
    desc: "Réservez votre passage pour les services municipaux",
    gradient: "from-violet-500 to-purple-600",
    lightBg: "from-violet-50 to-purple-50",
    iconColor: "text-violet-600",
  },
  {
    path: "/my-tickets",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Mes tickets",
    desc: "Consultez l'historique et le statut de vos réservations",
    gradient: "from-blue-500 to-cyan-600",
    lightBg: "from-blue-50 to-cyan-50",
    iconColor: "text-blue-600",
  },
  {
    path: "/queue",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "File d'attente",
    desc: "Suivez l'évolution de la file en temps réel",
    gradient: "from-amber-500 to-orange-600",
    lightBg: "from-amber-50 to-orange-50",
    iconColor: "text-amber-600",
  },
  {
    path: "/bus",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: "Bus et itinéraires",
    desc: "Consultez les lignes, arrêts et horaires de bus",
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "from-emerald-50 to-teal-50",
    iconColor: "text-emerald-600",
  },
  {
    path: "/places",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Lieux historiques",
    desc: "Explorez le patrimoine de Fianarantsoa",
    gradient: "from-rose-500 to-pink-600",
    lightBg: "from-rose-50 to-pink-50",
    iconColor: "text-rose-600",
  },
];

function ModuleCard({ mod, idx }) {
  return (
    <Link
      to={mod.path}
      className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-scale-in"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.lightBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <div className={mod.iconColor}>{mod.icon}</div>
      </div>
      <h3 className="text-sm font-semibold text-slate-800 mb-1">{mod.title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
    </Link>
  );
}

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-violet-400/10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Bonjour, {user?.name || "Utilisateur"}
              </h1>
              <p className="text-indigo-200 text-xs">Bienvenue sur votre espace citoyen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Accès rapide
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {quickModules.map((mod, idx) => (
            <ModuleCard key={mod.path} mod={mod} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
