import { useState } from "react";
import API from "../services/api";
import { useToast } from "../hooks/useToast";
import Button from "./ui/Button";
import Input from "./ui/Input";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FIANAR_CENTER = [-21.4527, 47.0878];

const markerIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `
    <div style="
      width: 32px; height: 32px;
      background: #059669;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
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

const categories = [
  { value: "culturel", label: "Culturel" },
  { value: "religieux", label: "Religieux" },
  { value: "naturel", label: "Naturel" },
  { value: "colonial", label: "Colonial" },
  { value: "gastronomie", label: "Gastronomie" },
];

function LocationPicker({ setForm }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setForm((prev) => ({
        ...prev,
        location: { type: "Point", coordinates: [lng, lat] },
      }));
    },
  });
  return null;
}

function SearchControl({ setForm }) {
  const map = useMap();
  const [query, setQuery] = useState("");

  const search = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Fianarantsoa`
      );
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        map.flyTo([lat, lon], 16, { duration: 0.6 });
        setForm((prev) => ({
          ...prev,
          location: { type: "Point", coordinates: [lon, lat] },
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="absolute top-3 left-3 right-3 z-[1000]">
      <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-lg shadow border border-slate-200 overflow-hidden">
        <svg className="w-4 h-4 text-slate-400 ml-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), search())}
          placeholder="Rechercher..."
          className="flex-1 px-2 py-2.5 text-sm outline-none bg-transparent"
        />
        <button type="button" onClick={search} className="px-3 py-2.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
          OK
        </button>
      </div>
    </div>
  );
}

function getInitialForm(editing) {
  if (editing) {
    return {
      name: editing.name || "",
      category: editing.category || "culturel",
      description: editing.description || "",
      slug: editing.slug || "",
      location: editing.location || { type: "Point", coordinates: [47.0878, -21.4527] },
    };
  }
  return {
    name: "",
    category: "culturel",
    description: "",
    slug: "",
    location: { type: "Point", coordinates: [47.0878, -21.4527] },
  };
}

export default function PlaceForm({ refresh, editing, setEditing }) {
  const addToast = useToast();
  const [form, setForm] = useState(getInitialForm(editing));
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Le nom est requis";
    if (!form.description.trim()) errs.description = "La description est requise";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("category", form.category);
      data.append("description", form.description);
      data.append("slug", form.slug);
      data.append("location", JSON.stringify(form.location));

      newFiles.forEach((file) => data.append("photos", file));

      if (editing) {
        await API.put(`/historic-places/${editing._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditing(null);
        addToast("Lieu mis à jour avec succès", "success");
      } else {
        await API.post("/historic-places", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        addToast("Lieu créé avec succès", "success");
      }

      setForm({ name: "", category: "culturel", description: "", slug: "", location: { type: "Point", coordinates: [47.0878, -21.4527] } });
      setNewFiles([]);
      setPreviews([]);
      refresh();
    } catch (err) {
      addToast(err.response?.data?.message || "Erreur lors de l'enregistrement", "error");
    } finally {
      setLoading(false);
    }
  };

  const lat = form.location?.coordinates?.[1];
  const lng = form.location?.coordinates?.[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nom du lieu"
          name="name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          error={errors.name}
        />
        <Input
          label="Slug (optionnel)"
          name="slug"
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
        />
      </div>

      <div className="relative">
        <select
          name="category"
          value={form.category}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          className="peer w-full border border-slate-300 rounded-lg px-3 pt-5 pb-2 text-sm outline-none
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all appearance-none bg-white"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <label className="absolute left-3 top-1 text-xs text-slate-500 pointer-events-none">
          Catégorie
        </label>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="relative">
        <textarea
          name="description"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder=" "
          rows={4}
          className={`peer w-full border rounded-lg px-3 pt-5 pb-2 text-sm outline-none transition-all resize-none
            ${errors.description ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"}`}
        />
        <label className="absolute left-3 top-1 text-xs text-slate-500 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-emerald-600 transition-all">
          Description
        </label>
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Image upload */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">
          Photos
        </label>
        {editing?.photos?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-slate-400 mb-1.5">Photos actuelles ({editing.photos.length})</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {editing.photos.map((photo, i) => (
                <img
                  key={i}
                  src={`http://localhost:5050/${photo}`}
                  alt=""
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200 shrink-0"
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-sm text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choisir des fichiers
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
          </label>
          {newFiles.length > 0 && (
            <span className="text-xs text-slate-400">{newFiles.length} fichier(s) sélectionné(s)</span>
          )}
        </div>
        {previews.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative group">
                <img src={src} alt="" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map picker */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">
          Position sur la carte
        </label>
        <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-200">
          <MapContainer center={FIANAR_CENTER} zoom={13} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SearchControl setForm={setForm} />
            <LocationPicker setForm={setForm} />
            <Marker position={[lat, lng]} icon={markerIcon}>
              <Popup>Position sélectionnée</Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="flex gap-4 mt-2 text-xs text-slate-400 font-mono">
          <span>Lng: {lng?.toFixed(4)}</span>
          <span>Lat: {lat?.toFixed(4)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <Button type="submit" loading={loading} size="lg">
          {editing ? "Mettre à jour" : "Créer le lieu"}
        </Button>
        {editing && (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => {
              setEditing(null);
              setNewFiles([]);
              setPreviews([]);
            }}
          >
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
