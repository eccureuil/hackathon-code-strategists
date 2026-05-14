import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const FIANAR_BOUNDS = [
  [-21.55, 47.0],
  [-21.35, 47.18],
];

const FIANAR_CENTER = [-21.4527, 47.0878];

function createMarkerIcon(category) {
  const colors = {
    religieux: "#7c3aed",
    colonial: "#d97706",
    culturel: "#2563eb",
    naturel: "#059669",
    gastronomie: "#ea580c",
  };

  const color = colors[category] || "#059669";

  return L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div style="
        width: 36px; height: 36px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

function MarkerCluster({ places, onPlaceClick }) {
  const map = useMap();
  const clusterGroupRef = useRef(null);

  useEffect(() => {
    if (!map || !places?.length) return;

    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }

    const mcg = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="custom-cluster" style="width: ${count > 99 ? "48px" : "40px"}; height: ${count > 99 ? "48px" : "40px"}">${count}</div>`,
          className: "custom-marker-icon",
          iconSize: L.point(40, 40),
        });
      },
    });

    places.forEach((place) => {
      const coords = place.location?.coordinates;
      if (!coords) return;

      const marker = L.marker([coords[1], coords[0]], {
        icon: createMarkerIcon(place.category),
      });

      marker.bindPopup(`
        <div style="min-width: 180px;">
          <strong style="font-size: 15px; color: #1e293b;">${place.name}</strong>
          <p style="margin: 4px 0 8px; font-size: 12px; color: #64748b; text-transform: capitalize;">${place.category}</p>
          <p style="font-size: 13px; color: #475569; margin: 0 0 8px;">${place.description?.slice(0, 80)}...</p>
          <button
            onclick="window.dispatchEvent(new CustomEvent('place-click', { detail: '${place._id}' }))"
            style="
              background: #059669; color: white; border: none;
              padding: 6px 12px; border-radius: 8px; font-size: 12px;
              cursor: pointer;
            "
          >Voir détails</button>
        </div>
      `);

      mcg.addLayer(marker);
    });

    map.addLayer(mcg);
    clusterGroupRef.current = mcg;

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }
    };
  }, [map, places, onPlaceClick]);

  useEffect(() => {
    const handler = (e) => {
      const place = places.find((p) => p._id === e.detail);
      if (place) onPlaceClick?.(place);
    };
    window.addEventListener("place-click", handler);
    return () => window.removeEventListener("place-click", handler);
  }, [places, onPlaceClick]);

  return null;
}

function MapBounds() {
  const map = useMap();
  useEffect(() => {
    map.setMaxBounds(FIANAR_BOUNDS);
    map.setMinZoom(11);
  }, [map]);
  return null;
}

export default function Map({ places, onPlaceClick, className = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}, Fianarantsoa`
      );
      const data = await res.json();
      if (data.length > 0 && mapRef.current) {
        const map = mapRef.current;
        map.flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)], 16, {
          duration: 0.8,
        });
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 ${className}`}>
      <form
        onSubmit={handleSearch}
        className="absolute top-3 left-3 right-3 z-[1000] max-w-md mx-auto"
      >
        <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <svg className="w-5 h-5 text-slate-400 ml-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un lieu à Fianarantsoa..."
            className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      <MapContainer
        center={FIANAR_CENTER}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds />
        <MarkerCluster places={places} onPlaceClick={onPlaceClick} />
      </MapContainer>
    </div>
  );
}
