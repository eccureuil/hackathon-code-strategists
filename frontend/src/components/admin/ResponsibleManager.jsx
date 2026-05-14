// frontend/src/components/admin/ResponsibleManager.jsx
import { useState } from "react";

export const ResponsibleManager = ({
  responsibles,
  onUpdate,
  onAdd,
  onDelete
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
 const [newResponsible, setNewResponsible] = useState({
  name: "",
  service: "",
  serviceId: 1,
  counter: "",
  status: "active"
});

  const handleEdit = (responsible) => {
   setEditingId(responsible._id);
    setEditForm(responsible);
  };

  const handleSave = () => {
    onUpdate(editingId, editForm);  // ← CORRECTION : ajout de editingId
    setEditingId(null);
  };

  const handleAdd = () => {
    if (newResponsible.name && newResponsible.service) {
      onAdd(newResponsible);
      setNewResponsible({ name: "", service: "", counter: "", status: "active" });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getStatusLabel = (status) => {
    return status === "active" ? "Actif" : "Inactif";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800"><svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> Gestion des responsables</h3>
        <p className="text-sm text-gray-500">
          Gérez les guichets et responsables par service
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {responsibles.map((resp) => (
          <div key={resp._id} className="p-4">
            {editingId === resp._id ? (
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
                    {resp.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div className="font-medium">{resp.name}</div>
                    <div className="text-sm text-gray-500">{resp.service}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{resp.counter}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${getStatusColor(resp.status)}`}>
                    {resp.status === "active" ? (
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                    )}
                    {getStatusLabel(resp.status)}
                  </span>
                  <button
  onClick={() => onDelete(resp._id)}
  className="text-red-500 hover:text-red-700 text-sm inline-flex items-center gap-1"
>
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
  Supprimer
</button>
                  <button
                    onClick={() => handleEdit(resp)}
                    className="text-blue-500 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Modifier
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm ? (
        <div className="p-4 border-t border-gray-200 space-y-3">
          <input
            type="text"
            placeholder="Nom du responsable"
            value={newResponsible.name}
            onChange={(e) => setNewResponsible({ ...newResponsible, name: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
          <select
             value={newResponsible.service}
  onChange={(e) => {
    const value = e.target.value;

    const serviceMap = {
      "Acte de naissance": 1,
      "Certificat résidence": 2,
      "Légalisation": 3,
      "Carte d'identité": 4
    };

    setNewResponsible({
      ...newResponsible,
      service: value,
      serviceId: serviceMap[value]
    });
  }}
          >
            <option value="">Sélectionner un service</option>
            <option>Acte de naissance</option>
            <option>Certificat résidence</option>
            <option>Légalisation</option>
            <option>Carte d'identité</option>
          </select>
          <input
            type="text"
            placeholder="Guichet (ex: Guichet A)"
            value={newResponsible.counter}
            onChange={(e) => setNewResponsible({ ...newResponsible, counter: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Ajouter
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition"
          >
            + Ajouter un responsable
          </button>
        </div>
      )}
    </div>
  );
};