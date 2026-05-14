import { useEffect, useState } from "react";
import API from "../services/api";

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

// FIX ICON
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FIANAR_CENTER = [-21.4527, 47.0878];

// EDIT FORM
const getFormFromEditing = (editing) => {
  if (!editing) return null;

  return {
    name: editing.name || "",
    category: editing.category || "culturel",
    description: editing.description || "",
    slug: editing.slug || "",
    location: {
      type: "Point",
      coordinates:
        editing.location?.coordinates || [47.0878, -21.4527],
    },
  };
};

const emptyForm = {
  name: "",
  category: "culturel",
  description: "",
  slug: "",
  location: {
    type: "Point",
    coordinates: [47.0878, -21.4527],
  },
};

// MAP PICK
function LocationPicker({ setForm }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: [lng, lat],
        },
      }));
    },
  });

  return null;
}

// SEARCH
function SearchControl({ setForm }) {
  const map = useMap();
  const [query, setQuery] = useState("");

  const search = async () => {
    if (!query) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}, Fianarantsoa`
    );

    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      map.setView([lat, lon], 16);

      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: [lon, lat],
        },
      }));
    }
  };

  return (
    <div className="absolute top-3 left-3 z-9999">
      <div className="flex w-72 bg-white border shadow rounded overflow-hidden">

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher..."
          className="flex-1 p-2 outline-none"
        />

        <button
          type="button"
          onClick={search}
          className="bg-green-600 text-white px-4"
        >
          🔍
        </button>

      </div>
    </div>
  );
}

export default function PlaceForm({
  refresh,
  editing,
  setEditing,
}) {
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const newForm = getFormFromEditing(editing);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (newForm) setForm(newForm);
    else setForm(emptyForm);

  }, [editing, editing?._id]);

  // INPUT TEXT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // FILES
  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // SUBMIT MULTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("category", form.category);
      data.append("description", form.description);
      data.append("slug", form.slug);
      data.append("location", JSON.stringify(form.location));

      // 📸 images
      files.forEach((file) => {
        data.append("photos", file);
      });

      if (editing) {
        await API.put(
          `/historic-places/${editing._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setEditing(null);
      } else {
        await API.post(
          "/historic-places",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setForm(emptyForm);
      setFiles([]);
      refresh();

    } catch (err) {
      console.log(err);
    }
  };

  const lat = form.location?.coordinates?.[1];
  const lng = form.location?.coordinates?.[0];

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded space-y-4"
    >

      {/* TEXT */}
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nom"
        className="w-full border p-2 rounded"
      />

      <input
        name="slug"
        value={form.slug}
        onChange={handleChange}
        placeholder="Slug"
        className="w-full border p-2 rounded"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="culturel">Culturel</option>
        <option value="religieux">Religieux</option>
        <option value="naturel">Naturel</option>
        <option value="colonial">Colonial</option>
        <option value="gastronomie">Gastronomie</option>
      </select>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* FILE UPLOAD */}
      <input
        type="file"
        multiple
        onChange={handleFiles}
        className="w-full"
      />

      {/* MAP */}
      <div className="relative h-80 border rounded overflow-hidden">

        <MapContainer
          center={FIANAR_CENTER}
          zoom={13}
          className="h-full w-full"
        >

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <SearchControl setForm={setForm} />
          <LocationPicker setForm={setForm} />

          <Marker position={[lat, lng]}>
            <Popup>Position</Popup>
          </Marker>

        </MapContainer>

      </div>

      {/* COORDS */}
      <div className="grid grid-cols-2 gap-2">

        <input value={lng} readOnly className="bg-gray-100 p-2" />
        <input value={lat} readOnly className="bg-gray-100 p-2" />

      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        {editing ? "Update" : "Create"}
      </button>

    </form>
  );
}