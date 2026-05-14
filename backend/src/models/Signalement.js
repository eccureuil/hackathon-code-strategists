import mongoose from 'mongoose'

const signalementSchema = new mongoose.Schema({
  citoyenNom: {
    type: String,
    required: true
  },
  typeProbleme: {
    type: String,
    enum: ['dechet', 'route', 'eclairage', 'eau', 'autre'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  solutionProposee: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: null
  },
  localisation: {
    coordonnes: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    adresseTexte: {
      type: String,
      default: null
    }
  },
  statut: {
    type: String,
    enum: ['en_attente', 'en_cours', 'resolu'],
    default: 'en_attente'
  },
  nbPlusUn: {
    type: Number,
    default: 0
  },
  reponseAdmin: {
    type: String,
    default: null
  },
  serviceAssigne: {
    type: String,
    default: null
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateMajStatut: {
    type: Date,
    default: Date.now
  }
})

// Index géospatial pour recherche par proximité
signalementSchema.index({ 'localisation.coordonnes': '2dsphere' })

export default mongoose.model('Signalement', signalementSchema)