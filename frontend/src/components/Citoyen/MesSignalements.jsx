import { useState, useEffect } from "react"
import axios from "axios"
import StatutBadge from "../commun/StatutBadge"
import { TypeIcons } from "../commun/TypeIcons"
import EmptyState from "../ui/EmptyState"
import { useDebounce } from "../../hooks/useDebounce"

const getTypeLabel = (type) => {
  const types = { dechet: "Déchet", route: "Route", eclairage: "Éclairage", eau: "Eau", autre: "Autre" }
  return types[type] || type
}

const getTypeIcon = (type) => {
  return TypeIcons[type] || TypeIcons.autre
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

const ITEMS_PER_PAGE = 6

const MesSignalements = ({ citoyenNom }) => {
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filtreStatut, setFiltreStatut] = useState("")
  const [filtreType, setFiltreType] = useState("")
  const [tri, setTri] = useState("date-desc")
  const [page, setPage] = useState(1)
  const [derniereMaj, setDerniereMaj] = useState(null)
  const debouncedSearch = useDebounce(search, 300)

  const chargerSignalements = async () => {
    if (!citoyenNom) return
    try {
      const response = await axios.get(
        `http://localhost:5050/api/signalements/mes-signalements?nom=${encodeURIComponent(citoyenNom)}`
      )
      setSignalements(response.data)
      setDerniereMaj(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }))
    } catch (error) {
      console.error("Erreur chargement:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    chargerSignalements()
    const interval = setInterval(chargerSignalements, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citoyenNom])

  const filtered = signalements
    .filter((sig) => {
      if (filtreStatut && sig.statut !== filtreStatut) return false
      if (filtreType && sig.typeProbleme !== filtreType) return false
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase()
        const matchesDesc = sig.description.toLowerCase().includes(q)
        const matchesSol = sig.solutionProposee?.toLowerCase().includes(q)
        const matchesAdresse = sig.localisation?.adresseTexte?.toLowerCase().includes(q)
        const matchesType = getTypeLabel(sig.typeProbleme).toLowerCase().includes(q)
        if (!matchesDesc && !matchesSol && !matchesAdresse && !matchesType) return false
      }
      return true
    })
    .sort((a, b) => {
      switch (tri) {
        case "date-asc": return new Date(a.dateCreation) - new Date(b.dateCreation)
        case "date-desc": return new Date(b.dateCreation) - new Date(a.dateCreation)
        case "plusun": return (b.nbPlusUn || 0) - (a.nbPlusUn || 0)
        default: return 0
      }
    })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
  }, [debouncedSearch, filtreStatut, filtreType, tri])

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher dans mes signalements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
          />
        </div>
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="en_cours">En cours</option>
          <option value="resolu">Résolu</option>
        </select>
        <select
          value={filtreType}
          onChange={(e) => setFiltreType(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
        >
          <option value="">Tous les types</option>
          <option value="dechet">Déchet</option>
          <option value="route">Route</option>
          <option value="eclairage">Éclairage</option>
          <option value="eau">Eau</option>
          <option value="autre">Autre</option>
        </select>
        <select
          value={tri}
          onChange={(e) => setTri(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
        >
          <option value="date-desc">Plus récent</option>
          <option value="date-asc">Plus ancien</option>
          <option value="plusun">Popularité</option>
        </select>
      </div>

      {derniereMaj && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Dernière mise à jour : {derniereMaj}</span>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="Aucun signalement"
          description={search || filtreStatut || filtreType ? "Aucun résultat ne correspond à vos filtres" : "Vous n'avez pas encore de signalement"}
        />
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map((sig) => (
              <div
                key={sig._id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500">{getTypeIcon(sig.typeProbleme)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-sm font-semibold text-slate-800">
                        {getTypeLabel(sig.typeProbleme)}
                      </span>
                      <StatutBadge statut={sig.statut} size="sm" />
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">{sig.description}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(sig.dateCreation)}
                      </span>
                      {sig.localisation?.adresseTexte && (
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{sig.localisation.adresseTexte}</span>
                        </span>
                      )}
                      {sig.nbPlusUn > 0 && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                          </svg>
                          {sig.nbPlusUn}
                        </span>
                      )}
                    </div>

                    {sig.reponseAdmin && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          Réponse de l'admin :
                        </p>
                        <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-2">{sig.reponseAdmin}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400">
                Page {page} sur {totalPages} ({filtered.length} signalements)
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      page === i + 1
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MesSignalements
