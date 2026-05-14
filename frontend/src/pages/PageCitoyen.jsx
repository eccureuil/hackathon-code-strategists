import { useState, useEffect } from "react"
import FormulaireSignalement from "../components/Citoyen/FormulaireSignalement"
import MesSignalements from "../components/Citoyen/MesSignalements"
import Navbar from "../components/layout/Navbar"

const tabs = [
  { id: "nouveau", label: "Nouveau signalement", icon: "plus" },
  { id: "liste", label: "Mes signalements", icon: "list" },
]

const PageCitoyen = () => {
  const [activeTab, setActiveTab] = useState("nouveau")
  const [citoyenNom, setCitoyenNom] = useState("")

  useEffect(() => {
    const nom = localStorage.getItem("citoyenNom") || "Citoyen Test"
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCitoyenNom(nom)
    if (!localStorage.getItem("citoyenNom")) {
      localStorage.setItem("citoyenNom", "Citoyen Test")
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Signalement citoyen</h1>
              <p className="text-emerald-100 text-sm mt-0.5">
                Connecté en tant que <span className="font-semibold">{citoyenNom}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "text-emerald-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.id === "nouveau" ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "nouveau" ? (
              <FormulaireSignalement onSuccess={() => setActiveTab("liste")} />
            ) : (
              <MesSignalements citoyenNom={citoyenNom} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageCitoyen
