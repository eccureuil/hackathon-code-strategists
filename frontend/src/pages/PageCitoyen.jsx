import { useEffect } from 'react'
import FormulaireSignalement from '../components/citoyen/FormulaireSignalement'
import MesSignalements from '../components/citoyen/MesSignalements'

const PageCitoyen = () => {
  // Initialiser le nom citoyen par défaut si aucun nom n'est stocké
  useEffect(() => {
    if (!localStorage.getItem('citoyenNom')) {
      localStorage.setItem('citoyenNom', 'Citoyen Test')
    }
  }, [])

  const citoyenNom = localStorage.getItem('citoyenNom') || 'Citoyen Test'

  return (
    <div>
      {/* Optionnel : afficher le nom connecté */}
      <p style={{ textAlign: 'center', margin: '10px 0' }}>👤 Connecté en tant que : <strong>{citoyenNom}</strong></p>
      <FormulaireSignalement />
      <MesSignalements citoyenNom={citoyenNom} />
    </div>
  )
}

export default PageCitoyen