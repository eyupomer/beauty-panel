// TODO: Uygulamadaki görselleri Cloudflare R2'ye yükleme entegrasyonu eklenecek.

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import { errorHandler } from './middlewares/error.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', routes)

// Error Handler
app.use(errorHandler)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
