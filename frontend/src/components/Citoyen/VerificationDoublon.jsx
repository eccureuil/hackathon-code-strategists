import { useState, useEffect } from 'react'
import axios from 'axios'

const VerificationDoublon = ({ coordonnees, typeProbleme, onDoublonTrouve, onAucunDoublon }) => {
  const [verificationEnCours, setVerificationEnCours] = useState(false)
  const [doublonTrouve, setDoublonTrouve] = useState(null)
  const [message, setMessage] = useState('')

  // Vérifier les doublons quand les coordonnées changent
  useEffect(() => {
    if (!coordonnees) return

    const verifierDoublon = async () => {
      setVerificationEnCours(true)
      setDoublonTrouve(null)
      setMessage('')

      try {
        const response = await axios.get(
          `http://localhost:5000/api/signalements/verifier-doublon?lat=${coordonnees.lat}&lng=${coordonnees.lng}&rayon=50`
        )

        if (response.data.doublonTrouve && response.data.signalements.length > 0) {
          const signalementExistant = response.data.signalements[0]
          setDoublonTrouve(signalementExistant)
          setMessage(`⚠️ Un problème similaire existe déjà à moins de 50m !`)
          
          if (onDoublonTrouve) {
            onDoublonTrouve(signalementExistant)
          }
        } else {
          setMessage('✅ Aucun doublon trouvé dans un rayon de 50m')
          if (onAucunDoublon) {
            onAucunDoublon()
          }
        }
      } catch (error) {
        console.error('Erreur vérification doublon:', error)
        setMessage('❌ Erreur lors de la vérification')
      } finally {
        setVerificationEnCours(false)
      }
    }

    // Attendre 1 seconde après le dernier déplacement du pin
    const timer = setTimeout(verifierDoublon, 1000)
    return () => clearTimeout(timer)
  }, [coordonnees, onDoublonTrouve, onAucunDoublon])

  // Ajouter +1 au signalement existant
  const ajouterPlusUn = async () => {
    if (!doublonTrouve) return

    try {
      const response = await axios.put(`http://localhost:5000/api/signalements/${doublonTrouve._id}/plusun`)
      
      if (response.data.success) {
        setMessage(`👍 Merci ! +1 ajouté. ${response.data.nouveauTotal} personne(s) ont signalé ce problème.`)
        
        // Désactiver le doublon après +1
        setTimeout(() => {
          setDoublonTrouve(null)
          setMessage('')
        }, 3000)
        
        if (onAucunDoublon) {
          onAucunDoublon() // Permet de réinitialiser
        }
      }
    } catch (error) {
      console.error('Erreur ajout +1:', error)
      setMessage('❌ Erreur lors de l\'ajout du +1')
    }
  }

  // Ignorer le doublon et créer quand même un nouveau signalement
  const ignorerDoublon = () => {
    setDoublonTrouve(null)
    setMessage('')
    if (onAucunDoublon) {
      onAucunDoublon()
    }
  }

  if (!coordonnees) {
    return null
  }

  return (
    <div style={styles.container}>
      {verificationEnCours && (
        <div style={styles.verification}>
          <span style={styles.spinner}>⏳</span>
          Vérification des signalements à proximité...
        </div>
      )}

      {message && !doublonTrouve && (
        <div style={styles.info}>
          {message}
        </div>
      )}

      {doublonTrouve && (
        <div style={styles.doublonContainer}>
          <div style={styles.doublonAlerte}>
            <span style={styles.alerteIcon}>⚠️</span>
            <div style={styles.doublonContent}>
              <strong>Un signalement similaire existe déjà !</strong>
              <div style={styles.doublonDetails}>
                <p><strong>Type :</strong> {getTypeLabel(doublonTrouve.typeProbleme)}</p>
                <p><strong>Description :</strong> {doublonTrouve.description.substring(0, 100)}...</p>
                <p><strong>Statut :</strong> {getStatutLabel(doublonTrouve.statut)}</p>
                <p><strong>Signalé par :</strong> {doublonTrouve.citoyenNom}</p>
                <p><strong>👍 Déjà {doublonTrouve.nbPlusUn || 0} personne(s)</strong></p>
              </div>
              <div style={styles.doublonActions}>
                <button onClick={ajouterPlusUn} style={styles.btnPlusUn}>
                  👍 Ajouter mon +1
                </button>
                <button onClick={ignorerDoublon} style={styles.btnIgnorer}>
                  📝 Créer quand même
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper fonctions
const getTypeLabel = (type) => {
  const types = {
    dechet: '🗑️ Déchet',
    route: '🛣️ Route abîmée',
    eclairage: '💡 Éclairage',
    eau: '💧 Eau',
    autre: '📌 Autre'
  }
  return types[type] || type
}

const getStatutLabel = (statut) => {
  const statuts = {
    en_attente: '🟡 En attente',
    en_cours: '🔵 En cours',
    resolu: '🟢 Résolu'
  }
  return statuts[statut] || statut
}

const styles = {
  container: {
    marginTop: '15px',
    marginBottom: '15px'
  },
  verification: {
    padding: '10px',
    backgroundColor: '#e2e3e5',
    color: '#383d41',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px'
  },
  spinner: {
    display: 'inline-block',
    marginRight: '8px'
  },
  info: {
    padding: '10px',
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
    borderRadius: '8px',
    fontSize: '14px'
  },
  doublonContainer: {
    marginTop: '10px'
  },
  doublonAlerte: {
    display: 'flex',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
    borderRadius: '8px',
    alignItems: 'flex-start'
  },
  alerteIcon: {
    fontSize: '28px'
  },
  doublonContent: {
    flex: 1
  },
  doublonDetails: {
    fontSize: '13px',
    marginTop: '8px',
    marginBottom: '12px',
    paddingLeft: '10px',
    borderLeft: '3px solid #ffc107'
  },
  doublonDetails: {
    margin: '8px 0',
    fontSize: '13px',
    lineHeight: '1.4'
  },
  doublonActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  btnPlusUn: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  btnIgnorer: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  }
}

export default VerificationDoublon