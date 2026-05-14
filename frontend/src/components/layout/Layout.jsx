import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const navItems = [
  {
    path: "/",
    label: "Accueil",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: "/ticket",
    label: "Prendre Ticket",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
  {
    path: "/my-tickets",
    label: "Mes Tickets",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    path: "/queue",
    label: "File d'attente",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const secondaryNav = [
  {
    path: "/places",
    label: "Lieux historiques",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    path: "/bus",
    label: "Bus urbain",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
];

const secondaryAdminNav = [
  { path: "/admin", label: "Administration" },
  { path: "/admin/places", label: "Lieux" },
  { path: "/admin/bus", label: "Bus" },
];

function MobileDrawer({ isOpen, onClose, location, isAuthenticated, isAdmin, user, logout, homePath }) {
  const isActive = (path) => location.pathname === (path === "/" ? homePath : path);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 drawer-overlay animate-fade-in lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`
          fixed top-0 left-0 z-50 w-72 h-full bg-white shadow-2xl
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-800">Menu</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 space-y-1">
          {navItems.filter((item) => !isAdmin || (item.path !== "/ticket" && item.path !== "/my-tickets")).map((item) => (
            <Link
              key={item.path}
              to={item.path === "/" ? homePath : item.path}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive(item.path)
                  ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="px-3 mt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3.5 mb-2">Explorer</p>
          <div className="space-y-1">
            {secondaryNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="px-3 mt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3.5 mb-2">Admin</p>
          <div className="space-y-1">
            {secondaryAdminNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-100">
          {isAuthenticated ? (
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
              title="Déconnexion"
            >
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="flex-1 text-left truncate">{user?.name || "Utilisateur"}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all border border-slate-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Connexion
              </Link>
              <Link
                to="/admin"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                Admin
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const homePath = isAuthenticated ? (isAdmin ? "/admin" : "/citizen") : "/";
  const isActive = (path) => location.pathname === (path === "/" ? homePath : path);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30">
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} location={location} isAuthenticated={isAuthenticated} isAdmin={isAdmin} user={user} logout={handleLogout} homePath={homePath} />

      <nav className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to={homePath} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 leading-tight">Fianar Smart City</h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Services municipaux</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.filter((item) => !isAdmin || (item.path !== "/ticket" && item.path !== "/my-tickets")).map((item) => (
                <Link
                  key={item.path}
                  to={item.path === "/" ? homePath : item.path}
                  className={`
                    flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200
                    ${isActive(item.path)
                      ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <div className="w-px h-6 bg-slate-200 mx-2" />

              {secondaryNav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-all"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  {isAdmin && (
                    <Link to="/admin" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors mr-1">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-200"
                    title="Déconnexion"
                  >
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="max-w-[80px] truncate">{user?.name || "Utilisateur"}</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-white/50 hover:text-slate-800 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Connexion
                  </Link>
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    Admin
                  </Link>
                </>
              )}

              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-white/50 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        <Outlet />
      </main>

      <footer className="border-t border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-xs text-slate-400 font-medium">Fianar Smart City</span>
            </div>
            <p className="text-[11px] text-slate-300">Solution de mobilité et services urbains intelligents</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
