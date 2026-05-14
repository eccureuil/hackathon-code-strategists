// frontend/src/components/admin/ResponsibleManager.jsx
import { useState } from "react";

export const ResponsibleManager = ({ responsibles, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (responsible) => {
    setEditingId(responsible.id);
    setEditForm(responsible);
  };

  const handleSave = () => {
    onUpdate(editForm);
    setEditingId(null);
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getStatusLabel = (status) => {
    return status === "active" ? "🟢 Actif" : "🔴 Inactif";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">👨‍💼 Gestion des responsables</h3>
        <p className="text-sm text-gray-500">
          Gérez les guichets et responsables par service
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {responsibles.map((resp) => (
          <div key={resp.id} className="p-4">
            {editingId === resp.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
                <select
                  value={editForm.service}
                  onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option>Acte de naissance</option>
                  <option>Certificat résidence</option>
                  <option>Légalisation</option>
                  <option>Carte d'identité</option>
                </select>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-1 bg-green-500 text-white rounded-lg text-sm">
                    Sauvegarder
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-4 py-1 bg-gray-300 rounded-lg text-sm">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    {resp.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{resp.name}</div>
                    <div className="text-sm text-gray-500">{resp.service}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{resp.counter}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resp.status)}`}>
                    {getStatusLabel(resp.status)}
                  </span>
                  <button
                    onClick={() => handleEdit(resp)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    ✏️ Modifier
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bouton ajouter */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
          + Ajouter un responsable
        </button>
      </div>
    </div>
  );
};