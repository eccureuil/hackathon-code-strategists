import { useState, useRef } from "react"
import axios from "axios"
import RechercheLieu from "./RechercheLieu"
import CarteChoixPosition from "./CarteChoixPosition"
import VerificationDoublon from "./VerificationDoublon"
import Button from "../ui/Button"
import { TypeIcons } from "../Commun/TypeIcons"
import { useToast } from "../../hooks/useToast"

const typesProbleme = [
  { value: "dechet", label: "Déchet / Ordure", icon: TypeIcons.dechet },
  { value: "route", label: "Route abîmée", icon: TypeIcons.route },
  { value: "eclairage", label: "Éclairage public", icon: TypeIcons.eclairage },
  { value: "eau", label: "Eau / Canalisation", icon: TypeIcons.eau },
  { value: "autre", label: "Autre problème", icon: TypeIcons.autre },
]

const FormulaireSignalement = ({ onSuccess }) => {
  const addToast = useToast()
  const fileRef = useRef(null)

  const [formData, setFormData] = useState({
    citoyenNom: localStorage.getItem("citoyenNom") || "",
    typeProbleme: "dechet",
    description: "",
    solutionProposee: "",
    photo: null,
  })

  const [coordonnees, setCoordonnees] = useState(null)
  const [coordonneesRecherche, setCoordonneesRecherche] = useState(null)
  const [loading, setLoading] = useState(false)
  const [peutEnvoyer, setPeutEnvoyer] = useState(false)
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(null)
  const [etape, setEtape] = useState(1)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData((prev) => ({ ...prev, photo: file }))
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleLieuTrouve = (lieu) => {
    setCoordonneesRecherche(lieu)
  }

  const handlePositionChange = (coords, adresse) => {
    setCoordonnees({
      lat: coords[0],
      lng: coords[1],
      adresse: adresse || "Position sur carte",
    })
  }

  const validate = () => {
    const errs = {}
    if (!formData.description.trim()) errs.description = "La description est requise"
    if (formData.description.trim().length < 10) errs.description = "Minimum 10 caractères"
    if (!formData.solutionProposee.trim()) errs.solutionProposee = "Une solution est requise"
    if (!coordonnees) errs.localisation = "Veuillez placer un pin sur la carte"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const envoyerSignalement = async () => {
    if (!validate()) return

    if (!peutEnvoyer) {
      addToast("Veuillez vérifier les doublons avant d'envoyer", "warning")
      return
    }

    setLoading(true)

    const data = new FormData()
    data.append("citoyenNom", formData.citoyenNom)
    data.append("typeProbleme", formData.typeProbleme)
    data.append("description", formData.description)
    data.append("solutionProposee", formData.solutionProposee)
    data.append("lat", coordonnees.lat)
    data.append("lng", coordonnees.lng)
    data.append("adresse", coordonnees.adresse)
    if (formData.photo) {
      data.append("photo", formData.photo)
    }

    try {
      await axios.post("http://localhost:5050/api/signalements", data)
      addToast("Signalement envoyé avec succès !", "success")

      setFormData({
        citoyenNom: localStorage.getItem("citoyenNom") || "",
        typeProbleme: "dechet",
        description: "",
        solutionProposee: "",
        photo: null,
      })
      setCoordonnees(null)
      setCoordonneesRecherche(null)
      setPeutEnvoyer(false)
      setPreview(null)
      setErrors({})
      setEtape(1)
      if (fileRef.current) fileRef.current.value = ""

      if (onSuccess) setTimeout(onSuccess, 800)
    } catch (error) {
      addToast(error.response?.data?.message || "Erreur lors de l'envoi", "error")
    } finally {
      setLoading(false)
    }
  }

  const typeInfo = typesProbleme.find((t) => t.value === formData.typeProbleme)

  return (
    <div className="space-y-6">
      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                etape === step
                  ? "bg-emerald-600 text-white shadow-md"
                  : etape > step
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {etape > step ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </div>
            <span className={`text-xs hidden sm:inline ${etape >= step ? "text-slate-700 font-medium" : "text-slate-400"}`}>
              {step === 1 ? "Description" : step === 2 ? "Localisation" : "Vérification"}
            </span>
            {step < 3 && (
              <div className={`flex-1 h-0.5 mx-1 ${etape > step ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step navigation */}
      <div className="flex justify-between">
        {etape > 1 ? (
          <Button variant="ghost" size="sm" onClick={() => setEtape((e) => e - 1)}>
            ← Retour
          </Button>
        ) : <div />}
        {etape < 3 ? (
          <Button size="sm" onClick={() => setEtape((e) => e + 1)}>
            Suivant →
          </Button>
        ) : null}
      </div>

      {/* Step 1: Description */}
      {etape === 1 && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Type de problème *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {typesProbleme.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, typeProbleme: t.value }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    formData.typeProbleme === t.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                    <span className="w-5 h-5 text-slate-500 shrink-0">{t.icon}</span>
                    <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description du problème *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez précisément le problème que vous avez constaté..."
              rows={4}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 outline-none resize-none ${
                errors.description
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.description}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-400 text-right">{formData.description.length} caractères</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Solution proposée *</label>
            <textarea
              name="solutionProposee"
              value={formData.solutionProposee}
              onChange={handleChange}
              placeholder="Que suggérez-vous pour résoudre ce problème ?"
              rows={3}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 outline-none resize-none ${
                errors.solutionProposee
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              }`}
            />
            {errors.solutionProposee && (
              <p className="mt-1 text-xs text-red-600">{errors.solutionProposee}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Photo (optionnelle)</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-300 text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formData.photo ? "Changer la photo" : "Ajouter une photo"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {formData.photo && (
                <button
                  type="button"
                  onClick={() => { setFormData((p) => ({ ...p, photo: null })); setPreview(null); if (fileRef.current) fileRef.current.value = "" }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              )}
            </div>
            {preview && (
              <div className="mt-3 relative inline-block">
                <img src={preview} alt="Aperçu" className="h-32 w-32 object-cover rounded-lg border border-slate-200" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Location */}
      {etape === 2 && (
        <div className="space-y-4 animate-fade-in">
          <label className="block text-sm font-medium text-slate-700">Localisation du problème *</label>
          <RechercheLieu onLieuTrouve={handleLieuTrouve} />
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <CarteChoixPosition
              coordonneesRecherche={coordonneesRecherche}
              onPositionChange={handlePositionChange}
              signalementsExistants={[]}
            />
          </div>
          {coordonnees && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Position définie : {coordonnees.lat.toFixed(4)}, {coordonnees.lng.toFixed(4)}</span>
            </div>
          )}
          {errors.localisation && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors.localisation}
            </p>
          )}
        </div>
      )}

      {/* Step 3: Confirm */}
      {etape === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-semibold text-slate-700">Récapitulatif</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Type :</span>
                <p className="font-medium text-slate-800 flex items-center gap-1.5"><span className="w-4 h-4">{typeInfo?.icon}</span> {typeInfo?.label}</p>
              </div>
              <div>
                <span className="text-slate-500">Solution :</span>
                <p className="font-medium text-slate-800">{formData.solutionProposee.substring(0, 60)}...</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Description :</span>
                <p className="font-medium text-slate-800 text-sm">{formData.description}</p>
              </div>
              {coordonnees && (
                <div className="col-span-2">
                  <span className="text-slate-500">Position :</span>
                  <p className="font-medium text-slate-800 text-sm">{coordonnees.adresse}</p>
                </div>
              )}
              {preview && (
                <div className="col-span-2">
                  <span className="text-slate-500">Photo :</span>
                  <img src={preview} alt="Aperçu" className="mt-1 h-20 w-20 object-cover rounded-lg border" />
                </div>
              )}
            </div>
          </div>

          {coordonnees && (
            <VerificationDoublon
              coordonnees={coordonnees}
              typeProbleme={formData.typeProbleme}
              onDoublonTrouve={() => setPeutEnvoyer(false)}
              onAucunDoublon={() => setPeutEnvoyer(true)}
            />
          )}

          <div className="flex gap-3 pt-2">
            <Button loading={loading} onClick={envoyerSignalement} className="flex-1 justify-center" size="lg" disabled={!peutEnvoyer}>
              {loading ? "Envoi en cours..." : "Envoyer le signalement"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormulaireSignalement
