import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function Map({
  places,
  setActivePlace,
}) {
  return (
    <div className="h-125 w-full rounded-xl overflow-hidden border">

      <MapContainer
        center={[-21.4527, 47.0878]}
        zoom={13}
        className="h-full w-full"
      >

        {/* 🌍 OSM */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 📍 MARKERS */}
        {places.map((place) => {
          const lat = place.location?.coordinates?.[1];
          const lng = place.location?.coordinates?.[0];

          return (
            <Marker
              key={place._id}
              position={[lat, lng]}

              eventHandlers={{
                click: () => {
                  setActivePlace(place);
                },
              }}
            >

              <Popup>
                <div className="space-y-1">

                  <h2 className="font-bold">
                    {place.name}
                  </h2>

                  <p className="text-sm text-green-600 capitalize">
                    {place.category}
                  </p>

                  <button
                    onClick={() => setActivePlace(place)}
                    className="text-blue-600 text-sm underline"
                  >
                    Voir détails
                  </button>

                </div>
              </Popup>

            </Marker>
          );
        })}

      </MapContainer>
    </div>
  );
}