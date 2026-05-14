const Filtres = ({ filtres, setFiltres }) => {
  const update = (key, value) => setFiltres((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher dans les signalements..."
          value={filtres.search || ""}
          onChange={(e) => update("search", e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
        />
      </div>
      <select
        value={filtres.type}
        onChange={(e) => update("type", e.target.value)}
        className="px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
      >
        <option value="">Tous types</option>
        <option value="dechet">Déchet</option>
        <option value="route">Route</option>
        <option value="eclairage">Éclairage</option>
        <option value="eau">Eau</option>
        <option value="autre">Autre</option>
      </select>
      <select
        value={filtres.statut}
        onChange={(e) => update("statut", e.target.value)}
        className="px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
      >
        <option value="">Tous statuts</option>
        <option value="en_attente">En attente</option>
        <option value="en_cours">En cours</option>
        <option value="resolu">Résolu</option>
      </select>
      <input
        type="text"
        placeholder="Quartier"
        value={filtres.quartier}
        onChange={(e) => update("quartier", e.target.value)}
        className="px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 w-full sm:w-40"
      />
    </div>
  )
}

export default Filtres
