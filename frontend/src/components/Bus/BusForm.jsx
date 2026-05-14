import { useState, useEffect } from "react";

export default function BusForm({ bus, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    lineName: "",
    departure: "",
    terminus: "",
    stops: [],
    timesBetweenStops: [],
    isActive: true,
  });
  const [newStop, setNewStop] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (bus) {
      setFormData({
        lineName: bus.lineName || "",
        departure: bus.departure || "",
        terminus: bus.terminus || "",
        stops: bus.stops || [],
        timesBetweenStops: bus.timesBetweenStops || [],
        isActive: bus.isActive !== undefined ? bus.isActive : true,
      });
    }
  }, [bus]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddStop = () => {
    if (newStop && newTime) {
      setFormData({
        ...formData,
        stops: [...formData.stops, newStop],
        timesBetweenStops: [...formData.timesBetweenStops, parseInt(newTime)],
      });
      setNewStop("");
      setNewTime("");
    }
  };

  const handleRemoveStop = (index) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    const newTimes = formData.timesBetweenStops.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      stops: newStops,
      timesBetweenStops: newTimes,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.lineName || !formData.departure || !formData.terminus) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (formData.stops.length === 0) {
      alert("Veuillez ajouter au moins un arrêt");
      return;
    }
    
    // Construire la liste complète des arrêts (départ + stops + terminus)
    const allStops = [formData.departure, ...formData.stops, formData.terminus];
    const allTimes = [...formData.timesBetweenStops];
    
    onSave({
      lineName: formData.lineName,
      stops: allStops,
      timesBetweenStops: allTimes,
      isActive: formData.isActive,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {bus ? "Modifier le bus" : "Nouveau bus"}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Nom de la ligne *
            </label>
            <input
              type="text"
              name="lineName"
              value={formData.lineName}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="Ex: 40"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Départ *
              </label>
              <input
                type="text"
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                placeholder="Arrêt de départ"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Terminus *
              </label>
              <input
                type="text"
                name="terminus"
                value={formData.terminus}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                placeholder="Arrêt final"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Arrêts intermédiaires
            </label>
            
            {/* Liste des arrêts existants */}
            {formData.stops.length > 0 && (
              <div className="mb-3 space-y-2">
                {formData.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="flex-1">
                      {stop} → {formData.timesBetweenStops[index]} min
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Ajouter un nouvel arrêt */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newStop}
                onChange={(e) => setNewStop(e.target.value)}
                placeholder="Nom de l'arrêt"
                className="border rounded p-2 flex-1"
              />
              <input
                type="number"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="Temps (min)"
                className="border rounded p-2 w-24"
              />
              <button
                type="button"
                onClick={handleAddStop}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span className="text-sm font-medium">Ligne active</span>
            </label>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {bus ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}