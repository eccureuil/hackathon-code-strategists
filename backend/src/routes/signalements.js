import express from 'express'
import multer from 'multer'
import Signalement from '../models/Signalement.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' }) // pour la photo

// POST /api/signalements - Créer un signalement
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { citoyenNom, typeProbleme, description, solutionProposee, lat, lng, adresse } = req.body

    const nouveau = new Signalement({
      citoyenNom,
      typeProbleme,
      description,
      solutionProposee,
      photo: req.file ? req.file.path : null,
      localisation: {
        coordonnes: [parseFloat(lng), parseFloat(lat)],
        adresseTexte: adresse || null
      }
    })

    await nouveau.save()
    res.status(201).json({ success: true, signalement: nouveau })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/signalements/mes-signalements?nom=XXX
router.get('/mes-signalements', async (req, res) => {
  try {
    const { nom } = req.query
    if (!nom) return res.status(400).json([])
    const signalements = await Signalement.find({ citoyenNom: nom }).sort({ dateCreation: -1 })
    res.json(signalements)
  } catch (error) {
    res.status(500).json([])
  }
})

// GET /api/signalements/verifier-doublon?lat=&lng=&rayon=50
router.get('/verifier-doublon', async (req, res) => {
  try {
    const { lat, lng, rayon = 50 } = req.query
    if (!lat || !lng) return res.json({ doublonTrouve: false, signalements: [] })

    const rayonMetres = parseInt(rayon)
    const signalements = await Signalement.find({
      'localisation.coordonnes': {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: rayonMetres
        }
      },
      statut: { $ne: 'resolu' } // on ignore les résolus
    }).limit(3)

    if (signalements.length > 0) {
      res.json({ doublonTrouve: true, signalements })
    } else {
      res.json({ doublonTrouve: false, signalements: [] })
    }
  } catch (error) {
    res.status(500).json({ doublonTrouve: false, error: error.message })
  }
})

// PUT /api/signalements/:id/plusun
router.put('/:id/plusun', async (req, res) => {
  try {
    const signalement = await Signalement.findById(req.params.id)
    if (!signalement) return res.status(404).json({ success: false })
    signalement.nbPlusUn += 1
    await signalement.save()
    res.json({ success: true, nouveauTotal: signalement.nbPlusUn })
  } catch (error) {
    res.status(500).json({ success: false })
  }
})

// PUT /api/signalements/:id/statut - Admin (à sécuriser plus tard)
router.put('/:id/statut', async (req, res) => {
  try {
    const { statut, reponseAdmin, serviceAssigne } = req.body
    const signalement = await Signalement.findById(req.params.id)
    if (!signalement) return res.status(404).json({ success: false })
    if (statut) signalement.statut = statut
    if (reponseAdmin) signalement.reponseAdmin = reponseAdmin
    if (serviceAssigne) signalement.serviceAssigne = serviceAssigne
    signalement.dateMajStatut = Date.now()
    await signalement.save()
    res.json({ success: true, signalement })
  } catch (error) {
    res.status(500).json({ success: false })
  }
})

// GET /api/signalements/tous - Admin (tous les signalements)
router.get('/tous', async (req, res) => {
  try {
    const signalements = await Signalement.find().sort({ dateCreation: -1 })
    res.json(signalements)
  } catch (error) {
    res.status(500).json([])
  }
})

export default router