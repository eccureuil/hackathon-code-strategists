import { useState } from "react"
import axios from "axios"
import StatutBadge from "../commun/StatutBadge"
import { TypeIcons } from "../commun/TypeIcons"
import Modal from "../ui/Modal"
import Button from "../ui/Button"

const getTypeLabel = (type) => {
  const types = { dechet: "Déchet / Ordure", route: "Route abîmée", eclairage: "Éclairage public", eau: "Eau / Canalisation", autre: "Autre problème" }
  return types[type] || type
}

const getTypeIcon = (type) => {
  return TypeIcons[type] || TypeIcons.autre
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

const ModaleDetail = ({ signalement, onSave, onClose }) => {
  const [statut, setStatut] = useState(signalement.statut)
  const [reponse, setReponse] = useState(signalement.reponseAdmin || "")
  const [service, setService] = useState(signalement.serviceAssigne || "")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await axios.put(`http://localhost:5050/api/signalements/${signalement._id}/statut`, {
        statut,
        reponseAdmin: reponse,
        serviceAssigne: service,
      })
      if (res.data.success) {
        onSave(signalement._id, statut, reponse, service)
      }
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={true} onClose={onClose} className="max-w-lg">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 text-slate-500">{getTypeIcon(signalement.typeProbleme)}</span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{getTypeLabel(signalement.typeProbleme)}</h2>
              <StatutBadge statut={statut} size="sm" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 text-xs">Citoyen</span>
                <p className="font-medium text-slate-800">{signalement.citoyenNom || "—"}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Date</span>
                <p className="font-medium text-slate-800">{formatDate(signalement.dateCreation)}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Soutiens</span>
                <p className="font-medium text-slate-800 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" /></svg> {signalement.nbPlusUn || 0}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Statut actuel</span>
                <p className="font-medium text-slate-800"><StatutBadge statut={signalement.statut} size="sm" /></p>
              </div>
            </div>
            <div>
              <span className="text-slate-500 text-xs">Localisation</span>
              <p className="font-medium text-slate-800">{signalement.localisation?.adresseTexte || "Position sur carte"}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs">Description</span>
              <p className="font-medium text-slate-800 mt-0.5">{signalement.description}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs">Solution proposée</span>
              <p className="font-medium text-slate-800 mt-0.5">{signalement.solutionProposee}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nouveau statut</label>
              <div className="flex gap-2">
                {[
                  { value: "en_attente", label: "En attente", color: "amber" },
                  { value: "en_cours", label: "En cours", color: "blue" },
                  { value: "resolu", label: "Résolu", color: "emerald" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatut(opt.value)}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      statut === opt.value
                        ? `ring-2 ring-${opt.color}-500 border-${opt.color}-500 bg-${opt.color}-50 text-${opt.color}-700`
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Service assigné</label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="ex: Voirie, Eau, Éclairage..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Réponse au citoyen</label>
              <textarea
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                placeholder="Réponse publique au citoyen..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={saving} className="flex-1 justify-center" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1 justify-center">
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default ModaleDetail
