import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fixer l'icône par défaut de Leaflet (problème connu)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Composant pour recentrer la carte automatiquement
const RecentrerCarte = ({ centre }) => {
  const map = useMap()
  useEffect(() => {
    if (centre) {
      map.flyTo(centre, 15)
    }
  }, [centre, map])
  return null
}

const CarteChoixPosition = ({ coordonneesRecherche, onPositionChange, signalementsExistants = [] }) => {
  // Position par défaut : Fianarantsoa
  const positionDefaut = [-21.4333, 47.0858]
  const [position, setPosition] = useState(positionDefaut)
  const [marqueur, setMarqueur] = useState(null)

  // Quand recherche effectuée, recentrer la carte
  useEffect(() => {
    if (coordonneesRecherche) {
      const nouvellePos = [coordonneesRecherche.lat, coordonneesRecherche.lng]
      setPosition(nouvellePos)
      setMarqueur(nouvellePos)
      onPositionChange(nouvellePos, coordonneesRecherche.nom)
    }
  }, [coordonneesRecherche])

  // Obtenir position actuelle du navigateur
  const obtenirPositionActuelle = () => {
    if (!navigator.geolocation) {
      alert('Votre navigateur ne supporte pas la géolocalisation')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nouvellePos = [pos.coords.latitude, pos.coords.longitude]
        setPosition(nouvellePos)
        setMarqueur(nouvellePos)
        onPositionChange(nouvellePos, 'Position actuelle')
      },
      (erreur) => {
        console.error('Erreur géolocalisation:', erreur)
        alert('Impossible d\'obtenir votre position. Vérifiez les permissions.')
      }
    )
  }
 

  return (
    <div style={styles.container}>
      <div style={styles.boutonContainer}>
        <button onClick={obtenirPositionActuelle} style={styles.boutonPosition}>
          📍 Utiliser ma position actuelle
        </button>
        <p style={styles.consigne}>
          👆 Cliquez directement sur la carte pour déplacer le pin si besoin
        </p>
      </div>

      <MapContainer
        center={position}
        zoom={14}
        style={styles.carte}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecentrerCarte centre={position} />
        
        {/* Pin du signalement (déplaçable) */}
        {marqueur && (
          <Marker
            position={marqueur}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const nouveauMarqueur = [e.target.getLatLng().lat, e.target.getLatLng().lng]
                setMarqueur(nouveauMarqueur)
                onPositionChange(nouveauMarqueur, 'Position choisie sur carte')
              }
            }}
          />
        )}
        
        {/* Afficher les signalements existants (petits pins gris) */}
        {signalementsExistants.map((sig) => (
          <Marker
            key={sig._id}
            position={[sig.localisation.coordonnes[1], sig.localisation.coordonnes[0]]}
            icon={L.divIcon({
              className: 'marker-existant',
              html: '📍',
              iconSize: [20, 20]
            })}
          />
        ))}
      </MapContainer>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '20px'
  },
  boutonContainer: {
    marginBottom: '10px',
    textAlign: 'center'
  },
  boutonPosition: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  consigne: {
    fontSize: '12px',
    color: '#666',
    marginTop: '8px'
  },
  carte: {
    height: '400px',
    width: '100%',
    borderRadius: '8px',
    zIndex: 1
  }
}

export default CarteChoixPosition