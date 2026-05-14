import { useEffect, useState } from "react";
import API from "../../services/api";

import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const API_URL = "http://localhost:5050";

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [activePlace, setActivePlace] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await API.get("/historic-places");
        setPlaces(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">
        Lieux historiques de Fianarantsoa
      </h1>

      {/* 🟩 CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {places.map((place) => (
          <div
            key={place._id}
            onClick={() => setActivePlace(place)}
            className="
              cursor-pointer bg-white border rounded-2xl shadow
              hover:shadow-xl transition overflow-hidden
            "
          >

            {/* 🖼️ IMAGE UPLOADS */}
            <div className="h-44 bg-gray-100 overflow-hidden">

                {place.photos?.length > 0 ? (
                    <img
                    src={`${API_URL}/${place.photos[0]}`}
                    alt={place.name}
                    className="
                        w-full h-full object-cover
                        transform hover:scale-110
                        transition duration-300
                    "
                    loading="lazy"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                    No image
                    </div>
                )}

            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-2">

              <h2 className="text-xl font-bold">
                {place.name}
              </h2>

              <p className="text-sm text-green-600 capitalize">
                {place.category}
              </p>

              <p className="text-gray-600 line-clamp-3">
                {place.description}
              </p>

            </div>
          </div>
        ))}

      </div>

      {/* 🌑 MODAL */}
      {activePlace && (
        <div className="fixed inset-0 z-9999 bg-black/60 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden relative max-h-[90vh] h-full overflow-y-auto">

            {/* CLOSE */}
            <button
                onClick={() => setActivePlace(null)}
                className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full"
            >
                ✕
            </button>

            {/* CONTENT */}
            <div className="p-6 space-y-5">

                <h2 className="text-3xl font-bold">
                {activePlace.name}
                </h2>

                {/* SAFE DESCRIPTION */}
                <p className="text-gray-700">
                {activePlace.description}
                </p>

                {/* SAFE IMAGES */}
                {activePlace?.photos?.length > 0 && (
                <div className="grid grid-cols-2 gap-2">

                    {activePlace.photos.map((img, i) => (
                    <img
                        key={i}
                        src={`http://localhost:5050/${img}`}
                        className="w-full h-full object-cover rounded"
                    />
                    ))}

                </div>
                )}
                <div className="h-64 rounded-xl overflow-hidden border">

                <MapContainer
                    center={[
                    activePlace.location?.coordinates?.[1],
                    activePlace.location?.coordinates?.[0],
                    ]}
                    zoom={16}
                    className="h-full w-full"
                    scrollWheelZoom={false}
                >

                    <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* 📍 MARKER FIXÉ */}
                    <Marker
                    position={[
                        activePlace.location?.coordinates?.[1],
                        activePlace.location?.coordinates?.[0],
                    ]}
                    />

                </MapContainer>

                </div>

            </div>
            </div>
        </div>
        )}

    </div>
  );
}