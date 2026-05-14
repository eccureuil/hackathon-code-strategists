import { useState, useEffect } from "react"
import axios from "axios"

const getTypeLabel = (type) => {
  const types = { dechet: "Déchet", route: "Route", eclairage: "Éclairage", eau: "Eau", autre: "Autre" }
  return types[type] || type
}

const getStatutLabel = (statut) => {
  const statuts = { en_attente: "En attente", en_cours: "En cours", resolu: "Résolu" }
  return statuts[statut] || statut
}

const VerificationDoublon = ({ coordonnees, onDoublonTrouve, onAucunDoublon }) => {
  const [verificationEnCours, setVerificationEnCours] = useState(false)
  const [doublonTrouve, setDoublonTrouve] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!coordonnees) return
    const verifierDoublon = async () => {
      setVerificationEnCours(true)
      setDoublonTrouve(null)
      setMessage("")
      try {
        const response = await axios.get(
          `http://localhost:5050/api/signalements/verifier-doublon?lat=${coordonnees.lat}&lng=${coordonnees.lng}&rayon=50`
        )
        if (response.data.doublonTrouve && response.data.signalements.length > 0) {
          const existing = response.data.signalements[0]
          setDoublonTrouve(existing)
          setMessage("Un problème similaire existe déjà à moins de 50m !")
          if (onDoublonTrouve) onDoublonTrouve(existing)
        } else {
          setMessage("Aucun doublon trouvé")
          if (onAucunDoublon) onAucunDoublon()
        }
      } catch {
        setMessage("Erreur lors de la vérification")
      } finally {
        setVerificationEnCours(false)
      }
    }
    const timer = setTimeout(verifierDoublon, 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordonnees])

  const ajouterPlusUn = async () => {
    if (!doublonTrouve) return
    try {
      const response = await axios.put(`http://localhost:5050/api/signalements/${doublonTrouve._id}/plusun`)
      if (response.data.success) {
        setMessage(`Merci ! +1 ajouté. ${response.data.nouveauTotal} personne(s) soutiennent ce signalement.`)
        setTimeout(() => { setDoublonTrouve(null) }, 3000)
        if (onAucunDoublon) onAucunDoublon()
      }
    } catch {
      setMessage("Erreur lors de l'ajout du +1")
    }
  }

  const ignorerDoublon = () => {
    setDoublonTrouve(null)
    setMessage("")
    if (onAucunDoublon) onAucunDoublon()
  }

  if (!coordonnees) return null

  return (
    <div className="space-y-3">
      {verificationEnCours && (
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-lg px-4 py-3">
          <svg className="animate-spin h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>Vérification des signalements à proximité...</span>
        </div>
      )}

      {message && !doublonTrouve && !verificationEnCours && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="flex items-center gap-1"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {message}</span>
        </div>
      )}

      {doublonTrouve && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-3">
            <span className="shrink-0"><svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></span>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-amber-800">Un signalement similaire existe déjà !</p>
              <div className="text-xs text-amber-700 space-y-1">
                <p><strong>Type :</strong> {getTypeLabel(doublonTrouve.typeProbleme)}</p>
                <p><strong>Description :</strong> {doublonTrouve.description.substring(0, 100)}...</p>
                <p><strong>Statut :</strong> {getStatutLabel(doublonTrouve.statut)}</p>
                <p className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" /></svg><strong> Déjà {doublonTrouve.nbPlusUn || 0} personne(s)</strong></p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={ajouterPlusUn}
                  className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" /></svg>
                  Ajouter mon +1
                </button>
                <button
                  onClick={ignorerDoublon}
                  className="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Créer quand même
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerificationDoublon
