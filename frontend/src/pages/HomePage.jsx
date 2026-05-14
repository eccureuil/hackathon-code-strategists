import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "../components/ui/Button";

const modules = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    title: "Signalement d'incidents",
    desc: "Signalez un problème dans votre quartier (voirie, éclairage, assainissement) et suivez son traitement en temps réel.",
    gradient: "from-rose-500 to-pink-600",
    bgLight: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100 text-rose-600",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: "Bus et itinéraires",
    desc: "Consultez les lignes de bus, les arrêts et les horaires. Planifiez vos trajets dans Fianarantsoa.",
    gradient: "from-blue-500 to-cyan-600",
    bgLight: "from-blue-50 to-cyan-50",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: "Réservation de tickets",
    desc: "Prenez un ticket en ligne pour vos démarches administratives et suivez votre tour en temps réel.",
    gradient: "from-violet-500 to-purple-600",
    bgLight: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Lieux historiques",
    desc: "Explorez le patrimoine de Fianarantsoa : monuments, quartiers traditionnels et sites culturels.",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
];

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Rapidité",
    desc: "Finies les longues files d'attente. Prenez un ticket en ligne et arrivez à l'heure choisie.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Accessibilité",
    desc: "Accédez à tous les services municipaux depuis votre smartphone, 24h/24 et 7j/7.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    title: "Gestion centralisée",
    desc: "Toutes vos démarches au même endroit. Suivez l'avancement de vos demandes en un coup d'œil.",
    color: "from-emerald-400 to-green-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Expérience citoyenne",
    desc: "Une interface moderne et intuitive conçue pour simplifier votre relation avec l'administration.",
    color: "from-violet-400 to-purple-500",
  },
];

function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
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

          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Inscription
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-white/20 animate-float" />
      <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-medium mb-8 border border-white/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            Plateforme de services urbains intelligents
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up">
            Bienvenue à{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-purple-200">
              Fianar Smart City
            </span>
          </h1>

          <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Simplifiez vos démarches administratives, suivez vos transports en commun,
            explorez le patrimoine de Fianarantsoa et participez à l'amélioration de votre quartier.
          </p>

          <div className="flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/register">
              <Button size="lg" pill className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl shadow-black/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Créer un compte
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" pill className="border-white/30 text-white hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Se connecter
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-12 text-white/60 text-xs animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Gratuit
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Rapide
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sécurisé
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
}

function ModulesSection() {
  return (
    <section className="relative z-10 -mt-8 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Nos modules</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Découvrez l'ensemble des services numériques mis à votre disposition
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((mod, idx) => (
            <div
              key={mod.title}
              className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.bgLight} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <div className={mod.iconBg}>
                  {mod.icon}
                </div>
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">{mod.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{mod.desc}</p>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Connexion requise
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Pourquoi Fianar Smart City ?</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Une plateforme conçue pour améliorer le quotidien des citoyens
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((ben, idx) => (
            <div
              key={ben.title}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up text-center"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ben.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                {ben.icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">{ben.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{ben.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-800">Fianar Smart City</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solution de mobilité et services urbains intelligents pour la ville de Fianarantsoa.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Liens utiles</h4>
            <div className="space-y-2">
              <Link to="/login" className="block text-xs text-slate-400 hover:text-indigo-600 transition-colors">Connexion</Link>
              <Link to="/register" className="block text-xs text-slate-400 hover:text-indigo-600 transition-colors">Inscription</Link>
              <Link to="/login" className="block text-xs text-slate-400 hover:text-indigo-600 transition-colors">Espace citoyen</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Contact</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>Mairie de Fianarantsoa</p>
              <p>contact@fianarsmartcity.mg</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-slate-300">
            &copy; {new Date().getFullYear()} Fianar Smart City. Tous droits réservés.
          </p>
          <p className="text-[11px] text-slate-300">
            Propulsé par la Municipalité de Fianarantsoa
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/citizen", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30">
      <LandingNavbar />
      <HeroSection />
      <ModulesSection />
      <BenefitsSection />
      <LandingFooter />
    </div>
  );
}
