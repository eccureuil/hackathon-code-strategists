import { useState } from 'react'
import ModaleDetail from './ModaleDetail'
import StatutBadge from '../commun/StatutBadge'

const ListeSignalements = ({ signalements, onStatutChange, onRefresh }) => {
  const [selectedSig, setSelectedSig] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const openModal = (sig) => {
    setSelectedSig(sig)
    setShowModal(true)
  }

  const handleSave = (id, statut, reponse, service) => {
    onStatutChange(id, statut, reponse, service)
    setShowModal(false)
  }

  return (
    <div>
      <h3>📋 Liste ({signalements.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Citoyen</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {signalements.map(sig => (
            <tr key={sig._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{sig.typeProbleme}</td>
              <td>{sig.citoyenNom}</td>
              <td><StatutBadge statut={sig.statut} /></td>  {/* ← utilisation du badge */}
              <td>{new Date(sig.dateCreation).toLocaleDateString()}</td>
              <td><button onClick={() => openModal(sig)}>Détail</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedSig && (
        <ModaleDetail
          signalement={selectedSig}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default ListeSignalements