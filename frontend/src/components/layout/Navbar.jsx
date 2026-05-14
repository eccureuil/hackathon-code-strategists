import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-emerald-600 font-semibold"
      : "text-slate-500 hover:text-emerald-600";

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/signalement" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg font-bold group-hover:bg-emerald-700 transition-colors">
              F
            </div>
            <span className="font-bold text-lg text-slate-800 hidden sm:block">
              Fianar Smart City
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/signalement" isActive={isActive("/signalement")} label="Signaler" />
            <NavLink to="/signalementAdmin" isActive={isActive("/signalementAdmin")} label="Administration" />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, isActive, label }) {
  return (
    <Link
      to={to}
      className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-200 ${isActive}`}
    >
      {label}
    </Link>
  );
}
