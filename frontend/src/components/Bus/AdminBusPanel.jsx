import { useState, useEffect, useCallback } from "react";
import { busAPI, stopsAPI } from "../../services/api";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import { RouteBadge } from "../ui/Badge";
import { LineCardSkeleton, StatCardSkeleton } from "../ui/Skeleton";
import { showToast } from "../ui/Toast";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ROUTE_COLORS = ["blue", "indigo", "emerald", "amber", "red", "purple", "cyan", "pink"];

const FIANAR_CENTER = [-21.4527, 47.0878];

const stopMarkerIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `
    <div style="
      width: 32px; height: 32px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(99,102,241,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function MapClickHandler({ editingStop, stopForm, setEditingStop, setStopForm }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (editingStop) {
        setEditingStop({ ...editingStop, coordinates: { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) } });
      } else {
        setStopForm({ ...stopForm, lat: lat.toFixed(6), lng: lng.toFixed(6) });
      }
    },
  });
  return null;
}

function LocationMarker({ editingStop, stopForm }) {
  const pos = editingStop
    ? (editingStop.coordinates?.lat != null ? [editingStop.coordinates.lat, editingStop.coordinates.lng] : null)
    : (stopForm.lat ? [parseFloat(stopForm.lat), parseFloat(stopForm.lng)] : null);

  if (!pos) return null;
  return <Marker position={pos} icon={stopMarkerIcon} />;
}

function StatCard({ icon, label, value, color = "blue" }) {
  const gradients = {
    blue: "from-blue-500 to-blue-600 shadow-blue-500/20",
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/20",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/20",
    amber: "from-amber-500 to-yellow-500 shadow-amber-500/20",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1.5">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center shadow-lg`}>
          <span className="text-white w-5 h-5">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function StopList({ stops, onEdit, onDelete, loading }) {
  if (loading) {
    return Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-3 bg-slate-100 rounded w-1/3" />
        </div>
      </div>
    ));
  }

  if (stops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm text-slate-400 font-medium">Aucun arrêt</p>
        <p className="text-xs text-slate-300 mt-1">Créez votre premier arrêt</p>
      </div>
    );
  }

  return stops.map((stop) => (
    <div key={stop._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{stop.name}</p>
        <p className="text-xs text-slate-400">
          {stop.coordinates?.lat?.toFixed(4)}, {stop.coordinates?.lng?.toFixed(4)}
        </p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button onClick={() => onEdit(stop)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Modifier">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={() => onDelete(stop._id, stop.name)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Supprimer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  ));
}

export default function AdminBusPanel() {
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showLineModal, setShowLineModal] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [editingLine, setEditingLine] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stopForm, setStopForm] = useState({ name: "", lat: "", lng: "" });
  const [lineForm, setLineForm] = useState({
    lineName: "",
    forwardStops: [],
    forwardTimes: [],
    hasReturnTrip: false,
    returnStops: [],
    returnTimes: [],
    isActive: true,
  });
  const [newStopName, setNewStopName] = useState("");
  const [newStopTime, setNewStopTime] = useState("");
  const [returnStopName, setReturnStopName] = useState("");
  const [returnStopTime, setReturnStopTime] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [busesRes, stopsRes] = await Promise.all([
        busAPI.getAll(),
        stopsAPI.getAll(),
      ]);
      setBuses(busesRes.data.data);
      setStops(stopsRes.data.data);
    } catch {
      showToast("Erreur lors du chargement des données", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const handleAddStop = async () => {
    if (!stopForm.name || !stopForm.lat || !stopForm.lng) {
      showToast("Tous les champs sont requis", "error");
      return;
    }
    try {
      await stopsAPI.create({
        name: stopForm.name,
        coordinates: { lat: parseFloat(stopForm.lat), lng: parseFloat(stopForm.lng) }
      });
      fetchData();
      setStopForm({ name: "", lat: "", lng: "" });
      showToast("Arrêt ajouté avec succès", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de l'ajout", "error");
    }
  };

  const handleUpdateStop = async () => {
    if (!editingStop) return;
    try {
      await stopsAPI.update(editingStop._id, {
        name: editingStop.name,
        coordinates: editingStop.coordinates
      });
      fetchData();
      setEditingStop(null);
      showToast("Arrêt mis à jour", "success");
    } catch {
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  const handleDeleteStop = async (id, name) => {
    if (!window.confirm(`Supprimer l'arrêt "${name}" ?`)) return;
    try {
      await stopsAPI.delete(id);
      fetchData();
      showToast("Arrêt supprimé", "success");
    } catch {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const handleAddForwardStop = () => {
    if (newStopName && newStopTime) {
      setLineForm({
        ...lineForm,
        forwardStops: [...lineForm.forwardStops, newStopName],
        forwardTimes: [...lineForm.forwardTimes, parseInt(newStopTime)],
      });
      setNewStopName("");
      setNewStopTime("");
    }
  };

  const handleRemoveForwardStop = (index) => {
    setLineForm({
      ...lineForm,
      forwardStops: lineForm.forwardStops.filter((_, i) => i !== index),
      forwardTimes: lineForm.forwardTimes.filter((_, i) => i !== index),
    });
  };

  const handleAddReturnStop = () => {
    if (returnStopName && returnStopTime) {
      setLineForm({
        ...lineForm,
        returnStops: [...lineForm.returnStops, returnStopName],
        returnTimes: [...lineForm.returnTimes, parseInt(returnStopTime)],
      });
      setReturnStopName("");
      setReturnStopTime("");
    }
  };

  const handleRemoveReturnStop = (index) => {
    setLineForm({
      ...lineForm,
      returnStops: lineForm.returnStops.filter((_, i) => i !== index),
      returnTimes: lineForm.returnTimes.filter((_, i) => i !== index),
    });
  };

  const handleSaveLine = async () => {
    if (!lineForm.lineName || lineForm.forwardStops.length < 2) {
      showToast("Nom et au moins 2 arrêts requis", "error");
      return;
    }
    try {
      if (editingLine) {
        await busAPI.update(editingLine._id, lineForm);
      } else {
        await busAPI.create(lineForm);
      }
      fetchData();
      setShowLineModal(false);
      resetLineForm();
      showToast(editingLine ? "Ligne modifiée" : "Ligne créée", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    }
  };

  const resetLineForm = () => {
    setLineForm({
      lineName: "", forwardStops: [], forwardTimes: [], hasReturnTrip: false,
      returnStops: [], returnTimes: [], isActive: true,
    });
    setEditingLine(null);
  };

  const editLine = (line) => {
    setEditingLine(line);
    setLineForm({
      lineName: line.lineName,
      forwardStops: line.forwardStops?.map(s => s.name) || [],
      forwardTimes: line.forwardTimes || [],
      hasReturnTrip: line.hasReturnTrip || false,
      returnStops: line.returnStops?.map(s => s.name) || [],
      returnTimes: line.returnTimes || [],
      isActive: line.isActive,
    });
    setShowLineModal(true);
  };

  const deleteLine = async (id, name) => {
    if (!window.confirm(`Supprimer la ligne "${name}" ?`)) return;
    try {
      await busAPI.delete(id);
      fetchData();
      showToast("Ligne supprimée", "success");
    } catch {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const stats = [
    { icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>, label: "Lignes de bus", value: buses.length, color: "blue" },
    { icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, label: "Arrêts", value: stops.length, color: "emerald" },
    { icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: "Lignes actives", value: buses.filter(b => b.isActive).length, color: "indigo" },
    { icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, label: "Trajets possibles", value: buses.reduce((sum, b) => sum + (b.forwardStops?.length || 0) * (b.hasReturnTrip ? 2 : 1), 0), color: "amber" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          stats.map((stat, i) => <StatCard key={i} {...stat} />)
        )}
      </div>

      {/* Actions bar */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          size="md"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          onClick={() => setShowStopModal(true)}
        >
          Gérer les arrêts
        </Button>
        <Button
          variant="secondary"
          size="md"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
          onClick={() => { resetLineForm(); setShowLineModal(true); }}
        >
          Nouvelle ligne
        </Button>
      </div>

      {/* Bus line cards */}
      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => <LineCardSkeleton key={i} />)}
        </div>
      ) : buses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-5 shadow-sm">
            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-600 mb-1">Aucune ligne de bus</h3>
          <p className="text-sm text-slate-400 mb-6">Créez votre première ligne pour commencer</p>
          <Button variant="primary" onClick={() => { resetLineForm(); setShowLineModal(true); }}>
            Créer une ligne
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {buses.map((bus, index) => (
            <div
              key={bus._id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <RouteBadge lineName={bus.lineName} color={ROUTE_COLORS[index % ROUTE_COLORS.length]} />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Aller</span>
                      <span className="text-xs text-slate-500">
                        {bus.forwardStops?.map(s => s.name).join(" → ") || "Aucun arrêt"}
                      </span>
                    </div>
                    {bus.hasReturnTrip && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Retour</span>
                        <span className="text-xs text-slate-500">
                          {bus.returnStops?.map(s => s.name).join(" → ") || "Aucun arrêt"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {bus.forwardStops?.length || 0} arrêts
                      </span>
                      <span className={`flex items-center gap-1 ${bus.isActive ? "text-emerald-500" : "text-slate-300"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${bus.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                        {bus.isActive ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 sm:shrink-0">
                  <Button variant="secondary" size="sm" onClick={() => editLine(bus)}
                    icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
                    Modifier
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteLine(bus._id, bus.lineName)}
                    icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}>
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stop Modal */}
      <Modal isOpen={showStopModal} onClose={() => { setShowStopModal(false); setEditingStop(null); }} title="Gestion des arrêts" size="lg">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              {editingStop ? "Modifier l'arrêt" : "Ajouter un arrêt"}
            </h3>
            <div className="space-y-3 mb-4">
              <Input
                label="Nom de l'arrêt"
                value={editingStop ? editingStop.name : stopForm.name}
                onChange={(e) => editingStop
                  ? setEditingStop({...editingStop, name: e.target.value})
                  : setStopForm({...stopForm, name: e.target.value})
                }
              />
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">
                  Positionner sur la carte
                </label>
                <div className="h-56 rounded-xl overflow-hidden border border-slate-200">
                  <MapContainer
                    key={editingStop?._id || "new"}
                    center={editingStop?.coordinates?.lat != null
                      ? [editingStop.coordinates.lat, editingStop.coordinates.lng]
                      : FIANAR_CENTER}
                    zoom={editingStop ? 15 : 13}
                    className="h-full w-full"
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler editingStop={editingStop} stopForm={stopForm} setEditingStop={setEditingStop} setStopForm={setStopForm} />
                    <LocationMarker editingStop={editingStop} stopForm={stopForm} />
                  </MapContainer>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-mono">
                  <span>Lat: {editingStop ? editingStop.coordinates?.lat?.toFixed(4) || "—" : stopForm.lat || "—"}</span>
                  <span>Lng: {editingStop ? editingStop.coordinates?.lng?.toFixed(4) || "—" : stopForm.lng || "—"}</span>
                  <span className="text-slate-300">(cliquez sur la carte)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={editingStop ? handleUpdateStop : handleAddStop}>
                {editingStop ? "Mettre à jour" : "Ajouter l'arrêt"}
              </Button>
              {editingStop && (
                <Button variant="ghost" size="sm" onClick={() => setEditingStop(null)}>
                  Annuler
                </Button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Arrêts existants ({stops.length})
            </h3>
            <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto rounded-xl border border-slate-100 bg-white">
              <StopList stops={stops} onEdit={setEditingStop} onDelete={handleDeleteStop} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Line Modal */}
      <Modal isOpen={showLineModal} onClose={() => { setShowLineModal(false); resetLineForm(); }} title={editingLine ? "Modifier la ligne" : "Nouvelle ligne"} size="xl">
        <div className="space-y-6">
          <Input
            label="Nom de la ligne"
            value={lineForm.lineName}
            onChange={(e) => setLineForm({...lineForm, lineName: e.target.value})}
            placeholder="Ex: 40, 101, 12"
          />

          {/* Forward direction */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Sens aller
            </h3>
            <div className="space-y-2 mb-3">
              {lineForm.forwardStops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white rounded-xl p-3 shadow-sm border border-blue-50 animate-scale-in">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-700 truncate">{stop}</span>
                    <span className="text-xs text-slate-400 shrink-0">
                      {lineForm.forwardTimes[idx]} min
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveForwardStop(idx)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <select
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                >
                  <option value="">Sélectionner un arrêt</option>
                  {stops.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <input
                type="number"
                placeholder="Minutes"
                value={newStopTime}
                onChange={(e) => setNewStopTime(e.target.value)}
                className="w-24 rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <Button variant="primary" size="md" onClick={handleAddForwardStop}
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
                Ajouter
              </Button>
            </div>
          </div>

          {/* Return direction toggle */}
          <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all">
            <div className="relative">
              <input
                type="checkbox"
                checked={lineForm.hasReturnTrip}
                onChange={(e) => setLineForm({...lineForm, hasReturnTrip: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-blue-500 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow-sm after:transition-all peer-checked:after:translate-x-4" />
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700">Ligne aller-retour</span>
              <p className="text-xs text-slate-400">Ajouter un sens retour avec ses propres arrêts</p>
            </div>
          </label>

          {/* Return direction */}
          {lineForm.hasReturnTrip && (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 border border-red-100 animate-slide-down">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Sens retour
              </h3>
              <div className="space-y-2 mb-3">
                {lineForm.returnStops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white rounded-xl p-3 shadow-sm border border-red-50 animate-scale-in">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-orange-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-700 truncate">{stop}</span>
                      <span className="text-xs text-slate-400 shrink-0">
                        {lineForm.returnTimes[idx]} min
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveReturnStop(idx)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <select
                    value={returnStopName}
                    onChange={(e) => setReturnStopName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  >
                    <option value="">Sélectionner un arrêt</option>
                    {stops.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <input
                  type="number"
                  placeholder="Minutes"
                  value={returnStopTime}
                  onChange={(e) => setReturnStopTime(e.target.value)}
                  className="w-24 rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <Button variant="danger" size="md" onClick={handleAddReturnStop}
                  icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
                  Ajouter
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="lg" className="flex-1" onClick={() => { setShowLineModal(false); resetLineForm(); }}>
              Annuler
            </Button>
            <Button variant="primary" size="lg" className="flex-1" onClick={handleSaveLine}>
              {editingLine ? "Enregistrer les modifications" : "Créer la ligne"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
