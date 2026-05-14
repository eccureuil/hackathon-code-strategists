import { useState } from 'react'
import { showNotification } from '../commun/Notification' 

const ModaleDetail = ({ signalement, onSave, onClose }) => {
  const [statut, setStatut] = useState(signalement.statut)
  const [reponse, setReponse] = useState(signalement.reponseAdmin || '')
  const [service, setService] = useState(signalement.serviceAssigne || '')

  const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    // Requête API pour mettre à jour le statut
    await axios.put(`http://localhost:5000/api/signalements/${signalement._id}/statut`, {
      statut,
      reponseAdmin: reponse,
      serviceAssigne: service
    })
    // ✅ Notification de succès
    showNotification('✅ Statut mis à jour avec succès', 'success')
    // Appel au parent pour recharger la liste / fermer la modale
    onSave(signalement._id, statut, reponse, service)
    onClose()
  } catch (error) {
    // ❌ Notification d’erreur
    showNotification('❌ Erreur lors de la mise à jour', 'error')
    console.error(error)
  }
}
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Détail du signalement</h3>
        <p><strong>Citoyen :</strong> {signalement.citoyenNom}</p>
        <p><strong>Type :</strong> {signalement.typeProbleme}</p>
        <p><strong>Description :</strong> {signalement.description}</p>
        <p><strong>Solution proposée :</strong> {signalement.solutionProposee}</p>
        <p><strong>Localisation :</strong> {signalement.localisation?.adresseTexte || 'carte'}</p>
        <p><strong>👍 +1 :</strong> {signalement.nbPlusUn}</p>
        <form onSubmit={handleSubmit}>
          <label>Statut :</label>
          <select value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="en_attente">🟡 En attente</option>
            <option value="en_cours">🔵 En cours</option>
            <option value="resolu">🟢 Résolu</option>
          </select>
          <label>Service assigné :</label>
          <input type="text" value={service} onChange={(e) => setService(e.target.value)} placeholder="ex: Voirie, Eau..." />
          <label>Réponse au citoyen :</label>
          <textarea value={reponse} onChange={(e) => setReponse(e.target.value)} rows="3" />
          <div style={styles.buttons}>
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onClose}>Fermer</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' },
  buttons: { display: 'flex', gap: '10px', marginTop: '15px' }
}

export default ModaleDetail