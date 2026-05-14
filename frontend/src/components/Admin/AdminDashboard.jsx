import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import Filtres from "./Filtres"
import ListeSignalements from "./ListeSignalements"
import StatsCard from "../ui/StatsCard"
import Navbar from "../layout/Navbar"
import { useToast } from "../../hooks/useToast"

const AdminDashboard = () => {
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtres, setFiltres] = useState({ type: "", statut: "", quartier: "", search: "" })
  const addToast = useToast()

  const chargerSignalements = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/signalements/tous")
      setSignalements(res.data)
    } catch {
      addToast("Erreur lors du chargement des signalements", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    chargerSignalements()
  }, [])

  const filtered = useMemo(
    () =>
      signalements.filter((sig) => {
        if (filtres.type && sig.typeProbleme !== filtres.type) return false
        if (filtres.statut && sig.statut !== filtres.statut) return false
        if (filtres.quartier) {
          const add = sig.localisation?.adresseTexte || ""
          if (!add.toLowerCase().includes(filtres.quartier.toLowerCase())) return false
        }
        if (filtres.search) {
          const q = filtres.search.toLowerCase()
          const inDesc = sig.description?.toLowerCase().includes(q)
          const inSol = sig.solutionProposee?.toLowerCase().includes(q)
          const inNom = sig.citoyenNom?.toLowerCase().includes(q)
          const inAdresse = sig.localisation?.adresseTexte?.toLowerCase().includes(q)
          if (!inDesc && !inSol && !inNom && !inAdresse) return false
        }
        return true
      }),
    [signalements, filtres]
  )

  const stats = useMemo(() => {
    const total = signalements.length
    const enAttente = signalements.filter((s) => s.statut === "en_attente").length
    const enCours = signalements.filter((s) => s.statut === "en_cours").length
    const resolu = signalements.filter((s) => s.statut === "resolu").length
    const categories = {}
    signalements.forEach((s) => {
      categories[s.typeProbleme] = (categories[s.typeProbleme] || 0) + 1
    })
    const topCategorie = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]
    return { total, enAttente, enCours, resolu, categories, topCategorie }
  }, [signalements])

  const handleStatutChange = async (id, statut, reponse, service) => {
    try {
      await axios.put(`http://localhost:5050/api/signalements/${id}/statut`, {
        statut,
        reponseAdmin: reponse,
        serviceAssigne: service,
      })
      addToast("Statut mis à jour avec succès", "success")
      chargerSignalements()
    } catch {
      addToast("Erreur lors de la mise à jour", "error")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Administration</h1>
              <p className="text-slate-300 text-sm mt-0.5">Gestion des signalements citoyens</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 space-y-6 pb-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total"
            value={stats.total}
            color="emerald"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            subtitle={stats.topCategorie ? `Principal : ${stats.topCategorie[0]} (${stats.topCategorie[1]})` : ""}
          />
          <StatsCard
            label="En attente"
            value={stats.enAttente}
            color="amber"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            label="En cours"
            value={stats.enCours}
            color="blue"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <StatsCard
            label="Résolus"
            value={stats.resolu}
            color="emerald"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            subtitle={stats.total ? `${Math.round((stats.resolu / stats.total) * 100)}% complété` : ""}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <Filtres filtres={filtres} setFiltres={setFiltres} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-800">Signalements</h2>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {filtered.length} sur {signalements.length}
              </span>
            </div>
            <button
              onClick={chargerSignalements}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Actualiser"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <ListeSignalements
            signalements={filtered}
            loading={loading}
            onStatutChange={handleStatutChange}
            onRefresh={chargerSignalements}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
