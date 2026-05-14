import { useState } from "react";

export const ReservationForm = ({ services, onSubmit }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selected) return;

    onSubmit({
      serviceId: selected._id,
      serviceName: selected.name,
      date: new Date(),
      time: "09:00",
      motif: "Demande citoyenne"
    });
  };

  return (
    <div className="space-y-4">

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un service..."
        className="p-3 border w-full"
      />

      {/* AUTOCOMPLETE */}
      {search && (
        <div className="border bg-white">
          {filtered.map(s => (
            <div
              key={s._id}
              onClick={() => {
                setSelected(s);
                setSearch(s.name);
              }}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {s.name}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="p-2 bg-green-100">
          Service: {selected.name}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Réserver
      </button>

    </div>
  );
};