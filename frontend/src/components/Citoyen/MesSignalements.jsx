import { useState, useEffect } from 'react'
import StatutBadge from '../commun/StatutBadge'
import axios from 'axios'

const MesSignalements = ({ citoyenNom }) => {
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [derniereMaj, setDerniereMaj] = useState(null)

  // Charger les signalements du citoyen
  const chargerSignalements = async () => {
    if (!citoyenNom) return

    try {
      const response = await axios.get(`http://localhost:5050/api/signalements/mes-signalements?nom=${encodeURIComponent(citoyenNom)}`)
      const anciensSignalements = signalements
      const nouveauxSignalements = response.data

      // Vérifier les changements de statut pour notifications
      if (anciensSignalements.length > 0) {
        nouveauxSignalements.forEach(nouveau => {
          const ancien = anciensSignalements.find(a => a._id === nouveau._id)
          if (ancien && ancien.statut !== nouveau.statut) {
            const message = getNotificationMessage(ancien.statut, nouveau.statut, nouveau)
            setNotifications(prev => [message, ...prev].slice(0, 5))
            // Afficher notification toast
            if (window.toast) {
              window.toast(message)
            } else {
              alert(message) // Fallback
            }
          }
        })
      }

      setSignalements(nouveauxSignalements)
      setDerniereMaj(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Erreur chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  // Message selon changement de statut
  const getNotificationMessage = (ancienStatut, nouveauStatut, signalement) => {
    const statutLabels = {
      en_attente: '🟡 En attente',
      en_cours: '🔵 En cours',
      resolu: '🟢 Résolu'
    }

    const typeLabel = {
      dechet: '🗑️ déchet',
      route: '🛣️ route',
      eclairage: '💡 éclairage',
      eau: '💧 eau',
      autre: '📌 problème'
    }

    if (nouveauStatut === 'en_cours' && ancienStatut === 'en_attente') {
      return `✅ Votre signalement (${typeLabel[signalement.typeProbleme]}) a été pris en charge !`
    }
    if (nouveauStatut === 'resolu') {
      return `🎉 Bonne nouvelle ! Votre signalement (${typeLabel[signalement.typeProbleme]}) est résolu. Merci pour votre contribution !`
    }
    return `📢 Mise à jour : ${typeLabel[signalement.typeProbleme]} passe de ${statutLabels[ancienStatut]} à ${statutLabels[nouveauStatut]}`
  }

  // Recharge automatique toutes les 30 secondes
  useEffect(() => {
    chargerSignalements()
    const interval = setInterval(chargerSignalements, 30000)
    return () => clearInterval(interval)
  }, [citoyenNom])

  // Supprimer une notification
  const supprimerNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  // Obtenir le libellé du statut
  const getStatutLabel = (statut) => {
    const statuts = {
      en_attente: { label: 'En attente', icon: '🟡', color: '#ffc107' },
      en_cours: { label: 'En cours', icon: '🔵', color: '#17a2b8' },
      resolu: { label: 'Résolu', icon: '🟢', color: '#28a745' }
    }
    return statuts[statut] || { label: statut, icon: '⚪', color: '#6c757d' }
  }

  // Obtenir le libellé du type
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

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  if (!citoyenNom) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>
          <span style={styles.placeholderIcon}>👤</span>
          <p>Entrez votre nom dans le formulaire pour voir vos signalements</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>⏳ Chargement de vos signalements...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.titre}>📋 Mes signalements</h3>
      
      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={styles.notificationsContainer}>
          {notifications.map((notif, index) => (
            <div key={index} style={styles.notification}>
              <span>{notif}</span>
              <button onClick={() => supprimerNotification(index)} style={styles.closeNotif}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Dernière mise à jour */}
      {derniereMaj && (
        <div style={styles.derniereMaj}>
          🔄 Dernière mise à jour : {derniereMaj}
        </div>
      )}

      {/* Liste des signalements */}
      {signalements.length === 0 ? (
        <div style={styles.vide}>
          <span style={styles.videIcon}>📭</span>
          <p>Vous n'avez pas encore de signalements</p>
          <p style={styles.videSous}>Utilisez le formulaire ci-dessus pour signaler un problème</p>
        </div>
      ) : (
        <div style={styles.liste}>
          {signalements.map((sig) => {
            const statut = getStatutLabel(sig.statut)
            return (
              <div key={sig._id} style={styles.carte}>
                <div style={styles.carteEntete}>
                  <span style={styles.carteType}>{getTypeLabel(sig.typeProbleme)}</span>
                 <StatutBadge statut={sig.statut} /> 
                </div>
                
                <div style={styles.carteCorps}>
                  <p style={styles.description}>{sig.description}</p>
                  
                  <div style={styles.solutionContainer}>
                    <strong>💡 Solution proposée :</strong>
                    <p style={styles.solution}>{sig.solutionProposee}</p>
                  </div>
                  
                  <div style={styles.info}>
                    <span>📍 {sig.localisation?.adresseTexte || 'Position sur carte'}</span>
                    <span>📅 {formatDate(sig.dateCreation)}</span>
                  </div>
                  
                  {sig.reponseAdmin && (
                    <div style={styles.reponseAdmin}>
                      <strong>👑 Réponse de l'admin :</strong>
                      <p>{sig.reponseAdmin}</p>
                    </div>
                  )}
                  
                  {sig.nbPlusUn > 0 && (
                    <div style={styles.plusUn}>
                      👍 {sig.nbPlusUn} personne(s) a(ont) signalé le même problème
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px'
  },
  titre: {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '22px',
    color: '#333'
  },
  derniereMaj: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'right',
    marginBottom: '15px'
  },
  notificationsContainer: {
    marginBottom: '20px'
  },
  notification: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    marginBottom: '8px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '8px',
    borderLeft: '4px solid #28a745',
    fontSize: '14px'
  },
  closeNotif: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#155724',
    opacity: 0.7
  },
  vide: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '10px'
  },
  videIcon: {
    fontSize: '48px'
  },
  videSous: {
    fontSize: '12px',
    color: '#999'
  },
  liste: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  carte: {
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  carteEntete: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    backgroundColor: '#f1f3f5',
    borderBottom: '1px solid #e9ecef'
  },
  carteType: {
    fontWeight: 'bold',
    fontSize: '14px'
  },
  badgeStatut: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white'
  },
  carteCorps: {
    padding: '15px'
  },
  description: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#495057',
    lineHeight: '1.5'
  },
  solutionContainer: {
    backgroundColor: '#e8f4f8',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '13px'
  },
  solution: {
    margin: '5px 0 0 0',
    color: '#0c5460'
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#868e96',
    marginBottom: '10px'
  },
  reponseAdmin: {
    backgroundColor: '#fff3cd',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    marginTop: '10px'
  },
  plusUn: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#6c757d',
    textAlign: 'right'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  placeholder: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '10px'
  },
  placeholderIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '15px'
  }
}

export default MesSignalements