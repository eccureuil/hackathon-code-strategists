import { useEffect, useRef } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function RouteMap({ stops, returnStops, hasReturnTrip, lineName, onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([-21.45, 47.08], 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    const allMarkers = [];

    const addStopsToMap = (stopsList, color, label) => {
      const coords = [];
      stopsList.forEach((stop, idx) => {
        if (stop.coordinates?.lat && stop.coordinates?.lng) {
          const marker = L.marker([stop.coordinates.lat, stop.coordinates.lng]).addTo(map);
          marker.bindPopup(`<b>${stop.name}</b><br>${label} ${idx === 0 ? "Départ" : idx === stopsList.length - 1 ? "Terminus" : `Arrêt ${idx}`}`);
          allMarkers.push(marker);
          coords.push([stop.coordinates.lat, stop.coordinates.lng]);
        }
      });
      if (coords.length >= 2) {
        const polyline = L.polyline(coords, { color, weight: 4, opacity: 0.8 }).addTo(map);
        allMarkers.push(polyline);
        return coords;
      }
      return [];
    };

    const allCoords = [];
    if (stops && stops.length) {
      const coords = addStopsToMap(stops, "#2563eb", "Aller");
      allCoords.push(...coords);
    }
    if (hasReturnTrip && returnStops && returnStops.length) {
      const coords = addStopsToMap(returnStops, "#dc2626", "Retour");
      allCoords.push(...coords);
    }

    if (allCoords.length) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    return () => { if (mapInstanceRef.current) mapInstanceRef.current.remove(); };
  }, [stops, returnStops, hasReturnTrip]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Ligne {lineName} - Parcours</h3>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>
        <div ref={mapRef} className="w-full h-96"></div>
        <div className="p-3 bg-gray-50 rounded-b-xl text-xs text-center text-gray-500">
          Bleu: Aller | Rouge: Retour
        </div>
      </div>
    </div>
  );
}