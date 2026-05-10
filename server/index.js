const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require('dotenv').config()

const app = express()

const checkDatabaseConnection = async () => {
  if (!process.env.DATABASE_URL) {
    console.log('DB connection error: DATABASE_URL is not set')
    return
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    const client = await pool.connect()
    console.log('Neon DB connected')
    client.release()
  } catch (err) {
    console.log('DB connection error:', err.message)
  } finally {
    await pool.end()
  }
}

checkDatabaseConnection()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({
    message: 'Backend is running successfully',
  })
})

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  })
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  })
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/trips', require('./routes/trips'))
app.use('/api/stops', require('./routes/stops'))
app.use('/api/activities', require('./routes/activities'))
app.use('/api/packing', require('./routes/packing'))
app.use('/api/notes', require('./routes/notes'))
app.use('/api/invoices', require('./routes/invoices'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/cities', require('./routes/cities'))

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found', message: 'Route not found' })
})

const PORT = process.env.PORT || 5050
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
