import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Icône par défaut corrigée
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const CarteAdmin = ({ signalements, onMarkerClick }) => {
  const positionDefaut = [-21.4333, 47.0858] // Fianarantsoa

  const getColor = (statut) => {
    switch(statut) {
      case 'en_attente': return 'orange'
      case 'en_cours': return 'blue'
      case 'resolu': return 'green'
      default: return 'gray'
    }
  }

  return (
    <MapContainer center={positionDefaut} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {signalements.map(sig => (
        <Marker
          key={sig._id}
          position={[sig.localisation.coordonnes[1], sig.localisation.coordonnes[0]]}
          eventHandlers={{ click: () => onMarkerClick(sig) }}
        >
          <Popup>
            <strong>{sig.typeProbleme}</strong><br />
            {sig.description.substring(0, 80)}...<br />
            Statut : {sig.statut}<br />
            👍 {sig.nbPlusUn}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default CarteAdmin