import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

const RecentrerCarte = ({ centre }) => {
  const map = useMap()
  useEffect(() => { if (centre) map.flyTo(centre, 15) }, [centre, map])
  return null
}

const CarteChoixPosition = ({ coordonneesRecherche, onPositionChange, signalementsExistants = [] }) => {
  const positionDefaut = [-21.4333, 47.0858]
  const [position, setPosition] = useState(positionDefaut)
  const [marqueur, setMarqueur] = useState(null)

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (coordonneesRecherche) {
      const nouvellePos = [coordonneesRecherche.lat, coordonneesRecherche.lng]
      setPosition(nouvellePos)
      setMarqueur(nouvellePos)
      onPositionChange(nouvellePos, coordonneesRecherche.nom)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordonneesRecherche])

  const obtenirPositionActuelle = () => {
    if (!navigator.geolocation) { alert("Votre navigateur ne supporte pas la géolocalisation"); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nouvellePos = [pos.coords.latitude, pos.coords.longitude]
        setPosition(nouvellePos)
        setMarqueur(nouvellePos)
        onPositionChange(nouvellePos, "Position actuelle")
      },
      () => { alert("Impossible d'obtenir votre position.") }
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
        <button
          onClick={obtenirPositionActuelle}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Utiliser ma position
        </button>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          Cliquez sur la carte pour déplacer le pin
        </p>
      </div>
      <div className="h-[350px] sm:h-[400px] rounded-xl overflow-hidden border border-slate-200 z-0">
        <MapContainer center={position} zoom={14} className="h-full w-full" scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecentrerCarte centre={position} />
          {marqueur && (
            <Marker
              position={marqueur}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const nouveau = [e.target.getLatLng().lat, e.target.getLatLng().lng]
                  setMarqueur(nouveau)
                  onPositionChange(nouveau, "Position choisie sur carte")
                },
              }}
            />
          )}
          {signalementsExistants.map((sig) => (
            <Marker
              key={sig._id}
              position={[sig.localisation.coordonnes[1], sig.localisation.coordonnes[0]]}
              icon={L.divIcon({
                className: "marker-existant",
                html: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'/><path stroke-linecap='round' stroke-linejoin='round' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'/></svg>",
                iconSize: [20, 20],
              })}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default CarteChoixPosition
