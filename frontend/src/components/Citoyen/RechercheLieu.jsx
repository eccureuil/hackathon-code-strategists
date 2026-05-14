import { useState } from 'react'
import axios from 'axios'

const RechercheLieu = ({ onLieuTrouve }) => {
  const [recherche, setRecherche] = useState('')
  const [loading, setLoading] = useState(false)
 const [erreur, setErreur] = useState('')

  const rechercherLieu = async () => {
    if (!recherche.trim()) {
      setErreur('Veuillez entrer un quartier ou une rue')
      return
    }

    setLoading(true)
    setErreur('')

    try {
      // API Nominatim (OpenStreetMap) - Gratuite, sans clé
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${recherche}, Fianarantsoa, Madagascar&format=json&limit=1`
      )

      if (response.data && response.data.length > 0) {
        const lieu = response.data[0]
        const coordonnees = {
          lat: parseFloat(lieu.lat),
          lng: parseFloat(lieu.lon),
          nom: lieu.display_name
        }
        
        onLieuTrouve(coordonnees)
        setErreur('')
      } else {
        setErreur('Aucun lieu trouvé à Fianarantsoa')
      }
    } catch (error) {
      console.error('Erreur recherche:', error)
      setErreur('Erreur lors de la recherche')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.rechercheGroup}>
        <input
          type="text"
          placeholder="🔍 Rechercher un quartier ou une rue..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && rechercherLieu()}
          style={styles.input}
        />
        <button 
          onClick={rechercherLieu} 
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </div>
      
      {erreur && (
        <div style={styles.erreur}>
          ⚠️ {erreur}
        </div>
      )}
      
      <p style={styles.info}>
        💡 Exemples : "Manjakaray", "Route de l\'aéroport", "Ambalavao", "Andrainjato"
      </p>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  rechercheGroup: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  erreur: {
    marginTop: '10px',
    padding: '8px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '5px',
    fontSize: '14px'
  },
  info: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#666',
    marginBottom: 0
  }
}

export default RechercheLieu