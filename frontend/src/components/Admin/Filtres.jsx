const Filtres = ({ filtres, setFiltres }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
      <select value={filtres.type} onChange={(e) => setFiltres({...filtres, type: e.target.value})}>
        <option value="">Tous types</option>
        <option value="dechet">Déchet</option>
        <option value="route">Route</option>
        <option value="eclairage">Éclairage</option>
        <option value="eau">Eau</option>
      </select>
      <select value={filtres.statut} onChange={(e) => setFiltres({...filtres, statut: e.target.value})}>
        <option value="">Tous statuts</option>
        <option value="en_attente">En attente</option>
        <option value="en_cours">En cours</option>
        <option value="resolu">Résolu</option>
      </select>
      <input type="text" placeholder="Quartier" value={filtres.quartier} onChange={(e) => setFiltres({...filtres, quartier: e.target.value})} />
    </div>
  )
}

export default Filtres