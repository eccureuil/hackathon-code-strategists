import { useState } from "react";
import Modal from "./ui/Modal";
import Badge from "./ui/Badge";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { API_BASE } from "../services/api";

const detailIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `
    <div style="
      width: 40px; height: 40px;
      background: #059669;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function PlaceModal({ place, onClose }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  if (!place) return null;

  const photos = place.photos || [];
  const coords = place.location?.coordinates;
  const lat = coords?.[1];
  const lng = coords?.[0];

  return (
    <Modal open={!!place} onClose={onClose} className="max-w-4xl">
      <div className="flex flex-col md:flex-row max-h-[85vh]">
        {/* Left: Image Gallery */}
        <div className="md:w-3/5 bg-slate-900 relative flex items-center justify-center min-h-[300px] md:min-h-full">
          {photos.length > 0 ? (
            <>
              <img
                src={`${API_BASE}/${photos[photoIndex]}`}
                alt={place.name}
                className="w-full h-full object-cover absolute inset-0"
              />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => setPhotoIndex((p) => (p === 0 ? photos.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-slate-700 transition-all z-10"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPhotoIndex((p) => (p === photos.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-slate-700 transition-all z-10"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPhotoIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === photoIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-slate-500 flex flex-col items-center gap-2">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Aucune image</span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all z-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Right: Details */}
        <div className="md:w-2/5 p-6 overflow-y-auto space-y-5">
          <div className="space-y-3">
            <Badge category={place.category} size="md" />
            <h2 className="text-2xl font-bold text-slate-800 leading-tight">
              {place.name}
            </h2>
          </div>

          {place.description && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{place.description}</p>
            </div>
          )}

          {place.history && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Histoire</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{place.history}</p>
            </div>
          )}

          {place.tags?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {place.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {lat && lng && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Localisation</h4>
              <div className="h-40 rounded-xl overflow-hidden border border-slate-200">
                <MapContainer
                  center={[lat, lng]}
                  zoom={15}
                  className="h-full w-full"
                  scrollWheelZoom={false}
                  zoomControl={false}
                  dragging={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[lat, lng]} icon={detailIcon} />
                </MapContainer>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 font-mono">
                {lng.toFixed(4)}, {lat.toFixed(4)}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
