const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
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

// Health route for Render free tier keep-alive monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Traveloop backend is running"
  });
});

const PORT = process.env.PORT || 5050
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
