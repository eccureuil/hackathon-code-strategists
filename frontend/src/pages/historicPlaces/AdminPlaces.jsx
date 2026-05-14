import { useEffect, useState } from "react";
import API from "../../services/api";
import PlaceForm from "../../components/PlaceForm";

export default function AdminPlaces() {
  const [places, setPlaces] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // FETCH ALL PLACES
  const fetchPlaces = async () => {
    try {
      const res = await API.get("/historic-places");
      setPlaces(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPlaces();
  }, []);

  // DELETE PLACE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Supprimer ce lieu historique ?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/historic-places/${id}`);
      fetchPlaces();
    } catch (err) {
      console.log(err);
    }
  };

  // EDIT PLACE
  const handleEdit = (place) => {
    setEditing(place);
    setShowForm(true);
  };

  // CREATE PLACE
  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Gestion des lieux historiques
        </h1>

        <button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Créer
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="border rounded-lg p-4 bg-white shadow">
          <PlaceForm
            refresh={() => {
              fetchPlaces();
              setShowForm(false);
            }}
            editing={editing}
            setEditing={setEditing}
          />

          <button
            onClick={() => setShowForm(false)}
            className="mt-3 text-sm text-red-500"
          >
            Fermer
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="w-full border-collapse">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 border-b">Nom</th>
              <th className="text-left p-3 border-b">Catégorie</th>
              <th className="text-left p-3 border-b">Slug</th>
              <th className="text-left p-3 border-b">Coordonnées</th>
              <th className="text-center p-3 border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {places.length > 0 ? (
              places.map((place) => (
                <tr
                  key={place._id}
                  className="hover:bg-gray-50"
                >
                  {/* NAME */}
                  <td className="p-3 border-b">
                    {place.name}
                  </td>

                  {/* CATEGORY */}
                  <td className="p-3 border-b capitalize">
                    {place.category}
                  </td>

                  {/* SLUG */}
                  <td className="p-3 border-b">
                    {place.slug}
                  </td>

                  {/* COORDS */}
                  <td className="p-3 border-b text-sm">
                    {place.location?.coordinates?.join(", ")}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 border-b">
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => handleEdit(place)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(place._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Supprimer
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6 text-gray-500"
                >
                  Aucun lieu historique trouvé
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}