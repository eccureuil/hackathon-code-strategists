import { useState, useEffect } from "react";
import { busAPI, stopsAPI } from "../../services/api";
import RouteMap from "./RouteMap";

export default function ClientBusPanel() {
  const [stops, setStops] = useState([]);
  const [lines, setLines] = useState([]);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLine, setSelectedLine] = useState(null);
  const [lineSearchTerm, setLineSearchTerm] = useState("");
  const [filteredLines, setFilteredLines] = useState([]);
  const [showMapForLine, setShowMapForLine] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (lineSearchTerm.trim()) {
      setFilteredLines(lines.filter(l => l.lineName.toLowerCase().includes(lineSearchTerm.toLowerCase())));
    } else {
      setFilteredLines(lines);
    }
  }, [lineSearchTerm, lines]);

  const fetchInitialData = async () => {
    try {
      const [stopsRes, linesRes] = await Promise.all([
        stopsAPI.getAll(),
        busAPI.getAllLines(),
      ]);
      setStops(stopsRes.data.data);
      setLines(linesRes.data.data);
      setFilteredLines(linesRes.data.data);
    } catch (err) {
      setError("Erreur chargement");
    }
  };

  const handleSearchRoute = async () => {
    if (!departure || !destination) {
      setError("Sélectionnez départ et destination");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await busAPI.searchRoute({ departure, destination });
      setSearchResults(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Aucun trajet trouvé");
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLineOnMap = async (lineId, lineName) => {
    try {
      const response = await busAPI.getById(lineId);
      const line = response.data.data;
      setShowMapForLine({
        stops: line.forwardStops || [],
        returnStops: line.returnStops || [],
        hasReturnTrip: line.hasReturnTrip,
        lineName: line.lineName,
      });
    } catch (err) {
      setError("Erreur chargement carte");
    }
  };

  return (
    <div>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

      {/* Recherche de trajet */}
      <div className="bg-white rounded-xl border p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Rechercher un trajet</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Départ</label>
            <select value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full border rounded p-2">
              <option value="">Choisir</option>
              {stops.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Destination</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full border rounded p-2">
              <option value="">Choisir</option>
              {stops.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleSearchRoute} disabled={loading} className="w-full p-2.5 bg-slate-800 text-white rounded-lg">
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </div>

      {/* Résultats de recherche */}
      {searchResults && searchResults.buses && searchResults.buses.length > 0 && (
        <div className="mb-8">
          {searchResults.fastest && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <h3 className="font-medium text-green-800">Trajet le plus rapide</h3>
              <p className="text-xl font-semibold">Ligne {searchResults.fastest.lineName} ({searchResults.fastest.direction})</p>
              <p>{searchResults.fastest.totalTime} minutes</p>
              <p className="text-sm mt-2">{searchResults.fastest.stops.join(" → ")}</p>
              <button onClick={() => handleViewLineOnMap(searchResults.fastest.lineId, searchResults.fastest.lineName)} className="mt-2 text-blue-600 underline">
                Voir sur la carte
              </button>
            </div>
          )}
          <h3 className="font-medium mb-2">{searchResults.buses.length} ligne(s) trouvée(s)</h3>
          {searchResults.buses.map((bus, idx) => (
            <div key={idx} className="bg-white border rounded-xl p-3 mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Ligne {bus.lineName} ({bus.direction})</p>
                  <p className="text-sm text-gray-500">{bus.totalTime} min</p>
                  <p className="text-xs text-gray-400 mt-1">{bus.stops.join(" → ")}</p>
                </div>
                <button onClick={() => handleViewLineOnMap(bus.lineId, bus.lineName)} className="text-blue-600 underline text-sm">Carte</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchResults && searchResults.buses?.length === 0 && (
        <div className="text-center py-10 bg-white rounded-xl border mb-8">Aucune ligne ne relie ces arrêts</div>
      )}

      {/* Recherche de ligne */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium mb-3">Rechercher une ligne</h2>
        <input type="text" placeholder="Numéro de ligne (ex: 40)" value={lineSearchTerm} onChange={(e) => setLineSearchTerm(e.target.value)} className="w-full border rounded p-2 mb-4" />
        
        <div className="flex flex-wrap gap-2">
          {filteredLines.map((line) => (
            <div key={line._id} className="border rounded-lg overflow-hidden">
              <button onClick={() => handleViewLineOnMap(line._id, line.lineName)} className="px-3 py-1.5 text-sm hover:bg-gray-50">
                Ligne {line.lineName}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carte */}
      {showMapForLine && (
        <RouteMap
          stops={showMapForLine.stops}
          returnStops={showMapForLine.returnStops}
          hasReturnTrip={showMapForLine.hasReturnTrip}
          lineName={showMapForLine.lineName}
          onClose={() => setShowMapForLine(null)}
        />
      )}
    </div>
  );
}