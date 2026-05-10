const router = require('express').Router()
const auth = require('../middleware/auth')
const prisma = require('../prisma')

router.get('/', async (req, res) => {
  const { q, country, region } = req.query
  const where = {}
  if (q) where.name = { contains: q, mode: 'insensitive' }
  if (country) where.country = { contains: country, mode: 'insensitive' }
  if (region) where.region = { contains: region, mode: 'insensitive' }
  
  const cities = await prisma.city.findMany({ where, orderBy: { popularity: 'desc' } })
  res.json(cities)
})

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' })
  const city = await prisma.city.create({ data: req.body })
  res.status(201).json(city)
})

module.exports = router
