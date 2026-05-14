import { useState, useEffect, useRef } from "react";
import { busAPI, stopsAPI } from "../../services/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Composant MapSelector
const MapSelector = ({ onLocationSelect, selectedLocation, center, zoom }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    let marker = null;

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker) marker.remove();
      marker = L.marker([lat, lng]).addTo(map);
      onLocationSelect({ lat, lng });
    });

    return () => {
      if (mapInstanceRef.current) mapInstanceRef.current.remove();
    };
  }, [center, zoom]);

  return (
    <div>
      <div ref={mapRef} className="w-full h-64 rounded-lg mb-2"></div>
      {selectedLocation && (
        <p className="text-xs text-gray-500 mt-1">
          📍 Position sélectionnée: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
};

export default function AdminBusPanel() {
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);
  const [showLineModal, setShowLineModal] = useState(false);
  const [editingLine, setEditingLine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedStopPosition, setSelectedStopPosition] = useState(null);

  // Formulaire ligne
  const [lineForm, setLineForm] = useState({
    lineName: "",
    stops: [],
    isActive: true,
  });
  const [newStopName, setNewStopName] = useState("");
  const [mapCenter] = useState([-21.45, 47.08]);
  const [mapZoom] = useState(13);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [busesRes, stopsRes] = await Promise.all([
        busAPI.getAll(),
        stopsAPI.getAll(),
      ]);
      setBuses(busesRes.data.data || []);
      setStops(stopsRes.data.data || []);
      setError("");
    } catch (err) {
      console.error("Erreur fetchData:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Statistiques pour le dashboard
  const totalLines = buses.length;
  const activeLines = buses.filter((b) => b.isActive).length;
  const totalStops = stops.length;

  const handleAddStopToLine = async () => {
    if (!newStopName || !selectedStopPosition) {
      setError("Veuillez saisir un nom et sélectionner une position sur la carte");
      return;
    }

    // Vérifier si l'arrêt existe déjà
    const existingStop = stops.find((s) => s.name === newStopName);
    if (existingStop) {
      setLineForm({
        ...lineForm,
        stops: [...lineForm.stops, existingStop],
      });
    } else {
      // Ajouter l'arrêt temporairement dans le formulaire
      setLineForm({
        ...lineForm,
        stops: [...lineForm.stops, {
          name: newStopName,
          coordinates: selectedStopPosition,
          isNew: true
        }],
      });
    }
    setNewStopName("");
    setSelectedStopPosition(null);
    setError("");
  };

  const handleRemoveStopFromLine = (index) => {
    const newStops = lineForm.stops.filter((_, i) => i !== index);
    setLineForm({ ...lineForm, stops: newStops });
  };

  const handleSaveLine = async () => {
    if (!lineForm.lineName.trim()) {
      setError("Le nom de la ligne est requis");
      return;
    }
    if (lineForm.stops.length < 2) {
      setError("Une ligne doit avoir au moins 2 arrêts");
      return;
    }

    try {
      // Créer d'abord les nouveaux arrêts
      const stopIds = [];
      for (const stop of lineForm.stops) {
        if (stop._id) {
          // Arrêt existe déjà
          stopIds.push(stop._id);
        } else {
          // Nouvel arrêt à créer
          const newStop = await stopsAPI.create({
            name: stop.name,
            coordinates: stop.coordinates,
          });
          stopIds.push(newStop.data.data._id);
        }
      }

      const lineData = {
        lineName: lineForm.lineName.trim(),
        stops: stopIds,
        isActive: lineForm.isActive,
      };

      if (editingLine) {
        await busAPI.update(editingLine._id, lineData);
        setSuccess("Ligne modifiée avec succès");
      } else {
        await busAPI.create(lineData);
        setSuccess("Ligne créée avec succès");
      }

      fetchData();
      setShowLineModal(false);
      resetLineForm();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erreur saveLine:", err);
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  const resetLineForm = () => {
    setLineForm({ lineName: "", stops: [], isActive: true });
    setEditingLine(null);
    setSelectedStopPosition(null);
    setNewStopName("");
    setError("");
  };

  const editLine = (line) => {
    setEditingLine(line);
    setLineForm({
      lineName: line.lineName,
      stops: line.stops || [],
      isActive: line.isActive,
    });
    setShowLineModal(true);
  };

  const deleteLine = async (id, name) => {
    if (!confirm(`Supprimer définitivement la ligne "${name}" ?`)) return;
    try {
      await busAPI.delete(id);
      fetchData();
      setSuccess("Ligne supprimée");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const toggleLineActive = async (line) => {
    try {
      await busAPI.update(line._id, { ...line, isActive: !line.isActive });
      fetchData();
    } catch (err) {
      setError("Erreur lors du changement de statut");
    }
  };

  return (
    <div>
      {/* Messages d'erreur et succès */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          ✅ {success}
        </div>
      )}

      {/* Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Lignes de bus</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">{totalLines}</p>
          <p className="text-xs text-green-600 mt-1">{activeLines} actives</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Arrêts</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">{totalStops}</p>
          <p className="text-xs text-slate-500 mt-1">Points sur la carte</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Trajets possibles</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            {totalLines * Math.max(0, totalStops - 1)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Combinaisons départ → arrivée</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            resetLineForm();
            setShowLineModal(true);
          }}
          className="px-5 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          + Nouvelle ligne
        </button>
      </div>

      {/* Liste des lignes */}
      {loading ? (
        <div className="text-center py-10 text-slate-500">Chargement...</div>
      ) : buses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Aucune ligne de bus enregistrée</p>
          <p className="text-sm text-slate-400 mt-1">
            Cliquez sur "Nouvelle ligne" pour commencer
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {buses.map((bus) => (
            <div
              key={bus._id}
              className={`bg-white rounded-xl border p-4 shadow-sm transition-all ${
                !bus.isActive ? "opacity-60 bg-slate-50" : ""
              }`}
            >
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-medium text-slate-800">
                    Ligne {bus.lineName}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {bus.stops?.map((s) => s.name).join(" → ")}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    📍 {bus.stops?.length || 0} arrêts
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleLineActive(bus)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      bus.isActive
                        ? "border border-slate-300 text-slate-600 hover:bg-slate-100"
                        : "bg-slate-800 text-white hover:bg-slate-700"
                    }`}
                  >
                    {bus.isActive ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    onClick={() => editLine(bus)}
                    className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteLine(bus._id, bus.lineName)}
                    className="px-3 py-1.5 border border-red-200 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nouvelle ligne avec carte */}
      {showLineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-medium text-slate-800 mb-4">
              {editingLine ? "✏️ Modifier la ligne" : "➕ Nouvelle ligne de bus"}
            </h2>

            {/* Nom de la ligne */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nom de la ligne <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lineForm.lineName}
                onChange={(e) =>
                  setLineForm({ ...lineForm, lineName: e.target.value })
                }
                className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="Ex: 40, 101, Est-Ouest"
              />
            </div>

            {/* Liste des arrêts */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Arrêts de la ligne (ordre du parcours)
              </label>
              
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto border rounded-lg p-2 bg-slate-50">
                {lineForm.stops.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-4">
                    Aucun arrêt. Ajoutez-en un ci-dessous.
                  </p>
                ) : (
                  lineForm.stops.map((stop, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-white rounded-lg border"
                    >
                      <div>
                        <span className="font-medium text-slate-700">
                          {idx + 1}. {stop.name}
                        </span>
                        {stop.coordinates && (
                          <span className="text-xs text-slate-400 ml-2">
                            📍 {stop.coordinates.lat.toFixed(4)}, {stop.coordinates.lng.toFixed(4)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveStopFromLine(idx)}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Ajouter un arrêt avec carte */}
              <div className="border rounded-lg p-4 bg-slate-50">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  🗺️ Ajouter un arrêt à la ligne
                </p>
                <input
                  type="text"
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  placeholder="Nom de l'arrêt"
                  className="w-full border border-slate-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />

                <MapSelector
                  onLocationSelect={setSelectedStopPosition}
                  selectedLocation={selectedStopPosition}
                  center={mapCenter}
                  zoom={mapZoom}
                />

                <button
                  onClick={handleAddStopToLine}
                  disabled={!newStopName || !selectedStopPosition}
                  className="w-full mt-3 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  + Ajouter cet arrêt à la ligne
                </button>
              </div>
            </div>

            {/* Ligne active */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lineForm.isActive}
                  onChange={(e) =>
                    setLineForm({ ...lineForm, isActive: e.target.checked })
                  }
                  className="rounded border-slate-300 w-4 h-4"
                />
                <span className="text-sm text-slate-700">Ligne active</span>
              </label>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLineModal(false);
                  resetLineForm();
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveLine}
                className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                {editingLine ? "Mettre à jour" : "Créer la ligne"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}