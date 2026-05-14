import { useState, useEffect } from 'react'
import axios from 'axios'
import CarteAdmin from './CarteAdmin'
import ListeSignalements from './ListeSignalements'
import Filtres from './Filtres'

const AdminDashboard = () => {
  const [signalements, setSignalements] = useState([])
  const [filtres, setFiltres] = useState({ type: '', statut: '', quartier: '' })
  const [loading, setLoading] = useState(true)

  const chargerSignalements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/signalements/tous')
      setSignalements(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    chargerSignalements()
  }, [])

  const signalementsFiltres = signalements.filter(sig => {
    if (filtres.type && sig.typeProbleme !== filtres.type) return false
    if (filtres.statut && sig.statut !== filtres.statut) return false
    if (filtres.quartier && sig.localisation?.adresseTexte && !sig.localisation.adresseTexte.toLowerCase().includes(filtres.quartier.toLowerCase())) return false
    return true
  })

  const handleStatutChange = async (id, nouveauStatut, reponse, service) => {
    try {
      await axios.put(`http://localhost:5000/api/signalements/${id}/statut`, {
        statut: nouveauStatut,
        reponseAdmin: reponse,
        serviceAssigne: service
      })
      chargerSignalements() // recharge
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
      <h1>👑 Administration des signalements</h1>
      <Filtres filtres={filtres} setFiltres={setFiltres} />
      <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
        <div style={{ flex: 1, height: '500px' }}>
          <CarteAdmin signalements={signalementsFiltres} onMarkerClick={(sig) => console.log(sig)} />
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <ListeSignalements 
            signalements={signalementsFiltres} 
            onStatutChange={handleStatutChange}
            onRefresh={chargerSignalements}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard