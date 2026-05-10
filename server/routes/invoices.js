const router = require('express').Router()
const auth = require('../middleware/auth')
const prisma = require('../prisma')

router.get('/:tripId', auth, async (req, res) => {
  const trip = await prisma.trip.findFirst({ where: { id: req.params.tripId, userId: req.user.id } })
  if (!trip) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })

  const invoices = await prisma.invoice.findMany({ where: { tripId: req.params.tripId } })
  res.json(invoices)
})

router.post('/', auth, async (req, res) => {
  const { tripId, travelers, items, total } = req.body
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.id } })

  if (!trip) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })

  const invoice = await prisma.invoice.create({
    data: {
      tripId,
      invoiceNo: `INV-${Date.now()}`,
      travelers,
      items,
      total: Number(total || 0),
    },
  })

  res.status(201).json(invoice)
})

module.exports = router
