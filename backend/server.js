import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import signalementRoutes from './routes/signalements.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Route test
app.get('/', (req, res) => {
  res.send('Backend fonctionne ✅')
})

// Routes API
app.use('/api/signalements', signalementRoutes)

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB')
    app.listen(PORT, () =>
      console.log(`🚀 Serveur sur http://localhost:${PORT}`)
    )
  })
  .catch(err => console.error('❌ MongoDB erreur:', err))