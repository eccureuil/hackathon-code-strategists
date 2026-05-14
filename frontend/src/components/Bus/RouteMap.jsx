import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function createBusStopIcon(type) {
  const colors = {
    forward: { bg: "#3b82f6", border: "#2563eb" },
    return: { bg: "#ef4444", border: "#dc2626" },
    start: { bg: "#10b981", border: "#059669" },
    end: { bg: "#8b5cf6", border: "#7c3aed" },
  };
  const c = colors[type] || colors.forward;

  return L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div style="
        width: 14px; height: 14px;
        background: ${c.bg};
        border: 3px solid ${c.border};
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: transform 0.2s;
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function createStationIcon(name, isTerminus) {
  const bg = isTerminus ? "#8b5cf6" : "#3b82f6";
  return L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div style="
        width: 36px; height: 36px;
        background: ${bg};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

export default function RouteMap({ stops, returnStops, hasReturnTrip, lineName, onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([-21.45, 47.08], 13);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    mapInstanceRef.current = map;
    const markers = [];

    const createPopupContent = (stop, idx, total, direction) => {
      const role = idx === 0 ? "Départ" : idx === total - 1 ? "Terminus" : `Arrêt ${idx}`;
      return `
        <div style="min-width: 160px; font-family: system-ui, sans-serif;">
          <strong style="font-size: 14px; color: #1e293b;">${stop.name}</strong>
          <p style="margin: 2px 0 0; font-size: 11px; color: ${direction === 'return' ? '#ef4444' : '#3b82f6'}; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">
            ${direction === 'return' ? 'Retour' : 'Aller'} · ${role}
          </p>
        </div>
      `;
    };

    const allCoords = [];

    const addStopsWithLine = (stopsList, direction) => {
      if (!stopsList || stopsList.length < 2) return;

      const color = direction === "return" ? "#ef4444" : "#3b82f6";
      const coords = [];

      stopsList.forEach((stop, idx) => {
        if (!stop.coordinates?.lat || !stop.coordinates?.lng) return;
        const latlng = [stop.coordinates.lat, stop.coordinates.lng];
        coords.push(latlng);

        const type = idx === 0 ? "start" : idx === stopsList.length - 1 ? "end" : direction;
        const isTerminus = idx === 0 || idx === stopsList.length - 1;
        const icon = isTerminus ? createStationIcon(stop.name, idx === stopsList.length - 1) : createBusStopIcon(type, "");

        const marker = L.marker(latlng, { icon }).addTo(map);
        marker.bindPopup(createPopupContent(stop, idx, stopsList.length, direction));

        marker.bindTooltip(stop.name, {
          permanent: false,
          direction: "top",
          offset: L.point(0, -18),
          className: "custom-tooltip",
        });

        markers.push(marker);
      });

      const polyline = L.polyline(coords, {
        color,
        weight: 4,
        opacity: 0.8,
        dashArray: direction === "return" ? "12, 8" : null,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      polyline.bindTooltip(direction === "return" ? "Retour" : "Aller", {
        permanent: false,
        direction: "center",
        className: "route-label-tooltip",
      });

      markers.push(polyline);
      allCoords.push(...coords);
    };

    addStopsWithLine(stops, "forward");
    if (hasReturnTrip && returnStops) {
      addStopsWithLine(returnStops, "return");
    }

    // Add a stylish "You are here" marker for the first stop
    if (stops && stops.length > 0 && stops[0].coordinates?.lat) {
      const startIcon = L.divIcon({
        className: "custom-marker-icon",
        html: `
          <div style="
            width: 24px; height: 24px;
            background: linear-gradient(135deg, #10b981, #059669);
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
      });

      L.marker([stops[0].coordinates.lat, stops[0].coordinates.lng], { icon: startIcon })
        .addTo(map)
        .bindPopup(`<b>${stops[0].name}</b><br>Point de départ`);
    }

    if (allCoords.length) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stops, returnStops, hasReturnTrip]);

  const departStops = stops || [];
  const retStops = returnStops || [];

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/20">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Ligne {lineName}</h3>
            <p className="text-xs text-slate-400">{departStops.length} arrêts {hasReturnTrip ? `· ${retStops.length} retour` : ""}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Map */}
      <div ref={mapRef} className="w-full h-[400px] sm:h-[500px]" />

      {/* Legend + stop list */}
      <div className="px-5 py-4 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Forward stops */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Aller</span>
              <span className="text-xs text-slate-400 ml-auto">{departStops.length} arrêts</span>
            </div>
            <div className="space-y-1">
              {departStops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? "bg-emerald-500" : idx === departStops.length - 1 ? "bg-purple-500" : "bg-blue-400"}`} />
                    {idx < departStops.length - 1 && <div className="w-0.5 h-3 bg-blue-200" />}
                  </div>
                  <span className={`${idx === 0 || idx === departStops.length - 1 ? "font-semibold text-slate-700" : "text-slate-500"}`}>
                    {stop.name}
                    {idx === 0 && " (Départ)"}
                    {idx === departStops.length - 1 && " (Terminus)"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Return stops */}
          {hasReturnTrip && retStops.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Retour</span>
                <span className="text-xs text-slate-400 ml-auto">{retStops.length} arrêts</span>
              </div>
              <div className="space-y-1">
                {retStops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? "bg-emerald-500" : idx === retStops.length - 1 ? "bg-purple-500" : "bg-red-400"}`} />
                      {idx < retStops.length - 1 && <div className="w-0.5 h-3 bg-red-200" />}
                    </div>
                    <span className={`${idx === 0 || idx === retStops.length - 1 ? "font-semibold text-slate-700" : "text-slate-500"}`}>
                      {stop.name}
                      {idx === 0 && " (Départ)"}
                      {idx === retStops.length - 1 && " (Terminus)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasReturnTrip && (
            <div className="flex items-center justify-center text-xs text-slate-300">
              Ligne simple sens (pas de retour)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
