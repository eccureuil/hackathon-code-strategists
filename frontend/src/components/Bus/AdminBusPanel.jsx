import { useState, useEffect } from "react";
import { busAPI, stopsAPI } from "../../services/api";

export default function AdminBusPanel() {
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showLineModal, setShowLineModal] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [editingLine, setEditingLine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Formulaire arrêt
  const [stopForm, setStopForm] = useState({ name: "", lat: "", lng: "" });
  
  // Formulaire ligne
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
      setBuses(busesRes.data.data);
      setStops(stopsRes.data.data);
    } catch (err) {
      setError("Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStop = async () => {
    if (!stopForm.name || !stopForm.lat || !stopForm.lng) {
      setError("Tous les champs sont requis");
      return;
    }
    try {
      await stopsAPI.create({
        name: stopForm.name,
        coordinates: { lat: parseFloat(stopForm.lat), lng: parseFloat(stopForm.lng) }
      });
      fetchData();
      setStopForm({ name: "", lat: "", lng: "" });
      setSuccess("Arrêt ajouté");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
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
      setSuccess("Arrêt modifié");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erreur");
    }
  };

  const handleDeleteStop = async (id, name) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    try {
      await stopsAPI.delete(id);
      fetchData();
      setSuccess("Arrêt supprimé");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
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
      setError("Nom et au moins 2 arrêts requis");
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
      setSuccess(editingLine ? "Ligne modifiée" : "Ligne créée");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  const resetLineForm = () => {
    setLineForm({
      lineName: "",
      forwardStops: [],
      forwardTimes: [],
      hasReturnTrip: false,
      returnStops: [],
      returnTimes: [],
      isActive: true,
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
    if (!confirm(`Supprimer la ligne "${name}" ?`)) return;
    try {
      await busAPI.delete(id);
      fetchData();
      setSuccess("Ligne supprimée");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erreur");
    }
  };

  return (
    <div>
      {/* Messages */}
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <button onClick={() => setShowStopModal(true)} className="px-5 py-2.5 bg-slate-800 text-white rounded-lg">
          Gérer les arrêts
        </button>
        <button onClick={() => { resetLineForm(); setShowLineModal(true); }} className="px-5 py-2.5 border border-slate-300 rounded-lg">
          Nouvelle ligne
        </button>
      </div>

      {/* Liste des lignes */}
      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : buses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">Aucune ligne</div>
      ) : (
        <div className="grid gap-4">
          {buses.map((bus) => (
            <div key={bus._id} className="bg-white rounded-xl border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium">Ligne {bus.lineName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Aller: {bus.forwardStops?.map(s => s.name).join(" → ")}
                  </p>
                  {bus.hasReturnTrip && (
                    <p className="text-sm text-gray-500 mt-1">
                      Retour: {bus.returnStops?.map(s => s.name).join(" → ")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editLine(bus)} className="px-3 py-1 border rounded">Modifier</button>
                  <button onClick={() => deleteLine(bus._id, bus.lineName)} className="px-3 py-1 border border-red-200 text-red-600 rounded">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Arrêts */}
      {showStopModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-medium mb-4">Gestion des arrêts</h2>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">{editingStop ? "Modifier" : "Ajouter"} un arrêt</h3>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input type="text" placeholder="Nom" value={editingStop ? editingStop.name : stopForm.name}
                  onChange={(e) => editingStop ? setEditingStop({...editingStop, name: e.target.value}) : setStopForm({...stopForm, name: e.target.value})}
                  className="border rounded p-2" />
                <input type="number" step="any" placeholder="Latitude" value={editingStop ? editingStop.coordinates?.lat : stopForm.lat}
                  onChange={(e) => editingStop ? setEditingStop({...editingStop, coordinates: {...editingStop.coordinates, lat: parseFloat(e.target.value)}}) : setStopForm({...stopForm, lat: e.target.value})}
                  className="border rounded p-2" />
                <input type="number" step="any" placeholder="Longitude" value={editingStop ? editingStop.coordinates?.lng : stopForm.lng}
                  onChange={(e) => editingStop ? setEditingStop({...editingStop, coordinates: {...editingStop.coordinates, lng: parseFloat(e.target.value)}}) : setStopForm({...stopForm, lng: e.target.value})}
                  className="border rounded p-2" />
              </div>
              <button onClick={editingStop ? handleUpdateStop : handleAddStop} className="px-4 py-2 bg-slate-800 text-white rounded">
                {editingStop ? "Mettre à jour" : "Ajouter"}
              </button>
              {editingStop && <button onClick={() => setEditingStop(null)} className="ml-2 px-4 py-2 border rounded">Annuler</button>}
            </div>

            <div className="max-h-64 overflow-y-auto">
              {stops.map((stop) => (
                <div key={stop._id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p className="font-medium">{stop.name}</p>
                    <p className="text-xs text-gray-500">{stop.coordinates?.lat}, {stop.coordinates?.lng}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingStop(stop)} className="text-blue-600">Modifier</button>
                    <button onClick={() => handleDeleteStop(stop._id, stop.name)} className="text-red-600">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => { setShowStopModal(false); setEditingStop(null); }} className="w-full mt-4 p-2 border rounded">Fermer</button>
          </div>
        </div>
      )}

      {/* Modal Lignes */}
      {showLineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-medium mb-4">{editingLine ? "Modifier" : "Nouvelle"} ligne</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nom de la ligne</label>
              <input type="text" value={lineForm.lineName} onChange={(e) => setLineForm({...lineForm, lineName: e.target.value})} className="w-full border rounded p-2" />
            </div>

            {/* Sens Aller */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Sens Aller (Départ → Terminus)</label>
              {lineForm.forwardStops.map((stop, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <span className="flex-1 p-2 bg-gray-50 rounded">{stop} → {lineForm.forwardTimes[idx]} min</span>
                  <button onClick={() => handleRemoveForwardStop(idx)} className="text-red-600">Supprimer</button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <select value={newStopName} onChange={(e) => setNewStopName(e.target.value)} className="flex-1 border rounded p-2">
                  <option value="">Sélectionner un arrêt</option>
                  {stops.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
                <input type="number" placeholder="Temps (min)" value={newStopTime} onChange={(e) => setNewStopTime(e.target.value)} className="w-24 border rounded p-2" />
                <button onClick={handleAddForwardStop} className="px-4 py-2 bg-slate-800 text-white rounded">+</button>
              </div>
            </div>

            {/* Sens Retour */}
            <div className="mb-4">
              <label className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={lineForm.hasReturnTrip} onChange={(e) => setLineForm({...lineForm, hasReturnTrip: e.target.checked})} />
                <span className="font-medium">Ligne aller-retour (sens retour)</span>
              </label>
              
              {lineForm.hasReturnTrip && (
                <div className="ml-4">
                  <label className="block text-sm font-medium mb-1">Sens Retour</label>
                  {lineForm.returnStops.map((stop, idx) => (
                    <div key={idx} className="flex gap-2 mb-1">
                      <span className="flex-1 p-2 bg-gray-50 rounded">{stop} → {lineForm.returnTimes[idx]} min</span>
                      <button onClick={() => handleRemoveReturnStop(idx)} className="text-red-600">Supprimer</button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <select value={returnStopName} onChange={(e) => setReturnStopName(e.target.value)} className="flex-1 border rounded p-2">
                      <option value="">Sélectionner un arrêt</option>
                      {stops.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                    </select>
                    <input type="number" placeholder="Temps (min)" value={returnStopTime} onChange={(e) => setReturnStopTime(e.target.value)} className="w-24 border rounded p-2" />
                    <button onClick={handleAddReturnStop} className="px-4 py-2 bg-slate-800 text-white rounded">+</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => { setShowLineModal(false); resetLineForm(); }} className="flex-1 p-2 border rounded">Annuler</button>
              <button onClick={handleSaveLine} className="flex-1 p-2 bg-slate-800 text-white rounded">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}