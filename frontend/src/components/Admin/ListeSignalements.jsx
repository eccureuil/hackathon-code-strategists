import { useState } from "react"
import ModaleDetail from "./ModaleDetail"
import CarteAdmin from "./CarteAdmin"
import StatutBadge from "../commun/StatutBadge"
import { TypeIcons } from "../commun/TypeIcons"
import EmptyState from "../ui/EmptyState"

const getTypeIcon = (type) => {
  return TypeIcons[type] || TypeIcons.autre
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

const ITEMS_PER_PAGE = 8

const ListeSignalements = ({ signalements, loading, onStatutChange }) => {
  const [selectedSig, setSelectedSig] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(signalements.length / ITEMS_PER_PAGE)
  const paginated = signalements.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const openModal = (sig) => {
    setSelectedSig(sig)
    setShowModal(true)
  }

  const handleSave = (id, statut, reponse, service) => {
    onStatutChange(id, statut, reponse, service)
    setShowModal(false)
    setSelectedSig(null)
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4 p-3">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-1/6" />
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-4 bg-slate-200 rounded w-20" />
            <div className="h-8 bg-slate-200 rounded w-20 ml-auto" />
          </div>
        ))}
      </div>
    )
  }

  if (signalements.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        title="Aucun signalement"
        description="Aucun signalement ne correspond aux filtres sélectionnés"
      />
    )
  }

  return (
    <div>
      {/* View toggle */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex gap-1">
          <button
            onClick={() => setShowMap(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${!showMap ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100"}`}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Liste
            </span>
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${showMap ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100"}`}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Carte
            </span>
          </button>
        </div>
        <span className="text-xs text-slate-400">{signalements.length} résultat(s)</span>
      </div>

      {showMap ? (
        <div className="h-[500px]">
          <CarteAdmin signalements={signalements} onMarkerClick={openModal} />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <Th>Type</Th>
                  <Th>Citoyen</Th>
                  <Th>Description</Th>
                  <Th>Statut</Th>
                  <Th>Date</Th>
                  <Th><svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" /></svg></Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((sig) => (
                  <tr key={sig._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-3 pl-4 sm:pl-6">
                      <span className="w-5 h-5 text-slate-500">{getTypeIcon(sig.typeProbleme)}</span>
                    </td>
                    <td className="p-3 text-sm font-medium text-slate-700">{sig.citoyenNom || "—"}</td>
                    <td className="p-3 text-sm text-slate-500 max-w-xs truncate">{sig.description}</td>
                    <td className="p-3"><StatutBadge statut={sig.statut} size="sm" /></td>
                    <td className="p-3 text-xs text-slate-400 whitespace-nowrap">{formatDate(sig.dateCreation)}</td>
                    <td className="p-3 text-sm text-slate-500 text-center">{sig.nbPlusUn || 0}</td>
                    <td className="p-3 pr-4 sm:pr-6 text-right">
                      <button
                        onClick={() => openModal(sig)}
                        className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        Détail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {paginated.map((sig) => (
              <div key={sig._id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 text-slate-500 shrink-0">{getTypeIcon(sig.typeProbleme)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-800">{sig.citoyenNom || "Anonyme"}</span>
                      <StatutBadge statut={sig.statut} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-1">{sig.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{formatDate(sig.dateCreation)}</span>
                      {sig.nbPlusUn > 0 && <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" /></svg> {sig.nbPlusUn}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(sig)}
                    className="shrink-0 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    Détail
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-200">
              <p className="text-xs text-slate-400">
                Page {page} / {totalPages}
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

      {showModal && selectedSig && (
        <ModaleDetail
          signalement={selectedSig}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setSelectedSig(null) }}
        />
      )}
    </div>
  )
}

function Th({ children, className = "" }) {
  return <th className={`text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-3 ${className}`}>{children}</th>
}

export default ListeSignalements
