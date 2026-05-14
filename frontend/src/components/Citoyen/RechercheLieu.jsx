import { useState } from "react"
import axios from "axios"

const RechercheLieu = ({ onLieuTrouve }) => {
  const [recherche, setRecherche] = useState("")
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState("")

  const rechercherLieu = async () => {
    if (!recherche.trim()) { setErreur("Veuillez entrer un quartier ou une rue"); return }
    setLoading(true)
    setErreur("")
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(recherche)}, Fianarantsoa, Madagascar&format=json&limit=5`
      )
      if (response.data && response.data.length > 0) {
        const lieu = response.data[0]
        onLieuTrouve({ lat: parseFloat(lieu.lat), lng: parseFloat(lieu.lon), nom: lieu.display_name })
        setErreur("")
      } else {
        setErreur("Aucun lieu trouvé à Fianarantsoa")
      }
    } catch {
      setErreur("Erreur lors de la recherche")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Rechercher un quartier ou une rue..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && rechercherLieu()}
          className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
        />
        <button
          onClick={rechercherLieu}
          disabled={loading}
          className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : "Rechercher"}
        </button>
      </div>
      {erreur && (
        <p className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-1.5">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>{erreur}</span>
        </p>
      )}
      <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
        Exemples : "Manjakaray", "Route de l'aéroport", "Ambalavao"
      </p>
    </div>
  )
}

export default RechercheLieu
