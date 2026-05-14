import { useState } from 'react'
import RechercheLieu from './RechercheLieu'
import CarteChoixPosition from './CarteChoixPosition'
import VerificationDoublon from './VerificationDoublon'
import axios from 'axios'

const FormulaireSignalement = () => {
  const [formData, setFormData] = useState({
    citoyenNom: '',
    typeProbleme: 'dechet',
    description: '',
    solutionProposee: '',
    photo: null
  })
  
  const [coordonnees, setCoordonnees] = useState(null)
  const [coordonneesRecherche, setCoordonneesRecherche] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [peutEnvoyer, setPeutEnvoyer] = useState(false)   // ← AJOUTÉ

  const typesProbleme = [
    { value: 'dechet', label: '🗑️ Déchet / Ordure' },
    { value: 'route', label: '🛣️ Route abîmée' },
    { value: 'eclairage', label: '💡 Éclairage public' },
    { value: 'eau', label: '💧 Eau / Canalisation' },
    { value: 'autre', label: '📌 Autre problème' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }))
  }

  const handleLieuTrouve = (lieu) => {
    setCoordonneesRecherche(lieu)
  }

  const handlePositionChange = (coords, adresse) => {
    setCoordonnees({
      lat: coords[0],
      lng: coords[1],
      adresse: adresse
    })
  }

  const envoyerSignalement = async () => {
    // Validation
    if (!formData.citoyenNom.trim()) {
      setMessage('Veuillez entrer votre nom')
      return
    }
    if (!formData.description.trim()) {
      setMessage('Veuillez décrire le problème')
      return
    }
    if (!formData.solutionProposee.trim()) {
      setMessage('Veuillez proposer une solution')
      return
    }
    if (!coordonnees) {
      setMessage('Veuillez placer un pin sur la carte')
      return
    }
    if (!peutEnvoyer) {
      setMessage('Veuillez confirmer qu\'il n\'y a pas de doublon ou utilisez +1')
      return
    }

    setLoading(true)
    setMessage('')

    // Préparer les données
    const data = new FormData()
    data.append('citoyenNom', formData.citoyenNom)
    data.append('typeProbleme', formData.typeProbleme)
    data.append('description', formData.description)
    data.append('solutionProposee', formData.solutionProposee)
    data.append('lat', coordonnees.lat)
    data.append('lng', coordonnees.lng)
    data.append('adresse', coordonnees.adresse)
    if (formData.photo) {
      data.append('photo', formData.photo)
    }

    try {
      const response = await axios.post('http://localhost:5050/api/signalements', data)
      setMessage(`✅ Signalement envoyé ! ID: ${response.data.signalement._id}`)
      
      // Réinitialiser formulaire
      setFormData({
        citoyenNom: '',
        typeProbleme: 'dechet',
        description: '',
        solutionProposee: '',
        photo: null
      })
      setCoordonnees(null)
      setCoordonneesRecherche(null)
      setPeutEnvoyer(false)  // ← Réinitialiser
      
    } catch (error) {
      console.error(error)
      setMessage('❌ Erreur lors de l\'envoi du signalement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2>📢 Nouveau signalement citoyen</h2>
      
      <div style={styles.form}>
        <div style={styles.groupe}>
          <label>Votre nom *</label>
          <input
            type="text"
            name="citoyenNom"
            value={formData.citoyenNom}
            onChange={handleChange}
            placeholder="Entrez votre nom"
            style={styles.input}
          />
        </div>

        <div style={styles.groupe}>
          <label>Type de problème *</label>
          <select
            name="typeProbleme"
            value={formData.typeProbleme}
            onChange={handleChange}
            style={styles.input}
          >
            {typesProbleme.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.groupe}>
          <label>Description du problème *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez précisément le problème..."
            rows={4}
            style={styles.input}
          />
        </div>

        <div style={styles.groupe}>
          <label>💡 Solution proposée *</label>
          <textarea
            name="solutionProposee"
            value={formData.solutionProposee}
            onChange={handleChange}
            placeholder="Que suggérez-vous pour résoudre ce problème ?"
            rows={3}
            style={styles.input}
          />
        </div>

        <div style={styles.groupe}>
          <label>📸 Photo (optionnel)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.input}
          />
        </div>

        <div style={styles.groupe}>
          <label>📍 Localisation du problème *</label>
          <RechercheLieu onLieuTrouve={handleLieuTrouve} />
          <CarteChoixPosition
            coordonneesRecherche={coordonneesRecherche}
            onPositionChange={handlePositionChange}
            signalementsExistants={[]}
          />
        </div>

        {/* === INTÉGRATION VERIFICATION DOUBLON === */}
        {coordonnees && (
          <VerificationDoublon
            coordonnees={coordonnees}
            typeProbleme={formData.typeProbleme}
            onDoublonTrouve={(signalementExistant) => {
              setPeutEnvoyer(false)
              setMessage(`⚠️ Un signalement existe déjà à cet endroit. Utilisez +1 pour soutenir.`)
            }}
            onAucunDoublon={() => {
              setPeutEnvoyer(true)
              setMessage('')
            }}
          />
        )}

        {message && (
          <div style={message.includes('✅') ? styles.success : styles.error}>
            {message}
          </div>
        )}

        {/* Bouton d'envoi modifié */}
        <button
          onClick={envoyerSignalement}
          disabled={loading || !peutEnvoyer || !coordonnees}
          style={{
            ...styles.boutonEnvoyer,
            backgroundColor: (loading || !peutEnvoyer || !coordonnees) ? '#ccc' : '#007bff'
          }}
        >
          {loading ? 'Envoi en cours...' : '📤 Envoyer le signalement'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  groupe: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontFamily: 'inherit'
  },
  boutonEnvoyer: {
    padding: '15px',
    fontSize: '18px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  success: {
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '5px'
  },
  error: {
    padding: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '5px'
  }
}

export default FormulaireSignalement