import { useState, useEffect, useMemo } from "react";
import { busAPI, stopsAPI } from "../../services/api";
import RouteMap from "./RouteMap";
import Button from "../ui/Button";
import { RouteBadge } from "../ui/Badge";
import { showToast } from "../ui/Toast";

const ROUTE_COLORS = ["blue", "indigo", "emerald", "amber", "red", "purple", "cyan", "pink"];

function QuickLink({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-200 group"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
        <span className="w-5 h-5 text-blue-600">{icon}</span>
      </div>
      <span className="text-[10px] font-medium text-slate-500 group-hover:text-blue-600 transition-colors">{label}</span>
    </button>
  );
}

function SearchPanel({ stops, onSearch, loading, results, onViewMap, onClearSearch }) {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    if (!departure || !destination) {
      showToast("Sélectionnez un départ et une destination", "error");
      return;
    }
    if (departure === destination) {
      showToast("Le départ et la destination doivent être différents", "error");
      return;
    }
    onSearch(departure, destination);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Rechercher un trajet
        </h2>

        <div className="space-y-3 relative">
          {/* Departure */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 z-10" />
            <select
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-700 border border-slate-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Point de départ</option>
              {stops.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          {/* Divider with swap */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={() => { const tmp = departure; setDeparture(destination); setDestination(tmp); }}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all"
              title="Inverser"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* Destination */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100 z-10" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-700 border border-slate-100 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Destination</option>
              {stops.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-4"
          onClick={handleSearch}
          loading={loading}
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
        >
          {loading ? "Recherche en cours..." : "Rechercher"}
        </Button>
      </div>

      {/* Results */}
      {results && (
        <div className="border-t border-slate-100 animate-slide-up">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">
                {results.buses?.length || 0} trajet(s) trouvé(s)
              </h3>
              <button onClick={onClearSearch} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Nouvelle recherche
              </button>
            </div>

            {results.fastest && (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Trajet le plus rapide</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <RouteBadge lineName={results.fastest.lineName} color="emerald" />
                  <span className="text-sm font-medium text-slate-700">{results.fastest.totalTime} min</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {results.fastest.stops.join(" → ")}
                </p>
                <Button variant="success" size="sm" onClick={() => onViewMap(results.fastest.lineId)}>
                  Voir sur la carte
                </Button>
              </div>
            )}

            <div className="space-y-2">
              {results.buses?.map((bus, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white rounded-xl border border-slate-100 p-3 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <RouteBadge lineName={bus.lineName} color={ROUTE_COLORS[idx % ROUTE_COLORS.length]} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700">{bus.totalTime} min</p>
                      <p className="text-xs text-slate-400 truncate">{bus.stops.join(" → ")}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewMap(bus.lineId)}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shrink-0"
                    title="Voir sur la carte"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {results.buses?.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-400 font-medium">Aucun trajet trouvé</p>
                <p className="text-xs text-slate-300 mt-1">Aucune ligne ne relie ces arrêts</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LoadedLine({ line, color, onViewMap }) {
  return (
    <button
      onClick={() => onViewMap(line._id)}
      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all duration-200 group w-full text-left"
    >
      <RouteBadge lineName={line.lineName} color={color} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 truncate">
          {line.forwardStops?.length || 0} arrêts
        </p>
      </div>
      <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export default function ClientBusPanel() {
  const [stops, setStops] = useState([]);
  const [lines, setLines] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [lineSearchTerm, setLineSearchTerm] = useState("");
  const [showMapForLine, setShowMapForLine] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchInitialData = async () => {
    try {
      const [stopsRes, linesRes] = await Promise.all([
        stopsAPI.getAll(),
        busAPI.getAllLines(),
      ]);
      setStops(stopsRes.data.data || []);
      setLines(linesRes.data.data || []);
    } catch {
      showToast("Erreur lors du chargement", "error");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const filteredLines = useMemo(() => {
    if (lineSearchTerm.trim()) {
      return lines.filter(l =>
        l.lineName.toLowerCase().includes(lineSearchTerm.toLowerCase())
      );
    }
    return lines;
  }, [lineSearchTerm, lines]);

  const handleSearchRoute = async (departure, destination) => {
    setSearchLoading(true);
    try {
      const response = await busAPI.searchRoute({ departure, destination });
      setSearchResults(response.data.data);
    } catch {
      showToast("Aucun trajet trouvé", "error");
      setSearchResults(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleViewLineOnMap = async (lineId) => {
    try {
      const response = await busAPI.getById(lineId);
      const line = response.data.data;
      setShowMapForLine({
        stops: line.forwardStops || [],
        returnStops: line.returnStops || [],
        hasReturnTrip: line.hasReturnTrip,
        lineName: line.lineName,
      });
    } catch {
      showToast("Erreur lors du chargement de la carte", "error");
    }
  };

  const quickLinks = [
    {
      icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
      label: "Rechercher",
      onClick: () => document.getElementById("search-panel")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
      label: "Lignes",
      onClick: () => document.getElementById("lines-section")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      label: "Arrêts",
      onClick: () => document.getElementById("stops-section")?.scrollIntoView({ behavior: "smooth" }),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Hero / Quick links */}
      <div className="text-center mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
          Bienvenue sur Fianar Smart City
        </h2>
        <p className="text-sm text-slate-400">Transport urbain intelligent à Fianarantsoa</p>
      </div>

      <div className="flex justify-center gap-2 sm:gap-4">
        {quickLinks.map((link, i) => <QuickLink key={i} {...link} />)}
      </div>

      {/* Search Panel */}
      <div id="search-panel">
        {initialLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-8 bg-slate-100 rounded-xl w-8 mx-auto" />
              <div className="h-12 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-12 bg-slate-200 rounded-xl mt-4" />
          </div>
        ) : (
          <SearchPanel
            stops={stops}
            onSearch={handleSearchRoute}
            loading={searchLoading}
            results={searchResults}
            onViewMap={handleViewLineOnMap}
            onClearSearch={() => setSearchResults(null)}
          />
        )}
      </div>

      {/* Lines section */}
      <div id="lines-section">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Lignes de bus
            </h2>

            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher une ligne (ex: 40)"
                value={lineSearchTerm}
                onChange={(e) => setLineSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm text-slate-700 border border-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              {lineSearchTerm && (
                <button
                  onClick={() => setLineSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {initialLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredLines.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <p className="text-sm text-slate-400 font-medium">
                  {lineSearchTerm ? "Aucune ligne trouvée" : "Aucune ligne disponible"}
                </p>
              </div>
            ) : (
              <div className="grid gap-2">
                {filteredLines.map((line, idx) => (
                  <LoadedLine
                    key={line._id}
                    line={line}
                    color={ROUTE_COLORS[idx % ROUTE_COLORS.length]}
                    onViewMap={handleViewLineOnMap}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stops summary */}
      <div id="stops-section">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Arrêts disponibles
          </h2>
          {initialLoading ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stops.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Aucun arrêt disponible</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {stops.map((stop) => (
                <span
                  key={stop._id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-600 border border-slate-100"
                >
                  <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {stop.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Route Map Modal */}
      {showMapForLine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMapForLine(null)} />
          <div className="relative w-full max-w-4xl animate-scale-in">
            <RouteMap
              stops={showMapForLine.stops}
              returnStops={showMapForLine.returnStops}
              hasReturnTrip={showMapForLine.hasReturnTrip}
              lineName={showMapForLine.lineName}
              onClose={() => setShowMapForLine(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
