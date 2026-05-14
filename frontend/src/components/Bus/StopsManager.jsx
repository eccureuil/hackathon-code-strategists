import { useState, useEffect } from "react";
import { busAPI } from "../../services/api";

export default function StopsManager({ onClose, onSave }) {
  const [stops, setStops] = useState([]);
  const [newStop, setNewStop] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStops();
  }, []);

  const fetchStops = async () => {
    try {
      setLoading(true);
      const response = await busAPI.getAllStops();
      setStops(response.data);
    } catch (err) {
      setError("Erreur chargement des arrêts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStop = async () => {
    if (!newStop.trim()) return;
    try {
      await busAPI.createStop(newStop.trim());
      fetchStops();
      setNewStop("");
      if (onSave) onSave();
    } catch (err) {
      setError("Erreur lors de l'ajout");
    }
  };

  const handleDeleteStop = async (stopName) => {
    if (!confirm(`Supprimer l'arrêt "${stopName}" ?`)) return;
    try {
      await busAPI.deleteStop(stopName);
      fetchStops();
      if (onSave) onSave();
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        await busAPI.importData(data);
        fetchStops();
        if (onSave) onSave();
        alert("Import réussi !");
      } catch (err) {
        setError("Fichier JSON invalide");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = async () => {
    try {
      const response = await busAPI.exportData();
      const dataStr = JSON.stringify(response.data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bus_data_${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Erreur lors de l'export");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">Gestion des arrêts</h3>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        {/* Ajouter un arrêt */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newStop}
            onChange={(e) => setNewStop(e.target.value)}
            placeholder="Nom du nouvel arrêt"
            className="border rounded p-2 flex-1"
          />
          <button
            onClick={handleAddStop}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Ajouter
          </button>
        </div>
        
        {/* Liste des arrêts */}
        <div className="mb-4 max-h-64 overflow-y-auto">
          {loading ? (
            <p className="text-center py-4">Chargement...</p>
          ) : stops.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              Aucun arrêt enregistré
            </p>
          ) : (
            <div className="space-y-1">
              {stops.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span>{stop}</span>
                  <button
                    onClick={() => handleDeleteStop(stop)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Import/Export */}
        <div className="flex gap-2 mb-4">
          <label className="flex-1">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <span className="block text-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
              📂 Importer JSON
            </span>
          </label>
          <button
            onClick={handleExport}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            💾 Exporter JSON
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}