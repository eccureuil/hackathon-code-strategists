export default function BusList({ buses, loading, onEdit, onDelete, onDuplicate, onToggleActive }) {
  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }
  
  if (buses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun bus enregistré. Cliquez sur "Nouveau bus" pour commencer.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {buses.map((bus) => (
        <div
          key={bus._id}
          className={`border rounded-lg p-4 shadow-sm ${
            !bus.isActive ? "bg-gray-50 opacity-75" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Ligne {bus.lineName}</h3>
                {!bus.isActive && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {bus.departure || bus.stops?.[0]} → {bus.terminus || bus.stops?.[bus.stops?.length - 1]}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {bus.stops?.length || 0} arrêts • Temps total:{" "}
                {bus.timesBetweenStops?.reduce((a, b) => a + b, 0) || 0} min
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onToggleActive(bus)}
                className={`px-3 py-1 rounded text-sm ${
                  bus.isActive
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {bus.isActive ? "Désactiver" : "Activer"}
              </button>
              <button
                onClick={() => onDuplicate(bus)}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
              >
                Dupliquer
              </button>
              <button
                onClick={() => onEdit(bus)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Modifier
              </button>
              <button
                onClick={() => onDelete(bus._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}