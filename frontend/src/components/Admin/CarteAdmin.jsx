import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { TypeIcons } from "../commun/TypeIcons"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

const getColor = (statut) => {
  switch (statut) {
    case "en_attente": return "#f59e0b"
    case "en_cours": return "#3b82f6"
    case "resolu": return "#10b981"
    default: return "#6b7280"
  }
}

const getTypeIcon = (type) => {
  return TypeIcons[type] || TypeIcons.autre
}

const CarteAdmin = ({ signalements, onMarkerClick }) => {
  const positionDefaut = [-21.4333, 47.0858]

  return (
    <MapContainer center={positionDefaut} zoom={13} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {signalements.map((sig) => {
        if (!sig.localisation?.coordonnes || sig.localisation.coordonnes.length < 2) return null
        return (
          <Marker
            key={sig._id}
            position={[sig.localisation.coordonnes[1], sig.localisation.coordonnes[0]]}
            eventHandlers={{ click: () => onMarkerClick(sig) }}
          >
            <Popup>
              <div className="text-sm min-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 text-slate-500 shrink-0">{getTypeIcon(sig.typeProbleme)}</span>
                  <strong className="text-slate-800">{sig.citoyenNom || "Anonyme"}</strong>
                </div>
                <p className="text-xs text-slate-500 mb-1.5">{sig.description.substring(0, 80)}...</p>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${getColor(sig.statut)}20`, color: getColor(sig.statut) }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getColor(sig.statut) }} />
                    {sig.statut}
                  </span>
                  <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" /></svg> {sig.nbPlusUn}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default CarteAdmin
